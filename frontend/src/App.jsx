import "./App.css";
import { useEffect, useState } from "react";

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

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState("");

  const [agentLogs, setAgentLogs] = useState([]);

  useEffect(() => {
    loadAgentLogs();
  }, []);

  const loadAgentLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/agent-logs`);

      if (!response.ok) return;

      const data = await response.json();

      setAgentLogs(Array.isArray(data.logs) ? data.logs : []);
    } catch (error) {
      console.error(error);
    }
  };

  const askAI = async (customQuestion = null) => {
    const finalQuestion = (customQuestion || question).trim();

    if (!finalQuestion) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${API_URL}/career-advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: finalQuestion,
        }),
      });

      const data = await response.json();

      setAnswer(
        data.answer || data.response || "No response received from CareerPilot AI."
      );

      await loadAgentLogs();
    } catch (error) {
      console.error(error);
      setAnswer("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async () => {
    if (!selectedFile) {
      alert("Please select a PDF resume.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setResumeAnalysis("");

    try {
      const response = await fetch(`${API_URL}/resume-upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResumeAnalysis(
        data.analysis || data.result || "Resume analyzed successfully."
      );

      await loadAgentLogs();
    } catch (error) {
      console.error(error);
      setResumeAnalysis("Unable to upload resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <section className="hero">
        <h1>🚀 CareerPilot AI</h1>

        <p>Your Personal AI Career Mentor</p>

        <p>Learn • Build Skills • Crack Interviews • Get Hired</p>
      </section>

      <textarea
        rows={5}
        placeholder="Ask CareerPilot AI anything about your career..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="feature-grid">
        {QUICK_ACTIONS.map((item) => (
          <div
            key={item.title}
            className="feature-card"
            onClick={() => {
              setQuestion(item.prompt);
              askAI(item.prompt);
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={() => askAI()} disabled={loading}>
          🚀 Ask CareerPilot
        </button>
      </div>

      <div className="upload-card">
        <h2>📄 Resume Expert</h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        />

        <br />
        <br />

        <button onClick={uploadResume} disabled={loading}>
          📄 Upload Resume
        </button>
      </div>

      {loading && (
        <div className="loading">
          🤖 CareerPilot AI is thinking...
        </div>
      )}

      {!loading && agentLogs.length > 0 && (
        <div className="card">
          <h3>🤖 Multi-Agent Activity</h3>

          {agentLogs.map((log, index) => (
            <p key={index}>• {log}</p>
          ))}
        </div>
      )}

      {!loading && answer && (
        <div className="card">
          <h3>🤖 AI Response</h3>

          <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
        </div>
      )}

      {!loading && resumeAnalysis && (
        <div className="card">
          <h3>📄 Resume Analysis</h3>

          <p style={{ whiteSpace: "pre-wrap" }}>{resumeAnalysis}</p>
        </div>
      )}
    </div>
  );
}

export default App;