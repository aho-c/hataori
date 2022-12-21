/*
hataori extension
(c) Fukasawa Takashi
MIT License
*/

let axon = {};
axon.browser = chrome || browser;

//////////////////
axon.alarm = {};
axon.alarm.id = null;

axon.alarm.on = () =>{
    axon.message.send({ret: 'exists', err: null});
    return true;
};

axon.alarm.start = () =>{
    axon.alarm.on();
    axon.alarm.id = setInterval(axon.alarm.on, 2 * 1000);
};

//////////////////
axon.message = {};

axon.message.__send = (message) => {
    if(! message === true){
        throw new Error('Said the extension: Failed to send message to Background script.');
    }
};

axon.message.send = (message) => {
    axon.browser.runtime.sendMessage(message, null, axon.message.__send);
};

axon.message.__recv = (message, sender, callback) => {
    callback(true);
    try{
        if(message.gp === 'exists'){
            ;
        }else if((message.gp === 'popup') && (message.fc === 'start')){
            axon.exec(message.p.v1, message.p.v2, message.p.v3).then(result => {
                axon.send(result);
            });
        }else if((message.gp === 'popup') && (message.fc === 'stop')){
            axon.exec(message.p.v1, message.p.v2, message.p.v3).then(result => {
                axon.send(result);
            });
        }else if((message.gp === 'dom') && (message.fc === 'exec')){
            axon.exec(message.p.v1, message.p.v2, message.p.v3).then(result => {
                axon.send(result);
            });
        }else if((message.gp === 'dom') && (message.fc === 'action')){
            axon.__path_to_elem(message.p.v1).then(elem => {
                axon.action(elem, message.p.v2).then(result => {
                    axon.send(result);
                });
            });
        }else if((message.gp === 'dom') && (message.fc === 'get_element')){
            axon.__path_to_elem(message.p.v1).then(elem => {
                axon.get_element(elem, message.p.v2, message.p.v3).then(result => {
                    axon.send(result);
                });
            });
        }else if((message.gp === 'dom') && (message.fc === 'get_data')){
            axon.__path_to_elem(message.p.v1).then(elem => {
                axon.get_data(elem, message.p.v2, message.p.v3).then(result => {
                    axon.send(result);
                });
            });
        }else if((message.gp === 'dom') && (message.fc === 'set_value')){
            axon.__path_to_elem(message.p.v1).then(elem => {
                axon.set_value(elem, message.p.v2, message.p.v3, message.p.v4).then(result => {
                    axon.send(result);
                });
            });
        }else if((message.gp === 'dom') && (message.fc === 'get_document')){
            axon.__path_to_elem(message.p.v1).then(elem => {
                axon.get_document(elem, message.p.v2).then(result => {
                    axon.send(result);
                });
            });
        }else if((message.gp === 'dom') && (message.fc === 'get_recode')){
            axon.leading.get_recode().then(result => {
                let arr = [];
                if('recode' in result){
                    for(let pos = 0; pos < result.recode.length; pos++){
                        arr.push(JSON.parse(result.recode[pos]));
                    }
                }
                axon.send(arr);
            });
        }else if((message.gp === 'dom') && (message.fc === 'clear_recode')){
            axon.leading.clear_recode().then(result => {
                axon.send(result);
            });
        }else if((message.gp === 'dom') && (message.fc === 'start_recode')){
            axon.leading.start_recode().then(result => {
                axon.send(result);
            });
        }else if((message.gp === 'dom') && (message.fc === 'stop_recode')){
            axon.leading.stop_recode().then(result => {
                axon.send(result);
            });
        }else{
            axon.message.send(
                {
                    ret: null,
                    err: 'Said the extension: The instruction does not exist.\n  group: ' + message.gp + '\n  function: ' + message.fc
                }
            );
        }
    }catch(error){
        axon.message.send({ret: null, err: 'Message recv error.'});
    }
    return true;
};

//////////////////
axon.leading = {};
axon.leading.exec = false;
axon.leading.recode = [];

