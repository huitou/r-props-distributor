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
    propsDistributor,
    propsReceiver,
} from 'r-props-distributor';
```

### Use HoCs to distribute props

```javascript
    const ParentComponent = (props) => (<div>{props.children}</div>);
    const ChildComponent = (props) => (<div>...</div>);

    // Give a unique name to the distributor:
    const ditributorName = 'myDistributor';
    // Give a mapper function to select the props to be distributed:
    const myMapper = (props) => {
        const { prop1, prop2 } = props;
        return { prop1, prop2 };
    };

    // Decorate the parent component:
    const DistributorPointComponent = propsDistributor(ditributorName, myMapper)(ParentComponent);
    // Decorate the child components:
    const ReceiverPointComponent = propsReceiver(ditributorName)(ChildComponent);

    // Use decorated parent and child components together:
    const ComponentUsingPropsDist = (props) => (
        <DistributorPointComponent>
            <div>
                <ReceiverPointComponent />
            </div>
            <ReceiverPointComponent />
        </DistributorPointComponent>
    );
```

In this example both ReceiverPointComponent instances receive prop1 and prop2.

## Dependnecy:

react > 16.8.4
