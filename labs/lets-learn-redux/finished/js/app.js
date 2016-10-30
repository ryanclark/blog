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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchMovies = searchMovies;
var API_URL = 'https://api.themoviedb.org/3/';
var API_KEY = 'fe1bd2271fb46847deb6906b2e0f1009';

var RECEIVE_MOVIES = exports.RECEIVE_MOVIES = 'RECEIVE_MOVIES';
var LOAD_MOVIES = exports.LOAD_MOVIES = 'LOAD_MOVIES';
var CANCEL_MOVIES = exports.CANCEL_MOVIES = 'CANCEL_MOVIES';

function buildURL(endpoint, query) {
  return API_URL + endpoint + query + '&api_key=' + API_KEY;
}

function loadingMovies(text) {
  return {
    type: LOAD_MOVIES,
    text: text
  };
}

function receiveMovies(text, json) {
  return {
    type: RECEIVE_MOVIES,
    text: text,
    movies: json.results
  };
}

function cancelMovies() {
  return {
    type: CANCEL_MOVIES
  };
}

function searchMovies(text) {
  return function (dispatch) {
    if (!text) {
      return dispatch(cancelMovies());
    }

    dispatch(loadingMovies(text));

    return fetch(buildURL('search/movie', '?query=' + text)).then(function (res) {
      return res.json();
    }).then(function (json) {
      return dispatch(receiveMovies(text, json));
    });
  };
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.remove = remove;
var WATCHLATER_ADD = exports.WATCHLATER_ADD = 'WATCHLATER_ADD';
var WATCHLATER_REMOVE = exports.WATCHLATER_REMOVE = 'WATCHLATER_REMOVE';

function add(movie) {
  return {
    type: WATCHLATER_ADD,
    movie: movie
  };
}

function remove(id) {
  return {
    type: WATCHLATER_REMOVE,
    id: id
  };
}

},{}],4:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _config = require('./store/config');

var _config2 = _interopRequireDefault(_config);

var _App = require('./containers/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _config2.default)();

(0, _reactDom.render)(_react2.default.createElement(
  _reactRedux.Provider,
  { store: store },
  _react2.default.createElement(_App2.default, null)
), document.querySelector('.app'));

},{"./containers/App":9,"./store/config":14,"react":"react","react-dom":"react-dom","react-redux":"react-redux"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Movie = function (_Component) {
  _inherits(Movie, _Component);

  function Movie(props) {
    _classCallCheck(this, Movie);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Movie).call(this, props));
  }

  _createClass(Movie, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var item = _props.item;
      var icon = _props.icon;
      var text = _props.text;


      if (!item.poster_path) return null;

      var year = item.release_date.split('-')[0];
      var classes = (0, _classnames2.default)('fa', icon);

      return _react2.default.createElement(
        'div',
        { className: 'movie', key: item.id, onClick: this.props.onClick },
        _react2.default.createElement('img', {
          src: 'https://image.tmdb.org/t/p/w370' + item.poster_path
        }),
        _react2.default.createElement(
          'div',
          { className: 'movie__info' },
          item.title,
          ' ',
          _react2.default.createElement(
            'small',
            null,
            '(',
            year,
            ')'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'movie__overlay' },
          _react2.default.createElement(
            'div',
            { className: 'movie__overlay__text' },
            _react2.default.createElement('i', { className: classes }),
            text
          )
        )
      );
    }
  }]);

  return Movie;
}(_react.Component);