axon.leading.__add_events = (eve) => {
    new Promise(resolve => {
        axon.browser.storage.local.get(['recode'], (data) => {resolve(data)});
    }).then((arr) => {
        if(! ('recode' in arr)){
            arr = [];
        }else if(Object.prototype.toString.call(arr.recode[0]) === '[object Object]'){
            arr = [];
        }else{
            arr = arr.recode;
        }
        let obj = axon.get_send_data(eve.target).then(result => {
            if(! arr.includes(JSON.stringify(result))){
                arr.push(JSON.stringify(result));
                axon.browser.storage.local.set({recode: arr}, function(){;});
            }
        });
    });
    return true;
};

axon.leading.get_recode = async () => {
    return new Promise(resolve => {
        axon.browser.storage.local.get(['recode'], (data) => {resolve(data)});
    });
};

axon.leading.clear_recode = async () => {
    axon.browser.storage.local.clear(function(){;})
    return true;
};

axon.leading.__add_event = async (content_doc = document) => {
    let elems = content_doc.querySelectorAll('*');
    for(let pos = 0; pos < elems.length; pos++){
        elems[pos].addEventListener('mousedown', axon.leading.__add_events, false);
    }
    let frame_elems = content_doc.querySelectorAll('frame, iframe');
    for(let frame_pos = 0; frame_pos < frame_elems.length; frame_pos++){
        let doc = frame_elems[frame_pos].contentDocument;
        if(doc !== null){
            await axon.leading.__add_event(doc);
        }
    }
    return true;
};

axon.leading.__remove_event = async (content_doc = document) => {
    let elems = content_doc.querySelectorAll('*');
    for(let pos = 0; pos < elems.length; pos++){
        elems[pos].removeEventListener('mousedown', axon.leading.__add_events, false);
    }
    let frame_elems = content_doc.querySelectorAll('frame, iframe');
    for(let frame_pos = 0; frame_pos < frame_elems.length; frame_pos++){
        let doc = frame_elems[frame_pos].contentDocument;
        if(doc !== null){
            await axon.leading.__remove_event(doc);
        }
    }
    return true;
};

axon.leading.start_recode = async () => {
    if(! axon.leading.exec){
        axon.browser.storage.local.set({recode_exec: true}, function(){;});
        axon.leading.exec = true;
        await axon.leading.__add_event();
        return true;
    }else{
        axon.browser.storage.local.set({recode_exec: true}, function(){;});
        axon.leading.exec = true;
        return false;
    }
};

axon.leading.stop_recode = async () => {
    if(axon.leading.exec){
        axon.browser.storage.local.set({recode_exec: false}, function(){;});
        axon.leading.exec = false;
        await axon.leading.__remove_event();
        return true;
    }else{
        axon.browser.storage.local.set({recode_exec: false}, function(){;});
        axon.leading.exec = false;
        return false;
    }
};

//////////////////
axon.exec = async (mode, x = 0, y = 0) =>{
    let ret = true;
    try{
        if(mode === 'printout'){ window.print(); }
        else if(mode === 'back'){ history.back(); }
        else if(mode === 'forward'){ history.forward(); }
        else if(mode === 'scroll'){ window.scrollTo(x, y); }
        else if(mode === 'scroll_by'){ window.scrollBy(x, y); }
        else{ ret = false; }
    }catch(error){
        ret = false;;
    }
    return ret;
};

