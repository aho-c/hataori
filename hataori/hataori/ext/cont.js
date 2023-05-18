/*
hataori extension
License: MIT License (http://www.opensource.org/licenses/mit-license.php)
 (c) 2023 Fukasawa Takashi
*/

let axon = {};
axon.browser = chrome || browser;

axon.alarm = {};
axon.alarm.id = null;

axon.send = async (data, err = null) => {
    try{
        let send_data = await axon.get_send_data(data, 0);
        axon.message_send({ret: send_data, err: err});
    }catch(error){
        axon.message_send({ret: null, err: 'Content Script Message error.' + error.stack});
    }
    return true;
};

axon.message_send = async (message) => {
    axon.browser.runtime.sendMessage(message, null, axon.__message_send);
};

axon.__message_send = async (message) => {
    if(! message === true){
        throw new Error('Said the extension: Failed to send message to Background script.');
    }
};

axon.__message_recv = async (message, sender, callback) => {
    callback(true);
    try{
        if(message.gp === 'exists'){
            ;
        }else if((message.gp === 'dom') && (message.fc === 'page_action')){
            axon.__path_to_elem(message.p.v2).then(elem => {
                axon.verify_page_action(message.p.v1, elem).then(result => { axon.send(result).then(res => {
                    axon.page_action(message.p.v1, elem);
                }); });
            });
        }else if((message.gp === 'dom') && (message.fc === 'element_action')){
            axon.__path_to_elem(message.p.v2).then(elem => {
                axon.verify_element_action(message.p.v1, elem).then(result => { axon.send(result).then(res => {
                    axon.element_action(message.p.v1, elem);
                }); });
            });
        }else if((message.gp === 'dom') && (message.fc === 'scroll')){
            axon.__path_to_elem(message.p.v2).then(elem => {
                axon.verify_scroll(message.p.v1, elem, message.p.v3, message.p.v4).then(result => { axon.send(result).then(res => {
                    axon.scroll(message.p.v1, elem, message.p.v3, message.p.v4);
                }); });
            });
        }else if((message.gp === 'dom') && (message.fc === 'set_element_data')){
            axon.__path_to_elem(message.p.v2).then(elem => {
                axon.verify_set_element_data(message.p.v1, elem, message.p.v3).then(result => { axon.send(result).then(res => {
                    axon.set_element_data(message.p.v1, elem, message.p.v3);
                }); });
            });
        }else if((message.gp === 'dom') && (message.fc === 'get_elements_selector')){
            axon.__path_to_elem(message.p.v2).then(elem => {
                axon.get_elements_selector(message.p.v1, elem, message.p.v3).then(result => { axon.send(result); });
            });
        }else if((message.gp === 'dom') && (message.fc === 'get_element_data')){
            axon.__path_to_elem(message.p.v2).then(elem => {
                axon.get_element_data(message.p.v1, elem, message.p.v3).then(result => { axon.send(result); });
            });
        }else if((message.gp === 'dom') && (message.fc === 'get_element')){
            axon.__path_to_elem(message.p.v2).then(elem => {
                axon.get_element(message.p.v1, elem).then(result => { axon.send(result); });
            });
        }else if((message.gp === 'dom') && (message.fc === 'get_elements')){
            axon.__path_to_elem(message.p.v2).then(elem => {
                axon.get_elements(message.p.v1, elem).then(result => { axon.send(result); });
            });
        }else if((message.gp === 'dom') && (message.fc === 'get_document_data')){
            axon.__path_to_elem(message.p.v2).then(elem => {
                axon.get_document_data(message.p.v1, elem).then(result => { axon.send(result); });
            });
/*        }else if((message.gp === 'dom') && (message.fc === 'get_recode')){
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
            axon.leading.clear_recode().then(result => { axon.send(result); });
        }else if((message.gp === 'dom') && (message.fc === 'start_recode')){
            axon.leading.start_recode().then(result => { axon.send(result); });
        }else if((message.gp === 'dom') && (message.fc === 'stop_recode')){
            axon.leading.stop_recode().then(result => { axon.send(result); });*/
        }else{
            axon.message_send(
                {
                    ret: null,
                    err: 'Said the extension: The instruction does not exist.\n  group: ' + message.gp + '\n  function: ' + message.fc
                }
            );
        }
    }catch(error){
        axon.message_send({ret: null, err: 'Message recv error.'});
    }
    return true;
};

