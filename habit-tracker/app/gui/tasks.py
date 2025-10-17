from datetime import datetime
from .database import (
    insert_and_return_id,
    insert_or_update_rows,
    insert_or_update,
    fetch_all,
    update,
    delete,
    get_db,
)

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# CREATE / BUILD
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

def create_task(name: str, description: str = "", category: str = None, frequency: str = "daily") -> int:
    """Create a new task and return its ID (thread-safe)."""
    return insert_and_return_id(
        "tasks",
        name=name,
        description=description,
        category=category,
        frequency=frequency,
    )

def log_completion(task_id: int, notes: str = "") -> int:
    """Log a task completion and return its ID (thread-safe)."""
    return insert_and_return_id(
        "task_log",
        task_id=task_id,
        notes=notes,
    )

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# READ / GET
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

def get_all_tasks(active_only: bool = False):
    if active_only:
        return fetch_all("tasks", "active = 1")
    return fetch_all("tasks")

def get_task(task_id: int):
    results = fetch_all("tasks", "id = ?", (task_id,))
    return results[0] if results else None

def get_recent_logs(limit: int = 20):
    return fetch_all("task_log", f"1 ORDER BY completed_at DESC LIMIT {limit}")

def get_task_logs(task_id: int, limit: int = 10):
    return fetch_all("task_log", "task_id = ? ORDER BY completed_at DESC LIMIT ?", (task_id, limit))

def get_last_completion(task_id: int):
    logs = fetch_all("task_log", "task_id = ? ORDER BY completed_at DESC LIMIT 1", (task_id,))
    return logs[0] if logs else None

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# UPDATE / MODIFY
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

def rename_task(task_id: int, new_name: str):
    update("tasks", "id = ?", (task_id,), name=new_name)

def set_task_active(task_id: int, active: bool):
    update("tasks", "id = ?", (task_id,), active=int(active))

def update_task(task_id: int, **kwargs):
    update("tasks", "id = ?", (task_id,), **kwargs)

# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# DELETE / REMOVE
# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

def delete_task(task_id: int):
    with get_db() as db:
        db.execute("DELETE FROM task_log WHERE task_id = ?", (task_id,))
        db.execute("DELETE FROM tasks WHERE id = ?", (task_id,))

# -=-=- Settings -=-=- #

def get_settings():
    results = fetch_all('settings')
    settings = {d['key']: d['value'] for d in results}
    print(results)
    print(settings)
    return settings

def set_setting(setting:str, value:str):
    insert_or_update('settings', key=setting, value=value)

def set_settings(**values):
    row_values = [{'key':k, 'value':v} for k, v in values.items()]
    insert_or_update_rows('settings', *row_values)

