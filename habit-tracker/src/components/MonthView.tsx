import type { Habit, HabitLog } from "../types";
import "./AppView.css";

interface Props {
  habits: Habit[];
  logs: HabitLog[];
  date: Date;
  onSelectDay: (d: Date) => void;
}

export default function MonthView({ habits, logs, date, onSelectDay }: Props) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay(); // Sunday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i));

  const getDoneCount = (d: Date) => {
    const key = d.toISOString().split("T")[0];
    return habits.filter((h) =>
      logs.some((l) => l.habitId === h.id && l.date === key && l.done)
    ).length;
  };

  return (
    <div className="month-view">
      <h3 className="month-title">
        {date.toLocaleString(undefined, { month: "long", year: "numeric" })}
      </h3>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="weekday-header">{d}</div>
        ))}

        {cells.map((d, i) =>
          d ? (
            <div
              key={i}
              className="calendar-cell"
              onClick={() => onSelectDay(d)}
            >
              <div className="day-number">{d.getDate()}</div>
              <div className="habit-indicators">
                {habits.map((h) => {
                  const done = logs.some(
                    (l) => l.habitId === h.id && l.date === d.toISOString().split("T")[0] && l.done
                  );
                  return (
                    <span
                      key={h.id}
                      className={`habit-dot ${done ? "done" : ""}`}
                    />
                  );
                })}
              </div>
              <div className="done-count">
                {getDoneCount(d)} / {habits.length} done
              </div>
            </div>
          ) : (
            <div key={i} className="calendar-cell empty"></div>
          )
        )}
      </div>
    </div>
  );
}
