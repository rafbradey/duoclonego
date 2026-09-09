import { Link } from "react-router";
import { BookOpen } from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import "./NotFound.css";

function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-card duo-card">
                <Mascot mascotType="shadow" size={150} animationType="sleepy" />
                <h1 className="heading-xl">404</h1>
                <h2 className="heading-md">Page Not Found</h2>
                <p className="body-text-muted">
                    We couldn&apos;t find the medication or lesson you were looking for.
                </p>
                <Link to="/learn" className="duo-button duo-button-primary">
                    <BookOpen size={18} />
                    BACK TO LEARNING
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
