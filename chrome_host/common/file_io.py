"""
 hataori host
 (c) Fukasawa Takashi
 MIT license
"""

import os
import sys
import time
import json
from watchdog.events import PatternMatchingEventHandler
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

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

    if not os.path.isfile(file_path):
        return data

    with open(file_path, 'r+b') as fhnd:
        read_data = fhnd.read()

    if not raw_mode:
        read_data = read_data.decode('utf-16')
        data = json.loads(read_data)
    else:
        data = read_data

    if file_delete:
        os.remove(file_path)

    return data

def get_data():
    global __watch_file_name
    global __watch_dir_path

    if __watch_dir_path is None:
        raise RuntimeError('Directory path is None.')

    if __watch_file_name is None:
        raise RuntimeError('File name is None.')

    return read_file(__watch_dir_path + '/' + __watch_file_name, False, True)

def set_data(write_data):
    global __watch_file_name
    global __watch_dir_path

    if __watch_dir_path is None:
        raise RuntimeError('Directory path is None.')

    if __watch_file_name is None:
        raise RuntimeError('File name is None.')

    return write_file(__watch_dir_path + '/' + __watch_file_name, write_data)

def start():
    global __watch_file_name
    global __watch_dir_path
    global __timeout_sec

    if __watch_dir_path is None:
        raise RuntimeError('Watch directory path is None.')

    if __watch_file_name is None:
        raise RuntimeError('Watch file is None.')

    current_directory = __watch_dir_path
    observer = Observer()
    event_handler = __changeHandler(observer)
    event_handler.set_watch_filename(__watch_file_name)
    observer.schedule(event_handler, current_directory, recursive=True)
    observer.start()

    ret = True
    now = time.time()
    while observer.is_alive():
        if time.time() - now > __timeout_sec:
            print('--timeout', file=sys.stderr)
            ret = False
            break 
        time.sleep(0.05)

    observer.unschedule_all()
    observer.stop()
    observer.join()

    return ret

class __changeHandler(FileSystemEventHandler):
    __watch_file = None
    __observer = None

    def __init__(self, observer):
        self.__observer = observer

    def set_watch_filename(self, file_name):
        self.__watch_file = file_name

    #ファイルやフォルダが作成された場合
    def on_created(self, event):
        self.__read_file(event)

    #ファイルやフォルダが更新された場合
    def on_modified(self, event):
        self.__read_file(event)

    def __read_file(self, event):
        filepath = event.src_path
        filename = os.path.basename(filepath)
        if self.__watch_file == filename:
            self.__observer.unschedule_all()
            self.__observer.stop()

if __name__ == '__main__':
    print('Please import and use it.')
    exit()
