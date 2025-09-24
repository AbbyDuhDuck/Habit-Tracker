import type { Habit, HabitLog } from "../types";
import "./AppView.css";

interface Props {
  habits: Habit[];
  logs: HabitLog[];
  date: Date;
  onSelectDay: (d: Date) => void;
}

export default function WeekView({ habits, logs, date, onSelectDay }: Props) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  const getLog = (habitId: string, d: Date) =>
    logs.find((l) => l.habitId === habitId && l.date === d.toISOString().split("T")[0]);

  const getDoneCount = (d: Date) =>
    habits.filter((h) => getLog(h.id, d)?.done).length;

  return (
    <div className="month-view">
      <h3 className="month-title">Week of {start.toLocaleDateString()}</h3>

      <div className="calendar-grid">
        {/* Weekday headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="weekday-header">{d}</div>
        ))}

        {/* Week cells */}
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className="calendar-cell"
            onClick={() => onSelectDay(d)}
          >
            <div className="day-number">{d.getDate()}</div>

            {/* Habit list */}
            <div className="habit-list">
              {habits.map((h) => {
                const log = getLog(h.id, d);
                const done = log?.done ?? false;
                return (
                  <div
                    key={h.id}
                    className={`habit-item ${done ? "done" : "not-done"}`}
                  >
                    <span>{h.name}</span>
                    <span>{h.type === "numeric" ? log?.numericValue ?? "" : done ? "✓" : ""}</span>
                  </div>
                );
              })}
            </div>

            <div className="done-count">
              {getDoneCount(d)} / {habits.length} done
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
