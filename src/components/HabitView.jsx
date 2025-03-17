import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, onSnapshot } from "firebase/firestore"

export default function HabitView() {
    const [habitDays, setHabitDays] = useState([])
    const [sortAscending, setSortAscending] = useState(true)

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "habitDays"), (snapshot) => {
            const habitsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setHabitDays(habitsData)
        })
        return () => unsubscribe() //cleanup
    }, [])

    const calculateProgress = (habits) => {
        const completed = habits.filter(h => h.completed).length
        const total = habits.length
        return total === 0 ? 0 : Math.round((completed / total) * 100)
    }

    const sortedDays = [...habitDays].sort((a, b) =>
        sortAscending
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date)
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
                Sort: {sortAscending ? "Oldest First" : "Newest First"}
            </button>

            {/*Habit List*/}
            <ul>
                {sortedDays.map((day) => (
                    <div key={day.date} style={{
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
                            {day.habits.map(habit => (
                                <li key={habit.id} style={{
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

            {/*Empty State */}
            {habitDays.length === 0 && (
                <p style={{ fontSize: "18px", color: "#093330", marginTop: "20px" }}>No habit History found</p>
            )}
        </div>
    )
}