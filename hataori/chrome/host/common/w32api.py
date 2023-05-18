"""
hataori w32api
License: MIT License (http://www.opensource.org/licenses/mit-license.php)
 (c) 2023 Fukasawa Takashi

Note: Use Win32 API in Python.
"""

import subprocess
import ctypes
import re
from ctypes import WINFUNCTYPE, POINTER, Structure, Union, byref, sizeof, c_void_p, c_long, c_ulong, c_ulonglong, c_int, c_bool
from ctypes.wintypes import WORD, DWORD, LONG, UINT, MAX_PATH, RECT
from decimal import Decimal, ROUND_HALF_UP

SB_HORZ = 0
SB_VERT = 1
SB_CTL = 2
SB_BOTH = 3
SB_LINEUP = 0
SB_LINELEFT = 0
SB_LINEDOWN = 1
SB_LINERIGHT = 1
SB_PAGEUP = 2
SB_PAGELEFT = 2
SB_PAGEDOWN = 3
SB_PAGERIGHT = 3
SB_THUMBPOSITION = 4
SB_THUMBTRACK = 5
SB_TOP = 6
SB_LEFT = 6
SB_BOTTOM = 7
SB_RIGHT = 7
SB_ENDSCROLL = 8
WM_NULL = 0x0000
WM_CREATE = 0x0001
WM_DESTROY = 0x0002
WM_MOVE = 0x0003
WM_SIZE = 0x0005
WM_ACTIVATE = 0x0006
WM_SETFOCUS = 0x0007
WM_KILLFOCUS = 0x0008
WM_ENABLE = 0x000A
WM_SETREDRAW = 0x000B
WM_SETTEXT = 0x000C
WM_GETTEXT = 0x000D
WM_GETTEXTLENGTH = 0x000E
WM_PAINT = 0x000F
WM_CLOSE = 0x0010
WM_QUERYENDSESSION = 0x0011
WM_QUERYOPEN = 0x0013
WM_ENDSESSION = 0x0016
WM_QUIT = 0x0012
WM_ERASEBKGND = 0x0014
WM_SYSCOLORCHANGE = 0x0015
WM_SHOWWINDOW = 0x0018
WM_WININICHANGE = 0x001A
WM_SETTINGCHANGE = WM_WININICHANGE
WM_DEVMODECHANGE = 0x001B
WM_ACTIVATEAPP = 0x001C
WM_FONTCHANGE = 0x001D
WM_TIMECHANGE = 0x001E
WM_CANCELMODE = 0x001F
WM_SETCURSOR = 0x0020
WM_MOUSEACTIVATE = 0x0021
WM_CHILDACTIVATE = 0x0022
WM_QUEUESYNC = 0x0023
WM_GETMINMAXINFO = 0x0024
WM_PAINTICON = 0x0026
WM_ICONERASEBKGND = 0x0027
WM_NEXTDLGCTL = 0x0028
WM_SPOOLERSTATUS = 0x002A
WM_DRAWITEM = 0x002B
WM_MEASUREITEM = 0x002C
WM_DELETEITEM = 0x002D
WM_VKEYTOITEM = 0x002E
WM_CHARTOITEM = 0x002F
WM_SETFONT = 0x0030
WM_GETFONT = 0x0031
WM_SETHOTKEY = 0x0032
WM_GETHOTKEY = 0x0033
WM_QUERYDRAGICON = 0x0037
WM_COMPAREITEM = 0x0039
WM_GETOBJECT = 0x003D
WM_COMPACTING = 0x0041
WM_WINDOWPOSCHANGING = 0x0046
WM_WINDOWPOSCHANGED = 0x0047
WM_POWER = 0x0048
WM_COPYDATA = 0x004A
WM_CANCELJOURNAL = 0x004B
WM_NOTIFY = 0x004E
WM_INPUTLANGCHANGEREQUEST = 0x0050
WM_INPUTLANGCHANGE = 0x0051
WM_TCARD = 0x0052
WM_HELP = 0x0053
WM_USERCHANGED = 0x0054
WM_NOTIFYFORMAT = 0x0055
WM_CONTEXTMENU = 0x007B
WM_STYLECHANGING = 0x007C
WM_STYLECHANGED = 0x007D
WM_DISPLAYCHANGE = 0x007E
WM_GETICON = 0x007F
WM_SETICON = 0x0080
WM_NCCREATE = 0x0081
WM_NCDESTROY = 0x0082
WM_NCCALCSIZE = 0x0083
WM_NCHITTEST = 0x0084
WM_NCPAINT = 0x0085
WM_NCACTIVATE = 0x0086
WM_GETDLGCODE = 0x0087
WM_SYNCPAINT = 0x0088
WM_NCMOUSEMOVE = 0x00A0
WM_NCLBUTTONDOWN = 0x00A1
WM_NCLBUTTONUP = 0x00A2
WM_NCLBUTTONDBLCLK = 0x00A3
WM_NCRBUTTONDOWN = 0x00A4
WM_NCRBUTTONUP = 0x00A5
WM_NCRBUTTONDBLCLK = 0x00A6
WM_NCMBUTTONDOWN = 0x00A7
WM_NCMBUTTONUP = 0x00A8
WM_NCMBUTTONDBLCLK = 0x00A9
WM_NCXBUTTONDOWN = 0x00AB
WM_NCXBUTTONUP = 0x00AC
WM_NCXBUTTONDBLCLK = 0x00AD
WM_INPUT_DEVICE_CHANGE = 0x00FE
WM_INPUT = 0x00FF
WM_KEYFIRST = 0x0100
WM_KEYDOWN = 0x0100
WM_KEYUP = 0x0101
WM_CHAR = 0x0102
WM_DEADCHAR = 0x0103
WM_SYSKEYDOWN = 0x0104
WM_SYSKEYUP = 0x0105
WM_SYSCHAR = 0x0106
WM_SYSDEADCHAR = 0x0107
WM_UNICHAR = 0x0109
WM_KEYLAST = 0x0109
WM_KEYLAST = 0x0108
WM_IME_STARTCOMPOSITION = 0x010D
WM_IME_ENDCOMPOSITION = 0x010E
WM_IME_COMPOSITION = 0x010F
WM_IME_KEYLAST = 0x010F
WM_INITDIALOG = 0x0110
WM_COMMAND = 0x0111
WM_SYSCOMMAND = 0x0112
WM_TIMER = 0x0113
WM_HSCROLL = 0x0114
WM_VSCROLL = 0x0115
WM_INITMENU = 0x0116
WM_INITMENUPOPUP = 0x0117
WM_GESTURE = 0x0119
WM_GESTURENOTIFY = 0x011A
WM_MENUSELECT = 0x011F
WM_MENUCHAR = 0x0120
WM_ENTERIDLE = 0x0121
WM_MENURBUTTONUP = 0x0122
WM_MENUDRAG = 0x0123
WM_MENUGETOBJECT = 0x0124
WM_UNINITMENUPOPUP = 0x0125
WM_MENUCOMMAND = 0x0126
WM_CHANGEUISTATE = 0x0127
WM_UPDATEUISTATE = 0x0128
WM_QUERYUISTATE = 0x0129
WM_CTLCOLORMSGBOX = 0x0132
WM_CTLCOLOREDIT = 0x0133
WM_CTLCOLORLISTBOX = 0x0134
WM_CTLCOLORBTN = 0x0135
WM_CTLCOLORDLG = 0x0136
WM_CTLCOLORSCROLLBAR = 0x0137
WM_CTLCOLORSTATIC = 0x0138
WM_MOUSEFIRST = 0x0200
WM_MOUSEMOVE = 0x0200
WM_LBUTTONDOWN = 0x0201
WM_LBUTTONUP = 0x0202
WM_LBUTTONDBLCLK = 0x0203
WM_RBUTTONDOWN = 0x0204
WM_RBUTTONUP = 0x0205
WM_RBUTTONDBLCLK = 0x0206
WM_MBUTTONDOWN = 0x0207
WM_MBUTTONUP = 0x0208
WM_MBUTTONDBLCLK = 0x0209
WM_MOUSEWHEEL = 0x020A
WM_XBUTTONDOWN = 0x020B
WM_XBUTTONUP = 0x020C
WM_XBUTTONDBLCLK = 0x020D
WM_MOUSEHWHEEL = 0x020E
WM_MOUSELAST = 0x020E
WM_MOUSELAST = 0x020D
WM_MOUSELAST = 0x020A
WM_MOUSELAST = 0x0209
WM_PARENTNOTIFY = 0x0210
WM_ENTERMENULOOP = 0x0211
WM_EXITMENULOOP = 0x0212
WM_NEXTMENU = 0x0213
WM_SIZING = 0x0214
WM_CAPTURECHANGED = 0x0215
WM_MOVING = 0x0216
WM_POWERBROADCAST = 0x0218
WM_DEVICECHANGE = 0x0219
WM_MDICREATE = 0x0220
WM_MDIDESTROY = 0x0221
WM_MDIACTIVATE = 0x0222
WM_MDIRESTORE = 0x0223
WM_MDINEXT = 0x0224
WM_MDIMAXIMIZE = 0x0225
WM_MDITILE = 0x0226
WM_MDICASCADE = 0x0227
WM_MDIICONARRANGE = 0x0228
WM_MDIGETACTIVE = 0x0229
WM_MDISETMENU = 0x0230
WM_ENTERSIZEMOVE = 0x0231
WM_EXITSIZEMOVE = 0x0232
WM_DROPFILES = 0x0233
WM_MDIREFRESHMENU = 0x0234
WM_POINTERDEVICECHANGE = 0x238
WM_POINTERDEVICEINRANGE = 0x239
WM_POINTERDEVICEOUTOFRANGE = 0x23A
WM_TOUCH = 0x0240
WM_NCPOINTERUPDATE = 0x0241
WM_NCPOINTERDOWN = 0x0242
WM_NCPOINTERUP = 0x0243
WM_POINTERUPDATE = 0x0245
WM_POINTERDOWN = 0x0246
WM_POINTERUP = 0x0247
WM_POINTERENTER = 0x0249
WM_POINTERLEAVE = 0x024A
WM_POINTERACTIVATE = 0x024B
WM_POINTERCAPTURECHANGED = 0x024C
WM_TOUCHHITTESTING = 0x024D
WM_POINTERWHEEL = 0x024E
WM_POINTERHWHEEL = 0x024F
WM_IME_SETCONTEXT = 0x0281
WM_IME_NOTIFY = 0x0282
WM_IME_CONTROL = 0x0283
WM_IME_COMPOSITIONFULL = 0x0284
WM_IME_SELECT = 0x0285
WM_IME_CHAR = 0x0286
WM_IME_REQUEST = 0x0288
WM_IME_KEYDOWN = 0x0290
WM_IME_KEYUP = 0x0291
WM_MOUSEHOVER = 0x02A1
WM_MOUSELEAVE = 0x02A3
WM_NCMOUSEHOVER = 0x02A0
WM_NCMOUSELEAVE = 0x02A2
WM_WTSSESSION_CHANGE = 0x02B1
WM_TABLET_FIRST = 0x02c0
WM_TABLET_LAST = 0x02df
WM_DPICHANGED = 0x02E0
WM_CUT = 0x0300
WM_COPY = 0x0301
WM_PASTE = 0x0302
WM_CLEAR = 0x0303
WM_UNDO = 0x0304
WM_RENDERFORMAT = 0x0305
WM_RENDERALLFORMATS = 0x0306
WM_DESTROYCLIPBOARD = 0x0307
WM_DRAWCLIPBOARD = 0x0308
WM_PAINTCLIPBOARD = 0x0309
WM_VSCROLLCLIPBOARD = 0x030A
WM_SIZECLIPBOARD = 0x030B
WM_ASKCBFORMATNAME = 0x030C
WM_CHANGECBCHAIN = 0x030D
WM_HSCROLLCLIPBOARD = 0x030E
WM_QUERYNEWPALETTE = 0x030F
WM_PALETTEISCHANGING = 0x0310
WM_PALETTECHANGED = 0x0311
WM_HOTKEY = 0x0312
WM_PRINT = 0x0317
WM_PRINTCLIENT = 0x0318
WM_APPCOMMAND = 0x0319
WM_THEMECHANGED = 0x031A
WM_CLIPBOARDUPDATE = 0x031D
WM_DWMCOMPOSITIONCHANGED = 0x031E
WM_DWMNCRENDERINGCHANGED = 0x031F
WM_DWMCOLORIZATIONCOLORCHANGED = 0x0320
WM_DWMWINDOWMAXIMIZEDCHANGE = 0x0321
WM_DWMSENDICONICTHUMBNAIL = 0x0323
WM_DWMSENDICONICLIVEPREVIEWBITMAP = 0x0326
WM_GETTITLEBARINFOEX = 0x033F
WM_HANDHELDFIRST = 0x0358
WM_HANDHELDLAST = 0x035F
WM_AFXFIRST = 0x0360
WM_AFXLAST = 0x037F
WM_PENWINFIRST = 0x0380
WM_PENWINLAST = 0x038F
WM_APP = 0x8000
WM_USER = 0x0400
EM_GETSEL = 0x00B0
EM_SETSEL = 0x00B1
EM_GETRECT = 0x00B2
EM_SETRECT = 0x00B3
EM_SETRECTNP = 0x00B4
EM_SCROLL = 0x00B5
EM_LINESCROLL = 0x00B6
EM_SCROLLCARET = 0x00B7
EM_GETMODIFY = 0x00B8
EM_SETMODIFY = 0x00B9
EM_GETLINECOUNT = 0x00BA
EM_LINEINDEX = 0x00BB
EM_SETHANDLE = 0x00BC
EM_GETHANDLE = 0x00BD
EM_GETTHUMB = 0x00BE
EM_LINELENGTH = 0x00C1
EM_REPLACESEL = 0x00C2
EM_GETLINE = 0x00C4
EM_LIMITTEXT = 0x00C5
EM_CANUNDO = 0x00C6
EM_UNDO = 0x00C7
EM_FMTLINES = 0x00C8
EM_LINEFROMCHAR = 0x00C9
EM_SETTABSTOPS = 0x00CB
EM_SETPASSWORDCHAR = 0x00CC
EM_EMPTYUNDOBUFFER = 0x00CD
EM_GETFIRSTVISIBLELINE = 0x00CE
EM_SETREADONLY = 0x00CF
EM_SETWORDBREAKPROC = 0x00D0
EM_GETWORDBREAKPROC = 0x00D1
EM_GETPASSWORDCHAR = 0x00D2
EM_SETMARGINS = 0x00D3
EM_GETMARGINS = 0x00D4
EM_SETLIMITTEXT = EM_LIMITTEXT
EM_GETLIMITTEXT = 0x00D5
EM_POSFROMCHAR = 0x00D6
EM_CHARFROMPOS = 0x00D7
EM_SETIMESTATUS = 0x00D8
EM_GETIMESTATUS = 0x00D9
CCM_FIRST = 0x2000
CCM_LAST = CCM_FIRST + 0x200
CCM_SETBKCOLOR = CCM_FIRST + 1
CCM_SETCOLORSCHEME = CCM_FIRST + 2
CCM_GETCOLORSCHEME = CCM_FIRST + 3
CCM_GETDROPTARGET = CCM_FIRST + 4
CCM_SETUNICODEFORMAT = CCM_FIRST + 5
CCM_GETUNICODEFORMAT = CCM_FIRST + 6
CCM_SETVERSION = CCM_FIRST + 0x7
CCM_GETVERSION = CCM_FIRST + 0x8
CCM_SETNOTIFYWINDOW = CCM_FIRST + 0x9
CCM_SETWINDOWTHEME = CCM_FIRST + 0xb
CCM_DPISCALE = CCM_FIRST + 0xc
LVM_FIRST = 0x1000
TV_FIRST = 0x1100
TCM_FIRST = 0x1300
ECM_FIRST = 0x1500
TB_ADDBUTTONSA = WM_USER + 20
TB_INSERTBUTTONA = WM_USER + 21
TB_SAVERESTOREA = WM_USER + 26
TB_SAVERESTOREW = WM_USER + 76
TB_ADDSTRINGA = WM_USER + 28
TB_ADDSTRINGW = WM_USER + 77
TB_GETBUTTONTEXTA = WM_USER + 45
TB_GETBUTTONTEXTW = WM_USER + 75
TB_MAPACCELERATORA = WM_USER + 78
TB_MAPACCELERATORW = WM_USER + 90
TB_GETBUTTONINFOW = WM_USER + 63
TB_SETBUTTONINFOW = WM_USER + 64
TB_GETBUTTONINFOA = WM_USER + 65
TB_SETBUTTONINFOA = WM_USER + 66
TB_INSERTBUTTONW = WM_USER + 67
TB_ADDBUTTONSW = WM_USER + 68
TB_GETSTRINGW = WM_USER + 91
TB_GETSTRINGA = WM_USER + 92
SB_SETTEXTA = WM_USER + 1
SB_SETTEXTW = WM_USER + 11
SB_GETTEXTA = WM_USER + 2
SB_GETTEXTW = WM_USER + 13
SB_GETTEXTLENGTHA = WM_USER + 3
SB_GETTEXTLENGTHW = WM_USER + 12
SB_SETTIPTEXTA = WM_USER + 16
SB_SETTIPTEXTW = WM_USER + 17
SB_GETTIPTEXTA = WM_USER + 18
SB_GETTIPTEXTW = WM_USER + 19
LVM_GETITEMA = LVM_FIRST + 5
LVM_GETITEMW = LVM_FIRST + 75
LVM_SETITEMA = LVM_FIRST + 6
LVM_SETITEMW = LVM_FIRST + 76
LVM_INSERTITEMA = LVM_FIRST + 7
LVM_INSERTITEMW = LVM_FIRST + 77
LVM_EDITLABELA = LVM_FIRST + 23
LVM_EDITLABELW = LVM_FIRST + 118
LVM_GETISEARCHSTRINGA = LVM_FIRST + 52
LVM_GETISEARCHSTRINGW = LVM_FIRST + 117
LVM_SETBKIMAGEA = LVM_FIRST + 68
LVM_SETBKIMAGEW = LVM_FIRST + 138
LVM_GETBKIMAGEA = LVM_FIRST + 69
LVM_GETBKIMAGEW = LVM_FIRST + 139
TVM_EDITLABELA = TV_FIRST + 14
TVM_EDITLABELW = TV_FIRST + 65
TVM_GETISEARCHSTRINGA = TV_FIRST + 23
TVM_GETISEARCHSTRINGW = TV_FIRST + 64
TCM_GETITEMA = TCM_FIRST + 5
TCM_GETITEMW = TCM_FIRST + 60
TCM_SETITEMA = TCM_FIRST + 6
TCM_SETITEMW = TCM_FIRST + 61
TCM_INSERTITEMA = TCM_FIRST + 7
TCM_INSERTITEMW = TCM_FIRST + 62
VK_LBUTTON = 0x01
VK_RBUTTON = 0x02
VK_CANCEL = 0x03
VK_MBUTTON = 0x04
VK_XBUTTON1 = 0x05
VK_XBUTTON2 = 0x06
AX_VK_0x07 = 0x07
VK_BACK = 0x08
VK_TAB = 0x09
AX_VK_0x0A = 0x0A
AX_VK_0x0B = 0x0B
VK_CLEAR = 0x0C
VK_RETURN = 0x0D
AX_VK_0x0E = 0x0E
AX_VK_0x0F = 0x0F
VK_SHIFT = 0x10
VK_CONTROL = 0x11
VK_MENU = 0x12
VK_PAUSE = 0x13
VK_CAPITAL = 0x14
VK_KANA = 0x15
VK_KANA = 0x15
VK_KANA = 0x15
AX_VK_IME_ON = 0x16
VK_JUNJA = 0x17
VK_FINAL = 0x18
VK_HANJA = 0x19
VK_HANJA = 0x19
AX_VK_IME_OFF = 0x1A
VK_ESCAPE = 0x1B
VK_CONVERT = 0x1C
VK_NONCONVERT = 0x1D
VK_ACCEPT = 0x1E
VK_MODECHANGE = 0x1F
VK_SPACE = 0x20
VK_PRIOR = 0x21
VK_NEXT = 0x22
VK_END = 0x23
VK_HOME = 0x24
VK_LEFT = 0x25
VK_UP = 0x26
VK_RIGHT = 0x27
VK_DOWN = 0x28
VK_SELECT = 0x29
VK_PRINT = 0x2A
VK_EXECUTE = 0x2B
VK_SNAPSHOT = 0x2C
VK_INSERT = 0x2D
VK_DELETE = 0x2E
VK_HELP = 0x2F
AX_VK_0 = 0x30
AX_VK_1 = 0x31
AX_VK_2 = 0x32
AX_VK_3 = 0x33
AX_VK_4 = 0x34
AX_VK_5 = 0x35
AX_VK_6 = 0x36
AX_VK_7 = 0x37
AX_VK_8 = 0x38
AX_VK_9 = 0x39
AX_VK_0x3A = 0x3A
AX_VK_0x3B = 0x3B
AX_VK_0x3C = 0x3C
AX_VK_0x3D = 0x3D
AX_VK_0x3E = 0x3E
AX_VK_0x3F = 0x3F
AX_VK_0x40 = 0x40
AX_VK_A = 0x41
AX_VK_B = 0x42
AX_VK_C = 0x43
AX_VK_D = 0x44
AX_VK_E = 0x45
AX_VK_F = 0x46
AX_VK_G = 0x47
AX_VK_H = 0x48
AX_VK_I = 0x49
AX_VK_J = 0x4A
AX_VK_K = 0x4B
AX_VK_L = 0x4C
AX_VK_M = 0x4D
AX_VK_N = 0x4E
AX_VK_O = 0x4F
AX_VK_P = 0x50
AX_VK_Q = 0x51
AX_VK_R = 0x52
AX_VK_S = 0x53
AX_VK_T = 0x54
AX_VK_U = 0x55
AX_VK_V = 0x56
AX_VK_W = 0x57
AX_VK_X = 0x58
AX_VK_Y = 0x59
AX_VK_Z = 0x5A
VK_LWIN = 0x5B
VK_RWIN = 0x5C
VK_APPS = 0x5D
AX_VK_0x5E = 0x5E
VK_SLEEP = 0x5F
VK_NUMPAD0 = 0x60
VK_NUMPAD1 = 0x61
VK_NUMPAD2 = 0x62
VK_NUMPAD3 = 0x63
VK_NUMPAD4 = 0x64
VK_NUMPAD5 = 0x65
VK_NUMPAD6 = 0x66
VK_NUMPAD7 = 0x67
VK_NUMPAD8 = 0x68
VK_NUMPAD9 = 0x69
VK_MULTIPLY = 0x6A
VK_ADD = 0x6B
VK_SEPARATOR = 0x6C
VK_SUBTRACT = 0x6D
VK_DECIMAL = 0x6E
VK_DIVIDE = 0x6F
VK_F1 = 0x70
VK_F2 = 0x71
VK_F3 = 0x72
VK_F4 = 0x73
VK_F5 = 0x74
VK_F6 = 0x75
VK_F7 = 0x76
VK_F8 = 0x77
VK_F9 = 0x78
VK_F10 = 0x79
VK_F11 = 0X7a
VK_F12 = 0x7B
VK_F13 = 0x7C
VK_F14 = 0x7D
VK_F15 = 0x7E
VK_F16 = 0x7F
VK_F17 = 0x80
VK_F18 = 0x81
VK_F19 = 0x82
VK_F20 = 0x83
VK_F21 = 0x84
VK_F22 = 0x85
VK_F23 = 0x86
VK_F24 = 0x87
VK_NAVIGATION_VIEW = 0x88
VK_NAVIGATION_MENU = 0x89
VK_NAVIGATION_UP = 0x8A
VK_NAVIGATION_DOWN = 0x8B
VK_NAVIGATION_LEFT = 0x8C
VK_NAVIGATION_RIGHT = 0x8D
VK_NAVIGATION_ACCEPT = 0x8E
VK_NAVIGATION_CANCEL = 0x8F
VK_NUMLOCK = 0x90
VK_SCROLL = 0x91
VK_OEM_NEC_EQUAL = 0x92
VK_OEM_FJ_MASSHOU = 0x93
VK_OEM_FJ_TOUROKU = 0x94
VK_OEM_FJ_LOYA = 0x95
VK_OEM_FJ_ROYA = 0x96
AX_VK_0x97 = 0x97
AX_VK_0x98 = 0x98
AX_VK_0x99 = 0x99
AX_VK_0x9A = 0x9A
AX_VK_0x9B = 0x9B
AX_VK_0x9C = 0x9C
AX_VK_0x9D = 0x9D
AX_VK_0x9E = 0x9E
AX_VK_0x9F = 0x9F
VK_LSHIFT = 0xA0
VK_RSHIFT = 0xA1
VK_LCONTROL = 0xA2
VK_RCONTROL = 0xA3
VK_LMENU = 0xA4
VK_RMENU = 0xA5
VK_BROWSER_BACK = 0xA6
VK_BROWSER_FORWARD = 0xA7
VK_BROWSER_REFRESH = 0xA8
VK_BROWSER_STOP = 0xA9
VK_BROWSER_SEARCH = 0xAA
VK_BROWSER_FAVORITES = 0xAB
VK_BROWSER_HOME = 0xAC
VK_VOLUME_MUTE = 0xAD
VK_VOLUME_DOWN = 0xAE
VK_VOLUME_UP = 0xAF
VK_MEDIA_NEXT_TRACK = 0xB0
VK_MEDIA_PREV_TRACK = 0xB1
VK_MEDIA_STOP = 0xB2
VK_MEDIA_PLAY_PAUSE = 0xB3
VK_LAUNCH_MAIL = 0xB4
VK_LAUNCH_MEDIA_SELECT = 0xB5
VK_LAUNCH_APP1 = 0xB6
VK_LAUNCH_APP2 = 0xB7
AX_VK_0xB8 = 0xB8
AX_VK_0xB9 = 0xB9
VK_OEM_1 = 0xBA
VK_OEM_PLUS = 0xBB
VK_OEM_COMMA = 0xBC
VK_OEM_MINUS = 0xBD
VK_OEM_PERIOD = 0xBE
VK_OEM_2 = 0xBF
VK_OEM_3 = 0xC0
AX_VK_0xC1 = 0xC1
AX_VK_0xC2 = 0xC2
VK_GAMEPAD_A = 0xC3
VK_GAMEPAD_B = 0xC4
VK_GAMEPAD_X = 0xC5
VK_GAMEPAD_Y = 0xC6
VK_GAMEPAD_RIGHT_SHOULDER = 0xC7
VK_GAMEPAD_LEFT_SHOULDER = 0xC8
VK_GAMEPAD_LEFT_TRIGGER = 0xC9
VK_GAMEPAD_RIGHT_TRIGGER = 0xCA
VK_GAMEPAD_DPAD_UP = 0xCB
VK_GAMEPAD_DPAD_DOWN = 0xCC
VK_GAMEPAD_DPAD_LEFT = 0xCD
VK_GAMEPAD_DPAD_RIGHT = 0xCE
VK_GAMEPAD_MENU = 0xCF
VK_GAMEPAD_VIEW = 0xD0
VK_GAMEPAD_LEFT_THUMBSTICK_BUTTON = 0xD1
VK_GAMEPAD_RIGHT_THUMBSTICK_BUTTON = 0xD2
VK_GAMEPAD_LEFT_THUMBSTICK_UP = 0xD3
VK_GAMEPAD_LEFT_THUMBSTICK_DOWN = 0xD4
VK_GAMEPAD_LEFT_THUMBSTICK_RIGHT = 0xD5
VK_GAMEPAD_LEFT_THUMBSTICK_LEFT = 0xD6
VK_GAMEPAD_RIGHT_THUMBSTICK_UP = 0xD7
VK_GAMEPAD_RIGHT_THUMBSTICK_DOWN = 0xD8
VK_GAMEPAD_RIGHT_THUMBSTICK_RIGHT = 0xD9
VK_GAMEPAD_RIGHT_THUMBSTICK_LEFT = 0xDA
VK_OEM_4 = 0xDB
VK_OEM_5 = 0xDC
VK_OEM_6 = 0xDD
VK_OEM_7 = 0xDE
VK_OEM_8 = 0xDF
AX_VK_0xE0 = 0xE0
VK_OEM_AX = 0xE1
VK_OEM_102 = 0xE2
VK_ICO_HELP = 0xE3
VK_ICO_00 = 0xE4
VK_PROCESSKEY = 0xE5
VK_ICO_CLEAR = 0xE6
VK_PACKET = 0xE7
AX_VK_0xE8 = 0xE8
VK_OEM_RESET = 0xE9
VK_OEM_JUMP = 0xEA
VK_OEM_PA1 = 0xEB
VK_OEM_PA2 = 0xEC
VK_OEM_PA3 = 0xED
VK_OEM_WSCTRL = 0xEE
VK_OEM_CUSEL = 0xEF
VK_OEM_ATTN = 0xF0
VK_OEM_FINISH = 0xF1
VK_OEM_COPY = 0xF2
VK_OEM_AUTO = 0xF3
VK_OEM_ENLW = 0xF4
VK_OEM_BACKTAB = 0xF5
VK_ATTN = 0xF6
VK_CRSEL = 0xF7
VK_EXSEL = 0xF8
VK_EREOF = 0xF9
VK_PLAY = 0xFA
VK_ZOOM = 0xFB
VK_NONAME = 0xFC
VK_PA1 = 0xFD
VK_OEM_CLEAR = 0xFE

