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
import { propsConnect, PropsCollect } from '../src/distributor';
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
const WrppdConsumerComponent_1 = propsConnect(PROPS_NAME, unitMapper, HOIST_NAME)(ConsumerComponent_1);

const RegisterPointComponent_1 = () => (<div><WrppdConsumerComponent_1 /></div>);
const WrppdRegisterPointComponent_1 = PropsCollect(PROPS_NAME, registerMapper, HOIST_NAME)(RegisterPointComponent_1);

const HoistPointComponent_1 = props => (
	<div>
		<WrppdRegisterPointComponent_1 {...props} {...namedPropsValue} />
		<WrppdConsumerComponent_1 />
	</div>
);
const WrppdHoistPointComponent_1 = propsHoist(HOIST_NAME)(HoistPointComponent_1);

// --------

const RegisterPointComponent_2 = () => (<div />);
const WrppdRegisterPointComponent_2 = PropsCollect(PROPS_NAME, registerMapper, HOIST_NAME)(RegisterPointComponent_2);

const ConsumerComponent_2 = () => (<div><WrppdRegisterPointComponent_2 {...namedPropsValue} /></div>);
const WrppdConsumerComponent_2 = propsConnect(PROPS_NAME, unitMapper, HOIST_NAME)(ConsumerComponent_2);

const HoistPointComponent_2 = () => (<div><WrppdConsumerComponent_2 /></div>);
const WrppdHoistPointComponent_2 = propsHoist(HOIST_NAME)(HoistPointComponent_2);

// --------

const ConsumerComponent_3 = () => (<div><WrppdConsumerComponent_2 /></div>);
const WrppdConsumerComponent_3 = propsConnect(PROPS_NAME, unitMapper, HOIST_NAME)(ConsumerComponent_3);

const HoistPointComponent_3 = () => (<div><WrppdConsumerComponent_3 /></div>);
const WrppdHoistPointComponent_3 = propsHoist(HOIST_NAME)(HoistPointComponent_3);

// --------

describe("When there are not any propsConnect between a propsHoist and a PropsCollect", () => {
	let enzymeWrapper;

	beforeEach(() => {
		enzymeWrapper = mount(<WrppdHoistPointComponent_1 {...ownProps} />);
	});
	afterEach(() => {
		enzymeWrapper.unmount();
	});

	it("does not cause any loop at all.", () => {
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: { ...namedPropsValue } } });
		expect(enzymeWrapper.find(ConsumerComponent_1).at(0).props()).toEqual(namedPropsValue);
		expect(enzymeWrapper.find(ConsumerComponent_1).at(1).props()).toEqual(namedPropsValue);
		// console.log(enzymeWrapper.debug());
	});
});

describe("When there is a propsConnect between a propsHoist and a PropsCollect", () => {
	let enzymeWrapper;

	beforeEach(() => {
		enzymeWrapper = mount(<WrppdHoistPointComponent_2 {...ownProps} />);
	});
	afterEach(() => {
		enzymeWrapper.unmount();
	});

	it("causes a loop which is blocked by check based on Ramda's equals().", () => {
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: { ...namedPropsValue } } });
		expect(enzymeWrapper.find(ConsumerComponent_2).props()).toEqual(namedPropsValue);
		// console.log(enzymeWrapper.debug());
	});
});

describe("When there are more propsConnects between a propsHoist and a PropsCollect", () => {
	let enzymeWrapper;

	beforeEach(() => {
		enzymeWrapper = mount(<WrppdHoistPointComponent_3 {...ownProps} />);
	});
	afterEach(() => {
		enzymeWrapper.unmount();
	});

	it("causes more loops which are blocked by check based on Ramda's equals().", () => {
		expect(enzymeWrapper.find('HoistManager').state()).toEqual({ accommodatedProps: { [PROPS_NAME]: { ...namedPropsValue } } });
		expect(enzymeWrapper.find(ConsumerComponent_2).props()).toEqual(namedPropsValue);
		expect(enzymeWrapper.find(ConsumerComponent_3).props()).toEqual(namedPropsValue);
		// console.log(enzymeWrapper.debug());
	});
});
