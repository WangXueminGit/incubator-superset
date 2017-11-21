import React from 'react';
import PropTypes from 'prop-types';
import Select, { Creatable } from 'react-select';

const propTypes = {
  choices: PropTypes.array,
  clearable: PropTypes.bool,
  description: PropTypes.string,
  freeForm: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  multi: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  hiddenChoices: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
};

const defaultProps = {
  choices: [],
  hiddenChoices: [],
  clearable: true,
  description: null,
  freeForm: false,
  isLoading: false,
  label: null,
  multi: false,
  onChange: () => {},
};

var renderColorbox = function (backgroundColor) {
  return {
    background: backgroundColor,
    width: '10px',
    height: '10px',
    display: 'inline-block',
    left: '5px',
    top: '5px',
    marginRight: '10px'
  }  
}

export default class SelectControl extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { options: this.getOptions(props) };
    this.onChange = this.onChange.bind(this);
    this.renderOption = this.renderOption.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.choices !== this.props.choices) {
      if (this.props.name === "pivot_columns_sort"){
        this.handleOptionChange(this.props, nextProps);
      }
      const options = this.getOptions(nextProps);
      this.setState({ options });
    }
  }
  onChange(opt) {
    let optionValue = opt ? opt.value : null;
    // if multi, return options values as an array
    if (this.props.multi) {
      optionValue = opt ? opt.map(o => o.value) : null;
    }
    this.props.onChange(optionValue);
  }
  handleOptionChange(props, nextProps) {
    const nextPropsChoices = nextProps.choices
    const nextPropsChoicesLabels = nextProps.choices.map(o => o[0])
    const nextPropsValue = nextProps.value
    // Remove obsolete selections
    nextPropsValue.forEach(value => {
      if (!nextPropsChoicesLabels.includes(value)) {
        nextProps.value.splice(value, 1);
      }
    })
    // Update choices based on current values
    nextProps.hiddenChoices.length = 0
    let hiddenChoices =  new Set()
    nextPropsValue.forEach(value => {
      let valueJSON = JSON.parse(value);
      nextPropsChoices.forEach(choice => {
        let choiceJSON = JSON.parse(choice[0]);
        if (valueJSON[0] === choiceJSON[0] && valueJSON[1] !== choiceJSON[1]) {
          hiddenChoices.add(choice);
        }
      })
    })
    hiddenChoices.forEach(value => {nextProps.hiddenChoices.push(value)})
  }
  mapOptions(choices) {
    return choices.map(c => {
      let option;
      if (Array.isArray(c)) {
        const label = c.length > 1 ? c[1] : c[0];
        option = {
          value: c[0],
          label,
        };
        if (c[2] && c[2] !== null) option.imgSrc = c[2];
        if (c[3]) {
          option.backgroundColor = c[3];
        }
      } else if (Object.is(c)) {
        option = c;
      } else {
        option = {
          value: c,
          label: c,
        };
      }
      return option;
    });
  }
  getOptions(props) {
    // Accepts different formats of input
    const options = this.mapOptions(props.choices)
    const mappedHiddenOptions = this.mapOptions(props.hiddenChoices)
    if (props.freeForm) {
      // For FreeFormSelect, insert value into options if not exist
      const values = options.map(c => c.value);
      if (props.value) {
        let valuesToAdd = props.value;
        if (!Array.isArray(valuesToAdd)) {
          valuesToAdd = [valuesToAdd];
        }
        valuesToAdd.forEach((v) => {
          if (values.indexOf(v) < 0) {
            options.push({ value: v, label: v });
          }
        });
      }
    }
    const visibleOptions = options.filter(option => {
      let visible = true;
      mappedHiddenOptions.forEach((hiddenOption) => {
        if (option.value === hiddenOption.value && option.label === hiddenOption.label) {
          visible = false;
        }
      })
      return visible;
    })
    return visibleOptions;
  }
  renderOption(opt) {
    if (opt.backgroundColor) {
      return (
        <div>
          <div className="color-box" style={renderColorbox(opt.backgroundColor)}></div>
          <span>{opt.label}</span>
        </div>
      )
    }
    if (opt.imgSrc) {
      return (
        <div>
          <img className="viz-thumb-option" src={opt.imgSrc} alt={opt.value} />
          <span>{opt.label}</span>
        </div>
      );
    } 
    return opt.label;
  }
  render() {
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const selectProps = {
      multi: this.props.multi,
      draggable: true,
      name: `select-${this.props.name}`,
      placeholder: `Select (${this.state.options.length})`,
      options: this.state.options,
      value: this.props.value,
      autosize: false,
      clearable: this.props.clearable,
      isLoading: this.props.isLoading,
      onChange: this.onChange,
      optionRenderer: this.renderOption,
    };
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const selectWrap = this.props.freeForm ?
      (<Creatable {...selectProps} />) : (<Select {...selectProps} />);
    return (
      <div>
        {selectWrap}
      </div>
    );
  }
}

SelectControl.propTypes = propTypes;
SelectControl.defaultProps = defaultProps;
