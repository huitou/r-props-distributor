/*
    Distributor HoCs.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React, { Fragment } from 'react';

import PropsRegistry from './registry-props';
import { hoistRegister } from './hoist';
import { unitMapper } from './helpers';

class PropsRegister extends React.Component {
    constructor(props) {
        super(props);

        const { propsName, accommodateProps, removeProps, children, ...rest } = props;

        // Create and register a Props Context:
        try {
            PropsRegistry.registerProps(propsName, React.createContext({}));
        } catch (e) {
            throw e;
        };

        // Request accommodation for named props with its value:
        this.propsRefresh = accommodateProps && accommodateProps(propsName, rest);
    }

    componentWillUnmount() {
        const { propsName, removeProps } = this.props;

        // Remove the named props from accommodation:
        removeProps && removeProps(propsName);

        // Deregister the previously registered Props Context:
        PropsRegistry.deregisterProps(propsName);
    }

    componentDidUpdate() {
        const { propsName, accommodateProps, removeProps, children, ...rest } = props;

        this.propsRefresh && this.propsRefresh(rest)
    }

    render() {
        return (<Fragment>{this.props.children}</Fragment>);
    }
}

export const propsRegister = (propsName, mapper = unitMapper, pointName) => (WrappedComponent) => (props) => {
    const { children, ...rest } = props;
    const HoistingPropsRegister = hoistRegister(pointName)(PropsRegister);
    
    return (
        <HoistingPropsRegister propsName={propsName} {...mapper(rest)}>
            <WrappedComponent {...props} />
        </HoistingPropsRegister>
    );
};

export const propsConnect = (propsName, mapper = unitMapper) => (WrappedComponent) => (props) => {
    const MyContext = PropsRegistry.getPropsContext(propsName);

    return (
        <MyContext.Consumer>
           {contextProps => (<WrappedComponent { ...mapper(contextProps) } { ...props } />)}
        </MyContext.Consumer>
    );
};
