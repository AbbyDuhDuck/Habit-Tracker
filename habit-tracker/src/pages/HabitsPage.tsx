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
import "./HabitsPage.css";

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
    <div className="habits-page">
      {/* Add new habit */}
      <div className="habit-form">
        <input
          type="text"
          className="habit-input"
          placeholder="New habit name"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <select
          className="habit-select"
          value={newHabitType}
          onChange={(e) => setNewHabitType(e.target.value as HabitType)}
        >
          <option value="boolean">Boolean</option>
          <option value="numeric">Numeric</option>
          <option value="singleChoice">Single Choice</option>
          <option value="multiChoice">Multi Choice</option>
        </select>
        <button className="habit-button" onClick={addHabit}>
          Add Habit
        </button>
      </div>

      {/* Habit list */}
      <div className="habit-list">
        {habits.map((habit) => (
          <div key={habit.id} className="habit-card">
            <div className="habit-header">
              <h3 className="habit-title">{habit.name}</h3>
              <span className="habit-type">{habit.type}</span>
            </div>

            {/* Numeric habit */}
            {habit.type === "numeric" && (
              <div className="habit-numeric">
                <input
                  type="number"
                  className="habit-input-small"
                  value={(habit as NumericHabit).threshold}
                  onChange={(e) =>
                    updateHabit(habit.id, { threshold: Number(e.target.value) })
                  }
                />
                <input
                  type="text"
                  className="habit-input-small"
                  value={(habit as NumericHabit).unit}
                  onChange={(e) => updateHabit(habit.id, { unit: e.target.value })}
                />
                <select
                  className="habit-select"
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

            {/* Choice habit */}
            {(habit.type === "singleChoice" || habit.type === "multiChoice") && (
              <div className="habit-options">
                <strong>Options:</strong>
                <div className="habit-options-list">
                  {(habit as SingleChoiceHabit | MultiChoiceHabit).options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      className="habit-input-small"
                      value={opt}
                      onChange={(e) => updateOption(habit.id, idx, e.target.value)}
                    />
                  ))}
                  <button className="habit-button-small" onClick={() => addOption(habit.id)}>
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            {/* Notes toggle */}
            <label className="habit-notes">
              <input
                type="checkbox"
                checked={habit.allowNotes ?? false}
                onChange={(e) => updateHabit(habit.id, { allowNotes: e.target.checked })}
              />
              Allow Notes
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}