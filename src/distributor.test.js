/*
	Distributor HoCs Tests.

	Copyright (C) 2020 Riverside Software Engineering Ltd. All rights reserved.

	Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";
import { mount } from "enzyme";

import PropsRegistry from './registry-props';
import { propsHoist, hoistRegister } from './hoist';
import { propsRegister, propsConnect } from './distributor';

const HOIST_NAME = 'myHoist';
const PROPS_NAME = 'myProps';
const ownProps = { whatever: {} };

const propsMapper_1 = (props) => {
	const { whatever } = props;
	return { whatever };
};

const PropsSourceComponent = () => (<div />);
const PropsRegisteringComponent = propsRegister(PROPS_NAME, propsMapper_1, HOIST_NAME)(PropsSourceComponent);

describe("propsRegister", () => {
	beforeEach(() => {
			
	});
	afterEach(() => {
		
	});

	describe("when named Hoist Point exists", () => {
		
		const ConsumerComponent = () => (<div />);
		const ConnectingConsumerComponent = (props) => {
			const MyPropsContext = PropsRegistry.getPropsRegistry()[HOIST_NAME];
		
			const MyWrapped = (myProps) => MyPropsContext
				? (
					<MyPropsContext.Consumer>
						{(contextProps) => {
							const injectedProps = { [HOIST_NAME]: {...contextProps} };
							console.log(injectedProps);
							return (<ConsumerComponent {...myProps} {...injectedProps} />);
						}}
					</MyPropsContext.Consumer>
				)
				: (<ConsumerComponent {...props} />);
		
			return <MyWrapped {...props} />;
		};

		class WrappedComponent extends React.Component {
			constructor(props) {
				super(props);
				this.MyRegisteringComponent = PropsRegisteringComponent;
			}

			render() {
				const MyRegisteringComponent = this.MyRegisteringComponent;
				return (
					<div>
						<div><MyRegisteringComponent {...this.props} {...ownProps} /></div>
						<div><div><ConnectingConsumerComponent {...this.props} /></div></div>
					</div>
				);
			}
		};
		const HoistPointComponent = propsHoist(HOIST_NAME)(WrappedComponent);
		

		let enzymeWrapper;
	
		beforeEach(() => {
			enzymeWrapper = mount(<HoistPointComponent somethingElse={{}} />);
		});
		afterEach(() => {
			enzymeWrapper.unmount();
		});
	
		it("returns always pass", () => {
			enzymeWrapper.update();
			console.log(enzymeWrapper.debug());
			expect(true).toBe(true);
		});
	});

	// describe("when named Hoist Point does not exist", () => {
	// 	let enzymeWrapper;
	
	// 	beforeEach(() => {
				
	// 	});
	// 	afterEach(() => {
			
	// 	});
	
	// 	it("returns always pass", () => {
	// 		expect(true).toBe(true);
	// 	});
	// });
});

// describe("propsConnect", () => {
// 	beforeEach(() => {
			
// 	});
// 	afterEach(() => {
		
// 	});

// 	it("returns always pass", () => {
// 		expect(true).toBe(true);
// 	});
// });

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
