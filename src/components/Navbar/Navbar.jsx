import {Link} from "react-router";
import "./Navbar.css"
import Mascot from "../Mascot/Mascot.jsx"

function Navbar(){
    return(
        <nav className="navbar-main">
            <div className="navbar-title-icon">
            <div className="navbar-icon">
                <Mascot mascotType="shadow" size={48} flipped={false} animationType="none" />
            </div>
            <div className="navbar-title">
            <Link to="/" className="navbar-logo heading-md">duoclongo
        </Link>
            </div>
            </div>

            <div className="navbar-language">
                SITE LANGUAGE: English
            </div>
            {/*
            <div className="navbar-links">

                <Link to="/learn" className="links">Learn</Link>
                <Link to="/practice">Practice</Link>
                <Link to="/quests">Quests</Link>
                <Link to="/profile">Profile</Link>

            </div>
        */}
        </nav>
    )
}

export default Navbar