require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./partials/header":3,"./partials/messageBox":4,"./partials/userList":5}],2:[function(require,module,exports){
var ReplyBox = React.createClass({displayName: "ReplyBox",
	render: function () {
		return (
			React.createElement("div", {className: "reply-box"}, 
				React.createElement("input", {className: "reply-box__input", placeholder: "Type message to reply.."}), 
				React.createElement("span", {className: "reply-box__tip"}, 
					"Press ", React.createElement("span", {className: "reply-box__tip__button"}, "Enter"), " to send"
				)
			)
		);
	}
});

module.exports = ReplyBox;
},{}],3:[function(require,module,exports){
var Header = React.createClass({displayName: "Header",
	render: function () {
		return (
			React.createElement("header", {className: "header"}

			)
		)
	}
});

module.exports = Header;
},{}],4:[function(require,module,exports){
var ReplyBox = require('../components/replyBox');

var UserStore = require('../stores/user');

var Utils = require('../utils');

var MessageBox = React.createClass({displayName: "MessageBox",
	getInitialState: function () {
		return {
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
		};
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
},{"../components/replyBox":2,"../stores/user":6,"../utils":7}],5:[function(require,module,exports){
var utils = require('../utils');

var UserStore = require('../stores/user');

var UserList = React.createClass({displayName: "UserList",
	getInitialState: function () {
		return {
			openChatID: 0,
			messageList: [
				{
					lastMessage: {
						contents: 'Hey, what\'s up?',
						from: 1,
						timestamp: 1424469794000
					},
					lastAccess: {
						recipient: 1424469794050,
						currentUser: 1424469794080
					},
					user: {
						profilePicture: 'https://avatars0.githubusercontent.com/u/7922109?v=3&s=460',
						id: 2,
						name: 'Ryan Clark',
						status: 'online'
					}
				},
				{
					lastMessage: {
						contents: 'Want a game of ping pong?',
						from: 3,
						timestamp: 1424352522000
					},
					lastAccess: {
						recipient: 1424352522000,
						currentUser: 1424352522080
					},
					user: {
						read: true,
						profilePicture: 'https://avatars3.githubusercontent.com/u/2955483?v=3&s=460',
						name: 'Jilles Soeters',
						id: 3,
						status: 'online'
					}
				},
				{
					lastMessage: {
						contents: 'Please follow me on twitter I\'ll pay you',
						timestamp: 1424423579000,
						from: 4
					},
					lastAccess: {
						recipient: 1424423579000,
						currentUser: 1424423574000
					},
					user: {
						name: 'Todd Motto',
						id: 4,
						profilePicture: 'https://avatars1.githubusercontent.com/u/1655968?v=3&s=460',
						status: 'online'
					}
				}
			]
		}
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
				'user-list__item--active': this.state.openChatID === index
			});

			return (
				React.createElement("li", {className: itemClasses, key:  message.user.id}, 
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
},{"../stores/user":6,"../utils":7}],6:[function(require,module,exports){
var userStore = {
	user: {
		id: 1,
		name: 'John Doe',
		profilePicture: 'https://avatars1.githubusercontent.com/u/8901351?v=3&s=200'
	}
};

module.exports = userStore;
},{}],7:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvUnlhbi9wcm9qZWN0cy9mbHV4L3B1YmxpYy9zcmMvanMvYXBwLmpzeCIsIi9Vc2Vycy9SeWFuL3Byb2plY3RzL2ZsdXgvcHVibGljL3NyYy9qcy9jb21wb25lbnRzL3JlcGx5Qm94LmpzeCIsIi9Vc2Vycy9SeWFuL3Byb2plY3RzL2ZsdXgvcHVibGljL3NyYy9qcy9wYXJ0aWFscy9oZWFkZXIuanN4IiwiL1VzZXJzL1J5YW4vcHJvamVjdHMvZmx1eC9wdWJsaWMvc3JjL2pzL3BhcnRpYWxzL21lc3NhZ2VCb3guanN4IiwiL1VzZXJzL1J5YW4vcHJvamVjdHMvZmx1eC9wdWJsaWMvc3JjL2pzL3BhcnRpYWxzL3VzZXJMaXN0LmpzeCIsIi9Vc2Vycy9SeWFuL3Byb2plY3RzL2ZsdXgvcHVibGljL3NyYy9qcy9zdG9yZXMvdXNlci5qcyIsIi9Vc2Vycy9SeWFuL3Byb2plY3RzL2ZsdXgvcHVibGljL3NyYy9qcy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBIZWFkZXIgPSByZXF1aXJlKCcuL3BhcnRpYWxzL2hlYWRlcicpO1xudmFyIFVzZXJMaXN0ID0gcmVxdWlyZSgnLi9wYXJ0aWFscy91c2VyTGlzdCcpO1xudmFyIE1lc3NhZ2VCb3ggPSByZXF1aXJlKCcuL3BhcnRpYWxzL21lc3NhZ2VCb3gnKTtcblxudmFyIFBhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiUGFnZVwiLFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImFwcFwifSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoSGVhZGVyLCBudWxsKSwgXG5cblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChVc2VyTGlzdCwgbnVsbCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KE1lc3NhZ2VCb3gsIG51bGwpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7XG5cblJlYWN0LnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFBhZ2UsIG51bGwpLCBkb2N1bWVudC5ib2R5KTsiLCJ2YXIgUmVwbHlCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiUmVwbHlCb3hcIixcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJyZXBseS1ib3hcIn0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge2NsYXNzTmFtZTogXCJyZXBseS1ib3hfX2lucHV0XCIsIHBsYWNlaG9sZGVyOiBcIlR5cGUgbWVzc2FnZSB0byByZXBseS4uXCJ9KSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwicmVwbHktYm94X190aXBcIn0sIFxuXHRcdFx0XHRcdFwiUHJlc3MgXCIsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwicmVwbHktYm94X190aXBfX2J1dHRvblwifSwgXCJFbnRlclwiKSwgXCIgdG8gc2VuZFwiXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXBseUJveDsiLCJ2YXIgSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkhlYWRlclwiLFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImhlYWRlclwiLCB7Y2xhc3NOYW1lOiBcImhlYWRlclwifVxuXG5cdFx0XHQpXG5cdFx0KVxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXI7IiwidmFyIFJlcGx5Qm94ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9yZXBseUJveCcpO1xuXG52YXIgVXNlclN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL3VzZXInKTtcblxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxudmFyIE1lc3NhZ2VCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTWVzc2FnZUJveFwiLFxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXNlcjoge1xuXHRcdFx0XHRwcm9maWxlUGljdHVyZTogJ2h0dHBzOi8vYXZhdGFyczAuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvNzkyMjEwOT92PTMmcz00NjAnLFxuXHRcdFx0XHRpZDogMixcblx0XHRcdFx0bmFtZTogJ1J5YW4gQ2xhcmsnLFxuXHRcdFx0XHRzdGF0dXM6ICdvbmxpbmUnXG5cdFx0XHR9LFxuXHRcdFx0bGFzdEFjY2Vzczoge1xuXHRcdFx0XHRyZWNpcGllbnQ6IDE0MjQ0Njk3OTQwNTAsXG5cdFx0XHRcdGN1cnJlbnRVc2VyOiAxNDI0NDY5Nzk0MDgwXG5cdFx0XHR9LFxuXHRcdFx0bWVzc2FnZXM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnRlbnRzOiAnSGV5IScsXG5cdFx0XHRcdFx0ZnJvbTogMixcblx0XHRcdFx0XHR0aW1lc3RhbXA6IDE0MjQ0Njk3OTMwMjNcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnRlbnRzOiAnSGV5LCB3aGF0XFwncyB1cD8nLFxuXHRcdFx0XHRcdGZyb206IDEsXG5cdFx0XHRcdFx0dGltZXN0YW1wOiAxNDI0NDY5Nzk0MDAwXG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHR9O1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbWVzc2FnZXNMZW5ndGggPSB0aGlzLnN0YXRlLm1lc3NhZ2VzLmxlbmd0aDtcblx0XHR2YXIgY3VycmVudFVzZXJJRCA9IFVzZXJTdG9yZS51c2VyLmlkO1xuXG5cdFx0dmFyIG1lc3NhZ2VzID0gdGhpcy5zdGF0ZS5tZXNzYWdlcy5tYXAoZnVuY3Rpb24gKG1lc3NhZ2UsIGluZGV4KSB7XG5cdFx0XHR2YXIgbWVzc2FnZUNsYXNzZXMgPSBSZWFjdC5hZGRvbnMuY2xhc3NTZXQoe1xuXHRcdFx0XHQnbWVzc2FnZS1ib3hfX2l0ZW0nOiB0cnVlLFxuXHRcdFx0XHQnbWVzc2FnZS1ib3hfX2l0ZW0tLWZyb20tY3VycmVudCc6IG1lc3NhZ2UuZnJvbSA9PT0gY3VycmVudFVzZXJJRCxcblx0XHRcdFx0J2NsZWFyJzogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiAgbWVzc2FnZS50aW1lc3RhbXAgKyAnLScgKyBtZXNzYWdlLmZyb20sIGNsYXNzTmFtZTogbWVzc2FnZUNsYXNzZXMgfSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1lc3NhZ2UtYm94X19pdGVtX19jb250ZW50c1wifSwgXG5cdFx0XHRcdFx0XHQgbWVzc2FnZS5jb250ZW50c1xuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdHZhciBsYXN0TWVzc2FnZSA9IHRoaXMuc3RhdGUubWVzc2FnZXNbbWVzc2FnZXNMZW5ndGggLTFdO1xuXG5cdFx0aWYgKGxhc3RNZXNzYWdlLmZyb20gPT09IGN1cnJlbnRVc2VySUQpIHtcblx0XHRcdGlmICh0aGlzLnN0YXRlLmxhc3RBY2Nlc3MucmVjaXBpZW50ID49IGxhc3RNZXNzYWdlLnRpbWVzdGFtcCkge1xuXHRcdFx0XHR2YXIgZGF0ZSA9IFV0aWxzLmdldFNob3J0RGF0ZShsYXN0TWVzc2FnZS50aW1lc3RhbXApO1xuXHRcdFx0XHRtZXNzYWdlcy5wdXNoKFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiBcInJlYWRcIiwgY2xhc3NOYW1lOiBcIm1lc3NhZ2UtYm94X19pdGVtIG1lc3NhZ2UtYm94X19pdGVtLS1yZWFkXCJ9LCBcblx0XHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtZXNzYWdlLWJveF9faXRlbV9fY29udGVudHNcIn0sIFxuXHRcdFx0XHRcdFx0XHRcIlJlYWQgXCIsIGRhdGUgXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibWVzc2FnZS1ib3hcIn0sIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJtZXNzYWdlLWJveF9fbGlzdFwifSwgXG5cdFx0XHRcdFx0bWVzc2FnZXMgXG5cdFx0XHRcdCksIFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFJlcGx5Qm94LCBudWxsKVxuXHRcdFx0KVxuXHRcdCk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VCb3g7IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxudmFyIFVzZXJTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy91c2VyJyk7XG5cbnZhciBVc2VyTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJVc2VyTGlzdFwiLFxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0b3BlbkNoYXRJRDogMCxcblx0XHRcdG1lc3NhZ2VMaXN0OiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsYXN0TWVzc2FnZToge1xuXHRcdFx0XHRcdFx0Y29udGVudHM6ICdIZXksIHdoYXRcXCdzIHVwPycsXG5cdFx0XHRcdFx0XHRmcm9tOiAxLFxuXHRcdFx0XHRcdFx0dGltZXN0YW1wOiAxNDI0NDY5Nzk0MDAwXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRsYXN0QWNjZXNzOiB7XG5cdFx0XHRcdFx0XHRyZWNpcGllbnQ6IDE0MjQ0Njk3OTQwNTAsXG5cdFx0XHRcdFx0XHRjdXJyZW50VXNlcjogMTQyNDQ2OTc5NDA4MFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dXNlcjoge1xuXHRcdFx0XHRcdFx0cHJvZmlsZVBpY3R1cmU6ICdodHRwczovL2F2YXRhcnMwLmdpdGh1YnVzZXJjb250ZW50LmNvbS91Lzc5MjIxMDk/dj0zJnM9NDYwJyxcblx0XHRcdFx0XHRcdGlkOiAyLFxuXHRcdFx0XHRcdFx0bmFtZTogJ1J5YW4gQ2xhcmsnLFxuXHRcdFx0XHRcdFx0c3RhdHVzOiAnb25saW5lJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxhc3RNZXNzYWdlOiB7XG5cdFx0XHRcdFx0XHRjb250ZW50czogJ1dhbnQgYSBnYW1lIG9mIHBpbmcgcG9uZz8nLFxuXHRcdFx0XHRcdFx0ZnJvbTogMyxcblx0XHRcdFx0XHRcdHRpbWVzdGFtcDogMTQyNDM1MjUyMjAwMFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bGFzdEFjY2Vzczoge1xuXHRcdFx0XHRcdFx0cmVjaXBpZW50OiAxNDI0MzUyNTIyMDAwLFxuXHRcdFx0XHRcdFx0Y3VycmVudFVzZXI6IDE0MjQzNTI1MjIwODBcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHVzZXI6IHtcblx0XHRcdFx0XHRcdHJlYWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRwcm9maWxlUGljdHVyZTogJ2h0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMjk1NTQ4Mz92PTMmcz00NjAnLFxuXHRcdFx0XHRcdFx0bmFtZTogJ0ppbGxlcyBTb2V0ZXJzJyxcblx0XHRcdFx0XHRcdGlkOiAzLFxuXHRcdFx0XHRcdFx0c3RhdHVzOiAnb25saW5lJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGxhc3RNZXNzYWdlOiB7XG5cdFx0XHRcdFx0XHRjb250ZW50czogJ1BsZWFzZSBmb2xsb3cgbWUgb24gdHdpdHRlciBJXFwnbGwgcGF5IHlvdScsXG5cdFx0XHRcdFx0XHR0aW1lc3RhbXA6IDE0MjQ0MjM1NzkwMDAsXG5cdFx0XHRcdFx0XHRmcm9tOiA0XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRsYXN0QWNjZXNzOiB7XG5cdFx0XHRcdFx0XHRyZWNpcGllbnQ6IDE0MjQ0MjM1NzkwMDAsXG5cdFx0XHRcdFx0XHRjdXJyZW50VXNlcjogMTQyNDQyMzU3NDAwMFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dXNlcjoge1xuXHRcdFx0XHRcdFx0bmFtZTogJ1RvZGQgTW90dG8nLFxuXHRcdFx0XHRcdFx0aWQ6IDQsXG5cdFx0XHRcdFx0XHRwcm9maWxlUGljdHVyZTogJ2h0dHBzOi8vYXZhdGFyczEuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTY1NTk2OD92PTMmcz00NjAnLFxuXHRcdFx0XHRcdFx0c3RhdHVzOiAnb25saW5lJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH1cblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5zdGF0ZS5tZXNzYWdlTGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRpZiAoYS5sYXN0TWVzc2FnZS50aW1lc3RhbXAgPiBiLmxhc3RNZXNzYWdlLnRpbWVzdGFtcCkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYS5sYXN0TWVzc2FnZS50aW1lc3RhbXAgPCBiLmxhc3RNZXNzYWdlLnRpbWVzdGFtcCkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAwO1xuXHRcdH0pO1xuXG5cdFx0dmFyIG1lc3NhZ2VzID0gdGhpcy5zdGF0ZS5tZXNzYWdlTGlzdC5tYXAoZnVuY3Rpb24gKG1lc3NhZ2UsIGluZGV4KSB7XG5cdFx0XHR2YXIgZGF0ZSA9IHV0aWxzLmdldE5pY2VEYXRlKG1lc3NhZ2UubGFzdE1lc3NhZ2UudGltZXN0YW1wKTtcblxuXHRcdFx0dmFyIHN0YXR1c0ljb247XG5cdFx0XHRpZiAobWVzc2FnZS5sYXN0TWVzc2FnZS5mcm9tICE9PSBtZXNzYWdlLnVzZXIuaWQpIHtcblx0XHRcdFx0c3RhdHVzSWNvbiA9IChcblx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCB7Y2xhc3NOYW1lOiBcImZhIGZhLXJlcGx5IHVzZXItbGlzdF9faXRlbV9faWNvblwifSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmIChtZXNzYWdlLmxhc3RBY2Nlc3MuY3VycmVudFVzZXIgPCBtZXNzYWdlLmxhc3RNZXNzYWdlLnRpbWVzdGFtcCkge1xuXHRcdFx0XHRzdGF0dXNJY29uID0gKFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHtjbGFzc05hbWU6IFwiZmEgZmEtY2lyY2xlIHVzZXItbGlzdF9faXRlbV9faWNvblwifSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGlzTmV3TWVzc2FnZSA9IGZhbHNlO1xuXHRcdFx0aWYgKG1lc3NhZ2UubGFzdEFjY2Vzcy5jdXJyZW50VXNlcjwgbWVzc2FnZS5sYXN0TWVzc2FnZS50aW1lc3RhbXApIHtcblx0XHRcdFx0aXNOZXdNZXNzYWdlID0gbWVzc2FnZS5sYXN0TWVzc2FnZS5mcm9tICE9PSBVc2VyU3RvcmUudXNlci5pZDtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGl0ZW1DbGFzc2VzID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0KHtcblx0XHRcdFx0J3VzZXItbGlzdF9faXRlbSc6IHRydWUsXG5cdFx0XHRcdCdjbGVhcic6IHRydWUsXG5cdFx0XHRcdCd1c2VyLWxpc3RfX2l0ZW0tLW5ldyc6IGlzTmV3TWVzc2FnZSxcblx0XHRcdFx0J3VzZXItbGlzdF9faXRlbS0tYWN0aXZlJzogdGhpcy5zdGF0ZS5vcGVuQ2hhdElEID09PSBpbmRleFxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiBpdGVtQ2xhc3Nlcywga2V5OiAgbWVzc2FnZS51c2VyLmlkfSwgXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInVzZXItbGlzdF9faXRlbV9fcGljdHVyZVwifSwgXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtzcmM6ICBtZXNzYWdlLnVzZXIucHJvZmlsZVBpY3R1cmV9KVxuXHRcdFx0XHRcdCksIFxuXHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ1c2VyLWxpc3RfX2l0ZW1fX2RldGFpbHNcIn0sIFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIHtjbGFzc05hbWU6IFwidXNlci1saXN0X19pdGVtX19uYW1lXCJ9LCBcblx0XHRcdFx0XHRcdFx0IG1lc3NhZ2UudXNlci5uYW1lLCBcblxuXHRcdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiYWJiclwiLCB7Y2xhc3NOYW1lOiBcInVzZXItbGlzdF9faXRlbV9fdGltZXN0YW1wXCJ9LCBcblx0XHRcdFx0XHRcdFx0XHRkYXRlIFxuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpLCBcblx0XHRcdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwidXNlci1saXN0X19pdGVtX19tZXNzYWdlXCJ9LCBcblx0XHRcdFx0XHRcdFx0c3RhdHVzSWNvbiwgXCIgXCIsICBtZXNzYWdlLmxhc3RNZXNzYWdlLmNvbnRlbnRzXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0fSwgdGhpcyk7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInVzZXItbGlzdFwifSwgXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7Y2xhc3NOYW1lOiBcInVzZXItbGlzdF9fbGlzdFwifSwgXG5cdFx0XHRcdFx0bWVzc2FnZXMgXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBVc2VyTGlzdDsiLCJ2YXIgdXNlclN0b3JlID0ge1xuXHR1c2VyOiB7XG5cdFx0aWQ6IDEsXG5cdFx0bmFtZTogJ0pvaG4gRG9lJyxcblx0XHRwcm9maWxlUGljdHVyZTogJ2h0dHBzOi8vYXZhdGFyczEuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvODkwMTM1MT92PTMmcz0yMDAnXG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdXNlclN0b3JlOyIsInZhciB1dGlscyA9IHtcblx0Z2V0U2hvcnREYXRlOiBmdW5jdGlvbiAodGltZXN0YW1wKSB7XG5cdFx0dmFyIGRpc3RhbmNlID0gTWF0aC5yb3VuZCggKCArbmV3IERhdGUoKSAtIHRpbWVzdGFtcCApIC8gNjAwMDAgKTtcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG5cblx0XHR2YXIgaG91ciA9ICgnMCcgKyBkYXRlLmdldEhvdXJzKCkpLnNsaWNlKC0yKTtcblx0XHR2YXIgbWludXRlcyA9ICgnMCcgKyBkYXRlLmdldE1pbnV0ZXMoKSkuc2xpY2UoLTIpO1xuXG5cdFx0aWYgKGRpc3RhbmNlID4gMjg3OSkge1xuXHRcdFx0aWYgKGRpc3RhbmNlID4gMTQ1NjcpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0TmljZURhdGUodGltZXN0YW1wKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiAnWWVzdGVyZGF5IGF0ICcgKyBob3VyICsgJzonICsgbWludXRlcztcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICdhdCAnICsgaG91ciArICc6JyArIG1pbnV0ZXM7XG5cdFx0fVxuXHR9LFxuXHRnZXROaWNlRGF0ZTogZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuXHRcdHZhciBkZWZhdWx0U3RyaW5nID0gJyVkICVmJXkgYXQgJWg6JWknO1xuXG5cdFx0dmFyIGxhbmd1YWdlID0ge1xuXHRcdFx0MDogJ2xlc3MgdGhhbiBhIG1pbnV0ZSBhZ28nLFxuXHRcdFx0MTogJzEgbWludXRlIGFnbycsXG5cdFx0XHQ1OTogJyVkaXN0YW5jZSBtaW51dGVzIGFnbycsXG5cdFx0XHQxMTg6ICdhbiBob3VyIGFnbycsXG5cdFx0XHQxNDM5OiAnJXIgaG91cnMgYWdvJyxcblx0XHRcdDI4Nzk6ICdZZXN0ZXJkYXkgYXQgJWg6JWknLFxuXHRcdFx0MTQ1Njc6ICclbCBhdCAlaDolaScsXG5cdFx0fTtcblx0XHR2YXIgZGF5cyA9IFsnU3VuZGF5JywgJ01vbmRheScsJ1R1ZXNkYXknLCdXZWRuZXNkYXknLCdUaHVyc2RheScsJ0ZyaWRheScsJ1NhdHVyZGF5J107XG5cdFx0dmFyIG1vbnRocyA9IFsnSmFudWFyeScsJ0ZlYnJ1YXJ5JywnTWFyY2gnLCdBcHJpbCcsJ01heScsJ0p1bmUnLCdKdWx5JywnQXVndXN0JywnU2VwdGVtYmVyJywnT2N0b2JlcicsJ05vdmVtYmVyJywnRGVjZW1iZXInXTtcblxuXHRcdHZhciBkYXRlID0gbmV3IERhdGUodGltZXN0YW1wKTtcblx0XHR2YXIgZGlzdGFuY2UgPSBNYXRoLnJvdW5kKCAoICtuZXcgRGF0ZSgpIC0gdGltZXN0YW1wICkgLyA2MDAwMCApO1xuXG5cdFx0dmFyIHN0cmluZztcblx0XHRmb3IgKHZhciBpIGluIGxhbmd1YWdlKSB7XG5cdFx0XHRpZiAoZGlzdGFuY2UgPCBpKSB7XG5cdFx0XHRcdHN0cmluZyA9IGxhbmd1YWdlW2ldO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBob3VyID0gKCcwJyArIGRhdGUuZ2V0SG91cnMoKSkuc2xpY2UoLTIpO1xuXHRcdHZhciBtaW51dGVzID0gKCcwJyArIGRhdGUuZ2V0TWludXRlcygpKS5zbGljZSgtMik7XG5cdFx0dmFyIGRheSA9IGRheXNbZGF0ZS5nZXREYXkoKV07XG5cdFx0dmFyIG1vbnRoID0gbW9udGhzW2RhdGUuZ2V0TW9udGgoKV07XG5cblx0XHR2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblx0XHRpZiAobmV3IERhdGUoKS5nZXRGdWxsWWVhcigpID09PSB5ZWFyKSB7XG5cdFx0XHR5ZWFyID0gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKHN0cmluZykge1xuXHRcdFx0dmFyIGhvdXJzQWdvID0gTWF0aC5yb3VuZChkaXN0YW5jZSAvIDYwKTtcblxuXHRcdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC8lZGlzdGFuY2UvaSwgZGlzdGFuY2UpXG5cdFx0XHRcdC5yZXBsYWNlKC8lci9pLCBob3Vyc0Fnbylcblx0XHRcdFx0LnJlcGxhY2UoLyVoL2ksIGhvdXIpXG5cdFx0XHRcdC5yZXBsYWNlKC8laS9pLCBtaW51dGVzKVxuXHRcdFx0XHQucmVwbGFjZSgvJWwvaSwgZGF5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGVmYXVsdFN0cmluZy5yZXBsYWNlKC8lZC9pLCBkYXkpXG5cdFx0XHQucmVwbGFjZSgvJWYvaSwgbW9udGgpXG5cdFx0XHQucmVwbGFjZSgvJXkvaSwgeWVhcilcblx0XHRcdC5yZXBsYWNlKC8laC9pLCBob3VyKVxuXHRcdFx0LnJlcGxhY2UoLyVpL2ksIG1pbnV0ZXMpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxzOyJdfQ==
