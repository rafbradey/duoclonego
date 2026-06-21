import {Link} from "react-router";
import "./Navbar.css"
import Mascot from "../Mascot/Mascot.jsx"

function Navbar(){
    return(
        <nav className="navbar-main">
            <div className="navbar-title-icon">
            <div className="navbar-icon">
                <Mascot mascotType="default" size={48} flipped={false} animationType="none" />
            </div>
            <div className="navbar-title">
            <Link to="/" className="navbar-logo">Duoclongo
        </Link>
            </div>
            </div>


            <div className="navbar-links">
                {/*
                <Link to="/learn" className="links">Learn</Link>
                <Link to="/practice">Practice</Link>
                <Link to="/quests">Quests</Link>
                <Link to="/profile">Profile</Link>
                */}
            </div>

        </nav>
    )
}

export default Navbar