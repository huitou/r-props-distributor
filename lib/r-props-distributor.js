'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/*
    Helpers for props distributor and receiver HOCs.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
const contextRegistry = {};

const registerContext = (name, Context) => {
  if (contextRegistry[name]) {
    throw new Error(`Context registry has already a React Context registered with the name ${name}`);
  }

  contextRegistry[name] = Context;
};

const deregisterContext = name => {
  contextRegistry[name] = undefined;
};

const getContext = name => {
  if (!contextRegistry[name]) {
    throw new Error(`Context registry has not a React Context registered with the name ${name}`);
  }

  return contextRegistry[name];
};
const unitMapper = props => ({ ...props
});

class Distributor extends React.Component {
  constructor(props) {
    super(props);
    this.MyContext = React.createContext({});

    try {
      registerContext(this.props._name, this.MyContext);
    } catch (e) {
      throw e;
    }
  }

  componentWillUnmount() {
    deregisterContext(this.props._name);
  }

  render() {
    const {
      _name,
      children,
      ...rest
    } = this.props;
    const MyContext = this.MyContext;
    return React.createElement(MyContext.Provider, {
      value: { ...rest
      }
    }, this.props.children);
  }

}

const propsDistributor = (name, mapper = unitMapper) => WrappedComponent => props => {
  const {
    children,
    ...rest
  } = props;
  return React.createElement(Distributor, _extends({
    _name: name
  }, mapper(rest)), React.createElement(WrappedComponent, props));
};
const propsReceiver = (name, mapper = unitMapper) => WrappedComponent => props => {
  const MyContext = getContext(name);
  return React.createElement(MyContext.Consumer, null, contextProps => React.createElement(WrappedComponent, _extends({}, mapper(contextProps), props)));
};

exports.propsDistributor = propsDistributor;
exports.propsReceiver = propsReceiver;
