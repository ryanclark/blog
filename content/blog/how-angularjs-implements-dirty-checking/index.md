---
title: How AngularJS implements dirty checking
date: "2014-07-14T14:10:32.000Z"
warning: "Angular constantly update the digest function so this won't match the source, but the general idea is still the same"
---

AngularJS implements dirty checking for two way data binding on $scope variables. Unlike dynamically setting up setters and getters<!--more-->, which is how Ember.js does two way data binding, dirty checking allows Angular to watch for variables that may or may not exist.

###$scope.$watch

```js
$scope.$watch( watchExp, listener, objectEquality );
``````

To watch when a variable changes, you will use the `$scope.$watch` function. With this you give three arguments, what to watch (`watchExp`), what to do when it's updated (`listener`), and whether or not you're checking on a variable or on an object. As we are checking a variable, we can ommit this when we call the function. For example -

```js
$scope.name = 'Ryan';

$scope.$watch( function( ) {
	return $scope.name;
}, function( newValue, oldValue ) {
	console.log('$scope.name was updated!');
} );
````

Angular will register your watcher function in the $scope. You can see that these are registered by logging the `$scope` to the console. <a href="http://jsfiddle.net/ryanclark/SraRB/2/" target="_blank">I've created a test directive on jsFiddle to demonstrate this.</a>

You'll notice that the console logs the fact that `$scope.name` is updated - this is because `$scope.name` was previously undefined and we've updated it to equal `Ryan`!

You can also use a string instead of a function in $watch. This will do exactly the same as providing a function. In the Angular source code, if you provide a string, the following code is ran - 

```js
if (typeof watchExp == 'string' && get.constant) {
  var originalFn = watcher.fn;
  watcher.fn = function(newVal, oldVal, scope) {
    originalFn.call(this, newVal, oldVal, scope);
    arrayRemove(array, watcher);
  };
}
```

This will set our watchExp to a function, in which it will call our listener with the variable that you've given the name of.

###$$watchers

The `$$watchers` variable in `$scope` holds all of the watchers that you define. If you look into `$$watchers` in the jsFiddle, you'll see that is an array of objects.

```js
$$watchers = [
	{
		eq: false, // whether or not we are checking for objectEquality
		fn: function( newValue, oldValue ) {}, // this is the listener function we've provided
		last: 'Ryan', // the last known value for the variable
		exp: function(){}, // this is the watchExp function we provided
		get: function(){} // Angular's compiled watchExp function
	}
];
```

The `$watch` function returns the `deregisterWatch` function. This means that if we were to assign the initial `$scope.$watch` to a variable, we could just call it to stop watching. <a href="http://jsfiddle.net/ryanclark/SraRB/4/" target="_blank">View this in jsFiddle.</a> Make sure you open and look at the first `$scope` that is logged before clicking on remove watcher!

However, <a href="http://jsfiddle.net/ryanclark/SraRB/5/" target="_blank">take a look at this.</a> If we were to remove the watcher before the controller function is evaluated, there is no log that we updated the `$scope.name` variable, even though we have - why is this?

###$scope.$apply

Whenever a controller/directive/etc is ran in Angular, internally Angular runs a function called `$scope.$apply`. The `$apply` function will run a function given to it, before finally running the `$digest` function in the rootScope. More on digests later.

The Angular $apply function looks like this -

```js
$apply: function(expr) {
	try {
	  beginPhase('$apply');
	  return this.$eval(expr);
	} catch (e) {
	  $exceptionHandler(e);
	} finally {
	  clearPhase();
	  try {
	    $rootScope.$digest();
	  } catch (e) {
	    $exceptionHandler(e);
	    throw e;
	  }
	}
}
```

####expr

The `expr` argument is just a function that you or Angular would pass through when calling `$scope.$apply` - most of the time you won't even need to use `$apply`, let alone give it a function!

Let's look into how `ng-keydown` uses `$scope.$apply`. To register the directive, Angular uses the following code -

```js
var ngEventDirectives = {};
forEach(
  'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
  function(name) {
    var directiveName = directiveNormalize('ng-' + name);
    ngEventDirectives[directiveName] = ['$parse', function($parse) {
      return {
        compile: function($element, attr) {
          var fn = $parse(attr[directiveName]);
          return function ngEventHandler(scope, element) {
            element.on(lowercase(name), function(event) {
              scope.$apply(function() {
                fn(scope, {$event:event});
              });
            });
          };
        }
      };
    }];
  }
);
```

