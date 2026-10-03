import mascotMain from "../../assets/mascot/mascot_main.png";
import mascotFill from "../../assets/mascot/mascot_fill.png";
import "./Mascot.css";

function Mascot({
                    size = 300,
                    flipped = false,
                    mascotType = "default",
                    animationType = "bounce",
                    className = "",
                    style = {},
                }) {

    const mascotMap = {
        default: mascotMain,
        main: mascotMain,
        maracas: mascotMain,
        normal: mascotMain,
        grad: mascotMain,
        doctor: mascotMain,
        fill: mascotFill,
        shadow: mascotFill,
        silhouette: mascotFill
    };

    const mascotSrc = mascotMap[mascotType] || mascotMap.default;

    const animationClass =
        animationType === "none" ? "" : `mascot-${animationType}`;

    return (
        <div
            className={`mascot-wrapper ${animationClass} ${className}`}
            style={{ width: `${size}px`, maxWidth: "100%", ...style }}
        >
            <img
                src={mascotSrc}
                alt="LASA-Quest mascot"
                className={`mascot-image ${flipped ? "mascot-flipped" : ""}`}
            />
        </div>
    );
}

export default Mascot;