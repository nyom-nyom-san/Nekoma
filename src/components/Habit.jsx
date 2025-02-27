import { useEffect, useState } from 'react'
// import { ProgressBar } from 'react-bootstrap'

export default function Habit() {

    const [habitName, setHabitName] = useState("")
    const [habits, setHabits] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editHName, setEditHName] = useState("")
    const [editId, setEditId] = useState(null)
    const [habitDays, setHabitDays] = useState([
        { date: new Date().toISOString().split('T')[0], habits: [] }
    ])

    //Add new Day with the same habits...
    function addToday() {
        const today = new Date().toISOString().split('T')[0];

        if (habitDays.some(day => day.date === today)) return;

        // Copy the latest habits
        const newDay = { date: today, habits: habits.map(habit => ({ ...habit, completed: false })) };

        setHabitDays(prevDays => {
            const updatedDays = [...prevDays, newDay];
            localStorage.setItem("habitDays", JSON.stringify(updatedDays));
            return updatedDays;
        });
    }

    useEffect(() => {
        const storedHabits = JSON.parse(localStorage.getItem("habits"));
        if (Array.isArray(storedHabits) && storedHabits.length > 0) {
            setHabits(storedHabits);
        } else {
            resetHabits();
        }

        const storedHabitDays = JSON.parse(localStorage.getItem("habitDays"));
        if (Array.isArray(storedHabitDays) && storedHabitDays.length > 0) {
            setHabitDays(storedHabitDays);
        } else {
            setHabitDays([{
                date: new Date().toISOString().split('T')[0],
                habits: []
            }])
        }
    }, []);

    //Local Storage Sync
    useEffect(() => {
        localStorage.setItem("habitDays", JSON.stringify(habitDays));
    }, [habitDays]);

    useEffect(() => {
        localStorage.setItem("habits", JSON.stringify(habits));
    }, [habits]);

    //Add new Habit
    function addHabits(habitName) {
        if (!habitName.trim()) return;

        if (habits.some(habit => habit.title.toLowerCase() === habitName.toLowerCase())) {
            alert("The habit has already existed.");
            return;
        }

        const newHabit = {
            id: generateId(),
            title: habitName,
            completed: false
        };

        setHabits(prevHabits => {
            const updatedHabits = [...prevHabits, newHabit];
            localStorage.setItem("habits", JSON.stringify(updatedHabits));

            // Update all habitDays with the new habit
            setHabitDays(prevDays => {
                const today = new Date().toISOString().split('T')[0]
                return prevDays.map(day => {
                    if (new Date(day.date) >= new Date(today)) {
                        return {
                            ...day,
                            habits: [...day.habits, { ...newHabit }]
                        }
                    }
                    return day
                })
            });

            return updatedHabits;
        });

        setHabitName("");
    }

    function toggleHabit(dayIndex, habitId) {
        setHabitDays(prevDays =>
            prevDays.map((day, index) =>
                index === dayIndex ? {
                    ...day,
                    habits: day.habits.map(habit =>
                        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
                    )
                } : day
            )
        );
    }

    //reset Habits
    const generateId = () => crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).substr(2);
    function resetHabits() {
        const defaultHabits = [
            { id: generateId(), title: "Exercise", completed: false },
            { id: generateId(), title: "Reading", completed: false },
            { id: generateId(), title: "8 hours sleep", completed: false },
        ]
        setHabits(defaultHabits)
        setHabitDays([{
            date: new Date().toISOString().split("T")[0],
            habits: defaultHabits.map(h => ({ ...h }))
        }])

        localStorage.setItem("habits", JSON.stringify(defaultHabits))
        localStorage.setItem("habitDays", JSON.stringify([{
            date: new Date().toISOString().split("T")[0],
            habits: defaultHabits
        }]))
    }

    //Delete Habit
    function deleteHabit(id) {
        setHabits(prev => {
            const updated = prev.filter(h => h.id !== id);
            localStorage.setItem("habits", JSON.stringify(updated));
            return updated;
        });

        setHabitDays(prev => {
            const updated = prev.map(day => ({
                ...day,
                habits: day.habits.filter(h => h.id !== id)
            }));
            localStorage.setItem("habitDays", JSON.stringify(updated));
            return updated;
        });
    }
    //Confirm Delete

    function confirmDelete(id) {
        const isConfirmed = window.confirm("Are you sure to delete this habit?")
        if (isConfirmed) {
            deleteHabit(id)
        }
    }


    //Opening Modal
    function openModal(habit) {
        setEditHName(habit.title)
        setEditId(habit.id)
        setShowModal(true)
    }

    function saveEditedHabit() {
        setHabits(prev => prev.map(h =>
            h.id === editId ? { ...h, title: editHName } : h
        ));

        setHabitDays(prev => prev.map(day => ({
            ...day,
            habits: day.habits.map(h =>
                h.id === editId ? { ...h, title: editHName } : h
            )
        })));
    }

    //Progress Bar
    const todayHabits = habitDays.find(day =>
        day.date === new Date().toISOString().split('T')[0]
    )?.habits || []
    const completedCount = todayHabits.filter(h => h.completed).length
    const totalCount = todayHabits.length
    const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

    return (
        <div style={{ backgroundColor: "#c5e8e8" }}>
            <h2 style={{ textAlign: "center" }}>Daily Habits</h2>


            {/* Buttons */}
            <input type="text"
                placeholder="Enter a habit name"
                value={habitName}
                onChange={e => setHabitName(e.target.value)}
                style={{ marginLeft: "10px", border: '#093330', backgroundColor: "#093330", color: "#c5e8e8", borderRadius: "10px", padding: "9px" }}
            />
            <button onClick={() => addHabits(habitName)}
                style={{ marginLeft: "10px", border: '#093330', backgroundColor: "#093330", color: "#c5e8e8", borderRadius: "10px", padding: "9px" }}>Add Habit</button>

            <button onClick={resetHabits}
                style={{ marginLeft: "10px", border: '#093330', backgroundColor: "#093330", color: "#c5e8e8", borderRadius: "10px", padding: "9px" }}>Reset to Default</button>

            <button onClick={() => setShowModal(true)}
                style={{ marginLeft: "10px", border: '#093330', backgroundColor: "#093330", color: "#c5e8e8", borderRadius: "10px", padding: "9px" }}>Manage Habits</button>

            <button onClick={addToday} style={{ marginTop: "10px", padding: "10px", backgroundColor: "#093330", color: "white", borderRadius: "10px", marginLeft: "10px", border: "none" }}>
                Add Today
            </button>

            {/* Habits List */}
            <ul>
                {habitDays.map((day, dayIndex) => (
                    <div key={day.date} style={{
                        border: "1px solid #093330", borderRadius: "10px", padding: "15px", marginBottom: "20px", maxWidth: "400px", marginTop: "10px",
                    }}>
                        <h3 style={{ marginBottom: "10px" }}>
                            {new Date(day.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h3>
                        <ul>
                            {day.habits.map(habit => (
                                <li key={habit.id} style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    width: "100%", fontSize: "20px", marginBottom: "10px", fontWeight: "500"
                                }}>
                                    <input type="checkbox" checked={habit.completed} onChange={() => toggleHabit(dayIndex, habit.id)} />

                                    <span style={{ flex: 1, marginLeft: "10px", textAlign: "left", fontSize: "28px" }}>{habit.title}</span>

                                    <button onClick={() => openModal(habit)} style={{ border: '#093330', backgroundColor: "#093330", color: "#c5e8e8", borderRadius: "10px", padding: "9px" }}>Edit</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </ul>


            {/* Empty Habit */}
            {habits.length === 0 && (
                <p style={{
                    fontSize: "18px",
                    color: "#093330",
                    marginTop: "20px"
                }}>
                    No habits yet. Add your first habit above!
                </p>
            )}

            {/* Manage Habits modal */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 999
                }} onClick={() => setShowModal(false)}>

                    <div style={{
                        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                        backgroundColor: "#508682", padding: "20px", borderRadius: "8px", zIndex: 1000
                    }} onClick={(e) => e.stopPropagation()}>

                        <h2 style={{ textAlign: "center" }}>Manage Habits</h2>

                        <input
                            autoFocus
                            type="text"
                            value={editHName}
                            onChange={(e) => setEditHName(e.target.value)}
                            style={{ margin: "10px 0", padding: "8px", width: "100%" }}
                        />

                        <button onClick={saveEditedHabit} style={{
                            marginLeft: "10px",
                            backgroundColor: "#093330",
                            color: "#c5e8e8",
                            padding: "8px",
                            borderRadius: "5px"
                        }}>Save Changes</button>


                        {/* Display all habits inside the modal */}
                        <ul>
                            {habits.map(habit => (
                                <li key={habit.id} style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "center", marginBottom: "8px",
                                    padding: "5px"
                                }}>
                                    <span style={{ fontSize: "22px", fontWeight: 500, flex: 1, marginRight: "10px" }}>{habit.title}</span>
                                    <button style={{ border: "1px solid #bfd6d6 ", borderRadius: "7px", backgroundColor: "#093330", padding: "8px", cursor: "pointer", fontWeight: 500, color: "#FF4D4D" }}
                                        onClick={() => confirmDelete(habit.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                        <button style={{
                            backgroundColor: "#093330",
                            color: "#c5e8e8",
                            border: "none",
                            borderRadius: "7px",
                            padding: "10px", // Increased padding
                            fontSize: "18px",
                            fontWeight: 500,
                            width: "100%",   // Full width
                            marginTop: "20px"
                        }}
                            onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div style={{
                width: "80%", borderRadius: "10px",
                margin: "20px auto",
                height: "15px",
                position: "relative"
            }}>
                <div
                    style={{
                        width: `${progressPercentage}%`,
                        height: "10px",
                        backgroundColor: progressPercentage >= 80 ? "green" : progressPercentage >= 50 ? "orange" : "red",
                        borderRadius: "10px",
                        transition: "width 0.3s ease-in-out"
                    }}
                ></div>
            </div>
            <p>
                {completedCount}/{totalCount} Habits Completed ({progressPercentage}%)
            </p>
        </div>
    )
}


