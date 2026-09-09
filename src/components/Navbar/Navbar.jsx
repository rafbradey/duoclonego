import { Link } from "react-router";
import "./Navbar.css";
import Mascot from "../Mascot/Mascot.jsx";

function Navbar() {
    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" aria-label="Duoclongo Home">
                    <div className="navbar-logo-icon">
                        <Mascot mascotType="shadow" size={40} flipped={false} animationType="none" />
                    </div>
                    <span className="navbar-logo-text">duoclongo</span>
                </Link>

                <div className="navbar-right">
                    <span className="navbar-badge">
                        SITE LANGUAGE: <strong className="navbar-lang-highlight">ENGLISH</strong>
                    </span>
                    <Link to="/learn" className="duo-button duo-button-primary navbar-cta">
                        LEARN
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Navbar;