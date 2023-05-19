"""
hataori file_io
License: MIT License (http://www.opensource.org/licenses/mit-license.php)
 (c) 2023 Fukasawa Takashi

Note: File read/write and change detection.

 Library used:
  The following libraries are used. Thanks.
   Watchdog
    License: Apache License 2.0 (https://www.apache.org/licenses/LICENSE-2.0)
     https://github.com/gorakhargosh/watchdog
"""

import os
import sys
import time
import json

__timeout_sec = 60 * 3
__watch_file_name = None
__watch_dir_path = None

def set_timeout_sec(sec):
    global __timeout_sec
    __timeout_sec = sec

def set_file_name(file_name):
    global __watch_file_name
    __watch_file_name = file_name

def set_dir_path(dir_path):
    global __watch_dir_path
    __watch_dir_path = dir_path
    

def write_file(file_path, write_data):
    data = None
    if type(write_data) is dict:
        data = json.dumps(write_data).encode('utf-16le')
    elif type(write_data) is list:
        data = json.dumps(write_data).encode('utf-16le')
    elif type(write_data) is str:
        data = write_data.encode('utf-16le')
    elif type(write_data) is int:
        data = str(write_data).encode('utf-16le')
    elif type(write_data) is float:
        data = str(write_data).encode('utf-16le')
    elif type(write_data) is bool:
        data = str(write_data).encode('utf-16le')
    elif write_data is None:
        data = None
    else:
        data = write_data

    if not data is None:
        with open(file_path, 'wb') as fhnd:
            fhnd.write(data)
            fhnd.flush()
            os.fsync(fhnd.fileno())
    else:
        with open(file_path, 'w') as fhnd:
            fhnd.write('')
            fhnd.flush()
            os.fsync(fhnd.fileno())

    return True

def read_file(file_path, raw_mode = False, file_delete = False):
    data = None

    if not os.path.isfile(file_path): return data

    with open(file_path, 'r+b') as fhnd:
        read_data = fhnd.read()

    if not raw_mode:
        data = json.loads(read_data.decode('utf-16'))
    else:
        data = read_data

    if file_delete: os.remove(file_path)

    return data

def get_data():
    global __watch_file_name
    global __watch_dir_path

    if __watch_dir_path is None: raise RuntimeError('Directory path is None.')
    if __watch_file_name is None: raise RuntimeError('File name is None.')

    return read_file(__watch_dir_path + '/' + __watch_file_name, False, True)

def set_data(write_data):
    global __watch_file_name
    global __watch_dir_path

    if __watch_dir_path is None: raise RuntimeError('Directory path is None.')
    if __watch_file_name is None: raise RuntimeError('File name is None.')

    return write_file(__watch_dir_path + '/' + __watch_file_name, write_data)

def start():
    global __watch_file_name
    global __watch_dir_path
    global __timeout_sec

    if __watch_dir_path is None: raise RuntimeError('Watch directory path is None.')
    if __watch_file_name is None: raise RuntimeError('Watch file is None.')

    file_path = __watch_dir_path + '/' + __watch_file_name

    ret = False
    now = time.time()
    while True:
        time.sleep(0.05)
        if os.path.isfile(file_path):
            time.sleep(0.05)
            ret = True
            break
        if time.time() - now > __timeout_sec:
            #print('--timeout', file=sys.stderr)
            break 

    return ret
