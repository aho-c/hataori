@echo off

for /f "usebackq delims=" %%A in (`CD`) do set setup_dir=%%A
set registry_key_user=HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori
set registry_key_admin=HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori
set ext_host_path=%setup_dir%\hataori\host\manifest.json
set host_file=%setup_dir:\=\\%\\hataori\\host\\hataori.bat
set ext_path=%setup_dir%\hataori\ext

echo -------------------------------------------------
echo hataori 0.5.0 �C���X�g�[���[
echo  2023 (c) Fukasawa Takashi
echo -------------------------------------------------
echo.


set /P start_setup=hataori�̃C���X�g�[�����J�n���܂����H (y=YES / n=NO)�H

if /i {%start_setup%}=={y} (
	goto :yes
)
if /i {%start_setup%}=={n} (
	goto :no
) else (
	goto :no
)

:yes
echo Google Chrome���I�����Ă���A�C�ӂ̃L�[�������Ă��������B
pause>NUL
echo.

echo hataori���C���X�g�[�����܂��B
echo �J�n����ꍇ�͉����̃L�[�������Ă��������B
echo ���~����ꍇ�́A���̃E�C���h�E����Ă��������B
echo   �C���X�g�[����t�H���_�[: %setup_dir%
pause>NUL
echo.

echo HOST��o�^���Ă��܂��B
echo   Registry_key: %registry_key_admin%
echo               : %registry_key_user%
reg delete "%registry_key_admin%" /f 1>NUL 2>NUL
reg delete "%registry_key_user%" /f 1>NUL 2>NUL
reg add "%registry_key_admin%" /ve /t "REG_SZ" /d "%ext_host_path%" /f 1>NUL 2>NUL
reg add "%registry_key_user%" /ve /t "REG_SZ" /d "%ext_host_path%" /f 1>NUL 2>NUL
echo done.
echo.

:ext_id_input
echo Google Chrome ���N�����A�J���҃��[�h�Łu%ext_path%�v��ǂݍ��݂܂��B
echo ���ɁA�g���@�\��ID���R�s�[���āA���̃E�C���h�E�ɓ\��t���Ă��������B
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

echo �������܂����B
echo.

echo Google Chrome���ċN�����A�C�ӂ̃L�[�������Ă��������B
pause>NUL
echo.

echo *** hataori �ɂ悤�����I***
echo.

goto :terminal

:no
echo Exit.

:terminal
echo �����̃L�[�������Ă��������B
pause>NUL
exit

:TRIM
SET ext_id=%*
