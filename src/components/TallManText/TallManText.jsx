import "./TallManText.css";

/**
 * Parses a drug name and renders Tall Man lettering with distinctive visual styling.
 * Recognizes multi-letter uppercase sequences within mixed-case drug names.
 */
function TallManText({ name = "", className = "" }) {
    if (!name) return null;

    // Matches sequences of uppercase letters of length 2+, or single uppercase preceded by lowercase
    const tokens = [];
    const regex = /([A-Z]{2,}|(?<=[a-z])[A-Z]+)/g;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(name)) !== null) {
        if (match.index > lastIndex) {
            tokens.push({
                text: name.slice(lastIndex, match.index),
                isTallMan: false
            });
        }
        tokens.push({
            text: match[0],
            isTallMan: true
        });
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < name.length) {
        tokens.push({
            text: name.slice(lastIndex),
            isTallMan: false
        });
    }

    // If no Tall Man pattern was matched, render normally
    if (tokens.length === 0) {
        return <span className={`tallman-text ${className}`}>{name}</span>;
    }

    return (
        <span className={`tallman-text ${className}`}>
            {tokens.map((token, index) =>
                token.isTallMan ? (
                    <strong key={index} className="tallman-highlight">
                        {token.text}
                    </strong>
                ) : (
                    <span key={index}>{token.text}</span>
                )
            )}
        </span>
    );
}

export default TallManText;
