import { useState, useEffect } from "react";
import HabitsPage from "./pages/HabitsPage";
import ViewPage from "./pages/ViewPage";
import type { Habit, HabitLog } from "./types";

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [page, setPage] = useState<"view" | "habits">("view");

  // Load habits from localStorage
  useEffect(() => {
    const storedHabits = localStorage.getItem("habits");
    if (storedHabits) setHabits(JSON.parse(storedHabits));
    const storedLogs = localStorage.getItem("logs");
    if (storedLogs) setLogs(JSON.parse(storedLogs));
  }, []);

  // Save habits & logs to localStorage
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [logs]);

  // Update a habit log
  const onUpdateLog = (habitId: string, log: HabitLog) => {
    setLogs((prev) => {
      const idx = prev.findIndex((l) => l.id === log.id);
      if (idx >= 0) {
        // Update existing log
        const newLogs = [...prev];
        newLogs[idx] = log;
        return newLogs;
      } else {
        // Add new log
        return [...prev, log];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Navigation */}
      <nav className="flex justify-between bg-gray-800 p-3">
        <button
          onClick={() => setPage("view")}
          className={page === "view" ? "font-bold underline" : ""}
        >
          View
        </button>
        <button
          onClick={() => setPage("habits")}
          className={page === "habits" ? "font-bold underline" : ""}
        >
          Habits
        </button>
      </nav>

      {/* Pages */}
      <div className="flex-1 p-4">
        {page === "view" && (
          <ViewPage habits={habits} logs={logs} onUpdateLog={onUpdateLog} />
        )}
        {page === "habits" && <HabitsPage habits={habits} setHabits={setHabits} />}
      </div>
    </div>
  );
}

export default App;
