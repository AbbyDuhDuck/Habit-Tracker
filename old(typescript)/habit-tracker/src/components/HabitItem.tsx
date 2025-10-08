import type { Habit } from "../types";

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
}

export default function HabitItem({ habit, onToggle }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const doneToday = false;

  return (
    <li
      className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded"
    >
      <span>{habit.name}</span>
      <button
        onClick={() => onToggle(habit.id)}
        className={`px-3 py-1 rounded ${
          doneToday ? "bg-green-500" : "bg-gray-600"
        }`}
      >
        {doneToday ? "Done ✅" : "Mark"}
      </button>
    </li>
  );
}
