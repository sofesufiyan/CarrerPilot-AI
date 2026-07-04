import "./App.css";
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { auth } from "./firebase/firebase";
import { generateResumePDF } from "./utils/generateResumePDF";
import Dashboard from "./components/dashboard/Dashboard";
const InterviewCoach = lazy(() => import("./components/interview/InterviewCoach"));
import TopNav from "./components/layout/TopNav";
const Roadmap = lazy(() => import("./components/dashboard/Roadmap"));
const SkillGap = lazy(() => import("./components/dashboard/SkillGap"));
import Sidebar from "./components/layout/Sidebar";
const ResumeAnalysis = lazy(() => import("./components/dashboard/ResumeAnalysis"));
import ChatInterface from "./components/chat/ChatInterface";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
function MainLayout() {
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
  const [copiedId, setCopiedId] = useState(null);
  
  // Resume Intelligence Engine State (Version 1.0)
  const [resumeHistory, setResumeHistory] = useState([]);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [viewMode, setViewMode] = useState("dashboard"); // "dashboard" | "chat" | "analysis"
  const [analysisTab, setAnalysisTab] = useState("overview"); // "overview" | "competency" | "roadmap" | "recommendations"

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadResumeHistory();
    }
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      const data = await response.json();
      if (response.ok) {
        setResumeHistory(data);
      } else {
        setHistoryError("Failed to fetch resume history.");
      }
    } catch (err) {
      setHistoryError("Network error fetching resume history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchInterviewHistory = async () => {
    try {
      const headers = {};
      const activeUser = auth.currentUser || currentUser;
      if (activeUser) {
        const token = await activeUser.getIdToken();
        headers["Authorization"] = "Bearer " + token;
      }
      const res = await fetch(API_URL + "/interview/history", {
        headers,
      });
      const data = await res.json();
      if (res.ok) {
        setInterviewHistory(data.history || []);
      }
    } catch (err) {
      setHistoryError("Failed to fetch interview history.");
    }
  };

  const askAI = async (customQuestion = null) => {
    const finalQuestion = (customQuestion || question).trim();
    if (!finalQuestion) return;

    const userMsg = {
      id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
          sender: "ai",
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
            id: crypto.randomUUID(),
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
        loadResumeHistory();
        fetchInterviewHistory();
        return true;
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: "ai",
            text: "Error analyzing resume: " + (data.detail || "Unknown server error"),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "text",
          },
        ]);
        return false;
      }
    } catch (error) {
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
      return false;
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
    setTimeout(() => {
      const textarea = document.querySelector('.floating-chat-box textarea');
      if (textarea) textarea.focus();
    }, 100);
  };

  const isChatEmpty = messages.length <= 1;

  const viewFullReport = () => {
    if (resumeHistory.length > 0) {
      setActiveAnalysis(resumeHistory[0]);
      setViewMode("analysis");
      setAnalysisTab("overview");
    }
  };

  return (
    <div className="app-wrapper">
      <div className="bg-grid"></div>
      <TopNav userEmail={currentUser?.email} onLogout={logout} />
      <div className="chat-app-container">
        {/* LEFT SIDEBAR PANEL */}
        <Sidebar
          viewMode={viewMode}
          setViewMode={setViewMode}
          loading={loading}
          uploadResume={uploadResume}
          historyLoading={historyLoading}
          historyError={historyError}
          resumeHistory={resumeHistory}
          activeAnalysis={activeAnalysis}
          setActiveAnalysis={setActiveAnalysis}
          setAnalysisTab={setAnalysisTab}
          resetChat={resetChat}
        />

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
          {viewMode === "dashboard" ? (
            <Dashboard 
              resumeHistory={resumeHistory} 
              interviewHistory={interviewHistory}
              historyLoading={historyLoading} 
              askAI={(q) => {
                setViewMode("chat");
                askAI(q);
              }}
              viewFullReport={viewFullReport}
              user={currentUser}
              setViewMode={setViewMode}
            />
          ) : viewMode === "roadmap" ? (
            <Suspense fallback={<div className="lazy-loader">Loading Roadmap...</div>}>
              <Roadmap resumeHistory={resumeHistory} setViewMode={setViewMode} />
            </Suspense>
          ) : viewMode === "skillgap" ? (
            <Suspense fallback={<div className="lazy-loader">Loading Skill Gap Analysis...</div>}>
              <SkillGap resumeHistory={resumeHistory} setViewMode={setViewMode} />
            </Suspense>
          ) : viewMode === "interview" ? (
            <Suspense fallback={<div className="lazy-loader">Loading Interview Coach...</div>}>
              <InterviewCoach refreshHistory={fetchInterviewHistory} />
            </Suspense>
          ) : viewMode === "chat" ? (
            /* ========================================================= */
            /* 1. CHAT MENTOR VIEW                                       */
            /* ========================================================= */
            <>
            <ChatInterface
              messages={messages}
              isChatEmpty={isChatEmpty}
              loading={loading}
              askAI={askAI}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
              messagesEndRef={messagesEndRef}
              question={question}
              setQuestion={setQuestion}
              handleKeyDown={handleKeyDown}
            />
          </>
          ) : (
            /* ========================================================= */
            /* 2. RESUME INTELLIGENCE ENGINE DASHBOARD                   */
            /* ========================================================= */
            <Suspense fallback={<div className="lazy-loader">Loading Resume Intelligence...</div>}>
              <ResumeAnalysis
                activeAnalysis={activeAnalysis}
                generateResumePDF={generateResumePDF}
                analysisTab={analysisTab}
                setAnalysisTab={setAnalysisTab}
              />
            </Suspense>
          )}
        </div>
      </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;