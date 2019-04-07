---
title: Getting started with React
date: "2015-02-17T09:00:00.000Z"
warning: "The version of React used in this is quite old - certain things may be done differently in recent releases"
---

React is an insanely powerful framework by the amazing developers over at Facebook. Implementing a virtual DOM, it allows us to render components super fast whilst removing any unnecessary overhead from DOM operations. React is often said to deal with the "V" out of the MVC architecture, however when you mix this with Flux, you can have a full blown front-end framework that allows you to easily keep your model and view in sync - more on Flux soon.

# Components
In React you can create components that have special functionality that you won't find in a HTML element, i.e. a dropdown navigation, which we will be creating in this tutorial. Each component is contained in its own "scope", so we can define the functionality of the component and reuse it as many times as we want without them interfering with each other.

Each component has a `render` function, which effectively returns the HTML that the component will render in the browser. We can call other React component's too, meaning the possibilities are endless!

## JSX
If you've had a look around React you will have seen something called JSX. What JSX allows us to do is write HTML inside of Javascript without having to wrap strings around it. This helps with rapid development, as we don't have to worry about strings and multiple lines etc. You can transform the JSX in the browser on runtime, but this is not recommended as it slows down your page. Both gulp and grunt offer a JSX transformer for your preprocess build tasks, so if you want to use JSX, I recommend setting this up.

### Using JSX
As previously mentioned, each component has to have a `render` function. This acts as a "ViewModel" - before you return your HTML for the component, you can manipulate the model information into view information, meaning that your HTML could change drastically depending on the model (e.g. a dynamic repeated list of items).

Once you've done all your manipulation, you can return what you want to render. As we're using JSX, this is really simple -

```jsx
var ExampleComponent = React.createClass({
  render: function () {
    return (
      <div className="navigation">
        Hello World!
      </div>
    );
  }
});
``````

If you run this code in your browser, you will get syntax errors, as you can't put `<` or `>` characters in Javascript without putting quotes around them. However, when you run the JSX transformer on your code, it turns it into this -

```jsx
var ExampleComponent = React.createClass({
  render: function () {
    return (
      React.createElement('div', {className: 'navigation'}, 'Hello World!')
    );
  }
});
```

<a href="http://jsfiddle.net/ryanclark/w04r9hbj/" target="_blank">You can check out a demo here</a> - I'm using the browser JSX transformer (this isn't recommended, but is needed for JSFiddle).

Which runs! JSX transforms any DOM node that you use into a function call to `React.createElement`, passing through the type of node, the parameters and the contents. You don't have to use JSX, but it means you have to manually write out `React.createElement` calls for every DOM node. In every example from now I will be using JSX.

You might be wondering why I'm using `className` on the DOM node instead of `class`. This is because `class` is a reserved word in Javascript. When JSX transforms your code it changes all the attributes on the node into an object, and you can't have class as a property!

####Using variables for attributes
If you want to dynamically change the class of a component (or any other attribute value), you can use a variable instead. However you can't just pass through the variable name, you have to wrap it around a set of curly braces, so JSX knows that it is an external variable.

```jsx
var ExampleComponent = React.createClass({
  render: function () {
    var navigationClass = 'navigation';
    return (
      <div className={ navigationClass }>
        Hello World!
      </div>
    );
  }
});
```

<a href="http://jsfiddle.net/ryanclark/w04r9hbj/1/" target="_blank">You can check this out here.</a>

##The Initial Render
When you initially want to render a React component, you need tell React what component to render, and point to an existing DOM node for where to render it. To do this you would use the `React.render` function.

```js
var ExampleComponent = React.createClass({
  render: function () {
    return (
      <div className="navigation">
        Hello World!
      </div>
    );
  }
});

React.render(<ExampleContent />, document.body);
```

This will render the component on the body - simple! From here you can call your other components normally, or if you wish, you can use the `render` function multiple times, if you don't want your whole page to be rendered using React, but still want to use multiple components.

##Basics of a component
Components can hold their own "state". This allows us to reuse the same component multiple times, and have them looking completely different because the state is unique to each instance of the component. 

When you pass through attributes to a component these are referred to as properties. You aren't just limited to the HTML attributes though, you can pass through whatever you like and access it in the component via `this.props`. This allows us to reuse the same component but pass through a different set of properties - like a "configuration" of the component.

###Properties
Referring to our previous "Hello World!" example, you can see that we have the `className` attribute on the HTML node. Inside the component, we can access this value using `this.props.className`, but as previously mentioned you can pass through whatever you like. For our dropdown, we are going to configure the navigation as an object, and the component is going to use that as a configuration for what to render. Let's start -

```jsx
var navigationConfig = [];

