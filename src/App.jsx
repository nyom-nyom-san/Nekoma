import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Loading from "./pages/loading";
import Home from "./pages/Home";
import Reserve from "./pages/Reserve";
import Finance from "./pages/Finance";
// import { Context } from "./Context";
import { AuthProvider } from "./pages/AuthProvider";

export default function App() {

    // const [booking, setBooking] = useLocalStorage("booking", []);
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route index element={<AuthPage />} />
                    <Route path="/loading" element={<Loading />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/reserve" element={<Reserve />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="*" element={<AuthPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}