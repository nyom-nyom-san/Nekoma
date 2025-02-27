import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function EditGoal({ show, handleClose, goal, onSave }) {
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');

    // Initialize form fields when the goal prop changes
    useEffect(() => {
        if (goal) {
            setTitle(goal.title);
            setTargetAmount(goal.targetAmount);
            setCurrentAmount(goal.currentAmount);
        }
    }, [goal]);

    // Handle saving the goal
    const handleSave = () => {
        if (!goal) {
            return;
        }

        // Validation
        if (!title.trim() || targetAmount === '' || currentAmount === '') {
            alert('Please fill in all fields before saving.');
            return;
        }

        // Parse amounts
        const parTarget = parseFloat(targetAmount);
        const parCurrent = parseFloat(currentAmount);

        // Validate numbers
        if (isNaN(parTarget) || parTarget <= 0) {
            alert('Please enter a valid target amount.');
            return;
        }
        if (isNaN(parCurrent) || parCurrent < 0) {
            alert('Current amount must be a non-negative number.');
            return;
        }
        if (parCurrent > parTarget) {
            alert('Current amount cannot be greater than the target amount.');
            return;
        }

        // Save changes
        onSave(goal.id, {
            title,
            targetAmount: parTarget,
            currentAmount: parCurrent,
        });

        // Close the modal
        handleClose();
    };

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
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    {/* Target Amount Input */}
                    <Form.Group>
                        <Form.Label>Target Amount</Form.Label>
                        <Form.Control
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                        />
                    </Form.Group>

                    {/* Current Amount Input */}
                    <Form.Group>
                        <Form.Label>Current Amount</Form.Label>
                        <Form.Control
                            type="number"
                            value={currentAmount}
                            onChange={(e) => setCurrentAmount(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {/* Cancel Button */}
                <Button
                    style={{ backgroundColor: '#bfd6d6', color: 'black', border: 'none' }}
                    onClick={handleClose} // Directly use handleClose
                >
                    Cancel
                </Button>

                {/* Save Changes Button */}
                <Button
                    style={{ backgroundColor: '#093330', color: 'white', border: 'none' }}
                    onClick={handleSave}
                >
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}        