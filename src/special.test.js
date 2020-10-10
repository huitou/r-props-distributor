/*
	Distributor HoCs Tests.

	Copyright (C) 2020 Riverside Software Engineering Ltd. All rights reserved.

	Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
import React from "react";
import { mount } from "enzyme";

describe("HoistingPropsRegisterHolder", () => {
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
			return <div />;
		}
	}

	const FunctionalInsideFunctional = (props) => {
		console.log('FunctionalInsideFunctional call.');

		return (<ComponentInsideFunctional {...props} />);
	};

	const Functional = (props) => {
		console.log('Functional call.');

		return (<FunctionalInsideFunctional {...props} />);
	};

	class HoistingPropsRegisterHolder extends React.Component {
		constructor(props) {
			super(props);

			this.state = { counter: 0 };
		}

		setCounter = () => {
			this.setState(state => ({ counter: state.counter + 1 }));
		};

		render() {
			return (
				<Functional {...this.props} setCounter={this.setCounter} />
			);
		}
	}

	let enzymeWrapper;
	
	beforeEach(() => {
		enzymeWrapper = mount(<HoistingPropsRegisterHolder something={{}} />);
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
