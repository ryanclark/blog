require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":3}],3:[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":4}],4:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],5:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],6:[function(require,module,exports){
var Dispatcher = require('../dispatchers/app');

var messagesActions = {
	changeOpenChat: function (newUserID) {
		Dispatcher.handleViewAction({
			type: 'updateOpenChatID',
			userID: newUserID
		});
	},
	sendMessage: function (userID, message) {
		Dispatcher.handleViewAction({
			type: 'sendMessage',
			userID: userID,
			message: message,
			timestamp: +new Date()
		});
	}
};

module.exports = messagesActions;
},{"../dispatchers/app":9}],7:[function(require,module,exports){
var Header = require('./partials/header');
var UserList = require('./partials/userList');
var MessageBox = require('./partials/messageBox');

var Page = React.createClass({displayName: "Page",
	render: function () {
		return (
			React.createElement("div", {className: "app"}, 
				React.createElement(Header, null), 

				React.createElement(UserList, null), 
				React.createElement(MessageBox, null)
			)
		);
	}
});

React.render(React.createElement(Page, null), document.body);
},{"./partials/header":10,"./partials/messageBox":11,"./partials/userList":12}],8:[function(require,module,exports){
var MessagesActions = require('../actions/messages');
var MessagesStore = require('../stores/messages');

var ReplyBox = React.createClass({displayName: "ReplyBox",
	getInitialState: function () {
		return {
			value: ''
		};
	},
	handleKeyDown: function(e) {
		if (e.keyCode === 13) {
			MessagesActions.sendMessage(MessagesStore.getOpenChatUserID(), this.state.value);

			this.setState({
				value: ''
			});
		}
	},
	updateValue: function (e) {
		this.setState({
			value: e.target.value
		});
	},
	render: function () {
		return (
			React.createElement("div", {className: "reply-box"}, 
				React.createElement("input", {value:  this.state.value, onKeyDown:  this.handleKeyDown, onChange:  this.updateValue, className: "reply-box__input", placeholder: "Type message to reply.."}), 
				React.createElement("span", {className: "reply-box__tip"}, 
					"Press ", React.createElement("span", {className: "reply-box__tip__button"}, "Enter"), " to send"
				)
			)
		);
	}
});

module.exports = ReplyBox;
},{"../actions/messages":6,"../stores/messages":13}],9:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

var assign = require('object-assign');

var appDispatcher = assign(new Dispatcher(), {
	handleServerAction: function (action) {
		this.dispatch({
			source: 'server',
			action: action
		})
	},
	handleViewAction: function (action) {
		this.dispatch({
			source: 'view',
			action: action
		});
	}
});

