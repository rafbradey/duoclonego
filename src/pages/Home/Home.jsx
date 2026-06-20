import "./Home.css";

function Home() {
    return (

        <main className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Learn smarter, one lesson at a time.</h1>

                    <p>
                        Practice languages through short lessons, streaks, quizzes, and
                        progress tracking.
                    </p>

                    <div className="hero-actions">
                        <button className="primary-button">Get Started</button>
                        <button className="secondary-button">I Already Have an Account</button>
                    </div>
                </div>

                <div className="hero-card">
                    <h2>Today&apos;s Goal</h2>
                    <p>Complete 1 lesson to keep your streak alive.</p>

                    <div className="streak-box">
                        <span className="streak-number">🔥 3</span>
                        <span>day streak</span>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2>How it works</h2>

                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>1. Choose a course</h3>
                        <p>Pick the language or topic you want to learn.</p>
                    </div>

                    <div className="feature-card">
                        <h3>2. Finish lessons</h3>
                        <p>Answer short questions and unlock the next level.</p>
                    </div>

                    <div className="feature-card">
                        <h3>3. Track progress</h3>
                        <p>Earn XP, maintain streaks, and view your learning path.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;