import { Col } from "react-bootstrap";
import { useState } from "react";
import EditGoal from "../goal/EditGoal";
import { ProgressBar } from "react-bootstrap";
import ExpenseTracker from '../components/ExpenseTracker'


export default function FMidBody() {
    const [goals, setGoals] = useState(getGoals()); // Load goals
    const [selectGoal, setSelectGoal] = useState(null);
    const [showModal, setShowModal] = useState(false);

    function getGoals() {
        return JSON.parse(localStorage.getItem("financeGoals")) || [];
    }

    //Add new Goal
    function addGoal() {
        const newGoal = {
            id: Date.now(), // Unique ID
            title: "Set Your Goal",
            targetAmount: 0,
            currentAmount: "0",
        };

        const updatedGoals = [...goals, newGoal];  // Add new goal to state
        setGoals(updatedGoals);
        localStorage.setItem("financeGoals", JSON.stringify(updatedGoals));

        setSelectGoal(newGoal)
        setShowModal(true)
    }

    //Edit Goals
    function editGoal(id, updatedData) {
        const updatedGoals = goals.map(goal => {
            if (goal.id === id) {
                let newAmount = updatedData.currentAmount;

                // Prevent currentAmount from exceeding targetAmount
                if (newAmount > goal.targetAmount) {
                    newAmount = goal.targetAmount;
                }

                return { ...goal, ...updatedData, currentAmount: newAmount };
            }
            return goal;
        });

        localStorage.setItem("financeGoals", JSON.stringify(updatedGoals));
        setGoals(updatedGoals);
    }

    //Delete Goals

    const deleteGoal = (id) => {
        let updatedGoals = getGoals().filter(goal => goal.id !== id)

        localStorage.setItem("financeGoals", JSON.stringify(updatedGoals))
        setGoals(updatedGoals)
    }

    function handleEditClick(goal) {
        setSelectGoal(goal);
        setShowModal(true);
    }


    return (
        <Col sm={8} style={{ backgroundColor: "#093330", padding: "20px", marginTop: "10px", borderRadius: "10px" }}>
            <h2 style={{ color: "#c5e8e8" }}>Finance Goals</h2>

            {/* Add Goal Button */}
            <button onClick={addGoal} style={{ marginBottom: "10px", borderRadius: "10px", backgroundColor: "#bfd6d6", border: "none", padding: "5px", cursor: "pointer", fontWeight: "bold" }}>
                Add Goal
            </button>

            <div style={{ display: "flex", overflowX: "scroll", whiteSpace: "nowrap", padding: "10px", gap: "10px" }}>
                {goals.length > 0 ? (
                    goals.map(goal => (

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

                            {/* Buttons Delete/Edit */}
                            <button style={{ border: "1px solid #093330 ", borderRadius: "7px", backgroundColor: "#bfd6d6", padding: "8px", cursor: "pointer", fontWeight: 500, marginRight: "5px" }}
                                onClick={() => handleEditClick(goal)}>Edit</button>

                            <button style={{ border: "1px solid #bfd6d6 ", borderRadius: "7px", backgroundColor: "#093330", padding: "8px", cursor: "pointer", fontWeight: 500, color: "#FF4D4D" }}

                                onClick={() => deleteGoal(goal.id)}> Delete</button>
                        </div>
                    ))
                ) : (
                    <p>Create one to improve better financial plans</p>
                )}
            </div>

            {/* Edit Modal */}
            <EditGoal
                show={showModal}
                handleClose={() => setShowModal(false)}
                goal={selectGoal}
                onSave={editGoal}
            />
            <br />
            {/* Expense Tracker */}
            <h2 style={{ color: "#c5e8e8" }} className="mt-4">Expense Tracker</h2>
            <ExpenseTracker />
        </Col>
    );
}
