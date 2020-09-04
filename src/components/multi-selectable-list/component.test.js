/*
    Multi-Selectable List Component Test.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

import React from 'react';
import { shallow } from "enzyme";

import MultiSelectableListComponent from './component';

const initialElements = [
    { a: 'a1' },
    { a: 'a2' },
    'string',
];

const initialised_state = {
    elements: [
        { content: { a: 'a1' } },
        { content: { a: 'a2' } },
        { content: 'string' },
    ],
    selectedElements: [],
};

const initialised_state_with_no_initial = {
    elements: [],
    selectedElements: [],
};

describe('ReadonlySelectableListComponent', () => {
    describe('when mounted with initialElements props,', () => {
        let wrapper
        beforeEach(() => {
            wrapper = shallow(<MultiSelectableListComponent initialElements={initialElements}/>);
        })

        it('has a clean initial state', () => {
            expect(wrapper.state()).toEqual(initialised_state);
        });

        it('has an elements handle which returns its state.elements', () => {
            expect(wrapper.instance().elements()).toEqual(wrapper.state().elements);
        });

        it('has a selectedElements handle which returns state.selectedElements', () => {
            expect(wrapper.instance().selectedElements()).toEqual(wrapper.state().selectedElements);
        });

        it('has its elements immutable which are called managed elements', () => {
            expect(() => wrapper.instance().elements()[1].content = 123).toThrow();
        });

        it('has its element content immutable', () => {
            expect(() => wrapper.instance().elements()[1].content.a = 123).toThrow();
        });

        it('has a selectElement handle which sets state.selectedElements only with one of state.elements', () => {
            wrapper.instance().selectElement(wrapper.instance().elements()[1]);
            expect(wrapper.instance().selectedElements()).toEqual([wrapper.instance().elements()[1]]);
        });

        it('has a selectElement handle which does not set state.selectedElements with a non-member of state.elements', () => {
            wrapper.instance().selectElement({ content: '' });
            expect(wrapper.instance().selectedElements()).toEqual([]);
        });

        it('has a deselect handle which sets state.selectedElements to []', () => {
            wrapper.instance().selectElement(wrapper.instance().elements()[1]);
            wrapper.instance().deselect(wrapper.instance().elements()[1]);
            expect(wrapper.instance().selectedElements()).toEqual([]);
        });

        it('has an addElement handle which appends an element to state.elements thruogh a new managed element', () => {
            const newElement = { b: 'b' };
            const elementsBefore = wrapper.instance().elements();

            wrapper.instance().addElement(newElement);
            expect(wrapper.instance().elements()).toEqual([...elementsBefore, { content: newElement }]);
        });

        it('has an removeElement handle which removes an managed element from state.elements and state.selectedElements', () => {
            const managedElementToBeRemoved = wrapper.instance().elements()[1];
            wrapper.instance().selectElement(managedElementToBeRemoved);

            const elementsAfter = wrapper.state().elements.filter(elem => elem !== managedElementToBeRemoved);
            wrapper.instance().removeElement(managedElementToBeRemoved);

            expect(wrapper.instance().elements()).toEqual([...elementsAfter]);
            expect(wrapper.instance().selectedElements()).toEqual([]);
        });
    });

    describe('when mounted without initialElements props,', () => {
        let wrapper
        beforeEach(() => {
            wrapper = shallow(<MultiSelectableListComponent />);
        })

        it('has an "empty" initialised state', () => {
            expect(wrapper.state()).toEqual(initialised_state_with_no_initial);
        });
    });
});
