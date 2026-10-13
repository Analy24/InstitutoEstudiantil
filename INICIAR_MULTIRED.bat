@echo off
setlocal enabledelayedexpansion
title Centro de Redes y Servidores - ArticulApp
color 0B

:MENU
cls
echo ==============================================================================
echo                 ARTICULAPP - CENTRO DE CONTROL MULTI-RED
echo ==============================================================================
echo.
echo  Detectando interfaces de red disponibles en tu equipo...
echo ------------------------------------------------------------------------------
node -e "const os = require('os'); const nets = os.networkInterfaces(); for (const k in nets) for (const net of nets[k]) if (net.family==='IPv4' && !net.internal) console.log('  [+] ' + k.padEnd(20) + ' ->  http://' + net.address + ':5173');"
echo ------------------------------------------------------------------------------
echo.
echo  Selecciona como deseas activar los servidores:
echo.
echo   [1] MULTI-RED TOTAL (Local + WiFi / LAN + Tunel Publico en Internet)
echo       Ideal para probar en este PC, compartir en el WiFi y abrir en celulares
echo       o con personas en otras redes mediante un enlace HTTPS seguro de Cloudflare.
echo.
echo   [2] RED LOCAL + RED WIFI / LAN (Sin salida a Internet)
echo       Ideal para laboratorios, aulas de clase o redes locales cerradas.
echo.
echo   [3] MODO PRODUCCION MULTI-RED (Servidor unificado Puerto 5000)
echo       Compila el Frontend y levanta el Backend Express para maximo rendimiento.
echo.
echo   [4] ACTIVAR SOLO TUNEL PUBLICO CLOUDFLARE
echo       Abre conexion externa para servidores que ya estan ejecutandose.
echo.
echo   [5] SALIR
echo.
echo ==============================================================================
set /p OPCION="Ingresa tu opcion (1-5): "

if "%OPCION%"=="1" goto MODO_TOTAL
if "%OPCION%"=="2" goto MODO_LOCAL_LAN
if "%OPCION%"=="3" goto MODO_PRODUCCION
if "%OPCION%"=="4" goto MODO_TUNEL
if "%OPCION%"=="5" exit /b 0

echo Opcion no valida, presione una tecla...
pause >nul
goto MENU

:MODO_TOTAL
cls
echo ==============================================================================
echo             ACTIVANDO SERVIDORES EN MODO MULTI-RED TOTAL
echo ==============================================================================
echo.
echo 1. Levantando Backend Express (Puerto 5000 - Escuchando en 0.0.0.0)...
start "ArticulApp - Backend API (Multi-Red)" cmd /k "cd /d %~dp0backend && set PATH=C:\Program Files\nodejs;%%PATH%% && node src/server.js"

echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo 2. Levantando Frontend Vite (Puerto 5173 - Escuchando en 0.0.0.0)...
start "ArticulApp - Frontend Web (Multi-Red)" cmd /k "cd /d %~dp0frontend && set PATH=C:\Program Files\nodejs;%%PATH%% && node ./node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173"

echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo 3. Levantando Tunel Publico Cloudflare (Acceso global HTTPS)...
start "ArticulApp - Tunel Cloudflare (Internet Publico)" cmd /k "cd /d %~dp0 && cloudflared.exe tunnel --url http://localhost:5173"

echo Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo 4. Abriendo navegador local...
start http://localhost:5173

cls
echo ==============================================================================
echo                    SERVIDORES ACTIVADOS EXITOSAMENTE
echo ==============================================================================
echo.
echo  Tus servidores estan escuchando en diferentes tipos de red:
echo.
echo  1. RED LOCAL (Loopback - Solo esta maquina):
echo     * Frontend: http://localhost:5173
echo     * Backend:  http://localhost:5000/health
echo.
echo  2. RED DE AREA LOCAL (WiFi / LAN - Celulares, laptops en el mismo router):
node -e "const os = require('os'); const nets = os.networkInterfaces(); for (const k in nets) for (const net of nets[k]) if (net.family==='IPv4' && !net.internal) console.log('     * http://' + net.address + ':5173  (' + k + ')');"
echo.
echo  3. RED EXTERNA / INTERNET GLOBAL (Cualquier lugar, datos moviles 4G/5G):
echo     * Revisa la ventana negra titulada 'ArticulApp - Tunel Cloudflare'
echo     * Ahi encontraras el enlace seguro terminado en .trycloudflare.com
echo.
echo ==============================================================================
echo  Mantenga las ventanas abiertas para que los servidores sigan respondiendo.
echo ==============================================================================
pause
goto MENU

:MODO_LOCAL_LAN
cls
echo ==============================================================================
echo             ACTIVANDO SERVIDORES EN MODO RED LOCAL + WIFI
echo ==============================================================================
echo.
echo 1. Levantando Backend Express (Puerto 5000)...
start "ArticulApp - Backend API (Local/LAN)" cmd /k "cd /d %~dp0backend && set PATH=C:\Program Files\nodejs;%%PATH%% && node src/server.js"

echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo 2. Levantando Frontend Vite (Puerto 5173)...
start "ArticulApp - Frontend Web (Local/LAN)" cmd /k "cd /d %~dp0frontend && set PATH=C:\Program Files\nodejs;%%PATH%% && node ./node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173"

echo Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo 3. Abriendo navegador local...
start http://localhost:5173

cls
echo ==============================================================================
echo                    SERVIDORES ACTIVADOS EN RED LOCAL Y WIFI
echo ==============================================================================
echo.
echo  Accesos disponibles:
echo  1. Desde esta PC:  http://localhost:5173
echo  2. Desde dispositivos en la misma red WiFi:
node -e "const os = require('os'); const nets = os.networkInterfaces(); for (const k in nets) for (const net of nets[k]) if (net.family==='IPv4' && !net.internal) console.log('     * http://' + net.address + ':5173  (' + k + ')');"
echo.
echo ==============================================================================
pause
goto MENU

:MODO_PRODUCCION
cls
echo ==============================================================================
echo                 ACTIVANDO SERVIDORES EN MODO PRODUCCION
echo ==============================================================================
echo.
echo Compilando Frontend React...
cd /d "%~dp0frontend"
call node ./node_modules/vite/bin/vite.js build

echo Levantando Servidor Backend integrado (Puerto 5000)...
cd /d "%~dp0backend"
set NODE_ENV=production
set PORT=5000
start "ArticulApp - Servidor Produccion" cmd /k "cd /d %~dp0backend && set PATH=C:\Program Files\nodejs;%%PATH%% && set NODE_ENV=production && set PORT=5000 && node src/server.js"

timeout /t 3 /nobreak >nul
start http://localhost:5000

cls
echo ==============================================================================
echo             MODO PRODUCCION EN LINEA (PUERTO 5000 UNIFICADO)
echo ==============================================================================
echo.
echo  Accesos disponibles:
echo  1. Local: http://localhost:5000
echo  2. WiFi / LAN:
node -e "const os = require('os'); const nets = os.networkInterfaces(); for (const k in nets) for (const net of nets[k]) if (net.family==='IPv4' && !net.internal) console.log('     * http://' + net.address + ':5000  (' + k + ')');"
echo.
echo ==============================================================================
pause
goto MENU

:MODO_TUNEL
cls
start "ArticulApp - Tunel Cloudflare" cmd /k "cd /d %~dp0 && cloudflared.exe tunnel --url http://localhost:5173"
echo Tunel iniciado. Revisa la ventana para obtener la URL publica.
pause
goto MENU