axon.alarm.on = () =>{
    axon.message_send({ret: 'exists', err: null});
    return true;
};

axon.alarm.start = () =>{
    axon.alarm.on();
    axon.alarm.id = setInterval(axon.alarm.on, 2 * 1000);
};

// Record
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
        let obj = axon.get_send_data(eve.target, 0).then(result => {
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

// Action
axon.verify_page_action = async (mode, elem) =>{
    let ret = true;
    if(elem === null){ return false; }
    try{
        let win = elem.getRootNode().defaultView;
        if(mode === 'printout'){ ret = true; }
        else if(mode === 'history-back'){ ret = true; }
        else if(mode === 'history-forward'){ ret = true; }
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

axon.page_action = async (mode, elem) =>{
    let ret = true;
    if(elem === null){ return false; }
    try{
        let win = elem.getRootNode().defaultView;
        if(mode === 'printout'){ win.print(); }
        else if(mode === 'history-back'){ win.history.back(); }
        else if(mode === 'history-forward'){ win.history.forward(); }
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

axon.verify_element_action = async (mode, elem) =>{
    let ret = true;
    if(elem === null){ return false; }
    try{
        if((mode === 'click') && (typeof elem.dispatchEvent !== 'undefined')){ ret = true; }
        else if((mode === 'dbl_click') && (typeof elem.dispatchEvent !== 'undefined')){ ret = true; }
        else if((mode === 'r_click') && (typeof elem.dispatchEvent !== 'undefined')){ ret = true; }
        else if((mode === 'mouse_down') && (typeof elem.dispatchEvent !== 'undefined')){ ret = true; }
        else if((mode === 'mouse_up') && (typeof elem.dispatchEvent !== 'undefined')){ ret = true; }
        else if((mode === 'focus') && (typeof elem.focus !== 'undefined')){ ret = true; }
        else if((mode === 'active') && (typeofelem.focus !== 'undefined')){ ret = true; }
        else if((mode === 'blur') && (typeof elem.blur !== 'undefined')){ ret = true; }
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

axon.element_action = async (mode, elem) =>{
    let ret = true;
    if(elem === null){ return false; }
    try{
        if(mode === 'click'){ elem.dispatchEvent(new MouseEvent('click')); }
        else if(mode === 'dbl_click'){ elem.dispatchEvent(new MouseEvent('dblclick')); }
        else if(mode === 'r_click'){ elem.dispatchEvent(new MouseEvent('contextmenu')); }
        else if(mode === 'mouse_down'){ elem.dispatchEvent(new MouseEvent('mousedown')); }
        else if(mode === 'mouse_up'){ elem.dispatchEvent(new MouseEvent('mouseup')); }
        else if(mode === 'focus'){ elem.focus(); }
        else if(mode === 'active'){ elem.focus({preventScroll: false}); }
        else if(mode === 'blur'){ elem.blur(); }
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

axon.verify_scroll = async (mode, elem, x = 0, y = 0) =>{
    let ret = true;
    if(elem === null){ return false; }
    try{
        if((mode === 'scroll_to') && (typeof elem.getRootNode().defaultView.scrollTo !== 'undefined')){ ret = true; }
        else if((mode === 'scroll_by') && (typeof elem.getRootNode().defaultView.scrollBy !== 'undefined')){ ret = true; }
        else if((mode === 'element_scroll_to') && (typeof elem.scrollTo !== 'undefined')){ ret = true; }
        else if((mode === 'element_scroll_by') && (typeof elem.scrollBy !== 'undefined')){ ret = true; }
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

axon.scroll = async (mode, elem, x = 0, y = 0) =>{
    let ret = true;
    if(elem === null){ return false; }
    try{
        if(mode === 'scroll_to'){ elem.getRootNode().defaultView.scrollTo(x, y); }
        else if(mode === 'scroll_by'){ elem.getRootNode().defaultView.scrollBy(x, y); }
        else if(mode === 'element_scroll_to'){ elem.scrollTo(x, y); }
        else if(mode === 'element_scroll_by'){ elem.scrollBy(x, y); }
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

// Setter
axon.verify_set_element_data = async (mode, elem, value) =>{
    let ret = true;
    if(elem === null){ return false; }
    try{
        if((mode === 'set_selected') && (typeof elem.selected !== 'undefined')){ ret = true; }
        else if((mode === 'set_checked') && (typeof elem.checked !== 'undefined')){ ret = true; }
        else if((mode === 'submit') && (typeof elem.submit !== 'undefined')){ ret = true; }
        else if((mode === 'set_value') && (typeof elem.value !== 'undefined')){ ret = true; }
        else if((mode === 'set_input') && (typeof elem.value !== 'undefined') && (typeof elem.dispatchEvent !== 'undefined')){ ret = true; }
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

axon.set_element_data = async (mode, elem, value) =>{
    let ret = true;
    if(elem === null){ return false; }
    try{
        if(mode === 'set_selected'){ elem.selected = value; }
        else if(mode === 'set_checked'){ elem.checked = value; }
        else if(mode === 'submit'){ elem.submit(); }
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
        else{ ret = false; }
    }catch(error){
        ret = false;
    }
    return ret;
};

// Getter
axon.get_element = async (mode, elem) =>{
    let nodes = null;
    if(elem === null){ return null; }
    try{
        if(mode === 'root'){ nodes = document; }
        if(mode === 'current_root'){ nodes = elem.getRootNode(); }
        if(mode === 'inner_contents'){ nodes = elem.contentDocument; }
        if(mode === 'parent_node'){ nodes = elem.parentNode; }
        if(mode === 'parent_element'){ nodes = elem.parentElement; }
        if(mode === 'prev_element'){ nodes = elem.previousElementSibling; }
        if(mode === 'next_element'){ nodes = elem.nextElementSibling; }
        if(mode === 'head'){ nodes = elem.getRootNode().head; }
        if(mode === 'last_child'){ nodes = elem.lastElementChild; }
        if(mode === 'first_child'){ nodes = elem.firstElementChild; }
        if(mode === 'active_element'){ nodes = elem.activeElement; }
        if(mode === 'path_to_element'){ nodes = elem; }
    }catch(error){
        nodes = null;
    }
    return nodes;
};

axon.get_elements_selector = async (mode, elem, css_string = '') =>{
    let nodes = null;
    if(elem === null){ return null; }
    try{
        if(mode === 'css_selector'){ nodes = elem.querySelectorAll(css_string); }
    }catch(error){
        nodes = null;
    }
    return nodes;
};

axon.get_elements = async (mode, elem) =>{
    let nodes = null;
    if(elem === null){ return null; }
    try{
        if(mode === 'children'){ nodes = elem.children; }
        if(mode === 'bros'){ nodes = await axon.__get_brothers(elem); }
        if(mode === 'body'){ nodes = elem.getRootNode().body; }
        if(mode === 'forms'){ nodes = elem.getRootNode().forms; }
    }catch(error){
        nodes = null;
    }
    return nodes;
};

axon.get_element_data = async (mode, elem, property_name = '') =>{
    let ret = null;
    if(elem === null){ return null; }
    try{
        if(mode === 'get_css'){ ret = elem.getRootNode().defaultView.getComputedStyle(elem, null).getPropertyValue(property_name); }
        if(mode === 'get_html'){ ret = elem.innerHTML; }
        if(mode === 'get_text'){ ret = elem.innerText; }
        if(mode === 'get_outer_text'){ ret = elem.outerText; }
        if(mode === 'get_outer_html'){ ret = elem.outerHTML; }
        if(mode === 'get_class_list'){ ret = elem.classList; }
        if(mode === 'get_selected'){ ret = elem.selected; }
        if(mode === 'get_checked'){ ret = elem.checked; }
        if(mode === 'get_value'){ ret = elem.value; }
        if(mode === 'get_attr'){ ret = elem.getAttribute(property_name); }
    }catch(error){
        ;
    }
    return ret;
};

axon.get_document_data = async (mode, elem) =>{
    let ret = null;
    if(elem === null){ return null; }
    try{
        if(mode === 'get_title'){ ret = elem.getRootNode().title; }
        if(mode === 'get_url'){ ret = elem.getRootNode().URL; }
        if(mode === 'get_status'){ ret = elem.readyState; }
    }catch(error){
        ret = null;
    }
    return ret;
};

// Private
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

                let children_elem = [];
                for(let pos = 0; pos < elem.length; pos++){
                    let exists_children = false;
                    let parent_elem = elem[pos];
                    while(true){
                        if(parent_elem === null){
                            break;
                        }
                        if(parent_elem === target){
                            exists_children = true;
                            break;
                        }
                        parent_elem = parent_elem.parentElement;
                    }
                    if(exists_children){
                        children_elem.push(parent_elem);
                    }
                }

                if(reg !== null){
                    target = children_elem[reg[1] - 0];
                }else{
                    target = children_elem;
                }
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

axon.get_send_data = async (data, deep_level) => {
    let send_data = null;
    try{
        let tostr = Object.prototype.toString;

        if((typeof data.length === 'undefined') && 
            ((tostr.call(data).indexOf('Element') > -1) || (tostr.call(data).indexOf('[object HTML') === 0) || (tostr.call(data).indexOf('[object HTML') === 0) || (tostr.call(data).indexOf('Document') > -1))
        ){
            let path = null;
            let name = null;
            let id = null;
            let tag_name = null;
            let type = null;
            if(tostr.call(data).indexOf('Document') > -1){
                path = await axon.__get_html_element_object(data);
                id = null;
                tag_name = null;
                type = 'element';
            }else{
                path = await axon.__get_html_document_object(data);
                name = data.getAttribute('name');
                id = data.getAttribute('id');
                tag_name =  data.tagName;
                type = 'document';
            }
            if(deep_level === 0){
                send_data = {path: path, name: name, id: id, tag_name:tag_name, type: type};
            }else{
                send_data = path;
            }
        }else if((tostr.call(data) === '[object NodeList]') || (tostr.call(data) === '[object HTMLCollection]')){
            send_data = [];
            for(let leng = 0; leng < data.length; leng++){
                send_data[leng] = {
                    path: await axon.__get_html_element_object(data[leng]),
                    name: data[leng].getAttribute('name'),
                    id: data[leng].getAttribute('id'),
                    tag_name: data[leng].tagName,
                    type: 'element_list'
                };
            }
        }else if(tostr.call(data) === '[object Object]'){
            send_data = {};
            for(let key in data){
                send_data[key] = await axon.get_send_data(data[key], deep_level++);
            }
        }else if(tostr.call(data) === '[object DOMTokenList]'){
            send_data = [];
            for(let leng = 0; leng < data.length; leng++){
                send_data[leng] = data[leng];
            }
        }else if(tostr.call(data) === '[object NamedNodeMap]'){
            send_data = await axon.__get_attr_object(data);
        }else if(
            (tostr.call(data) === '[object Boolean]') || (tostr.call(data) === '[object Number]') || (tostr.call(data) === '[object Null]') || (tostr.call(data) === '[object String]')
        ){
            send_data = data;
        }
    }catch(error){
        send_data = null;
    }
    return send_data
};

axon.__get_html_element_object = async (html_element) => {
    try{
        return await axon.__elem_to_path(html_element);
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
        return await axon.__elem_to_path(html_document);
    }catch(error){
        return null;
    }
};

axon.alarm.start();
axon.browser.runtime.onMessage.addListener(axon.__message_recv);
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
