import React, { useState, useEffect } from "react";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToday = () => setSelectedDate(new Date());
  const prev = () => {
    const d = new Date(selectedDate);
    if (effectiveViewMode === "day") d.setDate(d.getDate() - 1);
    else if (effectiveViewMode === "week") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setSelectedDate(d);
  };
  const next = () => {
    const d = new Date(selectedDate);
    if (effectiveViewMode === "day") d.setDate(d.getDate() + 1);
    else if (effectiveViewMode === "week") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setSelectedDate(d);
  };

  const effectiveViewMode = viewMode === "month" && windowWidth < 600 ? "week" : viewMode;

  return (
    <div>
      <div className="">
        <button onClick={prev} className="">{"<"}</button>
        <button onClick={goToday} className="">Today</button>
        <button onClick={next} className="">{">"}</button>

        <select
          className=""
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      {effectiveViewMode === "day" && (
        <DayView habits={habits} logs={logs} date={selectedDate} onUpdateLog={onUpdateLog} />
      )}
      {effectiveViewMode === "week" && (
        <WeekView habits={habits} logs={logs} date={selectedDate} onSelectDay={setSelectedDate} />
      )}
      {effectiveViewMode === "month" && (
        <MonthView habits={habits} logs={logs} date={selectedDate} onSelectDay={setSelectedDate} />
      )}
    </div>
  );
}
