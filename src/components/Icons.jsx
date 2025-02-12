import { Button } from "react-bootstrap"

export default function Icons({ isTop, className, onClick, text }) {
    let margin = "";

    if (isTop) {
        margin = "light rounded-pill my-3"
    } else {
        margin = "light rounded-pill my-1 border border-1"
    }

    const iconMargin = text ? "mxe-3" : ""

    return (
        <Button variant={margin} onClick={onClick}><i className={className + iconMargin} style={{ fontSize: 20, color: isTop ? "00AAA0" : "black" }}></i>{text}</Button>
    )
}