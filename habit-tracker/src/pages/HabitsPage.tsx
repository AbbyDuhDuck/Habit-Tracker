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
    <div className="space-y-4">
      {/* Add new habit */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="p-2 text-black rounded flex-1"
          placeholder="New habit name"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <select
          className="p-2 text-black rounded"
          value={newHabitType}
          onChange={(e) => setNewHabitType(e.target.value as HabitType)}
        >
          <option value="boolean">Boolean</option>
          <option value="numeric">Numeric</option>
          <option value="singleChoice">Single Choice</option>
          <option value="multiChoice">Multi Choice</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={addHabit}
        >
          Add Habit
        </button>
      </div>

      {/* Habit list */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="p-4 bg-gray-800 rounded-lg shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{habit.name}</h3>
              <span className="text-sm italic text-gray-400">{habit.type}</span>
            </div>

            {/* Numeric habit */}
            {habit.type === "numeric" && (
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="number"
                  className="p-1 w-20 text-black rounded"
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
                  className="p-1 text-black rounded"
                  value={(habit as NumericHabit).thresholdMode}
                  onChange={(e) =>
                    updateHabit(habit.id, {
                      thresholdMode: e.target.value as any,
                    })
                  }
                >
                  <option value="atLeast">At least</option>
                  <option value="atMost">At most</option>
                  <option value="equal">Equal</option>
                </select>
              </div>
            )}

            {/* Choice habit */}
            {(habit.type === "singleChoice" || habit.type === "multiChoice") && (
              <div className="text-sm">
                <strong>Options:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(habit as SingleChoiceHabit | MultiChoiceHabit).options.map(
                    (opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        className="p-1 text-black rounded"
                        value={opt}
                        onChange={(e) => updateOption(habit.id, idx, e.target.value)}
                      />
                    )
                  )}
                  <button
                    className="bg-gray-700 text-white px-2 rounded"
                    onClick={() => addOption(habit.id)}
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            {/* Notes toggle */}
            <label className="text-sm mt-1">
              <input
                type="checkbox"
                checked={habit.allowNotes ?? false}
                onChange={(e) =>
                  updateHabit(habit.id, { allowNotes: e.target.checked })
                }
                className="mr-1"
              />
              Allow Notes
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
