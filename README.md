# r-props-distributor

Separation of Concerns & Composition

## What does the library do?

It provides a pair of React HoCs for props distribution.

## Why such a library?

To make props passing easier through composition.

## How to use it?

### Install the library

`npm install --save r-props-distributor`

### Import HoC artefacts of the libary

```javascript
import {
    propsHoist,
    propsRegister,
    propsConnect,
} from 'r-props-distributor';
```

### Use HoCs to distribute props

```javascript
    const HoistPointComponent = (props) => (<div>{props.children}</div>);
    const PropsPointComponent = (props) => (<div />);
    const PropsConnectComponent = (props) => (<div />);

    const HOIST_NAME = 'myHoist';
    const PROPS_NAME = 'myProps';
    const hoistMapper = (props) => ({ prop1: props.prop1, prop2: props.prop2 });
    const connectMapper = (props) => ({ prop3: props.prop1, prop4: props.prop2 });

    const HoCedHoistPointComponent = propsHoist(HOIST_NAME)(HoistPointComponent);
    const HoCedPropsPointComponent = propsRegister(PROPS_NAME, hoistMapper, HOIST_NAME)(PropsPointComponent);
    const HoCedPropsConnectComponent = propsConnect(PROPS_NAME, connectMapper, HOIST_NAME)(PropsConnectComponent);

    const TreeWithPropsDistributor = (props) => (
        <HoCedHoistPointComponent>
            <div><HoCedPropsPointComponent {...{ prop1: 'abc', prop2: 123, propN: 'whatever' }}/></div>
            <HoCedPropsConnectComponent />
        </HoCedHoistPointComponent>
    );
```

In this example <PropsConnectComponent> instances receives { prop3: 'abc', prop4: 123 }, that is, a selected part of props on <HoCedPropsPointComponent> is hoisted to <HoCedHoistPointComponent> and then distributed to <HoCedPropsConnectComponent> with desired renaming.

## Dependnecy:

react > 16.8.4
