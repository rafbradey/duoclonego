import { useEffect, useState } from "react";
import { Link } from "react-router";
import "./Home.css";
import Mascot from "../../components/Mascot/Mascot.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import TallManText from "../../components/TallManText/TallManText.jsx";
import { getAllLasaEntries } from "../../services/drugService.js";

const DEFAULT_FEATURED_PAIRS = [
    { drugName: "DOPamine", confusedDrugName: "DOBUTamine" },
    { drugName: "hydrOXYzine", confusedDrugName: "hydrALAZINE" },
    { drugName: "predniSONE", confusedDrugName: "prednisoLONE" },
    { drugName: "vinBLAStine", confusedDrugName: "vinCRIStine" }
];

function Home() {
    const [featuredPairs, setFeaturedPairs] = useState(DEFAULT_FEATURED_PAIRS);

    useEffect(() => {
        let isMounted = true;
        async function loadFeatured() {
            try {
                const entries = await getAllLasaEntries();
                if (isMounted && entries && entries.length > 0) {
                    setFeaturedPairs(entries.slice(0, 5));
                }
            } catch {
                // Keep default pairs on error
            }
        }
        loadFeatured();
        return () => { isMounted = false; };
    }, []);

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
                    {featuredPairs.map((pair, index) => (
                        <span key={pair.id || index} className="lasa-ticker-pill">
                            <TallManText name={pair.drugName} /> / <TallManText name={pair.confusedDrugName} />
                        </span>
                    ))}
                </div>
            </footer>
        </div>
    );
}

export default Home;