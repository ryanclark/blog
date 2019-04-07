(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Index = require('./pages/Index');

var _Index2 = _interopRequireDefault(_Index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_Index2.default, null), document.querySelector('.app'));

},{"./pages/Index":9,"react":"react","react-dom":"react-dom"}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _backbone = require('backbone');

var _backbone2 = require('backbone.localstorage');

var _backbone3 = _interopRequireDefault(_backbone2);

var _AlbumsGigs = require('../models/AlbumsGigs');

var _AlbumsGigs2 = _interopRequireDefault(_AlbumsGigs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AlbumsGigsCollection = function (_Collection) {
  _inherits(AlbumsGigsCollection, _Collection);

  function AlbumsGigsCollection(options) {
    _classCallCheck(this, AlbumsGigsCollection);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AlbumsGigsCollection).call(this, options));

    _this.model = _AlbumsGigs2.default;
    _this.localStorage = new _backbone3.default('albums-gigs');
    return _this;
  }

  _createClass(AlbumsGigsCollection, [{
    key: 'moveUp',
    value: function moveUp(model) {
      var index = this.indexOf(model);

      if (index > 0) {
        this.swap(model, index - 1);
      }
    }
  }, {
    key: 'moveDown',
    value: function moveDown(model) {
      var index = this.indexOf(model);

      if (index < this.models.length) {
        this.swap(model, index + 1);
      }
    }
  }, {
    key: 'swap',
    value: function swap(model, newIndex) {
      this.destroy(model);
      this.create(model, { at: newIndex });

      var newOrder = [];
      this.forEach(function (item) {
        newOrder.push(item.id);
      });

      // for some reason backbone doesn't save reordering to localStorage
      this.localStorage.records = newOrder;
      this.localStorage.localStorage().setItem('albums-gigs', newOrder);
    }
  }, {
    key: 'destroy',
    value: function destroy(model) {
      this.localStorage.destroy(model);
      this.remove(model);
    }
  }]);

  return AlbumsGigsCollection;
}(_backbone.Collection);

exports.default = new AlbumsGigsCollection();

},{"../models/AlbumsGigs":6,"backbone":"backbone","backbone.localstorage":"backbone.localstorage"}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _AlbumsGigs = require('../collections/AlbumsGigs');

var _AlbumsGigs2 = _interopRequireDefault(_AlbumsGigs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function decimalPlaces(num) {
  var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) {
    return 0;
  }
  return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
}

var validationRules = {
  price: function price(value) {
    return !(isNaN(value) || decimalPlaces(value) > 2);
  }
};

var Add = function (_Component) {
  _inherits(Add, _Component);

  function Add(props) {
    _classCallCheck(this, Add);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Add).call(this, props));

    _this.state = {
      name: '',
      price: 0
    };
    return _this;
  }

  _createClass(Add, [{
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this2 = this;

      e.preventDefault();

      if (!this.state.name || !this.state.price) {
        return;
      }

      _AlbumsGigs2.default.create({
        title: this.state.name,
        price: this.state.price
      });

      this.setState(function (state) {
        state.name = '';
        state.price = 0;

        return state;
      }, function () {
        _reactDom2.default.findDOMNode(_this2.refs.nameInput).focus();
      });
    }
  }, {
    key: 'handleChange',
    value: function handleChange(name, e) {
      var value = e.target.value;

      if (validationRules[name] && !validationRules[name](value)) {
        return;
      }

      this.setState(function (state) {
        return state[name] = value;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'add clear' },
        _react2.default.createElement(
          'h2',
          null,
          'Add a new Album/Gig'
        ),
        _react2.default.createElement(
          'form',
          { onSubmit: this.handleSubmit.bind(this) },
          _react2.default.createElement(
            'div',
            { className: 'field add__name' },
            _react2.default.createElement(
              'label',
              null,
              'Name'
            ),
            _react2.default.createElement('input', {
              ref: 'nameInput',
              onChange: this.handleChange.bind(this, 'name'),
              value: this.state.name
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'field add__price' },
            _react2.default.createElement(
              'label',
              null,
              'Price'
            ),
            _react2.default.createElement(
              'span',
              { className: 'add__price__pound' },
              '£'
            ),
            _react2.default.createElement('input', {
              onChange: this.handleChange.bind(this, 'price'),
              value: this.state.price
            })
          ),
          _react2.default.createElement(
            'button',
            {
              className: 'button',
              type: 'submit' },
            _react2.default.createElement('i', { className: 'fa fa-plus fa-fw' }),
            'Add'
          )
        )
      );
    }
  }]);

  return Add;
}(_react.Component);

