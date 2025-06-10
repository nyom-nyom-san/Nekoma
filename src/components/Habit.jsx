import { useEffect, useState, useCallback } from 'react'
import { db, auth } from '../firebase'
import { getAuth } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import "../Habit.css"
export default function Habit() {

    const [habitName, setHabitName] = useState("");
    const [habits, setHabits] = useState([]);
    const [habitDays, setHabitDays] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editHName, setEditHName] = useState("");
    const [editId, setEditId] = useState(null);

    // Save habitDays to Firestore
    async function saveHabitDaysToFirestore(updatedHabitDays) {
        const user = auth.currentUser;
        if (!user) {
            console.error("No user is signed in");
            return;
        }

        const docRef = doc(db, "users", user.uid, "habitDays", "current");

        const dataToSave = { days: updatedHabitDays }

        try {
            await setDoc(docRef, dataToSave)
            console.log("Habit days saved successfully.")
            console.log("Data saved:", dataToSave);
        } catch (error) {
            console.error("Error saving habit days", error)
        }
    }

    //Random generated id
    const generateId = () => crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).substr(2);

    //Reset habits 
    const resetHabits = useCallback(async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error("No user is signed in");
            return;
        }

        const defaultHabits = [
            { id: generateId(), title: "Exercise", completed: false },
            { id: generateId(), title: "Reading", completed: false },
            { id: generateId(), title: "8 hours sleep", completed: false },
        ];


        const newDaysArray = [{
            date: new Date().toISOString().split("T")[0],
            habits: defaultHabits.map(h => ({ ...h }))
        }];

        setHabitDays(newDaysArray);
        setHabits(defaultHabits);

        const dataToSave = {
            days: newDaysArray,
            timestamp: new Date()
        };

        // Save to Firestore 
        try {
            await setDoc(doc(db, "users", user.uid, "habitDays", "current"), dataToSave);
            console.log("Habit reset and saved successfully");
        } catch (error) {
            console.error("Error saving habit days during reset:", error);
        }
    }, []);

    // Fetch data
    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribeAuth = authInstance.onAuthStateChanged(user => {
            if (user) {
                console.log("user is signed in, setting up listener");
                const docRef = doc(db, "users", user.uid, "habitDays", "current");

                const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
                    let daysArray = [];

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log("Fetched data:", data);

                        if (data && data.days) {
                            if (Array.isArray(data.days)) {
                                daysArray = data.days;
                            } else if (typeof data.days === 'object' && data.days !== null) {
                                console.warn("Firestore 'days' field is an object, converting to array");
                                daysArray = Object.values(data.days);
                            }
                        }

                    } else {
                        console.log("No 'current' document found. setting empty state");
                    }

                    setHabitDays(daysArray);

                }, (error) => {
                    console.error("Error fetching habit days", error);
                    setHabitDays([]);
                });

                return () => unsubscribeSnapshot();

            } else {
                console.error("User is not signed in. Clearing state.");
                setHabitDays([]);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // Add new day with the same habits
    async function addToday() {
        const user = auth.currentUser;
        if (!user) {
            console.error("No user is signed in");
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        const todayExist = Array.isArray(habitDays) && habitDays.some(day => day.date === today)
        if (todayExist) {
            console.log("habit exist")
            return
        }
        if (habits.length === 0) {
            console.log("no habits defined to add for today.")
            return
        }

        const newDay = { date: today, habits: habits.map(habit => ({ ...habit, completed: false })) }

        setHabitDays(prevDays => {
            const currentDaysArray = Array.isArray(prevDays) ? prevDays : []
            const updatedDaysArray = [...currentDaysArray, newDay]

            updatedDaysArray.sort((a, b) => new Date(a.date) - new Date(b.date))

            saveHabitDaysToFirestore(updatedDaysArray)
            return updatedDaysArray
        })
    }

    // Add new habit
    async function addHabits(habitName) {
        const user = auth.currentUser;
        if (!user) {
            console.error("No user is signed in");
            return;
        }

        if (!habitName.trim()) return;

        if (habits.some(habit => habit.title.toLowerCase() === habitName.toLowerCase())) {
            alert("Habit already exists");
            return;
        }

        const newHabit = { id: generateId(), title: habitName, completed: false };

        setHabits(prevHabits => {
            const updatedHabits = [...prevHabits, newHabit];
            return updatedHabits;
        });

        // Update all habitDays with the new habit
        setHabitDays(prevDays => {
            const today = new Date().toISOString().split('T')[0];
            const updatedDays = prevDays.map(day => {
                if (new Date(day.date) >= new Date(today)) {
                    return {
                        ...day,
                        habits: [...day.habits, { ...newHabit }]
                    };
                }
                return day;
            });
            saveHabitDaysToFirestore(updatedDays);
            return updatedDays;
        });

        setHabitName("");
    }

    // Toggle habit completion
    function toggleHabit(dayIndex, habitId) {
        setHabitDays(prevDaysArray => {
            const updatedDaysArray = prevDaysArray.map((day, index) => {
                if (index === dayIndex) {
                    return {
                        ...day,
                        habits: day.habits.map(habit =>
                            habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
                        )
                    }
                }
                return day
            })
            saveHabitDaysToFirestore(updatedDaysArray)
            return updatedDaysArray
        })
    }

    // Delete habit
    async function deleteHabit(id) {
        const user = auth.currentUser;
        if (!user) {
            console.error("No user is signed in");
            return;
        }

        setHabits(prev => prev.filter(h => h.id !== id))

        setHabitDays(prev => {
            const updated = prev.map(day => ({
                ...day,
                habits: day.habits.filter(h => h.id !== id)
            }));
            saveHabitDaysToFirestore(updated);
            return updated;
        });
    }

    // Confirm delete
    function confirmDelete(id) {
        const isConfirmed = window.confirm("Are you sure to delete this habit?");
        if (isConfirmed) {
            deleteHabit(id);
        }
    }

    // Open modal
    function openModal(habit) {
        setEditHName(habit.title);
        setEditId(habit.id);
        setShowModal(true);
    }

    // Save edited habit
    async function saveEditedHabit() {
        const user = auth.currentUser;
        if (!user) {
            console.error("No user is signed in");
            return;
        }

        setHabits(prev => {
            return prev.map(h =>
                h.id === editId ? { ...h, title: editHName } : h)
        });

        setHabitDays(prev => {
            const updated = prev.map(day => ({
                ...day,
                habits: day.habits.map(h =>
                    h.id === editId ? { ...h, title: editHName } : h
                )
            }));
            saveHabitDaysToFirestore(updated);
            return updated;
        });

        setShowModal(false);
    }

    // Progress bar
    const formatDate = (date) =>
        new Date(date).toISOString().split('T')[0];

    const getTodayHabits = (habitDays) => {
        if (!Array.isArray(habitDays)) return [];

        const todayDateStr = formatDate(new Date());
        return habitDays.find(day =>
            formatDate(day.date) === todayDateStr
        )?.habits || [];
    };

    const todayHabits = getTodayHabits(habitDays);
    const completedCount = todayHabits.filter(h => h.completed).length;
    const totalCount = todayHabits.length;
    const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);



    return (
        <div className="main-content habit-tracker">
            <h2 className="page-title">Daily Habits</h2>

            {/* --- Controls --- */}
            <div className="habit-controls">
                <input
                    type="text"
                    placeholder="Enter a habit name"
                    value={habitName}
                    onChange={e => setHabitName(e.target.value)}
                    className="habit-input"
                />
                <button onClick={() => addHabits(habitName)} className="habit-btn">Add Habit</button>
                <button onClick={resetHabits} className="habit-btn">Reset to Default</button>
                <button onClick={() => setShowModal(true)} className="habit-btn">Manage Habits</button>
                <button onClick={addToday} className="habit-btn add-today-btn">Add Today</button>
            </div>

            {/* --- Habits List --- */}
            <ul className="habit-days-list">
                {habitDays.map((day, dayIndex) => (
                    <div key={day.date} className="habit-day-card">
                        <h3 className="habit-date">
                            {new Date(day.date).toLocaleDateString('en-US', { /* ... date options ... */ })}
                        </h3>
                        <ul className="habits-in-day">
                            {day.habits.map(habit => (
                                <li key={habit.id} className="habit-item">
                                    <input type="checkbox" checked={habit.completed} onChange={() => toggleHabit(dayIndex, habit.id)} />
                                    <span className="habit-title">{habit.title}</span>
                                    <button onClick={() => openModal(habit)} className="habit-btn edit-btn">Edit</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </ul>

            {/* --- Empty Habit Message --- */}
            {habits.length === 0 && (
                <p className="empty-habits-message">No habits yet. Add your first habit above!</p>
            )}

            {/* --- Manage Habits Modal --- */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Manage Habits</h2>
                        <input
                            autoFocus
                            type="text"
                            value={editHName}
                            onChange={(e) => setEditHName(e.target.value)}
                            className="habit-input"
                        />
                        <button onClick={saveEditedHabit} className="habit-btn">Save Changes</button>

                        <ul className="modal-habit-list">
                            {habits.map(habit => (
                                <li key={habit.id} className="modal-habit-item">
                                    <span className="modal-habit-title">{habit.title}</span>
                                    <button className="habit-btn delete-btn" onClick={() => confirmDelete(habit.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                        <button className="habit-btn close-btn" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* --- Progress Bar --- */}
            <div className="progress-container">
                <div
                    className="progress-bar"
                    style={{
                        width: `${progressPercentage}%`,
                        backgroundColor: progressPercentage >= 80 ? "green" : progressPercentage >= 50 ? "orange" : "red"
                    }}
                ></div>
            </div>
            <p className="progress-text">
                {completedCount}/{totalCount} Habits Completed ({progressPercentage}%)
            </p>
        </div>
    );
}


