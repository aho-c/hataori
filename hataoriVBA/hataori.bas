Attribute VB_Name = "hataori"
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

' https://learn.microsoft.com/ja-jp/windows/win32/api/synchapi/nf-synchapi-sleep
Private Declare PtrSafe Sub Sleep Lib "kernel32" (ByVal dwMilliseconds As LongPtr)

Private Function writeReqFile(file_path As String, Optional write_data = Empty) As Boolean
    writeReqFile = False
    
    Dim fileNumber As Long: fileNumber = FreeFile
    
    Open file_path For Output Lock Read Write As #fileNumber
        Close #fileNumber

    If Not IsEmpty(write_data) Then
        Dim bytes() As Byte: bytes = write_data
        fileNumber = FreeFile
        Open file_path For Binary Access Read Write Lock Read Write As #fileNumber
            Put #fileNumber, 1, bytes
            Close #fileNumber
    End If
    
    writeReqFile = True
End Function

Private Function readResFile(file_path As String) As String
    Dim fileNumber As Long: fileNumber = FreeFile
    Dim leng As Long
    Dim bytes() As Byte
    
    Open file_path For Binary Access Read Write Lock Read Write As #fileNumber
        leng = LOF(fileNumber) - 1
        ReDim bytes(leng)
        Get #fileNumber, 1, bytes
        Close #fileNumber
    
    readResFile = bytes
End Function

Private Sub deleteResFile(file_path As String)
    CreateObject("Scripting.FileSystemObject").DeleteFile file_path, True
End Sub

Private Function existsFilePath(ByVal file_path As String) As Boolean
    existsFilePath = CreateObject("Scripting.FileSystemObject").FileExists(file_path)
End Function

Private Function getShortFilePath(ByVal file_path As String) As String
    getShortFilePath = CreateObject("Scripting.FileSystemObject").getFile(file_path).ShortPath
End Function

Private Function getFileModified(ByVal file_path As String) As Date
    getFileModified = CreateObject("Scripting.FileSystemObject").getFile(file_path).DateLastModified
End Function

Private Function getNowUnixEpoch() As Double
    getNowUnixEpoch = DateDiff("s", "1970/1/1 9:00", Now)
End Function

Private Function hostMessaging( _
    group_name As String, _
    function_name As String, _
    Optional value1 = Empty, _
    Optional value2 = Empty, _
    Optional value3 = Empty, _
    Optional value4 = Empty _
) As Dictionary
    Dim reqFile As String: reqFile = GetSettingValue("req_file")
    Dim resFile As String: resFile = GetSettingValue("res_file")
    Dim modified As Date: modified = CDate("1970/01/01 00:00:00")

    Dim messageString As String: messageString = JsonConverter.ConvertToJson( _
        getMessagingDict(group_name, function_name, value1, value2, value3, value4) _
    )
    
    If Not writeReqFile(reqFile, messageString) Then
        Err.Raise vbObjectError + 1, "hataori.HataoriConnect", "Failed to write the response file."
    End If

    Dim timeoutSeconds As Long: timeoutSeconds = GetSettingValue("res_timeout_seconds")
    
    Dim nowDateTime As Double: nowDateTime = getNowUnixEpoch()
    
    Do While True
        If existsFilePath(resFile) Then
            If modified < getFileModified(resFile) Then
                Exit Do
            End If
        End If
        
        If getNowUnixEpoch() - nowDateTime > timeoutSeconds Then
            Err.Raise vbObjectError + 1, "hataori.HataoriConnect", "Response time out."
            Exit Do
        End If
        
        Sleep 100
        DoEvents
    Loop

    Dim jsonText As String: jsonText = readResFile(resFile)
    deleteResFile resFile
   
    Dim jsonObject As Object: Set jsonObject = JsonConverter.ParseJson(jsonText) ' Object (Dictionary) or Array (Collection)

    Set hostMessaging = jsonObject
End Function