MAPVK_VK_TO_VSC = 0

INPUT_MOUSE = 0x0000
INPUT_KEYBOARD = 0x0001
INPUT_HARDWARE = 0x0002

KEYEVENTF_SCANCODE = 0x0008
KEYEVENTF_UNICODE = 0x0004
KEYEVENTF_KEYUP = 0x0002
KEYEVENTF_EXTENDEDKEY = 0x0001
MOUSEEVENTF_MOVE = 0x0001
MOUSEEVENTF_ABSOLUTE = 0x8000
MOUSEEVENTF_LEFTDOWN = 0x0002
MOUSEEVENTF_LEFTUP = 0x0004
MOUSEEVENTF_RIGHTDOWN = 0x0008
MOUSEEVENTF_RIGHTUP = 0x0010
MOUSEEVENTF_MIDDLEDOWN = 0x0020
MOUSEEVENTF_MIDDLEUP = 0x0040
MOUSEEVENTF_WHEEL = 0x0800
WHEEL_DELTA = 120

SM_CXSCREEN = 0
SM_CYSCREEN = 1
SM_CXVIRTUALSCREEN = 78
SM_CYVIRTUALSCREEN = 79

ULONG = None

SW_HIDE = 0
SW_SHOWNORMAL = 1
SW_SHOWMINIMIZED = 2
SW_SHOWMAXIMIZED = 3
SW_SHOWNOACTIVATE = 4
SW_SHOW = 5
SW_MINIMIZE = 6
SW_SHOWMINNOACTIVE = 7
SW_SHOWNA = 8
SW_RESTORE = 9
SW_SHOWDEFAULT = 10
SW_FORCEMINIMIZE = 11

