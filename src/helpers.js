/*
    Helpers for props distributor and receiver HOCs.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

export const unitMapper = (props) => ({ ...props });

const contextRegistry = {};

export const registerContext = (name, Context) => {
    if (contextRegistry[name]) {
        throw new Error(`Context registry has already a React Context registered with the name ${name}`); 
    }

    contextRegistry[name] = Context;
};

export const getContext = (name) => {
    if (!contextRegistry[name]) {
        throw new Error(`Context registry has not a React Context registered with the name ${name}`); 
    }

    return contextRegistry[name];
};
