Attribute VB_Name = "hataoriSetting"
'***************************************************************
' hataori Ver 1.0.0
'   Browser automation framework
'
'   (c) Fukasawa Takashi
'
' License: MIT License
'
'
' VBA-JSON
'   (c) Tim Hall - https://github.com/VBA-tools/VBA-JSON
'***************************************************************

Option Explicit

Public Function hataoriSetting() As Dictionary
    Set hataoriSetting = New Dictionary
    
    '# Request file path.
    hataoriSetting.Add "req_file", "C:\nokoko\hataori\host\chrome\req"
    
    '# Response file path.
    hataoriSetting.Add "res_file", "C:\nokoko\hataori\host\chrome\res"

    '# Response file timeout seconds.
    hataoriSetting.Add "res_timeout_seconds", 60

    '# Web browser executable path.
    hataoriSetting.Add "web_browser_path", "C:/Program Files/Google/Chrome/Application/chrome.exe" 'Administrator install
    'hataoriSetting.Add "web_browser_path", Environ("LOCALAPPDATA") & "/Google/Chrome/Application/chrome.exe" 'User install
End Function
