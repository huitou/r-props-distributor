import { Collector, withCollector } from 'r-socs-core';
import React from 'react';
import { arrayOf, any } from 'prop-types';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class ReadonlySelectableListCollector extends Collector {}

_defineProperty(ReadonlySelectableListCollector, "handleMap", {
  hfu: {
    hifu: {
      elements: 'elements',
      selectedElement: 'selectedElement'
    },
    hefu: {
      selectElement: 'selectElement',
      deselect: 'deselect'
    }
  }
});

class ReadonlyMultiSelectableListCollector extends Collector {}

_defineProperty(ReadonlyMultiSelectableListCollector, "handleMap", {
  hfu: {
    hifu: {
      elements: 'elements',
      selectedElements: 'selectedElements'
    },
    hefu: {
      selectElement: 'selectElement',
      deselectElement: 'deselectElement'
    }
  }
});

class SelectableListCollector extends Collector {}

_defineProperty(SelectableListCollector, "handleMap", {
  hfu: {
    hifu: {
      elements: 'elements',
      selectedElement: 'selectedElement'
    },
    hefu: {
      selectElement: 'selectElement',
      deselect: 'deselect',
      addElement: 'addElement',
      removeElement: 'removeElement'
    }
  }
});

class MultiSelectableListCollector extends Collector {}

_defineProperty(MultiSelectableListCollector, "handleMap", {
  hfu: {
    hifu: {
      elements: 'elements',
      selectedElements: 'selectedElements'
    },
    hefu: {
      selectElement: 'selectElement',
      deselectElement: 'deselectElement',
      addElement: 'addElement',
      removeElement: 'removeElement'
    }
  }
});

class ReadonlySelectableListComponent extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "elements", () => this.state.elements);

    _defineProperty(this, "selectedElement", () => this.state.selectedElement);

    _defineProperty(this, "selectElement", managedElem => {
      if (this.state.elements.includes(managedElem)) {
        this.setState({
          selectedElement: managedElem
        });
      } else {
        console.log(`ReadonlySelectableListComponent: ${managedElem} is not a member of the list hence it cannot be selected.`);
      }
    });

    _defineProperty(this, "deselect", () => {
      this.setState({
        selectedElement: undefined
      });
    });

    this.state = {
      elements: undefined,
      selectedElement: undefined
    };
  }

  componentDidMount() {
    const elements = this.props.initialElements.map(elem => Object.freeze({
      content: Object.freeze(elem)
    }));
    this.setState({
      elements
    });
  }

  render() {
    return null;
  }

}

_defineProperty(ReadonlySelectableListComponent, "propTypes", {
  initialElements: arrayOf(any)
});

_defineProperty(ReadonlySelectableListComponent, "defaultProps", {
  initialElements: []
});

