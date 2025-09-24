import type { Habit, HabitLog, SingleChoiceHabit, MultiChoiceHabit } from "../types";

import { v4 as uuidv4 } from "uuid"; // npm install uuid

interface Props {
  habits: Habit[];
  logs: HabitLog[];
  date: Date;
  onUpdateLog: (habitId: string, log: HabitLog) => void;
}

export default function DayView({ habits, logs, date, onUpdateLog }: Props) {
  const dateKey = date.toISOString().split("T")[0];

  const getLog = (habitId: string) => {
    return logs.find((l) => l.habitId === habitId && l.date === dateKey);
  };

  const updateLog = (habit: Habit, newValue: any) => {
    let done = false;

    switch (habit.type) {
        case "boolean":
            done = !!newValue;
            break;
        case "numeric":
            if (typeof newValue === "number" && habit.threshold !== undefined) {
            if (habit.thresholdMode === "atLeast") done = newValue >= habit.threshold;
            if (habit.thresholdMode === "atMost") done = newValue <= habit.threshold;
            if (habit.thresholdMode === "equal")
                done = Math.abs(newValue - habit.threshold) <= (habit.tolerance || 0);
            }
            break;
        case "singleChoice":
            done = (habit as SingleChoiceHabit).options.includes(newValue);
            break;
        case "multiChoice":
            done =
            Array.isArray(newValue) &&
            (newValue as string[]).length > 0 &&
            (habit as MultiChoiceHabit).options.length > 0;
            break;
        }

    onUpdateLog(habit.id, {
        id: uuidv4(), // <-- add unique ID
        habitId: habit.id,
        date: dateKey,
        done,
        numericValue: habit.type === "numeric" ? newValue : undefined,
        note: habit.allowNotes ? getLog(habit.id)?.note || "" : undefined,
    });
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-3">Habits for {dateKey}</h3>
      <ul>
        {habits.map((habit) => {
          const log = getLog(habit.id);
          return (
            <li key={habit.id} className="mb-3">
              <span className="font-semibold">{habit.name}</span> ({habit.type}){" "}
              {habit.type === "boolean" && (
                <input
                  type="checkbox"
                  checked={log?.done ?? false}
                  onChange={(e) => updateLog(habit, e.target.checked)}
                />
              )}
              {habit.type === "numeric" && (
                <input
                  type="number"
                  className="ml-2 p-1 w-20 text-black rounded"
                  value={log?.numericValue ?? ""}
                  onChange={(e) => updateLog(habit, Number(e.target.value))}
                />
              )}
              {habit.type === "singleChoice" && (
                <select
                  value={log?.done ? log?.numericValue || "" : ""}
                  className="ml-2 p-1 text-black rounded"
                  onChange={(e) => updateLog(habit, e.target.value)}
                >
                  <option value="">Select...</option>
                  {habit.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
              {habit.type === "multiChoice" && (
                <input
                  type="text"
                  placeholder="Select or type comma-separated"
                  className="ml-2 p-1 text-black rounded"
                  value={log?.done ? (log?.numericValue || "").toString() : ""}
                  onChange={(e) =>
                    updateLog(
                      habit,
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
