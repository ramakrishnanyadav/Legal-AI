@echo off
echo ========================================
echo COMPLETE GIT RESET - FRESH START
echo ========================================
echo.

echo Step 1: Removing .git folder...
rmdir /s /q .git
echo ✓ Git history deleted!
echo.

echo Step 2: Removing node_modules and caches...
rmdir /s /q node_modules
rmdir /s /q .venv
rmdir /s /q venv
rmdir /s /q backend\venv
rmdir /s /q dist
rmdir /s /q build
echo ✓ Caches cleared!
echo.

echo Step 3: Initializing fresh Git repository...
git init
echo ✓ Fresh Git repo created!
echo.

echo Step 4: Setting up main branch...
git checkout -b main
echo ✓ Main branch created!
echo.

echo Step 5: Adding all files...
git add .
echo ✓ Files staged!
echo.

echo Step 6: Creating initial commit...
git commit -m "Initial commit: Lumina Legal - AI-Powered Legal Case Analyzer"
echo ✓ Clean commit created!
echo.

echo Step 7: Ready to add remote...
echo Run this next:
echo   git remote add origin https://github.com/ramakrishnanyadav/Legal-AI.git
echo   git push -u origin main --force
echo.

echo ========================================
echo COMPLETE! No Lovable traces remain.
echo ========================================
pause
