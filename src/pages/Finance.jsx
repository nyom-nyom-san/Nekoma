import SideBar from "../components/SideBar";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FMidBody from "./FMidBody";
import FLeftBody from "./FLeftBody";
import "../Finance.css"
export default function Finance() {
    const navigate = useNavigate();


    //Navigation
    const handleAddBooking = () => {
        navigate("/reserve")
    };

    const home = () => {
        navigate("/home")
    }

    const finance = () => {
        navigate("/finance")
    }

    return (
        <Container fluid>
            <Row>
                <SideBar handleAddBooking={handleAddBooking} home={home} finance={finance} />
                <div className="main-content" style={{ backgroundColor: "#c5e8e8" }}>
                    <div className="finance-page-layout">
                        <FMidBody />
                        <FLeftBody />
                    </div>
                </div>
            </Row>
        </Container>
    )
}