exports.default = Add;

},{"../collections/AlbumsGigs":3,"react":"react","react-dom":"react-dom"}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AlbumsGigs = require('../collections/AlbumsGigs');

var _AlbumsGigs2 = _interopRequireDefault(_AlbumsGigs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function normalizePrice(price) {
  return (price * 1).toFixed(2);
}

function getOrdinal(n) {
  var s = ['th', 'st', 'nd', 'rd'];
  var v = n % 100;

  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

var AlbumsGigsList = function (_Component) {
  _inherits(AlbumsGigsList, _Component);

  function AlbumsGigsList(props) {
    _classCallCheck(this, AlbumsGigsList);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AlbumsGigsList).call(this, props));

    _this.state = {
      items: []
    };
    return _this;
  }

  _createClass(AlbumsGigsList, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.data.fetch();
    }
  }, {
    key: 'update',
    value: function update() {
      this.forceUpdate();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.data.on('add change remove', this.update.bind(this, null), this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.data.off(null, null, this);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var items = this.props.data.map(function (item, index) {
        var upArrow = _react2.default.createElement('i', { className: 'fa fa-fw' });
        if (index > 0) {
          upArrow = _react2.default.createElement('i', {
            className: 'fa fa-chevron-up fa-fw',
            onClick: function onClick() {
              return _AlbumsGigs2.default.moveUp(item);
            }
          });
        }

        var downArrow = _react2.default.createElement('i', { className: 'fa fa-fw' });
        if (index < _this2.props.data.length - 1) {
          downArrow = _react2.default.createElement('i', {
            className: 'fa fa-chevron-down fa-fw',
            onClick: function onClick() {
              return _AlbumsGigs2.default.moveDown(item);
            }
          });
        }

        return _react2.default.createElement(
          'li',
          {
            key: index,
            className: 'albums-gigs__item clear' },
          _react2.default.createElement(
            'span',
            { className: 'albums-gigs__column albums-gigs__column--name' },
            item.get('title')
          ),
          _react2.default.createElement(
            'span',
            { className: 'albums-gigs__column albums-gigs__column--price' },
            '£',
            normalizePrice(item.get('price'))
          ),
          _react2.default.createElement(
            'span',
            { className: 'albums-gigs__column albums-gigs__column--preference' },
            downArrow,
            _react2.default.createElement(
              'span',
              { className: 'albums-gigs__number' },
              getOrdinal(index + 1)
            ),
            upArrow
          ),
          _react2.default.createElement(
            'span',
            { className: 'albums-gigs__column albums-gigs__column--delete' },
            _react2.default.createElement('i', {
              className: 'fa fa-fw fa-times',
              onClick: function onClick() {
                _AlbumsGigs2.default.destroy(item);
              }
            })
          )
        );
      });

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'albums-gigs__header clear' },
          _react2.default.createElement(
            'span',
            { className: 'albums-gigs__column albums-gigs__column--name' },
            'Name'
          ),
          _react2.default.createElement(
            'span',
            { className: 'albums-gigs__column albums-gigs__column--price' },
            'Price'
          ),
          _react2.default.createElement(
            'span',
            { className: 'albums-gigs__column albums-gigs__column--preference' },
            'Preference'
          )
        ),
        _react2.default.createElement(
          'ul',
          { className: 'albums-gigs__list' },
          items
        )
      );
    }
  }]);

  return AlbumsGigsList;
}(_react.Component);

exports.default = AlbumsGigsList;

},{"../collections/AlbumsGigs":3,"react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _backbone = require('backbone');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AlbumsGigsModel = function (_Model) {
  _inherits(AlbumsGigsModel, _Model);

  function AlbumsGigsModel(options) {
    _classCallCheck(this, AlbumsGigsModel);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AlbumsGigsModel).call(this, options));
  }

  return AlbumsGigsModel;
}(_backbone.Model);

exports.default = AlbumsGigsModel;

},{"backbone":"backbone"}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AlbumsGigs = require('../collections/AlbumsGigs');

var _AlbumsGigs2 = _interopRequireDefault(_AlbumsGigs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function decimalPlaces(num) {
  var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) {
    return 0;
  }
  return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
}

