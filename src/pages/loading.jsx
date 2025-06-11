import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";

const Loading = () => {
    const navigate = useNavigate();
    const neko = "/pictures/cat-playing.gif"

    useEffect(() => {
        // Simulate a loading delay (e.g., 3 seconds)
        const timer = setTimeout(() => {
            navigate("/home");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", marginTop: "100px" }}>
            <Image src={neko} alt="Loading..." />
        </div>
    );
};

export default Loading;
