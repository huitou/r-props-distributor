/*
    Helpers for props distributor and receiver HOCs.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

export const unitMapper = (props) => ({ ...props });

export const contextRegistryName = '__R_SOCS_PROPS_DISTRIBUTOR_CONTEXTS__';

export const getContextRegistry = () => {
    if (!window[contextRegistryName]) {
        window[contextRegistryName] = {};
    }

    return window[contextRegistryName];
};

export const registerContext = (name, Context) => {
    const registry = getContextRegistry();

    if (registry[name]) {
        throw new Error(`${contextRegistryName} registry has already a React Context registered with the name ${name}`); 
    }

    registry[name] = Context;
};

export const getContext = (name) => {
    const registry = getContextRegistry();

    if (!registry[name]) {
        throw new Error(`${contextRegistryName} registry has not a React Context registered with the name ${name}`); 
    }

    return registry[name];
};
