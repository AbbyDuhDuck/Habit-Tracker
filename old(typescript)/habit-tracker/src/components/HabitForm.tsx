import { useState } from "react";

interface Props {
  onAdd: (name: string) => void;
}

export default function HabitForm({ onAdd }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit..."
        className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
      />
      <button
        type="submit"
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
}