What this does is loop through the different types of events that can be fired and create a new directive called ng(EventNameHere). In the compile function of the directive, it registers an event handler on the element, with the event being the directives name respectively. When that event is fired, Angular runs `scope.$apply`, giving it a function to run as well. 

###This is only one way data binding?

This will update the $scope value with the elements value - this is only one way data binding. This is because we've called `ng-keydown`, only alerting us when the keydown event is fired, and giving us the new value!

###But we want two way data binding!

Let's take a look at `ng-model`. When you use `ng-model`, this allows you to do two way data binding - exactly what we want. `ng-model` uses both `$scope.$watch` (view to model) and `$scope.$apply` (model to view) to offer this.

`ng-model` will attach the event handler directive (such as `keydown`) to the input you've applied it to - this is where `$scope.$apply` is called! `$scope.$watch` is called in the directive's controller. You can see this here -

```js
$scope.$watch(function ngModelWatch() {
	var value = ngModelGet($scope);

	// if scope model value and ngModel value are out of sync
	if (ctrl.$modelValue !== value) {

		var formatters = ctrl.$formatters,
			idx = formatters.length;

		ctrl.$modelValue = value;
		while(idx--) {
			value = formatters[idx](value);
		}

		if (ctrl.$viewValue !== value) {
			ctrl.$viewValue = value;
    		ctrl.$render();
    	}
	}

	return value;
});
```

When you call `$scope.$watch` with only one argument, the function you provide it will be called regardless of what updates - perfect! The function that is given in `ng-model` checks if the model and view are out of sync, and if it is, it will update the model with its new value. The function returns the new value, so when it is ran in the `$digest` function, we will know what the new value is!

###So why does our listener not fire?

If we look back at the jsFiddle where we deregister the `$scope.$watch` function in the same function as we define it, we can now understand why we don't get notified about us updating `$scope.name` even though we did.

As mentioned earlier, Angular runs `$scope.$apply` on every directive's controller function. If we look into the `$scope.$apply` function, it only runs the `$digest` after the directive's controller function has been evaluated - meaning that the `$scope.$watch` function never actually gets a chance to be called, as we've deregisted it before it could've been ran! But how is it ran? 

###$digest

The `$digest` function is called on the `$rootScope` by `$scope.$apply`. This will run the digest cycle on the $rootScope and will then traverse down the scopes and run the digest cycle on that. In simple terms, the digest cycle will fire all of our `watchExp` functions in the `$$watchers` variable, compare them against the last known value, and if they're different, fire the listener!

When the digest cycle runs, it loops through the watchers and then loops again, whilst the cycle is considered "dirty". The cycle is considered dirty when the `watchExp` and last known value aren't equal to each other. Ideally this will run once, but if it runs more than 10 times you will get an error.

So when `$scope.$apply` is ran, `$digest` is ran, it will then loop through the `$$watchers` and fire any listener event if the `watchExp` does not equal the last known value. `$scope.$apply` is ran by Angular on anything that could possibly contain a model value changing. This is why when you update the `$scope` outside of Angular, for instance in a `setTimeout` function, you need to run `$scope.$apply();` in order to have Angular notice that the scope has been updated!

###Let's create our own

We'll create a small, basic version of dirty checking that we can use. Angular's dirty checking is a bit more advanced, offering async queues and some other neat things.

####Setup our scope

Scope will just be a function, containing any data that we wish to store in it. We'll extend the prototype object on the function to replicate `$digest` and `$watch`. We don't need `$apply` as we'll be won't need to evaluate any functions in the context of the Scope - we'll just simply use `$digest`. Our Scope will look like this - 

```js
var Scope = function( ) {
	this.$$watchers = [];	
};

Scope.prototype.$watch = function( ) {
	
};

Scope.prototype.$digest = function( ) {
	
};
```

Our `$watch` function needs to accept two parameters, `watchExp` and `listener`. When `$watch` is called, we'll push these into the `$$watcher` value we've set in `Scope`.

```js
var Scope = function( ) {
	this.$$watchers = [];	
};

Scope.prototype.$watch = function( watchExp, listener ) {
	this.$$watchers.push( {
		watchExp: watchExp,
		listener: listener || function() {}
	} );
};

Scope.prototype.$digest = function( ) {
	
};
```

