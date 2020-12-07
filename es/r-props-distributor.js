import React, { Fragment } from 'react';
import { equals } from 'ramda';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

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
    Hoist Registry.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
const hoistRegistry = {};

const getHoistRegistry = () => ({ ...hoistRegistry
});

const registerHoist = name => {
  if (hoistRegistry[name]) {
    // console.warn(`Context registry has already a React Context registered with the name ${name}`); 
    return;
  }

  const Context = React.createContext({});
  const [first, ...rest] = name;
  const displayName = [first.toUpperCase(), ...rest].join('');
  Context.displayName = displayName;
  hoistRegistry[name] = Context;
};

const deregisterHoist = name => {
  hoistRegistry[name] = undefined;
};

const getHoistContext = name => {
  if (!hoistRegistry[name]) {
    throw new Error(`Hoist registry has not a React Context registered with the name ${name}`);
  }

  return hoistRegistry[name];
};

var HoistRegistry = {
  registerHoist,
  deregisterHoist,
  getHoistContext,
  getHoistRegistry
};

/*
    Props Registry.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
const propsRegistry = {};

const getPropsRegistry = () => ({ ...propsRegistry
});

const registerProps = name => {
  if (propsRegistry[name]) {
    // console.warn(`Props registry has already a React Context registered with the name ${name}`); 
    return;
  }

  const Context = React.createContext({});
  const [first, ...rest] = name;
  const displayName = [first.toUpperCase(), ...rest].join('');
  Context.displayName = displayName;
  propsRegistry[name] = Context;
};

const deregisterProps = name => {
  propsRegistry[name] = undefined;
};

const getPropsContext = name => {
  if (!propsRegistry[name]) {
    throw new Error(`Props registry has not a React Context registered with the name ${name}`);
  }

  return propsRegistry[name];
};

var PropsRegistry = {
  registerProps,
  deregisterProps,
  getPropsContext,
  getPropsRegistry
};

const rootHoistName = '_root_'; // Distribute all named propses through a props context:

const PropsDistributors = props => {
  const {
    hoistName,
    accommodatedProps,
    children
  } = props;
  const PropsContext = PropsRegistry.getPropsRegistry()[hoistName];
  return React.createElement(PropsContext.Provider, {
    value: { ...accommodatedProps
    }
  }, children);
}; // Distribute Hoist Context's value (hoistHanldes):


const HoistDistributor = props => {
  const {
    hoistName,
    hoistHandles,
    children
  } = props;
  const HoistContext = HoistRegistry.getHoistContext(hoistName);
  return React.createElement(HoistContext.Provider, {
    value: hoistHandles
  }, children);
};

class HoistManager extends React.Component {
  constructor(props) {
    super(props); // Create and register a Hoist Context:

    _defineProperty(this, "setProps", propsName => value => {
      this.setState(state => {
        const newAccommodatedProps = { ...state.accommodatedProps
        };
        newAccommodatedProps[propsName] = value;
        return { ...state,
          accommodatedProps: newAccommodatedProps
        };
      });
    });

    _defineProperty(this, "accommodateProps", (propsName, value) => {
      this.setProps(propsName)(value);
      return this.setProps(propsName);
    });

    _defineProperty(this, "removeProps", propsName => {
      this.setState(state => {
        const newAccommodatedProps = { ...state.accommodatedProps
        };
        newAccommodatedProps[propsName] = undefined;
        return { ...state,
          accommodatedProps: newAccommodatedProps
        };
      });
    });

    _defineProperty(this, "hoistHandles", {
      accommodateProps: this.accommodateProps,
      removeProps: this.removeProps
    });

    HoistRegistry.registerHoist(this.props.hoistName);
    PropsRegistry.registerProps(this.props.hoistName); // Initialise a props accommodation for this hoist point:

    this.state = {
      accommodatedProps: {}
    };
  } // Internal help function:


  // Wrap its children with Hoist and Props desitributors:
  render() {
    const {
      hoistName,
      children
    } = this.props;
    return React.createElement(HoistDistributor, {
      hoistName: hoistName,
      hoistHandles: this.hoistHandles
    }, React.createElement(PropsDistributors, {
      hoistName: hoistName,
      accommodatedProps: this.state.accommodatedProps
    }, children));
  }

}

const propsHoist = (hoistName = rootHoistName) => WrappedComponent => props => React.createElement(HoistManager, {
  hoistName: hoistName
}, React.createElement(WrappedComponent, props));
const hoistRegister = (hoistName = rootHoistName) => WrappedComponent => props => {
  const HoistContext = HoistRegistry.getHoistRegistry()[hoistName];

  if (HoistContext) {
    return React.createElement(HoistContext.Consumer, null, contextProps => React.createElement(WrappedComponent, _extends({}, contextProps, props)));
  } else {
    // This design allows a hoistRegister without the relevant hoist point yet mounted.
    // console.warn(`Hoist Context ${hoistName} does not exist.`);
    return React.createElement(WrappedComponent, props);
  }
};

/*
    Helpers for props distributor and receiver HOCs.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
const unitMapper = props => ({ ...props
});

class PropsRegister extends React.Component {
  componentDidMount() {
    // Request accommodation for named props with its value:
    const {
      propsName,
      propsValue,
      accommodateProps
    } = this.props;
    this.propsRefresh = accommodateProps && accommodateProps(propsName, propsValue);
  }

  componentDidUpdate(prevProps) {
    // Update accommodated propsValue:
    const {
      propsValue
    } = this.props;

    if (!equals(propsValue, prevProps.propsValue)) {
      this.propsRefresh && this.propsRefresh(rest);
    }
  }

  componentWillUnmount() {
    // Remove the named props from accommodation:
    const {
      propsName,
      removeProps
    } = this.props;
    removeProps && removeProps(propsName);
  }

  render() {
    return React.createElement(Fragment, null, this.props.children);
  }

}

class HoistingPropsRegisterHolder extends React.Component {
  constructor(props) {
    super(props);
    this.Component = hoistRegister(props.hoistName)(PropsRegister);
  }

  render() {
    const HoistingPropsRegister = this.Component;
    const {
      propsName,
      children,
      propsValue
    } = this.props;
    return React.createElement(HoistingPropsRegister, {
      propsName: propsName,
      propsValue: propsValue
    }, children);
  }

}

const PropsCollect = (propsName, mapper = unitMapper, hoistName = rootHoistName) => WrappedComponent => props => React.createElement(HoistingPropsRegisterHolder, {
  hoistName: hoistName,
  propsName: propsName,
  propsValue: mapper(props)
}, React.createElement(WrappedComponent, props));
const propsConnect = (propsName, mapper = unitMapper, hoistName = rootHoistName) => WrappedComponent => props => {
  const PropsContext = PropsRegistry.getPropsRegistry()[hoistName];

  if (PropsContext) {
    return React.createElement(PropsContext.Consumer, null, contextProps => React.createElement(WrappedComponent, _extends({}, mapper(contextProps[propsName]), props)));
  } else {
    // This design allows a propsConnect without the relevant named props yet registered.
    // console.warn(`Props ${propsName} does not yet registered.`);
    return React.createElement(WrappedComponent, props);
  }
};

export { PropsCollect, propsConnect, propsHoist };
