import { useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: #f0f4ff;
    font-family: 'Inter', sans-serif;
  }

  .app-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%);
    padding: 40px 20px 60px;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ede9fe;
    color: #7c3aed;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 999px;
    margin-bottom: 14px;
    border: 1px solid #ddd6fe;
  }

  .header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 5vw, 46px);
    color: #1e1b4b;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }

  .header p {
    margin-top: 10px;
    color: #6b7280;
    font-size: 15px;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
  }

  .card {
    background: #ffffff;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(99,102,241,0.07);
    margin-bottom: 20px;
    border: 1px solid rgba(99,102,241,0.08);
  }

  .card-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #a78bfa;
    margin-bottom: 14px;
  }

  .upload-area {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .file-input-wrapper {
    position: relative;
    flex: 1;
    min-width: 200px;
  }

  .file-input-label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 18px;
    background: #f5f3ff;
    border: 2px dashed #c4b5fd;
    border-radius: 12px;
    cursor: pointer;
    color: #7c3aed;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-input-label:hover {
    background: #ede9fe;
    border-color: #8b5cf6;
  }

  .file-input-label input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
  }

  .btn-upload {
    padding: 11px 22px;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 7px;
    box-shadow: 0 4px 14px rgba(124,58,237,0.3);
  }

  .btn-upload:hover {
    background: #6d28d9;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(124,58,237,0.38);
  }

  .btn-upload:active {
    transform: translateY(0);
  }

  .question-textarea {
    width: 100%;
    padding: 16px 18px;
    border-radius: 14px;
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    border: 2px solid #e5e7eb;
    background: #fafafa;
    color: #1f2937;
    resize: vertical;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    min-height: 110px;
    line-height: 1.6;
  }

  .question-textarea::placeholder {
    color: #9ca3af;
  }

  .question-textarea:focus {
    border-color: #8b5cf6;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(139,92,246,0.1);
  }

  .btn-ask {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    margin-top: 16px;
  }

  .btn-ask:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.45);
  }

  .btn-ask:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }

  .btn-ask:active:not(:disabled) {
    transform: translateY(0);
  }

  .answer-text {
    color: #1f2937;
    font-size: 15px;
    line-height: 1.75;
  }

  .trust-score-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .trust-score-meter {
    width: 160px;
    height: 160px;
  }

  .trust-legend {
    display: flex;
    gap: 18px;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    flex-wrap: wrap;
    justify-content: center;
  }

  .trust-legend span {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .audit-item {
    background: #fafafa;
    border: 1px solid #f3f4f6;
    padding: 18px 20px;
    border-radius: 14px;
    margin-bottom: 12px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px 16px;
    align-items: start;
    transition: box-shadow 0.18s;
  }

  .audit-item:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  }

  .audit-claim {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    grid-column: 1 / -1;
    font-style: italic;
  }

  .audit-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .audit-badge {
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .badge-supported {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }

  .badge-unsupported {
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }

  .badge-partial {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  .audit-confidence {
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    text-align: right;
  }

  .confidence-bar-track {
    width: 100%;
    height: 5px;
    background: #e5e7eb;
    border-radius: 99px;
    overflow: hidden;
    margin-top: 4px;
  }

  .confidence-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.4s ease;
  }

  .section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    color: #1e1b4b;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #ede9fe;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .results-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 640px) {
    .results-grid {
      grid-template-columns: 1fr;
    }
    .upload-area {
      flex-direction: column;
      align-items: stretch;
    }
    .btn-upload {
      justify-content: center;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2.5px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  .container {
    max-width: 780px;
    margin: 0 auto;
  }

  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
    margin: 8px 0 24px;
  }
`;

// FIX 1: matches actual backend labels — "✅ VERIFIED", "⚠ UNVERIFIED", "❌ HALLUCINATION"
function getBadgeClass(label) {
  if (!label) return "audit-badge badge-partial";
  if (label.includes("VERIFIED") && !label.includes("UNVERIFIED")) return "audit-badge badge-supported";
  if (label.includes("HALLUCINATION")) return "audit-badge badge-unsupported";
  if (label.includes("UNVERIFIED")) return "audit-badge badge-partial";
  // fallback for raw NLI labels
  const u = label.toUpperCase();
  if (u === "ENTAILMENT") return "audit-badge badge-supported";
  if (u === "CONTRADICTION") return "audit-badge badge-unsupported";
  return "audit-badge badge-partial";
}

function getConfidenceColor(score) {
  if (score >= 0.8) return "#22c55e";
  if (score >= 0.5) return "#f59e0b";
  return "#ef4444";
}

function getTrustColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [audit, setAudit] = useState([]);
  const [trustScore, setTrustScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/ask", { question });

      console.log("========== BACKEND RESPONSE ==========");
      console.log(response.data);
      console.log("Answer:", response.data.answer);
      console.log("Audit:", response.data.audit);
      console.log("Trust Score:", response.data.trust_score);
      console.log("======================================");

      setAnswer(response.data.answer);
      setAudit(response.data.audit);
      setTrustScore(response.data.trust_score);
    } catch (error) {
      console.error("FRONTEND ERROR:", error);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  const uploadPDF = async () => {
    if (!pdfFile) {
      alert("Select a PDF first");
      return;
    }
    const formData = new FormData();
    formData.append("file", pdfFile);
    try {
      const response = await axios.post("http://127.0.0.1:8000/upload", formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  // FIX 2: counters now correctly match backend label strings
  const supported = audit.filter(
    (a) => a.label?.includes("VERIFIED") && !a.label?.includes("UNVERIFIED")
  ).length;

  const unsupported = audit.filter(
    (a) => a.label?.includes("HALLUCINATION")
  ).length;

  const partial = audit.filter(
    (a) => a.label?.includes("UNVERIFIED")
  ).length;

  return (
    <>
      <style>{styles}</style>
      <div className="app-wrapper">
        <div className="container">

          <div className="header">
            <div className="header-badge">
              <span>🔍</span> AI-Powered
            </div>
            <h1>Forensic RAG Auditor</h1>
            <p>Upload a document, ask a question, and get a fully audited, trust-scored answer.</p>
          </div>

          <div className="card">
            <div className="card-label">📄 Document</div>
            <div className="upload-area">
              <div className="file-input-wrapper">
                <label className="file-input-label">
                  <span>📁</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{fileName}</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      setPdfFile(e.target.files[0]);
                      setFileName(e.target.files[0]?.name || "No file chosen");
                    }}
                  />
                </label>
              </div>
              <button className="btn-upload" onClick={uploadPDF}>
                <span>⬆</span> Upload PDF
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-label">💬 Your Question</div>
            <textarea
              className="question-textarea"
              rows="4"
              placeholder="What would you like to know about the document?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              className="btn-ask"
              onClick={askQuestion}
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <><span className="spinner" /> Analyzing...</>
              ) : (
                <><span>✦</span> Analyze & Audit</>
              )}
            </button>
          </div>

          {answer && (
            <>
              <div className="card">
                <div className="section-title">
                  <div className="section-title-icon">💡</div>
                  Generated Answer
                </div>
                <div className="divider" />
                <p className="answer-text">{answer}</p>
              </div>

              <div className="results-grid">
                <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className="section-title" style={{ marginBottom: "20px" }}>
                    <div className="section-title-icon">📊</div>
                    Trust Score
                  </div>
                  <div className="trust-score-wrapper">
                    <div className="trust-score-meter">
                      <CircularProgressbar
                        value={trustScore}
                        text={`${trustScore}%`}
                        styles={buildStyles({
                          textColor: "#1e1b4b",
                          textSize: "20px",
                          pathColor: getTrustColor(trustScore),
                          trailColor: "#e5e7eb",
                          strokeLinecap: "round",
                        })}
                      />
                    </div>
                    <div className="trust-legend">
                      <span><span className="legend-dot" style={{ background: "#22c55e" }} />High ≥ 80%</span>
                      <span><span className="legend-dot" style={{ background: "#f59e0b" }} />Medium ≥ 50%</span>
                      <span><span className="legend-dot" style={{ background: "#ef4444" }} />Low &lt; 50%</span>
                    </div>
                  </div>
                </div>

                {/* FIX 3: Claim Summary uses corrected counter variables, old .map() removed */}
                <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                  <div className="section-title" style={{ marginBottom: "14px" }}>
                    <div className="section-title-icon">🧾</div>
                    Claim Summary
                  </div>
                  <div className="divider" />
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px" }}>
                    {audit.length} claim{audit.length !== 1 ? "s" : ""} verified
                  </p>

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: "10px", background: "#dcfce7", marginBottom: "8px"
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#15803d" }}>✅ Verified</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#15803d" }}>{supported}</span>
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: "10px", background: "#fee2e2", marginBottom: "8px"
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#b91c1c" }}>❌ Hallucination</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#b91c1c" }}>{unsupported}</span>
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: "10px", background: "#fef3c7"
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#92400e" }}>⚠ Unverified</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#92400e" }}>{partial}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="section-title">
                  <div className="section-title-icon">🔬</div>
                  Audit Report
                </div>
                <div className="divider" />
                {audit.map((item, index) => (
                  <div key={index} className="audit-item">
                    <p className="audit-claim">"{item.claim}"</p>
                    <div className="audit-meta">
                      <span className={getBadgeClass(item.label)}>{item.label}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="audit-confidence">
                        {(item.score * 100).toFixed(1)}% confidence
                      </div>
                      <div className="confidence-bar-track">
                        <div
                          className="confidence-bar-fill"
                          style={{
                            width: `${(item.score * 100).toFixed(1)}%`,
                            background: getConfidenceColor(item.score),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}