import { useState, useEffect } from "react";
import { useShop } from "../contexts/GlobalContext"

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
        animation: "fadeIn 0.3s ease",
    },
    modal: {
        backgroundColor: "#fff",
        width: "100%",
        maxWidth: "520px",
        padding: "3rem 3rem 2.5rem",
        position: "relative",
        animation: "slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
    },
    closeBtn: {
        position: "absolute",
        top: "1rem",
        right: "1.25rem",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "1.4rem",
        color: "#999",
        lineHeight: 1,
        padding: "0.25rem",
        transition: "color 0.2s",
    },
    eyebrow: {
        fontFamily: "'Jost', 'Montserrat', sans-serif",
        fontSize: "0.65rem",
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#999",
        marginBottom: "1rem",
    },
    title: {
        fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
        fontSize: "2.4rem",
        fontWeight: 400,
        lineHeight: 1.15,
        color: "#111",
        margin: "0 0 1rem",
    },
    subtitle: {
        fontFamily: "'Jost', 'Montserrat', sans-serif",
        fontSize: "0.85rem",
        color: "#666",
        lineHeight: 1.65,
        margin: "0 0 2rem",
    },
    inputRow: {
        display: "flex",
        gap: "0",
        borderBottom: "1.5px solid #111",
        marginBottom: "1.5rem",
    },
    input: {
        flex: 1,
        border: "none",
        outline: "none",
        fontFamily: "'Jost', 'Montserrat', sans-serif",
        fontSize: "0.85rem",
        color: "#111",
        padding: "0.6rem 0",
        backgroundColor: "transparent",
        letterSpacing: "0.02em",
    },
    submitBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Jost', 'Montserrat', sans-serif",
        fontSize: "0.75rem",
        fontWeight: 500,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#111",
        padding: "0.6rem 0 0.6rem 1rem",
        whiteSpace: "nowrap",
        transition: "opacity 0.2s",
    },
    error: {
        fontFamily: "'Jost', 'Montserrat', sans-serif",
        fontSize: "0.75rem",
        color: "#c0392b",
        marginTop: "-1.2rem",
        marginBottom: "1rem",
    },
    privacy: {
        fontFamily: "'Jost', 'Montserrat', sans-serif",
        fontSize: "0.72rem",
        color: "#aaa",
        lineHeight: 1.6,
    },
    // Thank you state
    thankYouWrapper: {
        textAlign: "center",
        padding: "1rem 0",
    },
    checkmark: {
        width: "48px",
        height: "48px",
        border: "1.5px solid #111",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 1.75rem",
        fontSize: "1.2rem",
    },
    thankTitle: {
        fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
        fontSize: "2rem",
        fontWeight: 400,
        color: "#111",
        margin: "0 0 0.75rem",
    },
    thankSubtitle: {
        fontFamily: "'Jost', 'Montserrat', sans-serif",
        fontSize: "0.85rem",
        color: "#666",
        lineHeight: 1.65,
        margin: "0 0 2rem",
    },
    closeTextBtn: {
        background: "none",
        border: "none",
        borderBottom: "1px solid #111",
        cursor: "pointer",
        fontFamily: "'Jost', 'Montserrat', sans-serif",
        fontSize: "0.75rem",
        fontWeight: 500,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#111",
        padding: "0.1rem 0",
    },
};

const globalCss = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
`;



export default function NewsletterPopup() {
    const [visible, setVisible] = useState(false);


    const { handleSubmit, submitted, STORAGE_KEY, email, setEmail, error, setError } = useShop()




    useEffect(() => {
        const alreadySeen = localStorage.getItem(STORAGE_KEY);
        if (!alreadySeen) {
            // Piccolo delay per non sparare il popup subito al caricamento
            const timer = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setVisible(false);
    };


    if (!visible) return null;

    return (
        <>
            <style>{globalCss}</style>
            <div style={styles.overlay} onClick={handleClose} role="dialog" aria-modal="true" aria-label="Iscriviti alla newsletter">
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <button style={styles.closeBtn} onClick={handleClose} aria-label="Chiudi">
                        ×
                    </button>

                    {!submitted ? (
                        <>
                            <p style={styles.eyebrow}>Benvenuto</p>
                            <h2 style={styles.title}>
                                Entra nel nostro
                                <br />
                                mondo esclusivo.
                            </h2>
                            <p style={styles.subtitle}>
                                Iscriviti alla newsletter e ricevi in anteprima le nuove collezioni,
                                offerte riservate e contenuti editoriali selezionati per te.
                            </p>

                            <div style={styles.inputRow}>
                                <input
                                    style={styles.input}
                                    type="email"
                                    placeholder="La tua email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError("");
                                    }}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    autoFocus
                                />
                                <button style={styles.submitBtn} onClick={handleSubmit}>
                                    Iscriviti →
                                </button>
                            </div>

                            {error && <p style={styles.error}>{error}</p>}

                            <p style={styles.privacy}>
                                Rispettiamo la tua privacy. Puoi cancellarti in qualsiasi momento.
                            </p>
                        </>
                    ) : (
                        <div style={styles.thankYouWrapper}>
                            <div style={styles.checkmark}>✓</div>
                            <h2 style={styles.thankTitle}>Grazie mille.</h2>
                            <p style={styles.thankSubtitle}>
                                Sei ufficialmente nella nostra lista. <br />
                                A presto con novità esclusive.
                            </p>
                            <button style={styles.closeTextBtn} onClick={handleClose}>
                                Continua lo shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}