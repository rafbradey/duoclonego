import "./Home.css";
import Mascot from "../../components/Mascot/Mascot.jsx";

function Home() {
    return (

        <main className="home-page">
            <section className="hero-section">



                <div className="duoclongo-mascot">
                    <Mascot mascotType="maracas" size={320} flipped={false} animationType="wiggle" />
                </div>


                <div className="hero-title">
                    <h1>The free, fun, and effective way to learn about the types of drugs!</h1>
                <div className="hero-actions">
                    <button className="primary-button">Get Started</button>
                    <button className="secondary-button">I Already Have an Account</button>
                </div>
                    </div>



            </section>

            <section className="features-section">

            </section>
        </main>
    );
}

export default Home;