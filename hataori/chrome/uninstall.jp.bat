@echo off

set registry_key_user=HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori
set registry_key_admin=HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\NativeMessagingHosts\net.nokoko.hataori

echo -------------------------------------------------
echo hataori �A���C���X�g�[���[
echo  2023 (c) Fukasawa Takashi
echo -------------------------------------------------
echo.


set /P start_setup=hataori�̃A���C���X�g�[�����J�n���܂����H (y=YES / n=NO)

if /i {%start_setup%}=={y} (
	goto :yes
)
if /i {%start_setup%}=={n} (
	goto :no
) else (
	goto :no
)

:yes
echo Google Chrome���N������hataori���폜���Ă���A�C�ӂ̃L�[�������Ă��������B
echo �K�v�ɉ����ĊJ�����[�h�𖳌��ɂ��Ă��������B
pause>NUL
echo.

echo HOST�̓o�^���������Ă��܂��B
echo   Registry_key: %registry_key_admin%
echo               : %registry_key_user%
reg delete "%registry_key_admin%" /f 1>NUL 2>NUL
reg delete "%registry_key_user%" /f 1>NUL 2>NUL
echo done.
echo.

echo *** hataori�̃A���C���X�g�[�����������܂����I ***
echo.
echo Google Chrome���ċN�����Ă��������B
echo.

goto :terminal

:no
echo Exit.

:terminal
echo �����̃L�[�������Ă��������B
pause>NUL
