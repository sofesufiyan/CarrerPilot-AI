# CareerPilot-AI Architecture

# Overview

CareerPilot-AI follows a layered architecture.

```
User
   │
   ▼
Frontend (HTML, CSS, JavaScript)
   │
   ▼
FastAPI Backend
   │
   ▼
Google ADK Agent
   │
   ▼
Gemini API
   │
   ▼
MCP Servers
```

---

# Components

## 1. Frontend

Responsibilities:

* User Login
* Dashboard
* Chat Interface
* Resume Upload
* Learning Roadmap
* Internship Search
* Interview Practice

Technology:

* HTML
* CSS
* JavaScript

---

## 2. Backend

Responsibilities:

* REST APIs
* User Authentication
* Request Validation
* Calling AI Agents
* Managing Sessions

Technology:

* FastAPI
* Python

---

## 3. AI Agent Layer

Responsibilities:

* Understand user questions
* Select appropriate tools
* Plan responses
* Use Gemini intelligently
* Access MCP tools

Technology:

* Google ADK

---

## 4. Gemini

Responsibilities:

* Natural language understanding
* Career guidance
* Resume suggestions
* Interview answers
* Personalized learning plans

---

## 5. MCP Servers

Future integrations:

* GitHub MCP
* Google Developer Knowledge MCP
* Google Drive MCP
* Google Docs MCP
* Web Search MCP

---

# Data Flow

1. User enters a request.
2. Frontend sends the request to FastAPI.
3. FastAPI forwards it to the ADK Agent.
4. The ADK Agent decides whether it needs Gemini or an MCP tool.
5. The response is returned to the frontend.
6. The frontend displays the result.

---

# Future Database

Later we will integrate:

* SQLite (Development)
* PostgreSQL (Production)

---

# Deployment

Frontend

↓

FastAPI Backend

↓

Google ADK

↓

Gemini API

↓

MCP Servers