module.exports = appDispatcher;
},{"flux":2,"object-assign":5}],10:[function(require,module,exports){
var Header = React.createClass({displayName: "Header",
	render: function () {
		return (
			React.createElement("header", {className: "header"}

			)
		)
	}
});

module.exports = Header;
},{}],11:[function(require,module,exports){
var ReplyBox = require('../components/replyBox');

var MessagesStore = require('../stores/messages');
var UserStore = require('../stores/user');

var Utils = require('../utils');

function getStateFromStore() {
	return MessagesStore.getChatByUserID(MessagesStore.getOpenChatUserID())
}

var MessageBox = React.createClass({displayName: "MessageBox",
	getInitialState: function () {
		return getStateFromStore();
	},
	componentWillMount: function () {
		MessagesStore.addChangeListener(this.onStoreChange);
	},
	componentWillUnmount: function () {
		MessagesStore.removeChangeListener(this.onStoreChange);
	},
	onStoreChange: function () {
		this.setState(getStateFromStore());
	},
	render: function () {
		var messagesLength = this.state.messages.length;
		var currentUserID = UserStore.user.id;

		var messages = this.state.messages.map(function (message, index) {
			var messageClasses = React.addons.classSet({
				'message-box__item': true,
				'message-box__item--from-current': message.from === currentUserID,
				'clear': true
			});

			return (
				React.createElement("li", {key:  message.timestamp + '-' + message.from, className: messageClasses }, 
					React.createElement("div", {className: "message-box__item__contents"}, 
						 message.contents
					)
				)
			);
		});

		var lastMessage = this.state.messages[messagesLength -1];

		if (lastMessage.from === currentUserID) {
			if (this.state.lastAccess.recipient >= lastMessage.timestamp) {
				var date = Utils.getShortDate(lastMessage.timestamp);
				messages.push(
					React.createElement("li", {key: "read", className: "message-box__item message-box__item--read"}, 
						React.createElement("div", {className: "message-box__item__contents"}, 
							"Read ", date 
						)
					)
				);
			}
		}

		return (
			React.createElement("div", {className: "message-box"}, 
				React.createElement("ul", {className: "message-box__list"}, 
					messages 
				), 
				React.createElement(ReplyBox, null)
			)
		);
	}
});

module.exports = MessageBox;
},{"../components/replyBox":8,"../stores/messages":13,"../stores/user":14,"../utils":15}],12:[function(require,module,exports){
var utils = require('../utils');

var MessagesStore = require('../stores/messages');
var UserStore = require('../stores/user');

var MessagesActions = require('../actions/messages');

function getStateFromStore() {
	var allMessages = MessagesStore.getAllChats();

	var messageList = [];
	for (var id in allMessages) {
		var item = allMessages[id];

		var messagesLength = item.messages.length;
		messageList.push({
			lastMessage: item.messages[messagesLength -1],
			lastAccess: item.lastAccess,
			user: item.user
		})
	}

	return {
		openChatID: MessagesStore.getOpenChatUserID(),
		messageList: messageList
	};
}

var UserList = React.createClass({displayName: "UserList",
	getInitialState: function () {
		return getStateFromStore();
	},
	componentWillMount: function () {
		MessagesStore.addChangeListener(this.onStoreChange);
	},
	componentWillUnmount: function () {
		MessagesStore.removeChangeListener(this.onStoreChange);
	},
	onStoreChange: function () {
		this.setState(getStateFromStore());
	},
	changeOpenChat: function (id) {
		MessagesActions.changeOpenChat(id);
	},
	render: function () {
		this.state.messageList.sort(function (a, b) {
			if (a.lastMessage.timestamp > b.lastMessage.timestamp) {
				return -1;
			}
			if (a.lastMessage.timestamp < b.lastMessage.timestamp) {
				return 1;
			}
			return 0;
		});

		var messages = this.state.messageList.map(function (message, index) {
			var date = utils.getNiceDate(message.lastMessage.timestamp);

			var statusIcon;
			if (message.lastMessage.from !== message.user.id) {
				statusIcon = (
					React.createElement("i", {className: "fa fa-reply user-list__item__icon"})
				);
			}
			if (message.lastAccess.currentUser < message.lastMessage.timestamp) {
				statusIcon = (
					React.createElement("i", {className: "fa fa-circle user-list__item__icon"})
				);
			}

			var isNewMessage = false;
			if (message.lastAccess.currentUser< message.lastMessage.timestamp) {
				isNewMessage = message.lastMessage.from !== UserStore.user.id;
			}

			var itemClasses = React.addons.classSet({
				'user-list__item': true,
				'clear': true,
				'user-list__item--new': isNewMessage,
				'user-list__item--active': this.state.openChatID === message.user.id
			});

			return (
				React.createElement("li", {onClick:  this.changeOpenChat.bind(this, message.user.id), className: itemClasses, key:  message.user.id}, 
					React.createElement("div", {className: "user-list__item__picture"}, 
						React.createElement("img", {src:  message.user.profilePicture})
					), 
					React.createElement("div", {className: "user-list__item__details"}, 
						React.createElement("h4", {className: "user-list__item__name"}, 
							 message.user.name, 

							React.createElement("abbr", {className: "user-list__item__timestamp"}, 
								date 
							)
						), 
						React.createElement("span", {className: "user-list__item__message"}, 
							statusIcon, " ",  message.lastMessage.contents
						)
					)
				)
			)
		}, this);

		return (
			React.createElement("div", {className: "user-list"}, 
				React.createElement("ul", {className: "user-list__list"}, 
					messages 
				)
			)
		);
	}
});

module.exports = UserList;
},{"../actions/messages":6,"../stores/messages":13,"../stores/user":14,"../utils":15}],13:[function(require,module,exports){
var UserStore = require('../stores/user');

var Dispatcher = require('../dispatchers/app');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var messages = {
	2: {
		user: {
			profilePicture: 'https://avatars0.githubusercontent.com/u/7922109?v=3&s=460',
			id: 2,
			name: 'Ryan Clark',
			status: 'online'
		},
		lastAccess: {
			recipient: 1424469794050,
			currentUser: 1424469794080
		},
		messages: [
			{
				contents: 'Hey!',
				from: 2,
				timestamp: 1424469793023
			},
			{
				contents: 'Hey, what\'s up?',
				from: 1,
				timestamp: 1424469794000
			}
		]
	},
	3: {
		user: {
			read: true,
			profilePicture: 'https://avatars3.githubusercontent.com/u/2955483?v=3&s=460',
			name: 'Jilles Soeters',
			id: 3,
			status: 'online'
		},
		lastAccess: {
			recipient: 1424352522000,
			currentUser: 1424352522080
		},
		messages: [
			{
				contents: 'Want a game of ping pong?',
				from: 3,
				timestamp: 1424352522000
			}
		]
	},
	4: {
		user: {
			name: 'Todd Motto',
			id: 4,
			profilePicture: 'https://avatars1.githubusercontent.com/u/1655968?v=3&s=460',
			status: 'online'
		},
		lastAccess: {
			recipient: 1424423579000,
			currentUser: 1424423574000
		},
		messages: [
			{
				contents: 'Please follow me on twitter I\'ll pay you',
				timestamp: 1424423579000,
				from: 4
			}
		]
	}
};

var openChatID = parseInt(Object.keys(messages)[0], 10);

var messagesStore = assign({}, EventEmitter.prototype, {
	addChangeListener: function (callback) {
		this.on('change', callback);
	},
	removeChangeListener: function (callback) {
		this.off('change', callback);
	},
	getOpenChatUserID: function () {
		return openChatID;
	},
	getChatByUserID: function (id) {
		return messages[id];
	},
	getAllChats: function () {
		return messages;
	}
});

messagesStore.dispatchToken = Dispatcher.register(function (payload) {
	var actions = {
		updateOpenChatID: function (payload) {
			openChatID = payload.action.userID;

			messagesStore.emit('change');
		},
		sendMessage: function (payload) {
			var userID = payload.action.userID;

			messages[userID].messages.push({
				contents: payload.action.message,
				timestamp: payload.action.timestamp,
				from: UserStore.user.id
			});

			messagesStore.emit('change');
		}
	};

	actions[payload.action.type] && actions[payload.action.type](payload);
});

module.exports = messagesStore;
},{"../dispatchers/app":9,"../stores/user":14,"events":1,"object-assign":5}],14:[function(require,module,exports){
var userStore = {
	user: {
		id: 1,
		name: 'John Doe',
		profilePicture: 'https://avatars1.githubusercontent.com/u/8901351?v=3&s=200'
	}
};

module.exports = userStore;
},{}],15:[function(require,module,exports){
var utils = {
	getShortDate: function (timestamp) {
		var distance = Math.round( ( +new Date() - timestamp ) / 60000 );
		var date = new Date(timestamp);

		var hour = ('0' + date.getHours()).slice(-2);
		var minutes = ('0' + date.getMinutes()).slice(-2);

		if (distance > 2879) {
			if (distance > 14567) {
				return this.getNiceDate(timestamp);
			} else {
				return 'Yesterday at ' + hour + ':' + minutes;
			}
		} else {
			return 'at ' + hour + ':' + minutes;
		}
	},
	getNiceDate: function (timestamp) {
		var defaultString = '%d %f%y at %h:%i';

		var language = {
			0: 'less than a minute ago',
			1: '1 minute ago',
			59: '%distance minutes ago',
			118: 'an hour ago',
			1439: '%r hours ago',
			2879: 'Yesterday at %h:%i',
			14567: '%l at %h:%i',
		};
		var days = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

		var date = new Date(timestamp);
		var distance = Math.round( ( +new Date() - timestamp ) / 60000 );

		var string;
		for (var i in language) {
			if (distance < i) {
				string = language[i];

				break;
			}
		}

		var hour = ('0' + date.getHours()).slice(-2);
		var minutes = ('0' + date.getMinutes()).slice(-2);
		var day = days[date.getDay()];
		var month = months[date.getMonth()];

		var year = date.getFullYear();
		if (new Date().getFullYear() === year) {
			year = '';
		}

		if (string) {
			var hoursAgo = Math.round(distance / 60);

			return string.replace(/%distance/i, distance)
				.replace(/%r/i, hoursAgo)
				.replace(/%h/i, hour)
				.replace(/%i/i, minutes)
				.replace(/%l/i, day);
		}

		return defaultString.replace(/%d/i, day)
			.replace(/%f/i, month)
			.replace(/%y/i, year)
			.replace(/%h/i, hour)
			.replace(/%i/i, minutes);
	}
};

module.exports = utils;
},{}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvUnlhbi9wcm9qZWN0cy9mbHV4L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwiL1VzZXJzL1J5YW4vcHJvamVjdHMvZmx1eC9ub2RlX21vZHVsZXMvZmx1eC9pbmRleC5qcyIsIi9Vc2Vycy9SeWFuL3Byb2plY3RzL2ZsdXgvbm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCIvVXNlcnMvUnlhbi9wcm9qZWN0cy9mbHV4L25vZGVfbW9kdWxlcy9mbHV4L2xpYi9pbnZhcmlhbnQuanMiLCIvVXNlcnMvUnlhbi9wcm9qZWN0cy9mbHV4L25vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwiL1VzZXJzL1J5YW4vcHJvamVjdHMvZmx1eC9wdWJsaWMvc3JjL2pzL2FjdGlvbnMvbWVzc2FnZXMuanMiLCIvVXNlcnMvUnlhbi9wcm9qZWN0cy9mbHV4L3B1YmxpYy9zcmMvanMvYXBwLmpzeCIsIi9Vc2Vycy9SeWFuL3Byb2plY3RzL2ZsdXgvcHVibGljL3NyYy9qcy9jb21wb25lbnRzL3JlcGx5Qm94LmpzeCIsIi9Vc2Vycy9SeWFuL3Byb2plY3RzL2ZsdXgvcHVibGljL3NyYy9qcy9kaXNwYXRjaGVycy9hcHAuanMiLCIvVXNlcnMvUnlhbi9wcm9qZWN0cy9mbHV4L3B1YmxpYy9zcmMvanMvcGFydGlhbHMvaGVhZGVyLmpzeCIsIi9Vc2Vycy9SeWFuL3Byb2plY3RzL2ZsdXgvcHVibGljL3NyYy9qcy9wYXJ0aWFscy9tZXNzYWdlQm94LmpzeCIsIi9Vc2Vycy9SeWFuL3Byb2plY3RzL2ZsdXgvcHVibGljL3NyYy9qcy9wYXJ0aWFscy91c2VyTGlzdC5qc3giLCIvVXNlcnMvUnlhbi9wcm9qZWN0cy9mbHV4L3B1YmxpYy9zcmMvanMvc3RvcmVzL21lc3NhZ2VzLmpzIiwiL1VzZXJzL1J5YW4vcHJvamVjdHMvZmx1eC9wdWJsaWMvc3JjL2pzL3N0b3Jlcy91c2VyLmpzIiwiL1VzZXJzL1J5YW4vcHJvamVjdHMvZmx1eC9wdWJsaWMvc3JjL2pzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbm1vZHVsZS5leHBvcnRzLkRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL2xpYi9EaXNwYXRjaGVyJylcbiIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRGlzcGF0Y2hlclxuICogQHR5cGVjaGVja3NcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJy4vaW52YXJpYW50Jyk7XG5cbnZhciBfbGFzdElEID0gMTtcbnZhciBfcHJlZml4ID0gJ0lEXyc7XG5cbi8qKlxuICogRGlzcGF0Y2hlciBpcyB1c2VkIHRvIGJyb2FkY2FzdCBwYXlsb2FkcyB0byByZWdpc3RlcmVkIGNhbGxiYWNrcy4gVGhpcyBpc1xuICogZGlmZmVyZW50IGZyb20gZ2VuZXJpYyBwdWItc3ViIHN5c3RlbXMgaW4gdHdvIHdheXM6XG4gKlxuICogICAxKSBDYWxsYmFja3MgYXJlIG5vdCBzdWJzY3JpYmVkIHRvIHBhcnRpY3VsYXIgZXZlbnRzLiBFdmVyeSBwYXlsb2FkIGlzXG4gKiAgICAgIGRpc3BhdGNoZWQgdG8gZXZlcnkgcmVnaXN0ZXJlZCBjYWxsYmFjay5cbiAqICAgMikgQ2FsbGJhY2tzIGNhbiBiZSBkZWZlcnJlZCBpbiB3aG9sZSBvciBwYXJ0IHVudGlsIG90aGVyIGNhbGxiYWNrcyBoYXZlXG4gKiAgICAgIGJlZW4gZXhlY3V0ZWQuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIHRoaXMgaHlwb3RoZXRpY2FsIGZsaWdodCBkZXN0aW5hdGlvbiBmb3JtLCB3aGljaFxuICogc2VsZWN0cyBhIGRlZmF1bHQgY2l0eSB3aGVuIGEgY291bnRyeSBpcyBzZWxlY3RlZDpcbiAqXG4gKiAgIHZhciBmbGlnaHREaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNvdW50cnkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENvdW50cnlTdG9yZSA9IHtjb3VudHJ5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNpdHkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENpdHlTdG9yZSA9IHtjaXR5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHRoZSBiYXNlIGZsaWdodCBwcmljZSBvZiB0aGUgc2VsZWN0ZWQgY2l0eVxuICogICB2YXIgRmxpZ2h0UHJpY2VTdG9yZSA9IHtwcmljZTogbnVsbH1cbiAqXG4gKiBXaGVuIGEgdXNlciBjaGFuZ2VzIHRoZSBzZWxlY3RlZCBjaXR5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjaXR5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDaXR5OiAncGFyaXMnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBgQ2l0eVN0b3JlYDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjaXR5LXVwZGF0ZScpIHtcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gcGF5bG9hZC5zZWxlY3RlZENpdHk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBjb3VudHJ5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjb3VudHJ5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDb3VudHJ5OiAnYXVzdHJhbGlhJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYm90aCBzdG9yZXM6XG4gKlxuICogICAgQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICBDb3VudHJ5U3RvcmUuY291bnRyeSA9IHBheWxvYWQuc2VsZWN0ZWRDb3VudHJ5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIGBDb3VudHJ5U3RvcmVgIGlzIHJlZ2lzdGVyZWQsIHdlIHNhdmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoZSByZXR1cm5lZCB0b2tlbi4gVXNpbmcgdGhpcyB0b2tlbiB3aXRoIGB3YWl0Rm9yKClgLCB3ZSBjYW4gZ3VhcmFudGVlXG4gKiB0aGF0IGBDb3VudHJ5U3RvcmVgIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFjayB0aGF0IHVwZGF0ZXMgYENpdHlTdG9yZWBcbiAqIG5lZWRzIHRvIHF1ZXJ5IGl0cyBkYXRhLlxuICpcbiAqICAgQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIG1heSBub3QgYmUgdXBkYXRlZC5cbiAqICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgaXMgbm93IGd1YXJhbnRlZWQgdG8gYmUgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAvLyBTZWxlY3QgdGhlIGRlZmF1bHQgY2l0eSBmb3IgdGhlIG5ldyBjb3VudHJ5XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IGdldERlZmF1bHRDaXR5Rm9yQ291bnRyeShDb3VudHJ5U3RvcmUuY291bnRyeSk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgdXNhZ2Ugb2YgYHdhaXRGb3IoKWAgY2FuIGJlIGNoYWluZWQsIGZvciBleGFtcGxlOlxuICpcbiAqICAgRmxpZ2h0UHJpY2VTdG9yZS5kaXNwYXRjaFRva2VuID1cbiAqICAgICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb25UeXBlKSB7XG4gKiAgICAgICAgIGNhc2UgJ2NvdW50cnktdXBkYXRlJzpcbiAqICAgICAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NpdHlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBnZXRGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKlxuICogICAgICAgICBjYXNlICdjaXR5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgYGNvdW50cnktdXBkYXRlYCBwYXlsb2FkIHdpbGwgYmUgZ3VhcmFudGVlZCB0byBpbnZva2UgdGhlIHN0b3JlcydcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzIGluIG9yZGVyOiBgQ291bnRyeVN0b3JlYCwgYENpdHlTdG9yZWAsIHRoZW5cbiAqIGBGbGlnaHRQcmljZVN0b3JlYC5cbiAqL1xuXG4gIGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aXRoIGV2ZXJ5IGRpc3BhdGNoZWQgcGF5bG9hZC4gUmV0dXJuc1xuICAgKiBhIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgd2l0aCBgd2FpdEZvcigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgaWQgPSBfcHJlZml4ICsgX2xhc3RJRCsrO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNhbGxiYWNrIGJhc2VkIG9uIGl0cyB0b2tlbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS51bnJlZ2lzdGVyPWZ1bmN0aW9uKGlkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgJ0Rpc3BhdGNoZXIudW5yZWdpc3RlciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgIGlkXG4gICAgKTtcbiAgICBkZWxldGUgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIGNhbGxiYWNrcyBzcGVjaWZpZWQgdG8gYmUgaW52b2tlZCBiZWZvcmUgY29udGludWluZyBleGVjdXRpb25cbiAgICogb2YgdGhlIGN1cnJlbnQgY2FsbGJhY2suIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgYSBjYWxsYmFjayBpblxuICAgKiByZXNwb25zZSB0byBhIGRpc3BhdGNoZWQgcGF5bG9hZC5cbiAgICpcbiAgICogQHBhcmFtIHthcnJheTxzdHJpbmc+fSBpZHNcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLndhaXRGb3I9ZnVuY3Rpb24oaWRzKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJ1xuICAgICk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGlkcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBpZCA9IGlkc1tpaV07XG4gICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgIGludmFyaWFudChcbiAgICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0sXG4gICAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIHdoaWxlICcgK1xuICAgICAgICAgICd3YWl0aW5nIGZvciBgJXNgLicsXG4gICAgICAgICAgaWRcbiAgICAgICAgKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpbnZhcmlhbnQoXG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgICAgaWRcbiAgICAgICk7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgYSBwYXlsb2FkIHRvIGFsbCByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICAhdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoLmRpc3BhdGNoKC4uLik6IENhbm5vdCBkaXNwYXRjaCBpbiB0aGUgbWlkZGxlIG9mIGEgZGlzcGF0Y2guJ1xuICAgICk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nKHBheWxvYWQpO1xuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGlzIERpc3BhdGNoZXIgY3VycmVudGx5IGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuaXNEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsIHRoZSBjYWxsYmFjayBzdG9yZWQgd2l0aCB0aGUgZ2l2ZW4gaWQuIEFsc28gZG8gc29tZSBpbnRlcm5hbFxuICAgKiBib29ra2VlcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2s9ZnVuY3Rpb24oaWQpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSB0cnVlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSh0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdXAgYm9va2tlZXBpbmcgbmVlZGVkIHdoZW4gZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZz1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IGZhbHNlO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFyIGJvb2trZWVwaW5nIHVzZWQgZm9yIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgfTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChmYWxzZSkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gVG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT0gbnVsbCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciBrZXlzO1xuXHR2YXIgdG8gPSBUb09iamVjdCh0YXJnZXQpO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRrZXlzID0gT2JqZWN0LmtleXMoT2JqZWN0KGZyb20pKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXJzL2FwcCcpO1xuXG52YXIgbWVzc2FnZXNBY3Rpb25zID0ge1xuXHRjaGFuZ2VPcGVuQ2hhdDogZnVuY3Rpb24gKG5ld1VzZXJJRCkge1xuXHRcdERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG5cdFx0XHR0eXBlOiAndXBkYXRlT3BlbkNoYXRJRCcsXG5cdFx0XHR1c2VySUQ6IG5ld1VzZXJJRFxuXHRcdH0pO1xuXHR9LFxuXHRzZW5kTWVzc2FnZTogZnVuY3Rpb24gKHVzZXJJRCwgbWVzc2FnZSkge1xuXHRcdERpc3BhdGNoZXIuaGFuZGxlVmlld0FjdGlvbih7XG5cdFx0XHR0eXBlOiAnc2VuZE1lc3NhZ2UnLFxuXHRcdFx0dXNlcklEOiB1c2VySUQsXG5cdFx0XHRtZXNzYWdlOiBtZXNzYWdlLFxuXHRcdFx0dGltZXN0YW1wOiArbmV3IERhdGUoKVxuXHRcdH0pO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lc3NhZ2VzQWN0aW9uczsiLCJ2YXIgSGVhZGVyID0gcmVxdWlyZSgnLi9wYXJ0aWFscy9oZWFkZXInKTtcbnZhciBVc2VyTGlzdCA9IHJlcXVpcmUoJy4vcGFydGlhbHMvdXNlckxpc3QnKTtcbnZhciBNZXNzYWdlQm94ID0gcmVxdWlyZSgnLi9wYXJ0aWFscy9tZXNzYWdlQm94Jyk7XG5cbnZhciBQYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlBhZ2VcIixcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJhcHBcIn0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KEhlYWRlciwgbnVsbCksIFxuXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXNlckxpc3QsIG51bGwpLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChNZXNzYWdlQm94LCBudWxsKVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5SZWFjdC5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChQYWdlLCBudWxsKSwgZG9jdW1lbnQuYm9keSk7IiwidmFyIE1lc3NhZ2VzQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvbWVzc2FnZXMnKTtcbnZhciBNZXNzYWdlc1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL21lc3NhZ2VzJyk7XG5cbnZhciBSZXBseUJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJSZXBseUJveFwiLFxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dmFsdWU6ICcnXG5cdFx0fTtcblx0fSxcblx0aGFuZGxlS2V5RG93bjogZnVuY3Rpb24oZSkge1xuXHRcdGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG5cdFx0XHRNZXNzYWdlc0FjdGlvbnMuc2VuZE1lc3NhZ2UoTWVzc2FnZXNTdG9yZS5nZXRPcGVuQ2hhdFVzZXJJRCgpLCB0aGlzLnN0YXRlLnZhbHVlKTtcblxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHZhbHVlOiAnJ1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9LFxuXHR1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGUpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdHZhbHVlOiBlLnRhcmdldC52YWx1ZVxuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInJlcGx5LWJveFwifSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6ICB0aGlzLnN0YXRlLnZhbHVlLCBvbktleURvd246ICB0aGlzLmhhbmRsZUtleURvd24sIG9uQ2hhbmdlOiAgdGhpcy51cGRhdGVWYWx1ZSwgY2xhc3NOYW1lOiBcInJlcGx5LWJveF9faW5wdXRcIiwgcGxhY2Vob2xkZXI6IFwiVHlwZSBtZXNzYWdlIHRvIHJlcGx5Li5cIn0pLCBcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJyZXBseS1ib3hfX3RpcFwifSwgXG5cdFx0XHRcdFx0XCJQcmVzcyBcIiwgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJyZXBseS1ib3hfX3RpcF9fYnV0dG9uXCJ9LCBcIkVudGVyXCIpLCBcIiB0byBzZW5kXCJcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcGx5Qm94OyIsInZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbnZhciBhcHBEaXNwYXRjaGVyID0gYXNzaWduKG5ldyBEaXNwYXRjaGVyKCksIHtcblx0aGFuZGxlU2VydmVyQWN0aW9uOiBmdW5jdGlvbiAoYWN0aW9uKSB7XG5cdFx0dGhpcy5kaXNwYXRjaCh7XG5cdFx0XHRzb3VyY2U6ICdzZXJ2ZXInLFxuXHRcdFx0YWN0aW9uOiBhY3Rpb25cblx0XHR9KVxuXHR9LFxuXHRoYW5kbGVWaWV3QWN0aW9uOiBmdW5jdGlvbiAoYWN0aW9uKSB7XG5cdFx0dGhpcy5kaXNwYXRjaCh7XG5cdFx0XHRzb3VyY2U6ICd2aWV3Jyxcblx0XHRcdGFjdGlvbjogYWN0aW9uXG5cdFx0fSk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcERpc3BhdGNoZXI7IiwidmFyIEhlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJIZWFkZXJcIixcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoZWFkZXJcIiwge2NsYXNzTmFtZTogXCJoZWFkZXJcIn1cblxuXHRcdFx0KVxuXHRcdClcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyOyIsInZhciBSZXBseUJveCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvcmVwbHlCb3gnKTtcblxudmFyIE1lc3NhZ2VzU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvbWVzc2FnZXMnKTtcbnZhciBVc2VyU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvdXNlcicpO1xuXG52YXIgVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5mdW5jdGlvbiBnZXRTdGF0ZUZyb21TdG9yZSgpIHtcblx0cmV0dXJuIE1lc3NhZ2VzU3RvcmUuZ2V0Q2hhdEJ5VXNlcklEKE1lc3NhZ2VzU3RvcmUuZ2V0T3BlbkNoYXRVc2VySUQoKSlcbn1cblxudmFyIE1lc3NhZ2VCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTWVzc2FnZUJveFwiLFxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZ2V0U3RhdGVGcm9tU3RvcmUoKTtcblx0fSxcblx0Y29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG5cdFx0TWVzc2FnZXNTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uU3RvcmVDaGFuZ2UpO1xuXHR9LFxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuXHRcdE1lc3NhZ2VzU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5vblN0b3JlQ2hhbmdlKTtcblx0fSxcblx0b25TdG9yZUNoYW5nZTogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoZ2V0U3RhdGVGcm9tU3RvcmUoKSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBtZXNzYWdlc0xlbmd0aCA9IHRoaXMuc3RhdGUubWVzc2FnZXMubGVuZ3RoO1xuXHRcdHZhciBjdXJyZW50VXNlcklEID0gVXNlclN0b3JlLnVzZXIuaWQ7XG5cblx0XHR2YXIgbWVzc2FnZXMgPSB0aGlzLnN0YXRlLm1lc3NhZ2VzLm1hcChmdW5jdGlvbiAobWVzc2FnZSwgaW5kZXgpIHtcblx0XHRcdHZhciBtZXNzYWdlQ2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldCh7XG5cdFx0XHRcdCdtZXNzYWdlLWJveF9faXRlbSc6IHRydWUsXG5cdFx0XHRcdCdtZXNzYWdlLWJveF9faXRlbS0tZnJvbS1jdXJyZW50JzogbWVzc2FnZS5mcm9tID09PSBjdXJyZW50VXNlcklELFxuXHRcdFx0XHQnY2xlYXInOiB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6ICBtZXNzYWdlLnRpbWVzdGFtcCArICctJyArIG1lc3NhZ2UuZnJvbSwgY2xhc3NOYW1lOiBtZXNzYWdlQ2xhc3NlcyB9LCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibWVzc2FnZS1ib3hfX2l0ZW1fX2NvbnRlbnRzXCJ9LCBcblx0XHRcdFx0XHRcdCBtZXNzYWdlLmNvbnRlbnRzXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0pO1xuXG5cdFx0dmFyIGxhc3RNZXNzYWdlID0gdGhpcy5zdGF0ZS5tZXNzYWdlc1ttZXNzYWdlc0xlbmd0aCAtMV07XG5cblx0XHRpZiAobGFzdE1lc3NhZ2UuZnJvbSA9PT0gY3VycmVudFVzZXJJRCkge1xuXHRcdFx0aWYgKHRoaXMuc3RhdGUubGFzdEFjY2Vzcy5yZWNpcGllbnQgPj0gbGFzdE1lc3NhZ2UudGltZXN0YW1wKSB7XG5cdFx0XHRcdHZhciBkYXRlID0gVXRpbHMuZ2V0U2hvcnREYXRlKGxhc3RNZXNzYWdlLnRpbWVzdGFtcCk7XG5cdFx0XHRcdG1lc3NhZ2VzLnB1c2goXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IFwicmVhZFwiLCBjbGFzc05hbWU6IFwibWVzc2FnZS1ib3hfX2l0ZW0gbWVzc2FnZS1ib3hfX2l0ZW0tLXJlYWRcIn0sIFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1lc3NhZ2UtYm94X19pdGVtX19jb250ZW50c1wifSwgXG5cdFx0XHRcdFx0XHRcdFwiUmVhZCBcIiwgZGF0ZSBcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtZXNzYWdlLWJveFwifSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcIm1lc3NhZ2UtYm94X19saXN0XCJ9LCBcblx0XHRcdFx0XHRtZXNzYWdlcyBcblx0XHRcdFx0KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVwbHlCb3gsIG51bGwpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZUJveDsiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG52YXIgTWVzc2FnZXNTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9tZXNzYWdlcycpO1xudmFyIFVzZXJTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy91c2VyJyk7XG5cbnZhciBNZXNzYWdlc0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL21lc3NhZ2VzJyk7XG5cbmZ1bmN0aW9uIGdldFN0YXRlRnJvbVN0b3JlKCkge1xuXHR2YXIgYWxsTWVzc2FnZXMgPSBNZXNzYWdlc1N0b3JlLmdldEFsbENoYXRzKCk7XG5cblx0dmFyIG1lc3NhZ2VMaXN0ID0gW107XG5cdGZvciAodmFyIGlkIGluIGFsbE1lc3NhZ2VzKSB7XG5cdFx0dmFyIGl0ZW0gPSBhbGxNZXNzYWdlc1tpZF07XG5cblx0XHR2YXIgbWVzc2FnZXNMZW5ndGggPSBpdGVtLm1lc3NhZ2VzLmxlbmd0aDtcblx0XHRtZXNzYWdlTGlzdC5wdXNoKHtcblx0XHRcdGxhc3RNZXNzYWdlOiBpdGVtLm1lc3NhZ2VzW21lc3NhZ2VzTGVuZ3RoIC0xXSxcblx0XHRcdGxhc3RBY2Nlc3M6IGl0ZW0ubGFzdEFjY2Vzcyxcblx0XHRcdHVzZXI6IGl0ZW0udXNlclxuXHRcdH0pXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG9wZW5DaGF0SUQ6IE1lc3NhZ2VzU3RvcmUuZ2V0T3BlbkNoYXRVc2VySUQoKSxcblx0XHRtZXNzYWdlTGlzdDogbWVzc2FnZUxpc3Rcblx0fTtcbn1cblxudmFyIFVzZXJMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlVzZXJMaXN0XCIsXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBnZXRTdGF0ZUZyb21TdG9yZSgpO1xuXHR9LFxuXHRjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcblx0XHRNZXNzYWdlc1N0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMub25TdG9yZUNoYW5nZSk7XG5cdH0sXG5cdGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG5cdFx0TWVzc2FnZXNTdG9yZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLm9uU3RvcmVDaGFuZ2UpO1xuXHR9LFxuXHRvblN0b3JlQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZShnZXRTdGF0ZUZyb21TdG9yZSgpKTtcblx0fSxcblx0Y2hhbmdlT3BlbkNoYXQ6IGZ1bmN0aW9uIChpZCkge1xuXHRcdE1lc3NhZ2VzQWN0aW9ucy5jaGFuZ2VPcGVuQ2hhdChpZCk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuc3RhdGUubWVzc2FnZUxpc3Quc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0aWYgKGEubGFzdE1lc3NhZ2UudGltZXN0YW1wID4gYi5sYXN0TWVzc2FnZS50aW1lc3RhbXApIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGEubGFzdE1lc3NhZ2UudGltZXN0YW1wIDwgYi5sYXN0TWVzc2FnZS50aW1lc3RhbXApIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9KTtcblxuXHRcdHZhciBtZXNzYWdlcyA9IHRoaXMuc3RhdGUubWVzc2FnZUxpc3QubWFwKGZ1bmN0aW9uIChtZXNzYWdlLCBpbmRleCkge1xuXHRcdFx0dmFyIGRhdGUgPSB1dGlscy5nZXROaWNlRGF0ZShtZXNzYWdlLmxhc3RNZXNzYWdlLnRpbWVzdGFtcCk7XG5cblx0XHRcdHZhciBzdGF0dXNJY29uO1xuXHRcdFx0aWYgKG1lc3NhZ2UubGFzdE1lc3NhZ2UuZnJvbSAhPT0gbWVzc2FnZS51c2VyLmlkKSB7XG5cdFx0XHRcdHN0YXR1c0ljb24gPSAoXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwge2NsYXNzTmFtZTogXCJmYSBmYS1yZXBseSB1c2VyLWxpc3RfX2l0ZW1fX2ljb25cIn0pXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAobWVzc2FnZS5sYXN0QWNjZXNzLmN1cnJlbnRVc2VyIDwgbWVzc2FnZS5sYXN0TWVzc2FnZS50aW1lc3RhbXApIHtcblx0XHRcdFx0c3RhdHVzSWNvbiA9IChcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7Y2xhc3NOYW1lOiBcImZhIGZhLWNpcmNsZSB1c2VyLWxpc3RfX2l0ZW1fX2ljb25cIn0pXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpc05ld01lc3NhZ2UgPSBmYWxzZTtcblx0XHRcdGlmIChtZXNzYWdlLmxhc3RBY2Nlc3MuY3VycmVudFVzZXI8IG1lc3NhZ2UubGFzdE1lc3NhZ2UudGltZXN0YW1wKSB7XG5cdFx0XHRcdGlzTmV3TWVzc2FnZSA9IG1lc3NhZ2UubGFzdE1lc3NhZ2UuZnJvbSAhPT0gVXNlclN0b3JlLnVzZXIuaWQ7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpdGVtQ2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldCh7XG5cdFx0XHRcdCd1c2VyLWxpc3RfX2l0ZW0nOiB0cnVlLFxuXHRcdFx0XHQnY2xlYXInOiB0cnVlLFxuXHRcdFx0XHQndXNlci1saXN0X19pdGVtLS1uZXcnOiBpc05ld01lc3NhZ2UsXG5cdFx0XHRcdCd1c2VyLWxpc3RfX2l0ZW0tLWFjdGl2ZSc6IHRoaXMuc3RhdGUub3BlbkNoYXRJRCA9PT0gbWVzc2FnZS51c2VyLmlkXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtvbkNsaWNrOiAgdGhpcy5jaGFuZ2VPcGVuQ2hhdC5iaW5kKHRoaXMsIG1lc3NhZ2UudXNlci5pZCksIGNsYXNzTmFtZTogaXRlbUNsYXNzZXMsIGtleTogIG1lc3NhZ2UudXNlci5pZH0sIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ1c2VyLWxpc3RfX2l0ZW1fX3BpY3R1cmVcIn0sIFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7c3JjOiAgbWVzc2FnZS51c2VyLnByb2ZpbGVQaWN0dXJlfSlcblx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidXNlci1saXN0X19pdGVtX19kZXRhaWxzXCJ9LCBcblx0XHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcInVzZXItbGlzdF9faXRlbV9fbmFtZVwifSwgXG5cdFx0XHRcdFx0XHRcdCBtZXNzYWdlLnVzZXIubmFtZSwgXG5cblx0XHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImFiYnJcIiwge2NsYXNzTmFtZTogXCJ1c2VyLWxpc3RfX2l0ZW1fX3RpbWVzdGFtcFwifSwgXG5cdFx0XHRcdFx0XHRcdFx0ZGF0ZSBcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0KSwgXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInVzZXItbGlzdF9faXRlbV9fbWVzc2FnZVwifSwgXG5cdFx0XHRcdFx0XHRcdHN0YXR1c0ljb24sIFwiIFwiLCAgbWVzc2FnZS5sYXN0TWVzc2FnZS5jb250ZW50c1xuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdH0sIHRoaXMpO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ1c2VyLWxpc3RcIn0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJ1c2VyLWxpc3RfX2xpc3RcIn0sIFxuXHRcdFx0XHRcdG1lc3NhZ2VzIFxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVXNlckxpc3Q7IiwidmFyIFVzZXJTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy91c2VyJyk7XG5cbnZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlcnMvYXBwJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIG1lc3NhZ2VzID0ge1xuXHQyOiB7XG5cdFx0dXNlcjoge1xuXHRcdFx0cHJvZmlsZVBpY3R1cmU6ICdodHRwczovL2F2YXRhcnMwLmdpdGh1YnVzZXJjb250ZW50LmNvbS91Lzc5MjIxMDk/dj0zJnM9NDYwJyxcblx0XHRcdGlkOiAyLFxuXHRcdFx0bmFtZTogJ1J5YW4gQ2xhcmsnLFxuXHRcdFx0c3RhdHVzOiAnb25saW5lJ1xuXHRcdH0sXG5cdFx0bGFzdEFjY2Vzczoge1xuXHRcdFx0cmVjaXBpZW50OiAxNDI0NDY5Nzk0MDUwLFxuXHRcdFx0Y3VycmVudFVzZXI6IDE0MjQ0Njk3OTQwODBcblx0XHR9LFxuXHRcdG1lc3NhZ2VzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnRlbnRzOiAnSGV5IScsXG5cdFx0XHRcdGZyb206IDIsXG5cdFx0XHRcdHRpbWVzdGFtcDogMTQyNDQ2OTc5MzAyM1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0Y29udGVudHM6ICdIZXksIHdoYXRcXCdzIHVwPycsXG5cdFx0XHRcdGZyb206IDEsXG5cdFx0XHRcdHRpbWVzdGFtcDogMTQyNDQ2OTc5NDAwMFxuXHRcdFx0fVxuXHRcdF1cblx0fSxcblx0Mzoge1xuXHRcdHVzZXI6IHtcblx0XHRcdHJlYWQ6IHRydWUsXG5cdFx0XHRwcm9maWxlUGljdHVyZTogJ2h0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMjk1NTQ4Mz92PTMmcz00NjAnLFxuXHRcdFx0bmFtZTogJ0ppbGxlcyBTb2V0ZXJzJyxcblx0XHRcdGlkOiAzLFxuXHRcdFx0c3RhdHVzOiAnb25saW5lJ1xuXHRcdH0sXG5cdFx0bGFzdEFjY2Vzczoge1xuXHRcdFx0cmVjaXBpZW50OiAxNDI0MzUyNTIyMDAwLFxuXHRcdFx0Y3VycmVudFVzZXI6IDE0MjQzNTI1MjIwODBcblx0XHR9LFxuXHRcdG1lc3NhZ2VzOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnRlbnRzOiAnV2FudCBhIGdhbWUgb2YgcGluZyBwb25nPycsXG5cdFx0XHRcdGZyb206IDMsXG5cdFx0XHRcdHRpbWVzdGFtcDogMTQyNDM1MjUyMjAwMFxuXHRcdFx0fVxuXHRcdF1cblx0fSxcblx0NDoge1xuXHRcdHVzZXI6IHtcblx0XHRcdG5hbWU6ICdUb2RkIE1vdHRvJyxcblx0XHRcdGlkOiA0LFxuXHRcdFx0cHJvZmlsZVBpY3R1cmU6ICdodHRwczovL2F2YXRhcnMxLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE2NTU5Njg/dj0zJnM9NDYwJyxcblx0XHRcdHN0YXR1czogJ29ubGluZSdcblx0XHR9LFxuXHRcdGxhc3RBY2Nlc3M6IHtcblx0XHRcdHJlY2lwaWVudDogMTQyNDQyMzU3OTAwMCxcblx0XHRcdGN1cnJlbnRVc2VyOiAxNDI0NDIzNTc0MDAwXG5cdFx0fSxcblx0XHRtZXNzYWdlczogW1xuXHRcdFx0e1xuXHRcdFx0XHRjb250ZW50czogJ1BsZWFzZSBmb2xsb3cgbWUgb24gdHdpdHRlciBJXFwnbGwgcGF5IHlvdScsXG5cdFx0XHRcdHRpbWVzdGFtcDogMTQyNDQyMzU3OTAwMCxcblx0XHRcdFx0ZnJvbTogNFxuXHRcdFx0fVxuXHRcdF1cblx0fVxufTtcblxudmFyIG9wZW5DaGF0SUQgPSBwYXJzZUludChPYmplY3Qua2V5cyhtZXNzYWdlcylbMF0sIDEwKTtcblxudmFyIG1lc3NhZ2VzU3RvcmUgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblx0YWRkQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdHRoaXMub24oJ2NoYW5nZScsIGNhbGxiYWNrKTtcblx0fSxcblx0cmVtb3ZlQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdHRoaXMub2ZmKCdjaGFuZ2UnLCBjYWxsYmFjayk7XG5cdH0sXG5cdGdldE9wZW5DaGF0VXNlcklEOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG9wZW5DaGF0SUQ7XG5cdH0sXG5cdGdldENoYXRCeVVzZXJJRDogZnVuY3Rpb24gKGlkKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2VzW2lkXTtcblx0fSxcblx0Z2V0QWxsQ2hhdHM6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbWVzc2FnZXM7XG5cdH1cbn0pO1xuXG5tZXNzYWdlc1N0b3JlLmRpc3BhdGNoVG9rZW4gPSBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cdHZhciBhY3Rpb25zID0ge1xuXHRcdHVwZGF0ZU9wZW5DaGF0SUQ6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cdFx0XHRvcGVuQ2hhdElEID0gcGF5bG9hZC5hY3Rpb24udXNlcklEO1xuXG5cdFx0XHRtZXNzYWdlc1N0b3JlLmVtaXQoJ2NoYW5nZScpO1xuXHRcdH0sXG5cdFx0c2VuZE1lc3NhZ2U6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG5cdFx0XHR2YXIgdXNlcklEID0gcGF5bG9hZC5hY3Rpb24udXNlcklEO1xuXG5cdFx0XHRtZXNzYWdlc1t1c2VySURdLm1lc3NhZ2VzLnB1c2goe1xuXHRcdFx0XHRjb250ZW50czogcGF5bG9hZC5hY3Rpb24ubWVzc2FnZSxcblx0XHRcdFx0dGltZXN0YW1wOiBwYXlsb2FkLmFjdGlvbi50aW1lc3RhbXAsXG5cdFx0XHRcdGZyb206IFVzZXJTdG9yZS51c2VyLmlkXG5cdFx0XHR9KTtcblxuXHRcdFx0bWVzc2FnZXNTdG9yZS5lbWl0KCdjaGFuZ2UnKTtcblx0XHR9XG5cdH07XG5cblx0YWN0aW9uc1twYXlsb2FkLmFjdGlvbi50eXBlXSAmJiBhY3Rpb25zW3BheWxvYWQuYWN0aW9uLnR5cGVdKHBheWxvYWQpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVzc2FnZXNTdG9yZTsiLCJ2YXIgdXNlclN0b3JlID0ge1xuXHR1c2VyOiB7XG5cdFx0aWQ6IDEsXG5cdFx0bmFtZTogJ0pvaG4gRG9lJyxcblx0XHRwcm9maWxlUGljdHVyZTogJ2h0dHBzOi8vYXZhdGFyczEuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvODkwMTM1MT92PTMmcz0yMDAnXG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdXNlclN0b3JlOyIsInZhciB1dGlscyA9IHtcblx0Z2V0U2hvcnREYXRlOiBmdW5jdGlvbiAodGltZXN0YW1wKSB7XG5cdFx0dmFyIGRpc3RhbmNlID0gTWF0aC5yb3VuZCggKCArbmV3IERhdGUoKSAtIHRpbWVzdGFtcCApIC8gNjAwMDAgKTtcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG5cblx0XHR2YXIgaG91ciA9ICgnMCcgKyBkYXRlLmdldEhvdXJzKCkpLnNsaWNlKC0yKTtcblx0XHR2YXIgbWludXRlcyA9ICgnMCcgKyBkYXRlLmdldE1pbnV0ZXMoKSkuc2xpY2UoLTIpO1xuXG5cdFx0aWYgKGRpc3RhbmNlID4gMjg3OSkge1xuXHRcdFx0aWYgKGRpc3RhbmNlID4gMTQ1NjcpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0TmljZURhdGUodGltZXN0YW1wKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiAnWWVzdGVyZGF5IGF0ICcgKyBob3VyICsgJzonICsgbWludXRlcztcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICdhdCAnICsgaG91ciArICc6JyArIG1pbnV0ZXM7XG5cdFx0fVxuXHR9LFxuXHRnZXROaWNlRGF0ZTogZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuXHRcdHZhciBkZWZhdWx0U3RyaW5nID0gJyVkICVmJXkgYXQgJWg6JWknO1xuXG5cdFx0dmFyIGxhbmd1YWdlID0ge1xuXHRcdFx0MDogJ2xlc3MgdGhhbiBhIG1pbnV0ZSBhZ28nLFxuXHRcdFx0MTogJzEgbWludXRlIGFnbycsXG5cdFx0XHQ1OTogJyVkaXN0YW5jZSBtaW51dGVzIGFnbycsXG5cdFx0XHQxMTg6ICdhbiBob3VyIGFnbycsXG5cdFx0XHQxNDM5OiAnJXIgaG91cnMgYWdvJyxcblx0XHRcdDI4Nzk6ICdZZXN0ZXJkYXkgYXQgJWg6JWknLFxuXHRcdFx0MTQ1Njc6ICclbCBhdCAlaDolaScsXG5cdFx0fTtcblx0XHR2YXIgZGF5cyA9IFsnU3VuZGF5JywgJ01vbmRheScsJ1R1ZXNkYXknLCdXZWRuZXNkYXknLCdUaHVyc2RheScsJ0ZyaWRheScsJ1NhdHVyZGF5J107XG5cdFx0dmFyIG1vbnRocyA9IFsnSmFudWFyeScsJ0ZlYnJ1YXJ5JywnTWFyY2gnLCdBcHJpbCcsJ01heScsJ0p1bmUnLCdKdWx5JywnQXVndXN0JywnU2VwdGVtYmVyJywnT2N0b2JlcicsJ05vdmVtYmVyJywnRGVjZW1iZXInXTtcblxuXHRcdHZhciBkYXRlID0gbmV3IERhdGUodGltZXN0YW1wKTtcblx0XHR2YXIgZGlzdGFuY2UgPSBNYXRoLnJvdW5kKCAoICtuZXcgRGF0ZSgpIC0gdGltZXN0YW1wICkgLyA2MDAwMCApO1xuXG5cdFx0dmFyIHN0cmluZztcblx0XHRmb3IgKHZhciBpIGluIGxhbmd1YWdlKSB7XG5cdFx0XHRpZiAoZGlzdGFuY2UgPCBpKSB7XG5cdFx0XHRcdHN0cmluZyA9IGxhbmd1YWdlW2ldO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBob3VyID0gKCcwJyArIGRhdGUuZ2V0SG91cnMoKSkuc2xpY2UoLTIpO1xuXHRcdHZhciBtaW51dGVzID0gKCcwJyArIGRhdGUuZ2V0TWludXRlcygpKS5zbGljZSgtMik7XG5cdFx0dmFyIGRheSA9IGRheXNbZGF0ZS5nZXREYXkoKV07XG5cdFx0dmFyIG1vbnRoID0gbW9udGhzW2RhdGUuZ2V0TW9udGgoKV07XG5cblx0XHR2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblx0XHRpZiAobmV3IERhdGUoKS5nZXRGdWxsWWVhcigpID09PSB5ZWFyKSB7XG5cdFx0XHR5ZWFyID0gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKHN0cmluZykge1xuXHRcdFx0dmFyIGhvdXJzQWdvID0gTWF0aC5yb3VuZChkaXN0YW5jZSAvIDYwKTtcblxuXHRcdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC8lZGlzdGFuY2UvaSwgZGlzdGFuY2UpXG5cdFx0XHRcdC5yZXBsYWNlKC8lci9pLCBob3Vyc0Fnbylcblx0XHRcdFx0LnJlcGxhY2UoLyVoL2ksIGhvdXIpXG5cdFx0XHRcdC5yZXBsYWNlKC8laS9pLCBtaW51dGVzKVxuXHRcdFx0XHQucmVwbGFjZSgvJWwvaSwgZGF5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdFN0cmluZy5yZXBsYWNlKC8lZC9pLCBkYXkpXG5cdFx0XHQucmVwbGFjZSgvJWYvaSwgbW9udGgpXG5cdFx0XHQucmVwbGFjZSgvJXkvaSwgeWVhcilcblx0XHRcdC5yZXBsYWNlKC8laC9pLCBob3VyKVxuXHRcdFx0LnJlcGxhY2UoLyVpL2ksIG1pbnV0ZXMpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzOyJdfQ==
