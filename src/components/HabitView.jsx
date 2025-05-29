import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { getAuth } from "firebase/auth"

export default function HabitView() {
    const [habitDays, setHabitDays] = useState([])
    const [sortAscending, setSortAscending] = useState(true)

    useEffect(() => {
        const auth = getAuth()
        if (!auth.currentUser) {
            console.error("User isn't signed in")
            return
        }
        const userHabitDaysRef = query(
            collection(db, "users", auth.currentUser.uid, "habitDays"),
            orderBy("date", "desc")
        )

        const unsubscribe = onSnapshot(userHabitDaysRef, (snapshot) => {
            const habitsData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
                };
            });

            setHabitDays(habitsData);
        });

        return () => unsubscribe() //cleanup
    }, [])

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
            <h2>Habit History</h2>

            <button
                onClick={() => setSortAscending(prev => !prev)}
                style={{
                    marginBottom: "20px",
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