import { ShoppingBag, Sparkles } from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";

function Shop() {
    return (
        <div className="subpage-container">
            <header className="subpage-header">
                <div className="subpage-title-badge">
                    <ShoppingBag size={24} className="subpage-badge-icon" />
                    <h1 className="heading-lg">Item Shop</h1>
                </div>
                <p className="body-text-muted">
                    Spend your earned gems on streak freezes, mascot accessories, and bonus items.
                </p>
            </header>

            <main className="subpage-content">
                <div className="subpage-feature-card duo-card">
                    <Mascot mascotType="maracas" size={130} animationType="pop" />
                    <div className="phase-pill">
                        <Sparkles size={14} />
                        <span>SCHEDULED FOR PHASE 5</span>
                    </div>
                    <h2 className="heading-md">Mascot & Reward Shop</h2>
                    <p className="body-text-muted">
                        Spendable in-game items, heart refills, and cosmetic rewards will become available in Phase 5 after learning progression is stabilized.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Shop;