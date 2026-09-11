import "./SidebarNav.css"
import {NavLink} from "react-router";

function SidebarNav({ icon: Icon, iconSize = 24, link, text, onClick }) {
    return (
        <div className="bar-link-item">
            <NavLink
                to={link}
                onClick={onClick}
                className={({ isActive }) =>
                    isActive
                        ? "bar-link body-text-dark-md active"
                        : "bar-link body-text-dark-md"
                }
            >
                {Icon && (
                    <Icon
                        size={iconSize}
                        className="bar-link-icon"
                    />
                )}

                <span className="bar-link-text">
                    {text}
                </span>
            </NavLink>
        </div>
    );
}

export default SidebarNav;