axon.action = async (elem, mode, x = 0, y = 0) =>{
    let ret = true;
    try{
        if(mode === 'click'){ elem.dispatchEvent(new MouseEvent('click')); }
        else if(mode === 'dbl_click'){ elem.dispatchEvent(new MouseEvent('dblclick')); }
        else if(mode === 'r_click'){ elem.dispatchEvent(new MouseEvent('contextmenu')); }
        else if(mode === 'mouse_down'){ elem.dispatchEvent(new MouseEvent('mousedown')); }
        else if(mode === 'mouse_up'){ elem.dispatchEvent(new MouseEvent('mouseup')); }
        else if(mode === 'focus'){ elem.focus(); }
        else if(mode === 'active'){ elem.focus({preventScroll: false}); }
        else if(mode === 'blur'){ elem.blur(); }
        else if(mode === 'scroll'){ elem.scrollTo(x, y); }
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

axon.get_element = async (elem, mode, options = '') =>{
    let nodes = null;
    try{
        if(mode === 'root'){ nodes = document; }
        if(mode === 'current_root'){ nodes = elem.getRootNode(); }
        if(mode === 'inner_contents'){ nodes = elem.contentDocument.documentElement; }
        if(mode === 'parent'){ nodes = elem.parentNode; }
        if(mode === 'children'){ nodes = elem.children; }
        if(mode === 'prev_element'){ nodes = elem.previousElementSibling; }
        if(mode === 'next_element'){ nodes = elem.nextElementSibling; }
        if(mode === 'path'){ nodes = await axon.__path_to_elem(options, elem); }
        if(mode === 'bros'){ nodes = await axon.__get_brothers(elem); }
        if(mode === 'css_selector'){ nodes = elem.querySelectorAll(options); }
    }catch(error){
        ;
    }
    return nodes;
};

axon.get_data = async (elem, mode, property_name = '') =>{
    let nodes = null;
    try{
        if(mode === 'get_css'){ nodes = window.getComputedStyle(elem, null).getPropertyValue(property_name); }
        if(mode === 'get_tagname'){ nodes = elem.tagName; }
        if(mode === 'get_html'){ nodes = elem.innerHTML; }
        if(mode === 'get_text'){ nodes = elem.innerText; }
        if(mode === 'get_outer_text'){ nodes = elem.outerText; }
        if(mode === 'get_outer_html'){ nodes = elem.outerHTML; }
        if(mode === 'get_class_list'){ nodes = elem.classList; }
        if(mode === 'has_focus'){ nodes = elem.hasFocus(); }
        if(mode === 'get_selected'){ nodes = elem.selected; }
        if(mode === 'get_checked'){ nodes = elem.checked; }
        if(mode === 'get_value'){ nodes = elem.value; }
        if(mode === 'get_attr'){ nodes = elem.getAttribute(property_name); }
    }catch(error){
        ;
    }
    return nodes;
};

axon.get_document = async (elem, mode) =>{
    let nodes = null;
    try{
        if(mode === 'get_title'){ nodes = document.title; }
        if(mode === 'get_current_title'){ nodes = elem.getRootNode().title; }
        if(mode === 'get_url'){ nodes = document.URL; }
        if(mode === 'get_current_url'){ nodes = elem.getRootNode().URL; }
        if(mode === 'get_status'){ nodes = document.readyState; }
        if(mode === 'get_current_status'){ nodes = elem.getRootNode().readyState; }
    }catch(error){
        nodes = null;
    }
    return nodes;
};

axon.set_value = async (elem, mode, value, value2 = '') =>{
    let ret = true;
    try{
        if(mode === 'set_attr'){ elem.element.setAttribute(value, value2); }
        else if(mode === 'set_selected'){ elem.selected = value; }
        else if(mode === 'set_checked'){ elem.checked = value; }
        else if(mode === 'set_value'){ elem.value = value; }
        else if(mode === 'set_input'){
            elem.value = value;
            elem.dispatchEvent(
                new Event('input',
                    {
                        bubbles: true,
                        cancelable: true,
                    }
                )
            );
        }
        //else if(mode === 'set_text'){ elem.innerText = value; }
        //else if(mode === 'set_html'){ elem.innerHTML = value; }
        //else if(mode === 'set_outer_text'){ elem.outerText = value; }
        //else if(mode === 'set_outer_html'){ elem.outerHTML = value; }
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

axon.__path_to_elem = async (path_string, top_element = document) => {
    let target = null;
    if(path_string === null){ return document; }
    try{
        if(path_string === ''){
            path = '';
        }else{
            path = path_string;
        }

        let nodes = path.split(/\//);
        target = top_element;

        if(target === null){ target = document; }

        for(let count = 0; count < nodes.length; count++){
            if(nodes[count] === ''){
                target = document;
            }else if(nodes[count].slice(0, 7) === '::doc()'){
                let elem = target.contentDocument;
                if(typeof elem === 'undefined'){ return null; }
                target = elem;
            }else if(nodes[count].slice(0, 6) === '::css('){
                let elem = null;
                let reg = nodes[count].match(/\[([0-9]{1,})\]/);
                let reg_string = '';
                if(reg !== null){
                    reg_string = reg[0];
                }
                let command = nodes[count].substr(0, nodes[count].length - reg_string.length);

                if(command.substr(command.length - 1, 1) === ')'){
                    let css_string = command.substr(6, command.length - 7);
                    elem = target.querySelectorAll(css_string);
                }

                if(elem === null){ return null; }

                if(reg !== null){
                    elem = elem[reg[1] - 0];
                }

                target = elem;
            }else if(nodes[count].slice(0, 2) === '..'){
                let elem = target.parentNode;
                if(typeof elem === 'undefined'){ return null; }
                target = elem;
            }else if((nodes[count].slice(0, 2) !== '::') && (nodes[count].slice(0, 2) !== '..')){
                let nodeTag = nodes[count].match(/^(.+?)\[(.+?)\]/);

                if(nodeTag === null){
                    nodeTag = ['', '', '']
                    nodeTag[0] = nodes[count];
                    nodeTag[1] = nodes[count];
                    nodeTag[2] = '0';
                }

                let children = target.children;
                let position = -1;
                let exists = false;
                for(let child = 0; child < target.children.length; child++){
                    let tagName = target.children[child].nodeName.toLowerCase();
                    if(tagName === nodeTag[1]){
                        position++;
                        if(Number(nodeTag[2]) === position){
                            let elem = target.children[child];
                            target = elem;
                            exists = true;
                            break;
                        }
                    }
                }
                if(! exists){ return null; }
            }else{ return null; }
        }
    }catch(error){
        target = null;
    }
    return target;
};

axon.__elem_to_path = async (element, top_element = document) => {
    let path = '';
    try{
        let docs_all = await axon.__get_documents_all();
        let node = element;
        let nodeName = node.nodeName.toLowerCase()

        do{
            if(top_element === node){ node = null; }
            if(node !== null){
                nodeName = node.nodeName.toLowerCase();
                if(nodeName === '#document'){
                    if(path !== ''){
                        path = '/' + path;
                    }
                    for(var docCount = 0; docCount < docs_all.length; docCount++){
                        if(node === docs_all[docCount].document){
                            node = docs_all[docCount].element;
                            break;
                        }
                    }
                    if(node !== null){ path = '::doc()' + path; }
                }else{
                    let counter = await axon.__get_brothers_count(node);
                    if(counter === null){ return null; }
                    if(path === ''){
                        path = nodeName + '[' + counter + ']'
                    }else{
                        path = nodeName + '[' + counter + ']/' + path;
                    }
                    node = node.parentNode;
                }
            }
        }while(node != null);

        if(path === ''){ path = '/'; }
    }catch(error){
        path = null;
    }
    return path;
}

axon.__get_brothers = async (elem) => {
    let element = elem;
    do{
        firstBrothers = elem;
        elem = elem.previousElementSibling;
    }while(elem !== null);

    if(firstBrothers === null){
        firstBrothers = element;
    }

    let brother = firstBrothers;
    let brothers = [];

    do{
        brothers.push(brother);
        brother = brother.nextElementSibling;
    }while(brother !== null);

    return brothers;
};

axon.__get_brothers_count = async (element) => {
    let counter = -1;
    try{
        let elem = element;
        let firstBrothers = null;
        let resultCounter = -1;

        do{
            firstBrothers = elem;
            elem = elem.previousElementSibling;
        }while(elem !== null);

        if(firstBrothers === null){
            firstBrothers = element;
        }

        let brothers = firstBrothers;

        do{
            if(brothers.nodeName === element.nodeName){
                counter++;
            }
            if(brothers === element){
                resultCounter = counter;
                break;
            }
            brothers = brothers.nextElementSibling;
        }while(brothers !== null);
    }catch(error){
        counter = -1;
    }
    return counter;
};

axon.__get_documents_all = async (doc = document) => {
    let docArray = [];
    try{
        let frames = doc.querySelectorAll('frame, iframe');
        let resDoc = null;
        let frame = null;

        if(doc === document){
            docArray.push({document: document, element: null});
        }

        for(var leng = 0; leng < frames.length; leng++){
            var contDoc = frames[leng].contentDocument;
            if(typeof contDoc !== 'undefined'){
                docArray.push({document: contDoc, element: frames[leng]});
                document_all = await axon.__get_documents_all(contDoc);
                Array.prototype.push.apply(docArray, document_all);
            }
        }
    }catch(error){
        docArray = [];
    }
    return docArray;
};

axon.get_send_data = async (data) => {
    let send_data = null;
    try{
        let tostr = Object.prototype.toString;

        if(tostr.call(data) === '[object NamedNodeMap]'){
            send_data = await axon.__get_attr_object(data);
        }else if(tostr.call(data) === '[object Object]'){
            send_data = {};
            for(let key in data){
                send_data[key] = await axon.get_send_data(data[key]);
            }
        }else if(tostr.call(data) === '[object Null]'){
            send_data = data;
        }else if(tostr.call(data) === '[object String]'){
            send_data = data;
        }else if(typeof data.length === 'undefined'){
            if(tostr.call(data).indexOf('Element') > -1){
                send_data = await axon.__get_html_element_object(data);
            }else if(tostr.call(data).indexOf('Document') > -1){
                send_data = await axon.__get_html_document_object(data);
            }else if(tostr.call(data) === '[object Boolean]'){
                send_data = data;
            }else if(tostr.call(data) === '[object Number]'){
                send_data = data;
            }else{
                send_data = null;
            }
        }else{
            send_data = [];
            for(let leng = 0; leng < data.length; leng++){
                send_data[leng] = await axon.get_send_data(data[leng]);
            }
        }
    }catch(error){
        send_data = null;
    }
    return send_data
};

axon.send = async (data, err = null) => {
    try{
        let send_data = await axon.get_send_data(data);
        axon.message.send({ret: send_data, err: err});
    }catch(error){
        axon.message.send({ret: null, err: 'Content Script Message error.' + error.stack});
    }
    return true;
};

axon.__get_html_element_object = async (html_element) => {
    try{
        return {
            path: await axon.__elem_to_path(html_element),
            tagname: html_element.tagName.toLowerCase(),
            selected: html_element.selected,
            checked: html_element.checked,
            value: html_element.value,
            attrs: await axon.__get_attr_object(html_element.attributes),
        };
    }catch(error){
        return null;
    }
};

axon.__get_attr_object = async (attr_dict) => {
    let attrs = {};
    try{
        if(attr_dict === null){
            attrs = {};
        }else{
            for(var attrCount = 0; attrCount < attr_dict.length; attrCount++){
                let name = attr_dict[attrCount].name;
                attrs[name] = attr_dict[attrCount].value;
            }
        }
    }catch(error){
        attrs = {};
    }
    return attrs;
};

axon.__get_html_document_object = async (html_document) => {
    try{
        return {
            path: await axon.__elem_to_path(html_document),
            tagname: null,
            selected: null,
            checked: null,
            value: null,
            attrs: null,
        };
    }catch(error){
        return null;
    }
};

axon.alarm.start();
axon.browser.runtime.onMessage.addListener(axon.message.__recv);
window.addEventListener('load', (eve) => {
    axon.browser.storage.local.get(['recode_exec'], (data) => {
        if('recode_exec' in data){
            if(data.recode_exec){
                document.querySelector('html').style.visibility = 'hidden';
                axon.leading.start_recode().then(result => {
                    axon.send(result);
                    document.querySelector('html').style.visibility = 'visible';
                });
            }
        }
    });
});
