import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, ShieldCheck, AlertTriangle, Sparkles, ArrowLeft, Cloud, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { speakDrugName, stopSpeech, isSpeechSupported } from "../../services/audioService.js";
import testPairs from "../../data/rawLasaSource_PRONUNCIATION_VERIFIED_SOURCES_FIXED.json" with { type: "json" };
import "./TtsTestPage.css";

const AZURE_VOICES = [
    { id: "en-US-JennyNeural", name: "Jenny (Neural - Female, Natural Clinical)" },
    { id: "en-US-GuyNeural", name: "Guy (Neural - Male, Natural Clinical)" },
    { id: "en-US-AriaNeural", name: "Aria (Neural - Female, Clear Enunciation)" },
    { id: "en-US-DavisNeural", name: "Davis (Neural - Male, Calm Professional)" }
];

function TtsTestPage() {
    const [voices, setVoices] = useState([]);
    const [selectedVoiceUri, setSelectedVoiceUri] = useState("");
    const [rate, setRate] = useState(0.85);
    const [activePlayingKey, setActivePlayingKey] = useState(null);
    const [azureVoice, setAzureVoice] = useState("en-US-JennyNeural");
    const [azureStatus, setAzureStatus] = useState({ configured: false, region: "", checked: false });
    const [azureError, setAzureError] = useState(null);

    const currentAudioRef = useRef(null);
    const hasBrowserSpeech = isSpeechSupported();

    // Check Azure dev server connection status
    useEffect(() => {
        fetch("/api/dev-tts/status")
            .then((r) => r.json())
            .then((data) => {
                setAzureStatus({ configured: data.configured, region: data.region, checked: true });
            })
            .catch(() => {
                setAzureStatus({ configured: false, region: "offline/unavailable", checked: true });
            });
    }, []);

    // Load available browser voices
    useEffect(() => {
        if (!hasBrowserSpeech) return;
        const loadVoices = () => {
            const v = window.speechSynthesis.getVoices();
            if (v.length > 0) {
                setVoices(v);
                const defaultVoice = v.find((voice) => voice.lang && voice.lang.startsWith("en") && !voice.name.toLowerCase().includes("whisper")) || v[0];
                if (defaultVoice) {
                    setSelectedVoiceUri(defaultVoice.voiceURI);
                }
            }
        };

        loadVoices();
        if (typeof window.speechSynthesis !== "undefined" && window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            stopAllAudio();
        };
    }, [hasBrowserSpeech]);

    const stopAllAudio = () => {
        stopSpeech();
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
        }
        setActivePlayingKey(null);
    };

    // Play via current Browser Web Speech API
    const handlePlayBrowserSpeech = (textToSpeak, keyIdentifier) => {
        if (!hasBrowserSpeech || !textToSpeak) return;

        stopAllAudio();
        setActivePlayingKey(keyIdentifier);

        const selectedVoice = voices.find((v) => v.voiceURI === selectedVoiceUri);

        const utterance = speakDrugName(textToSpeak, {
            rate: Number(rate),
            pitch: 1.0,
            onEnd: () => setActivePlayingKey(null),
            onError: () => setActivePlayingKey(null)
        });

        if (utterance && selectedVoice) {
            utterance.voice = selectedVoice;
        }
    };

    // Play via Azure AI Speech (dev middleware)
    const handlePlayAzure = async (textToSpeak, keyIdentifier) => {
        if (!textToSpeak) return;

        stopAllAudio();
        setActivePlayingKey(keyIdentifier);
        setAzureError(null);

        try {
            const res = await fetch("/api/dev-tts/azure", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: textToSpeak,
                    voice: azureVoice
                })
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson.error || `HTTP ${res.status}`);
            }

            const blob = await res.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            currentAudioRef.current = audio;

            audio.onended = () => {
                setActivePlayingKey(null);
                URL.revokeObjectURL(audioUrl);
            };

            audio.onerror = (e) => {
                setAzureError(`Audio playback error: ${e.message || "playback failed"}`);
                setActivePlayingKey(null);
            };

            await audio.play();
        } catch (err) {
            setAzureError(err.message);
            setActivePlayingKey(null);
        }
    };

    return (
        <div className="tts-test-container">
            <Link to="/learn" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", textDecoration: "none", marginBottom: "1rem", fontSize: "0.85rem", fontWeight: 700 }}>
                <ArrowLeft size={16} />
                <span>Back to Learn Path</span>
            </Link>

            <header className="tts-test-header">
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <Sparkles size={24} style={{ color: "var(--color-primary)" }} />
                    <h1 className="tts-test-title">TTS Engine Comparison: Browser vs. Azure AI Speech</h1>
                </div>
                <p className="tts-test-subtitle">
                    Side-by-side evaluation comparing the <strong>Browser Web Speech API</strong> against <strong>Azure Cognitive Services Neural TTS</strong> using verified vs. unverified pronunciation data from <code className="doc-inline-code">rawLasaSource_PRONUNCIATION_VERIFIED_SOURCES_FIXED.json</code>.
                </p>

                {/* Azure Connectivity Banner */}
                {azureStatus.checked && (
                    <div className={`tts-azure-status-bar ${azureStatus.configured ? "connected" : "disconnected"}`}>
                        {azureStatus.configured ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        <span>
                            {azureStatus.configured
                                ? `Azure AI Speech Connected: Region "${azureStatus.region}" (Credentials active via .env.local)`
                                : "Azure AI Speech Not Connected: Add AZURE_SPEECH_KEY and AZURE_SPEECH_REGION to .env.local"}
                        </span>
                    </div>
                )}

                {azureError && (
                    <div className="tts-azure-status-bar disconnected" style={{ marginTop: "0.5rem" }}>
                        <AlertTriangle size={16} />
                        <span>Azure Error: {azureError}</span>
                    </div>
                )}

                <div className="tts-global-controls">
                    {/* Azure Voice Selector */}
                    <div className="tts-control-group">
                        <label htmlFor="azure-voice-select" style={{ color: "#4da6ff" }}>
                            <Cloud size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                            Azure Voice:
                        </label>
                        <select
                            id="azure-voice-select"
                            className="tts-control-select"
                            value={azureVoice}
                            onChange={(e) => setAzureVoice(e.target.value)}
                        >
                            {AZURE_VOICES.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Browser Voice Selector */}
                    <div className="tts-control-group">
                        <label htmlFor="voice-select">Browser Voice:</label>
                        <select
                            id="voice-select"
                            className="tts-control-select"
                            value={selectedVoiceUri}
                            onChange={(e) => setSelectedVoiceUri(e.target.value)}
                        >
                            {voices.map((v) => (
                                <option key={v.voiceURI} value={v.voiceURI}>
                                    {v.name} ({v.lang})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Speed Selector */}
                    <div className="tts-control-group">
                        <label htmlFor="rate-select">Speed:</label>
                        <select
                            id="rate-select"
                            className="tts-control-select"
                            style={{ maxWidth: "100px" }}
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                        >
                            <option value={0.75}>0.75x</option>
                            <option value={0.85}>0.85x (Current Default)</option>
                            <option value={1.0}>1.0x (Normal)</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className="duo-button duo-button-secondary tts-stop-btn"
                        onClick={stopAllAudio}
                    >
                        <VolumeX size={15} />
                        <span>Stop Audio</span>
                    </button>
                </div>
            </header>

            <main>
                {testPairs.map((pair) => {
                    const isVerified = pair.VERIFIED === "YES";

                    return (
                        <article key={pair.id} className="tts-pair-card">
                            <div className="tts-pair-header">
                                <div className="tts-pair-title">
                                    Pair #{pair.id}: {pair.drug_1} / {pair.drug_2}
                                </div>
                                <span className={`tts-verification-badge ${isVerified ? "tts-badge-verified" : "tts-badge-unverified"}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                                    {isVerified ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                                    <span>{isVerified ? "VERIFIED: YES" : "VERIFIED: NO (UNVERIFIED / MANUAL REVIEW)"}</span>
                                </span>
                            </div>

                            <div className="tts-drugs-grid">
                                {/* Drug 1 */}
                                <div className="tts-drug-box">
                                    <div className="tts-drug-name-row">
                                        <span className="tts-drug-name">{pair.drug_1}</span>
                                        <span className="tts-drug-role">Drug A</span>
                                    </div>

                                    <div className="tts-field-row">
                                        <span className="tts-field-label">Reference Pronunciation:</span>
                                        <span className={`tts-phonetic-value ${!isVerified ? "unverified-val" : ""}`}>
                                            {pair.pronunciation_1 || "None provided"}
                                        </span>
                                    </div>

                                    <div className="tts-field-row">
                                        <span className="tts-field-label">Source Citation:</span>
                                        <span className="tts-source-text">
                                            {typeof pair.pronunciation_source === "object"
                                                ? pair.pronunciation_source?.drug_1
                                                : pair.pronunciation_source || "Unverified"}
                                        </span>
                                    </div>

                                    {/* Browser Web Speech API Section */}
                                    <div className="tts-engine-section">
                                        <span className="tts-engine-label label-browser">
                                            <Volume2 size={13} />
                                            Current Browser Engine (Web Speech API)
                                        </span>

                                        <button
                                            type="button"
                                            className={`tts-btn tts-btn-current ${activePlayingKey === `${pair.id}-1-raw` ? "is-active" : ""}`}
                                            onClick={() => handlePlayBrowserSpeech(pair.drug_1, `${pair.id}-1-raw`)}
                                        >
                                            <Volume2 size={15} />
                                            <span>Play Browser (Raw: "{pair.drug_1}")</span>
                                        </button>

                                        {pair.pronunciation_1 && (
                                            <button
                                                type="button"
                                                className={`tts-btn tts-btn-guided ${activePlayingKey === `${pair.id}-1-guided` ? "is-active" : ""}`}
                                                onClick={() => handlePlayBrowserSpeech(pair.pronunciation_1, `${pair.id}-1-guided`)}
                                            >
                                                <Volume2 size={15} />
                                                <span>Play Browser (Phonetic: "{pair.pronunciation_1}")</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Azure AI Speech Section */}
                                    <div className="tts-engine-section">
                                        <span className="tts-engine-label label-azure">
                                            <Cloud size={13} />
                                            Azure AI Speech (Neural Cloud)
                                        </span>

                                        <button
                                            type="button"
                                            disabled={!azureStatus.configured}
                                            className={`tts-btn tts-btn-azure ${activePlayingKey === `${pair.id}-1-azure-raw` ? "is-active" : ""}`}
                                            onClick={() => handlePlayAzure(pair.drug_1, `${pair.id}-1-azure-raw`)}
                                        >
                                            {activePlayingKey === `${pair.id}-1-azure-raw` ? <Loader2 size={15} className="animate-spin" /> : <Volume2 size={15} />}
                                            <span>Play Azure (Raw: "{pair.drug_1}")</span>
                                        </button>

                                        {pair.pronunciation_1 && (
                                            <button
                                                type="button"
                                                disabled={!azureStatus.configured}
                                                className={`tts-btn tts-btn-azure-alt ${activePlayingKey === `${pair.id}-1-azure-phonetic` ? "is-active" : ""}`}
                                                onClick={() => handlePlayAzure(pair.pronunciation_1, `${pair.id}-1-azure-phonetic`)}
                                            >
                                                {activePlayingKey === `${pair.id}-1-azure-phonetic` ? <Loader2 size={15} className="animate-spin" /> : <Volume2 size={15} />}
                                                <span>Play Azure (Phonetic: "{pair.pronunciation_1}")</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Drug 2 */}
                                <div className="tts-drug-box">
                                    <div className="tts-drug-name-row">
                                        <span className="tts-drug-name">{pair.drug_2}</span>
                                        <span className="tts-drug-role">Drug B</span>
                                    </div>

                                    <div className="tts-field-row">
                                        <span className="tts-field-label">Reference Pronunciation:</span>
                                        <span className={`tts-phonetic-value ${!isVerified ? "unverified-val" : ""}`}>
                                            {pair.pronunciation_2 || "None provided"}
                                        </span>
                                    </div>

                                    <div className="tts-field-row">
                                        <span className="tts-field-label">Source Citation:</span>
                                        <span className="tts-source-text">
                                            {typeof pair.pronunciation_source === "object"
                                                ? pair.pronunciation_source?.drug_2
                                                : pair.pronunciation_source || "Unverified"}
                                        </span>
                                    </div>

                                    {/* Browser Web Speech API Section */}
                                    <div className="tts-engine-section">
                                        <span className="tts-engine-label label-browser">
                                            <Volume2 size={13} />
                                            Current Browser Engine (Web Speech API)
                                        </span>

                                        <button
                                            type="button"
                                            className={`tts-btn tts-btn-current ${activePlayingKey === `${pair.id}-2-raw` ? "is-active" : ""}`}
                                            onClick={() => handlePlayBrowserSpeech(pair.drug_2, `${pair.id}-2-raw`)}
                                        >
                                            <Volume2 size={15} />
                                            <span>Play Browser (Raw: "{pair.drug_2}")</span>
                                        </button>

                                        {pair.pronunciation_2 && (
                                            <button
                                                type="button"
                                                className={`tts-btn tts-btn-guided ${activePlayingKey === `${pair.id}-2-guided` ? "is-active" : ""}`}
                                                onClick={() => handlePlayBrowserSpeech(pair.pronunciation_2, `${pair.id}-2-guided`)}
                                            >
                                                <Volume2 size={15} />
                                                <span>Play Browser (Phonetic: "{pair.pronunciation_2}")</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Azure AI Speech Section */}
                                    <div className="tts-engine-section">
                                        <span className="tts-engine-label label-azure">
                                            <Cloud size={13} />
                                            Azure AI Speech (Neural Cloud)
                                        </span>

                                        <button
                                            type="button"
                                            disabled={!azureStatus.configured}
                                            className={`tts-btn tts-btn-azure ${activePlayingKey === `${pair.id}-2-azure-raw` ? "is-active" : ""}`}
                                            onClick={() => handlePlayAzure(pair.drug_2, `${pair.id}-2-azure-raw`)}
                                        >
                                            {activePlayingKey === `${pair.id}-2-azure-raw` ? <Loader2 size={15} className="animate-spin" /> : <Volume2 size={15} />}
                                            <span>Play Azure (Raw: "{pair.drug_2}")</span>
                                        </button>

                                        {pair.pronunciation_2 && (
                                            <button
                                                type="button"
                                                disabled={!azureStatus.configured}
                                                className={`tts-btn tts-btn-azure-alt ${activePlayingKey === `${pair.id}-2-azure-phonetic` ? "is-active" : ""}`}
                                                onClick={() => handlePlayAzure(pair.pronunciation_2, `${pair.id}-2-azure-phonetic`)}
                                            >
                                                {activePlayingKey === `${pair.id}-2-azure-phonetic` ? <Loader2 size={15} className="animate-spin" /> : <Volume2 size={15} />}
                                                <span>Play Azure (Phonetic: "{pair.pronunciation_2}")</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </main>
        </div>
    );
}

export default TtsTestPage;
