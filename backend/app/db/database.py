import sqlite3
import os
import json
import logging
import uuid
from typing import List, Dict, Any, Optional

logger = logging.getLogger("uvicorn.error")

# Place sqlite database inside a persistent local data directory
DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
DB_PATH = os.path.join(DB_DIR, "careerpilot.db")

def init_db() -> None:
    """
    Initializes the SQLite database and creates the necessary tables and indexes.
    Safe to call multiple times (creates only if missing).
    """
    os.makedirs(DB_DIR, exist_ok=True)
    with sqlite3.connect(DB_PATH, check_same_thread=False) as conn:
        cursor = conn.cursor()
        
        # Extended table schema to store original resume_text for future AI re-analysis
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS resume_analyses (
                id TEXT PRIMARY KEY,
                uid TEXT NOT NULL,
                filename TEXT NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resume_score INTEGER NOT NULL,
                ats_score INTEGER NOT NULL,
                resume_text TEXT,
                data_json TEXT NOT NULL
            )
        """)
        
        # Create index on uid for optimized retrieval queries
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_uid ON resume_analyses(uid)")
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS interview_sessions (
                id TEXT PRIMARY KEY,
                uid TEXT NOT NULL,
                role TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                type TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                average_score REAL,
                data_json TEXT NOT NULL
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_interview_uid ON interview_sessions(uid)")
        conn.commit()

def save_resume_analysis(
    uid: str,
    filename: str,
    resume_score: int,
    ats_score: int,
    resume_text: str,
    data: Dict[str, Any],
    analysis_id: Optional[str] = None
) -> str:
    """
    Saves or updates a resume analysis record in the database using context managers.
    Generates a UUID if no analysis_id is provided.
    
    Returns:
        str: The saved analysis ID.
    """
    if not analysis_id:
        analysis_id = str(uuid.uuid4())
        
    with sqlite3.connect(DB_PATH, check_same_thread=False) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO resume_analyses (id, uid, filename, resume_score, ats_score, resume_text, data_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                filename=excluded.filename,
                resume_score=excluded.resume_score,
                ats_score=excluded.ats_score,
                resume_text=excluded.resume_text,
                data_json=excluded.data_json
            """,
            (analysis_id, uid, filename, resume_score, ats_score, resume_text, json.dumps(data))
        )
        conn.commit()
        
    return analysis_id

def get_resume_history(uid: str) -> List[Dict[str, Any]]:
    """
    Retrieves all resume analysis records for a specific Firebase user UID,
    sorted by upload time in descending order.
    """
    results = []
    with sqlite3.connect(DB_PATH, check_same_thread=False) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, uid, filename, uploaded_at, resume_score, ats_score, resume_text, data_json 
            FROM resume_analyses 
            WHERE uid = ? 
            ORDER BY uploaded_at DESC
            """,
            (uid,)
        )
        rows = cursor.fetchall()
        for row in rows:
            item = dict(row)
            try:
                item["data"] = json.loads(item["data_json"])
            except Exception as e:
                logger.error(f"Failed to parse data_json for analysis {item.get('id')}: {e}")
                item["data"] = {}
            del item["data_json"]
            results.append(item)
            
    return results

def get_resume_analysis(analysis_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves a specific resume analysis record by its primary key ID.
    """
    with sqlite3.connect(DB_PATH, check_same_thread=False) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, uid, filename, uploaded_at, resume_score, ats_score, resume_text, data_json 
            FROM resume_analyses 
            WHERE id = ?
            """,
            (analysis_id,)
        )
        row = cursor.fetchone()
        if not row:
            return None
            
        item = dict(row)
        try:
            item["data"] = json.loads(item["data_json"])
        except Exception as e:
            logger.error(f"Failed to parse data_json for analysis {analysis_id}: {e}")
            item["data"] = {}
        del item["data_json"]
        
        del item["data_json"]
        
    return item

def save_interview_session(
    uid: str,
    role: str,
    difficulty: str,
    interview_type: str,
    data: Dict[str, Any],
    session_id: Optional[str] = None
) -> str:
    if not session_id:
        session_id = str(uuid.uuid4())
        
    average_score = data.get("average_score")
        
    with sqlite3.connect(DB_PATH, check_same_thread=False) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO interview_sessions (id, uid, role, difficulty, type, average_score, data_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                role=excluded.role,
                difficulty=excluded.difficulty,
                type=excluded.type,
                average_score=excluded.average_score,
                data_json=excluded.data_json
            """,
            (session_id, uid, role, difficulty, interview_type, average_score, json.dumps(data))
        )
        conn.commit()
        
    return session_id

def get_interview_history(uid: str) -> List[Dict[str, Any]]:
    results = []
    with sqlite3.connect(DB_PATH, check_same_thread=False) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, uid, role, difficulty, type, created_at, average_score, data_json 
            FROM interview_sessions 
            WHERE uid = ? 
            ORDER BY created_at DESC
            """,
            (uid,)
        )
        rows = cursor.fetchall()
        for row in rows:
            item = dict(row)
            try:
                item["data"] = json.loads(item["data_json"])
            except Exception as e:
                logger.error(f"Failed to parse data_json for interview {item.get('id')}: {e}")
                item["data"] = {}
            del item["data_json"]
            results.append(item)
            
    return results
