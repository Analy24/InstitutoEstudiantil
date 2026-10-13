@echo off
title Servidor de Produccion - ArticulApp
color 0B
echo =======================================================
echo    INICIANDO ARTICULAPP EN MODO PRODUCCION (PUERTO 5000)
echo =======================================================
echo.
echo 1. Compilando el Frontend React para producción...
cd /d %~dp0frontend
call node ./node_modules/vite/bin/vite.js build

echo.
echo 2. Levantando el Servidor Backend Express con Frontend integrado...
cd /d %~dp0backend
set NODE_ENV=production
set PORT=5000
node src/server.js
pause
