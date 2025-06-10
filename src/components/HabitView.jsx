import { useEffect, useState } from "react"
import { db } from "../firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { getAuth } from "firebase/auth"

export default function HabitView() {
    const [habitDays, setHabitDays] = useState([])
    const [sortAscending, setSortAscending] = useState(true)

    useEffect(() => {
        const authInstance = getAuth();
        const currentUser = authInstance.currentUser;

        if (!currentUser) {
            console.error("HabitView: User is not signed in. Cannot fetch habits.");
            setHabitDays([]);
            return;
        }

        console.log(`HabitView: Setting up Firestore listener for user ${currentUser.uid} to fetch single document.`);
        const userHabitDaysDocRef = doc(db, "users", currentUser.uid, "habitDays", "current");

        const unsubscribe = onSnapshot(userHabitDaysDocRef, (docSnap) => {
            if (!docSnap.exists()) {
                console.log("HabitView: 'current' habit document not found for this user.");
                setHabitDays([]);
                return;
            }

            const documentData = docSnap.data();
            console.log("HabitView: Raw data from 'current' document:", documentData);

            let daysArrayFromDoc = [];
            if (documentData && documentData.days && Array.isArray(documentData.days)) {
                daysArrayFromDoc = documentData.days;
            } else if (documentData && documentData.days && typeof documentData.days === 'object') {

                console.warn("HabitView: 'days' field in 'current' document is an object. Converting to array.");
                daysArrayFromDoc = Object.values(documentData.days);
            } else {
                console.log("HabitView: 'days' field is missing, not an array, or not an expected object in 'current' document.");
                setHabitDays([]);
                return;
            }

            console.log(`HabitView: Received ${daysArrayFromDoc.length} habit day entries from the 'days' array.`);

            const processedHabitDays = daysArrayFromDoc.map((dayData, index) => {

                let processedDate;
                if (dayData.date && typeof dayData.date.toDate === 'function') {
                    processedDate = dayData.date.toDate();
                } else if (dayData.date) {
                    processedDate = new Date(dayData.date);
                    if (isNaN(processedDate.getTime())) {
                        console.warn(`HabitView: Invalid date encountered for entry with original date ${dayData.date}. Setting date to null.`);
                        processedDate = null;
                    }
                } else {
                    console.warn(`HabitView: Missing date field for an entry in 'days' array. Setting date to null.`);
                    processedDate = null;
                }

                const entryId = dayData.id || dayData.date || `day-${index}`;

                return {
                    id: entryId,
                    ...dayData,
                    date: processedDate,
                };
            });

            const validHabitsData = processedHabitDays.filter(day => day.date !== null);
            if (validHabitsData.length < processedHabitDays.length) {
                console.warn("HabitView: Some habit entries were filtered out due to invalid/missing dates.");
            }

            validHabitsData.sort((a, b) => b.date - a.date);

            console.log("HabitView: Processed habitsData to set state:", validHabitsData);
            setHabitDays(validHabitsData);

        }, (error) => {
            console.error("HabitView: Error fetching/listening to the habit document:", error);
            setHabitDays([]);
        });

        // Cleanup 
        return () => {
            console.log("HabitView: Unsubscribing from Firestore listener for single document.");
            unsubscribe();
        };
    }, []);

    const calculateProgress = (habits) => {
        const completed = habits.filter(h => h.completed).length
        const total = habits.length
        return total === 0 ? 0 : Math.round((completed / total) * 100)
    }

    const sortedDays = [...habitDays].sort((a, b) =>
        sortAscending
            ? b.date - a.date
            : a.date - b.date
    )

    return (
        <div style={{ backgroundColor: "#c5e8e8" }}>
            <h2 style={{ margin: "20px" }}>Habit History</h2>

            <button
                onClick={() => setSortAscending(prev => !prev)}
                style={{
                    margin: "20px",
                    padding: "8px 16px",
                    backgroundColor: "#093330",
                    color: "#c5e8e8",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                Sort: {sortAscending ? "Newest First" : "Oldest First"}
            </button>

            {/*Habit List*/}
            {habitDays.length === 0 ? (
                <p style={{ fontSize: "18px", color: "#093330", marginTop: "20px" }}>No habit history found</p>
            ) : (
                <ul>
                    {sortedDays.map((day) => (
                        <div key={day.id || day.date} style={{
                            border: "1px solid #ccc", borderRadius: "10px",
                            padding: "15px", marginBottom: "20px", maxWidth: "400px"
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
                                {day.habits.map((habit, index) => (
                                    <li key={habit.id || index} style={{  /* ✅ Fixed Key Issue */
                                        display: "flex", alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%", fontSize: "20px",
                                        marginBottom: "10px", fontWeight: "500"
                                    }}>
                                        <span style={{ flex: 1, marginLeft: "10px", textAlign: "left" }}>
                                            {habit.title}
                                        </span>
                                        <span style={{
                                            color: habit.completed ? "green" : "red",
                                            fontWeight: "bold"
                                        }}>
                                            {habit.completed ? "✓" : "✗"}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Progress Bar for the Day */}
                            <div style={{
                                width: "100%", borderRadius: "10px",
                                margin: "10px 0", height: "10px",
                                backgroundColor: "#e0e0e0"
                            }}>
                                <div
                                    style={{
                                        width: `${calculateProgress(day.habits)}%`,
                                        height: "10px",
                                        backgroundColor: calculateProgress(day.habits) >= 80 ? "green" :
                                            calculateProgress(day.habits) >= 50 ? "orange" : "red",
                                        borderRadius: "10px"
                                    }}
                                ></div>
                            </div>
                            <p style={{ textAlign: "center", marginTop: "5px" }}>
                                {calculateProgress(day.habits)}% Completed
                            </p>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    )
}