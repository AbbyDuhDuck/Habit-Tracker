import React, { useState } from "react";
import type {
  Habit,
  HabitType,
  BooleanHabit,
  NumericHabit,
  SingleChoiceHabit,
  MultiChoiceHabit,
} from "../types";
import { v4 as uuidv4 } from "uuid";

interface Props {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

export default function HabitsPage({ habits, setHabits }: Props) {
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitType, setNewHabitType] = useState<HabitType>("boolean");

  const addHabit = () => {
    if (!newHabitName) return;

    let habit: Habit;

    // Explicitly typed objects for each habit type
    switch (newHabitType) {
      case "boolean":
        habit = { id: uuidv4(), name: newHabitName, type: "boolean" } as BooleanHabit;
        break;
      case "numeric":
        habit = {
          id: uuidv4(),
          name: newHabitName,
          type: "numeric",
          unit: "units",
          threshold: 1,
          thresholdMode: "atLeast",
          tolerance: 0,
        } as NumericHabit;
        break;
      case "singleChoice":
        habit = {
          id: uuidv4(),
          name: newHabitName,
          type: "singleChoice",
          options: ["Option 1"],
        } as SingleChoiceHabit;
        break;
      case "multiChoice":
        habit = {
          id: uuidv4(),
          name: newHabitName,
          type: "multiChoice",
          options: ["Option 1"],
        } as MultiChoiceHabit;
        break;
      default:
        throw new Error("Invalid habit type");
    }

    setHabits([...habits, habit]);
    setNewHabitName("");
  };

  const updateHabit = (id: string, updated: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        // Narrow the type explicitly
        switch (h.type) {
          case "boolean":
            return { ...h, ...updated } as BooleanHabit;
          case "numeric":
            return { ...h, ...updated } as NumericHabit;
          case "singleChoice":
            return { ...h, ...updated } as SingleChoiceHabit;
          case "multiChoice":
            return { ...h, ...updated } as MultiChoiceHabit;
          default:
            return h;
        }
      })
    );
  };

  const updateOption = (habitId: string, idx: number, value: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;

        switch (h.type) {
          case "singleChoice":
            return {
              ...h,
              options: [...h.options.slice(0, idx), value, ...h.options.slice(idx + 1)],
            } as SingleChoiceHabit;
          case "multiChoice":
            return {
              ...h,
              options: [...h.options.slice(0, idx), value, ...h.options.slice(idx + 1)],
            } as MultiChoiceHabit;
          default:
            return h;
        }
      })
    );
  };


  const addOption = (habitId: string) => {
    setHabits(
      habits.map((h) => {
        if (h.id !== habitId) return h;
        if (h.type === "singleChoice" || h.type === "multiChoice") {
          return { ...h, options: [...h.options, `Option ${h.options.length + 1}`] } as Habit;
        }
        return h;
      })
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Configure Habits</h2>

      {/* Add new habit */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="p-1 text-black rounded flex-1"
          placeholder="New habit name"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <select
          value={newHabitType}
          onChange={(e) => setNewHabitType(e.target.value as HabitType)}
        >
          <option value="boolean">Boolean</option>
          <option value="numeric">Numeric</option>
          <option value="singleChoice">Single Choice</option>
          <option value="multiChoice">Multi Choice</option>
        </select>
        <button className="bg-blue-600 text-white px-2 rounded" onClick={addHabit}>
          Add Habit
        </button>
      </div>

      {/* List of existing habits */}
      <ul>
        {habits.map((habit) => (
          <li key={habit.id} className="mb-3 p-2 border rounded">
            <div className="flex justify-between items-center">
              <strong>{habit.name}</strong>
              <label>
                <input
                  type="checkbox"
                  checked={habit.allowNotes ?? false}
                  onChange={(e) => updateHabit(habit.id, { allowNotes: e.target.checked })}
                />{" "}
                Allow Notes
              </label>
            </div>

            {/* Numeric habit settings */}
            {habit.type === "numeric" && (
              <div className="mt-1">
                <input
                  type="number"
                  className="p-1 w-20 text-black rounded mr-2"
                  value={(habit as NumericHabit).threshold}
                  onChange={(e) =>
                    updateHabit(habit.id, { threshold: Number(e.target.value) })
                  }
                />
                <input
                  type="text"
                  className="p-1 w-20 text-black rounded"
                  value={(habit as NumericHabit).unit}
                  onChange={(e) => updateHabit(habit.id, { unit: e.target.value })}
                />
                <select
                  className="ml-2"
                  value={(habit as NumericHabit).thresholdMode}
                  onChange={(e) =>
                    updateHabit(habit.id, { thresholdMode: e.target.value as any })
                  }
                >
                  <option value="atLeast">At least</option>
                  <option value="atMost">At most</option>
                  <option value="equal">Equal</option>
                </select>
              </div>
            )}

            {/* Choice habit settings */}
            {(habit.type === "singleChoice" || habit.type === "multiChoice") && (
              <div className="mt-1">
                <strong>Options:</strong>
                {(habit as SingleChoiceHabit | MultiChoiceHabit).options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    className="p-1 text-black rounded mr-1 mt-1"
                    value={opt}
                    onChange={(e) => updateOption(habit.id, idx, e.target.value)}
                  />
                ))}
                <button
                  className="ml-2 bg-gray-700 text-white px-2 rounded mt-1"
                  onClick={() => addOption(habit.id)}
                >
                  + Add Option
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
