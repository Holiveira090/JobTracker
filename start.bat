@echo off
echo ============================================
echo  JobTracker - Iniciando Backend e Frontend
echo ============================================
echo.

echo [1/3] Iniciando backend (ASP.NET Core)...
cd /d "c:\Users\Kaititu\Desktop\JobTracker-master"
start "Backend - JobTracker" cmd /k "dotnet run --project JobTracker.Api\JobTracker.Api.csproj"
timeout /t 5 /nobreak >nul

echo.
echo [2/3] Iniciando frontend (React + Vite)...
cd /d C:\JobTrackerBuild
start "Frontend - JobTracker" cmd /k "npm run dev"

echo.
echo [3/3] Aguardando inicializacao...
timeout /t 5 /nobreak >nul

echo.
echo ============================================
echo  Backend:  http://localhost:5248
echo  Frontend: http://localhost:5173
echo ============================================
echo.
echo Para parar, feche as janelas de comando acima.