/*
    props distributor HOC.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

import React from 'react';

import Distributor, { unitMapper, getContext } from './helpers';

export const propsDistributor = (name, mapper = unitMapper) => (WrappedComponent) => (props) => {
    const { children, ...rest } = props;
    
    return (
        <Distributor _name={name} {...mapper(rest)}>
            <WrappedComponent {...props} />
        </Distributor>
    );
};

export const propsReceiver = (name, mapper = unitMapper) => (WrappedComponent) => (props) => {
    const MyContext = getContext(name);

    return (
        <MyContext.Consumer>
           {contextProps => (<WrappedComponent { ...mapper(contextProps) } { ...props } />)}
        </MyContext.Consumer>
    );
};
