import {Link} from "react-router";
import "./Navbar.css"

function Navbar(){
    return(
        <nav className="navbar-main">
            <div className="navbar-icon">

            <Link to="/" className="navbar-logo">Duoclongo
        </Link>
            </div>

            <div className="navbar-links">
                <Link to="/learn" className="links">Learn</Link>
                <Link to="/practice">Practice</Link>
                <Link to="/quests">Quests</Link>
                <Link to="/profile">Profile</Link>
            </div>

        </nav>
    )
}

export default Navbar