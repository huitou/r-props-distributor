/*
	Distributor HoCs Tests.

	Copyright (C) 2020 Riverside Software Engineering Ltd. All rights reserved.

	Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";
import { mount } from "enzyme";

describe("...", () => {
	class ComponentInsideFunctional extends React.Component {
		componentDidMount() {
			const { setCounter } = this.props;
			setCounter();
			// console.log('ComponentInsideFunctional componentDidMount');
		}

		componentDidUpdate() {
			// ATTENTION: Infinite loop will be created if setCounter is triggered here:
			// const { setCounter } = this.props;
			// setCounter();
			// console.log('ComponentInsideFunctional componentDidUpdate');
		}

		render() {
			return <div>{this.propschildren}</div>;
		}
	}

	const FunctionalInsideFunctional = (props) => {
		const { children, ...rest } = props;
		return (<ComponentInsideFunctional {...rest}>{children}</ComponentInsideFunctional>);
	};

	const Functional = (props) => {
		const { children, ...rest } = props;
		return (<FunctionalInsideFunctional {...rest}>{children}</FunctionalInsideFunctional>);
	};

	// -----------

	const myHoc_2 = () => WrappedComponent => props => (<div><WrappedComponent {...props} /></div>);
	const HoCedComponent_2 = () => (<div />);
	const Root_2 = myHoc_2('test_2')(HoCedComponent_2);

	// -----------

	class HoCingComponent_1 extends React.Component {
		constructor(props) {
			super(props);
			this.state = { counter: 0 };
		}

		setCounter = () => {
			this.setState(state => ({ counter: state.counter + 1 }));
		};

		render() {
			return (
				<Functional {...this.props} setCounter={this.setCounter}>
					{this.props.children}
				</Functional>
			);
		}
	}
	const myHoc_1 = () => WrappedComponent => props => (
		<HoCingComponent_1 {...props}>
			<WrappedComponent {...props} />
		</HoCingComponent_1>
	);
	const HoCedComponent_1 = props => (<Root_2 {...props} />);
	const Root_1 = myHoc_1('test_1')(HoCedComponent_1);

	// -----------

	let enzymeWrapper;
	
	beforeEach(() => {
		enzymeWrapper = mount(<Root_1 something={{}} />);
	});
	afterEach(() => {
		enzymeWrapper.unmount();
	});

	it("returns always pass", () => {
		expect(true).toBe(true);
	});
});
