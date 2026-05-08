# NL2SQL — Jobs Data Warehouse Assistant

> An AI-powered assistant that translates natural language into precise SQL queries, executed against a live Jobs Data Warehouse and returned as beautiful, human-readable results.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Microsoft_SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" />
</p>

---

## Architecture Overview

```mermaid
graph TD
    %% Node Definitions
    User(["👤 User"])
    Frontend(["⚛️ React / Tailwind"])
    API(["⚡ FastAPI / Python"])
    
    subgraph AI_Layer ["&nbsp;AI Agent & Logic&nbsp;"]
        Agent(["🦜🔗 LangGraph Agent"])
        LLM(["🧠 Gemini / Ollama"])
    end

    subgraph Data_Layer ["&nbsp;Database&nbsp;"]
        DB(["🗄️ SQL Server"])
    end

    %% Connections
    User <--> Frontend
    Frontend <--> API
    API <--> Agent
    Agent <--> LLM
    Agent <--> DB

    %% Styling
    style User fill:#f9f9f9,stroke:#333,stroke-width:2px
    style Frontend fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    style API fill:#009485,stroke:#333,stroke-width:2px,color:#fff
    style Agent fill:#1C3C3C,stroke:#333,stroke-width:2px,color:#fff
    style LLM fill:#8E75B2,stroke:#333,stroke-width:2px,color:#fff
    style DB fill:#CC2927,stroke:#333,stroke-width:2px,color:#fff
```

## System Preview

<p align="center">
  <b>Frontend Interface</b><br>
  <img src="docs/frontend.png" width="800" alt="Frontend Interface Preview" />
</p>

<p align="center">
  <b>Backend Processing</b><br>
  <img src="docs/backend.png" width="800" alt="Backend Processing Preview" />
</p>

---

## How It Works

A single question goes through 8 steps before reaching the user:

1. **User Input** — User asks: *"Show me the 5 latest remote Data Engineer jobs."*
2. **API Routing** — Frontend sends a `POST` request to `/api/chat`
3. **Agent Logic** — LangGraph agent receives the query + system prompt (schema + strict rules)
4. **Tool Selection** — LLM identifies it needs the database and invokes `sql_db_query`
5. **SQL Generation** — Agent generates and executes the query:

```sql
SELECT DISTINCT fj.title, fj.company, dl.location_name, djt.job_type_name, fj.job_url
FROM gold.fact_jobs fj
JOIN gold.dim_location dl      ON fj.location_sk  = dl.location_sk
JOIN gold.dim_job_type djt     ON fj.job_type_sk  = djt.job_type_sk
JOIN gold.dim_date dd          ON fj.date_sk      = dd.date_sk
WHERE dl.is_remote = 1
  AND fj.title LIKE '%Data Engineer%'
ORDER BY dd.full_date DESC
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;
```

6. **Data Retrieval** — Database returns raw rows
7. **Response Formatting** — Agent formats data into a clean Markdown table with a summary
8. **Display** — Frontend renders interactive job cards

---

## Key Features

| Feature | Description |
| :--- | :--- |
| Natural Language to SQL | Ask questions like you're talking to a colleague — no SQL knowledge needed |
| Anti-Hallucination | Agent is forbidden from fabricating data; if it's not in the DB, it says so |
| Live Database | Queries real-time data from a SQL Server Gold schema |
| Dual LLM Support | Google Gemini 2.0 Flash (production) or Ollama Qwen2.5 (local dev) |
| Structured UI | React interface with typing indicators, job cards, and auto-formatted tables |
| Centralized Logging | Backend logs saved to `logs/backend.log` and `logs/errors.log` |

---

## Tech Stack

### Backend
- **Framework:** FastAPI
- **Orchestration:** LangChain / LangGraph
- **LLM:** Google Gemini 2.0 Flash / Ollama (Qwen2.5)
- **Database:** SQLAlchemy + pyodbc → SQL Server
- **Runtime:** Python 3.10+

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4
- **Icons:** Custom SVG components

### Data Warehouse
- **Engine:** SQL Server
- **Schema:** Star Schema
- **Tables:** `fact_jobs`, `dim_location`, `dim_job_type`, `dim_date`

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/RAG_SYSTEM.git
cd RAG_SYSTEM
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
SQL_SERVER_URL="mssql+pyodbc://user:password@host/dbname?driver=ODBC+Driver+17+for+SQL+Server"
GOOGLE_API_KEY="your_gemini_api_key"
ENV="production"             # Use 'development' for Ollama
```

Run the server:

```bash
python main.py
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## Project Structure

```
RAG_SYSTEM/
├── backend/
│   ├── main.py                        # Entry point — FastAPI app + routers
│   ├── requirements.txt
│   └── api/
│       ├── config/
│       │   ├── prompt.py              # System prompt — schema + anti-hallucination rules
│       │   ├── context_manager.py     # Lifespan — startup/shutdown + agent warm-up
│       │   ├── corsConfig.py          # CORS configuration
│       │   └── logger.py             # Centralized logging (file + console)
│       ├── llm/
│       │   ├── get_agent.py           # LangGraph ReAct agent builder
│       │   ├── get_llm.py             # LLM factory — Gemini or Ollama
│       │   └── ask.py                 # Agent invocation + response parsing
│       ├── models/
│       │   └── queryRequest.py        # Pydantic request/response schemas
│       └── routers/
│           ├── chatrouter.py          # POST /api/chat
│           ├── healthrouter.py        # GET  /api/health
│           ├── mainrouter.py          # GET  /
│           └── refreshrouter.py       # POST /api/refresh
├── frontend/
│   └── src/
│       ├── App.jsx                    # State, API calls, layout
│       ├── components/
│       │   ├── MessageBubble.jsx      # User / bot message rendering
│       │   ├── RenderMessage.jsx      # Markdown parser → job cards or plain text
│       │   ├── JobCards.jsx           # Interactive job card UI
│       │   ├── TypingIndicator.jsx    # Thinking animation
│       │   └── Icons.jsx              # SVG icon constants
│       └── utils/
│           ├── helpers.js             # getTime, extractText
│           ├── parseJobTable.js       # Markdown table → JSON
│           ├── splitAroundTable.js    # Separates text from table content
│           └── typeBadgeStyle.js      # Color coding for job types
├── logs/
│   ├── backend.log                    # All INFO+ logs
│   └── errors.log                     # ERROR+ only
└── docs/
    └── JobsDataWarehouse_README_Catalog.pdf
```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check — confirms API is live |
| `GET` | `/api/health` | Detailed health status |
| `POST` | `/api/chat` | Main endpoint — accepts `{ "query": "..." }` |
| `POST` | `/api/refresh` | Refreshes the agent / DB connection |

---

## Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `SQL_SERVER_URL` | Yes | SQLAlchemy connection string for SQL Server |
| `GOOGLE_API_KEY` | Production | Gemini API key |
| `ENV` | Yes | `production` (Gemini) or `development` (Ollama) |

---

## Logging

All backend activity is captured in `logs/` at the project root:

- `backend.log` — full log: INFO, WARNING, ERROR, CRITICAL
- `errors.log` — errors only: ERROR, CRITICAL

Logs include timestamps, log level, module name, file, and line number for easy tracing.

---

*Built for the Jobs Data Warehouse Team.*