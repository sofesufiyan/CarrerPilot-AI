import "./App.css";
import { useEffect, useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./firebase/firebase";

const API_URL = import.meta.env.VITE_API_URL;

const QUICK_ACTIONS = [
  {
    title: "🗺️ Learning Planner",
    description: "Create your personalized AI learning roadmap.",
    prompt: "Create a detailed 12-month roadmap to become an AI Engineer with monthly milestones, projects, and interview preparation.",
  },
  {
    title: "📄 Resume Expert",
    description: "Improve your resume and ATS score.",
    prompt: "Review my resume for an AI Engineer role and provide ATS improvements, missing skills, and recommendations.",
  },
  {
    title: "🎤 Interview Coach",
    description: "Practice HR and technical interviews.",
    prompt: "Conduct a mock AI Engineer interview. Ask one question at a time and evaluate each answer.",
  },
  {
    title: "📊 Skill Gap Analyzer",
    description: "Identify strengths and missing skills.",
    prompt: "Analyze my skills for an AI Engineer role and identify my technical and soft skill gaps with a learning plan.",
  },
];

const SUGGESTED_QUESTIONS = [
  "How can I transition from Web Development to AI/ML?",
  "What is the average roadmap to learn Deep Learning?",
  "How should I answer 'What is your greatest weakness' in an interview?",
  "What skills should a Data Analyst learn in 2026?",
];

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      sender: "ai",
      text: "Hi! I'm CareerPilot AI, your personal career mentor. How can I help you build your dream career today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadAgentLogs();
    }
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    scrollToLogEnd();
  }, [agentLogs]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToLogEnd = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadAgentLogs = async () => {
    try {
      const headers = {};
      const activeUser = auth.currentUser || currentUser;
      if (activeUser) {
        const token = await activeUser.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_URL}/agent-logs`, { headers });
      if (!response.ok) return;
      const data = await response.json();
      setAgentLogs(Array.isArray(data.logs) ? data.logs : []);
    } catch (error) {
      console.error("Error fetching agent logs:", error);
    }
  };

  const askAI = async (customQuestion = null) => {
    const finalQuestion = (customQuestion || question).trim();
    if (!finalQuestion) return;

    // Add user message to state
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: finalQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuestion) {
      setQuestion("");
    }

    setLoading(true);

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const activeUser = auth.currentUser || currentUser;
      if (activeUser) {
        const token = await activeUser.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/career-advice`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          question: finalQuestion,
        }),
      });

      const data = await response.json();
      const aiResponseText =
        data.answer || data.response || "No response received from CareerPilot AI.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
        },
      ]);

      await loadAgentLogs();
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Unable to connect to the backend. Please check your network connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async () => {
    if (!selectedFile) {
      alert("Please select a PDF resume.");
      return;
    }

    const fileName = selectedFile.name;

    // Add user upload event message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: `📄 Uploaded Resume: ${fileName}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      },
    ]);

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      const headers = {};
      const activeUser = auth.currentUser || currentUser;
      if (activeUser) {
        const token = await activeUser.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/resume-upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();
      console.log("[DEBUG] Raw API Response after response.json():", data);

      if (response.ok) {
        // Fallback processing for old backend responses that return only `{ analysis }`
        let finalData = data;
        console.log("[DEBUG] finalData:", finalData);
        let explanationText = data.ai_explanation || "";

        if (data.analysis && !data.resume_score) {
          explanationText = data.analysis;
          const scoreMatches = [...data.analysis.matchAll(/(\d+)\s*[\/|of]\s*100/gi)];
          let parsedResume = 0;
          let parsedAts = 0;

          if (scoreMatches.length >= 2) {
            parsedResume = parseInt(scoreMatches[0][1], 10);
            parsedAts = parseInt(scoreMatches[1][1], 10);
          } else if (scoreMatches.length === 1) {
            parsedResume = parseInt(scoreMatches[0][1], 10);
            parsedAts = parsedResume;
          }

          finalData = {
            filename: data.filename || fileName || "resume.pdf",
            resume_score: parsedResume,
            ats_score: parsedAts,
            technical_skills: [],
            soft_skills: [],
            strengths: [],
            weaknesses: [],
            suggestions: [],
            ai_explanation: data.analysis,
          };
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: explanationText || "Resume analyzed successfully.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "resume_analysis",
            data: finalData,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: `Error analyzing resume: ${data.error || "Unknown server error"}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "text",
          },
        ]);
      }

      await loadAgentLogs();
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Unable to complete resume upload. Please verify the backend is active.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
        },
      ]);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome-msg",
        sender: "ai",
        text: "Hi! I'm CareerPilot AI, your personal career mentor. How can I help you build your dream career today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      },
    ]);
    setQuestion("");
    setSelectedFile(null);
    setAgentLogs([]);
    setLoading(false);
    setCopiedId(null);
  };

  // Helper to determine if we should show the welcome/empty state
  const isChatEmpty = messages.length <= 1;

  return (
    <div className="chat-app-container">
      {/* LEFT SIDEBAR PANEL */}
      <aside className="chat-sidebar">
        <div className="brand-header">
          <span className="brand-logo">🚀</span>
          <div className="brand-titles">
            <h2>CareerPilot AI</h2>
            <span>FastAPI & Gemini Multi-Agent</span>
          </div>
        </div>

        <button className="new-chat-btn" onClick={resetChat}>
          <span>+</span> New Conversation
        </button>

        {/* RESUME EXPERT UPLOADER */}
        <div className="sidebar-section resume-uploader-section">
          <h3>📄 Resume Scoring Engine</h3>
          <p className="section-subtitle">Upload PDF to score and extract skills</p>
          <div className="upload-container">
            <input
              type="file"
              id="sidebar-file-upload"
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            <label htmlFor="sidebar-file-upload" className="upload-dropzone">
              <span className="upload-icon">📁</span>
              <span className="upload-text">
                {selectedFile ? selectedFile.name : "Select PDF Resume"}
              </span>
            </label>
            {selectedFile && (
              <button className="upload-action-btn" onClick={uploadResume} disabled={loading}>
                Score Resume
              </button>
            )}
          </div>
        </div>

        {/* LIVE AGENT LOGGER TERMINAL */}
        <div className="sidebar-section agent-logger-section">
          <h3>🤖 Live Agent Logs</h3>
          <div className="logger-terminal">
            {!Array.isArray(agentLogs) || agentLogs.length === 0 ? (
              <div className="empty-logs">Terminal inactive. Send queries to start.</div>
            ) : (
              agentLogs.map((log, index) => (
                <div key={index} className="log-line">
                  <span className="log-bullet">•</span> {log}
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>
        {/* USER PROFILE & LOGOUT */}
        <div className="sidebar-user-section">
          <div className="user-profile-info">
            <span className="user-avatar">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="User Avatar" className="user-avatar-img" />
              ) : (
                currentUser?.email?.substring(0, 2).toUpperCase() || "US"
              )}
            </span>
            <div className="user-details">
              <span className="user-name">{currentUser?.displayName || "User Account"}</span>
              <span className="user-email">{currentUser?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign Out">
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="chat-workspace">
        {/* MESSAGES DISPLAY */}
        <div className="chat-message-area">
          {isChatEmpty ? (
            /* EMPTY/WELCOME STATE */
            <div className="chat-welcome-container">
              <div className="welcome-hero">
                <h1>Unlock Your Career Potential</h1>
                <p>
                  Receive personalized learning paths, resume optimization, mock interviews, and
                  technical gap analysis driven by cooperative AI agents.
                </p>
              </div>

              {/* QUICK ACTIONS GRID */}
              <div className="quick-actions-section">
                <h3>Select a Quick Action</h3>
                <div className="quick-actions-grid">
                  {QUICK_ACTIONS.map((item) => (
                    <div
                      key={item.title}
                      className="quick-action-card"
                      onClick={() => askAI(item.prompt)}
                    >
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUGGESTED QUESTIONS CHIPS */}
              <div className="suggested-questions-section">
                <h3>Suggested Questions</h3>
                <div className="suggested-chips-container">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      className="suggested-question-chip"
                      onClick={() => askAI(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* CONVERSATION THREAD */
            <div className="chat-thread">
              {messages.map((msg) => {
                if (msg.type === "resume_analysis") {
                  console.log("[DEBUG] msg.data before rendering:", msg.data);
                  console.log("[DEBUG] typeof msg.data:", typeof msg.data);
                }
                // Defensive extraction of resume analysis data to prevent binding errors
                let analysisData = {};
                if (msg.type === "resume_analysis" && msg.data) {
                  try {
                    analysisData = typeof msg.data === "string" ? JSON.parse(msg.data) : msg.data;
                  } catch (e) {
                    console.error("Failed to parse resume analysis data:", e);
                  }
                }

                if (!analysisData || typeof analysisData !== "object") {
                  analysisData = {};
                }

                const resumeScore = typeof analysisData.resume_score === "number"
                  ? analysisData.resume_score
                  : parseInt(analysisData.resume_score ?? analysisData.resumeScore, 10) || 0;

                const atsScore = typeof analysisData.ats_score === "number"
                  ? analysisData.ats_score
                  : parseInt(analysisData.ats_score ?? analysisData.atsScore, 10) || 0;

                const filename = analysisData.filename ?? "resume.pdf";

                // Ensure array types defensively to prevent mapping errors on non-arrays
                const technicalSkills = Array.isArray(analysisData.technical_skills)
                  ? analysisData.technical_skills
                  : Array.isArray(analysisData.technicalSkills)
                  ? analysisData.technicalSkills
                  : [];

                const softSkills = Array.isArray(analysisData.soft_skills)
                  ? analysisData.soft_skills
                  : Array.isArray(analysisData.softSkills)
                  ? analysisData.softSkills
                  : [];

                const strengths = Array.isArray(analysisData.strengths)
                  ? analysisData.strengths
                  : [];

                const weaknesses = Array.isArray(analysisData.weaknesses)
                  ? analysisData.weaknesses
                  : [];

                const suggestions = Array.isArray(analysisData.suggestions)
                  ? analysisData.suggestions
                  : [];

                if (msg.type === "resume_analysis") {
                  console.log("[DEBUG] resumeScore:", resumeScore);
                  console.log("[DEBUG] atsScore:", atsScore);
                  console.log("[DEBUG] strengths:", strengths);
                  console.log("[DEBUG] weaknesses:", weaknesses);
                  console.log("[DEBUG] suggestions:", suggestions);
                }

                return (
                  <div key={msg.id} className={`message-row ${msg.sender}-row`}>
                    <div className="message-wrapper">
                      <div className="message-bubble-header">
                        <span className="sender-label">
                          {msg.sender === "ai" ? "🤖 CareerPilot Mentor" : "👤 You"}
                        </span>
                        <span className="message-timestamp">{msg.timestamp}</span>
                      </div>

                      <div className={`message-bubble ${msg.sender}-bubble`}>
                        {msg.type === "resume_analysis" ? (
                          /* CUSTOM RENDER FOR RESUME ANALYSIS */
                          <div className="resume-analysis-card">
                            <div className="analysis-summary-header">
                              <span className="summary-title">📄 Resume Analysis Report</span>
                              <span className="file-tag">{filename}</span>
                            </div>

                            {/* SCORE PROGRESS BARS */}
                            <div className="scores-container">
                              <div className="score-block">
                                <div className="score-label">Resume Quality</div>
                                <div className="score-bar-wrapper">
                                  <div
                                    className="score-bar-fill quality-fill"
                                    style={{ width: `${resumeScore}%` }}
                                  ></div>
                                </div>
                                <div className="score-value">{resumeScore}/100</div>
                              </div>

                              <div className="score-block">
                                <div className="score-label">ATS Readiness</div>
                                <div className="score-bar-wrapper">
                                  <div
                                    className="score-bar-fill ats-fill"
                                    style={{ width: `${atsScore}%` }}
                                  ></div>
                                </div>
                                <div className="score-value">{atsScore}/100</div>
                              </div>
                            </div>

                            {/* SKILLS CONTAINER */}
                            <div className="skills-tags-section">
                              {technicalSkills.length > 0 && (
                                <div className="skills-category">
                                  <strong>Technical:</strong>
                                  <div className="skills-tags">
                                    {technicalSkills.map((skill, i) => (
                                      <span key={i} className="skill-tag technical-tag">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {softSkills.length > 0 && (
                                <div className="skills-category">
                                  <strong>Soft Skills:</strong>
                                  <div className="skills-tags">
                                    {softSkills.map((skill, i) => (
                                      <span key={i} className="skill-tag soft-tag">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* STRENGTHS AND WEAKNESSES GRID */}
                            <div className="details-columns-grid">
                              <div className="details-column strengths-column">
                                <h5>💪 Strengths</h5>
                                <ul>
                                  {strengths.map((str, i) => (
                                    <li key={i}>{str}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="details-column weaknesses-column">
                                <h5>⚠️ Improvement Areas</h5>
                                <ul>
                                  {weaknesses.map((weak, i) => (
                                    <li key={i}>{weak}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* RECOMMENDATIONS & SUGGESTIONS */}
                            {suggestions.length > 0 && (
                              <div className="suggestions-box">
                                <h5>🚀 Mentor Recommendations</h5>
                                <ul>
                                  {suggestions.map((sug, i) => (
                                    <li key={i}>{sug}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* AI EXPLANATION */}
                            <div className="ai-explanation-box">
                              <h5>💡 AI Career Mentor Advice</h5>
                              <p className="explanation-paragraph">{msg.text}</p>
                            </div>
                          </div>
                        ) : (
                          /* PLAIN TEXT MESSAGE */
                          <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                        )}
                      </div>

                      {/* COPY BUTTON FOR AI MESSAGES */}
                      {msg.sender === "ai" && (
                        <div className="bubble-actions">
                          <button
                            className="copy-bubble-btn"
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            title="Copy advice to clipboard"
                          >
                            {copiedId === msg.id ? "✓ Copied!" : "📋 Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* ANIMATED TYPING INDICATOR */}
              {loading && (
                <div className="message-row ai-row">
                  <div className="message-wrapper">
                    <div className="message-bubble-header">
                      <span className="sender-label">🤖 CareerPilot Mentor</span>
                    </div>
                    <div className="message-bubble ai-bubble typing-indicator-bubble">
                      <div className="typing-dots">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* CHAT INPUT AREA */}
        <footer className="chat-input-panel">
          <div className="input-box-wrapper">
            <textarea
              rows={1}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about roadmaps, resumes, mock interviews, or career advice..."
              disabled={loading}
            />
            <button
              onClick={() => askAI()}
              disabled={loading || !question.trim()}
              className="send-btn"
              title="Send Message"
            >
              ➔
            </button>
          </div>
          <div className="input-footer-note">
            CareerPilot AI can make mistakes. Focus on actionable insights and verify resources.
          </div>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;