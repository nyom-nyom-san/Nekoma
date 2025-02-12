import SideBar from "../components/SideBar";
import { Container, Row } from "react-bootstrap";
// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FMidBody from "./FMidBody";
import FLeftBody from "./FLeftBody";
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
        <div style={{ backgroundColor: "#c5e8e8" }}>
            <Container>
                <Row>
                    <SideBar handleAddBooking={handleAddBooking} home={home} finance={finance} />
                    <FMidBody />
                    <FLeftBody />
                </Row>
            </Container>
        </div>
    )
}