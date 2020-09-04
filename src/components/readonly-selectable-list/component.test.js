/*
    Read-only Selectable List Component Test.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

import React from 'react';
import { shallow } from "enzyme";

import ReadonlySelectableListComponent from './component';

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

describe('ReadonlySelectableListComponent', () => {
    describe('when mounted with initialElements props,', () => {
        let wrapper
        beforeEach(() => {
            wrapper = shallow(<ReadonlySelectableListComponent initialElements={initialElements}/>);
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
            expect(wrapper.state().selectedElement).toEqual(wrapper.instance().elements()[1]);
        });

        it('has a selectElement handle which does not set state.selectedElement with a non-member of state.elements', () => {
            wrapper.instance().selectElement({ content: '' });
            expect(wrapper.state().selectedElement).toEqual(undefined);
        });

        it('has a deselect handle which sets state.selectedElement to undefined', () => {
            wrapper.instance().selectElement(wrapper.instance().elements()[1]);
            wrapper.instance().deselect();
            expect(wrapper.state().selectedElement).toBe(undefined);
        });
    });

    describe('when mounted without initialElements props,', () => {
        let wrapper
        beforeEach(() => {
            wrapper = shallow(<ReadonlySelectableListComponent />);
        })

        it('has an initialised state', () => {
            expect(wrapper.state()).toEqual(initialised_state_with_no_initial);
        });
    });
});