var Navigation = React.createClass({
  render: function () {
    return (
      <div className="navigation">
        
      </div>
    );
  }
});

React.render(<Navigation config={ navigationConfig } />, document.body);
```

If we were to access `this.props.config` now, we could receieve an empty array (the value of `navigationConfig`). Before we move on to actually coding the navigation, let's talk about state.

###State
As previously discussed, each component has its own "state". When using state, you define an initial state and then you can update the state using `this.setState`. Whenever the state is updated, the component will call the `render` function again, and replace/change the difference between the previous render value and the new one. This is where the virtual DOM kicks in - the difference algorithm is done internally in React, so we don't rely on the DOM updating (as the DOM is slow). React will calculate the difference and produce a sort of instruction set of what to do (e.g. add class "active" to "navigation__link" or remove a node), and perform them on the DOM.

With our navigation we are going to keep what dropdown is currently open in the state. To do this, we add a `getInitialState` function to the class configuration object, and return an object with the initial state we want.

```jsx
var navigationConfig = [];

var Navigation = React.createClass({
  getInitialState: function () {
    return {
      openDropdown: -1
    };
  },
  render: function () {
    return (
      <div className="navigation">
        
      </div>
    );
  }
});

React.render(<Navigation config={ navigationConfig } />, document.body);
```

You'll notice that we've set it to -1. When we come to opening a dropdown, we will use the position of the navigation item in the configuration array in the state, and as arrays start at 0, we have to use -1 to not point it to a navigation item.

We can access the state via `this.state`, so if we were to have a look at `this.state.openDropdown`, we would get -1 returned.

##The component lifecycle
Each component has a "lifecycle" - these are a set of functions that you can define in the component's configuration and they will get called sometime during the components life. We've already had a look at `getInitialState` - this is only called once, and is called as the component is being mounted.

###componentWillMount
As soon as your component is about to be mounted, this is called. This means that we can run code that is necessary to our component functioning. As `render` is called multiple times in the components life, we would generally put code here that we would only ever want executed once, i.e. XHR requests.

```jsx
var ExampleComponent = React.createClass({
  componentWillMount: function () {
    // xhr request here to get data
  },
  render: function () {
    // this gets called many times in a components life
    return (
      <div>
        Hello World!
      </div>
    );
  }
});
```

###componentDidMount
Once your component has ran the render function and actually rendered your component in the DOM, `componentDidMount` is called. This allows us to get access to the root DOM node of the component. Here we can do any DOM manipulation we need or anything that relies on component actually being in the DOM, for instance rendering a chart. You can access the DOM node internally by calling `this.getDOMNode`.

```jsx
var ExampleComponent = React.createClass({
  componentDidMount: function () {
    var node = this.getDOMNode();

    // render a chart on the DOM node
  },
  render: function () {
    return (
      <div>
        Hello World!
      </div>
    );
  }
});
```

###componentWillUnmount
If you were to remove the component from the DOM, this function is called. This allows us to clean up after the component, such as removing any event listeners that we've bound. If we didn't clean up after ourselves and one of the event listeners was fired, we'd be trying to manipulate an unmounted component, and React would throw an error.

```jsx
var ExampleComponent = React.createClass({
  componentWillUnmount: function () {
    // unbind any event listeners specific to this component
  },
  render: function () {
    return (
      <div>
        Hello World!
      </div>
    );
  }
});
```

##Component Methods
React also offers us methods for our components to make our lives much easier. These are called on the creation of the component. For example, `getInitialState`, which allows us to define a default state so we don't have to worry about checking if the state item exists further down the line.

###getDefaultProps
When we create the component we can define the default values for the properties of the component that we are expecting. This means that if we were to have the component called without these properties, the component has a default "configuration" and we don't have to worry about checking for the properties later down the line.

When you define the component, these default properies are cached, so they are the same for every instance of the component and can't be changed. For our navigation component, we will specify the configuration as an empty array, so we won't get errors in the render function if there is no configuration passed through.

```jsx
var Navigation = React.createClass({
  getInitialState: function () {
    return {
      openDropdown: -1
    };
  },
  getDefaultProps: function () {
    return {
      config: []
    }
  },
  render: function () {
    return (
      <div className="navigation">
        
      </div>
    );
  }
});

