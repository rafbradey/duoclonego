import { useState, useEffect } from "react";
import {
    X,
    Search,
    BookOpen,
    ExternalLink,
    Type,
    ShieldAlert,
    ScanEye,
    BrainCircuit,
    Layers
} from "lucide-react";
import { getLasaEntriesByLevel, searchLasaEntries, getSourceMetadata } from "../../services/drugService.js";
import LasaPairCard from "../LasaPairCard/LasaPairCard.jsx";
import "./GuidebookModal.css";

function GuidebookModal({ isOpen, onClose, levelId = 1, levelTitle = "Level 1" }) {
    const [activeTab, setActiveTab] = useState("guide"); // "guide" | "pairs"
    const [entries, setEntries] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [source, setSource] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        async function loadData() {
            setLoading(true);
            try {
                const [pairs, sourceMeta] = await Promise.all([
                    getLasaEntriesByLevel(levelId),
                    getSourceMetadata()
                ]);
                if (isMounted) {
                    setEntries(pairs);
                    setSource(sourceMeta);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load guidebook pairs:", err);
                if (isMounted) setLoading(false);
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, [isOpen, levelId]);

    // Handle search filtering in pairs tab
    useEffect(() => {
        if (!searchQuery.trim()) {
            getLasaEntriesByLevel(levelId).then(setEntries);
            return;
        }

        let isMounted = true;
        searchLasaEntries(searchQuery).then((results) => {
            if (isMounted) setEntries(results);
        });
        return () => { isMounted = false; };
    }, [searchQuery, levelId]);

    if (!isOpen) return null;

    return (
        <div className="guidebook-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div className="guidebook-modal" onClick={(e) => e.stopPropagation()}>
                <header className="guidebook-header">
                    <div className="guidebook-header-title">
                        <BookOpen size={24} className="guidebook-header-icon" />
                        <div>
                            <h2 className="heading-md">LASA Guidebook</h2>
                            <span className="guidebook-subtitle">{levelTitle} Reference</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="guidebook-close-btn"
                        onClick={onClose}
                        aria-label="Close Guidebook"
                    >
                        <X size={24} />
                    </button>
                </header>

                {/* Guidebook Tabs */}
                <div className="guidebook-tabs" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "guide"}
                        className={`guidebook-tab-btn ${activeTab === "guide" ? "active" : ""}`}
                        onClick={() => setActiveTab("guide")}
                    >
                        <BookOpen size={16} />
                        <span>LASA Primer & Guide</span>
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "pairs"}
                        className={`guidebook-tab-btn ${activeTab === "pairs" ? "active" : ""}`}
                        onClick={() => setActiveTab("pairs")}
                    >
                        <Layers size={16} />
                        <span>Medication Pairs Reference</span>
                    </button>
                </div>

                {/* Tab 1: LASA Primer & Guide Content */}
                {activeTab === "guide" && (
                    <div className="guidebook-content guidebook-guide-tab">
                        <div className="guide-module-card">
                            <div className="guide-module-header">
                                <div className="guide-module-icon-box tallman-icon-box">
                                    <Type size={20} />
                                </div>
                                <div>
                                    <span className="guide-module-tag">Module A</span>
                                    <h3 className="guide-module-title">Tall Man Lettering</h3>
                                </div>
                            </div>
                            <p className="guide-module-text">
                                Tall Man lettering is the deliberate practice of capitalizing the selective,
                                confusable syllables of Look-Alike drug names (such as <strong>acetaZOLAMIDE</strong> vs <strong>acetoHEXAMIDE</strong> or <strong>predniSONE</strong> vs <strong>prednisoLONE</strong>).
                            </p>
                            <div className="guide-module-callout">
                                <span className="callout-label">Safety Mechanism:</span>
                                <span>Uppercase lettering disrupts automatic ocular scanning patterns, forcing clinicians to consciously register distinctive syllables before acting.</span>
                            </div>
                        </div>

                        <div className="guide-module-card">
                            <div className="guide-module-header">
                                <div className="guide-module-icon-box lasa-icon-box">
                                    <ShieldAlert size={20} />
                                </div>
                                <div>
                                    <span className="guide-module-tag">Module B</span>
                                    <h3 className="guide-module-title">LASA Medication Pairs</h3>
                                </div>
                            </div>
                            <p className="guide-module-text">
                                Look-Alike / Sound-Alike (LASA) pairs are medications that share orthographic resemblance in print and digital order screens or phonetic overlap during verbal communication.
                            </p>
                            <div className="guide-module-callout">
                                <span className="callout-label">The Risk:</span>
                                <span>A visual or phonetic confusion error can substitute drugs from completely different therapeutic classes with vastly different indications, potencies, and safety profiles.</span>
                            </div>
                        </div>

                        <div className="guide-module-card">
                            <div className="guide-module-header">
                                <div className="guide-module-icon-box recog-icon-box">
                                    <ScanEye size={20} />
                                </div>
                                <div>
                                    <span className="guide-module-tag">Module C</span>
                                    <h3 className="guide-module-title">Recognizing Confusable Features</h3>
                                </div>
                            </div>
                            <p className="guide-module-text">
                                Train your visual discrimination by dissecting drug names into three key inspection zones:
                            </p>
                            <ul className="guide-features-list">
                                <li>
                                    <strong>Prefix Variations:</strong> Contrast starting syllables and letter stems (e.g., <em>aceta-</em> vs <em>aceto-</em>, <em>arga-</em> vs <em>Aggr-</em>).
                                </li>
                                <li>
                                    <strong>Suffixes &amp; Stems:</strong> Recognize USAN pharmacological stems (e.g., <em>-zolamide</em> carbonic anhydrase inhibitor vs <em>-hexamide</em> sulfonylurea).
                                </li>
                                <li>
                                    <strong>Release Modifiers:</strong> Scrutinize release kinetics indicators (e.g., <em>XR</em>, <em>CR</em>, <em>ER</em>) and chemical modifiers (<em>for irrigation</em> vs <em>glacial</em>).
                                </li>
                            </ul>
                        </div>

                        <div className="guide-module-card">
                            <div className="guide-module-header">
                                <div className="guide-module-icon-box memorization-icon-box">
                                    <BrainCircuit size={20} />
                                </div>
                                <div>
                                    <span className="guide-module-tag">Module D</span>
                                    <h3 className="guide-module-title">Memorization &amp; Spaced Practice</h3>
                                </div>
                            </div>
                            <p className="guide-module-text">
                                Reading medication labels under high cognitive load requires rapid, automated perceptual discrimination.
                            </p>
                            <div className="guide-module-callout">
                                <span className="callout-label">Spaced Repetition Reflexes:</span>
                                <span>Repeated recognition of paired confusions and unassisted Unit Mastery challenges retrain visual reflexes to naturally trigger alarm whenever an ambiguous drug name appears.</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Medication Pairs Reference */}
                {activeTab === "pairs" && (
                    <>
                        <div className="guidebook-search-bar">
                            <Search size={18} className="guidebook-search-icon" />
                            <input
                                type="text"
                                placeholder="Search drug or confused name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="guidebook-search-input"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="guidebook-clear-btn"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="guidebook-content">
                            {loading ? (
                                <div className="guidebook-loading body-text-muted">Loading reference pairs...</div>
                            ) : entries.length === 0 ? (
                                <div className="guidebook-empty body-text-muted">
                                    No medication pairs matching &quot;{searchQuery}&quot;.
                                </div>
                            ) : (
                                <div className="guidebook-pairs-grid">
                                    {entries.map((pair) => (
                                        <LasaPairCard key={pair.id} pair={pair} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {source && (
                    <footer className="guidebook-footer">
                        <span className="guidebook-citation">
                            Source: {source.citation}
                        </span>
                        <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="guidebook-source-link"
                        >
                            <span>ISMP.org</span>
                            <ExternalLink size={14} />
                        </a>
                    </footer>
                )}
            </div>
        </div>
    );
}

export default GuidebookModal;
