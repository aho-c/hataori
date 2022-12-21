VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "hataoriElement"
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

Private pPath As String

Public Function Document() As hataoriElement
    Set Document = GetElementObject("dom", "get_element", pPath, "root", "")
End Function

Public Function GetTitle() As String
    GetTitle = GetValueType("dom", "get_document", pPath, "get_title")
End Function

Public Function GetUrl() As String
    GetUrl = GetValueType("dom", "get_document", pPath, "get_url")
End Function

Public Function GetDomStatus() As String
    GetDomStatus = GetValueType("dom", "get_document", pPath, "get_status")
End Function

Public Function QuerySelectorAll(css_string As String) As hataoriElements
    Set QuerySelectorAll = GetElementsObject("dom", "get_element", pPath, "css_selector", css_string)
End Function

Public Function GetElementsByTagName(tag_name As String) As hataoriElements
    Set GetElementsByTagName = GetElementsObject("dom", "get_element", pPath, "css_selector", tag_name)
End Function

Public Function GetElementsByClassName(class_name As String) As hataoriElements
    Set GetElementsByClassName = GetElementsObject("dom", "get_element", pPath, "css_selector", "." & class_name)
End Function

Public Function GetElementsByName(name As String) As hataoriElements
    Set GetElementsByName = GetElementsObject("dom", "get_element", pPath, "css_selector", "[name=""" & name & """]")
End Function

Public Function GetElementByID(id As String) As hataoriElement
    Set GetElementByID = GetElementObject("dom", "get_element", pPath, "css_selector", "#" & id)
End Function

Public Function Children() As hataoriElements
    Set Children = GetElementsObject("dom", "get_element", pPath, "children", "")
End Function

Public Function Bros() As hataoriElements
    Set Bros = GetElementsObject("dom", "get_element", pPath, "bros", "")
End Function

Public Function NextElementSibling() As hataoriElement
    Set NextElementSibling = GetElementObject("dom", "get_element", pPath, "next_hataoriElement", "")
End Function

Public Function PreviousElementSibling() As hataoriElement
    Set PreviousElementSibling = GetElementObject("dom", "get_element", pPath, "prev_hataoriElement", "")
End Function

Public Function ParentElement() As hataoriElement
    Set ParentElement = GetElementObject("dom", "get_element", pPath, "parent", "")
End Function

Public Function ContentDocument() As hataoriElement
    Set ContentDocument = GetElementObject("dom", "get_element", pPath, "inner_contents", "")
End Function

Public Function InnerText() As String
    InnerText = GetValueType("dom", "get_data", pPath, "get_text", "")
End Function

Public Function InnerHTML() As String
    InnerHTML = GetValueType("dom", "get_data", pPath, "get_html", "")
End Function

Public Function OuterText() As String
    OuterText = GetValueType("dom", "get_data", pPath, "get_outer_text", "")
End Function

Public Function OuterHTML() As String
    OuterHTML = GetValueType("dom", "get_data", pPath, "get_outer_html", "")
End Function

Public Function TagName() As String
    TagName = LCase(GetValueType("dom", "get_data", pPath, "get_tagname", ""))
End Function

Public Property Get Value() As String
    Value = GetValueType("dom", "get_data", pPath, "get_value", "")
End Property

Public Property Let Value(text As String)
    Call GetValueType("dom", "set_value", pPath, "set_value", text, "")
End Property

Public Property Let SetInput(text As String)
    Call GetValueType("dom", "set_value", pPath, "set_input", text, "")
End Property

Public Property Get Selected() As Boolean
    Selected = GetValueType("dom", "get_data", pPath, "get_selected", "")
End Property

Public Property Let Selected(bool As Boolean)
    Call GetValueType("dom", "set_value", pPath, "set_selected", bool, "")
End Property

Public Property Get Checked() As Boolean
    Checked = GetValueType("dom", "get_data", pPath, "get_checked", "")
End Property

Public Property Let Checked(bool As Boolean)
    Call GetValueType("dom", "set_value", pPath, "set_checked", bool, "")
End Property

Public Property Get Attr(prop_name As String) As String
    Prop = GetValueType("dom", "get_data", pPath, "get_attr", prop_name)
End Property

Public Property Let Attr(prop_name As String, v As String)
    Call GetValueType("dom", "set_value", pPath, "set_attr", prop_name, v)
End Property

Public Function GetClassList() As Collection
    Set GetClassList = GetValueType("dom", "get_data", pPath, "get_class_list", "")
End Function

Public Function GetCssValue(css_property_name As String) As String
    GetCssValue = GetValueType("dom", "get_data", pPath, "get_css", css_property_name)
End Function

Public Function GetPath() As String
    GetPath = pPath
End Function

Public Sub Click()
    Call GetValueType("dom", "action", pPath, "click", 0, 0)
End Sub

Public Sub Dbl_click()
    Call GetValueType("dom", "action", pPath, "dbl_click", 0, 0)
End Sub

Public Sub DoubleClick()
    Call GetValueType("dom", "action", pPath, "dbl_click", 0, 0)
End Sub

Public Sub RightClick()
    Call GetValueType("dom", "action", pPath, "r_click", 0, 0)
End Sub

Public Sub MouseDown()
    Call GetValueType("dom", "action", pPath, "mouse_down", 0, 0)
End Sub

Public Sub MouseUp()
    Call GetValueType("dom", "action", pPath, "mouse_up", 0, 0)
End Sub

Public Property Get Focus() As Boolean
    Focus = GetValueType("dom", "get_data", pPath, "has_focus", "")
End Property

Public Property Let Focus(bool As Boolean)
    Call GetValueType("dom", "action", pPath, "focus", 0, 0)
End Property

Public Sub SetActive()
    Call GetValueType("dom", "action", pPath, "active", 0, 0)
End Sub

Public Sub init(path As String)
    pPath = path
End Sub

Private Sub Class_Initialize()
    pPath = "/"
End Sub
