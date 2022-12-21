rem hataori host
rem (c) Fukasawa Takashi
rem MIT License

@echo off
set python_path=py
set active_path=%CD%
%python_path% -u "%active_path%\host.py"2>>"%active_path%\err.log"
