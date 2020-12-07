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
    PropsCollect,
    propsConnect,
} from 'r-props-distributor';
```

### Use HoCs to distribute props

```javascript
    const HoistPointComponent = (props) => (<div>{props.children}</div>);
    const PropsCollectComponent = (props) => (<div />);
    const PropsConnectComponent = (props) => (<div />);

    const HOIST_NAME = 'myHoist';
    const PROPS_NAME = 'myProps';
    const collectMapper = (props) => ({ prop1: props.prop1, prop2: props.prop2 });
    const connectMapper = (props) => ({ prop3: props.prop1, prop4: props.prop2 });

    const WrppdHoistPointComponent = propsHoist(HOIST_NAME)(HoistPointComponent);
    const WrppdPropsCollectComponent =
        PropsCollect(PROPS_NAME, collectMapper, HOIST_NAME)(PropsCollectComponent);
    const WrppdPropsConnectComponent =
        propsConnect(PROPS_NAME, connectMapper, HOIST_NAME)(PropsConnectComponent);

    const TreeWithPropsDistributor = (props) => (
        <WrppdHoistPointComponent>
            <div>
                <WrppdPropsCollectComponent {...{ prop1: 'abc', prop2: 123, propN: 'whatever' }}/>
            </div>
            <div>
                <WrppdPropsConnectComponent />
            </div>
        </WrppdHoistPointComponent>
    );
```

In this example ```<PropsConnectComponent>``` instance receives { prop3: 'abc', prop4: 123 } as props, that is, a selected part of the props on ```<WrppdPropsCollectComponent>``` is hoisted to ```<WrppdHoistPointComponent>``` and then distributed to ```<WrppdPropsConnectComponent>``` with desired renaming.

## Dependnecy:

react > 16.8.4
