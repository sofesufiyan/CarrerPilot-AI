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
  const [agentLogs, setAgentLogs] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  
  // Resume Intelligence Engine State (Version 1.0)
  const [resumeHistory, setResumeHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [viewMode, setViewMode] = useState("chat"); // "chat" | "analysis"
  const [analysisTab, setAnalysisTab] = useState("overview"); // "overview" | "competency" | "roadmap" | "recommendations"

  const messagesEndRef = useRef(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadAgentLogs();
      loadResumeHistory();
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
        headers["Authorization"] = "Bearer " + token;
      }
      const response = await fetch(API_URL + "/agent-logs", { headers });
      if (!response.ok) return;
      const data = await response.json();
      setAgentLogs(Array.isArray(data.logs) ? data.logs : []);
    } catch (error) {
      console.error("Error fetching agent logs:", error);
    }
  };

  const loadResumeHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const headers = {};
      const activeUser = auth.currentUser || currentUser;
      if (activeUser) {
        const token = await activeUser.getIdToken();
        headers["Authorization"] = "Bearer " + token;
      }
      const response = await fetch(API_URL + "/resume-history", { headers });
      if (!response.ok) {
        throw new Error("Failed to load resume history");
      }
      const data = await response.json();
      setResumeHistory(data);
    } catch (error) {
      console.error("Error fetching resume history:", error);
      setHistoryError(error.message || "Failed to retrieve history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const askAI = async (customQuestion = null) => {
    const finalQuestion = (customQuestion || question).trim();
    if (!finalQuestion) return;

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
    setViewMode("chat"); // Force jump back to chat when query is triggered

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const activeUser = auth.currentUser || currentUser;
      if (activeUser) {
        const token = await activeUser.getIdToken();
        headers["Authorization"] = "Bearer " + token;
      }

      const response = await fetch(API_URL + "/career-advice", {
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

  // Upload handles automatic triggers upon selection
  const uploadResume = async (file) => {
    if (!file) return;
    const fileName = file.name;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: "📄 Initiated Resume Scoring: " + fileName,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const headers = {};
      const activeUser = auth.currentUser || currentUser;
      if (activeUser) {
        const token = await activeUser.getIdToken();
        headers["Authorization"] = "Bearer " + token;
      }

      const response = await fetch(API_URL + "/resume-upload", {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: "Resume score calculated: " + data.resume_score + "/100. Open the Resume Intelligence tab to view the roadmap and recommendations.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "text",
          },
        ]);
        
        // Populate active metrics and switch to resume dashboard
        setActiveAnalysis(data);
        setViewMode("analysis");
        setAnalysisTab("overview");

        // Reload history sidebar
        await loadResumeHistory();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: "Error analyzing resume: " + (data.detail || "Unknown server error"),
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
    setAgentLogs([]);
    setLoading(false);
    setCopiedId(null);
    setViewMode("chat");
  };

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

        {/* AUTOMATIC RESUME SCORING ENGINE UPLOADER */}
        <div className="sidebar-section resume-uploader-section">
          <h3>📄 Resume Scoring Engine</h3>
          <p className="section-subtitle">Auto-triggers analysis upon file drop</p>
          <div className="upload-container">
            <input
              type="file"
              id="sidebar-file-upload"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadResume(file);
                }
              }}
            />
            <label htmlFor="sidebar-file-upload" className="upload-dropzone">
              <span className="upload-icon">📁</span>
              <span className="upload-text">Upload PDF Resume</span>
            </label>
          </div>
        </div>

        {/* RESUME DATABASE HISTORY LIST */}
        <div className="sidebar-section history-section">
          <h3>📜 Resume History</h3>
          {historyLoading ? (
            <div className="history-status-message">Loading history...</div>
          ) : historyError ? (
            <div className="history-status-message error">{historyError}</div>
          ) : resumeHistory.length > 0 ? (
            <div className="history-list">
              {resumeHistory.map((item) => (
                <div
                  key={item.id}
                  className={"history-item " + (activeAnalysis?.id === item.id && viewMode === "analysis" ? "active" : "")}
                  onClick={() => {
                    setActiveAnalysis(item);
                    setViewMode("analysis");
                    setAnalysisTab("overview");
                  }}
                >
                  <div className="history-item-header">
                    <span className="history-name" title={item.filename}>{item.filename}</span>
                    <span className="history-date">
                      {item.generated_at ? new Date(item.generated_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="history-scores">
                    <span className="history-score-badge quality-badge">
                      Resume: {item.resume_score}
                    </span>
                    <span className="history-score-badge ats-badge">
                      ATS: {item.ats_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="history-status-message empty">No resumes scored yet</div>
          )}
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
        {/* INTERACTIVE WORKSPACE TABS */}
        <header className="workspace-tabs-header">
          <button
            className={"tab-toggle-btn " + (viewMode === "chat" ? "active" : "")}
            onClick={() => setViewMode("chat")}
          >
            💬 Chat Mentor
          </button>
          {activeAnalysis && (
            <button
              className={"tab-toggle-btn " + (viewMode === "analysis" ? "active" : "")}
              onClick={() => setViewMode("analysis")}
            >
              📊 Resume Intelligence ({activeAnalysis.filename})
            </button>
          )}
        </header>

        {/* VIEW CONTAINER */}
        <div className="workspace-view-content">
          {viewMode === "chat" ? (
            /* ========================================================= */
            /* 1. CHAT MENTOR VIEW                                       */
            /* ========================================================= */
            <div className="chat-message-area">
              {isChatEmpty ? (
                <div className="chat-welcome-container">
                  <div className="welcome-hero">
                    <h1>Unlock Your Career Potential</h1>
                    <p>
                      Receive personalized learning paths, resume optimization, mock interviews, and
                      technical gap analysis driven by cooperative AI agents.
                    </p>
                  </div>

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
                <div className="chat-thread">
                  {messages.map((msg) => (
                    <div key={msg.id} className={"message-row " + msg.sender + "-row"}>
                      <div className="message-wrapper">
                        <div className="message-bubble-header">
                          <span className="sender-label">
                            {msg.sender === "ai" ? "🤖 CareerPilot Mentor" : "👤 You"}
                          </span>
                          <span className="message-timestamp">{msg.timestamp}</span>
                        </div>
                        <div className={"message-bubble " + msg.sender + "-bubble"}>
                          <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                        </div>
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
                  ))}
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
          ) : (
            /* ========================================================= */
            /* 2. RESUME INTELLIGENCE ENGINE DASHBOARD                   */
            /* ========================================================= */
            <div className="resume-dashboard-view">
              <header className="analysis-sub-header">
                <div className="sub-header-details">
                  <h2>{activeAnalysis.filename}</h2>
                  <span>Analyzed on {activeAnalysis.generated_at ? new Date(activeAnalysis.generated_at).toLocaleString() : ""}</span>
                </div>
                <div className="analysis-tabs">
                  <button
                    className={"analysis-tab-btn " + (analysisTab === "overview" ? "active" : "")}
                    onClick={() => setAnalysisTab("overview")}
                  >
                    📈 Overview
                  </button>
                  <button
                    className={"analysis-tab-btn " + (analysisTab === "competency" ? "active" : "")}
                    onClick={() => setAnalysisTab("competency")}
                  >
                    🏆 Competency Matrix
                  </button>
                  <button
                    className={"analysis-tab-btn " + (analysisTab === "roadmap" ? "active" : "")}
                    onClick={() => setAnalysisTab("roadmap")}
                  >
                    🗺️ Skill Gap & Roadmap
                  </button>
                  <button
                    className={"analysis-tab-btn " + (analysisTab === "recommendations" ? "active" : "")}
                    onClick={() => setAnalysisTab("recommendations")}
                  >
                    🚀 Career Accelerators
                  </button>
                </div>
              </header>

              <div className="analysis-tab-content">
                {/* A. OVERVIEW TAB */}
                {analysisTab === "overview" && (
                  <div className="overview-tab-pane">
                    <div className="scores-hero-row">
                      <div className="hero-score-card circular-score-wrapper">
                        <h3>Resume Quality</h3>
                        <div className="score-percentage-circle quality-circle">
                          <svg viewBox="0 0 36 36" className="circular-chart">
                            <path
                              className="circle-bg"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="circle"
                              strokeDasharray={activeAnalysis.resume_score + ", 100"}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage">
                              {activeAnalysis.resume_score}%
                            </text>
                          </svg>
                        </div>
                      </div>

                      <div className="hero-score-card circular-score-wrapper">
                        <h3>ATS Readiness</h3>
                        <div className="score-percentage-circle ats-circle">
                          <svg viewBox="0 0 36 36" className="circular-chart">
                            <path
                              className="circle-bg"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="circle"
                              strokeDasharray={activeAnalysis.ats_score + ", 100"}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage">
                              {activeAnalysis.ats_score}%
                            </text>
                          </svg>
                        </div>
                      </div>

                      <div className="hero-score-card text-score-wrapper">
                        <h3>AI Confidence</h3>
                        <div className="confidence-numeric-box">
                          <span className="confidence-number">
                            {activeAnalysis.confidence_score || 0}%
                          </span>
                          <p className="confidence-subtitle">Profile Match Confidence</p>
                        </div>
                      </div>
                    </div>

                    <div className="overview-ai-explanation">
                      <h3>💡 AI Career Mentor Analysis</h3>
                      <p className="explanation-paragraph">{activeAnalysis.ai_explanation}</p>
                    </div>
                  </div>
                )}

                {/* B. COMPETENCY MATRIX TAB */}
                {analysisTab === "competency" && (
                  <div className="competency-tab-pane">
                    <div className="competency-skills-matrix">
                      <div className="skills-matrix-column">
                        <h3>🛠️ Extracted Technical Skills</h3>
                        <div className="skills-tag-group">
                          {activeAnalysis.technical_skills?.length > 0 ? (
                            activeAnalysis.technical_skills.map((skill, idx) => (
                              <span key={idx} className="matrix-skill-tag technical-tag">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="empty-state-label">No technical skills detected</span>
                          )}
                        </div>
                      </div>

                      <div className="skills-matrix-column">
                        <h3>👥 Extracted Soft Skills</h3>
                        <div className="skills-tag-group">
                          {activeAnalysis.soft_skills?.length > 0 ? (
                            activeAnalysis.soft_skills.map((skill, idx) => (
                              <span key={idx} className="matrix-skill-tag soft-tag">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="empty-state-label">No soft skills detected</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="strengths-weaknesses-comparison-grid">
                      <div className="comparison-card strengths-card">
                        <h3>💪 Strengths & Achievements</h3>
                        <ul>
                          {activeAnalysis.strengths?.length > 0 ? (
                            activeAnalysis.strengths.map((str, idx) => <li key={idx}>{str}</li>)
                          ) : (
                            <li>No strengths logged</li>
                          )}
                        </ul>
                      </div>

                      <div className="comparison-card weaknesses-card">
                        <h3>⚠️ Improvement Areas</h3>
                        <ul>
                          {activeAnalysis.weaknesses?.length > 0 ? (
                            activeAnalysis.weaknesses.map((weak, idx) => <li key={idx}>{weak}</li>)
                          ) : (
                            <li>No improvement areas logged</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* C. SKILL GAP & ROADMAP TAB */}
                {analysisTab === "roadmap" && (
                  <div className="roadmap-tab-pane">
                    <div className="gaps-suggestions-row">
                      <div className="gap-card">
                        <h3>🔴 Missing Gaps</h3>
                        <p className="gap-subtitle">Required skills missing from your resume</p>
                        <div className="skills-tag-group">
                          {activeAnalysis.missing_skills?.length > 0 ? (
                            activeAnalysis.missing_skills.map((skill, idx) => (
                              <span key={idx} className="matrix-skill-tag gap-tag">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="empty-state-label text-green">No major skill gaps detected!</span>
                          )}
                        </div>
                      </div>

                      <div className="suggestions-card">
                        <h3>Suggestions & Fixes</h3>
                        <ul>
                          {activeAnalysis.suggestions?.length > 0 ? (
                            activeAnalysis.suggestions.map((sug, idx) => <li key={idx}>{sug}</li>)
                          ) : (
                            <li>Resume matches target roles cleanly.</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="roadmap-timeline-section">
                      <h3>🗺️ Personalized Learning Roadmap</h3>
                      <p className="roadmap-subtitle">Follow these 6 sequential steps to close your skill gaps</p>
                      
                      <div className="timeline-container">
                        {activeAnalysis.roadmap?.length > 0 ? (
                          activeAnalysis.roadmap.map((step, idx) => (
                            <div key={idx} className="timeline-step-row">
                              <div className="timeline-badge">{idx + 1}</div>
                              <div className="timeline-body-card">
                                <p>{step}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty-logs">No learning steps generated</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* D. CAREER ACCELERATORS TAB */}
                {analysisTab === "recommendations" && (
                  <div className="accelerators-tab-pane">
                    <div className="accelerator-section">
                      <h3>🎯 Recommended Job Roles</h3>
                      <div className="accelerator-grid roles-grid">
                        {activeAnalysis.recommended_roles?.length > 0 ? (
                          activeAnalysis.recommended_roles.map((role, idx) => (
                            <div key={idx} className="accelerator-card role-card">
                              <h4>{role.title}</h4>
                              <div className="role-meta-row">
                                <span className="salary-meta">💵 {role.salary_range}</span>
                                <span className="match-meta">🎯 {role.match_percentage}% Match</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty-state-label">No recommended job roles</div>
                        )}
                      </div>
                    </div>

                    <div className="accelerator-section">
                      <h3>🏅 Recommended Certifications</h3>
                      <div className="accelerator-grid certs-grid">
                        {activeAnalysis.recommended_certifications?.length > 0 ? (
                          activeAnalysis.recommended_certifications.map((cert, idx) => (
                            <div key={idx} className="accelerator-card cert-card">
                              <h4>{cert.name}</h4>
                              <div className="cert-meta-row">
                                <span className="provider-meta">🏢 {cert.provider}</span>
                                <span className="difficulty-meta">⚡ {cert.difficulty}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty-state-label">No certifications recommended</div>
                        )}
                      </div>
                    </div>

                    <div className="accelerator-section">
                      <h3>📁 Recommended Portfolio Projects</h3>
                      <div className="accelerator-grid projects-grid">
                        {activeAnalysis.recommended_projects?.length > 0 ? (
                          activeAnalysis.recommended_projects.map((proj, idx) => (
                            <div key={idx} className="accelerator-card project-card">
                              <h4>{proj.title}</h4>
                              <p>{proj.description}</p>
                              <div className="project-stack-tags">
                                {proj.tech_stack?.map((tech, i) => (
                                  <span key={i} className="tech-badge">{tech}</span>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty-state-label">No portfolio projects recommended</div>
                        )}
                      </div>
                    </div>

                    <div className="accelerator-section">
                      <h3>📚 Recommended Learning Center</h3>
                      <div className="resources-list-group">
                        {activeAnalysis.learning_resources?.length > 0 ? (
                          activeAnalysis.learning_resources.map((res, idx) => (
                            <a
                              key={idx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="resource-item-link"
                            >
                              <div className="resource-link-content">
                                <span className="resource-type-icon">
                                  {res.type === "Course" ? "🎓" : res.type === "Documentation" ? "📖" : "🔗"}
                                </span>
                                <div className="resource-texts">
                                  <strong>{res.title}</strong>
                                  <span>Type: {res.type}</span>
                                </div>
                              </div>
                              <span className="arrow-icon">➔</span>
                            </a>
                          ))
                        ) : (
                          <div className="empty-state-label">No learning resources recommended</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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