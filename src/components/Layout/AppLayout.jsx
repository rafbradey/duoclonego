import { Outlet } from "react-router";
import Sidebar from "../Sidebar/Sidebar.jsx";
import MobileNav from "../MobileNav/MobileNav.jsx";
import "./AppLayout.css";

function AppLayout() {
    return (
        <div className="app-layout-root">
            <Sidebar />
            <main className="app-main-viewport">
                <Outlet />
            </main>
            <MobileNav />
        </div>
    );
}

export default AppLayout;
