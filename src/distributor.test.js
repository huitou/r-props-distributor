/*
	Distributor HoCs Tests.

	Copyright (C) 2020 Riverside Software Engineering Ltd. All rights reserved.

	Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";
import { mount } from "enzyme";

import HoistRegistry from './registry-hoist';
import PropsRegistry from './registry-props';

import { propsHoist, hoistRegister } from './hoist';
import { propsRegister, propsConnect } from './distributor';
import { unitMapper } from './helpers';


const HOIST_NAME = 'myHoist';
const PROPS_NAME = 'myProps';
const ownProps = { whatever: {} };
const ownTopProps = { somethingElse: {} };

const propsMapper_1 = (props) => {
	const { whatever } = props;
	return { whatever };
};

describe("propsRegister", () => {
	const PropsSourceComponent = () => (<div />);
	const PropsRegisteringComponent = propsRegister(PROPS_NAME, propsMapper_1, HOIST_NAME)(PropsSourceComponent);

	const ConsumerComponent = () => (<div />);
	const ConnectingConsumerComponent = propsConnect(PROPS_NAME, unitMapper, HOIST_NAME)(ConsumerComponent);

	const WrappedComponent = (props) => (
		<div>
			<div><PropsRegisteringComponent {...props} {...ownProps} /></div>
			<div><div><ConnectingConsumerComponent {...props} /></div></div>
		</div>
	);
	const HoistPointComponent = propsHoist(HOIST_NAME)(WrappedComponent);

	describe("when named Hoist Point exists", () => {
		let enzymeWrapper;
	
		beforeEach(() => {
			enzymeWrapper = mount(<HoistPointComponent {...ownTopProps} />);
		});
		afterEach(() => {
			enzymeWrapper.unmount();
		});
	
		it("injects registered named props to consumer component if connected.", () => {
			expect(HoistRegistry.getHoistContext(HOIST_NAME)).toBeDefined();
			expect(PropsRegistry.getPropsContext(HOIST_NAME)).toBeDefined();
			expect(enzymeWrapper.find(ConsumerComponent).props()).toEqual({ ...ownTopProps, whatever: {} });
		});
	});

	describe("when named Hoist Point does not exist", () => {
		let enzymeWrapper;
	
		beforeEach(() => {
			enzymeWrapper = mount(<WrappedComponent {...ownTopProps} />);
		});
		afterEach(() => {
			enzymeWrapper.unmount();
		});
	
		it("injects empty object to consumer component if connected.", () => {
			expect(HoistRegistry.getHoistRegistry[HOIST_NAME]).toBeFalsy();
			expect(PropsRegistry.getPropsRegistry[HOIST_NAME]).toBeFalsy();
			expect(enzymeWrapper.find(ConsumerComponent).props()).toEqual({ ...ownTopProps });
		});
	});
});
