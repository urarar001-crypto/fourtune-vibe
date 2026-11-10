@echo off
chcp 65001 > nul
echo [Fortune Vibe] 개발 서버를 시작하는 중입니다...

:: Node.js 경로 추가
set PATH=C:\Program Files\nodejs;%PATH%

:: 브라우저 자동 실행 (1.5초 후)
start "" cmd /c "timeout /t 2 /nobreak > nul && start http://localhost:5173"

:: Vite 개발 서버 구동
call npm run dev
pause
