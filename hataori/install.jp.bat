@echo off

for /f "usebackq delims=" %%A in (`CD`) do set setup_dir=%%A
set registry_key_user=HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori
set registry_key_admin=HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori
set ext_host_path=%setup_dir%\hataori\host\manifest.json
set host_file=%setup_dir:\=\\%\\hataori\\host\\hataori.bat
set ext_path=%setup_dir%\hataori\ext

echo -------------------------------------------------
echo hataori 0.5.0 インストーラー
echo  2023 (c) Fukasawa Takashi
echo -------------------------------------------------
echo.


set /P start_setup=hataoriのインストールを開始しますか？ (y=YES / n=NO)？

if /i {%start_setup%}=={y} (
	goto :yes
)
if /i {%start_setup%}=={n} (
	goto :no
) else (
	goto :no
)

:yes
echo Google Chromeを終了してから、任意のキーを押してください。
pause>NUL
echo.

echo hataoriをインストールします。
echo 開始する場合は何かのキーを押してください。
echo 中止する場合は、このウインドウを閉じてください。
echo   インストール先フォルダー: %setup_dir%
pause>NUL
echo.

echo HOSTを登録しています。
echo   Registry_key: %registry_key_admin%
echo               : %registry_key_user%
reg delete "%registry_key_admin%" /f 1>NUL 2>NUL
reg delete "%registry_key_user%" /f 1>NUL 2>NUL
reg add "%registry_key_admin%" /ve /t "REG_SZ" /d "%ext_host_path%" /f 1>NUL 2>NUL
reg add "%registry_key_user%" /ve /t "REG_SZ" /d "%ext_host_path%" /f 1>NUL 2>NUL
echo done.
echo.

:ext_id_input
echo Google Chrome を起動し、開発者モードで「%ext_path%」を読み込みます。
echo 次に、拡張機能のIDをコピーして、このウインドウに貼り付けてください。
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

echo 完了しました。
echo.

echo Google Chromeを再起動し、任意のキーを押してください。
pause>NUL
echo.

echo *** hataori にようこそ！***
echo.

goto :terminal

:no
echo Exit.

:terminal
echo 何かのキーを押してください。
pause>NUL
exit

:TRIM
SET ext_id=%*
