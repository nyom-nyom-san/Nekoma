import { useState, useEffect } from 'react'
import { Modal, Button, Form } from "react-bootstrap"

export default function EditGoal({ show, handleClose, goal, onSave }) {
    const [title, setTitle] = useState("")
    const [targetAmount, setTargetAmount] = useState("")
    const [currentAmount, setCurrentAmount] = useState("")

    useEffect(() => {
        if (goal) {
            setTitle(goal.title)
            setTargetAmount(goal.targetAmount)
            setCurrentAmount(goal.currentAmount)
        }
    }, [goal])

    const handleSave = () => {
        onSave(goal.id, {
            title,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount)
        })
        handleClose()
    }
    if (!goal) {
        return null
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Edit Goal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Goal Title Input */}
                    <Form.Group>
                        <Form.Label>Goal Title</Form.Label>
                        <Form.Control type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Target Amount</Form.Label>
                        <Form.Control type='numbers' value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Current Amount</Form.Label>
                        <Form.Control type='numbers' value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{ backgroundColor: "#bfd6d6", color: "black", border: "none" }} onClick={handleClose}>Cancel</Button>

                <Button style={{ backgroundColor: "#093330", color: "white", border: "none" }} onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    )
}