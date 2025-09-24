import type { Habit } from "../types";
import HabitItem from "./HabitItem";

interface Props {
  habits: Habit[];
  onToggle: (id: string) => void;
}

export default function HabitList({ habits, onToggle }: Props) {
  if (!habits.length) return <p>No habits yet. Add one!</p>;

  return (
    <ul className="space-y-2 w-full max-w-md">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} onToggle={onToggle} />
      ))}
    </ul>
  );
}
