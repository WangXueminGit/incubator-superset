import React from 'react';
import PropTypes from 'prop-types';
import ControlHeader from './ControlHeader';

import CheckboxControl from './controls/CheckboxControl';
import ColumnControl from './controls/ColumnControl';
import RowControl from './controls/RowControl';
import FilterControl from './controls/FilterControl';
import HiddenControl from './controls/HiddenControl';
import SelectControl from './controls/SelectControl';
import TextAreaControl from './controls/TextAreaControl';
import TextControl from './controls/TextControl';
import ColorPickerControl from './controls/ColorPickerControl';

const controlMap = {
  CheckboxControl,
  ColumnControl,
  RowControl,
  FilterControl,
  HiddenControl,
  SelectControl,
  TextAreaControl,
  TextControl,
  ColorPickerControl,
};
const controlTypes = Object.keys(controlMap);

const propTypes = {
  actions: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  formData: PropTypes.object,
  type: PropTypes.oneOf(controlTypes).isRequired,
  hidden: PropTypes.bool,
  label: PropTypes.string.isRequired,
  choices: PropTypes.arrayOf(PropTypes.array),
  description: PropTypes.string,
  places: PropTypes.number,
  validators: PropTypes.array,
  validationErrors: PropTypes.array,
  renderTrigger: PropTypes.bool,
  rightNode: PropTypes.node,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ]),
};

const defaultProps = {
  renderTrigger: false,
  formData: {},
  validators: [],
  hidden: false,
  validationErrors: [],
};

export default class Control extends React.PureComponent {
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.validateAndSetValue(this.props.value, []);
  }
  onChange(value, errors) {
    this.validateAndSetValue(value, errors);
  }
  validateAndSetValue(value, errors) {
    let validationErrors = this.props.validationErrors;
    let currentErrors = this.validate(value);
    if (errors && errors.length > 0) {
      currentErrors = validationErrors.concat(errors);
    }
    if (validationErrors.length + currentErrors.length > 0) {
      validationErrors = currentErrors;
    }

    if (value !== this.props.value || validationErrors !== this.props.validationErrors) {
      this.props.actions.setControlValue(this.props.name, value, validationErrors);
    }
  }
  validate(value) {
    const validators = this.props.validators;
    const validationErrors = [];
    if (validators && validators.length > 0) {
      validators.forEach((f) => {
        const v = f(value);
        if (v) {
          validationErrors.push(v);
        }
      });
    }
    return validationErrors;
  }
  render() {
    const ControlType = controlMap[this.props.type];
    const divStyle = this.props.hidden ? { display: 'none' } : null;
    return (
      <div style={divStyle}>
        <ControlHeader
          label={this.props.label}
          description={this.props.description}
          renderTrigger={this.props.renderTrigger}
          validationErrors={this.props.validationErrors}
          rightNode={this.props.rightNode}
        />
        <ControlType
          onChange={this.onChange}
          {...this.props}
        />
      </div>
    );
  }
}

Control.propTypes = propTypes;
Control.defaultProps = defaultProps;
