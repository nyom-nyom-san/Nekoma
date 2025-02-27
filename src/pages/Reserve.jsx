import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import RMidBody from "./RMidBody";
import { Container, Row } from "react-bootstrap";


export default function Reserve() {
    const navigate = useNavigate();

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
            <Container >
                <Row>
                    <SideBar handleAddBooking={handleAddBooking} home={home} finance={finance} />
                    <RMidBody />
                </Row>
            </Container>
        </div>
    )
}