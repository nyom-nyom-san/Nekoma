import Habit from "../components/Habit";
import { Col } from "react-bootstrap";

export default function RMidBody() {
    return (
        <Col sm={10} style={{ backgroundColor: "#093330", padding: "20px", marginTop: "10px", borderRadius: "10px" }}>
            <Habit />
        </Col>
    )
}