HWND_BOTTOM = 1
HWND_NOTOPMOST = -2
HWND_TOP = 0
HWND_TOPMOST = -1

SWP_ASYNCWINDOWPOS = 0x4000
SWP_DEFERERASE = 0x2000
SWP_DRAWFRAME = 0x0020
SWP_FRAMECHANGED = 0x0020
SWP_HIDEWINDOW = 0x0080
SWP_NOACTIVATE = 0x0010
SWP_NOCOPYBITS = 0x0100
SWP_NOMOVE = 0x0002
SWP_NOOWNERZORDER = 0x0200
SWP_NOREDRAW = 0x0008
SWP_NOREPOSITION = 0x0200
SWP_NOSENDCHANGING = 0x0400
SWP_NOSIZE = 0x0001
SWP_NOZORDER = 0x0004
SWP_SHOWWINDOW = 0x0040

if sizeof(c_void_p) == 4: ULONG = c_ulong
else: ULONG = c_ulonglong

class KEYBDINPUT(Structure):_fields_ = [('wVk' , WORD), ('wScan', WORD), ('dwFlags', DWORD), ('time', DWORD), ('dwExtraInfo', ULONG)]
class MOUSEINPUT(Structure):_fields_ = [('dx' , LONG), ('dy', LONG), ('mouseData', DWORD), ('dwFlags', DWORD), ('time', DWORD), ('dwExtraInfo', ULONG)]
class HARDWAREINPUT(Structure):_fields_ = [('uMsg' , DWORD), ('wParamL', WORD), ('wParamH', WORD)]
class INPUT_DUMMY(Union):_fields_ = [('mi', MOUSEINPUT), ('ki', KEYBDINPUT), ('hi', HARDWAREINPUT)]
class INPUT(Structure):
    _anonymous_ = ['dummy']
    _fields_ = [('type', DWORD), ('dummy', INPUT_DUMMY)]
