@echo off
title Iniciar Instituto Estudiantil
color 0A
echo =======================================================
echo     INICIANDO SISTEMA INSTITUTO ESTUDIANTIL
echo =======================================================
echo.
echo 1. Levantando Servidor Backend (Puerto 5000)...
start "Instituto Estudiantil - Backend API" cmd /k "cd /d %~dp0backend && set PATH=C:\Program Files\nodejs;%%PATH%% && node src/server.js"

echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo 2. Levantando Servidor Frontend (Puerto 5173)...
start "Instituto Estudiantil - Frontend Web" cmd /k "cd /d %~dp0frontend && set PATH=C:\Program Files\nodejs;%%PATH%% && node ./node_modules/vite/bin/vite.js --host"

echo Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo 3. Abriendo navegador en http://localhost:5173 ...
start http://localhost:5173

echo.
echo =======================================================
echo  El sistema se ha iniciado correctamente en la red.
echo.
echo  Accesos disponibles:
echo   * Local (este PC):  http://localhost:5173
node -e "const os = require('os'); const nets = os.networkInterfaces(); for (const k in nets) for (const net of nets[k]) if (net.family==='IPv4' && !net.internal) console.log('   * ' + k + ': http://' + net.address + ':5173');"
echo.
echo  Para acceso publico desde cualquier celular o Internet:
echo  Ejecute INICIAR_TUNEL_PUBLICO.bat o INICIAR_MULTIRED.bat
echo =======================================================
pause
