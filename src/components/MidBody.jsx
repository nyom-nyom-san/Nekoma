import { Col, Row } from "react-bootstrap";
import Charts from "./Charts"
import View from "./View"
import HabitView from "./HabitView";
import "../MainContent.css"


export default function MidBody() {



    return (
        <Col className="main-content">
            <Row>
                <Charts />
                <h3>Finance Goals</h3>
                <View />
                <HabitView />
            </Row>
        </Col>
    )
}