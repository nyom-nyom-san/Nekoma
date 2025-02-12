import { Col, Form, Button } from "react-bootstrap"
import { useState } from "react"
import { add, subtract, multiply } from "../calculator"

export default function FLeftBody() {

    // Calculator logics
    const [operation, setOperation] = useState("+");
    const [num1, setNum1] = useState("")
    const [num2, setNum2] = useState("");

    //Simple Interest
    const [principal, setPrincipal] = useState("");
    const [rate, setRate] = useState("");
    const [time, setTime] = useState("");

    //Compound Interest 
    const [num, setNum] = useState("");

    //square Calculator
    const [rectangle, setRectangle] = useState("");

    //result    
    const [result, setResult] = useState("");


    const handleCalculate = () => {

        // Simple Interest
        if (operation === "simpleInterest") {
            const p = parseFloat(principal);
            const r = parseFloat(rate);
            const t = parseFloat(time);

            if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
                setResult("Invalid input");
                return;
            }

            const interest = (p * r * t) / 100;
            setResult(interest.toFixed(2));
            return;
        }

        //compound Interest
        if (operation === "compoundInterest") {
            const p = parseFloat(principal);
            const r = parseFloat(rate) / 100;
            const t = parseFloat(time);
            const n = parseInt(num);

            if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n) || p <= 0 || r <= 0 || t <= 0 || n <= 0) {
                setResult("Invalid input");
                return;
            }

            const compound = p * Math.pow((1 + r / n), n * t);
            setResult(compound.toFixed(2));
            return;
        }


        //Square Calculator

        if (operation === "square") {
            const rec = parseFloat(rectangle);

            if (isNaN(rec) || rec <= 0) {
                setResult("Invalid Answer")
                return;
            }

            const square = rec * rec;
            setResult(square.toFixed(1));
            return
        }



        //Normal Calulator
        const a = parseFloat(num1);
        const b = parseFloat(num2);

        if (isNaN(a) || isNaN(b) && operation !== "simpleInterest") {
            setResult("Invalid input");
            return;
        }

        switch (operation) {
            case "+": setResult(add(a, b));
                break;

            case "-": setResult(subtract(a, b));
                break;

            case "*": setResult(multiply(a, b));
                break;

            case "/":
                setResult((b !== 0 ? a / b : "Error Division by zero"));
                break;

            default: setResult("Invalid operation");
        }
    }

    return (
        <Col className="mt-2" style={{ backgroundColor: "white", marginLeft: "10px", borderRadius: "10px" }}>
            <h1>Finance Calculator</h1>

            <Form>
                {/* Operation Selection */}
                <Form.Group className="mb-2">
                    <Form.Label>Select Calculation</Form.Label>
                    <Form.Select value={operation} onChange={(e) => setOperation(e.target.value)}>
                        <option value="+">Addition (+)</option>
                        <option value="-">Subtraction (-)</option>
                        <option value="*">Multiplication (×)</option>
                        <option value="/">Division (÷)</option>
                        <option value="square">Square (²)</option>
                        <option value="simpleInterest">Simple Interest</option>
                        <option value="compoundInterest">Compound Interest</option>
                    </Form.Select>
                </Form.Group>

                {/* Standard Calculations (num1 & num2) */}
                {operation !== "simpleInterest" && operation !== "square" && operation !== "compoundInterest" && (
                    <>
                        <Form.Group className="mb-2">
                            <Form.Label>Enter Number 1</Form.Label>
                            <Form.Control type="number" value={num1} onChange={(e) => setNum1(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Enter Number 2</Form.Label>
                            <Form.Control type="number" value={num2} onChange={(e) => setNum2(e.target.value)} />
                        </Form.Group>
                    </>
                )}

                {/* Simple Interest Inputs */}
                {operation === "simpleInterest" && (
                    <>
                        <Form.Group className="mb-2">
                            <Form.Label>Principal ($)</Form.Label>
                            <Form.Control type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Rate (%)</Form.Label>
                            <Form.Control type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Time (Years)</Form.Label>
                            <Form.Control type="number" value={time} onChange={(e) => setTime(e.target.value)} />
                        </Form.Group>
                    </>
                )}

                {/* Square Calculation*/}
                {operation === "square" && (
                    <>
                        <Form.Group className="mb-2">
                            <Form.Label>Enter Number</Form.Label>
                            <Form.Control type="number" value={rectangle} onChange={(e) => setRectangle(e.target.value)} />
                        </Form.Group>
                    </>
                )}


                {/* Compound Interest Inputs */}
                {operation === "compoundInterest" && (
                    <>
                        <Form.Group className="mb-2">
                            <Form.Label>Principal ($)</Form.Label>
                            <Form.Control type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Rate (%)</Form.Label>
                            <Form.Control type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Time (Years)</Form.Label>
                            <Form.Control type="number" value={time} onChange={(e) => setTime(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Compounding Frequency</Form.Label>
                            <Form.Select value={num} onChange={(e) => setNum(e.target.value)}>
                                <option value="1">Annually (1 time per year)</option>
                                <option value="2">Semi-Annually (2 times per year)</option>
                                <option value="4">Quarterly (4 times per year)</option>
                                <option value="12">Monthly (12 times per year)</option>
                                <option value="52">Weekly (52 times per year)</option>
                                <option value="365">Daily (365 times per year)</option>
                            </Form.Select>
                        </Form.Group>
                    </>
                )}

                <Button style={{ backgroundColor: "#bfd6d6", border: "none", color: "black" }} onClick={handleCalculate} className="mt-2">
                    Calculate
                </Button>

                <h3 className="mt-3">Result: {result}</h3>
            </Form>
        </Col>
    )
}