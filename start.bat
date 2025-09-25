@echo off
echo ========================================
echo    TaskFlow Pro - Demarrage
echo ========================================
echo.

echo [1/4] Verification de Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Docker n'est pas installe ou ne fonctionne pas
    echo Veuillez installer Docker Desktop: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo ✓ Docker est installe

echo.
echo [2/4] Clonage du projet...
if not exist "taskflow-pro" (
    echo Clonage depuis GitHub...
    git clone https://github.com/PrayingGoat/taskflow-pro.git
    if %errorlevel% neq 0 (
        echo ERREUR: Impossible de cloner le projet
        pause
        exit /b 1
    )
    cd taskflow-pro
) else (
    echo ✓ Le projet existe deja
    cd taskflow-pro
)

echo.
echo [3/4] Demarrage des services...
echo Demarrage de TaskFlow Pro avec Docker...
docker-compose -f docker-compose-simple.yml up -d

if %errorlevel% neq 0 (
    echo ERREUR: Impossible de demarrer les services
    echo Verifiez que Docker Desktop est en cours d'execution
    pause
    exit /b 1
)

echo.
echo [4/4] Verification des services...
timeout /t 5 /nobreak >nul
docker-compose -f docker-compose-simple.yml ps

echo.
echo ========================================
echo    TaskFlow Pro est demarre !
echo ========================================
echo.
echo Services disponibles:
echo - Interface Web: http://localhost:3000
echo - Base de donnees PostgreSQL: localhost:5432
echo - Cache Redis: localhost:6379
echo.
echo Pour arreter les services: docker-compose -f docker-compose-simple.yml down
echo Pour voir les logs: docker-compose -f docker-compose-simple.yml logs
echo.
echo Appuyez sur une touche pour ouvrir l'interface web...
pause >nul

start http://localhost:3000

echo.
echo Interface web ouverte dans votre navigateur !
echo.
echo ========================================
echo    READY FOR DEMO !
echo ========================================
echo.
pause
