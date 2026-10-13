@echo off
title Tunel Publico Cloudflare - ArticulApp
color 0E

echo ======================================================================
echo          ARTICULAPP - TUNEL PUBLICO DE ACCESO EXTERNO (WAN)
echo ======================================================================
echo.
echo Este servicio crea un tunel seguro HTTPS (SSL) a traves de Cloudflare.
echo Permite acceder a ArticulApp desde:
echo   * Cualquier red externa a tu hogar u oficina
echo   * Celulares usando datos moviles (4G / 5G)
echo   * Evaluadores, directores o aprendices remotos
echo.
echo NOTA: Asegurate de que el servidor Frontend (puerto 5173) o de
echo       Produccion (puerto 5000) este ejecutandose.
echo.
echo Conectando con la red global de Cloudflare...
echo ======================================================================
echo.

cd /d "%~dp0"
if not exist "cloudflared.exe" (
    echo [ERROR] No se encontro el archivo cloudflared.exe en la raiz del proyecto.
    pause
    exit /b 1
)

cloudflared.exe tunnel --url http://localhost:5173
pause
