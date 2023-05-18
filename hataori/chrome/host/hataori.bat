@echo off

rem hataori host
rem License: MIT License (http://www.opensource.org/licenses/mit-license.php)
rem  (c) 2023 Fukasawa Takashi

set python_path=py
set active_path=%CD%
%python_path% -u "%active_path%\host.py"2>>"%active_path%\err.log"
