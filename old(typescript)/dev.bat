@echo off
REM ==============================
REM Habit Tracker - Development
REM ==============================

REM Change to the project directory
cd /d "%~dp0habit-tracker"


echo.
echo # -=-=- Launching the Development App -=-=- #
echo.

echo Installing dependencies...
call npm install

@REM echo Starting development server...
@REM call npm run dev

echo Starting Tauri dev window...
npx tauri dev

