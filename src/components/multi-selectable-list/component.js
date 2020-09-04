/*
    Multi-Selectable List Component.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

import React from 'react';
import { arrayOf, any } from 'prop-types';

class MultiSelectableListComponent extends React.Component {
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
            selectedElements: [],
        };
    }

    componentDidMount() {
        const elements = this.props.initialElements.map(
            elem => (Object.freeze({ content: Object.freeze(elem) }))
        );

        this.setState({ elements });
    }

    elements = () => this.state.elements;
    selectedElements = () => this.state.selectedElements;
    
    selectElement = managedElem => {
        if(this.state.elements.includes(managedElem)) {
            if (!this.state.selectedElements.includes(managedElem)) {
                this.setState(({ selectedElements }) => ({ selectedElements: [...selectedElements, managedElem] }));
            } else {
                console.log(`MultiSelectableListComponent: element ${managedElem} is already selected.`);
            }
        } else {
            console.log(`MultiSelectableListComponent: ${managedElem} is not a member of the list hence it cannot be selected.`);
        }
    };
    deselect = managedElem => {
        this.setState(({ selectedElements }) => ({ selectedElements: selectedElements.filter(elem => elem !== managedElem) }));
    };

    addElement = elem => {
        this.setState(({ elements }) => ({ elements: [...elements, Object.freeze({ content: Object.freeze(elem) })] }));
    };
    removeElement = managedElem => {
        this.setState(({ elements, selectedElements }) => ({
            elements: elements.filter(elem => elem !== managedElem),
            selectedElements: selectedElements.filter(elem => elem !== managedElem),
        }));
    };

    render() {
        return null;
    }
}

export default MultiSelectableListComponent;
