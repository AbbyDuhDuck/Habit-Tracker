@echo off
REM ==============================
REM Habit Tracker - Build Standalone EXE
REM ==============================

REM Change to the project directory
cd /d "%~dp0habit-tracker"


echo.
echo # -=-=- Building the App -=-=- #
echo.

echo Installing dependencies...
call npm install

echo Building React app...
call npm run build

echo Building standalone EXE with Tauri...
call npx tauri build

echo Build finished! Check src-tauri\target\release\bundle\msi\


REM ==============================
REM Dynamically find the NSIS EXE file
REM ==============================
set "EXE_FOLDER=src-tauri\target\release"

REM Look for the first .exe file in the folder
for %%f in ("%EXE_FOLDER%\*.exe") do set "EXE_FILE=%%f" & goto :FOUND

:FOUND
echo Launching EXE: %EXE_FILE%
start "" "%EXE_FILE%"

