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

        // Request accommodation for named props with its value:
        this.propsRefresh = accommodateProps && accommodateProps(propsName, rest);
    }

    componentDidUpdate() {
        const { propsName, accommodateProps, removeProps, children, ...rest } = this.props;

        this.propsRefresh && this.propsRefresh(rest)
    }

    componentWillUnmount() {
        const { propsName, removeProps } = this.props;

        // Remove the named props from accommodation:
        removeProps && removeProps(propsName);
    }

    render() {
        return (<Fragment>{this.props.children}</Fragment>);
    }
}

class HoistingPropsRegisterHolder extends React.Component {
    constructor(props) {
        super(props);

        this.Component = hoistRegister(props.pointName)(PropsRegister);
    }

    render() {
        const HoistingPropsRegister = this.Component;
        const { pointName, propsName, children, ...rest } = this.props;

        return (
            <HoistingPropsRegister propsName={propsName} {...rest}>
                {children}
            </HoistingPropsRegister>
        );
    }
}

export const propsRegister = (propsName, mapper = unitMapper, pointName) => (WrappedComponent) => (props) => {
    return (
        <HoistingPropsRegisterHolder pointName={pointName} propsName={propsName} {...mapper(props)}>
            <WrappedComponent {...props} />
        </HoistingPropsRegisterHolder>
    );
};

export const propsConnect = (propsName, mapper = unitMapper, pointName) => (WrappedComponent) => (props) => {
    const PropsContext = PropsRegistry.getPropsRegistry()[pointName];

    if (PropsContext) {
        return (
            <PropsContext.Consumer>
               {contextProps => (<WrappedComponent { ...mapper(contextProps[propsName]) } { ...props } />)}
            </PropsContext.Consumer>
        );
    } else {
        // This design allows a propsConnect without the relevant named props yet registered.
        // console.warn(`Props ${propsName} does not yet registered.`);
        return (
            <WrappedComponent { ...props } />
        );
    }
};
