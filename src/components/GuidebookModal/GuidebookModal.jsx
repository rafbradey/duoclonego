import { useState, useEffect } from "react";
import { X, Search, BookOpen, ExternalLink } from "lucide-react";
import { getLasaEntriesByLevel, searchLasaEntries, getSourceMetadata } from "../../services/drugService.js";
import LasaPairCard from "../LasaPairCard/LasaPairCard.jsx";
import "./GuidebookModal.css";

function GuidebookModal({ isOpen, onClose, levelId = 1, levelTitle = "Level 1" }) {
    const [entries, setEntries] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [source, setSource] = useState(null);
    const [loading, setLoading] = useState(true);

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

    // Handle search filtering
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
