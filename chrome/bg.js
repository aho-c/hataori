/*
hataori extension
(c) Fukasawa Takashi
MIT License
*/

//////////////////
let axon = {};
axon.browser = chrome || browser;

//////////////////
axon.message = {};

axon.message.test_exists = false;
axon.extrun = true;

axon.message.__test_send = (response) => {
    axon.browser.alarms.clear('exists_tab');
    if((response === true) && (axon.message.test_exists)){
        axon.native_messaging.send({ret: true, err: ''});
    }else if(axon.message.test_exists){
        axon.native_messaging.send({ret: false, err: ''});
    }
    axon.message.test_exists = false;
    return true;
};

axon.message.test = () =>{
    axon.browser.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(tabs.length === 0){
            axon.native_messaging.send(
                {
                    ret: null,
                    err: 'Said the extension: I can\'t access the tab.'
                }
            );
            return true;
        }else{
            axon.message.test_exists = true;
            axon.browser.alarms.create('exists_tab', {delayInMinutes: 2});
            axon.browser.tabs.sendMessage(
                tabs[0].id,
                {name: 'exists'},
                null,
                axon.message.__test_send
            );
        }
    });
    return true;
};

axon.message.recv_test = (alarm) =>{
    if(alarm.name === 'exists_tab'){
        axon.message.test_exists = false;
        axon.browser.alarms.clear('exists_tab');
        axon.native_messaging.send({ret: false, err: ''});
    }
};

axon.browser.alarms.onAlarm.addListener(axon.message.recv_test);

axon.message.__send = (response) => {
    if(! response === true){
        axon.native_messaging.send({
            ret: null,
            err: 'Said the extension: Failed to send message to Content script.\nresponse: ' + response
        });
    }
    return true;
};

axon.message.send = (message) => {
    axon.browser.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(tabs.length === 0){
            axon.native_messaging.send(
                {
                    ret: null,
                    err: 'Said the extension: I can\'t access the tab.'
                }
            );
            return true;
        }else{
            axon.browser.tabs.sendMessage(
                tabs[0].id,
                message,
                null,
                axon.message.__send
            );
        }
    });
    return true;
};

axon.message.__recv = (response, sender, callback) => {
    if(response.ret === 'exists'){
        callback(true);
    }else if(response.ret === 'popup_mode'){
        callback(axon.native_messaging.run);
    }else if(response.ret === 'popup_change'){
        if(! axon.native_messaging.run){
            axon.native_messaging.run = true;
            axon.native_messaging.mes = {ret: 'wait', err: ''};
            if(! axon.native_messaging.active){
                axon.native_messaging.send({ret: 'wait', err: ''});
            }
        }else{
            axon.native_messaging.run = false;
            axon.native_messaging.mes = null;
        }
        callback(axon.native_messaging.run);
    }else{
        axon.native_messaging.send(response);
        callback(true);
    }
    return true;
};

//////////////////
axon.native_messaging = {};
axon.native_messaging.run = true;
axon.native_messaging.active = false;
axon.native_messaging.mes = null;
axon.native_messaging.port = null;

axon.native_messaging.close = () =>{
    try{
        axon.native_messaging.port.onMessage.removeListener(axon.native_messaging.recv);
        axon.native_messaging.port.disconnect();
    }catch(error){;}
    return true;
};

axon.native_messaging.start = () =>{
    try{
        axon.native_messaging.port.onMessage.removeListener(axon.native_messaging.recv);
        axon.native_messaging.port.disconnect();
    }catch(error){;}
    if(axon.native_messaging.run){
        axon.native_messaging.active = true;
        axon.native_messaging.port = axon.browser.runtime.connectNative('net.nokoko.hataori');
        axon.native_messaging.port.onMessage.addListener(axon.native_messaging.recv);
    }else{
        axon.native_messaging.active = false;
    }
    return true;
};

axon.native_messaging.send = (message) =>{
    axon.native_messaging.start();
    if(axon.native_messaging.run){
        if(! axon.native_messaging.mes === null){
            message = axon.native_messaging.mes;
        }
        axon.native_messaging.mes = null;
        try{
            JSON.stringify(message);
            axon.native_messaging.port.postMessage(message);
        }catch(error){
            axon.native_messaging.mes = message;
        }
    }else{
        axon.native_messaging.close();
        axon.native_messaging.active = false;
    }
    return true;
};

