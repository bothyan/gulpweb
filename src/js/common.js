"use strict";

var curHost = "http://" + window.location.host + '/';
var startevent = 'touchstart' in document.documentElement ? "touchstart" : "mousedown";
var endevent = 'touchend' in document.documentElement ? "touchend" : "mouseup";

// 获取URL中的参数
var GLOBLE_PARAMS = (function() {
	var args = {};
	var query = location.search.substring(1);
	var pairs = query.split("&"); // Break at ampersand
	for (var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('=');
		if (pos == -1) continue;
		var argname = pairs[i].substring(0, pos);
		var value = pairs[i].substring(pos + 1);
		value = decodeURIComponent(value);
		args[argname] = value;
	}
	return args;
})();

//判断是否是正确手机号
function _checkMobile(s) {
	var regu = /^1[3|4|5|6|7|8]\d{9}$/;
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	} else {
		return false;
	}
}

//判断是否是微信环境
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/_SQ_/i) == '_sq_'){
        return true;
    }else{         
    	return false;
    }
}