class LPPOINT(Structure):_fields_ = [('x', c_long), ('y', c_long)]

FindWindowW = ctypes.windll.user32.FindWindowW
FindWindow = ctypes.windll.user32.FindWindowA
SetForegroundWindow = ctypes.windll.user32.SetForegroundWindow
GetForegroundWindow = ctypes.windll.user32.GetForegroundWindow
SendMessageW = ctypes.windll.user32.SendMessageW
PostMessageW = ctypes.windll.user32.PostMessageW
ShowWindow = ctypes.windll.user32.ShowWindow
SendInput = ctypes.windll.user32.SendInput
SendInput.argtypes = UINT, POINTER(INPUT), c_int
SendInput.restype = UINT
MapVirtualKeyExW = ctypes.windll.user32.MapVirtualKeyExW
GetSystemMetrics = ctypes.windll.user32.GetSystemMetrics
SetCursorPos = ctypes.windll.user32.SetCursorPos
GetCursorPos = ctypes.windll.user32.GetCursorPos
GetWindowTextW = ctypes.windll.user32.GetWindowTextW
GetWindowTextLengthW = ctypes.windll.user32.GetWindowTextLengthW
GetClassName = ctypes.windll.user32.GetClassNameW
QueryFullProcessImageNameW = ctypes.windll.kernel32.QueryFullProcessImageNameW
EnumWindows = ctypes.windll.user32.EnumWindows
GetLastError = ctypes.GetLastError
SetWindowPos = ctypes.windll.user32.SetWindowPos
BringWindowToTop = ctypes.windll.user32.BringWindowToTop
SetFocus = ctypes.windll.user32.SetFocus
GetWindowRect = ctypes.windll.user32.GetWindowRect

