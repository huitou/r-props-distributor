/*
	Hoist HoCs Tests.

	Copyright (C) 2020 Riverside Software Engineering Ltd. All rights reserved.

	Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";
import { mount } from "enzyme";

import HoistRegistry from './registry-hoist';
import PropsRegistry from './registry-props';
import { propsHoist, hoistRegister } from './hoist';

const HOIST_NAME = 'myHoist';
const PROPS_NAME = 'myProps';
const namedPropsValue = { someName: 'someValue' };
const namedPropsValueUpdated = { someOtherName: 'someOtherValue' };
const ownProps = { whatever: {} };

const WrappedComponent = () => (<div />);
const HoistPointComponent = propsHoist(HOIST_NAME)(WrappedComponent);

describe("propsHoist", () => {
	let enzymeWrapper;

	beforeEach(() => {
		enzymeWrapper = mount(<HoistPointComponent {...ownProps} />);
	});
	afterEach(() => {
		
	});

	it("decorates a wrapped component without changing its props.", () => {
		expect(enzymeWrapper.find(WrappedComponent).props()).toEqual(ownProps);
		enzymeWrapper.unmount();
	});

	it("creates and registers a correctly named hoist context.", () => {
		expect(() => HoistRegistry.getHoistContext(HOIST_NAME)).not.toThrow();
		enzymeWrapper.unmount();
	});

	it("deregisters the named hoist context when unmounted.", () => {
		enzymeWrapper.unmount();
		expect(() => HoistRegistry.getHoistContext(HOIST_NAME)).toThrow();
	});

	// ----------

	it("causes internal HoistManager to initialise its state.", () => {
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: {} });
		enzymeWrapper.unmount();
	});

	it("causes internal HoistManager to pass props to internal HoistDistributor.", () => {
		expect(enzymeWrapper.find('HoistDistributor').props().pointName).toBe(HOIST_NAME);
		expect(enzymeWrapper.find('HoistDistributor').props().hoistHandles).toBeDefined();
		expect(enzymeWrapper.find('HoistDistributor').props().children).toBeDefined();
		enzymeWrapper.unmount();
	});

	it("gives internal HoistDistributor hoistHandles which accomodates and removes named props.", () => {
		PropsRegistry.registerProps(PROPS_NAME, React.createContext({}));

		const valueRefresher = enzymeWrapper.find('HoistDistributor').props().hoistHandles.accommodateProps(PROPS_NAME, namedPropsValue);
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: namedPropsValue } })
		console.log(enzymeWrapper.debug());

		valueRefresher(namedPropsValueUpdated);
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: namedPropsValueUpdated } })
		console.log(enzymeWrapper.debug());

		enzymeWrapper.find('HoistDistributor').props().hoistHandles.removeProps(PROPS_NAME);
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: undefined } })

		console.log(enzymeWrapper.debug());
		PropsRegistry.deregisterProps(PROPS_NAME);
		enzymeWrapper.unmount();
	});

	// ----------

	it("causes internal HoistManager to pass props to internal PropsDistributors.", () => {
		expect(enzymeWrapper.find('PropsDistributors').props().accommodatedProps).toEqual({});
		expect(enzymeWrapper.find('PropsDistributors').props().children).toBeDefined();
		enzymeWrapper.unmount();
	});

	// it("....", () => {
	// 	expect(enzymeWrapper.find('HoistManager').length).toBe(1);
	// 	expect(enzymeWrapper.find('HoistDistributor').length).toBe(1);
	// 	expect(enzymeWrapper.find('PropsDistributors').length).toBe(1);
	// 	expect(enzymeWrapper.find('PropsDistributor').length).toBe(0);
	// 	enzymeWrapper.unmount();
	// });
});