exports.default = Movie;

},{"classnames":1,"react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Movie = require('./Movie');

var _Movie2 = _interopRequireDefault(_Movie);

var _watchLater = require('../actions/watchLater');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieList = function (_Component) {
  _inherits(MovieList, _Component);

  function MovieList(props) {
    _classCallCheck(this, MovieList);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MovieList).call(this, props));
  }

  _createClass(MovieList, [{
    key: 'addMovieToWatchLater',
    value: function addMovieToWatchLater(item) {
      var dispatch = this.props.dispatch;


      dispatch((0, _watchLater.add)(item));
    }
  }, {
    key: 'renderMovie',
    value: function renderMovie(item) {
      var _this2 = this;

      if (!item.poster_path) return null;

      var watchLater = this.props.watchLater;


      var exists = watchLater.filter(function (movie) {
        return movie.id === item.id;
      }).length > 0;
      var classes = (0, _classnames2.default)('movie-list__item', {
        'movie-list__item--watch-later': exists
      });

      return _react2.default.createElement(
        'li',
        {
          key: item.id,
          className: classes },
        _react2.default.createElement(_Movie2.default, {
          item: item,
          icon: 'fa-star',
          text: 'Add to Watch Later',
          onClick: function onClick() {
            return _this2.addMovieToWatchLater(item);
          }
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var data = this.props.data;


      var list = data.map(function (item) {
        return _this3.renderMovie(item);
      });

      return _react2.default.createElement(
        'ul',
        { className: 'movie-list' },
        list
      );
    }
  }]);

  return MovieList;
}(_react.Component);

exports.default = MovieList;

},{"../actions/watchLater":3,"./Movie":5,"classnames":1,"react":"react","redux":"redux"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = function (_Component) {
  _inherits(Search, _Component);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Search).call(this, props));

    _this.state = {
      value: ''
    };
    return _this;
  }

  _createClass(Search, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      (0, _reactDom.findDOMNode)(this.refs.input).focus();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      var value = e.target.value;

      this.setState(function (state) {
        return state.value = value;
      });

      var searchMovies = this.props.searchMovies;


      clearTimeout(this.search);
      this.search = setTimeout(function () {
        return searchMovies(value);
      }, 300);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'search' },
        _react2.default.createElement('input', {
          ref: 'input',
          onChange: function onChange(e) {
            return _this2.handleChange(e);
          },
          value: this.state.value,
          className: 'search__input',
          placeholder: 'Search for movies by title..'
        })
      );
    }
  }]);

  return Search;
}(_react.Component);

exports.default = Search;

},{"react":"react","react-dom":"react-dom"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _Movie = require('./Movie');

var _Movie2 = _interopRequireDefault(_Movie);

var _watchLater = require('../actions/watchLater');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WatchLater = function (_Component) {
  _inherits(WatchLater, _Component);

  function WatchLater(props) {
    _classCallCheck(this, WatchLater);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(WatchLater).call(this, props));
  }

  _createClass(WatchLater, [{
    key: 'removeItem',
    value: function removeItem(id) {
      var dispatch = this.props.dispatch;


      dispatch((0, _watchLater.remove)(id));
    }
  }, {
    key: 'renderMovie',
    value: function renderMovie(item) {
      var _this2 = this;

      return _react2.default.createElement(
        'li',
        { className: 'watch-later__item', key: item.id },
        _react2.default.createElement(_Movie2.default, {
          icon: 'fa-trash-o',
          text: 'Remove',
          onClick: function onClick() {
            return _this2.removeItem(item.id);
          },
          item: item
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var watchLater = this.props.watchLater;


      var list = watchLater.map(function (item) {
        return _this3.renderMovie(item);
      });

      var badge = undefined;
      if (watchLater.length) {
        badge = _react2.default.createElement(
          'span',
          { className: 'watch-later__badge' },
          watchLater.length
        );
      } else {
        list = _react2.default.createElement(
          'div',
          null,
          'No movies saved to watch later!'
        );
      }

      return _react2.default.createElement(
        'div',
        { className: 'watch-later' },
        _react2.default.createElement(
          'div',
          { className: 'watch-later__title' },
          _react2.default.createElement('i', { className: 'fa fa-clock-o' }),
          'Watch Later ',
          badge,
          _react2.default.createElement('i', { className: 'fa fa-caret-down' }),
          _react2.default.createElement('i', { className: 'fa fa-caret-up' })
        ),
        _react2.default.createElement(
          'ul',
          { className: 'watch-later__dropdown' },
          list
        )
      );
    }
  }]);

  return WatchLater;
}(_react.Component);

function mapStateToProps(_ref) {
  var watchLater = _ref.watchLater;

  return {
    watchLater: watchLater
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(WatchLater);

},{"../actions/watchLater":3,"./Movie":5,"react":"react","react-redux":"react-redux"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _movie = require('../actions/movie');

var MovieActions = _interopRequireWildcard(_movie);

var _Search = require('../components/Search');

var _Search2 = _interopRequireDefault(_Search);

var _MovieList = require('../components/MovieList');

var _MovieList2 = _interopRequireDefault(_MovieList);

var _Header = require('../partials/Header');

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var dispatch = _props.dispatch;
      var movies = _props.movies;
      var watchLater = _props.watchLater;


      var list = undefined;
      if (movies.loading) {
        list = _react2.default.createElement(
          'div',
          { className: 'loading' },
          _react2.default.createElement('i', { className: 'fa fa-spin fa-refresh' }),
          'Loading..'
        );
      } else if (movies.text) {
        if (movies.list.length) {
          list = _react2.default.createElement(_MovieList2.default, {
            dispatch: dispatch,
            watchLater: watchLater,
            data: movies.list });
        } else {
          list = _react2.default.createElement(
            'div',
            { className: 'loading' },
            'No results for ',
            movies.text
          );
        }
      }

      var movieActions = (0, _redux.bindActionCreators)(MovieActions, dispatch);
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Header2.default, null),
        _react2.default.createElement(
          'div',
          { className: 'container' },
          _react2.default.createElement(
            'div',
            { className: 'container__search' },
            _react2.default.createElement(_Search2.default, movieActions)
          ),
          _react2.default.createElement(
            'div',
            { className: 'container__list' },
            list
          )
        )
      );
    }
  }]);

  return App;
}(_react.Component);

