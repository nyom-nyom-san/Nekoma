import { useState, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import EditExpense from "./EditExpense";

export default function ExpenseTracker() {

    const [expenses, setExpenses] = useState(() => getExpenses());
    const [categories, setCategories] = useState(() => getCategories())
    const [date, setDate] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [newCategory, setNewCategory] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showCatModal, setShowCatModal] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)

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

    //Edit Expense
    function editExpense(id, updatedExpense) {
        setExpenses(expenses.map(expense =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense
        ));
    }

    //Deleting Expense
    function deleteExpense(id) {
        setExpenses(expenses.filter(expense => expense.id !== id))
    }

    //Add Categories
    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories])

    //When there is no expense
    function addExpense() {
        const parsedAmount = parseFloat(amount);

        if (!date || !amount || !category) {
            alert("Please fill in all fields")
            return
        }

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Amount must be greater than 0");
            return;
        }

        const newExpense = { id: Date.now(), date: new Date(date).toISOString().split("T")[0], amount: parseFloat(amount), category }


        setExpenses(prevExpenses =>
            [...prevExpenses, newExpense].sort((a, b) => new Date(a.date) - new Date(b.date))
        )

        setExpenses([...expenses, newExpense])
        setDate("")
        setAmount("")
        setCategory("")
        setShowModal(false)

    }

    // Adding Categories
    function addNewCategory() {
        const trimmedCategory = newCategory.trim();
        if (!trimmedCategory || categories.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase())) {
            alert("Category already exists or is empty");
            return;
        }
        setCategories([...categories, trimmedCategory]);
        setNewCategory("");
    }

    //Date
    const formatDate = (isoDate) => {
        const dateObj = new Date(isoDate)
        return dateObj.toLocaleDateString("en-GB")
    }

    //Reseting Categories
    function resetCategories() {
        setCategories(["Food", "Transportation", "Shopping", "Entertainment"]);
    }

    //Deleting Categories
    function deleteCategory(catToDelete) {
        setCategories(categories.filter(cat => cat !== catToDelete));
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

                        {/*Category */}
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
                    <Button style={{ backgroundColor: "#c5e8e8", color: "#093330", border: "none" }} onClick={() => setShowModal(false)}>Cancel</Button>

                    <Button style={{ backgroundColor: "#093330", color: "#c5e8e8", border: "none" }} onClick={addExpense}>Add Expense</Button>
                </Modal.Footer>
            </Modal>

            {/* Category Modal*/}
            <Modal show={showCatModal} onHide={() => setShowCatModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Categories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {categories.length > 0 ? (
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {categories.map((cat, index) => (
                                <li key={index} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #ccc" }}>
                                    {cat}
                                    <button onClick={() => deleteCategory(cat)} style={{ backgroundColor: "#093330", color: "#FF4D4D", borderRadius: "5px", padding: "5px", border: "none", fontWeight: 500, }}>
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No categories available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{ backgroundColor: "#093330", color: "#FF4D4D", border: "none", fontWeight: 500, }} onClick={resetCategories}>Reset to Default</Button>
                    <Button style={{ backgroundColor: "#bfd6d6", color: "#093330", border: "none" }} onClick={() => setShowCatModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            <div style={{ marginTop: "10px" }}>
                <input type="text" placeholder="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ border: '#093330', borderRadius: "10px", padding: "9px" }} />

                <button onClick={addNewCategory} style={{ marginLeft: "10px", border: '#093330', backgroundColor: "#093330", color: "#c5e8e8", borderRadius: "10px", padding: "9px" }}>Add Category</button>

                <button onClick={() => setShowCatModal(true)} style={{ marginLeft: "10px", border: '#093330', backgroundColor: "#093330", color: "#c5e8e8", borderRadius: "10px", padding: "9px" }}>Manage Categories</button>

                {editingExpense && (
                    <EditExpense
                        expense={editingExpense}
                        onSave={editExpense}
                        onClose={() => setEditingExpense(null)}
                        categories={categories} // Pass categories
                    />
                )}
            </div>


            {/* Description*/}
            <table style={{ width: "100%", marginTop: "10px", border: ' 1px solid #093330', borderRadius: "10px" }}>
                <thead>
                    <tr>
                        <th style={{ fontSize: "20px" }}>Category</th>
                        <th style={{ fontSize: "20px" }}>Date</th>
                        <th style={{ fontSize: "20px" }}>Amount</th>
                        <th style={{ fontSize: "20px" }}>Delete</th>
                        <th style={{ fontSize: "20px" }}>Edit</th>
                    </tr>
                </thead>

                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id}>
                            <td style={{ color: "#c5e8e8", fontSize: "18px" }}>{expense.category}</td>
                            <td style={{ color: "#c5e8e8", fontSize: "18px" }}>{formatDate(expense.date)}</td>
                            <td style={{ color: "#c5e8e8", fontSize: "18px" }}>${expense.amount.toFixed(2)}</td>
                            <td>
                                <button
                                    onClick={() => deleteExpense(expense.id)}
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "18px"
                                    }}
                                >
                                    🗑
                                </button>
                            </td>

                            <td>
                                <button
                                    onClick={() => {
                                        setEditingExpense(expense);// Open modal for editing
                                    }}
                                    style={{
                                        backgroundColor: "#093330",
                                        color: "#c5e8e8",
                                        borderRadius: "5px",
                                        padding: "5px",
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}