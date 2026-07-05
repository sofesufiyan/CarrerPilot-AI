import React, { useState } from 'react';
import { auth } from '../../firebase/firebase';
import { Mic } from 'lucide-react';
import InterviewSetup from './InterviewSetup';
import ActiveInterview from './ActiveInterview';
import InterviewReport from './InterviewReport';

const TOTAL_QUESTIONS = 4;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const InterviewCoach = ({ currentUser, refreshHistory }) => {
  const [phase, setPhase] = useState('setup'); // setup, active, report
  const [loading, setLoading] = useState(false);
  
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');
  
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  
  const [report, setReport] = useState(null);

  const handleStart = async (config) => {
    setRole(config.role);
    setDifficulty(config.difficulty);
    setType(config.type);
    setLoading(true);

    try {
      const activeUser = currentUser || auth.currentUser;
      const token = activeUser ? await activeUser.getIdToken() : "";
      
      const res = await fetch(API_URL + "/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      setCurrentQuestion(data.question);
      setCurrentIndex(0);
      setHistory([]);
      setFeedback(null);
      setPhase('active');
    } catch (err) {
      console.error(err);
      alert("Failed to start interview. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (userAnswer) => {
    setLoading(true);
    const updatedHistory = [...history, { question: currentQuestion, answer: userAnswer, score: 0 }];
    
    try {
      const activeUser = currentUser || auth.currentUser;
      const token = activeUser ? await activeUser.getIdToken() : "";

      const res = await fetch(API_URL + "/interview/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          role,
          difficulty,
          type,
          question: currentQuestion,
          user_answer: userAnswer,
          current_index: currentIndex,
          total_questions: TOTAL_QUESTIONS
        })
      });
      const data = await res.json();
      
      updatedHistory[updatedHistory.length - 1].score = data.score;
      setHistory(updatedHistory);
      setFeedback(data);

      if (data.is_complete) {
        await fetchReport(updatedHistory);
      } else {
        setCurrentQuestion(data.next_question);
        setCurrentIndex(currentIndex + 1);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate answer.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async (finalHistory) => {
    try {
      const activeUser = currentUser || auth.currentUser;
      const token = activeUser ? await activeUser.getIdToken() : "";

      const res = await fetch(API_URL + "/interview/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          role,
          difficulty,
          type,
          history: finalHistory
        })
      });
      const data = await res.json();
      setReport(data);
      setPhase('report');
      if (refreshHistory) {
        refreshHistory();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
    }
  };

  const handleRestart = () => {
    setPhase('setup');
    setReport(null);
    setHistory([]);
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto space-y-6">
      {/* Header Title block */}
      {phase === 'setup' && (
        <div className="card p-6 animate-fade-in border border-ink-200/70 shadow-soft bg-white">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shrink-0 text-white">
              <Mic className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-ink-900 text-xl">AI Mock Interviews</h2>
              <p className="text-sm text-ink-500 mt-1">
                Practice with realistic, adaptive interview scenarios. Get real-time AI feedback on your communication and technical accuracy.
              </p>
            </div>
          </div>
        </div>
      )}

      {phase === 'setup' && (
        <InterviewSetup onStart={handleStart} loading={loading} />
      )}
      
      {phase === 'active' && (
        <ActiveInterview 
          question={currentQuestion}
          feedback={feedback}
          onAnswer={handleAnswer}
          loading={loading}
          currentIndex={currentIndex}
          totalQuestions={TOTAL_QUESTIONS}
        />
      )}

      {phase === 'report' && (
        <InterviewReport 
          report={report}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default InterviewCoach;
