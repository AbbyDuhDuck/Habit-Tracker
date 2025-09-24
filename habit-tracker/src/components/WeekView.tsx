import type { Habit, HabitLog } from "../types";

interface Props {
  habits: Habit[];
  logs: HabitLog[];
  date: Date;
  onSelectDay: (d: Date) => void;
}

export default function WeekView({ habits, logs, date, onSelectDay }: Props) {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Sunday

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  const countDone = (d: Date) => {
    const key = d.toISOString().split("T")[0];
    return habits.filter((h) =>
      logs.some((l) => l.habitId === h.id && l.date === key && l.done)
    ).length;
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-3">
        Week of {start.toISOString().split("T")[0]}
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 text-center"
            onClick={() => onSelectDay(d)}
          >
            <div className="font-semibold">
              {d.toLocaleDateString(undefined, { weekday: "short" })}
            </div>
            <div>{d.getDate()}</div>
            <div className="mt-1 text-xs">{countDone(d)} / {habits.length} done</div>
          </div>
        ))}
      </div>
    </div>
  );
}
