import { Col, Image } from "react-bootstrap";
import Icons from "./Icons";

export default function SideBar({ handleLogout, handleAddBooking, home, finance }) {
    const nekoma = "/pictures/black-cat.png"
    //const cat = "/pictures/cat.gif"


    return (
        <Col sm={2} className="d-flex flex-column justify-content-start align-items-start vh-100 gap-3" style={{ backgroundColor: "#508682", borderRadius: "10px", marginLeft: "-110px", marginRight: "10px", marginTop: "10px" }}>
            <Image src={nekoma} style={{ width: "100px", marginTop: "5vh", marginBottom: "5vh" }} istop="true" />
            <i style={{ fontSize: 30, fontWeight: "Bold" }}>NEKOMA</i>


            <Icons className="bi bi-home" text="Home" onClick={home} />
            <Icons className="bi bi-bookmarks" text="Habit" onClick={handleAddBooking} />
            <Icons text="Finance" onClick={finance} />
            <Icons className="bi bi-envelope" text="Chatbot" />
            <Icons text="Logout" onClick={handleLogout} />
        </Col>
    )
}