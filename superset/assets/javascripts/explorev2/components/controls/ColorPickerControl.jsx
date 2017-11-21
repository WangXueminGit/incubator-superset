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
    let output = {};
    for (var prop in value) {
      if (Object.keys(value[prop]).length == 0) {
        output[prop] = [];
      }
      else {
        output[prop] = [];
        output[prop].push({id: prop, text: value[prop]['color']});
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
  onValueChange(metric, type, newValue) {
    const value = this.props.value;
    if (!(metric in value)) {
      value[metric] = {};
    }
    if (!(type in value[metric])) {
      value[metric][type] = null;
    }
    value[metric][type] = newValue;
    this.setState({value});
    this.props.onChange(value);
  }
  handleDelete(metric) {
    let value = this.state.value;
    if (!(metric in value)) {
      value[metric] = {};
    }
    if (!('color' in value[metric])) {
      value[metric]['color'] = null;
    }
    value[metric]['color'] = null;
    this.setState({ value });
    this.getTagArray(false);
    this.props.onChange(value);
  }
  handleColorAddition(metric, color) {
    const colorString = color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b;
    this.handleAddition(metric, colorString);
  }
  handleAddition(metric, tag) {
    let value = this.props.value;
    if (!(metric in value)) {
      value[metric] = {};
    }
    if (!('color' in value[metric])) {
      value[metric]['color'] = null;
    }
    value[metric]['color'] = tag;
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
    let output = {};
    const selectedMetric = this.state.selectedMetric;
    if (add) {
      output[selectedMetric] = [];
      output[selectedMetric].push({id: selectedMetric, text: this.state.value[selectedMetric]['color']});
    }
    else {
      output[selectedMetric] = [];
    }
    this.setState({tagValue: output});
  }
  render() {
    // Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const metrics = this.props.formData.metrics || [];
    let value = this.state.value === null ? {} : this.state.value;
    const metric = this.state.selectedMetric;
    // For the color saved in the database, change the value structure
    if (metric in value && typeof(value[metric]) == "string") {
      let savedColor = value[metric];
      value[metric] = {};
      value[metric]['color'] = savedColor;
      value[metric]['exclude_rows_from_progress_bar'] = [];
    }
    const exclude_rows_from_progress_bar = (
        metric in value &&
        'exclude_rows_from_progress_bar' in value[metric]
    ) ? value[metric].exclude_rows_from_progress_bar : null;
    let colorPicker = null;
    let selectWrap = null;
    let exclude_rows_from_progress_bar_setting = null;
    if (this.state.selectedMetric !== null) {
      selectWrap = (<ReactTags tags={this.state.tagValue[metric]}
                                   suggestions={[]}
                                   handleDelete={this.handleDelete.bind(this, metric)}
                                   handleAddition={this.handleAddition.bind(this, metric)}
                                   renderTag={this.renderColorTag}
                                   inline={false}
                                   autofocus={false}/>);
      colorPicker = (<SwatchesPicker onChange={
          this.handleColorAddition.bind(this,metric)} height={560} width={"100%"} />);
      exclude_rows_from_progress_bar_setting = (
          <div className="panel-body">
          <table className="table table-bordered" style={{fontSize: '12px'}}>
            <tbody>
              <tr>
                <td><span>Exclude the rows which contains following value</span></td>
                <td>
                  <SelectControl
                    name="exclude"
                    multi={true}
                    freeForm
                    clearable
                    default={null}
                    onChange={this.onValueChange.bind(this, metric, 'exclude_rows_from_progress_bar')}
                    value={exclude_rows_from_progress_bar}/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>);
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
          {exclude_rows_from_progress_bar_setting}
      </div>
    );
  }
}

ColorPickerControl.propTypes = propTypes;
ColorPickerControl.defaultProps = defaultProps;
