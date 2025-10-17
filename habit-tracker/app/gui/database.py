import sqlite3
from contextlib import contextmanager
from pathlib import Path

DB_PATH = Path(__file__).parent / "habits.db"

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# Define all tables and columns
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
SCHEMA = {
    # User Settings
    "settings": {
        "key": "TEXT PRIMARY KEY",
        "value": "TEXT",
    },
    
    # Each task definition (e.g., “Drink Water”, “Go for Walk”)
    "tasks": {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "name": "TEXT NOT NULL UNIQUE",
        "description": "TEXT",
        "category": "TEXT",
        "frequency": "TEXT DEFAULT 'daily'",  # daily / weekly / custom
        "active": "INTEGER DEFAULT 1",        # 1 = active, 0 = archived
        "created_at": "DATE DEFAULT CURRENT_DATE",
    },

    # Each time a task is done
    "task_log": {
        "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        "task_id": "INTEGER NOT NULL",
        "completed_at": "DATETIME DEFAULT CURRENT_TIMESTAMP",
        "notes": "TEXT",
        "FOREIGN KEY(task_id)": "REFERENCES tasks(id) ON DELETE CASCADE",
    },


}

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# Schema auto-check / migrate
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
def ensure_schema():
    with get_db() as db:
        for table, cols in SCHEMA.items():
            # Create table if it doesn't exist
            column_defs = ", ".join(f"{k} {v}" for k, v in cols.items())
            db.execute(f"CREATE TABLE IF NOT EXISTS {table} ({column_defs})")

            # Add missing columns if needed
            existing = {row["name"] for row in db.execute(f"PRAGMA table_info({table})")}
            for col, coltype in cols.items():
                if col not in existing and not col.startswith("FOREIGN"):
                    print(f"[DB] Adding missing column '{col}' to {table}")
                    db.execute(f"ALTER TABLE {table} ADD COLUMN {col} {coltype}")

ensure_schema()

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# General helpers
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-import sqlite3

def insert(table: str, **values):
    cols = ", ".join(values.keys())
    placeholders = ", ".join("?" for _ in values)
    with get_db() as db:
        db.execute(
            f"INSERT INTO {table} ({cols}) VALUES ({placeholders})",
            tuple(values.values()),
        )

def insert_and_return_id(table: str, **values) -> int:
    """Thread-safe insert that returns the new row ID."""
    cols = ", ".join(values.keys())
    placeholders = ", ".join("?" for _ in values)
    with get_db() as db:
        cur = db.execute(
            f"INSERT INTO {table} ({cols}) VALUES ({placeholders})",
            tuple(values.values()),
        )
        return cur.lastrowid

def insert_or_update(table:str, **values):
    cols = ", ".join(values.keys())
    placeholders = ", ".join("?" for _ in values)
    with get_db() as db:
        cur = db.execute(
            f"INSERT OR REPLACE INTO {table} ({cols}) VALUES ({placeholders})",
            tuple(values.values()),
        )
        return cur.lastrowid

def insert_or_update_rows(table:str, *values:list[dict]):
    with get_db() as db:
        for row_values in values:
            cols = ", ".join(row_values.keys())
            placeholders = ", ".join("?" for _ in row_values)
            # -=-=- #
            cur = db.execute(
                f"INSERT OR REPLACE INTO {table} ({cols}) VALUES ({placeholders})",
                tuple(row_values.values()),
            )

def fetch_all(table: str, where: str = None, params: tuple = ()):
    with get_db() as db:
        q = f"SELECT * FROM {table}"
        if where:
            q += f" WHERE {where}"
        rows = db.execute(q, params).fetchall()
        return [dict(r) for r in rows]

def update(table: str, where: str, params: tuple, **values):
    set_clause = ", ".join(f"{k}=?" for k in values)
    with get_db() as db:
        db.execute(
            f"UPDATE {table} SET {set_clause} WHERE {where}",
            tuple(values.values()) + params,
        )

def delete(table: str, where: str, params: tuple):
    with get_db() as db:
        db.execute(f"DELETE FROM {table} WHERE {where}", params)
