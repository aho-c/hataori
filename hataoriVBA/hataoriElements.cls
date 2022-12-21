VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "hataoriElements"
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

Private pPaths As Collection
Private pElements As Collection

Public Function GetItem(index As Long) As hataoriElement
Attribute GetItem.VB_UserMemId = 0
    If pPaths.count < index + 1 Then Err.Raise vbObjectError + 1, "hataoriElements.getItem", "Index does not exist"
    If index + 1 <= 0 Then Err.Raise vbObjectError + 1, "hataoriElements.getItem", "Index does not exist"
    Dim elem As hataoriElement: Set elem = New hataoriElement
    elem.init pPaths(index + 1)
    Set GetItem = elem
End Function

Public Function Length() As Long
    Length = pPaths.count
End Function

Public Function iter() As IUnknown
Attribute iter.VB_UserMemId = -4
    Set pElements = New Collection
    Dim path
    Dim elem As hataoriElement
    For Each path In pPaths
        Set elem = New hataoriElement: elem.init CStr(path)
        pElements.Add elem
    Next path
    Set iter = pElements.[_NewEnum]
End Function

Public Sub init(paths As Collection)
    Set pPaths = paths
End Sub
