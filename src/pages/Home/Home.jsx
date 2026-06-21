import "./Home.css";
import Mascot from "../../components/Mascot/Mascot.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";

function Home() {
    return (

        <main className="home-page">
            <Navbar />
            <section className="hero-section">

                <div className="duoclongo-mascot">
                    <Mascot mascotType="maracas" size={320} flipped={false} animationType="float" />
                </div>


                <div className="hero-title-wrapper">
                    <h1 className="hero-title heading-md">
                        The free, fun, and effective way to learn about the types of drugs!</h1>

                <div className="hero-actions">
                    <button className="primary-button duo-button">GET STARTED</button>
                    <button className="secondary-button duo-button">I ALREADY HAVE AN ACCOUNT</button>
                </div>

                </div>

            </section>


            <section className="features-section">
                <p> {'<'} </p>
                <p className="body-text-dark">DOPamine / DOBUTamine</p>
                <p className="body-text-dark">DOPamine / DOBUTamine</p>
                <p className="body-text-dark">DOPamine / DOBUTamine</p>
                <p className="body-text-dark">DOPamine / DOBUTamine</p>
                <p> {'>'} </p>


            </section>
        </main>
    );
}

export default Home;