/*
    Hoist HoCs.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React, { Fragment } from 'react';

import HoistRegistry from './registry-hoist';
import PropsRegistry from './registry-props';

// Distribute props through a named Props Context:
const PropsDistributor = (props) => {
    const { propsEntry, children } = props;
    const PropsContext = PropsRegistry.getPropsRegistry()[propsEntry[0]];

    // console.log('propsEntry:', propsEntry);
    // console.log('PropsContext:', PropsContext);
    if (PropsContext) {
        return (
            <PropsContext.Provider value={propsEntry[1]}>
                {children}
            </PropsContext.Provider>
        );
    } else {
        return (
            <Fragment>
                {children}
            </Fragment>
        );
    }
};

// Coordinate all PropsDistributors with layered srtucture:
const PropsDistributors = (props) => {
    const { accommodatedProps, children } = props;
    const nodes = Object.entries(accommodatedProps).filter(entry => entry[1]).reduce((acc, entry) => (
        <PropsDistributor propsEntry={entry}>{acc}</PropsDistributor>
    ), <Fragment>{children}</Fragment>);

    return (
        <Fragment>
            {nodes}
        </Fragment>
    );
};

// Distribute Hoist Context's value (hoistHanldes):
const HoistDistributor = (props) => {
    const { pointName, hoistHandles, children } = props;
    const HoistContext = HoistRegistry.getHoistContext(pointName);

    return (
        <HoistContext.Provider value={hoistHandles}>
            {children}
        </HoistContext.Provider>
    );
};

class HoistManager extends React.Component {
    constructor(props) {
        super(props);
        // console.log('HoistManager constructor');

        // Create and register a Hoist Context:
        try {
            HoistRegistry.registerHoist(this.props.pointName, React.createContext({}));
        } catch (e) {
            throw e;
        };

        // Initialise a props accommodation for this hoist point:
        this.state = {
            accommodatedProps: {},
        };
    }

    componentWillUnmount() {
        // Deregister the previously registered Hoist Context:
        HoistRegistry.deregisterHoist(this.props.pointName);
    }

    // Internal help function:
    setProps = propsName => value => {
        this.setState(state => {
            const newAccommodatedProps = { ...state.accommodatedProps };
            newAccommodatedProps[propsName] = value;
            return { ...state, accommodatedProps: newAccommodatedProps };
        });
    }

    // Hoist Context's value elements:
    accommodateProps = (propsName, value) => {
        this.setProps(propsName)(value);

        return this.setProps(propsName);
    };
    removeProps = propsName => {
        this.setState(state => {
            const newAccommodatedProps = { ...state.accommodatedProps };
            newAccommodatedProps[propsName] = undefined;
            return { ...state, accommodatedProps: newAccommodatedProps };
        });
    };

    hoistHandles = {
        accommodateProps: this.accommodateProps,
        removeProps: this.removeProps,
    };

    // Wrap its children with Hoist and Props desitributors:
    render() {
        // console.log('HoistManager render call.');
        const { pointName, children } = this.props;
    
        return (
            <HoistDistributor pointName={pointName} hoistHandles={this.hoistHandles}>
                <PropsDistributors accommodatedProps={this.state.accommodatedProps}>
                    {children}
                </PropsDistributors>
            </HoistDistributor>
        );
    }
}

export const propsHoist = pointName => WrappedComponent => props => {
    console.log('propsHoist function call - only once - OK');

    return (
        <HoistManager pointName={pointName}>
            <WrappedComponent { ...props } />
        </HoistManager>
    );
};

export const hoistRegister = pointName => WrappedComponent => props => {
    const MyContext = HoistRegistry.getHoistRegistry()[pointName];

    if (MyContext) {
        return (
            <MyContext.Consumer>
               {contextProps => (<WrappedComponent { ...contextProps } { ...props } />)}
            </MyContext.Consumer>
        );
    } else {
        // This design allows a hoistRegister without the relevant hoist point yet mounted.
        console.warn(`Hoist Context ${pointName} does not exist.`);
        return (
            <WrappedComponent { ...props } />
        );
    }
};
