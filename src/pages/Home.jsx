import { Container, Row, } from "react-bootstrap";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { getAuth } from "firebase/auth";
import SideBar from "../components/SideBar";
import MidBody from "../components/MidBody";
import { useEffect } from "react";


export default function Home() {

    const auth = getAuth()
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (!currentUser) {
            navigate("/")
        }
    }, [currentUser, navigate])

    const handleLogout = () => {
        auth.signOut()
    }

    const handleAddBooking = () => {
        navigate("/reserve")
    };

    const home = () => {
        navigate("/home")
    };

    const finance = () => {
        navigate("/finance")
    }


    return (
        <div style={{ backgroundColor: "#e2eceb" }}>
            <Container>
                <Row>
                    <SideBar handleLogout={handleLogout} handleAddBooking={handleAddBooking} home={home} finance={finance} />
                    <MidBody />
                </Row>
            </Container>
        </div>
    );
}


