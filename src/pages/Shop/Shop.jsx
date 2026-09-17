import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ShoppingBag, CheckCircle, AlertCircle, X, BookOpen, Loader2 } from "lucide-react";
import { getCurrentUser } from "../../services/userService.js";
import { getShopCatalog, purchaseShopItem } from "../../services/shopService.js";
import diamondIcon from "../../assets/items/diamond.png";
import heartIcon from "../../assets/items/heart.png";
import "./Shop.css";

function Shop() {
    const [user, setUser] = useState(null);
    const [purchasingId, setPurchasingId] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            try {
                const currentUser = await getCurrentUser();
                if (isMounted) {
                    setUser(currentUser);
                }
            } catch (err) {
                console.error("Failed to load user for Shop:", err);
            }
        }

        loadUser();

        const handleUserUpdate = (e) => {
            if (e.detail?.user) {
                setUser(e.detail.user);
            }
        };

        window.addEventListener("duoclongo:user-updated", handleUserUpdate);

        return () => {
            isMounted = false;
            window.removeEventListener("duoclongo:user-updated", handleUserUpdate);
        };
    }, []);

    const handlePurchase = async (item) => {
        if (purchasingId) return;

        setPurchasingId(item.id);
        setToast(null);

        try {
            const result = await purchaseShopItem(item.id);
            setToast({
                type: "success",
                message: result.message
            });
        } catch (err) {
            setToast({
                type: "error",
                message: err.message || "Failed to complete purchase. Please try again."
            });
        } finally {
            setPurchasingId(null);
        }
    };

    const catalog = getShopCatalog(user);
    const gemBalance = user?.diamonds ?? 0;

    return (
        <div className="shop-container">
            {/* Header with Title and Gem Balance */}
            <header className="shop-header-row">
                <div className="shop-header-text">
                    <div className="subpage-title-badge">
                        <ShoppingBag size={24} className="subpage-badge-icon" />
                        <h1 className="heading-lg">Item Shop</h1>
                    </div>
                    <p className="body-text-muted">
                        Spend your earned gems on useful learning boosts and rewards.
                    </p>
                </div>

                <div className="shop-balances-group">
                    <div className="shop-balance-badge shop-hearts-badge" title="Your Remaining Hearts">
                        <img src={heartIcon} alt="Hearts" className="shop-balance-icon" />
                        <div className="shop-balance-info">
                            <span className="shop-balance-num shop-hearts-num">{user?.hearts ?? 5} / 5</span>
                            <span className="shop-balance-label">Hearts Left</span>
                        </div>
                    </div>

                    <div className="shop-balance-badge" title="Your Current Gem Balance">
                        <img src={diamondIcon} alt="Gems" className="shop-balance-icon" />
                        <div className="shop-balance-info">
                            <span className="shop-balance-num">{gemBalance.toLocaleString()}</span>
                            <span className="shop-balance-label">Gems Available</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Purchase Feedback Toast */}
            {toast && (
                <div className={`shop-toast ${toast.type === "success" ? "shop-toast-success" : "shop-toast-error"}`} role="status">
                    {toast.type === "success" ? (
                        <CheckCircle size={20} className="shop-toast-icon" />
                    ) : (
                        <AlertCircle size={20} className="shop-toast-icon" />
                    )}
                    <span>{toast.message}</span>
                    <button
                        type="button"
                        className="shop-toast-close"
                        onClick={() => setToast(null)}
                        aria-label="Dismiss message"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Catalog Section */}
            <main className="shop-section">
                <h2 className="shop-section-title">Power-Ups & Boosts</h2>

                <div className="shop-items-list">
                    {catalog.map((item) => {
                        const isPurchasingThis = purchasingId === item.id;
                        const isBusy = purchasingId !== null;

                        // Meta status display
                        let metaText = "";
                        if (item.id === "heart_refill") {
                            metaText = `Current: ${user?.hearts ?? 5} / 5 hearts`;
                        } else if (item.id === "streak_freeze") {
                            metaText = `Equipped: ${user?.streak_freeze_count ?? 0} / 2 max`;
                        }

                        // Determine button content & styling
                        let buttonContent;
                        let isButtonDisabled = !item.canBuy || isBusy;

                        if (isPurchasingThis) {
                            buttonContent = (
                                <>
                                    <Loader2 size={16} className="spin-icon" />
                                    <span>BUYING...</span>
                                </>
                            );
                        } else if (!item.canBuy) {
                            if (item.disabledReason === "Hearts are full") {
                                buttonContent = <span>FULL</span>;
                            } else if (item.disabledReason?.includes("Equipped")) {
                                buttonContent = <span>EQUIPPED</span>;
                            } else {
                                buttonContent = (
                                    <span className="shop-gem-cost">
                                        <img src={diamondIcon} alt="" className="shop-gem-cost-icon" />
                                        <span>{item.cost}</span>
                                    </span>
                                );
                            }
                        } else {
                            buttonContent = (
                                <>
                                    <span>BUY</span>
                                    <span className="shop-gem-cost">
                                        <img src={diamondIcon} alt="" className="shop-gem-cost-icon" />
                                        <span>{item.cost}</span>
                                    </span>
                                </>
                            );
                        }

                        return (
                            <div key={item.id} className="shop-item-card">
                                <div className="shop-item-card-left">
                                    <div className="shop-item-icon-wrapper">
                                        <img src={item.icon} alt={item.name} className="shop-item-icon" />
                                    </div>

                                    <div className="shop-item-details">
                                        <div className="shop-item-header">
                                            <h3 className="shop-item-title">{item.name}</h3>
                                            {item.badge && <span className="shop-item-badge">{item.badge}</span>}
                                        </div>

                                        <p className="shop-item-desc">{item.description}</p>

                                        {metaText && <span className="shop-item-meta">{metaText}</span>}
                                    </div>
                                </div>

                                <div className="shop-item-action">
                                    <button
                                        type="button"
                                        className={`duo-button ${item.canBuy ? "duo-button-primary" : "shop-buy-btn-disabled"} shop-buy-btn`}
                                        disabled={isButtonDisabled}
                                        onClick={() => handlePurchase(item)}
                                        title={item.disabledReason || `Purchase ${item.name} for ${item.cost} gems`}
                                    >
                                        {buttonContent}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Educational Economy Reinforcement Banner */}
                <aside className="shop-earn-card">
                    <div className="shop-earn-text">
                        <h3>Need More Gems?</h3>
                        <p>
                            Earn gems by completing lessons (+15), conquering Unit Mastery (+25), and practicing your LASA recognition (+5).
                        </p>
                    </div>
                    <Link to="/learn" className="duo-button duo-button-primary shop-earn-cta">
                        <BookOpen size={18} />
                        <span>START LEARNING</span>
                    </Link>
                </aside>
            </main>
        </div>
    );
}

export default Shop;