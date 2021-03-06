/*
    Hoist HoCs.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from 'react';

import HoistRegistry from './registry-hoist';
import PropsRegistry from './registry-props';

export const rootHoistName = '_root_'

// Distribute all named propses through a props context:
const PropsDistributors = props => {
    const { hoistName, accommodatedProps, children } = props;
    const PropsContext = PropsRegistry.getPropsRegistry()[hoistName];

    return (
        <PropsContext.Provider value={{ ...accommodatedProps }}>
            {children}
        </PropsContext.Provider>
    );
};

// Distribute Hoist Context's value (hoistHanldes):
const HoistDistributor = props => {
    const { hoistName, hoistHandles, children } = props;
    const HoistContext = HoistRegistry.getHoistContext(hoistName);

    return (
        <HoistContext.Provider value={hoistHandles}>
            {children}
        </HoistContext.Provider>
    );
};

class HoistManager extends React.Component {
    constructor(props) {
        super(props);

        // Create and register a Hoist Context:
        HoistRegistry.registerHoist(this.props.hoistName);
        PropsRegistry.registerProps(this.props.hoistName);

        // Initialise a props accommodation for this hoist point:
        this.state = {
            accommodatedProps: {},
        };
    }

    // Internal help function:
    setProps = propsName => value => {
        this.setState(state => {
            const newAccommodatedProps = { ...state.accommodatedProps };
            newAccommodatedProps[propsName] = value;
            return { ...state, accommodatedProps: newAccommodatedProps };
        });
    }

    // Accommodate a named props and return a refresh handle:
    accommodateProps = (propsName, value) => {
        this.setProps(propsName)(value);

        return this.setProps(propsName);
    };

    // Remove a named props from accommodation:
    removeProps = propsName => {
        this.setState(state => {
            const newAccommodatedProps = { ...state.accommodatedProps };
            newAccommodatedProps[propsName] = undefined;
            return { ...state, accommodatedProps: newAccommodatedProps };
        });
    };

    // Collect hoist handles for hoist distributor:
    hoistHandles = {
        accommodateProps: this.accommodateProps,
        removeProps: this.removeProps,
    };

    // Wrap its children with Hoist and Props desitributors:
    render() {
        const { hoistName, children } = this.props;
    
        return (
            <HoistDistributor hoistName={hoistName} hoistHandles={this.hoistHandles}>
                <PropsDistributors hoistName={hoistName} accommodatedProps={this.state.accommodatedProps}>
                    {children}
                </PropsDistributors>
            </HoistDistributor>
        );
    }
}

export const propsHoist = (hoistName = rootHoistName) => WrappedComponent => props => (
    <HoistManager hoistName={hoistName}>
        <WrappedComponent { ...props } />
    </HoistManager>
);

export const hoistRegister = (hoistName = rootHoistName) => WrappedComponent => props => {
    const HoistContext = HoistRegistry.getHoistRegistry()[hoistName];

    if (HoistContext) {
        return (
            <HoistContext.Consumer>
               {contextProps => (<WrappedComponent { ...contextProps } { ...props } />)}
            </HoistContext.Consumer>
        );
    } else {
        // This design allows a hoistRegister without the relevant hoist point yet mounted.
        // console.warn(`Hoist Context ${hoistName} does not exist.`);
        return (
            <WrappedComponent { ...props } />
        );
    }
};
