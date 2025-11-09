@echo off
REM Abre duas janelas de terminal e inicia backend (go run) e frontend (npm run dev)
start "Backend" cmd /k "cd /d "%~dp0backend" && go run ."
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"
