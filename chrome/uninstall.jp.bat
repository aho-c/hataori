@echo off

set registry_key_user=HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori
set registry_key_admin=HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori

echo -------------------------------------------------
echo hataori アンインストーラー
echo  2023 (c) Fukasawa Takashi
echo -------------------------------------------------
echo.


set /P start_setup=hataoriのアンインストールを開始しますか？ (y=YES / n=NO)

if /i {%start_setup%}=={y} (
	goto :yes
)
if /i {%start_setup%}=={n} (
	goto :no
) else (
	goto :no
)

:yes
echo Google Chromeを起動してhataoriを削除してから、任意のキーを押してください。
echo 必要に応じて開発モードを無効にしてください。
pause>NUL
echo.

echo HOSTの登録を解除しています。
echo   Registry_key: %registry_key_admin%
echo               : %registry_key_user%
reg delete "%registry_key_admin%" /f 1>NUL 2>NUL
reg delete "%registry_key_user%" /f 1>NUL 2>NUL
echo done.
echo.

echo *** hataoriのアンインストールが完了しました！ ***
echo.
echo Google Chromeを再起動してください。
echo.

goto :terminal

:no
echo Exit.

:terminal
echo 何かのキーを押してください。
pause>NUL
