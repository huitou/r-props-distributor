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
import { propsConnect } from './distributor';
import { unitMapper } from './helpers';

const HOIST_NAME = 'myHoist';
const HOIST_NAME_2 = 'myHoist_2';
const PROPS_NAME = 'myProps';
const PROPS_NAME_2 = 'myProps_2';
const namedPropsValue = { someName: 'someValue' };
const namedPropsValue_2 = { someName_2: 'someValue_2' };
const namedPropsValueUpdated = { someOtherName: 'someOtherValue' };
const namedPropsValueUpdated_2 = { someOtherName_2: 'someOtherValue_2' };
const ownProps = { whatever: "whatever" };

const ConsumerComponent = () => (<div />);
const WrppdConsumerComponent = propsConnect(PROPS_NAME, unitMapper, HOIST_NAME)(propsConnect(PROPS_NAME_2, unitMapper, HOIST_NAME)(ConsumerComponent));

const RegisterPointComponent = () => (<div />);
const WrppdRegisterPointComponent = hoistRegister(HOIST_NAME)(RegisterPointComponent);

const HoistPointComponent = (props) => (
	<div>
		<WrppdRegisterPointComponent {...props} />
		<div><WrppdConsumerComponent {...props} /></div>
	</div>
);
const WrppdHoistPointComponent = propsHoist(HOIST_NAME)(HoistPointComponent);

const SiblingComponent = () => (<div />);
const RegisteredSiblingComponent = hoistRegister(HOIST_NAME_2)(SiblingComponent);

describe("propsHoist", () => {
	let enzymeWrapper;

	beforeEach(() => {
		enzymeWrapper = mount(<WrppdHoistPointComponent {...ownProps} />);
	});
	afterEach(() => {
		
	});

	it("decorates a wrapped component without changing its props.", () => {
		expect(enzymeWrapper.find(HoistPointComponent).props()).toEqual(ownProps);
		enzymeWrapper.unmount();
	});

	it("creates and registers a correctly named hoist context.", () => {
		expect(() => HoistRegistry.getHoistContext(HOIST_NAME)).not.toThrow();
		enzymeWrapper.unmount();
	});

	// ----------

	it("causes internal HoistManager to initialise its state.", () => {
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: {} });
		enzymeWrapper.unmount();
	});

	it("causes internal HoistManager to pass props to internal HoistDistributor.", () => {
		expect(enzymeWrapper.find('HoistDistributor').props().hoistName).toBe(HOIST_NAME);
		expect(enzymeWrapper.find('HoistDistributor').props().hoistHandles).toBeDefined();
		expect(enzymeWrapper.find('HoistDistributor').props().children).toBeDefined();
		enzymeWrapper.unmount();
	});

	it("gives internal HoistDistributor hoistHandles which accomodates and removes named props hence distributes accordingly.", () => {
		expect(enzymeWrapper.find(ConsumerComponent).props()).toEqual(ownProps);

		// The following lines are to simulate registering named props contexts.
		PropsRegistry.registerProps(PROPS_NAME);
		PropsRegistry.registerProps(PROPS_NAME_2);

		const valueRefresher = enzymeWrapper.find('HoistDistributor').props().hoistHandles.accommodateProps(PROPS_NAME, namedPropsValue);
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: namedPropsValue } })
		enzymeWrapper.update();
		expect(enzymeWrapper.find(ConsumerComponent).props()).toEqual({ ...ownProps, ...namedPropsValue });

		valueRefresher(namedPropsValueUpdated);
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: namedPropsValueUpdated } })
		enzymeWrapper.update();
		expect(enzymeWrapper.find(ConsumerComponent).props()).toEqual({ ...ownProps, ...namedPropsValueUpdated });

		const valueRefresher_2 = enzymeWrapper.find('HoistDistributor').props().hoistHandles.accommodateProps(PROPS_NAME_2, namedPropsValue_2);
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: namedPropsValueUpdated, [PROPS_NAME_2]: namedPropsValue_2 } })
		enzymeWrapper.update();
		expect(enzymeWrapper.find(ConsumerComponent).props()).toEqual({ ...ownProps, ...namedPropsValueUpdated, ...namedPropsValue_2 });

		valueRefresher_2(namedPropsValueUpdated_2);
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: namedPropsValueUpdated, [PROPS_NAME_2]: namedPropsValueUpdated_2 } })
		enzymeWrapper.update();
		expect(enzymeWrapper.find(ConsumerComponent).props()).toEqual({ ...ownProps, ...namedPropsValueUpdated, ...namedPropsValueUpdated_2 });

		enzymeWrapper.find('HoistDistributor').props().hoistHandles.removeProps(PROPS_NAME_2);
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: namedPropsValueUpdated } })
		enzymeWrapper.update();
		expect(enzymeWrapper.find(ConsumerComponent).props()).toEqual({ ...ownProps, ...namedPropsValueUpdated });

		enzymeWrapper.find('HoistDistributor').props().hoistHandles.removeProps(PROPS_NAME);
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: undefined } })
		enzymeWrapper.update();
		expect(enzymeWrapper.find(ConsumerComponent).props()).toEqual(ownProps);

		// The following lines are to simulate deregistering named props contexts.
		PropsRegistry.deregisterProps(PROPS_NAME);
		PropsRegistry.deregisterProps(PROPS_NAME_2);

		enzymeWrapper.unmount();
	});

	// ----------

	it("causes internal HoistManager to pass props to internal PropsDistributors.", () => {
		expect(enzymeWrapper.find('PropsDistributors').props().accommodatedProps).toEqual({});
		expect(enzymeWrapper.find('PropsDistributors').props().children).toBeDefined();
		enzymeWrapper.unmount();
	});

	it("....", () => {
		expect(enzymeWrapper.find(HoistPointComponent).length).toBe(1);
		expect(enzymeWrapper.find('HoistManager').length).toBe(1);
		expect(enzymeWrapper.find('HoistDistributor').length).toBe(1);
		expect(enzymeWrapper.find('PropsDistributors').length).toBe(1);
		expect(enzymeWrapper.find('PropsDistributor').length).toBe(0);
		enzymeWrapper.unmount();
	});
});

describe("hoistRegister", () => {
	let enzymeWrapper;

	beforeEach(() => {
		enzymeWrapper = mount(
			<div>
				<WrppdHoistPointComponent {...ownProps} />
				<RegisteredSiblingComponent />
			</div>
		);
	});
	afterEach(() => {
		enzymeWrapper.unmount();
	});

	it("decorates a wrapped component injecting hoistHandles.", () => {
		const hoistHandles = enzymeWrapper.find('HoistDistributor').props().hoistHandles;
		expect(enzymeWrapper.find(RegisterPointComponent).props()).toEqual({ ...ownProps, ...hoistHandles });
	});

	it("....", () => {
		expect(enzymeWrapper.find(RegisterPointComponent).length).toBe(1);
	});
});
