import React, { useState } from "react";
import DayView from "../components/DayView";
import WeekView from "../components/WeekView";
import MonthView from "../components/MonthView";
import type { Habit, HabitLog } from "../types";

type ViewMode = "day" | "week" | "month";

interface Props {
  habits: Habit[];
  logs: HabitLog[];
  onUpdateLog: (habitId: string, log: HabitLog) => void;
}

export default function ViewPage({ habits, logs, onUpdateLog }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToday = () => setSelectedDate(new Date());
  const prev = () => {
    const d = new Date(selectedDate);
    if (viewMode === "day") d.setDate(d.getDate() - 1);
    else if (viewMode === "week") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setSelectedDate(d);
  };
  const next = () => {
    const d = new Date(selectedDate);
    if (viewMode === "day") d.setDate(d.getDate() + 1);
    else if (viewMode === "week") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setSelectedDate(d);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={prev} className="px-2 py-1 bg-gray-700 rounded">{"<"}</button>
        <button onClick={goToday} className="px-2 py-1 bg-gray-700 rounded">Today</button>
        <button onClick={next} className="px-2 py-1 bg-gray-700 rounded">{">"}</button>

        <select
          className="ml-4"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      {viewMode === "day" && (
        <DayView habits={habits} logs={logs} date={selectedDate} onUpdateLog={onUpdateLog} />
      )}
      {viewMode === "week" && (
        <WeekView habits={habits} logs={logs} date={selectedDate} onSelectDay={setSelectedDate} />
      )}
      {viewMode === "month" && (
        <MonthView habits={habits} logs={logs} date={selectedDate} onSelectDay={setSelectedDate} />
      )}
    </div>
  );
}
