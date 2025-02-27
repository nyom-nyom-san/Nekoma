import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

export default function Charts() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

        //Group the expenses by date
        const groupedExpense = storedExpenses.reduce((acc, expense) => {
            const dataKey = expense.date

            if (!acc[dataKey]) {
                acc[dataKey] = { ...expense }
            } else {
                acc[dataKey].amount += expense.amount
            }
            return acc
        }, {})

        // Format dates & sort
        const formattedExpenses = Object.values(groupedExpense)
            .map(expense => ({
                ...expense,
                displayDate: formatDate(expense.date), // Format for display
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        setExpenses(formattedExpenses);
    }, []);


    // Function to format date (DD/MM/YYYY)
    function formatDate(isoDate) {
        const dateObj = new Date(isoDate);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <>
            <h1 style={{ color: "#093330" }}>Finance Status</h1>
            <div style={{ marginTop: "10px", padding: "15px", borderRadius: "10px" }}>
                <h3 style={{ textAlign: "center", color: "#093330" }}>Expense Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={expenses} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={formatDate} />
                        <YAxis />
                        <Tooltip labelFormatter={(label) => formatDate(label)} />
                        <Line type="monotone" dataKey="amount" stroke='#093330' strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