/*
    List Component Exporter.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

class ReadonlyMultiSelectableListComponent extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "elements", () => this.state.elements);

    _defineProperty(this, "selectedElements", () => this.state.selectedElements);

    _defineProperty(this, "selectElement", managedElem => {
      if (this.state.elements.includes(managedElem)) {
        if (!this.state.selectedElements.includes(managedElem)) {
          this.setState(({
            selectedElements
          }) => ({
            selectedElements: [...selectedElements, managedElem]
          }));
        } else {
          console.log(`ReadonlyMultiSelectableListComponent: element ${managedElem} is already selected.`);
        }
      } else {
        console.log(`ReadonlyMultiSelectableListComponent: ${managedElem} is not a member of the list hence it cannot be selected.`);
      }
    });

    _defineProperty(this, "deselect", managedElem => {
      this.setState(({
        selectedElements
      }) => ({
        selectedElements: selectedElements.filter(elem => elem !== managedElem)
      }));
    });

    this.state = {
      elements: undefined,
      selectedElements: []
    };
  }

  componentDidMount() {
    const elements = this.props.initialElements.map(elem => Object.freeze({
      content: Object.freeze(elem)
    }));
    this.setState({
      elements
    });
  }

  render() {
    return null;
  }

}

_defineProperty(ReadonlyMultiSelectableListComponent, "propTypes", {
  initialElements: arrayOf(any)
});

_defineProperty(ReadonlyMultiSelectableListComponent, "defaultProps", {
  initialElements: []
});

/*
    List Component Exporter.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

class SelectableListComponent extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "elements", () => this.state.elements);

    _defineProperty(this, "selectedElement", () => this.state.selectedElement);

    _defineProperty(this, "selectElement", managedElem => {
      if (this.state.elements.includes(managedElem)) {
        this.setState({
          selectedElement: managedElem
        });
      } else {
        console.log(`SelectableListComponent: ${managedElem} is not a member of the list hence it cannot be selected.`);
      }
    });

    _defineProperty(this, "deselect", () => {
      this.setState({
        selectedElement: undefined
      });
    });

    _defineProperty(this, "addElement", elem => {
      this.setState(({
        elements
      }) => ({
        elements: [...elements, Object.freeze({
          content: Object.freeze(elem)
        })]
      }));
    });

    _defineProperty(this, "removeElement", managedElem => {
      this.setState(({
        elements,
        selectedElement
      }) => ({
        elements: elements.filter(elem => elem !== managedElem),
        selectedElement: selectedElement === managedElem ? undefined : selectedElement
      }));
    });

    this.state = {
      elements: undefined,
      selectedElement: undefined
    };
  }

  componentDidMount() {
    const elements = this.props.initialElements.map(elem => Object.freeze({
      content: Object.freeze(elem)
    }));
    this.setState({
      elements
    });
  }

  render() {
    return null;
  }

}

_defineProperty(SelectableListComponent, "propTypes", {
  initialElements: arrayOf(any)
});

_defineProperty(SelectableListComponent, "defaultProps", {
  initialElements: []
});

/*
    List Component Exporter.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

class MultiSelectableListComponent extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "elements", () => this.state.elements);

    _defineProperty(this, "selectedElements", () => this.state.selectedElements);

    _defineProperty(this, "selectElement", managedElem => {
      if (this.state.elements.includes(managedElem)) {
        if (!this.state.selectedElements.includes(managedElem)) {
          this.setState(({
            selectedElements
          }) => ({
            selectedElements: [...selectedElements, managedElem]
          }));
        } else {
          console.log(`MultiSelectableListComponent: element ${managedElem} is already selected.`);
        }
      } else {
        console.log(`MultiSelectableListComponent: ${managedElem} is not a member of the list hence it cannot be selected.`);
      }
    });

    _defineProperty(this, "deselect", managedElem => {
      this.setState(({
        selectedElements
      }) => ({
        selectedElements: selectedElements.filter(elem => elem !== managedElem)
      }));
    });

    _defineProperty(this, "addElement", elem => {
      this.setState(({
        elements
      }) => ({
        elements: [...elements, Object.freeze({
          content: Object.freeze(elem)
        })]
      }));
    });

    _defineProperty(this, "removeElement", managedElem => {
      this.setState(({
        elements,
        selectedElements
      }) => ({
        elements: elements.filter(elem => elem !== managedElem),
        selectedElements: selectedElements.filter(elem => elem !== managedElem)
      }));
    });

    this.state = {
      elements: undefined,
      selectedElements: []
    };
  }

  componentDidMount() {
    const elements = this.props.initialElements.map(elem => Object.freeze({
      content: Object.freeze(elem)
    }));
    this.setState({
      elements
    });
  }

  render() {
    return null;
  }

}

_defineProperty(MultiSelectableListComponent, "propTypes", {
  initialElements: arrayOf(any)
});

_defineProperty(MultiSelectableListComponent, "defaultProps", {
  initialElements: []
});

/*
    List Component Exporter.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/

/*
    List Models/Services Composer.

    Copyright (c) 2019-2020 Riverside Software Engineering Ltd. All rights reserved.

    Licensed under the MIT License. See LICENSE file in the project root for full license information.
*/
const ReadonlySelectableListModel = withCollector(ReadonlySelectableListCollector)(ReadonlySelectableListComponent);
const ReadonlyMultiSelectableListModel = withCollector(ReadonlyMultiSelectableListCollector)(ReadonlyMultiSelectableListComponent);
const SelectableListModel = withCollector(SelectableListCollector)(SelectableListComponent);
const MultiSelectableListModel = withCollector(MultiSelectableListCollector)(MultiSelectableListComponent);

export { MultiSelectableListModel, ReadonlyMultiSelectableListModel, ReadonlySelectableListModel, SelectableListModel };
