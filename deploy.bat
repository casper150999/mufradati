@echo off
echo ==============================================
echo   MUFRADATI - ONE CLICK DEPLOY KE CLOUDFLARE
echo ==============================================
echo.
echo 1. Memeriksa dan membangun bundle produksi (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build gagal! Periksa error di atas.
    pause
    exit /b %errorlevel%
)
echo.
echo 2. Mengunggah langsung ke Cloudflare Pages (mufradati-cnc)...
call npx wrangler pages deploy dist --project-name=mufradati-cnc
echo.
echo ==============================================
echo   DEPLOYMENT SELESAI!
echo   Buka: https://mufradati-cnc.pages.dev/
echo ==============================================
pause

