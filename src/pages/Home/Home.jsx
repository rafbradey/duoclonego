import { Link } from "react-router";
import "./Home.css";
import Mascot from "../../components/Mascot/Mascot.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";

const SAMPLE_LASA_PAIRS = [
    { drug1: "DOPamine", drug2: "DOBUTamine" },
    { drug1: "hydrOXYzine", drug2: "hydrALAZINE" },
    { drug1: "predniSONE", drug2: "prednisoLONE" },
    { drug1: "vinBLAStine", drug2: "vinCRIStine" }
];

function Home() {
    return (
        <div className="home-page">
            <Navbar />

            <main className="hero-section">
                <div className="hero-mascot-container">
                    <Mascot mascotType="maracas" size={280} flipped={false} animationType="float" />
                </div>

                <div className="hero-content">
                    <h1 className="hero-title heading-xl">
                        The free, fun, and effective way to master LASA medications!
                    </h1>
                    <p className="hero-subtitle body-text-muted">
                        Practice recognizing Look-Alike, Sound-Alike drug pairs, avoid critical dispensing errors, and sharpen your clinical recall.
                    </p>

                    <div className="hero-actions">
                        <Link to="/learn" className="duo-button duo-button-primary hero-btn">
                            GET STARTED
                        </Link>
                        <Link to="/learn" className="duo-button duo-button-secondary hero-btn">
                            I ALREADY HAVE AN ACCOUNT
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="features-section">
                <span className="features-label">COMMON LASA PAIRS:</span>
                <div className="features-ticker">
                    {SAMPLE_LASA_PAIRS.map((pair, index) => (
                        <span key={index} className="lasa-ticker-pill">
                            <strong>{pair.drug1}</strong> / <strong>{pair.drug2}</strong>
                        </span>
                    ))}
                </div>
            </footer>
        </div>
    );
}

export default Home;