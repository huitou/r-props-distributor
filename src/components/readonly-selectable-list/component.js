/*
    Read-only Selectable List Component.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

import React from 'react';
import { arrayOf, any } from 'prop-types';

class ReadonlySelectableListComponent extends React.Component {
    static propTypes = {
        initialElements: arrayOf(any),
    };
    static defaultProps = {
        initialElements: []
    };

    constructor(props) {
        super(props);
        this.state = {
            elements: undefined,
            selectedElement: undefined,
        };
    }

    componentDidMount() {
        const elements = this.props.initialElements.map(
            elem => (Object.freeze({ content: Object.freeze(elem) }))
        );

        this.setState({ elements });
    }

    elements = () => this.state.elements;
    selectedElement = () => this.state.selectedElement;
    
    selectElement = managedElem => {
        if(this.state.elements.includes(managedElem)) {
            this.setState({ selectedElement: managedElem });
        } else {
            console.log(`ReadonlySelectableListComponent: ${managedElem} is not a member of the list hence it cannot be selected.`);
        }
    };
    deselect = () => {
        this.setState({ selectedElement: undefined });
    };

    render() {
        return null;
    }
}

export default ReadonlySelectableListComponent;
