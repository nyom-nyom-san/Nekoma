import { Col, Image, Row, Button, Modal, Form } from "react-bootstrap";
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default function AuthPage() {
    const loginImage = "/pictures/pawprint.gif"
    const nekoma = "/pictures/black-cat.png"

    const [modalShow, setModalShow] = useState(null)
    const handleShowSignUp = () => setModalShow("SignUp")
    const handleShowLogin = () => setModalShow("Login")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const auth = getAuth()
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (currentUser) navigate("/loading")
    }, [currentUser, navigate])

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            const res = await createUserWithEmailAndPassword(auth, username, password)
            console.log(res.user)
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, username, password)
        } catch (error) {
            console.error(error)
        }
    }
    const handleClose = () => setModalShow(null)


    return (
        <Row>
            <Col sm={6}>
                <Image src={loginImage} style={{ width: "40%", display: "block", margin: "230px" }} />
            </Col>
            <Col sm={6} className="p-4" style={{ backgroundColor: "#e2eceb" }}>
                <Image src={nekoma} width="5%" />
                <h1 className="mt-5" style={{ fontSize: 50, fontWeight: 'bold', color: "#00AAA0 " }}> Nekoma</h1>
                <i className="mt-4" style={{ fontSize: 24, fontWeight: 700, color: "#00AAA0" }}>The purr-fect vet for your pet</i>


                {/*Google Sign-up*/}
                <Col sm={5} className="d-grid gap-2" style={{ marginTop: 50 }}>
                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-google"></i>Meow-up with Google
                    </Button>

                    {/*Apple Sign-up*/}
                    <Button className="rounded-pill" variant="outline-dark">
                        <i className="bi bi-apple"></i>Meow-up with Apple
                    </Button>

                    <p style={{ textAlign: "center" }}>or</p>
                    <Button className="rounded-pill" onClick={handleShowSignUp} style={{ backgroundColor: "#00AAA0 ", borderColor: "#00AAA0" }}>
                        Create an account
                    </Button>
                    <p style={{ fontSize: "12px" }}>By Meow-up, you agree to the Terms of Service and Privacy Policy including Cookie use</p>

                    <p className="mt-5" style={{ fontWeight: "bold", fontSize: "20px", marginTop: "10px" }}>Already have an account?</p>
                    <Button className="rounded-pill" style={{ backgroundColor: "#00AAA0 ", borderColor: "#00AAA0" }} onClick={handleShowLogin}>Log-in</Button>
                </Col>

                {/*Modal*/}
                <Modal show={modalShow !== null} onHide={handleClose} animation={false} centered>
                    <Modal.Body>
                        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                            {modalShow === "SignUp" ? " Create your meow-ow account" : "Log in to meow-ow account"}
                        </h2>
                        <Form className="d-grid gap-2 px-5" onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control onChange={(e) => setUsername(e.target.value)} type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                            </Form.Group>
                            <p style={{ fontSize: "12px" }}>By signing up, you agree to the Purr-fect Terms of Service and Privacy Policy, including Cookie Use. SigmaTweets may use your contact information, like your meow-mail address and purr-sonal phone number, for all the pawsome purposes outlined in our Privacy Policy—like keeping your account safe from pesky furballs and personalizing our services, including ads that are as delightful as a sunbeam on a cozy windowsill. Learn more! Others will be able to find you by meow-mail or phone number when provided, unless you choose to keep it a secret, just like a cat hiding in a box!</p>

                            <Button className="rounded-pill" style={{ backgroundColor: "#00AAA0 ", borderColor: "#00AAA0" }} type="submit">{modalShow === "SignUp" ? "Sign Up" : "Log In"}</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Col>
        </Row>
    )
}