function mapStateToProps(state) {
  return state;
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(App);

},{"../actions/movie":2,"../components/MovieList":6,"../components/Search":7,"../partials/Header":10,"react":"react","react-redux":"react-redux","redux":"redux"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _WatchLater = require('../components/WatchLater');

var _WatchLater2 = _interopRequireDefault(_WatchLater);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_Component) {
  _inherits(Header, _Component);

  function Header(props) {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Header).call(this, props));
  }

  _createClass(Header, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'header',
        { className: 'header' },
        _react2.default.createElement(
          'div',
          { className: 'header__fixed' },
          _react2.default.createElement(
            'div',
            { className: 'header__logo' },
            'MovieSearch'
          ),
          _react2.default.createElement(
            'div',
            { className: 'header__watch-later' },
            _react2.default.createElement(_WatchLater2.default, null)
          )
        )
      );
    }
  }]);

  return Header;
}(_react.Component);

exports.default = Header;

},{"../components/WatchLater":8,"react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _movies = require('./movies');

var _movies2 = _interopRequireDefault(_movies);

var _watchLater = require('./watchLater');

var _watchLater2 = _interopRequireDefault(_watchLater);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)({
  movies: _movies2.default,
  watchLater: _watchLater2.default
});

exports.default = rootReducer;

},{"./movies":12,"./watchLater":13,"redux":"redux"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = movies;

var _movie = require('../actions/movie');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  loading: false,
  list: []
};

function movies() {
  var _actions;

  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  console.log(state, action);

  var actions = (_actions = {}, _defineProperty(_actions, _movie.RECEIVE_MOVIES, function () {
    return Object.assign({}, state, {
      loading: false,
      list: action.movies,
      text: action.text
    });
  }), _defineProperty(_actions, _movie.LOAD_MOVIES, function () {
    return Object.assign({}, state, {
      loading: true,
      text: action.text
    });
  }), _defineProperty(_actions, _movie.CANCEL_MOVIES, function () {
    return Object.assign({}, state, {
      loading: false,
      list: [],
      text: false
    });
  }), _actions);

  if (actions[action.type]) {
    return actions[action.type]();
  }

  return state;
}

},{"../actions/movie":2}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = watchLater;

var _watchLater = require('../actions/watchLater');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = [];

