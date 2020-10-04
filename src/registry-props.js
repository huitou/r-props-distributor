/*
    Props Registry.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
const propsRegistry = {};

const getPropsRegistry = () => ({ ...propsRegistry });

const registerProps = (name, Context) => {
    if (propsRegistry[name]) {
        throw new Error(`Props registry has already a React Context registered with the name ${name}`); 
    }

    propsRegistry[name] = Context;
};

const deregisterProps = (name) => {
    propsRegistry[name] = undefined;
};

const getPropsContext = (name) => {
    if (!propsRegistry[name]) {
        throw new Error(`Hoist registry has not a React Context registered with the name ${name}`); 
    }

    return propsRegistry[name];
};

export default {
    registerProps,
    deregisterProps,
    getPropsContext,
    getPropsRegistry,
};