var Afford = function (_Component) {
  _inherits(Afford, _Component);

  function Afford(props) {
    _classCallCheck(this, Afford);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Afford).call(this, props));

    _this.state = {
      price: ''
    };

    _this.collection = _AlbumsGigs2.default;
    return _this;
  }

  _createClass(Afford, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.collection.fetch();
    }
  }, {
    key: 'update',
    value: function update() {
      this.forceUpdate();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.collection.on('add change remove', this.update.bind(this, null), this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.collection.off(null, null, this);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      var value = e.target.value;

      if (isNaN(value) || decimalPlaces(value) > 2) {
        return;
      }

      this.setState(function (state) {
        return state.price = value;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var moneyLeft = this.state.price * 1;

      var items = [];

      this.collection.forEach(function (item) {
        var price = item.get('price') * 1;

        if (price <= moneyLeft) {
          items.push(item);
          moneyLeft -= price;
        }
      });

      var affordContent = undefined;
      if (items.length) {
        var affordableItems = items.map(function (item) {
          var price = (item.get('price') * 1).toFixed(2);
          return _react2.default.createElement(
            'li',
            {
              key: item.id,
              className: 'afford__item' },
            item.get('title'),
            ' (£',
            price,
            ')'
          );
        });

        var wording = items.length === 1 ? 'this' : 'these';

        affordContent = _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'p',
            null,
            'You can afford ',
            wording,
            ' with £',
            moneyLeft,
            ' left over'
          ),
          _react2.default.createElement(
            'ul',
            { className: 'afford__list' },
            affordableItems
          )
        );
      }

      if (!items.length && this.state.price) {
        affordContent = _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'p',
            null,
            'You can\'t afford anything :('
          )
        );
      }

      return _react2.default.createElement(
        'div',
        { className: 'afford' },
        _react2.default.createElement(
          'div',
          { className: 'add clear' },
          _react2.default.createElement(
            'h2',
            null,
            'How much do you have to spend?'
          ),
          _react2.default.createElement(
            'div',
            { className: 'field afford__price' },
            _react2.default.createElement(
              'span',
              { className: 'add__price__pound' },
              '£'
            ),
            _react2.default.createElement('input', {
              value: this.state.price,
              onChange: this.handleChange.bind(this)
            })
          )
        ),
        affordContent
      );
    }
  }]);

  return Afford;
}(_react.Component);

exports.default = Afford;

},{"../collections/AlbumsGigs":3,"react":"react"}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Add = require('../components/Add');

var _Add2 = _interopRequireDefault(_Add);

var _AlbumsGigsList = require('../components/AlbumsGigsList');

var _AlbumsGigsList2 = _interopRequireDefault(_AlbumsGigsList);

var _AlbumsGigs = require('../collections/AlbumsGigs');

var _AlbumsGigs2 = _interopRequireDefault(_AlbumsGigs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AlbumsGigs = function (_Component) {
  _inherits(AlbumsGigs, _Component);

  function AlbumsGigs(props) {
    _classCallCheck(this, AlbumsGigs);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AlbumsGigs).call(this, props));
  }

  _createClass(AlbumsGigs, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'albums-gigs' },
        _react2.default.createElement(_Add2.default, null),
        _react2.default.createElement(_AlbumsGigsList2.default, { data: _AlbumsGigs2.default })
      );
    }
  }]);

  return AlbumsGigs;
}(_react.Component);

exports.default = AlbumsGigs;

},{"../collections/AlbumsGigs":3,"../components/Add":4,"../components/AlbumsGigsList":5,"react":"react"}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Sidebar = require('../partials/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _AlbumsGigs = require('./AlbumsGigs');

var _AlbumsGigs2 = _interopRequireDefault(_AlbumsGigs);

var _Afford = require('./Afford');

var _Afford2 = _interopRequireDefault(_Afford);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pages = {
  albumGigs: {
    component: _react2.default.createElement(_AlbumsGigs2.default, null),
    title: 'Albums/Gigs',
    icon: 'fa-music'
  },
  afford: {
    component: _react2.default.createElement(_Afford2.default, null),
    title: 'What can I afford?',
    icon: 'fa-money'
  }
};

var Index = function (_Component) {
  _inherits(Index, _Component);

  function Index(props) {
    _classCallCheck(this, Index);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Index).call(this, props));

    _this.state = {
      page: 'albumGigs'
    };
    return _this;
  }

  _createClass(Index, [{
    key: 'handlePageChange',
    value: function handlePageChange(page) {
      this.setState(function (state) {
        return state.page = page;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var activePage = pages[this.state.page].component;

      return _react2.default.createElement(
        'div',
        { className: 'content' },
        _react2.default.createElement(_Sidebar2.default, {
          pages: pages,
          currentPage: this.state.page,
          onPageChange: this.handlePageChange.bind(this)
        }),
        _react2.default.createElement(
          'div',
          { className: 'content__padding' },
          activePage
        )
      );
    }
  }]);

  return Index;
}(_react.Component);

exports.default = Index;

},{"../partials/Sidebar":10,"./Afford":7,"./AlbumsGigs":8,"react":"react"}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Index = function (_Component) {
  _inherits(Index, _Component);

  function Index(props) {
    _classCallCheck(this, Index);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Index).call(this, props));
  }

  _createClass(Index, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var pages = _props.pages;
      var currentPage = _props.currentPage;

      var items = [];

      var _loop = function _loop(i) {
        var page = pages[i];

        var pageClasses = (0, _classnames2.default)('sidebar__item', {
          'sidebar__item--active': currentPage === i
        });

        items.push(_react2.default.createElement(
          'li',
          {
            key: i,
            className: pageClasses,
            onClick: function onClick() {
              return _this2.props.onPageChange(i);
            } },
          _react2.default.createElement('i', { className: 'fa fa-fw ' + page.icon }),
          page.title
        ));
      };

      for (var i in pages) {
        _loop(i);
      }

      return _react2.default.createElement(
        'aside',
        { className: 'sidebar' },
        _react2.default.createElement(
          'ul',
          { className: 'sidebar__list' },
          items
        )
      );
    }
  }]);

  return Index;
}(_react.Component);

