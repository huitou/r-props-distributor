'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React$1 = _interopDefault(require('react'));

/*
    Helpers for props distributor and receiver HOCs.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
const unitMapper = props => ({ ...props
});
const contextRegistry = {};
const registerContext = (name, Context) => {
  if (contextRegistry[name]) {
    throw new Error(`Context registry has already a React Context registered with the name ${name}`);
  }

  contextRegistry[name] = Context;
};
const getContext = name => {
  if (!contextRegistry[name]) {
    throw new Error(`Context registry has not a React Context registered with the name ${name}`);
  }

  return contextRegistry[name];
};

/*
    props distributor HOC.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
const propsDistributor = (name, mapper = unitMapper) => WrappedComponent => {
  // Create React Context:
  const MyContext = React$1.createContext({}); // Register it in global registry:

  registerContext(name, MyContext); // Using React Context provider:

  return React$1.createElement(MyContext.Provider, {
    value: { ...props
    }
  }, React$1.createElement(WrappedComponent, props));
};

/*
    props receiver HOC.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
const propsReceiver = (name, mapper = unitMapper) => WrappedComponent => {
  const MyContext = getContext(name);
  return React.createElement(MyContext.Consumer, null, props => React.createElement(WrappedComponent, props));
};

exports.propsDistributor = propsDistributor;
exports.propsReceiver = propsReceiver;
