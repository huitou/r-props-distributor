/*
    Hoist Registry.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from 'react';

const hoistRegistry = {};

const getHoistRegistry = () => ({ ...hoistRegistry });

const registerHoist = (name) => {
    if (hoistRegistry[name]) {
        // console.warn(`Context registry has already a React Context registered with the name ${name}`); 
        return;
    }

    const Context = React.createContext({});
    const [first, ...rest] = name;
    const displayName = [ first.toUpperCase(), ...rest ].join('');
    Context.displayName = displayName;
    hoistRegistry[name] = Context;
};

const deregisterHoist = (name) => {
    hoistRegistry[name] = undefined;
};

const getHoistContext = (name) => {
    if (!hoistRegistry[name]) {
        throw new Error(`Hoist registry has not a React Context registered with the name ${name}`); 
    }

    return hoistRegistry[name];
};

export default {
    registerHoist,
    deregisterHoist,
    getHoistContext,
    getHoistRegistry,
};