key_function = {
    'mouseleft': 0x01,
    'mouseright': 0x02,
    'cancel': 0x03,
    'mousemiddle': 0x04,
    'back': 0x08,
    'tab': 0x09,
    'clear': 0x0c,
    'enter': 0x0d,
    'pause': 0x13,
    'capslock': 0x14,
    'esc': 0x1b,
    'space': 0x20,
    'pageup': 0x21,
    'pagedown': 0x22,
    'end': 0x23,
    'home': 0x24,
    'left': 0x25,
    'up': 0x26,
    'right': 0x27,
    'down': 0x28,
    'printscreen': 0x2a,
    'ins': 0x2d,
    'del': 0x2e,
    'help': 0x2f,
    'numlock': 0x90,
    'scrolllock': 0x91,
    'alt': VK_MENU,
    'ctrl': VK_CONTROL,
    'shift': VK_SHIFT,
    'win': VK_LWIN,
    'f1': 0x70,
    'f2': 0x71,
    'f3': 0x72,
    'f4': 0x73,
    'f5': 0x74,
    'f6': 0x75,
    'f7': 0x76,
    'f8': 0x77,
    'f9': 0x78,
    'f10': 0x79,
    'f11': 0x7a,
    'f12': 0x7b,
    'f13': 0x7c,
    'f14': 0x7d,
    'f15': 0x7e,
    'f16': 0x7f,
    'f17': 0x80,
    'f18': 0x81,
    'f19': 0x82,
    'f20': 0x83,
    'f21': 0x84,
    'f22': 0x85,
    'f23': 0x86,
    'f24': 0x87,
    '0': 0x30,
    '1': 0x31,
    '2': 0x32,
    '3': 0x33,
    '4': 0x34,
    '5': 0x35,
    '6': 0x36,
    '7': 0x37,
    '8': 0x38,
    '9': 0x39,
    'a': 0x41,
    'b': 0x42,
    'c': 0x43,
    'd': 0x44,
    'e': 0x45,
    'f': 0x46,
    'g': 0x47,
    'h': 0x48,
    'i': 0x49,
    'j': 0x4a,
    'k': 0x4b,
    'l': 0x4c,
    'm': 0x4d,
    'n': 0x4e,
    'o': 0x4f,
    'p': 0x50,
    'q': 0x51,
    'r': 0x52,
    's': 0x53,
    't': 0x54,
    'u': 0x55,
    'v': 0x56,
    'w': 0x57,
    'x': 0x58,
    'y': 0x59,
    'z': 0x5a,
}

