// src/Components/Constants/Error.jsx
import { useNavigate } from "react-router-dom";
import "../Styles/Error.css";
const Error = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <>
            <section className="ERROR_SEC">
                <h1 className="ERR_H1 ERRH">404! Error</h1>
                <h2 className="ERR_H2 ERRH">The page you are looking for cannot be found.</h2>
                <h2 className="ERR_H2 ERRH">Please go back and check again.</h2>
                <button onClick={handleGoBack} className="ERR_BTN">Go Back</button>
            </section>
        </>
    );
}
export default Error;