React.render(<Navigation config={ navigationConfig } />, document.body);
```

###propTypes
We can also specify the type of each property we are expecting. This is extremely useful as we don't have to check and handle with unexpected values of properties. For use in the dropdown, we will specify that only an array can be passed through as the configuration.

```jsx
var Navigation = React.createClass({
  getInitialState: function () {
    return {
      openDropdown: -1
    };
  },
  getDefaultProps: function () {
    return {
      config: []
    }
  },
  propTypes: {
    config: React.PropTypes.array
  },
  render: function () {
    return (
      <div className="navigation">
        
      </div>
    );
  }
});

React.render(<Navigation config={ navigationConfig } />, document.body);
```

###mixins
We can also pass in mixins to our component. These are basically uncreated React components (so just an object of configuration). This means that if we have two components that share the same functionality somewhere in our configuration (such as the same initial state), we can abstract this and put the method in a mixin, so we don't have to write the same code twice.

```jsx
var ExampleMixin = {
  componentDidMount: function () {
    // bind some event listeners here
  },
  componentWillUnmount: function () {
    // unbind those events here!
  }
};

var ExampleComponent = React.createClass({
  mixins: [ExampleMixin],
  render: function () {
    return (
      <div>
        Hello World!
      </div>
    );
  }
});

var AnotherComponent = React.createClass({
  mixins: [ExampleMixin],
  render: function () {
    return (
      <div>
        Hello World!
      </div>
    );
  }
});
```

Both of these components will have the same `componentDidMount` and `componentWillUnmount` functions, saving us rewriting the code. However, you cannot override these properties, if a property is set in a mixin, it can't be overriden in the component.

##Loop de loop
As we have an array of objects, we need to somehow loop through the array and render a list item for each one. As JSX allows you to use it where ever you want in your Javascript files, you can map the array and return JSX in its place, and then pass it through to React to render.

```jsx
var navigationConfig = [
  {
    href: 'http://ryanclark.me',
    text: 'My Website'
  }
];

var Navigation = React.createClass({
  getInitialState: function () {
    return {
      openDropdown: -1
    };
  },
  getDefaultProps: function () {
    return {
      config: []
    }
  },
  propTypes: {
    config: React.PropTypes.array
  },
  render: function () {
    var config = this.props.config;

    var items = config.map(function (item) {
      return (
        <li className="navigation__item">
          <a className="navigation__link" href={ item.href }>
            { item.text }
          </a>
        </li>
        );
    });

    return (
      <div className="navigation">
        { items }
      </div>
    );
  }
});

React.render(<Navigation config={ navigationConfig } />, document.body);
```

<a href="http://jsfiddle.net/ryanclark/w04r9hbj/2/" target="_blank">Feel free to mess around with the `navigationConfig` in this JSFiddle</a>

Our navigation config consists of array of objects, containing a href property for where we want to go to and a text property for what we want to display as the link text. When we use `map`, we loop through the array and get the object for each iteration. This means we can then access `href` and `text`, and use them in our HTML. As we're returning the list item, the item in the array will get replaced, so we when pass it through to React it will know what to render!

##Put it all together

So far we've got state for our open dropdown and we've got a loop for all of our dropdown items. As we need to define what will go in the dropdowns, we'll put an `children` property on each object in our `navigationConfig` array. We can then loop through these again for our dropdown items.

```jsx
var navigationConfig = [
  {
    href: 'http://ryanclark.me',
    text: 'My Website',
    children: [
      {
        href: 'http://ryanclark.me/how-angularjs-implements-dirty-checking/',
        text: 'Angular Dirty Checking'
      },
      {
        href: 'http://ryanclark.me/getting-started-with-react/',
        text: 'React'
      }
    ]
  }
];

