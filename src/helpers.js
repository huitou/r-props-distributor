/*
    Helpers for props distributor and receiver HOCs.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";

const contextRegistry = {};

export const getContextRegistry = () => ({ ...contextRegistry });

const registerContext = (name, Context) => {
    if (contextRegistry[name]) {
        throw new Error(`Context registry has already a React Context registered with the name ${name}`); 
    }

    contextRegistry[name] = Context;
};

const deregisterContext = (name) => {
    contextRegistry[name] = undefined;
};

export const getContext = (name) => {
    if (!contextRegistry[name]) {
        throw new Error(`Context registry has not a React Context registered with the name ${name}`); 
    }

    return contextRegistry[name];
};

export const unitMapper = (props) => ({ ...props });

class Distributor extends React.Component {
    constructor(props) {
        super(props);

        this.MyContext = React.createContext({});
        try {
            registerContext(this.props._name, this.MyContext);
        } catch (e) {
            throw e;
        };
    }

    componentWillUnmount() {
        deregisterContext(this.props._name);
    }

    render() {
        const { _name, children, ...rest } = this.props;
        const MyContext = this.MyContext;

        return (
            <MyContext.Provider value={{ ...rest }}>
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default Distributor;