function watchLater() {
  var _actions;

  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  var actions = (_actions = {}, _defineProperty(_actions, _watchLater.WATCHLATER_ADD, function () {
    var exists = state.filter(function (movie) {
      return movie.id === action.movie.id;
    }).length > 0;

    if (!exists) {
      return [action.movie].concat(_toConsumableArray(state));
    }

    return state;
  }), _defineProperty(_actions, _watchLater.WATCHLATER_REMOVE, function () {
    return state.filter(function (movie) {
      return movie.id !== action.id;
    });
  }), _actions);

  if (actions[action.type]) {
    return actions[action.type]();
  }

  return state;
}

},{"../actions/watchLater":3}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureStore(initialState) {
  var store = (0, _redux.createStore)(_reducers2.default, initialState, (0, _redux.applyMiddleware)(_reduxThunk2.default, (0, _reduxLogger2.default)()));

  return store;
}

},{"../reducers":11,"redux":"redux","redux-logger":"redux-logger","redux-thunk":"redux-thunk"}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsInNyYy9qcy9hY3Rpb25zL21vdmllLmpzIiwic3JjL2pzL2FjdGlvbnMvd2F0Y2hMYXRlci5qcyIsInNyYy9qcy9hcHAuanMiLCJzcmMvanMvY29tcG9uZW50cy9Nb3ZpZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL01vdmllTGlzdC5qcyIsInNyYy9qcy9jb21wb25lbnRzL1NlYXJjaC5qcyIsInNyYy9qcy9jb21wb25lbnRzL1dhdGNoTGF0ZXIuanMiLCJzcmMvanMvY29udGFpbmVycy9BcHAuanMiLCJzcmMvanMvcGFydGlhbHMvSGVhZGVyLmpzIiwic3JjL2pzL3JlZHVjZXJzL2luZGV4LmpzIiwic3JjL2pzL3JlZHVjZXJzL21vdmllcy5qcyIsInNyYy9qcy9yZWR1Y2Vycy93YXRjaExhdGVyLmpzIiwic3JjL2pzL3N0b3JlL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1FDaEJnQjtBQWhDaEIsSUFBTSxVQUFVLCtCQUFWO0FBQ04sSUFBTSxVQUFVLGtDQUFWOztBQUVDLElBQU0sMENBQWlCLGdCQUFqQjtBQUNOLElBQU0sb0NBQWMsYUFBZDtBQUNOLElBQU0sd0NBQWdCLGVBQWhCOztBQUViLFNBQVMsUUFBVCxDQUFrQixRQUFsQixFQUE0QixL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LEtBQWEsT0FBTyxLQUFQLENBQWEsRUFBYjtLQUF4QixDQUFiLENBQXNELE1BQXRELEdBQStELENBQS9ELENBREU7O0FBR2pCLFFBQUksQ0FBQyxNQUFELEVBQVM7QUFDWCxjQUFRLE9BQU8sS0FBUCw0QkFBaUIsT0FBekIsQ0FEVztLQUFiOztBQUlBLFdBQU8sS0FBUCxDQVBpQjsyRUFTRztBQUNwQixXQUFPLE1BQU0sTUFBTixDQUFhLFVBQUMsS0FBRDthQUFXLE1BQU0sRUFBTixLQUFhLE9BQU8sRUFBUDtLQUF4QixDQUFwQixDQURvQjtlQVZsQixDQUR5RDs7QUFnQi9ELE1BQUksUUFBUSxPQUFPLElBQVAsQ0FBWixFQUEwQjtBQUN4QixXQUFPLFFBQVEsT0FBTyxJQUFQLENBQVIsRUFBUCxDQUR3QjtHQUExQjs7QUFJQSxTQUFPLEtBQVAsQ0FwQitEO0NBQWxEOzs7Ozs7OztrQkNEUzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQVQsU0FBUyxjQUFULENBQXdCLFlBQXhCLEVBQXNDO0FBQ25ELE1BQU0sUUFBUSw0Q0FFWixZQUZZLEVBR1osa0RBQWlDLDRCQUFqQyxDQUhZLENBQVIsQ0FENkM7O0FBT25ELFNBQU8sS0FBUCxDQVBtRDtDQUF0QyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE2IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzLnB1c2goYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZykpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGtleSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsImNvbnN0IEFQSV9VUkwgPSAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy8nO1xuY29uc3QgQVBJX0tFWSA9ICdmZTFiZDIyNzFmYjQ2ODQ3ZGViNjkwNmIyZTBmMTAwOSc7XG5cbmV4cG9ydCBjb25zdCBSRUNFSVZFX01PVklFUyA9ICdSRUNFSVZFX01PVklFUyc7XG5leHBvcnQgY29uc3QgTE9BRF9NT1ZJRVMgPSAnTE9BRF9NT1ZJRVMnO1xuZXhwb3J0IGNvbnN0IENBTkNFTF9NT1ZJRVMgPSAnQ0FOQ0VMX01PVklFUyc7XG5cbmZ1bmN0aW9uIGJ1aWxkVVJMKGVuZHBvaW50LCBxdWVyeSkge1xuICByZXR1cm4gQVBJX1VSTCArIGVuZHBvaW50ICsgcXVlcnkgKyAnJmFwaV9rZXk9JyArIEFQSV9LRVk7XG59XG5cbmZ1bmN0aW9uIGxvYWRpbmdNb3ZpZXModGV4dCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IExPQURfTU9WSUVTLFxuICAgIHRleHRcbiAgfVxufVxuXG5mdW5jdGlvbiByZWNlaXZlTW92aWVzKHRleHQsIGpzb24pIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBSRUNFSVZFX01PVklFUyxcbiAgICB0ZXh0LFxuICAgIG1vdmllczoganNvbi5yZXN1bHRzXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FuY2VsTW92aWVzKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IENBTkNFTF9NT1ZJRVNcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoTW92aWVzKHRleHQpIHtcbiAgcmV0dXJuIChkaXNwYXRjaCkgPT4ge1xuICAgIGlmICghdGV4dCkge1xuICAgICAgcmV0dXJuIGRpc3BhdGNoKGNhbmNlbE1vdmllcygpKTtcbiAgICB9XG5cbiAgICBkaXNwYXRjaChsb2FkaW5nTW92aWVzKHRleHQpKTtcblxuICAgIHJldHVybiBmZXRjaChidWlsZFVSTCgnc2VhcmNoL21vdmllJywgJz9xdWVyeT0nICsgdGV4dCkpXG4gICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgIC50aGVuKGpzb24gPT4gZGlzcGF0Y2gocmVjZWl2ZU1vdmllcyh0ZXh0LCBqc29uKSkpO1xuICB9O1xufVxuIiwiZXhwb3J0IGNvbnN0IFdBVENITEFURVJfQUREID0gJ1dBVENITEFURVJfQUREJztcbmV4cG9ydCBjb25zdCBXQVRDSExBVEVSX1JFTU9WRSA9ICdXQVRDSExBVEVSX1JFTU9WRSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGQobW92aWUpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBXQVRDSExBVEVSX0FERCxcbiAgICBtb3ZpZVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBXQVRDSExBVEVSX1JFTU9WRSxcbiAgICBpZFxuICB9XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5pbXBvcnQgc3RvcmVDb25maWcgZnJvbSAnLi9zdG9yZS9jb25maWcnO1xuaW1wb3J0IEFwcCBmcm9tICcuL2NvbnRhaW5lcnMvQXBwJztcblxuY29uc3Qgc3RvcmUgPSBzdG9yZUNvbmZpZygpO1xuXG5yZW5kZXIoXG4gIDxQcm92aWRlciBzdG9yZT17IHN0b3JlIH0+XG4gICAgPEFwcCAvPlxuICA8L1Byb3ZpZGVyPixcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFwcCcpXG4pO1xuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5jbGFzcyBNb3ZpZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgaXRlbSwgaWNvbiwgdGV4dCB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghaXRlbS5wb3N0ZXJfcGF0aCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCB5ZWFyID0gaXRlbS5yZWxlYXNlX2RhdGUuc3BsaXQoJy0nKVswXTtcbiAgICBjb25zdCBjbGFzc2VzID0gY2xhc3NuYW1lcygnZmEnLCBpY29uKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vdmllXCIga2V5PXsgaXRlbS5pZCB9IG9uQ2xpY2s9eyB0aGlzLnByb3BzLm9uQ2xpY2sgfT5cbiAgICAgICAgPGltZ1xuICAgICAgICAgIHNyYz17ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MzcwJyArIGl0ZW0ucG9zdGVyX3BhdGggfVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vdmllX19pbmZvXCI+XG4gICAgICAgICAgeyBpdGVtLnRpdGxlIH0gPHNtYWxsPih7IHllYXIgfSk8L3NtYWxsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb3ZpZV9fb3ZlcmxheVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW92aWVfX292ZXJsYXlfX3RleHRcIj5cbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17IGNsYXNzZXMgfSAvPlxuXG4gICAgICAgICAgICB7IHRleHQgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW92aWU7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgYmluZEFjdGlvbkNyZWF0b3JzIH0gZnJvbSAncmVkdXgnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBNb3ZpZSBmcm9tICcuL01vdmllJztcblxuaW1wb3J0IHsgYWRkIGFzIGFkZFRvV2F0Y2hMYXRlciB9IGZyb20gJy4uL2FjdGlvbnMvd2F0Y2hMYXRlcic7XG5cbmNsYXNzIE1vdmllTGlzdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgYWRkTW92aWVUb1dhdGNoTGF0ZXIoaXRlbSkge1xuICAgIGNvbnN0IHsgZGlzcGF0Y2ggfSA9IHRoaXMucHJvcHM7XG5cbiAgICBkaXNwYXRjaChhZGRUb1dhdGNoTGF0ZXIoaXRlbSkpO1xuICB9XG5cbiAgcmVuZGVyTW92aWUoaXRlbSkge1xuICAgIGlmICghaXRlbS5wb3N0ZXJfcGF0aCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCB7IHdhdGNoTGF0ZXIgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBleGlzdHMgPSB3YXRjaExhdGVyLmZpbHRlcigobW92aWUpID0+IG1vdmllLmlkID09PSBpdGVtLmlkKS5sZW5ndGggPiAwO1xuICAgIGNvbnN0IGNsYXNzZXMgPSBjbGFzc25hbWVzKCdtb3ZpZS1saXN0X19pdGVtJywge1xuICAgICAgJ21vdmllLWxpc3RfX2l0ZW0tLXdhdGNoLWxhdGVyJzogZXhpc3RzXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGxpXG4gICAgICAgIGtleT17IGl0ZW0uaWQgfVxuICAgICAgICBjbGFzc05hbWU9eyBjbGFzc2VzIH0+XG4gICAgICAgIDxNb3ZpZVxuICAgICAgICAgIGl0ZW09eyBpdGVtIH1cbiAgICAgICAgICBpY29uPVwiZmEtc3RhclwiXG4gICAgICAgICAgdGV4dD1cIkFkZCB0byBXYXRjaCBMYXRlclwiXG4gICAgICAgICAgb25DbGljaz17ICgpID0+IHRoaXMuYWRkTW92aWVUb1dhdGNoTGF0ZXIoaXRlbSkgfVxuICAgICAgICAgIC8+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgbGlzdCA9IGRhdGEubWFwKChpdGVtKSA9PiB0aGlzLnJlbmRlck1vdmllKGl0ZW0pKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8dWwgY2xhc3NOYW1lPVwibW92aWUtbGlzdFwiPlxuICAgICAgICB7IGxpc3QgfVxuICAgICAgPC91bD5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vdmllTGlzdDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBmaW5kRE9NTm9kZSB9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmNsYXNzIFNlYXJjaCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHZhbHVlOiAnJ1xuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBmaW5kRE9NTm9kZSh0aGlzLnJlZnMuaW5wdXQpLmZvY3VzKCk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIGNvbnN0IHZhbHVlID0gZS50YXJnZXQudmFsdWU7XG5cbiAgICB0aGlzLnNldFN0YXRlKChzdGF0ZSkgPT4gc3RhdGUudmFsdWUgPSB2YWx1ZSk7XG5cbiAgICBjb25zdCB7IHNlYXJjaE1vdmllcyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLnNlYXJjaCk7XG4gICAgdGhpcy5zZWFyY2ggPSBzZXRUaW1lb3V0KCgpID0+IHNlYXJjaE1vdmllcyh2YWx1ZSksIDMwMCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VhcmNoXCI+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlZj1cImlucHV0XCJcbiAgICAgICAgICBvbkNoYW5nZT17IChlKSA9PiB0aGlzLmhhbmRsZUNoYW5nZShlKSB9XG4gICAgICAgICAgdmFsdWU9eyB0aGlzLnN0YXRlLnZhbHVlIH1cbiAgICAgICAgICBjbGFzc05hbWU9XCJzZWFyY2hfX2lucHV0XCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBmb3IgbW92aWVzIGJ5IHRpdGxlLi5cIlxuICAgICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlYXJjaDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuXG5pbXBvcnQgTW92aWUgZnJvbSAnLi9Nb3ZpZSc7XG5cbmltcG9ydCB7IHJlbW92ZSBhcyByZW1vdmVGcm9tV2F0Y2hMYXRlciB9IGZyb20gJy4uL2FjdGlvbnMvd2F0Y2hMYXRlcic7XG5cbmNsYXNzIFdhdGNoTGF0ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbW92ZUl0ZW0oaWQpIHtcbiAgICBjb25zdCB7IGRpc3BhdGNoIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgZGlzcGF0Y2gocmVtb3ZlRnJvbVdhdGNoTGF0ZXIoaWQpKTtcbiAgfVxuXG4gIHJlbmRlck1vdmllKGl0ZW0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpIGNsYXNzTmFtZT1cIndhdGNoLWxhdGVyX19pdGVtXCIga2V5PXsgaXRlbS5pZCB9PlxuICAgICAgICA8TW92aWVcbiAgICAgICAgICBpY29uPVwiZmEtdHJhc2gtb1wiXG4gICAgICAgICAgdGV4dD1cIlJlbW92ZVwiXG4gICAgICAgICAgb25DbGljaz17ICgpID0+IHRoaXMucmVtb3ZlSXRlbShpdGVtLmlkKSB9XG4gICAgICAgICAgaXRlbT17IGl0ZW0gfVxuICAgICAgICAgIC8+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB3YXRjaExhdGVyIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgbGV0IGxpc3QgPSB3YXRjaExhdGVyLm1hcCgoaXRlbSkgPT4gdGhpcy5yZW5kZXJNb3ZpZShpdGVtKSk7XG5cbiAgICBsZXQgYmFkZ2U7XG4gICAgaWYgKHdhdGNoTGF0ZXIubGVuZ3RoKSB7XG4gICAgICBiYWRnZSA9IDxzcGFuIGNsYXNzTmFtZT1cIndhdGNoLWxhdGVyX19iYWRnZVwiPnsgd2F0Y2hMYXRlci5sZW5ndGggfTwvc3Bhbj47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3QgPSA8ZGl2Pk5vIG1vdmllcyBzYXZlZCB0byB3YXRjaCBsYXRlciE8L2Rpdj47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0Y2gtbGF0ZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRjaC1sYXRlcl9fdGl0bGVcIj5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jbG9jay1vXCIgLz5cbiAgICAgICAgICBXYXRjaCBMYXRlciB7IGJhZGdlIH1cblxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNhcmV0LWRvd25cIiAvPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNhcmV0LXVwXCIgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cIndhdGNoLWxhdGVyX19kcm9wZG93blwiPlxuICAgICAgICAgIHsgbGlzdCB9XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyh7IHdhdGNoTGF0ZXIgfSkge1xuICByZXR1cm4ge1xuICAgIHdhdGNoTGF0ZXJcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMpKFdhdGNoTGF0ZXIpO1xuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGJpbmRBY3Rpb25DcmVhdG9ycyB9IGZyb20gJ3JlZHV4JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmltcG9ydCAqIGFzIE1vdmllQWN0aW9ucyBmcm9tICcuLi9hY3Rpb25zL21vdmllJztcblxuaW1wb3J0IFNlYXJjaCBmcm9tICcuLi9jb21wb25lbnRzL1NlYXJjaCc7XG5pbXBvcnQgTW92aWVMaXN0IGZyb20gJy4uL2NvbXBvbmVudHMvTW92aWVMaXN0JztcblxuaW1wb3J0IEhlYWRlciBmcm9tICcuLi9wYXJ0aWFscy9IZWFkZXInO1xuXG5jbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGRpc3BhdGNoLCBtb3ZpZXMsIHdhdGNoTGF0ZXIgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBsZXQgbGlzdDtcbiAgICBpZiAobW92aWVzLmxvYWRpbmcpIHtcbiAgICAgIGxpc3QgPSAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibG9hZGluZ1wiPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXNwaW4gZmEtcmVmcmVzaFwiIC8+XG4gICAgICAgICAgTG9hZGluZy4uXG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKG1vdmllcy50ZXh0KSB7XG4gICAgICBpZiAobW92aWVzLmxpc3QubGVuZ3RoKSB7XG4gICAgICAgIGxpc3QgPSAoXG4gICAgICAgICAgPE1vdmllTGlzdFxuICAgICAgICAgICAgZGlzcGF0Y2g9eyBkaXNwYXRjaCB9XG4gICAgICAgICAgICB3YXRjaExhdGVyPXsgd2F0Y2hMYXRlciB9XG4gICAgICAgICAgICBkYXRhPXsgbW92aWVzLmxpc3QgfSAvPlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdCA9IDxkaXYgY2xhc3NOYW1lPVwibG9hZGluZ1wiPk5vIHJlc3VsdHMgZm9yIHsgbW92aWVzLnRleHQgfTwvZGl2PjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtb3ZpZUFjdGlvbnMgPSBiaW5kQWN0aW9uQ3JlYXRvcnMoTW92aWVBY3Rpb25zLCBkaXNwYXRjaCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxIZWFkZXIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lcl9fc2VhcmNoXCI+XG4gICAgICAgICAgICA8U2VhcmNoIHsuLi5tb3ZpZUFjdGlvbnN9IC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lcl9fbGlzdFwiPlxuICAgICAgICAgICAgeyBsaXN0IH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChtYXBTdGF0ZVRvUHJvcHMpKEFwcCk7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgV2F0Y2hMYXRlciBmcm9tICcuLi9jb21wb25lbnRzL1dhdGNoTGF0ZXInO1xuXG5jbGFzcyBIZWFkZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJoZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJfX2ZpeGVkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkZXJfX2xvZ29cIj5cbiAgICAgICAgICAgIE1vdmllU2VhcmNoXG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRlcl9fd2F0Y2gtbGF0ZXJcIj5cbiAgICAgICAgICAgIDxXYXRjaExhdGVyIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWFkZXI7XG4iLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XG5cbmltcG9ydCBtb3ZpZXMgZnJvbSAnLi9tb3ZpZXMnO1xuaW1wb3J0IHdhdGNoTGF0ZXIgZnJvbSAnLi93YXRjaExhdGVyJztcblxuY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuICBtb3ZpZXMsXG4gIHdhdGNoTGF0ZXJcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCByb290UmVkdWNlcjtcbiIsImltcG9ydCB7XG4gIFJFQ0VJVkVfTU9WSUVTLCBMT0FEX01PVklFUyxcbiAgQ0FOQ0VMX01PVklFU1xufSBmcm9tICcuLi9hY3Rpb25zL21vdmllJztcblxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xuICBsb2FkaW5nOiBmYWxzZSxcbiAgbGlzdDogW11cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1vdmllcyhzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnNvbGUubG9nKHN0YXRlLCBhY3Rpb24pO1xuXG4gIGNvbnN0IGFjdGlvbnMgPSB7XG4gICAgW1JFQ0VJVkVfTU9WSUVTXSgpIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbGlzdDogYWN0aW9uLm1vdmllcyxcbiAgICAgICAgdGV4dDogYWN0aW9uLnRleHRcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgW0xPQURfTU9WSUVTXSgpIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xuICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICB0ZXh0OiBhY3Rpb24udGV4dFxuICAgICAgfSk7XG4gICAgfSxcbiAgICBbQ0FOQ0VMX01PVklFU10oKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxpc3Q6IFtdLFxuICAgICAgICB0ZXh0OiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGlmIChhY3Rpb25zW2FjdGlvbi50eXBlXSkge1xuICAgIHJldHVybiBhY3Rpb25zW2FjdGlvbi50eXBlXSgpO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuIiwiaW1wb3J0IHtcbiAgV0FUQ0hMQVRFUl9BREQsIFdBVENITEFURVJfUkVNT1ZFXG59IGZyb20gJy4uL2FjdGlvbnMvd2F0Y2hMYXRlcic7XG5cbmNvbnN0IGluaXRpYWxTdGF0ZSA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3YXRjaExhdGVyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3QgYWN0aW9ucyA9IHtcbiAgICBbV0FUQ0hMQVRFUl9BRERdKCkge1xuICAgICAgY29uc3QgZXhpc3RzID0gc3RhdGUuZmlsdGVyKChtb3ZpZSkgPT4gbW92aWUuaWQgPT09IGFjdGlvbi5tb3ZpZS5pZCkubGVuZ3RoID4gMDtcblxuICAgICAgaWYgKCFleGlzdHMpIHtcbiAgICAgICAgcmV0dXJuIFthY3Rpb24ubW92aWUsIC4uLnN0YXRlXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH0sXG4gICAgW1dBVENITEFURVJfUkVNT1ZFXSgpIHtcbiAgICAgIHJldHVybiBzdGF0ZS5maWx0ZXIoKG1vdmllKSA9PiBtb3ZpZS5pZCAhPT0gYWN0aW9uLmlkKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKGFjdGlvbnNbYWN0aW9uLnR5cGVdKSB7XG4gICAgcmV0dXJuIGFjdGlvbnNbYWN0aW9uLnR5cGVdKCk7XG4gIH1cblxuICByZXR1cm4gc3RhdGU7XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlIH0gZnJvbSAncmVkdXgnXG5pbXBvcnQgdGh1bmtNaWRkbGV3YXJlIGZyb20gJ3JlZHV4LXRodW5rJztcbmltcG9ydCBjcmVhdGVMb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJztcbmltcG9ydCByb290UmVkdWNlciBmcm9tICcuLi9yZWR1Y2Vycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbmZpZ3VyZVN0b3JlKGluaXRpYWxTdGF0ZSkge1xuICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxuICAgIHJvb3RSZWR1Y2VyLFxuICAgIGluaXRpYWxTdGF0ZSxcbiAgICBhcHBseU1pZGRsZXdhcmUodGh1bmtNaWRkbGV3YXJlLCBjcmVhdGVMb2dnZXIoKSlcbiAgKTtcblxuICByZXR1cm4gc3RvcmVcbn1cbiJdfQ==
