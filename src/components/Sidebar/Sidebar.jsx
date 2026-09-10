import "./Sidebar.css";
import { Link } from "react-router";
import SidebarNav from "../SidebarNav/SidebarNav.jsx";
import Mascot from "../Mascot/Mascot.jsx";
import {
    BookOpen,
    Dumbbell,
    Trophy,
    ShoppingBag,
    Medal,
    User,
    FileText
} from "lucide-react";

function Sidebar() {
    return (
        <aside className="sidebar" aria-label="Main Navigation">
            <div className="sidebar-header">
                <Link to="/learn" className="sidebar-logo-link">
                    <Mascot mascotType="shadow" size={36} flipped={false} animationType="none" />
                    <span className="sidebar-logo-text">duoclongo</span>
                </Link>
            </div>

            <nav className="sidebar-nav">
                <ul className="sidebar-links-list">
                    <SidebarNav icon={BookOpen} iconSize={24} link="/learn" text="LEARN" />
                    <SidebarNav icon={Dumbbell} iconSize={24} link="/practice" text="PRACTICE" />
                    <SidebarNav icon={Trophy} iconSize={24} link="/quests" text="QUESTS" />
                    <SidebarNav icon={Medal} iconSize={24} link="/leaderboards" text="LEADERBOARDS" />
                    <SidebarNav icon={ShoppingBag} iconSize={24} link="/shop" text="SHOP" />
                    <SidebarNav icon={User} iconSize={24} link="/profile" text="PROFILE" />
                    <SidebarNav icon={FileText} iconSize={24} link="/documentation" text="DOCS" />
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;