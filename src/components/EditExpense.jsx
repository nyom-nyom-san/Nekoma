import { Modal, Button, Form } from "react-bootstrap"
import { useState } from "react"


export default function EditExpense({ onClose, expense, onSave, categories }) {
    const [amount, setAmount] = useState(expense.amount);
    const [category, setCategory] = useState(expense.category);
    const [date, setDate] = useState(expense.date);

    const handleSave = () => {
        onSave(expense.id, { amount: parseFloat(amount) || 0, category, date, })
        onClose()
    }

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header>Edit Expense</Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>New Amount</Form.Label>
                        <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </Form.Group>


                    {/* Category Dropdown */}
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onClose} variant="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="primary">Save Changes</Button>
            </Modal.Footer>

        </Modal>
    )
}