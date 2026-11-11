@echo off
chcp 65001 > nul
echo [FORTUNNE's WHEEL] GitHub 저장소로 변경사항 커밋 및 업로드를 시작합니다...
echo.

git add -A
git commit -m "feat: change title to FORTUNNE's WHEEL and add mystic wheel icon"
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo ✨ GitHub 업로드가 성공적으로 완료되었습니다!
    echo 저장소 주소: https://github.com/urarar001-crypto/fourtune-vibe
    echo ========================================================
) else (
    echo.
    echo ⚠️ 업로드 중 오류가 발생했습니다. 브라우저 인증 또는 권한을 확인해 주세요.
)

pause
