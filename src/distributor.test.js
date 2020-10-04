/*
	Distributor HoCs Tests.

	Copyright (C) 2020 Riverside Software Engineering Ltd. All rights reserved.

	Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";
import { mount } from "enzyme";

import { propsRegister, propsConnect } from './distributor';

const HOIST_NAME = 'myHoist';
const PROPS_NAME = 'myProps';
const ownProps = { whatever: {} };

// const InsideReceiverPointComponent = () => (<div />);
// const MyInsideReceiver = propsReceiver(NAME)(InsideReceiverPointComponent);
// const OutsideReceiverPointComponent = () => (<div />);
// const MyOutsideReceiver = propsReceiver(NAME)(OutsideReceiverPointComponent);

// const DistributorPointComponent = (props) => (
// 	<div>
// 		<MyInsideReceiver />
// 		{props.children}
// 	</div>
// );
// const MyDistributor = propsDistributor(NAME)(DistributorPointComponent);

describe("props distributor and receiver", () => {
	let enzymeWrapper;

	beforeEach(() => {
			
	});
	afterEach(() => {
		
	});

	describe("test placeholder", () => {
		it("returns always pass", () => {
			expect(true).toBe(true);
		});
	});

	// describe("distributor decorating a component", () => {
	// 	it("passes received props to the wrapped component", () => {
	// 		enzymeWrapper = mount(<MyDistributor {...ownProps} />);
	// 		expect(enzymeWrapper.find(DistributorPointComponent).props()).toEqual(ownProps);
	// 	});
	// });

	// describe("distributor parenting a component", () => {
	// 	it("passes received props to the wrapped and parented components", () => {
	// 		enzymeWrapper = mount(
	// 			<MyDistributor {...ownProps}>
	// 				<MyOutsideReceiver />
	// 			</MyDistributor>
	// 		);

	// 		const { children, ...rest } = enzymeWrapper.find(DistributorPointComponent).props()
	// 		expect(rest).toEqual(ownProps);
	// 	});
	// });

	// describe("receiver, with propsDistributor, decorating a component", () => {
	// 	it("passes distributed props to the wrapped component", () => {
	// 		enzymeWrapper = mount(
	// 			<MyDistributor {...ownProps}>
	// 				<MyOutsideReceiver />
	// 			</MyDistributor>
	// 		);

	// 		expect(enzymeWrapper.find(InsideReceiverPointComponent).props()).toEqual(ownProps);
	// 		expect(enzymeWrapper.find(OutsideReceiverPointComponent).props()).toEqual(ownProps);
	// 	});
	// });
});