You'll notice that I've set `listener` to an empty function if there is no `listener` provided - this way we can register a `$watch` for all variables!

Next we will work on the `$digest`. We need to check if the old value is equal to the new value, and fire the listener if it isn't. We will then loop until they are equal to each other. This is where the `dirty` variable comes in - whether or not the values are equal to each other!

```js
var Scope = function( ) {
	this.$$watchers = [];	
};

Scope.prototype.$watch = function( watchExp, listener ) {
	this.$$watchers.push( {
		watchExp: watchExp,
		listener: listener || function() {}
	} );
};

Scope.prototype.$digest = function( ) {
	var dirty;

	do {
			dirty = false;

			for( var i = 0; i < this.$$watchers.length; i++ ) {
				var newValue = this.$$watchers[i].watchExp(),
					oldValue = this.$$watchers[i].last;

				if( oldValue !== newValue ) {
					this.$$watchers[i].listener(newValue, oldValue);

					dirty = true;

					this.$$watchers[i].last = newValue;
				}
			}
	} while(dirty);
};
```

Next, we need to create a new instance of our scope. We'll assign this to `$scope`. We can then register a watch function, and `$digest` it after we update it!

```js
var Scope = function( ) {
	this.$$watchers = [];	
};

Scope.prototype.$watch = function( watchExp, listener ) {
	this.$$watchers.push( {
		watchExp: watchExp,
		listener: listener || function() {}
	} );
};

Scope.prototype.$digest = function( ) {
	var dirty;

	do {
			dirty = false;

			for( var i = 0; i < this.$$watchers.length; i++ ) {
				var newValue = this.$$watchers[i].watchExp(),
					oldValue = this.$$watchers[i].last;

				if( oldValue !== newValue ) {
					this.$$watchers[i].listener(newValue, oldValue);

					dirty = true;

					this.$$watchers[i].last = newValue;
				}
			}
	} while(dirty);
};


var $scope = new Scope();

$scope.name = 'Ryan';

$scope.$watch(function(){
    return $scope.name;
}, function( newValue, oldValue ) {
    console.log(newValue, oldValue);
} );

$scope.$digest();
```

Success - we have dirty checking (in it's most basic form) implemented! <a href="http://jsfiddle.net/ryanclark/PVQts/" target="_blank">Check out the jsFiddle</a> to mess around with what we've made. If you look at the console, you'll notice it logs

```js
Ryan undefined
```

Which is the exact behaviour we want - `$scope.name` was previously undefined and we've set it to Ryan - result!

Let's attach our `$digest` function to a `keyup` event on an input. That way we don't have to call it ourselves. This means we can have two way data binding too!

```js
var Scope = function( ) {
	this.$$watchers = [];	
};

Scope.prototype.$watch = function( watchExp, listener ) {
	this.$$watchers.push( {
		watchExp: watchExp,
		listener: listener || function() {}
	} );
};

Scope.prototype.$digest = function( ) {
	var dirty;

	do {
			dirty = false;

			for( var i = 0; i < this.$$watchers.length; i++ ) {
				var newValue = this.$$watchers[i].watchExp(),
					oldValue = this.$$watchers[i].last;

				if( oldValue !== newValue ) {
					this.$$watchers[i].listener(newValue, oldValue);

					dirty = true;

					this.$$watchers[i].last = newValue;
				}
			}
	} while(dirty);
};


var $scope = new Scope();

$scope.name = 'Ryan';

var element = document.querySelectorAll('input');

element[0].onkeyup = function() {
	$scope.name = element[0].value;

	$scope.$digest();
};

$scope.$watch(function(){
    return $scope.name;
}, function( newValue, oldValue ) {
    console.log('Input value updated - it is now ' + newValue);
    
    element[0].value = $scope.name;
} );

var updateScopeValue = function updateScopeValue( ) {
    $scope.name = 'Bob';
    $scope.$digest();
};
```

Perfect - using this approach we can now update the input's value and it will be reflected in `$scope.name`, as well as call `updateScopeValue` and have the input's value reflect that! <a href="http://jsfiddle.net/ryanclark/S3unb/1/" target="_blank">You can play around with this here.</a>
