import { useState } from "react";

const ANKI_URL = "http://localhost:8765";

async function ankiRequest(action, params = {}) {
  const res = await fetch(ANKI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version: 6, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

export default function AnkiSender() {
  const [recto, setRecto] = useState("");
  const [verso, setVerso] = useState("");
  const [tags, setTags] = useState("crm");
  const [deck, setDeck] = useState("Business::CRM");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function sendCard() {
    if (!recto.trim() || !verso.trim()) {
      setStatus({ ok: false, msg: "Recto et Verso requis." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      // Ensure deck exists
      await ankiRequest("createDeck", { deck });

      await ankiRequest("addNote", {
        note: {
          deckName: deck,
          modelName: "Basique",
          fields: { Recto: recto, Verso: verso },
          tags: tags.split(" ").filter(Boolean),
          options: { allowDuplicate: false },
        },
      });

      setStatus({ ok: true, msg: "✅ Carte ajoutée dans Anki !" });
      setRecto("");
      setVerso("");
    } catch (e) {
      setStatus({ ok: false, msg: `❌ Erreur : ${e.message}` });
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    background: "#1a1a2e",
    border: "1px solid #2d2d4e",
    borderRadius: "8px",
    color: "#e0e0f0",
    padding: "10px 14px",
    fontSize: "14px",
    fontFamily: "'JetBrains Mono', monospace",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a3e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'JetBrains Mono', monospace",
      padding: "24px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />

      <div style={{
        width: "100%",
        maxWidth: "560px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "32px",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontSize: "22px" }}>🃏</span>
            <h1 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
              Anki Card Sender
            </h1>
          </div>
          <p style={{ color: "#6060a0", fontSize: "12px", margin: 0 }}>
            Envoie directement dans Anki via AnkiConnect
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Deck & Tags row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ color: "#8080c0", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", display: "block", marginBottom: "6px" }}>DECK</label>
              <input
                value={deck}
                onChange={e => setDeck(e.target.value)}
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>
            <div>
              <label style={{ color: "#8080c0", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", display: "block", marginBottom: "6px" }}>TAGS</label>
              <input
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="tag1 tag2"
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>
          </div>

          {/* Recto */}
          <div>
            <label style={{ color: "#8080c0", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", display: "block", marginBottom: "6px" }}>RECTO</label>
            <textarea
              rows={3}
              value={recto}
              onChange={e => setRecto(e.target.value)}
              placeholder="Question / stimulus..."
              style={inputStyle}
            />
          </div>

          {/* Verso */}
          <div>
            <label style={{ color: "#8080c0", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", display: "block", marginBottom: "6px" }}>VERSO</label>
            <textarea
              rows={5}
              value={verso}
              onChange={e => setVerso(e.target.value)}
              placeholder="Définition + 🧠 image mentale..."
              style={inputStyle}
            />
          </div>

          {/* Status */}
          {status && (
            <div style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: status.ok ? "rgba(0,255,100,0.08)" : "rgba(255,60,60,0.08)",
              border: `1px solid ${status.ok ? "rgba(0,255,100,0.2)" : "rgba(255,60,60,0.2)"}`,
              color: status.ok ? "#00e676" : "#ff5252",
              fontSize: "13px",
            }}>
              {status.msg}
            </div>
          )}

          {/* Button */}
          <button
            onClick={sendCard}
            disabled={loading}
            style={{
              background: loading ? "#2d2d4e" : "linear-gradient(135deg, #5c5cff, #9c5cff)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.5px",
              transition: "opacity 0.2s",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Envoi en cours..." : "→ Envoyer dans Anki"}
          </button>
        </div>

        <p style={{ color: "#3a3a6a", fontSize: "11px", textAlign: "center", marginTop: "20px", marginBottom: 0 }}>
          Anki doit être ouvert · AnkiConnect requis · localhost:8765
        </p>
      </div>
    </div>
  );
}