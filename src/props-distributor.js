/*
    props distributor HOC.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

import React from 'react';

import { unitMapper, registerContext } from './helpers';

export const propsDistributor = (name, mapper = unitMapper) => (WrappedComponent) => {
    // Create React Context:
    const MyContext = React.createContext({});

    // Register it in global registry:
    registerContext(name, MyContext);

    // Using React Context provider:
    return (
        <MyContext.Provider value={...props}>
            <WrappedComponent {...props} />
        </MyContext.Provider>
    );
};