Private Function getMessagingDict( _
    group_name As String, _
    function_name As String, _
    Optional value1 = Empty, _
    Optional value2 = Empty, _
    Optional value3 = Empty, _
    Optional value4 = Empty _
) As Dictionary
    Set getMessagingDict = New Dictionary
    
    getMessagingDict.Add "gp", group_name
    getMessagingDict.Add "fc", function_name
   
    Dim paramDict As Dictionary: Set paramDict = New Dictionary
    Dim paramExists As Boolean: paramExists = False
    
    If Not IsEmpty(value1) Then paramDict.Add "v1", value1: paramExists = True
    If Not IsEmpty(value2) Then paramDict.Add "v2", value2: paramExists = True
    If Not IsEmpty(value3) Then paramDict.Add "v3", value3: paramExists = True
    If Not IsEmpty(value4) Then paramDict.Add "v4", value4: paramExists = True
    
    If paramExists Then getMessagingDict.Add "p", paramDict
End Function

Private Sub checkResponseDict(parent_function_name As String, dict As Dictionary, Optional retTypeName As String = "")
    If (Not dict.Exists("ret")) Or (Not dict.Exists("err")) Then
        Err.Raise vbObjectError + 1, parent_function_name, "ret or err does not exist."
    End If
    
    If Not dict("err") = "" Then
        Err.Raise vbObjectError + 1, parent_function_name, "Error: " & dict("err")
    End If

    If Len(retTypeName) > 0 Then
        If Not LCase(TypeName(dict("ret"))) = LCase(retTypeName) Then
            Err.Raise vbObjectError + 1, parent_function_name, "Return value is not a '" & retTypeName & "'."
        End If
    End If
End Sub


Public Function GetElementObject( _
    group_name As String, _
    function_name As String, _
    Optional value1 = Empty, _
    Optional value2 = Empty, _
    Optional value3 = Empty, _
    Optional value4 = Empty _
) As hataoriElement
    Dim dict As Dictionary: Set dict = hostMessaging(group_name, function_name, value1, value2, value3, value4)

    checkResponseDict "hataori.GetElementObject", dict, "dictionary"

    If Not dict("ret").Exists("path") Then
        Err.Raise vbObjectError + 1, "hataori.GetElementObject", "path does not exist."
    End If

    Dim retDict As Dictionary: Set retDict = dict("ret")
    Dim path As String: path = retDict("path")
    Set GetElementObject = New hataoriElement
    GetElementObject.init path
End Function

Public Function GetElementsObject( _
    group_name As String, _
    function_name As String, _
    Optional value1 = Empty, _
    Optional value2 = Empty, _
    Optional value3 = Empty, _
    Optional value4 = Empty _
) As hataoriElements
    Dim dict As Dictionary: Set dict = hostMessaging(group_name, function_name, value1, value2, value3, value4)

    checkResponseDict "hataori.GetElementsObject", dict, "collection"

    Dim elem As Dictionary
    Dim paths As Collection: Set paths = New Collection
    For Each elem In dict("ret")
        If Not elem.Exists("path") Then
            Err.Raise vbObjectError + 1, "hataori.GetElementsObject", "path does not exist."
        End If
        paths.Add elem("path")
    Next elem

    Set GetElementsObject = New hataoriElements
    GetElementsObject.init paths
End Function

Public Function GetValueType( _
    group_name As String, _
    function_name As String, _
    Optional value1 = Empty, _
    Optional value2 = Empty, _
    Optional value3 = Empty, _
    Optional value4 = Empty _
)
    Dim dict As Dictionary: Set dict = hostMessaging(group_name, function_name, value1, value2, value3, value4)

    checkResponseDict "hataori.GetValueType", dict

    Dim objectValue As Boolean: objectValue = False

    Select Case TypeName(dict("ret"))
        Case "Integer", "Long", "Single", "Double"
            objectValue = False
        Case "Boolean"
            objectValue = False
        Case "String"
            objectValue = False
        Case "Null"
            objectValue = False
        Case "Collection"
            objectValue = True
        Case "Dictionary"
            objectValue = True
        Case Else
            Err.Raise vbObjectError + 1, "hataori.GetValueType", "Value is not a number, string, or Boolean."
    End Select

    If Not objectValue Then GetValueType = dict("ret")
    If objectValue Then Set GetValueType = dict("ret")
End Function

Public Function GetSettingValue(key As String) As String
    Dim dict As Dictionary:  Set dict = hataoriSetting.hataoriSetting
    If Not dict.Exists(key) Then Err.Raise vbObjectError + 1, "hataoriSetting.HataoriSetting", "Key does not exist"
    GetSettingValue = dict(key)
End Function

