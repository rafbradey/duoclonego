import "./Home.css";
import Mascot from "../../components/Mascot/Mascot.jsx";

function Home() {
    return (

        <main className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Muchachos, Amigo Bueno.</h1>

                    <p>
                        Duoclongo Aribaaa!
                    </p>

                    <div className="hero-actions">
                        <button className="primary-button">Get Started</button>
                        <button className="secondary-button">I Already Have an Account</button>
                    </div>
                </div>

                <div className="duoclongo-mascot">
                    <Mascot mascotType="maracas" size={320} flipped={true} animationType="wiggle" />
                </div>

            </section>

            <section className="features-section">

            </section>
        </main>
    );
}

export default Home;