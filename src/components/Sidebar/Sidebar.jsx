import "./Sidebar.css"
import {Link} from "react-router";
import SidebarNav from "../../components/SidebarNav/SidebarNav.jsx";
import {
    BookOpen,
    Dumbbell,
    Trophy,
    ShoppingBag,
    Medal,
    User,
    MoreHorizontal
} from "lucide-react";

function Sidebar(){
    return(

        <aside className="sidebar">
            <div className="sidebar-header">
             <Link to="/learn" className="navbar-logo heading-md">duoclongo</Link>
            </div>

            <ul className="bar-links">
                <SidebarNav icon={BookOpen} iconSize={24} link="/learn" text="LEARN"/>
                <SidebarNav icon={Dumbbell} iconSize={24} link="/practice" text="PRACTICE" />
                <SidebarNav icon={Trophy} iconSize={24} link="/quests" text="QUESTS" />
                <SidebarNav icon={ShoppingBag} iconSize={24} link="/shop" text="SHOP" />
                <SidebarNav icon={Medal} iconSize={24} link="/leaderboards" text="LEADERBOARDS" />
                <SidebarNav icon={User} iconSize={24} link="/profile" text="PROFILE" />
                <SidebarNav icon={MoreHorizontal} iconSize={24} link="/others" text="OTHERS" />

            </ul>

        </aside>
    )
}

export default Sidebar;