def __reg(text, pattern, ignorecase = False, multiline = False):
    match_flgs = 0
    if ignorecase: match_flgs = match_flgs | re.MULTILINE
    if multiline: match_flgs = match_flgs | re.IGNORECASE
    iter = re.finditer(pattern, text, match_flgs)
    group, span, start, end, match = [], [], [], [], []
    for item in iter:
        group, span = group + list(item.groups()), span + list(item.span())
        start.append(item.start())
        end.append(item.end())
        match.append(item.group())
    return {'groups': group, 'span': span, 'start': start, 'end': end, 'text': match}

def __press_key_code(key_code):
    if not type(key_code) is int: return False
    input_structure = INPUT(type=INPUT_KEYBOARD, ki=KEYBDINPUT(wVk=key_code, wScan=MapVirtualKeyExW(key_code, MAPVK_VK_TO_VSC, 0)))
    if SendInput(1, byref(input_structure), sizeof(INPUT)) != 0: return True
    return False

def __release_key_code(key_code):
    if not type(key_code) is int: return False
    input_structure = INPUT(type=INPUT_KEYBOARD, ki=KEYBDINPUT(wVk = key_code, wScan=MapVirtualKeyExW(key_code, MAPVK_VK_TO_VSC, 0), dwFlags = KEYEVENTF_KEYUP))
    if SendInput(1, byref(input_structure), sizeof(INPUT)) != 0: return True
    return False

