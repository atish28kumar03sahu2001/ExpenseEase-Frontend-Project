// src/Components/Layout/Footer.jsx
import { Welcome_H1 } from "../Constants/DemoData";
import "../Styles/Footer.css";
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <>
            <section className="FTR_SEC">
                <p className="FTR_P">
                    © {Welcome_H1} Atish Kumar Sahu {currentYear}. All Rights Reserved.
                </p>
            </section>
        </>
    );
}
export default Footer;