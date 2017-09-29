import React from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';
import { WithOutContext as ReactTags } from 'react-tag-input';
import '../../../../stylesheets/react-tag/react-tag.css';
import '../../../../stylesheets/react-color/react-color.css';
import SelectControl from './SelectControl';

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
  value: PropTypes.object,
  formData: PropTypes.object,
};

const defaultProps = {
  choices: [],
  clearable: true,
  description: null,
  freeForm: false,
  isLoading: false,
  label: null,
  multi: false,
  value: {},
  onChange: () => {},
  formData: {},
};

export default class ColorPickerControl extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value ? props.value : {};
    const metrics = props.formData.metrics || [];
    let output = [], i;
    if (Object.keys(value).length >= 1) {
      for (var prop in value) {
        output.push({id: prop, text: value[prop]});
      }
    }
    this.state = {
      value: props.value,
      tagValue: output,
      metrics: metrics,
      selectedMetric: null,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('formData' in nextProps && 'metrics' in nextProps.formData &&
        nextProps.formData.metrics !== this.state.metrics) {
      const differenceToAdd = nextProps.formData.metrics.filter(
          x => this.state.metrics.indexOf(x) === -1);
      const differenceToDelete = this.state.metrics.filter(
          x => nextProps.formData.metrics.indexOf(x) === -1);
      const value = this.state.value;
      for (let i = 0; i < differenceToAdd.length; i++) {
        value[differenceToAdd[i]] = {};
      }
      for (let i = 0; i < differenceToDelete.length; i++) {
        delete value[differenceToDelete[i]];
      }
      const selectedMetric =
        (nextProps.formData.metrics.length && this.state.selectedMetric === null) ?
          nextProps.formData.metrics[0] :
          (nextProps.formData.metrics.length === 0 && this.state.selectedMetric !== null) ?
            null : (this.state.selectedMetric in nextProps.formData.metrics) ?
              this.state.selectedMetric : nextProps.formData.metrics[0];
      this.setState({ metrics: nextProps.formData.metrics, value, selectedMetric });
    }
  }
  onSelectChange(value) {
    this.setState({selectedMetric: value});
  }
  onToggle(type) {
    const value = this.props.value;
    if (!(type in value)) {
      value[type] = {};
    }
    value[type] = !value[type];
    this.setState({value});
    this.props.onChange(value);
  }
  onValueChange(type, newValue) {
    const value = this.props.value;
    if (!(type in value)) {
      value[type] = null;
    }
    value[type] = newValue;
    this.setState({value});
    this.props.onChange(value);
  }
  handleDelete(metric) {
    let value = this.state.value;
    if (!(metric in value)) {
      value[metric] = null;
    }
    value[metric] = null;
    this.setState({ value });
    this.getTagArray(false);
    this.props.onChange(value);
  }
  handleColorAddition(metric, color) {
    const colorString = color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b;
    this.handleAddition(metric, colorString);
    this.getTagArray(true);
  }
  handleAddition(metric, tag) {
    let value = this.props.value;
    if (!(metric in value)) {
      value[metric] = null;
    }
    value[metric] = tag;
    this.setState({ value });
    this.props.onChange(value);
    this.renderColorTag(tag);
    this.getTagArray(true);
  }
  renderColorTag(value) {
    const style = {
      width: '12px',
      height: '12px',
      display: 'inline-block',
      background: 'rgb(' + value.text + ')',
    };
    return (<div style={{display: "inline-block"}}><span style={Object.assign({}, style)}></span></div>);
  }
  getTagArray(add) {
    let output = [], i;
    const selectedMetric = this.state.selectedMetric;
    if (add) {
      output.push({id: selectedMetric, text: this.state.value[selectedMetric]});
    }
    else {
      output = [];
    }
    this.setState({tagValue: output});
  }
  render() {
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const metrics = this.props.formData.metrics || [];
    const value = this.state.value === null ? {} : this.state.value;
    const metric = this.state.selectedMetric;
    let colorPicker = null;
    let selectWrap = null;
    if (this.state.selectedMetric !== null) {
      selectWrap = (<ReactTags tags={this.state.tagValue}
                                   suggestions={[]}
                                   handleDelete={this.handleDelete.bind(this, metric)}
                                   handleAddition={this.handleAddition.bind(this, metric)}
                                   renderTag={this.renderColorTag}
                                   inline={false}
                                   autofocus={false}/>);
      colorPicker = (<SwatchesPicker onChange={
          this.handleColorAddition.bind(this,metric)} height={560} width={"100%"} />);
    }
    return (
      <div className="panel panel-default"
           style={{ border: 'initial', borderColor: '#ddd' }}>
          <div className="panel-heading">
            <SelectControl
              name="column_focus"
              default={metrics[0]}
              choices={metrics}
              onChange={this.onSelectChange.bind(this)}
              value={this.state.selectedMetric}
            />
          </div>
          {selectWrap}
          {colorPicker}
      </div>
    );
  }
}

ColorPickerControl.propTypes = propTypes;
ColorPickerControl.defaultProps = defaultProps;