axon.native_messaging.recv = (message) =>{
    try{
        if(axon.native_messaging.run){
            message_dict = message //JSON.parse(message)
            if((message_dict.gp === 'system') && (message_dict.fc === 'nothing')){
                axon.native_messaging.send({ret: 'wait', err: ''});
            }else if((message_dict.gp === 'browser') && (message_dict.fc === 'get_tabs')){
                axon.get_tabs(message_dict.p.v1);
            }else if((message_dict.gp === 'browser') && (message_dict.fc === 'window_action')){
                axon.window_action(message_dict.p.v1);
            }else if((message_dict.gp === 'browser') && (message_dict.fc === 'select_tab')){
                axon.select_tab(message_dict.p.v1, message_dict.p.v2);
            }else if((message_dict.gp === 'browser') && (message_dict.fc === 'tab_action')){
                axon.tab_action(message_dict.p.v1, message_dict.p.v2);
            }else if((message_dict.gp === 'browser') && (message_dict.fc === 'get_capture')){
                axon.get_capture();
            }else if((message_dict.gp === 'browser') && (message_dict.fc === 'all_close')){
                axon.all_close();
            }else if((message_dict.gp === 'browser') && (message_dict.fc === 'meeko')){
                axon.meeko();
            }else if(message_dict.gp === 'dom'){
                axon.browser.tabs.query({active: true, currentWindow: true}, function(tabs){
                    if(tabs.length === 0){
                        axon.native_messaging.send(
                            {
                                ret: null,
                                err: 'Unable to request tabs.'
                            }
                        );
                    }else if((tabs[0].url.indexOf('chrome://') === 0) || (tabs[0].discarded)){
                        axon.native_messaging.send(
                            {
                                ret: null,
                                err: 'Unable to request tabs.' + tabs[0].url
                            }
                        );
                    }else{
                        axon.message.send(message_dict);
                    }
                });
            }else{
                axon.native_messaging.send(
                    {
                        ret: null,
                        err: 'Said the extension: The instruction does not exist. gp:' + message_dict.gp + ' fc:' + message_dict.fc + '  JSON:' + message
                    }
                );
            }
        }else{
            axon.native_messaging.send(
                {
                    ret: null,
                    err: 'Said the extension: Extension is disabled.'
                }
            );
        }
    }catch(error){
        axon.native_messaging.send(
            {
                ret: null,
                err: error.stack
            }
        );
    }
    return true;
};

//////////////////
axon.select_tab = (mode, tab_option) =>{
    let windowId = -1;
    axon.browser.tabs.query({}, function(tabs){
        try{
            if(tabs.length < 1){ throw new Error('There are no tabs.'); }

            for(let leng = 0; leng < tabs.length; leng++){
                let exists = true;
                if((mode === 'url') && (tabs[leng].url.indexOf(tab_option) !== 0)){ exists = false; }
                if((mode === 'id') && (tabs[leng].id !== tab_option)){ exists = false; }
                if((mode === 'title') && (tabs[leng].title.indexOf(tab_option) !== 0)){ exists = false; }
                if(exists){
                    tabId = tabs[leng].id;
                    windowId = tabs[leng].windowId;
                    break;
                }
            }

            if(windowId !== -1){
                axon.browser.windows.update(windowId, {}, function(window){
                    let window_status = window.WindowState;
                    if(window_status !== 'normal' && window_status !== 'maximized'){ window_status = 'maximized'; }
                    axon.browser.windows.update(windowId, {focused: true, state: window_status}, function(window){
                        axon.browser.tabs.update(tabId, {active: true});
                        axon.native_messaging.send({ret: true, err: null});
                    });
                });
            }else{
                axon.native_messaging.send(
                    {
                        ret: false,
                        err: 'Said the extension: The tab cannot be found.'
                    }
                );
            }
        }catch(error){
            axon.native_messaging.send(
                {
                    ret: false,
                    err: error.stack
                }
            );
        }
        return true;
    });
    return true;
};