var Navigation = React.createClass({
  getInitialState: function () {
    return {
      openDropdown: -1
    };
  },
  getDefaultProps: function () {
    return {
      config: []
    }
  },
  propTypes: {
    config: React.PropTypes.array
  },
  render: function () {
    var config = this.props.config;

    var items = config.map(function (item) {
      var children, dropdown;
      if (item.children) {
        children = item.children.map(function (child) {
          return (
            <li className="navigation__dropdown__item">
              <a className="navigation__dropdown__link" href={ child.href }>
                { child.text }
              </a>
            </li>
          );
        });

        dropdown = (
          <ul className="navigation__dropdown">
            { children }
          </ul>
        );
      }
      return (
        <li className="navigation__item">
          <a className="navigation__link" href={ item.href }>
            { item.text }
          </a>

          { dropdown }
        </li>
        );
    });

    return (
      <div className="navigation">
        { items }
      </div>
    );
  }
});

React.render(<Navigation config={ navigationConfig } />, document.body);
```

<a href="http://jsfiddle.net/ryanclark/w04r9hbj/3/" target="_blank">You can see this working here</a> - but we can still see the dropdown, even though our `openDropdown` is `-1`.

As we can access `this.state` inside the component, we can check if the dropdown is open, and apply a new CSS class to it so we can show it to the user as they hover over.

```jsx
var navigationConfig = [
  {
    href: 'http://ryanclark.me',
    text: 'My Website',
    children: [
      {
        href: 'http://ryanclark.me/how-angularjs-implements-dirty-checking/',
        text: 'Angular Dirty Checking'
      },
      {
        href: 'http://ryanclark.me/getting-started-with-react/',
        text: 'React'
      }
    ]
  }
];

var Navigation = React.createClass({
  getInitialState: function () {
    return {
      openDropdown: -1
    };
  },
  getDefaultProps: function () {
    return {
      config: []
    }
  },
  openDropdown: function (id) {
    this.setState({
      openDropdown: id
    });
  },
  closeDropdown: function () {
    this.setState({
      openDropdown: -1
    });
  },
  propTypes: {
    config: React.PropTypes.array
  },
  render: function () {
    var config = this.props.config;

    var items = config.map(function (item, index) {
      var children, dropdown;
      if (item.children) {
        children = item.children.map(function (child) {
          return (
            <li className="navigation__dropdown__item">
              <a className="navigation__dropdown__link" href={ child.href }>
                { child.text }
              </a>
            </li>
          );
        });

        var dropdownClass = 'navigation__dropdown';
        if (this.state.openDropdown === index) {
          dropdownClass += ' navigation__dropdown--open';
        }

        console.log(this.state.openDropdown, index);

        dropdown = (
          <ul className={ dropdownClass }>
            { children }
          </ul>
        );
      }
      return (
        <li className="navigation__item" onMouseOut={ this.closeDropdown } onMouseOver={ this.openDropdown.bind(this, index) }>
          <a className="navigation__link" href={ item.href }>
            { item.text }
          </a>

          { dropdown }
        </li>
        );
    }, this);

    return (
      <div className="navigation">
        { items }
      </div>
    );
  }
});

React.render(<Navigation config={ navigationConfig } />, document.body);
```

<a href="http://jsfiddle.net/ryanclark/w04r9hbj/4/" target="_blank">Watch it in action here</a> - mouse over "My Website" and the dropdown will appear!

I've gone ahead and added in the mouse events to each list item. You can see I'm using `.bind` on one call and not on the other - this is because when the user's mouse moves out of the item, we don't care where it moves to, all we know is that we need to close the dropdown, so we can set it to `-1` always. However, we need to know what dropdown to open when the user's mouse enters the item, so we need to pass through a parameter (the index). The reason we use `bind` for this instead of just calling the function is because you need to pass React a function that can be invoked. If we call the function directly, we've already invoked it, instead of invoking it on the event.


We can now add many more items to our `navigationConfig` and add some styling to make it into an actual functioning dropdown. <a href="http://jsfiddle.net/ryanclark/w04r9hbj/5/" target="_blank">Check it out here</a>.

# Conclusion

React is a super easy framework to get into. Its simplistic API allows you to quickly make your components without any thought of manipulating the DOM or doing complex operations for repeating lists, etc. If you need any help at all, feel free to tweet me <a href="http://twitter.com/rynclark" target="_blank">@rynclark</a>. Thanks for reading!
