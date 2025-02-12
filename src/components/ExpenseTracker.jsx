import { useState, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"

export default function ExpenseTracker() {

    const [expenses, setExpenses] = useState(getExpenses());
    const [date, setDate] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [categories, setCategories] = useState(getCategories())
    const [newCategory, setNewCategory] = useState("")
    const [showModal, setShowModal] = useState(false)

    function getExpenses() {
        return JSON.parse(localStorage.getItem("expenses")) || [];
    }

    function getCategories() {
        return JSON.parse(localStorage.getItem("categories")) || ["Food", "Transportation", "Shopping", "Entertainment"];
    }

    //Add Expense
    useEffect(() => {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }, [expenses])

    //Add Categories
    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories])

    function addExpense() {
        if (!date || !amount || !category) {
            alert("Please fill in all fields")
            return
        }

        if (amount < 0) {
            alert("Amount must be greater than 0");
            return;
        }

        const newExpense = { id: Date.now(), date, amount: parseFloat(amount), category }
        setExpenses([...expenses, newExpense])
        setDate("")
        setAmount("")
        setCategory("")
        setShowModal(false)

    }

    function addNewCategory() {
        const trimmedCategory = newCategory.trim();
        if (!trimmedCategory || categories.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase())) return;
        setCategories([...categories, trimmedCategory]);
        setNewCategory("");
    }




    return (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#508682", borderRadius: "7px" }}>
            <Button style={{ marginLeft: "10px", border: '#093330', backgroundColor: "#c5e8e8", color: "#093330", borderRadius: "10px", padding: "9px", fontWeight: "Bold" }} onClick={() => setShowModal(true)}>Add Expense</Button>


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Expense</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        {/*Date */}
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </Form.Group>


                        {/*Amount */}
                        <Form.Group>
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" placeholder="Amount Spent" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </Form.Group>

                        {/*Amount */}
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
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
                    {/* Modal Button */}
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={addExpense}>Add Expense</Button>
                </Modal.Footer>
            </Modal>

            <div style={{ marginTop: "10px" }}>
                <input type="text" placeholder="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ border: '#093330', borderRadius: "10px", padding: "9px" }} />

                <button onClick={addNewCategory} style={{ marginLeft: "10px", border: '#093330', backgroundColor: "#093330", color: "#c5e8e8", borderRadius: "10px", padding: "9px" }}>Add Category</button>
            </div>

            <table style={{ width: "100%", marginTop: "10px", border: ' 1px solid #093330', borderRadius: "10px" }}>
                <thead>
                    <tr>
                        <th style={{ fontSize: "20px" }}>Category</th>
                        <th style={{ fontSize: "20px" }}>Date</th>
                        <th style={{ fontSize: "20px" }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id}>
                            <td style={{ color: "#c5e8e8", fontSize: "18px" }}>{expense.category}</td>
                            <td style={{ color: "#c5e8e8", fontSize: "18px" }}>{expense.date}</td>
                            <td style={{ color: "#c5e8e8", fontSize: "18px" }}>${expense.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}