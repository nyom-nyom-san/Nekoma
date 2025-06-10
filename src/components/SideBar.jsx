import { useState } from "react";
import { Col, Image } from "react-bootstrap";
import Icons from "./Icons";
import '../Sidebar.css';

export default function SideBar({ handleLogout, handleAddBooking, home, finance }) {
    const nekoma = "/pictures/black-cat.png";
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Hamburger menu */}
            <div className="hamburger-menu" onClick={toggleSidebar}>
                <i className={isSidebarOpen ? "bi bi-x" : "bi bi-list"}></i>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            <Col sm={2} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Image src={nekoma} style={{ width: "80px" }} />
                    <i className="sidebar-title">NEKOMA</i>
                </div>

                <div className="sidebar-menu">
                    <Icons className="bi bi-house-door" text="Home" onClick={home} />
                    <Icons className="bi bi-journal-bookmark" text="Habit" onClick={handleAddBooking} />
                    <Icons className="bi bi-piggy-bank" text="Finance" onClick={finance} />
                    <Icons className="bi bi-box-arrow-right" text="Logout" onClick={handleLogout} />
                </div>
            </Col>
        </>
    );
}