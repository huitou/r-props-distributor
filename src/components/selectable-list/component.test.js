/*
    Selectable List Component Test.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

import React from 'react';
import { shallow } from "enzyme";

import SelectableListComponent from './component';

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
    selectedElement: undefined,
};

const initialised_state_with_no_initial = {
    elements: [],
    selectedElement: undefined,
};

describe('SelectableListComponent', () => {
    describe('when mounted with initialElements props,', () => {
        let wrapper
        beforeEach(() => {
            wrapper = shallow(<SelectableListComponent initialElements={initialElements}/>);
        })

        it('has a clean initial state', () => {
            expect(wrapper.state()).toEqual(initialised_state);
        });

        it('has an elements handle which returns its state.elements', () => {
            expect(wrapper.instance().elements()).toEqual(wrapper.state().elements);
        });

        it('has a selectedElement handle which returns state.selectedElement', () => {
            expect(wrapper.instance().selectedElement()).toEqual(wrapper.state().selectedElement);
        });

        it('has its elements immutable which are called managed elements', () => {
            expect(() => wrapper.instance().elements()[1].content = 123).toThrow();
        });

        it('has its element content immutable', () => {
            expect(() => wrapper.instance().elements()[1].content.a = 123).toThrow();
        });

        it('has a selectElement handle which sets state.selectedElement only with one of state.elements', () => {
            wrapper.instance().selectElement(wrapper.instance().elements()[1]);
            expect(wrapper.instance().selectedElement()).toEqual(wrapper.instance().elements()[1]);
        });

        it('has a selectElement handle which does not set state.selectedElement with a non-member of state.elements', () => {
            wrapper.instance().selectElement({ content: '' });
            expect(wrapper.instance().selectedElement()).toEqual(undefined);
        });

        it('has a deselect handle which sets state.selectedElement to undefined', () => {
            wrapper.instance().selectElement(wrapper.instance().elements()[1]);
            wrapper.instance().deselect();
            expect(wrapper.instance().selectedElement()).toBe(undefined);
        });

        it('has an addElement handle which appends an element to state.elements thruogh a new managed element', () => {
            const newElement = { b: 'b' };
            const elementsBefore = wrapper.instance().elements();

            wrapper.instance().addElement(newElement);
            expect(wrapper.instance().elements()).toEqual([...elementsBefore, { content: newElement }]);
        });

        it('has an removeElement handle which removes an managed element from state.elements and from state.selectedElement', () => {
            const managedElementToBeRemoved = wrapper.instance().elements()[1];
            wrapper.instance().selectElement(managedElementToBeRemoved);

            const elementsAfter = wrapper.state().elements.filter(elem => elem !== managedElementToBeRemoved);
            wrapper.instance().removeElement(managedElementToBeRemoved);

            expect(wrapper.instance().elements()).toEqual([...elementsAfter]);
            expect(wrapper.instance().selectedElement()).toBe(undefined);
        });
    });

    describe('when mounted without initialElements props,', () => {
        let wrapper
        beforeEach(() => {
            wrapper = shallow(<SelectableListComponent />);
        })

        it('has an "empty" initialised state', () => {
            expect(wrapper.state()).toEqual(initialised_state_with_no_initial);
        });
    });
});