exports.default = Index;

},{"classnames":1,"react":"react"}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsInNyYy9qcy9hcHAuanMiLCJzcmMvanMvY29sbGVjdGlvbnMvQWxidW1zR2lncy5qcyIsInNyYy9qcy9jb21wb25lbnRzL0FkZC5qcyIsInNyYy9qcy9jb21wb25lbnRzL0FsYnVtc0dpZ3NMaXN0LmpzIiwic3JjL2pzL21vZGVscy9BbGJ1bXNHaWdzLmpzIiwic3JjL2pzL3BhZ2VzL0FmZm9yZC5qcyIsInNyYy9qcy9wYWdlcy9BbGJ1bXNHaWdzLmpzIiwic3JjL2pzL3BhZ2VzL0luZGV4LmpzIiwic3JjL2pzL3BhcnRpYWxzL1NpZGViYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0NBLG1CQUFTLE1BQU0sQ0FBQyxvREFBUyxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNBckQsb0JBQW9CO1lBQXBCLG9CQUFvQjs7QUFDeEIsV0FESSxvQkFBb0IsQ0FDWixPQUFPLEVBQUU7MEJBRGpCLG9CQUFvQjs7dUVBQXBCLG9CQUFvQixhQUVoQixPQUFPOztBQUViLFVBQUssS0FBSyx1QkFBa0IsQ0FBQztBQUM3QixVQUFLLFlBQVksR0FBRyx1QkFBaUIs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ImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE2IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzLnB1c2goYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZykpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGtleSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcblxuaW1wb3J0IEluZGV4IGZyb20gJy4vcGFnZXMvSW5kZXgnO1xuXG5SZWFjdERPTS5yZW5kZXIoPEluZGV4IC8+LCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXBwJykpO1xuIiwiaW1wb3J0IHsgQ29sbGVjdGlvbiB9IGZyb20gJ2JhY2tib25lJztcbmltcG9ydCBMb2NhbFN0b3JhZ2UgZnJvbSAnYmFja2JvbmUubG9jYWxzdG9yYWdlJztcblxuaW1wb3J0IEFsYnVtc0dpZ3NNb2RlbCBmcm9tICcuLi9tb2RlbHMvQWxidW1zR2lncyc7XG5cbmNsYXNzIEFsYnVtc0dpZ3NDb2xsZWN0aW9uIGV4dGVuZHMgQ29sbGVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIHRoaXMubW9kZWwgPSBBbGJ1bXNHaWdzTW9kZWw7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2UgPSBuZXcgTG9jYWxTdG9yYWdlKCdhbGJ1bXMtZ2lncycpO1xuICB9XG5cbiAgbW92ZVVwKG1vZGVsKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleE9mKG1vZGVsKTtcblxuICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgIHRoaXMuc3dhcChtb2RlbCwgaW5kZXggLSAxKTtcbiAgICB9XG4gIH1cblxuICBtb3ZlRG93bihtb2RlbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhPZihtb2RlbCk7XG5cbiAgICBpZiAoaW5kZXggPCB0aGlzLm1vZGVscy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3dhcChtb2RlbCwgaW5kZXggKyAxKTtcbiAgICB9XG4gIH1cblxuICBzd2FwKG1vZGVsLCBuZXdJbmRleCkge1xuICAgIHRoaXMuZGVzdHJveShtb2RlbCk7XG4gICAgdGhpcy5jcmVhdGUobW9kZWwsIHthdDogbmV3SW5kZXh9KTtcblxuICAgIGxldCBuZXdPcmRlciA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgbmV3T3JkZXIucHVzaChpdGVtLmlkKTtcbiAgICB9KTtcblxuICAgIC8vIGZvciBzb21lIHJlYXNvbiBiYWNrYm9uZSBkb2Vzbid0IHNhdmUgcmVvcmRlcmluZyB0byBsb2NhbFN0b3JhZ2VcbiAgICB0aGlzLmxvY2FsU3RvcmFnZS5yZWNvcmRzID0gbmV3T3JkZXI7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2UubG9jYWxTdG9yYWdlKCkuc2V0SXRlbSgnYWxidW1zLWdpZ3MnLCBuZXdPcmRlcik7XG4gIH1cblxuICBkZXN0cm95KG1vZGVsKSB7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2UuZGVzdHJveShtb2RlbCk7XG4gICAgdGhpcy5yZW1vdmUobW9kZWwpO1xuXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEFsYnVtc0dpZ3NDb2xsZWN0aW9uKCk7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgQWxidW1zR2lnc0NvbGxlY3Rpb24gZnJvbSAnLi4vY29sbGVjdGlvbnMvQWxidW1zR2lncyc7XG5cbmZ1bmN0aW9uIGRlY2ltYWxQbGFjZXMobnVtKSB7XG4gIGxldCBtYXRjaCA9ICgnJyArIG51bSkubWF0Y2goLyg/OlxcLihcXGQrKSk/KD86W2VFXShbKy1dP1xcZCspKT8kLyk7XG4gIGlmICghbWF0Y2gpIHsgcmV0dXJuIDA7IH1cbiAgcmV0dXJuIE1hdGgubWF4KDAsIChtYXRjaFsxXSA/IG1hdGNoWzFdLmxlbmd0aCA6IDApIC0gKG1hdGNoWzJdID8gK21hdGNoWzJdIDogMCkpO1xufVxuXG5cbmNvbnN0IHZhbGlkYXRpb25SdWxlcyA9IHtcbiAgcHJpY2UodmFsdWUpIHtcbiAgICByZXR1cm4gIShpc05hTih2YWx1ZSkgfHwgZGVjaW1hbFBsYWNlcyh2YWx1ZSkgPiAyKTtcbiAgfVxufTtcblxuY2xhc3MgQWRkIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbmFtZTogJycsXG4gICAgICBwcmljZTogMFxuICAgIH07XG4gIH1cblxuICBoYW5kbGVTdWJtaXQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICghdGhpcy5zdGF0ZS5uYW1lIHx8ICF0aGlzLnN0YXRlLnByaWNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgQWxidW1zR2lnc0NvbGxlY3Rpb24uY3JlYXRlKHtcbiAgICAgIHRpdGxlOiB0aGlzLnN0YXRlLm5hbWUsXG4gICAgICBwcmljZTogdGhpcy5zdGF0ZS5wcmljZVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSgoc3RhdGUpID0+IHtcbiAgICAgIHN0YXRlLm5hbWUgPSAnJztcbiAgICAgIHN0YXRlLnByaWNlID0gMDtcblxuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH0sICgpID0+IHtcbiAgICAgIFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMucmVmcy5uYW1lSW5wdXQpLmZvY3VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UobmFtZSwgZSkge1xuICAgIGxldCB2YWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgaWYgKHZhbGlkYXRpb25SdWxlc1tuYW1lXSAmJiAhdmFsaWRhdGlvblJ1bGVzW25hbWVdKHZhbHVlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoKHN0YXRlKSA9PiBzdGF0ZVtuYW1lXSA9IHZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhZGQgY2xlYXJcIj5cbiAgICAgICAgPGgyPkFkZCBhIG5ldyBBbGJ1bS9HaWc8L2gyPlxuXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXsgdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKSB9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgYWRkX19uYW1lXCI+XG4gICAgICAgICAgICA8bGFiZWw+TmFtZTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgcmVmPVwibmFtZUlucHV0XCJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMsICduYW1lJykgfVxuICAgICAgICAgICAgICB2YWx1ZT17IHRoaXMuc3RhdGUubmFtZSB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZCBhZGRfX3ByaWNlXCI+XG4gICAgICAgICAgICA8bGFiZWw+UHJpY2U8L2xhYmVsPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWRkX19wcmljZV9fcG91bmRcIj7Cozwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ3ByaWNlJykgfVxuICAgICAgICAgICAgICB2YWx1ZT17IHRoaXMuc3RhdGUucHJpY2UgfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ1dHRvblwiXG4gICAgICAgICAgICB0eXBlPVwic3VibWl0XCI+XG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1wbHVzIGZhLWZ3XCIgLz5cbiAgICAgICAgICAgIEFkZFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFkZDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQWxidW1HaWdDb2xsZWN0aW9uIGZyb20gJy4uL2NvbGxlY3Rpb25zL0FsYnVtc0dpZ3MnO1xuXG5mdW5jdGlvbiBub3JtYWxpemVQcmljZShwcmljZSkge1xuICByZXR1cm4gKHByaWNlICogMSkudG9GaXhlZCgyKTtcbn1cblxuZnVuY3Rpb24gZ2V0T3JkaW5hbChuKSB7XG4gIGNvbnN0IHMgPSBbJ3RoJywnc3QnLCduZCcsJ3JkJ107XG4gIGNvbnN0IHYgPSBuICUgMTAwO1xuXG4gIHJldHVybiBuICsgKHNbKHYgLSAyMCkgJSAxMF0gfHwgc1t2XSB8fCBzWzBdKTtcbn1cblxuY2xhc3MgQWxidW1zR2lnc0xpc3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpdGVtczogW11cbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMuZGF0YS5mZXRjaCgpO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMuZGF0YS5vbignYWRkIGNoYW5nZSByZW1vdmUnLCB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMsIG51bGwpLCB0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMucHJvcHMuZGF0YS5vZmYobnVsbCwgbnVsbCwgdGhpcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5wcm9wcy5kYXRhLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGxldCB1cEFycm93ID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtZndcIiAvPjtcbiAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgdXBBcnJvdyA9IChcbiAgICAgICAgICA8aVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmEgZmEtY2hldnJvbi11cCBmYS1md1wiXG4gICAgICAgICAgICBvbkNsaWNrPXsgKCkgPT4gQWxidW1HaWdDb2xsZWN0aW9uLm1vdmVVcChpdGVtKSB9XG4gICAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBsZXQgZG93bkFycm93ID0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtZndcIiAvPjtcbiAgICAgIGlmIChpbmRleCA8IHRoaXMucHJvcHMuZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgIGRvd25BcnJvdyA9IChcbiAgICAgICAgICA8aVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmEgZmEtY2hldnJvbi1kb3duIGZhLWZ3XCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eyAoKSA9PiBBbGJ1bUdpZ0NvbGxlY3Rpb24ubW92ZURvd24oaXRlbSkgfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGxpXG4gICAgICAgICAga2V5PXsgaW5kZXggfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImFsYnVtcy1naWdzX19pdGVtIGNsZWFyXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWxidW1zLWdpZ3NfX2NvbHVtbiBhbGJ1bXMtZ2lnc19fY29sdW1uLS1uYW1lXCI+XG4gICAgICAgICAgICB7IGl0ZW0uZ2V0KCd0aXRsZScpIH1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWxidW1zLWdpZ3NfX2NvbHVtbiBhbGJ1bXMtZ2lnc19fY29sdW1uLS1wcmljZVwiPlxuICAgICAgICAgICAgwqN7IG5vcm1hbGl6ZVByaWNlKGl0ZW0uZ2V0KCdwcmljZScpKSB9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFsYnVtcy1naWdzX19jb2x1bW4gYWxidW1zLWdpZ3NfX2NvbHVtbi0tcHJlZmVyZW5jZVwiPlxuICAgICAgICAgICAgeyBkb3duQXJyb3cgfVxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWxidW1zLWdpZ3NfX251bWJlclwiPlxuICAgICAgICAgICAgICB7IGdldE9yZGluYWwoaW5kZXggKyAxKSB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7IHVwQXJyb3cgfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhbGJ1bXMtZ2lnc19fY29sdW1uIGFsYnVtcy1naWdzX19jb2x1bW4tLWRlbGV0ZVwiPlxuICAgICAgICAgICAgPGlcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmEgZmEtZncgZmEtdGltZXNcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsgKCkgPT4ge1xuICAgICAgICAgICAgICAgIEFsYnVtR2lnQ29sbGVjdGlvbi5kZXN0cm95KGl0ZW0pXG4gICAgICAgICAgICAgIH0gfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbGJ1bXMtZ2lnc19faGVhZGVyIGNsZWFyXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWxidW1zLWdpZ3NfX2NvbHVtbiBhbGJ1bXMtZ2lnc19fY29sdW1uLS1uYW1lXCI+XG4gICAgICAgICAgICBOYW1lXG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFsYnVtcy1naWdzX19jb2x1bW4gYWxidW1zLWdpZ3NfX2NvbHVtbi0tcHJpY2VcIj5cbiAgICAgICAgICAgIFByaWNlXG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFsYnVtcy1naWdzX19jb2x1bW4gYWxidW1zLWdpZ3NfX2NvbHVtbi0tcHJlZmVyZW5jZVwiPlxuICAgICAgICAgICAgUHJlZmVyZW5jZVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJhbGJ1bXMtZ2lnc19fbGlzdFwiPlxuICAgICAgICAgIHsgaXRlbXMgfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBbGJ1bXNHaWdzTGlzdDtcbiIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnYmFja2JvbmUnO1xuXG5jbGFzcyBBbGJ1bXNHaWdzTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBbGJ1bXNHaWdzTW9kZWw7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFsYnVtc0dpZ3NDb2xsZWN0aW9uIGZyb20gJy4uL2NvbGxlY3Rpb25zL0FsYnVtc0dpZ3MnO1xuXG5mdW5jdGlvbiBkZWNpbWFsUGxhY2VzKG51bSkge1xuICBsZXQgbWF0Y2ggPSAoJycgKyBudW0pLm1hdGNoKC8oPzpcXC4oXFxkKykpPyg/OltlRV0oWystXT9cXGQrKSk/JC8pO1xuICBpZiAoIW1hdGNoKSB7IHJldHVybiAwOyB9XG4gIHJldHVybiBNYXRoLm1heCgwLCAobWF0Y2hbMV0gPyBtYXRjaFsxXS5sZW5ndGggOiAwKSAtIChtYXRjaFsyXSA/ICttYXRjaFsyXSA6IDApKTtcbn1cblxuY2xhc3MgQWZmb3JkIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcHJpY2U6ICcnXG4gICAgfTtcblxuICAgIHRoaXMuY29sbGVjdGlvbiA9IEFsYnVtc0dpZ3NDb2xsZWN0aW9uO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5mZXRjaCgpO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5vbignYWRkIGNoYW5nZSByZW1vdmUnLCB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMsIG51bGwpLCB0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5vZmYobnVsbCwgbnVsbCwgdGhpcyk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIGxldCB2YWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xuXG4gICAgaWYgKGlzTmFOKHZhbHVlKSB8fCBkZWNpbWFsUGxhY2VzKHZhbHVlKSA+IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gc3RhdGUucHJpY2UgPSB2YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vbmV5TGVmdCA9ICh0aGlzLnN0YXRlLnByaWNlICogMSk7XG5cbiAgICBsZXQgaXRlbXMgPSBbXTtcblxuICAgIHRoaXMuY29sbGVjdGlvbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBsZXQgcHJpY2UgPSBpdGVtLmdldCgncHJpY2UnKSAqIDE7XG5cbiAgICAgIGlmIChwcmljZSA8PSBtb25leUxlZnQpIHtcbiAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgbW9uZXlMZWZ0IC09IHByaWNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IGFmZm9yZENvbnRlbnQ7XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCkge1xuICAgICAgbGV0IGFmZm9yZGFibGVJdGVtcyA9IGl0ZW1zLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICBsZXQgcHJpY2UgPSAoaXRlbS5nZXQoJ3ByaWNlJykgKiAxKS50b0ZpeGVkKDIpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxsaVxuICAgICAgICAgICAga2V5PXsgaXRlbS5pZCB9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJhZmZvcmRfX2l0ZW1cIj5cbiAgICAgICAgICAgIHsgaXRlbS5nZXQoJ3RpdGxlJykgfSAowqN7IHByaWNlIH0pXG4gICAgICAgICAgPC9saT5cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgd29yZGluZyA9IGl0ZW1zLmxlbmd0aCA9PT0gMSA/ICd0aGlzJyA6ICd0aGVzZSc7XG5cbiAgICAgIGFmZm9yZENvbnRlbnQgPSAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPHA+WW91IGNhbiBhZmZvcmQgeyB3b3JkaW5nIH0gd2l0aCDCo3sgbW9uZXlMZWZ0IH0gbGVmdCBvdmVyPC9wPlxuXG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImFmZm9yZF9fbGlzdFwiPlxuICAgICAgICAgICAgeyBhZmZvcmRhYmxlSXRlbXMgfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCAmJiB0aGlzLnN0YXRlLnByaWNlKSB7XG4gICAgICBhZmZvcmRDb250ZW50ID0gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxwPllvdSBjYW4ndCBhZmZvcmQgYW55dGhpbmcgOig8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhZmZvcmRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhZGQgY2xlYXJcIj5cbiAgICAgICAgICA8aDI+SG93IG11Y2ggZG8geW91IGhhdmUgdG8gc3BlbmQ/PC9oMj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQgYWZmb3JkX19wcmljZVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWRkX19wcmljZV9fcG91bmRcIj7Cozwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB2YWx1ZT17IHRoaXMuc3RhdGUucHJpY2UgfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcykgfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7IGFmZm9yZENvbnRlbnQgfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBZmZvcmQ7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgQWRkIGZyb20gJy4uL2NvbXBvbmVudHMvQWRkJztcbmltcG9ydCBBbGJ1bXNHaWdzTGlzdCBmcm9tICcuLi9jb21wb25lbnRzL0FsYnVtc0dpZ3NMaXN0JztcblxuaW1wb3J0IEFsYnVtc0dpZ3NDb2xsZWN0aW9uIGZyb20gJy4uL2NvbGxlY3Rpb25zL0FsYnVtc0dpZ3MnO1xuXG5jbGFzcyBBbGJ1bXNHaWdzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxidW1zLWdpZ3NcIj5cbiAgICAgICAgPEFkZCAvPlxuICAgICAgICA8QWxidW1zR2lnc0xpc3QgZGF0YT17IEFsYnVtc0dpZ3NDb2xsZWN0aW9uIH0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWxidW1zR2lncztcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgU2lkZWJhciBmcm9tICcuLi9wYXJ0aWFscy9TaWRlYmFyJztcblxuaW1wb3J0IEFsYnVtc0dpZ3MgZnJvbSAnLi9BbGJ1bXNHaWdzJztcbmltcG9ydCBBZmZvcmQgZnJvbSAnLi9BZmZvcmQnO1xuXG5jb25zdCBwYWdlcyA9IHtcbiAgYWxidW1HaWdzOiB7XG4gICAgY29tcG9uZW50OiA8QWxidW1zR2lncyAvPixcbiAgICB0aXRsZTogJ0FsYnVtcy9HaWdzJyxcbiAgICBpY29uOiAnZmEtbXVzaWMnXG4gIH0sXG4gIGFmZm9yZDoge1xuICAgIGNvbXBvbmVudDogPEFmZm9yZCAvPixcbiAgICB0aXRsZTogJ1doYXQgY2FuIEkgYWZmb3JkPycsXG4gICAgaWNvbjogJ2ZhLW1vbmV5J1xuICB9XG59O1xuXG5jbGFzcyBJbmRleCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBhZ2U6ICdhbGJ1bUdpZ3MnXG4gICAgfTtcbiAgfVxuXG4gIGhhbmRsZVBhZ2VDaGFuZ2UocGFnZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoKHN0YXRlKSA9PiBzdGF0ZS5wYWdlID0gcGFnZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGFjdGl2ZVBhZ2UgPSBwYWdlc1t0aGlzLnN0YXRlLnBhZ2VdLmNvbXBvbmVudDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cbiAgICAgICAgPFNpZGViYXJcbiAgICAgICAgICBwYWdlcz17IHBhZ2VzIH1cbiAgICAgICAgICBjdXJyZW50UGFnZT17IHRoaXMuc3RhdGUucGFnZSB9XG4gICAgICAgICAgb25QYWdlQ2hhbmdlPXsgdGhpcy5oYW5kbGVQYWdlQ2hhbmdlLmJpbmQodGhpcykgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudF9fcGFkZGluZ1wiPlxuICAgICAgICAgIHsgYWN0aXZlUGFnZSB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbmRleDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuY2xhc3MgSW5kZXggZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgeyBwYWdlcywgY3VycmVudFBhZ2UgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBsZXQgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGxldCBpIGluIHBhZ2VzKSB7XG4gICAgICBsZXQgcGFnZSA9IHBhZ2VzW2ldO1xuXG4gICAgICBsZXQgcGFnZUNsYXNzZXMgPSBjbGFzc25hbWVzKFxuICAgICAgICAnc2lkZWJhcl9faXRlbScsXG4gICAgICAgIHtcbiAgICAgICAgICAnc2lkZWJhcl9faXRlbS0tYWN0aXZlJzogY3VycmVudFBhZ2UgPT09IGlcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgaXRlbXMucHVzaChcbiAgICAgICAgPGxpXG4gICAgICAgICAga2V5PXsgaSB9XG4gICAgICAgICAgY2xhc3NOYW1lPXsgcGFnZUNsYXNzZXMgfVxuICAgICAgICAgIG9uQ2xpY2s9eyAoKSA9PiB0aGlzLnByb3BzLm9uUGFnZUNoYW5nZShpKSB9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT17ICdmYSBmYS1mdyAnICsgcGFnZS5pY29uIH0gLz5cbiAgICAgICAgICB7IHBhZ2UudGl0bGUgfVxuICAgICAgICA8L2xpPlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8YXNpZGUgY2xhc3NOYW1lPVwic2lkZWJhclwiPlxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwic2lkZWJhcl9fbGlzdFwiPlxuICAgICAgICAgIHsgaXRlbXMgfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9hc2lkZT5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4O1xuIl19
