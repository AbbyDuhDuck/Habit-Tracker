// -------------------------------
// Habit Types
// -------------------------------

export type HabitType = "boolean" | "numeric" | "singleChoice" | "multiChoice";

export type ThresholdMode = "atLeast" | "atMost" | "equal";

// Base interface for all habits
export interface HabitBase {
  id: string;
  name: string;
  type: HabitType;
  done?: boolean; // optional here, actual completion can be calculated
  allowNotes?: boolean;
}

// Boolean habit (simple done/not done)
export interface BooleanHabit extends HabitBase {
  type: "boolean";
}

// Numeric habit (threshold-based)
export interface NumericHabit extends HabitBase {
  type: "numeric";
  unit: string;              // e.g. "ml", "km", "hours"
  threshold: number;         // completion target
  thresholdMode: ThresholdMode;
  tolerance?: number;        // only used if thresholdMode = "equal"
}

// Single-choice habit (pick one option)
export interface SingleChoiceHabit extends HabitBase {
  type: "singleChoice";
  options: string[];
}

// Multi-choice habit (pick multiple options)
export interface MultiChoiceHabit extends HabitBase {
  type: "multiChoice";
  options: string[];
}

// Union of all possible habits
export type Habit =
  | BooleanHabit
  | NumericHabit
  | SingleChoiceHabit
  | MultiChoiceHabit;

// -------------------------------
// Habit Options (for choice-based habits)
// -------------------------------

export interface HabitOption {
  id: string;
  habitId: string;
  value: string;
}

// -------------------------------
// Habit Logs (per day)
// -------------------------------

export interface HabitLog {
  id: string;           // unique ID for this log entry
  habitId: string;
  date: string;         // YYYY-MM-DD
  done: boolean;        // calculated based on type or manually toggled
  numericValue?: number; // for numeric habits
  note?: string;        // optional note
}

// -------------------------------
// Choice log options (for multi/single choice habits)
// -------------------------------

export interface HabitLogOption {
  logId: string;
  optionValue: string;
}
