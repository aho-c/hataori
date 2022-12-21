@echo off

set registry_key_user=HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori
set registry_key_admin=HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori

echo -------------------------------------------------
echo Uninstall hataori
echo  (c) Fukasawa Takashi
echo -------------------------------------------------
echo.


set /P start_setup=Start uninstall hataori? (y=YES / n=NO)？

if /i {%start_setup%}=={y} (
	goto :yes
)
if /i {%start_setup%}=={n} (
	goto :no
) else (
	goto :no
)

:yes
echo After starting chrome and deleting Hataori, press any key.
echo Disable development mode if necessary.
pause>NUL
echo.

echo Unregister HOST.
echo   Registry_key: %registry_key_admin%
echo               : %registry_key_user%
reg delete "%registry_key_admin%" /f 1>NUL 2>NUL
reg delete "%registry_key_user%" /f 1>NUL 2>NUL
echo done.
echo.

echo *** Goodbye to hataori! ***
echo.

goto :terminal

:no
echo Exit.

:terminal
echo Press any key.
pause>NUL
