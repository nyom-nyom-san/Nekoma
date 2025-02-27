import { useState, useEffect } from 'react';
import { ProgressBar } from "react-bootstrap";

export default function Goal() {
    const [financeGoals, setFinanceGoals] = useState([]);

    useEffect(() => {
        const storedGoals = JSON.parse(localStorage.getItem("financeGoals")) || [];
        setFinanceGoals(storedGoals);
    }, []);

    return (
        <div style={{ display: "flex", overflowX: "scroll", whiteSpace: "nowrap", padding: "10px", gap: "10px" }}>
            {financeGoals.length > 0 ? (
                financeGoals.map(goal => (

                    <div key={goal.id} style={{
                        minWidth: "250px",
                        border: "1px solid white",
                        padding: "10px",
                        backgroundColor: "#c5e8e8",
                        borderRadius: "10px",
                        flexShrink: 0
                    }}>

                        <h3>{goal.title}</h3>
                        <p style={{ fontWeight: 600 }}>Target Amount: ${goal.targetAmount}</p>
                        <p style={{ fontWeight: 600 }}>Current Amount: ${goal.currentAmount || 0}</p>

                        <ProgressBar
                            style={{ marginBottom: "10px" }}
                            variant={
                                goal.currentAmount / goal.targetAmount >= 0.8
                                    ? "success"   // Green if 80% or more
                                    : goal.currentAmount / goal.targetAmount >= 0.5
                                        ? "warning"   // Yellow if between 50% and 80%
                                        : "danger"    // Red if below 50%
                            }
                            now={goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0}
                            label={goal.targetAmount > 0 ? `${Math.round((goal.currentAmount / goal.targetAmount) * 100)}%` : "0%"}
                        />
                    </div>
                ))
            ) : (
                <p>Create one to improve better financial plans</p>
            )}
        </div>
    );
}
