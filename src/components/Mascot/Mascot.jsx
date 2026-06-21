import mascotImage from "../../assets/duoclongo_mascot_noborder.png";
import mascotImageMaracas from "../../assets/duoclongo_mascot_maracas.png";
import "./Mascot.css";



function Mascot({
                    size = 260,
                    flipped = false,
                    mascotType = "default",
                    mascotColor = null,
                    animationType = "bounce",
                    className = "",
                }) {

    const mascotMap = {
        default: mascotImage,
        maracas: mascotImageMaracas
    }

    const mascotSrc = mascotMap[mascotType] || mascotMap.default;

    const animationClass =
        animationType === "none" ? "" : `mascot-${animationType}`;

    return (
        <div
            className={`mascot-wrapper ${animationClass} ${className}`}
            style={{ width: `${size}px` }}
        >
            <img
                src={mascotSrc}
                alt="Duoclongo mascot"
                className={`mascot-image ${flipped ? "mascot-flipped" : ""}`}
            />
        </div>
    );
}

export default Mascot;