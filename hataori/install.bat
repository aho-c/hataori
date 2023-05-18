@echo off

for /f "usebackq delims=" %%A in (`CD`) do set setup_dir=%%A
set registry_key_user=HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori
set registry_key_admin=HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori
set ext_host_path=%setup_dir%\hataori\host\manifest.json
set host_file=%setup_dir:\=\\%\\hataori\\host\\hataori.bat
set ext_path=%setup_dir%\hataori\ext

echo -------------------------------------------------
echo Install hataori 1.0.0
echo  (c) Fukasawa Takashi
echo -------------------------------------------------
echo.


set /P start_setup=Start install hataori? (y=YES / n=NO)H

if /i {%start_setup%}=={y} (
	goto :yes
)
if /i {%start_setup%}=={n} (
	goto :no
) else (
	goto :no
)

:yes
echo Quit Google Chrome and press any key.
pause>NUL
echo.

echo Install hataori.
echo Press any key to start.
echo To cancel, please close this window.
echo   Install directory: %setup_dir%
pause>NUL
echo.

echo Register HOST.
echo   Registry_key: %registry_key_admin%
echo               : %registry_key_user%
reg delete "%registry_key_admin%" /f 1>NUL 2>NUL
reg delete "%registry_key_user%" /f 1>NUL 2>NUL
reg add "%registry_key_admin%" /ve /t "REG_SZ" /d "%ext_host_path%" /f 1>NUL 2>NUL
reg add "%registry_key_user%" /ve /t "REG_SZ" /d "%ext_host_path%" /f 1>NUL 2>NUL
echo done.
echo.

:ext_id_input
echo Start Google Chrome and load "%ext_path%" in developer mode.
echo Then copy and paste the extended ID.
set ext_id=
set /P ext_id=

if "%ext_id%" EQU "" (
    goto :ext_id_input
)

CALL :TRIM %ext_id%

echo {>"%ext_host_path%"
echo 	"name": "net.nokoko.hataori",>>"%ext_host_path%"
echo 	"description": "Exchange messages between hataori and browser extensions.",>>"%ext_host_path%"
echo 	"path": "%host_file%",>>"%ext_host_path%"
echo 	"type": "stdio",>>"%ext_host_path%"
echo 	"allowed_origins": [>>"%ext_host_path%"
echo 		"chrome-extension://%ext_id%/">>"%ext_host_path%"
echo 	]>>"%ext_host_path%"
echo }>>"%ext_host_path%"

echo done.
echo.

echo Restart Google Chrome and press any key.
pause>NUL
echo.

echo *** Welcome to hataori! ***
echo.

goto :terminal

:no
echo Exit.

:terminal
echo Press any key.
pause>NUL
exit

:TRIM
SET ext_id=%*
