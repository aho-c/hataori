VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "hataoriBrowser"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
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

Public Sub PrintOut()
    Call GetValueType("dom", "exec", "printout", 0, 0)
End Sub

Public Sub Scroll(x As Long, y As Long)
    Call GetValueType("dom", "exec", "scroll", x, y)
End Sub

Public Function GetThisTabStatus() As String
    Dim list As Collection: Set list = GetValueType("browser", "get_tabs", "this", "")
    If list.count <> 1 Then
        Err.Raise vbObjectError + 1, "browser.GetTabStatus", "Unable to get tab."
    End If
    Dim dict As Dictionary: Set dict = list(1)
    If Not dict.Exists("status") Then
        Err.Raise vbObjectError + 1, "browser.GetTabStatus", "Unable to get tab status."
    End If
    GetTabStatus = dict("status")
End Function

Public Function GetThisTab() As Dictionary
    Dim list As Collection: Set list = GetValueType("browser", "get_tabs", "this", "")
    Set GetTab = list(1)
End Function

Public Function GetTabs() As Collection
    Set GetTabs = GetValueType("browser", "get_tabs", "", "")
End Function

Public Function ActiveThisTab() As Boolean
    Dim list As Collection: Set list = GetValueType("browser", "get_tabs", "this", "")
    Dim dict As Dictionary: Set dict = list(1)
    ActiveTab = GetValueType("browser", "select_tab", "id", dict("id"))
End Function

Public Function SelectTabByID(id As String) As Boolean
    SelectTabByID = GetValueType("browser", "select_tab", "id", id)
End Function

Public Function SelectTabByTitle(title_text As String) As Boolean
    SelectTabByTitle = GetValueType("browser", "select_tab", "title", title_text)
End Function

Public Function SelectTabByURL(url_text As String) As Boolean
    SelectTabByURL = GetValueType("browser", "select_tab", "url", url_text)
End Function

Public Function OpenNewTab(url_text As String) As Boolean
    OpenTab = GetValueType("browser", "tab_action", "new", url_text)
End Function

Public Function RenewThisTab(url_text As String) As Boolean
    RenewTab = GetValueType("browser", "tab_action", "jump", url_text)
End Function

Public Function CloseThisTab() As Boolean
    CloseTab = GetValueType("browser", "tab_action", "close", "")
End Function

Public Function Reload() As Boolean
    Reload = GetValueType("browser", "tab_action", "reload", "")
End Function

Public Function GoForward() As Boolean
    GoForward = GetValueType("browser", "tab_action", "forward", "")
End Function

Public Function GoBack() As Boolean
    GoBack = GetValueType("browser", "tab_action", "back", "")
End Function

Public Sub DialogSendEnter()
    Call GetValueType("host", "key", "enter", "")
End Sub

Public Sub DialogSendEsc()
    Call GetValueType("host", "key", "esc", "")
End Sub

Public Sub DialogSendString(send_text As String)
    Call GetValueType("host", "text", send_text, "")
End Sub

Public Sub SendKeyCodes(keys_text As String)
    Call GetValueType("host", "key", keys_text, "")
End Sub

Public Sub SendString(send_text As String)
    Call GetValueType("host", "text", send_text, "")
End Sub

Public Sub OpenWindow(url_text As String)
    Call GetValueType("host", "open", url_text, GetSettingValue("web_browser_path"))
End Sub

Public Sub CloseBrowser()
    CloseBrowser = GetValueType("browser", "all_close", "")
End Sub