axon.get_tabs = (mode) =>{
    let dict = {};
    if(mode === 'this'){ dict = {active: true, currentWindow: true}; }
    axon.browser.tabs.query(dict, function(tabs){
        try{
            if(tabs.length < 1){ throw new Error('There are no tabs.'); }

            let tabs_list = [];
            for(let leng = 0; leng < tabs.length; leng++){
                tabs_list.push(
                    {
                        active:     tabs[leng].active,
                        audible:    tabs[leng].audible,
                        discarded:  tabs[leng].discarded,
                        hidden:     tabs[leng].hidden,
                        title:      tabs[leng].title,
                        url:        tabs[leng].url,
                        id:         tabs[leng].id,
                        status:     tabs[leng].status
                    }
                );
            }
            axon.native_messaging.send(
                {
                    ret: tabs_list,
                    err: null
                }
            );
        }catch(error){
            axon.native_messaging.send(
                {
                    ret: null,
                    err: error.stack
                }
            );
        }
        return true;
    });
    return true;
};

axon.window_action = (mode) =>{
    axon.browser.tabs.query({active: true, currentWindow: true}, function(tabs){
        try{
            if(
                (mode === 'normal') ||
                (mode === 'minimized') ||
                (mode === 'maximized') ||
                (mode === 'fullscreen') ||
                (mode === 'locked-fullscreen')
            ){
                let windowId = tabs[0].windowId;
                axon.browser.windows.get(windowId, function(window){
                    try{
                        axon.browser.windows.update(windowId, {focused: true, state: mode});
                        axon.native_messaging.send(
                            {
                                ret: true,
                                err: null
                            }
                        );
                        return true;
                    }catch(error){
                        axon.native_messaging.send(
                            {
                                ret: false,
                                err: error.stack
                            }
                        );
                        return true;
                    }
                });
            }else{
                throw new Error('The status is invalid.');
            }
        }catch(error){
            axon.native_messaging.send(
                {
                    ret: false,
                    err: error.stack
                }
            );
        }
        return true;
    });
    return true;
};

axon.tab_action = (mode, url = 'https://www.google.com/') =>{
    axon.browser.tabs.query({active: true, currentWindow: true}, function(tabs){
        try{
            if(tabs.length < 1){ throw new Error('There are no tabs.'); }

            let tabId = tabs[0].id;
            if(mode === 'new'){ axon.browser.tabs.create({'url': url}); }
            if(mode === 'forward'){ axon.browser.tabs.goForward(); }
            if(mode === 'back'){ axon.browser.tabs.goBack(); }
            if(mode === 'reload'){ axon.browser.tabs.reload({bypassCache: false}); }
            if(mode === 'close'){ axon.browser.tabs.remove(tabs[0].id); }
            if(mode === 'jump'){ axon.browser.tabs.update(tabs[0].id, {url: url, active: true}); }
            axon.native_messaging.send(
                {
                    ret: true,
                    err: null
                }
            );
        }catch(error){
            axon.native_messaging.send(
                {
                    ret: false,
                    err: error.stack
                }
            );
        }
    });
    return true;
};

axon.get_capture = () =>{
    axon.browser.tabs.query({active: true, currentWindow: true}, function(tabs){
        try{
            if(tabs.length < 1){ throw new Error('There are no tabs.'); }

            if(/^http:|^https:|^file:/.test(tabs[0].url)){
                axon.browser.tabs.captureVisibleTab({format: 'png'}, function(dataUrl){
                    axon.native_messaging.send(
                        {
                            ret: dataUrl,
                            err: null
                        }
                    );
                });
            }else{
                throw new Error('The URL is invalid.');
            }
        }catch(error){
            axon.native_messaging.send(
                {
                    ret: null,
                    err: error.stack
                }
            );
        }
    });
}


axon.all_close = () =>{
    axon.browser.windows.getAll(function(windows){
        try{
            for(let leng = 0; leng < windows.length; leng++){
                axon.browser.windows.remove(windows[leng].id);
            }
        }catch(error){
            axon.native_messaging.send(
                {
                    ret: false,
                    err: error.stack
                }
            );
        }
        axon.native_messaging.send(
            {
                ret: true,
                err: null
            }
        );
        return true;
    });
    return true;
};

axon.meeko = () => {axon.native_messaging.send({ret: 'Mew !', err: null}); return true;};

//////////////////
if(axon.extrun === true){
    axon.browser.runtime.onMessage.addListener(axon.message.__recv);
    axon.native_messaging.send({ret: 'wait', err: ''});
}