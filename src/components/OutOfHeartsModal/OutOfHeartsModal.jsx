import { Link } from "react-router";
import { Sparkles, ShoppingBag, ArrowLeft } from "lucide-react";
import heartIcon from "../../assets/items/heart.png";
import "./OutOfHeartsModal.css";

function OutOfHeartsModal({ isOpen = true, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="out-of-hearts-overlay" role="dialog" aria-modal="true" aria-labelledby="out-of-hearts-title">
            <div className="out-of-hearts-card duo-card">
                <div className="out-of-hearts-badge-wrap">
                    <img src={heartIcon} alt="Empty Heart" className="out-of-hearts-icon" />
                    <span className="out-of-hearts-zero-pill">0</span>
                </div>

                <h2 id="out-of-hearts-title" className="out-of-hearts-title heading-md">
                    You&apos;re out of hearts!
                </h2>

                <p className="out-of-hearts-desc body-text-muted">
                    Keep practicing Look-Alike & Sound-Alike pairs in the Practice Hub to earn hearts without penalties, or refill instantly in the pharmacy shop.
                </p>

                <div className="out-of-hearts-actions">
                    <Link to="/practice" className="duo-button duo-button-primary out-of-hearts-btn">
                        <Sparkles size={18} />
                        <span>PRACTICE TO EARN HEARTS</span>
                    </Link>

                    <Link to="/shop" className="duo-button duo-button-secondary out-of-hearts-btn">
                        <ShoppingBag size={18} />
                        <span>REFILL IN SHOP (350 💎)</span>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="out-of-hearts-dismiss-btn"
                    >
                        <ArrowLeft size={16} />
                        <span>Return to Learning Path</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OutOfHeartsModal;
