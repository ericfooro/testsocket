(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.tiws || (g.tiws = {})).extended = f()}})(function(){var define,module,exports;return (function e(t,n,r){function o(i,u){if(!n[i]){if(!t[i]){var a=typeof require=="function"&&require;if(!u&&a)return a.length===2?a(i,!0):a(i);if(s&&s.length===2)return s(i,!0);if(s)return s(i);var f=new Error("Cannot find module '"+i+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[i]={exports:{}};t[i][0].call(l.exports,function(e){var n=t[i][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[i].exports}var i=Array.prototype.slice;Function.prototype.bind||Object.defineProperty(Function.prototype,"bind",{enumerable:!1,configurable:!0,writable:!0,value:function(e){function r(){return t.apply(this instanceof r&&e?this:e,n.concat(i.call(arguments)))}if(typeof this!="function")throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var t=this,n=i.call(arguments,1);return r.prototype=Object.create(t.prototype),r.prototype.contructor=r,r}});var s=typeof require=="function"&&require;for(var u=0;u<r.length;u++)o(r[u]);return o})({1:[function(require,module,exports){
(function (setTimeout){
//Require imyello tiws module and init object
var io = require('net.iamyellow.tiws');
var websocket = io.createWS();
//Set module default settings, and indicators
var _connectionStatus = false;
var _lastReceivedMessage = 0;
var _isReconnecting = false;
var _argu = null;
var _enableReconnecting = false;
var _checkMessagingStatusInterval = 10;
//Module Constructor
var socketHandler = function(args) {
		//set params
		argu = args;
		//create object refrence
		var that = this;
		//Setup the timer checker timer, and add object refrence to the timer object ot be able to access the socketHandler from inside the EventListener
		setTimeout(function() {
			that.timer.start({
				interval: 3000,
				debug: true
			});
		}, 5000);
		//Set object refrences to be accessable inside events handlers
		this.timer.object = this;
		this.registerTimer(this);
		websocket.object = this;
		//Listen for disconnection
		Ti.App.addEventListener('disconnected', function(event) {
			if (_enableReconnecting) {
				Ti.App.fireEvent("reconnecting", {
					object: websocket
				});
				//Attemp reconnection on 2 steps seperated with 3 seconds, to give time to null the object and create the one
				if (!_isReconnecting) {
					//null the object and create new one
					websocket = null;
					websocket = io.createWS();
					_isReconnecting = true;
				} else {
					//attemp opening the connection and fire the open event
					websocket.open(argu["URL"]);
					websocket.addEventListener('open', function(ev) {
						_isReconnecting = false;
						Ti.App.fireEvent("connected", {
							object: this.object
						});
					});
					websocket.addEventListener('message', function(ev) {
						// ev.data contains message data
						Ti.App.fireEvent("socketMessage", {
							event: ev
						});
					});
					//Listen for closing
					websocket.addEventListener('close', function(ev) {
						Ti.App.fireEvent("disconnected", {
							object: this.object
						});
						socketHandler.connected = false;
					});
					//Listen for Errors
					websocket.addEventListener('error', function(ev) {
						// ev.error contains error description, if any
						Ti.App.fireEvent("disconnected", {
							object: this.object
						});
					});
				}
			}
		});
		//Listen for connection
		Ti.App.addEventListener("connected", function(event) {
			_connectionStatus = true;
		});
	};
//Require timely module
socketHandler.prototype.timer = require("ti.mely").createTimer();
//Checks the messaging status every few seconds
socketHandler.prototype.checkMessagingStatus = function(event) {
	currentTime = Math.round((new Date()).getTime() / 1000);
	if ((currentTime - _lastReceivedMessage) >= _checkMessagingStatusInterval || _connectionStatus == false) {
		this.object.fireDisconnected(null);
	}
};
//Fires action on timer interval change
socketHandler.prototype.registerTimer = function() {
	this.timer.addEventListener('onIntervalChange', this.checkMessagingStatus, false);
};
//do the initial connection
socketHandler.prototype.connect = function() {
	websocket.open(argu["URL"]);
	Ti.App.fireEvent("opening", {
		time: new((Date()).getTime() / 1000)
	});
	websocket.addEventListener('open', function(ev) {
		_isReconnecting = false;
		Ti.App.fireEvent("connected", {
			object: this.object
		});
	});
	websocket.addEventListener('message', function(ev) {
		// ev.data contains message data
		_lastReceivedMessage = Math.round((new Date()).getTime() / 1000);
		Ti.App.fireEvent("socketMessage", {
			event: ev
		});
	});
	websocket.addEventListener('close', function(ev) {
		Ti.App.fireEvent("disconnected", {
			object: this.object
		});
		socketHandler.connected = false;
	});
	websocket.addEventListener('error', function(ev) {
		// ev.error contains error description, if any
		Ti.App.fireEvent("disconnected", {
			object: this.object
		});
	});
};
//Fires disconnected event
socketHandler.prototype.fireDisconnected = function() {
	Ti.App.fireEvent("disconnected", {
		time: (new Date()).getTime() / 1000, object: this
	});
_connectionStatus = false;
};
//Sends message
socketHandler.prototype.sendMessage = function(message) {
	if (_connectionStatus) {
		websocket.send(message);
	} else {
		Ti.API.debug("No connection asln");
	}
};
socketHandler.prototype.close = function() {
	websocket.close();
};
socketHandler.prototype.setEnableReconnecting = function(value) {
	_enableReconnecting = value;
};
socketHandler.prototype.attemptReconnecting = function() {
	_enableReconnecting = true;
	Ti.App.fireEvent("disconnected", {
		time: (new Date()).getTime() / 1000, object: this
	});
};
socketHandler.prototype.setCheckMessagingStatusInterval = function(value) {
	_checkMessagingStatusInterval = value;
};
socketHandler.prototype.websocket = websocket;
module.exports = socketHandler;
}).call(this,require("--timers--").setTimeout)
},{"--timers--":3,"net.iamyellow.tiws":undefined,"ti.mely":undefined}],2:[function(require,module,exports){

module.exports = (function () { return this; })();

module.exports.location = {};

},{}],3:[function(require,module,exports){
(function (global){

module.exports.clearInterval = clearInterval;
module.exports.clearTimeout = clearTimeout;
module.exports.setInterval = setInterval;
module.exports.setTimeout = setTimeout;

// See https://html.spec.whatwg.org/multipage/webappapis.html#dom-windowtimers-cleartimeout

function clearInterval(intervalId) {
  try {
    return global.clearInterval(intervalId);
  }
  catch (e) {
    // Do nothing
    return undefined;
  }
}

function clearTimeout(timeoutId) {
  try {
    return global.clearTimeout(timeoutId);
  }
  catch (e) {
    // Do nothing
    return undefined;
  }
}

function setInterval(func, delay) {
  var args = [];
  for (var i = 2, l = arguments.length; i < l; ++i) {
    args[ i - 2 ] = arguments[ i ];
  }

  return global.setInterval(function () {
    func.apply(this, args);
  }, +delay);
}

function setTimeout(func, delay) {
  var args = [];
  for (var i = 2, l = arguments.length; i < l; ++i) {
    args[ i - 2 ] = arguments[ i ];
  }

  return global.setTimeout(function () {
    func.apply(this, args);
  }, +delay);
}

}).call(this,require("--global--"))
},{"--global--":2}]},{},[1])(1)
});