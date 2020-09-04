/*
    props receiver HOC.

    Copyright (c) 2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

import { unitMapper, getContext } from './helpers';

export const propsReceiver = (name, mapper = unitMapper) => (WrappedComponent) => {
    const MyContext = getContext(name);

    return (
        <MyContext.Consumer>
           {props => (<WrappedComponent {...props} />)}
        </MyContext.Consumer>
    );
};
