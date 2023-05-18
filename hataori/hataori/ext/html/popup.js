let = axon = {};
axon.browser = chrome || browser;

window.addEventListener("load", function(eve){
	axon.get_popup_mode();
	document.querySelectorAll('#run_mode')[0].addEventListener("click", axon.button_click);
	document.oncontextmenu = function () {return false;}
});

axon.button_click = (eve) =>{
	let text = eve.target.innerText;
	axon.change_popup_mode();
};


axon.change_popup_mode = () =>{
	axon.browser.runtime.sendMessage({ret: 'popup_change', err: ''},
		function(response, sender, callback){
			axon.get_popup_mode();
		}
	);
}

axon.get_popup_mode = () =>{
	axon.browser.runtime.sendMessage({ret: 'popup_mode', err: ''},
		function(response, sender, callback){
			axon.mode_change(response);
		}
	);
};

axon.mode_change = (mode) => {
	if(mode){
		document.querySelectorAll('#run_mode')[0].style.backgroundColor = '#0088ff';
		document.querySelectorAll('#run_mode')[0].innerText = 'ON'
	}else{
		document.querySelectorAll('#run_mode')[0].style.backgroundColor = '#888888';
		document.querySelectorAll('#run_mode')[0].innerText = 'OFF'
	}
};
