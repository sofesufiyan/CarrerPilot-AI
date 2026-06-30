# 🏗️ CareerPilot AI Architecture

## Overview

CareerPilot AI is a Multi-Agent Career Intelligence Platform designed to help students from all educational backgrounds with career planning, resume improvement, interview preparation, learning roadmaps, and skill gap analysis.

The system follows a modular AI Agent architecture where specialized agents collaborate with shared tools to generate high-quality career guidance.

---

# System Architecture

```text
                    CareerPilot AI

                 React Frontend (Vite)
                          │
                          ▼
                 FastAPI Backend API
                          │
                          ▼
                Agent Orchestrator
                          │
     ┌──────────┬──────────┬──────────┬──────────┐
     │          │          │          │
 Career     Resume     Interview   Skill Gap
 Agent       Agent        Agent       Agent
     │          │          │          │
     └──────────┴──────────┴──────────┘
                    │
            Shared Tool Layer
     ┌─────────┬──────────┬───────────┐
     │         │          │
 Gemini    PDF Tool   Memory Tool
     │
 Google Gemini API
```

---

# Frontend

- React
- Vite
- Responsive UI
- Resume Upload
- Agent Activity Panel

---

# Backend

- FastAPI
- REST APIs
- Agent Routing
- Resume Processing

---

# AI Agents

Career Agent

Provides:

- Career Guidance
- Learning Suggestions
- Internship Advice
- Higher Education Guidance

Resume Agent

Provides:

- Resume Analysis
- ATS Suggestions
- Resume Improvements

Interview Agent

Provides:

- HR Interview Preparation
- Technical Interview Practice
- Mock Interview Questions

Skill Gap Agent

Provides:

- Skill Analysis
- Missing Skills
- Learning Recommendations

---

# Shared Tools

Gemini Tool

Responsible for communicating with Google Gemini.

PDF Tool

Extracts text from uploaded resumes.

Memory Tool

Stores temporary conversation context.

Agent Logger

Tracks internal workflow for display in the frontend.

---

# Workflow

1. User enters a question.

2. Frontend sends the request to FastAPI.

3. Agent Orchestrator selects the most suitable agent.

4. Selected agent prepares the prompt.

5. Shared tools are used if necessary.

6. Gemini generates the response.

7. Agent Logger records the workflow.

8. Frontend displays:

- Agent Activity
- AI Response

---

# Design Goals

- Modular
- Scalable
- Easy to extend
- Multi-Agent Architecture
- Beginner Friendly
- Fast Response Time

---

# Future Improvements

- Long-term Memory
- MCP Integration
- Voice Assistant
- Calendar Integration
- Personalized Career Dashboard
- Job Recommendation Engine
- AI Study Planner