/*
	Distributor HoCs Tests.

	Copyright (C) 2020 Riverside Software Engineering Ltd. All rights reserved.

	Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";
import { mount } from "enzyme";

describe("...", () => {
	class ComponentInsideFunctional extends React.Component {
		constructor(props) {
			super(props);

			console.log('ComponentInsideFunctional with props:', props);
		}

		componentDidMount() {
			const { setCounter } = this.props;
	
			setCounter();
	
			console.log('ComponentInsideFunctional componentDidMount');
		}

		componentDidUpdate() {
			// const { setCounter } = this.props;
	
			// setCounter();
	
			console.log('ComponentInsideFunctional componentDidUpdate');
		}

		render() {
			const { children } = this.props;

			return <div>{children}</div>;
		}
	}

	const FunctionalInsideFunctional = (props) => {
		console.log('FunctionalInsideFunctional call.');
		const { children, ...rest } = props;

		return (<ComponentInsideFunctional {...rest}>{children}</ComponentInsideFunctional>);
	};

	const Functional = (props) => {
		console.log('Functional call.');
		const { children, ...rest } = props;

		return (<FunctionalInsideFunctional {...rest}>{children}</FunctionalInsideFunctional>);
	};

	// -----------

	const myHoc_2 = (param) => WrappedComponent => props => {
		console.log('myHoc_2 with param:', param);

		return (
			<div><WrappedComponent {...props} /></div>
		);
	};

	class HoCedComponent_2 extends React.Component {
		constructor(props) {
			super(props);

			console.log('HoCedComponent_2 with props:', props);
		}

		render() {
			return <div />;
		}
	}

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
			if (this.state.counter === 0) {
				return (
					<Functional {...this.props} setCounter={this.setCounter}>
						{this.props.children}
					</Functional>
				);
			} else {
				return (
					<div>
						<Functional {...this.props} setCounter={this.setCounter}>
							{this.props.children}
						</Functional>
					</div>
				);
			}
		}
	}

	const myHoc_1 = param => WrappedComponent => props => {
		console.log('myHoc_1 with param:', param);

		return (
			<HoCingComponent_1 {...props}>
				<WrappedComponent {...props} />
			</HoCingComponent_1>
		);
	};

	class HoCedComponent_1 extends React.Component {
		constructor(props) {
			super(props);
			console.log('HoCedComponent_1 constructor call - only once - OK');
		}

		render() {
			return <Root_2 {...this.props} />;
		}
	}

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
		// enzymeWrapper.update();
		console.log(enzymeWrapper.debug());
		expect(true).toBe(true);
	});
});
