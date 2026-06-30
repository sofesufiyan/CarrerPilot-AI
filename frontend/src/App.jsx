import "./App.css";
import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState("");

  const askAI = async (customQuestion = null) => {
    const finalQuestion = customQuestion || question;

    if (!finalQuestion) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/career-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: finalQuestion,
        }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Unable to connect to backend.");
    }

    setLoading(false);
  };

  const uploadResume = async () => {
    if (!selectedFile) {
      alert("Please select a PDF resume.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/resume-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResumeAnalysis(data.analysis);
    } catch (error) {
      setResumeAnalysis("Unable to upload resume.");
    }

    setLoading(false);
  };

  return (
    <div className="app">
      {/* Hero Section */}
      <div className="hero">
        <h1>🚀 CareerPilot AI</h1>

        <p>Your Personal AI Career Mentor</p>

        <p>Learn • Build Skills • Crack Interviews • Get Hired</p>
      </div>

      {/* Question Box */}
      <textarea
        rows="5"
        placeholder="Ask anything about your career..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Feature Cards */}
      <div className="feature-grid">
        <div
          className="feature-card"
          onClick={() => {
            const q = "Create a 12-month AI Engineer roadmap.";
            setQuestion(q);
            askAI(q);
          }}
        >
          <h3>🗺️ Learning Planner</h3>
          <p>Create your personalized learning roadmap.</p>
        </div>

        <div
          className="feature-card"
          onClick={() => {
            const q = "Review my resume for an AI Engineer role.";
            setQuestion(q);
            askAI(q);
          }}
        >
          <h3>📄 Resume Expert</h3>
          <p>Improve your resume and ATS score.</p>
        </div>

        <div
          className="feature-card"
          onClick={() => {
            const q =
              "Conduct a mock AI Engineer interview and ask me the first question.";
            setQuestion(q);
            askAI(q);
          }}
        >
          <h3>🎤 Interview Coach</h3>
          <p>Practice HR and technical interviews.</p>
        </div>

        <div
          className="feature-card"
          onClick={() => {
            const q =
              "Analyze my skills for an AI Engineer role and identify my skill gaps.";
            setQuestion(q);
            askAI(q);
          }}
        >
          <h3>📊 Skills Advisor</h3>
          <p>Discover your strengths and missing skills.</p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => askAI()}>
          🚀 Ask CareerPilot
        </button>
      </div>

      {/* Resume Upload */}
      <div className="upload-card">
        <h2>📄 Resume Expert</h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <br />
        <br />

        <button onClick={uploadResume}>
          📄 Upload Resume
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          🤖 CareerPilot AI is thinking...
        </div>
      )}

      {/* AI Response */}
      {!loading && answer && (
        <div className="card">
          <h3>🤖 AI Response</h3>

          <p>{answer}</p>
        </div>
      )}

      {/* Resume Response */}
      {!loading && resumeAnalysis && (
        <div className="card">
          <h3>📄 Resume Analysis</h3>

          <p>{resumeAnalysis}</p>
        </div>
      )}
    </div>
  );
}

export default App;