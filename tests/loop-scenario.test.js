/*
	Loop Scenario Tests.

	Copyright (C) 2020 Riverside Software Engineering Ltd. All rights reserved.

	Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";
import { mount } from "enzyme";

// import HoistRegistry from '../src/registry-hoist';
// import PropsRegistry from '../src/registry-props';
import { propsHoist } from '../src/hoist';
import { propsConnect, propsRegister } from '../src/distributor';
import { unitMapper } from '../src/helpers';

const HOIST_NAME = 'myHoist';
// const HOIST_NAME_2 = 'myHoist_2';
const PROPS_NAME = 'myProps';
// const PROPS_NAME_2 = 'myProps_2';
const namedPropsValue = { someName: 'someValue' };
// const namedPropsValue_2 = { someName_2: 'someValue_2' };
// const namedPropsValueUpdated = { someOtherName: 'someOtherValue' };
// const namedPropsValueUpdated_2 = { someOtherName_2: 'someOtherValue_2' };
const ownProps = { ownProps: "whatever" };

const registerMapper = props => ({ someName: props.someName });

// ---------

const ConsumerComponent_1 = () => (<div />);
const HoCedConsumerComponent_1 = propsConnect(PROPS_NAME, unitMapper, HOIST_NAME)(ConsumerComponent_1);

const RegisterPointComponent_1 = () => (<div><HoCedConsumerComponent_1 /></div>);
const HoCedRegisterPointComponent_1 = propsRegister(PROPS_NAME, registerMapper, HOIST_NAME)(RegisterPointComponent_1);

const HoistPointComponent_1 = (props) => (
	<div>
		<HoCedRegisterPointComponent_1 {...props} {...namedPropsValue} />
		<HoCedConsumerComponent_1 />
	</div>
);
const HoCedHoistPointComponent_1 = propsHoist(HOIST_NAME)(HoistPointComponent_1);

// --------

const RegisterPointComponent_2 = () => (<div />);
const HoCedRegisterPointComponent_2 = propsRegister(PROPS_NAME, registerMapper, HOIST_NAME)(RegisterPointComponent_2);

const ConsumerComponent_2 = () => (<div><HoCedRegisterPointComponent_2 {...namedPropsValue} /></div>);
const HoCedConsumerComponent_2 = propsConnect(PROPS_NAME, unitMapper, HOIST_NAME)(ConsumerComponent_2);

const HoistPointComponent_2 = () => (
	<div>
		<HoCedConsumerComponent_2 />
	</div>
);
const HoCedHoistPointComponent_2 = propsHoist(HOIST_NAME)(HoistPointComponent_2);

// --------

describe("When there are not any propsConnect between a propsHoist and a propsRegister", () => {
	let enzymeWrapper;

	beforeEach(() => {
		enzymeWrapper = mount(<HoCedHoistPointComponent_1 {...ownProps} />);
	});
	afterEach(() => {
		enzymeWrapper.unmount();
	});

	it("does not cause any loop at all.", () => {
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: { ...namedPropsValue } } });
		console.log(enzymeWrapper.debug());
	});
});

describe("When there is apropsConnect between a propsHoist and a propsRegister", () => {
	let enzymeWrapper;

	beforeEach(() => {
		enzymeWrapper = mount(<HoCedHoistPointComponent_2 {...ownProps} />);
	});
	afterEach(() => {
		enzymeWrapper.unmount();
	});

	it("causes a loop which is blocked by ....", () => {
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: { ...namedPropsValue } } });
		console.log(enzymeWrapper.debug());
	});
});