def __send_key_code(key_code):
    if not __press_key_code(key_code): return False
    if not __release_key_code(key_code): return False
    return True

def clip(string):
    script = 'chcp 65001|set /P <NUL="' + string + '"|clip.exe'
    startupinfo = subprocess.STARTUPINFO()
    startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
    startupinfo.wShowWindow = 0
    result = subprocess.run(script, shell = True, startupinfo=startupinfo, stdout=subprocess.PIPE)
    return True

# Usage:   string_key = command key -> 'shift+', 'alt+', 'ctrl+', 'win+'
#                     main key    -> key string
# Example: send_keys('shift+alt+a') -> shift & alt & A Key
def send_keys(string_key):
    lower_key = string_key.lower()
    keys = lower_key.split('+')

    for key in keys:
        if not key in key_function: return False

    for key in keys:
        if key == 'shift': __press_key_code(VK_SHIFT)
        elif key == 'ctrl': __press_key_code(VK_CONTROL)
        elif key == 'alt': __press_key_code(VK_MENU)
        elif key == 'win': __press_key_code(VK_LWIN)
        else:
            if key in key_function:
                __press_key_code(key_function[key])
                __release_key_code(key_function[key])

    for key in keys:
        if key == 'shift': __release_key_code(VK_SHIFT)
        elif key == 'ctrl': __release_key_code(VK_CONTROL)
        elif key == 'alt': __release_key_code(VK_MENU)
        elif key == 'win': __release_key_code(VK_LWIN)

    return True

def send_text(text):
    if not type(text) is str: return False
    input_structure = INPUT(type=INPUT_KEYBOARD)
    for character in text:
        input_structure.ki = KEYBDINPUT(wVk=0, wScan=ord(character), dwFlags=KEYEVENTF_UNICODE, time=0, dwExtraInfo=0)
        if SendInput(1, byref(input_structure), sizeof(INPUT)) == 0: return False
        input_structure.ki.dwFlags = KEYEVENTF_KEYUP
        if SendInput(1, byref(input_structure), sizeof(INPUT)) == 0: return False
    return True

def mouse_move(pos_x, pos_y):
    mouse_structure = INPUT()
    mouse_structure.type = INPUT_MOUSE;
    mouse_structure.mi.dwFlags = MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE
    x = Decimal(str(pos_x * 0xffff / GetSystemMetrics(SM_CXSCREEN))).quantize(Decimal('0'), rounding=ROUND_HALF_UP)
    mouse_structure.mi.dx = int(x)
    y = Decimal(str(pos_y * 0xffff / GetSystemMetrics(SM_CYSCREEN))).quantize(Decimal('0'), rounding=ROUND_HALF_UP)
    mouse_structure.mi.dy = int(y)
    mouse_structure.mi.mouseData = 0
    mouse_structure.mi.dwExtraInfo = 0
    mouse_structure.mi.time = 0
    if SendInput(1, byref(mouse_structure), sizeof(INPUT)) != 0:
        SetCursorPos(pos_x, pos_y)
        return True
    return False

def mouse_down():
    mouse_structure = INPUT()
    mouse_structure.type = INPUT_MOUSE;
    mouse_structure.mi.dwFlags = MOUSEEVENTF_LEFTDOWN
    mouse_structure.mi.mouseData = 0
    mouse_structure.mi.dwExtraInfo = 0
    mouse_structure.mi.time = 0
    if SendInput(1, byref(mouse_structure), sizeof(INPUT)) != 0: return True
    return False

def mouse_up():
    mouse_structure = INPUT()
    mouse_structure.type = INPUT_MOUSE;
    mouse_structure.mi.dwFlags = MOUSEEVENTF_LEFTUP
    mouse_structure.mi.mouseData = 0
    mouse_structure.mi.dwExtraInfo = 0
    mouse_structure.mi.time = 0
    if SendInput(1, byref(mouse_structure), sizeof(INPUT)) != 0: return True
    return False

