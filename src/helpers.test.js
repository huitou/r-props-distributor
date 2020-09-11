/*
	Helpers test.

	Copyright (C) 2020 Riverside Software Engineering Ltd. All rights reserved.

	Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";
import { mount } from "enzyme";

import Distributor, { unitMapper, getContext, getContextRegistry } from './helpers';

const NAME = 'myFirstContext';
const WrappedComponent = () => (<div />);
const ownProps = { whatever: {} };

describe("Helpers.js", () => {
	describe("unitMapper", () => {
		it("returns the same props passed to it", () => {
			expect(ownProps).toEqual(unitMapper(ownProps));
		});
	});

	describe("getContext", () => {
		it("throws an error if no context was created.", () => {
			expect(() => getContext(NAME)).toThrow();
		});
	});

	describe("Distributor", () => {
		let enzymeWrapper, enzymeWrapperBis;

		const MyDistributor = ({ name, ...ownProps }) => (
			<Distributor _name={name} {...ownProps}>
				<WrappedComponent />
			</Distributor>
		);

		it("mounts WrappedComponent with no props, create a named Context, and then remove named Context when unmounts.", () => {
			enzymeWrapper = mount(<MyDistributor name={NAME} {...ownProps} />);
			
			expect(enzymeWrapper.find(WrappedComponent).props()).toEqual({});
			expect(getContext(NAME)).toBeDefined();
			// console.log(getContextRegistry());

			enzymeWrapper.unmount();
			expect(() => getContext(NAME)).toThrow();
			// console.log(getContextRegistry());
		});

		it("can only mount one instance at a time with the same Context name.", () => {
			enzymeWrapper = mount(<MyDistributor name={NAME} {...ownProps} />);
			expect(() => mount(<MyDistributor name={NAME} {...ownProps} />)).toThrow();
			// console.log(getContextRegistry());
			enzymeWrapper.unmount();
		});

		it("can mount more instances at a time with different Context name.", () => {
			enzymeWrapper = mount(<MyDistributor name={NAME} {...ownProps} />);
			expect(() => enzymeWrapperBis = mount(<MyDistributor name={`${NAME}1`} {...ownProps} />)).not.toThrow();
			// console.log(getContextRegistry());
			enzymeWrapper.unmount();
			enzymeWrapperBis.unmount();
		});

		it("can mount again an instances with the same Context name after the previous one unmaounted.", () => {
			enzymeWrapper = mount(<MyDistributor name={NAME} {...ownProps} />);
			enzymeWrapper.unmount();
			expect(() => enzymeWrapperBis = mount(<MyDistributor name={NAME} {...ownProps} />)).not.toThrow();
			enzymeWrapperBis.unmount();
		});
	});
});
