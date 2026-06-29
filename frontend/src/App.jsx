import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/career-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Unable to connect to backend.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >
      <h1>🎓 CareerPilot AI Agent</h1>
      <p>AI-powered Career Coach • Roadmap Generator • Interview Mentor</p>

      <textarea
        rows="5"
        cols="70"
      placeholder="Example: I am a 3rd year AIML student. Create a roadmap to become an AI Engineer."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <br />
      <br />

      <div style={{ marginTop: "20px" }}>
  <button onClick={askAI}>Ask AI</button>

  <button
    style={{ marginLeft: "10px" }}
    onClick={() => {
  setQuestion("Create a 12-month AI Engineer roadmap.");
  setTimeout(() => askAI(), 100);
}}
  >
    🎯 Roadmap
  </button>
  <button
  style={{ marginLeft: "10px" }}
  onClick={() => {
    setQuestion("Review my resume for an AI Engineer role.");
    setTimeout(() => askAI(), 100);
  }}
>
  📄 Resume Review
</button>
<button
  style={{ marginLeft: "10px" }}
  onClick={() => {
    setQuestion("Conduct a mock AI Engineer interview and ask me the first question.");
    setTimeout(() => askAI(), 100);
  }}
>
  🎤 Interview Coach
</button>
<button
  style={{ marginLeft: "10px" }}
  onClick={() => {
    setQuestion("Analyze my skills for an AI Engineer role and identify my skill gaps.");
    setTimeout(() => askAI(), 100);
  }}
>
  📊 Skill Gap
</button>
</div>
      <br />
      <br />

      {loading && <h3>Thinking...</h3>}

      {!loading && answer && (
        <div
          style={{
            textAlign: "left",
            background: "#f4f4f4",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>AI Response</h3>

          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
