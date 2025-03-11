// src/Components/Pages/Welcome.jsx
import "../Styles/Welcome.css";
import { Welcome_P1, Welcome_P2, data1, Welcome_H1 } from "../Constants/DemoData";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const Welcome = () => {
    const navigate = useNavigate();
    const HandleRedirect = () => {
        const AuthToken = Cookies.get("AuthToken");
        const UserId = Cookies.get("UserId");

        if (AuthToken && UserId) {
            navigate(`/api/expense/v1/expense/${UserId}`);
        } else {
            navigate("/api/expense/v1/signin");
        }
    }
    return (
        <>
            <section className="HD_SEC1">
                <h1 className="HDSECH1">{Welcome_H1}</h1>
            </section>
            <section className="HD_SECPB1">
                <article className="HD_P1_BTN1">
                    <p className="HDP1">{Welcome_P1}</p>
                    <button onClick={HandleRedirect} className="CH_BTN" title="Go To Expense">
                        Click Here
                    </button>
                </article>
            </section>
            <section className="HD_SECPB1">
                <article className="HD_P1_BTN1">
                    <p className="HDP1">{Welcome_P2}</p>
                </article>
            </section>
            <section className="HD_SECPB1">
                <article className="BOX_DIV">
                    {
                        data1.map((value) => (
                            <div key={value.id} className="DIV-BOX">
                                <h3 className="DIV_BOX_H3">{value.head}</h3>
                                <p className="DIV_BOX_P">{value.des}</p>
                            </div>
                        ))
                    }
                </article>
            </section>
        </>
    );
}
export default Welcome;