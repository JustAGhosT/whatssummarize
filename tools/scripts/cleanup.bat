@echo off
REM Clean up script for the WhatsApp Conversation Summarizer project

setlocal enabledelayedexpansion

echo [Cleanup] Stopping all Node.js servers and cleaning up...

REM Kill Node.js processes on common development ports
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000\|:3001\|:3002\|:3003\|:3004\|:3005\|:3006\|:3007\|:3008\|:3009\|:3010\|:8080\|:8081\|:8082\|:8083\|:8084\|:8085\|:8086\|:8087\|:8088\|:8089\|:8090"') do (
    taskkill /F /PID %%a >nul 2>&1 || ver > nul
)

REM Kill common development processes
taskkill /F /IM "node.exe" >nul 2>&1 || ver > nul
taskkill /F /IM "npm.cmd" >nul 2>&1 || ver > nul
taskkill /F /IM "cmd.exe" /FI "WINDOWTITLE eq npm*" >nul 2>&1 || ver > nul

REM Clean up cache directories
echo [Cleanup] Removing cache directories...
if exist "frontend\.next" rmdir /S /Q "frontend\.next" >nul 2>&1 || ver > nul
if exist "frontend\node_modules\.vite" rmdir /S /Q "frontend\node_modules\.vite" >nul 2>&1 || ver > nul
if exist "backend\dist" rmdir /S /Q "backend\dist" >nul 2>&1 || ver > nul

REM Clean up test artifacts
echo [Cleanup] Cleaning test artifacts...
if exist "test-results" rmdir /S /Q "test-results" >nul 2>&1 || ver > nul
if exist "playwright-report" rmdir /S /Q "playwright-report" >nul 2>&1 || ver > nul
if exist "coverage" rmdir /S /Q "coverage" >nul 2>&1 || ver > nul
if exist "frontend\coverage" rmdir /S /Q "frontend\coverage" >nul 2>&1 || ver > nul

REM Remove temporary files
del /Q /F /S *.log >nul 2>&1
del /Q /F /S *.tmp >nul 2>&1

REM Clean npm cache
echo [Cleanup] Cleaning npm cache...
npm cache clean --force >nul 2>&1 || ver > nul

endlocal

echo [Cleanup] Cleanup completed successfully!
echo.

REM Only pause if not in CI environment
if "%CI%"=="" pause