def click():
    if not mouse_down(): return False
    if not mouse_up(): return False
    return True

def right_mouse_down():
    mouse_structure = INPUT()
    mouse_structure.type = INPUT_MOUSE;
    mouse_structure.mi.dwFlags = MOUSEEVENTF_RIGHTDOWN
    mouse_structure.mi.mouseData = 0
    mouse_structure.mi.dwExtraInfo = 0
    mouse_structure.mi.time = 0
    if SendInput(1, byref(mouse_structure), sizeof(INPUT)) != 0: return True
    return False

def right_mouse_up():
    mouse_structure = INPUT()
    mouse_structure.type = INPUT_MOUSE;
    mouse_structure.mi.dwFlags = MOUSEEVENTF_RIGHTUP
    mouse_structure.mi.mouseData = 0
    mouse_structure.mi.dwExtraInfo = 0
    mouse_structure.mi.time = 0
    if SendInput(1, byref(mouse_structure), sizeof(INPUT)) != 0: return True
    return False

def right_click():
    if not right_mouse_down():return False
    if not right_mouse_up():return False
    return True

def middle_mouse_down():
    mouse_structure = INPUT()
    mouse_structure.type = INPUT_MOUSE;
    mouse_structure.mi.dwFlags = MOUSEEVENTF_MIDDLEDOWN
    mouse_structure.mi.mouseData = 0
    mouse_structure.mi.dwExtraInfo = 0
    mouse_structure.mi.time = 0
    if SendInput(1, byref(mouse_structure), sizeof(INPUT)) != 0: return True
    return False

def middle_mouse_up():
    mouse_structure = INPUT()
    mouse_structure.type = INPUT_MOUSE;
    mouse_structure.mi.dwFlags = MOUSEEVENTF_MIDDLEUP
    mouse_structure.mi.mouseData = 0
    mouse_structure.mi.dwExtraInfo = 0
    mouse_structure.mi.time = 0
    if SendInput(1, byref(mouse_structure), sizeof(INPUT)) != 0: return True
    return False

def middle_click():
    if not right_mouse_down():return False
    if not right_mouse_up():return False
    return True

def wheel(rotations):
    mouse_structure = INPUT()
    mouse_structure.type = INPUT_MOUSE;
    mouse_structure.mi.dwFlags = MOUSEEVENTF_WHEEL
    mouse_structure.mi.mouseData = rotations * 120
    mouse_structure.mi.dwExtraInfo = 0
    mouse_structure.mi.time = 0
    if SendInput(1, byref(mouse_structure), sizeof(INPUT)) != 0: return True
    return False

def get_mouse_pos():
    cursor_point = LPPOINT()
    GetCursorPos(byref(cursor_point))
    return {'x': cursor_point.x, 'y': cursor_point.y}

def get_display_size():
    left = GetSystemMetrics(SM_XVIRTUALSCREEN)
    top = GetSystemMetrics(SM_YVIRTUALSCREEN)
    right = left + GetSystemMetrics(SM_CXVIRTUALSCREEN)
    bottom = top + GetSystemMetrics(SM_CYVIRTUALSCREEN)
    return({'left': left, 'top': top, 'right': right, 'bottom': bottom, 'size_x': GetSystemMetrics(SM_CXVIRTUALSCREEN), 'size_y': GetSystemMetrics(SM_CYVIRTUALSCREEN)})

def get_window_title(hwnd):
    leng = GetWindowTextLengthW(hwnd)
    caption = ctypes.create_unicode_buffer(leng +1)
    GetWindowTextW(hwnd, caption, leng + 1)
    return caption.value

def get_window_class_name(hwnd):
    leng = 2048
    class_name = ctypes.create_unicode_buffer(leng +1)
    GetClassName(hwnd, class_name, leng + 1)
    return class_name.value

def find_windows_by_title(title):
    hwnds = []
    def _enum_windows(hwnd, lParam):
        window_title = get_window_title(hwnd)
        if window_title == title: hwnds.append(hwnd)
        return True
    WNDENUMPROC = WINFUNCTYPE(c_bool, POINTER(c_int), POINTER(c_int))
    EnumWindows(WNDENUMPROC(_enum_windows), 0)
    return hwnds

def find_windows_by_class(class_name):
    hwnds = []
    def _enum_windows(hwnd, lParam):
        window_class_name = get_window_class_name(hwnd)
        pattern = re.compile(r'' + class_name)
        if not pattern.search(window_class_name) is None: hwnds.append(hwnd)
        return True
    WNDENUMPROC = WINFUNCTYPE(c_bool, POINTER(c_int), POINTER(c_int))
    EnumWindows(WNDENUMPROC(_enum_windows), 0)
    return hwnds

def set_active_window(hwnd, altkey = False):
    if altkey: __send_key_code(VK_MENU)
    return SetForegroundWindow(hwnd)

def set_active_window2(hwnd):
    return BringWindowToTop(hwnd)

def get_active_window():
    hwnd = GetForegroundWindow()
    return hwnd

def set_show_window(hwnd, mode):
    return ShowWindow(hwnd, mode)

def set_window_pos(hwnd, hwnd_insert_after, x, y, cx, cy, u_flags):
    return SetWindowPos(hwnd, hwnd_insert_after, x, y, cx, cy, u_flags)

def send_message(hwnd, vk, wParam = 0, lParam = 0):
    return SendMessageW(hwnd, vk, wParam, lParam)

def post_message(hwnd, vk, wParam = 0, lParam = 0):
    return PostMessageW(hwnd, vk, wParam, lParam)

def set_focus(hwnd):
    return SetFocus(hwnd)

def get_last_error():
    return GetLastError()

def get_window_rect(hwnd):
    window_rect = RECT()
    GetWindowRect(hwnd, ctypes.pointer(window_rect))
    return {'left': window_rect.left, 'top': window_rect.top, 'right': window_rect.right, 'bottom': window_rect.bottom}

if __name__ == '__main__':
    print('Please import and use it.')
    exit()

