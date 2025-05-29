import { Col, Row } from "react-bootstrap";
import Charts from "./Charts"
import View from "./View"
import HabitView from "./HabitView";
// import { useState, useEffect } from "react";


export default function MidBody() {

    // const [booking, setBooking] = useState([])

    // useEffect(() => {
    //     const storedBooking = JSON.parse(localStorage.getItem("booking")) || []
    //     setBooking(storedBooking)
    // }, [])


    return (
        <Col sm={10} style={{ border: "1px solid #3d6663", backgroundColor: "#e2eceb", borderRadius: "10px", marginTop: "10px" }}>
            <Row>
                <Charts />
                <h3>Finance Goals</h3>
                <View />
                <HabitView />
            </Row>
        </Col>
    )
}