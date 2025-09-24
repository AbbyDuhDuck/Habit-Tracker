import type { Habit, HabitLog } from "../types";

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
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i));

  const countDone = (d: Date) => {
    const key = d.toISOString().split("T")[0];
    return habits.filter((h) =>
      logs.some((l) => l.habitId === h.id && l.date === key && l.done)
    ).length;
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-3">
        {date.toLocaleString(undefined, { month: "long", year: "numeric" })}
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-semibold">{d}</div>
        ))}
        {cells.map((d, i) =>
          d ? (
            <div
              key={i}
              className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 text-center"
              onClick={() => onSelectDay(d)}
            >
              <div>{d.getDate()}</div>
              <div className="mt-1 text-xs">{countDone(d)} / {habits.length} done</div>
            </div>
          ) : (
            <div key={i}></div>
          )
        )}
      </div>
    </div>
  );
}
