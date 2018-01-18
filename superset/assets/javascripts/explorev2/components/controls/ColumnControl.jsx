import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';
import SelectControl from './SelectControl';
import TextControl from './TextControl';
import ControlHeader from './../ControlHeader';

const D3_TIME_FORMAT_OPTIONS = [
  ['.3s', '.3s | 12.3k'],
  ['.3%', '.3% | 1234543.210%'],
  ['.4r', '.4r | 12350'],
  ['.3f', '.3f | 12345.432'],
  ['+,', '+, | +12,345.4321'],
  ['$,.2f', '$,.2f | $12,345.43'],
];

const COMPARISION_OPTIONS = [
  '<',
  '=',
  '>',
  'contains',
  'startsWith',
  'endsWith',
]

//The COLORING_OPTIONS will send four arguments to SelectControl
//The first is the value of the option
//The second is the label text showed in the option
//The third is the img showed in the option
//The fourth is the cube color showed in the option
const COLORING_OPTIONS = [
  ['seagreen', 'seagreen', null, 'lightseagreen'],
  ['lightpink', 'lightpink', null, 'lightpink'],
  ['lightblue', 'lightblue', null, 'lightblue'],
  ['beige', 'beige', null, 'beige'],
  ['lightgray', 'lightgray', null, 'lightgray'],
]

const BC_COLORING_OPTIONS = [
  ['seagreen', 'seagreen', null, 'lightseagreen'],
  ['lightpink', 'lightpink', null, 'lightpink'],
  ['lightblue', 'lightblue', null, 'lightblue'],
  ['beige', 'beige', null, 'beige'],
  ['lightgray', 'lightgray', null, 'lightgray'],
]

const FONT_OPTIONS = [
  'normal',
  'bold'
]

const TEXT_ALIGN = [
  'left',
  'center',
  'right'
]

const propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  hideAll: PropTypes.bool,
  formData: PropTypes.object,
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
};

//const modes = ['Normal', 'MTD'];
const modes = ['Normal'];

const defaultProps = {
  value: {},
  formData: {},
  onChange: () => {},
};

export default class ColumnControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      metrics: props.formData.metrics || [],
      value: props.value,
      selectedMetric: null,
      selectedColumns: []
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('formData' in nextProps && 'metrics' in nextProps.formData && nextProps.formData.metrics !== this.state.metrics) {
      const differenceToAdd = nextProps.formData.metrics.filter(x => this.state.metrics.indexOf(x) === -1);
      const differenceToDelete = this.state.metrics.filter(x => nextProps.formData.metrics.indexOf(x) === -1);
      const value = this.state.value;
      for (let i = 0; i < differenceToAdd.length; i++) {
        value[differenceToAdd[i]] = {};
      }
      for (let i = 0; i < differenceToDelete.length; i++) {
        delete value[differenceToDelete[i]];
      }
      const selectedMetric =
        (nextProps.formData.metrics.length && this.state.selectedMetric === null) ? nextProps.formData.metrics[0] :
        (nextProps.formData.metrics.length === 0 && this.state.selectedMetric !== null) ? null :
        (this.state.selectedMetric in nextProps.formData.metrics) ? this.state.selectedMetric : nextProps.formData.metrics[0];
      this.setState({ metrics: nextProps.formData.metrics, value, selectedMetric });
    }
  }
  onSelectedMetricChange(value) {
    this.setState({selectedMetric: value});
  }
  onSelectedColumnsChange(index, value) {
    const selectedColumns = this.state.selectedColumns || [];
    if (value) {
      this.setState({selectedColumns: [ ...selectedColumns.slice(0, index), value]})
    } else {
      this.setState({selectedColumns: selectedColumns.slice(0, index)})
    }
  }
  onToggle(metric, mode, type) {
    const value = this.props.value;
    if (!(metric in value)) {
      value[metric] = {};
    }
    if (!(mode in value[metric])) {
      value[metric][mode] = {};
    }
    if (!(type in value[metric][mode])) {
      value[metric][mode][type] = false;
    }
    value[metric][mode][type] = !value[metric][mode][type];
    this.setState({value});
    this.props.onChange(value);
  }
  onValueChange(metric, mode, type, newValue) {
    const value = this.props.value;
    if (!(metric in value)) {
      value[metric] = {};
    }
    if (!(mode in value[metric])) {
      value[metric][mode] = {};
    }
    if (!(type in value[metric][mode])) {
      value[metric][mode][type] = null;
    }
    value[metric][mode][type] = newValue;
    this.setState({value});
    this.props.onChange(value);
  }
  getCombinedMetric() {
    if (this.props.formData.viz_type !== 'pivot_table') {
      return this.state.selectedMetric
    } else {
      return [this.state.selectedMetric].concat(this.state.selectedColumns)
    }
  }
  getUnique(array) {
    return [...(new Set(array))]
  }
  getSelectedColumnsOptions(index) {
    const metrics = this.getCombinedMetric();
    let subOptions = this.props.columns || [];
    for (let i = 0; i <= index; i++){
      subOptions = subOptions.filter((v) => (v[i] === metrics[i]));
    }
    const uniqueOptions = new Set();
    return this.getUnique(subOptions.map((v) => (v[index + 1])))
  }
  render() {
    const viz_type = this.props.formData.viz_type;
    const metrics = this.props.formData.metrics || [];
    const columns = this.props.formData.columns || [];
    const value = this.state.value === null ? {} : this.state.value;
    const metric = this.getCombinedMetric();
    const hideAll = (
                  'hide' in value &&
                  'hide' in value['hide'] &&
                  'hideAll' in value['hide']['hide']
              ) ? value['hide']['hide'].hideAll : false;
    let metricElement = null;
    let hideAllElement = (
      <div className="panel-body">
          <table className="table table-bordered" style={{fontSize: '12px'}}>
            <tbody>
              <tr>
                <td><span>Hide the Column Contains 'all'</span></td>
                <td>
                  <Checkbox
                    checked={hideAll}
                    onChange={this.onToggle.bind(this, 'hide', 'hide', 'hideAll')}
                  />
                </td>
              </tr>
            </tbody>
          </table>
      </div>
    );
    let selectedColumnsElement = null;
    if (viz_type === 'pivot_table' && this.state.selectedMetric !== null) {
      selectedColumnsElement = columns.map((value, index) => {
        if (index === 0 || this.state.selectedColumns[(index - 1)]) {
          return (<div className="panel-body" key={index}>
            <SelectControl
              name="column_focus"
              choices={this.getSelectedColumnsOptions(index)}
              onChange={this.onSelectedColumnsChange.bind(this, index)}
              value={this.state.selectedColumns[index]}
            />
          </div>)
        }
      });
    }
    let selectedColumnsHeader = null;
    if (selectedColumnsElement !== null) {
      selectedColumnsHeader = (
        <ControlHeader
          label="Columns"
          description=""
        />
        )
    }
    if (this.state.selectedMetric !== null) {
      metricElement = (
        <div className="panel-body">
          <table className="table table-bordered" style={{fontSize: '12px'}}>
            {modes.map((mode) => {
              const comparisionOption = (
                  metric in value &&
                  mode in value[metric] &&
                  'comparisionOption' in value[metric][mode]
              ) ? value[metric][mode].comparisionOption : null;
              const basement = (
                  metric in value &&
                  mode in value[metric] &&
                  'basement' in value[metric][mode]
              ) ? value[metric][mode].basement : null;
              const coloringOption = (
                  metric in value &&
                  mode in value[metric] &&
                  'coloringOption' in value[metric][mode]
              ) ? value[metric][mode].coloringOption : null;
              const bcColoringOption = (
                  metric in value &&
                  mode in value[metric] &&
                  'bcColoringOption' in value[metric][mode]
              ) ? value[metric][mode].bcColoringOption : null;
              const fontOption = (
                  metric in value &&
                  mode in value[metric] &&
                  'fontOption' in value[metric][mode]
              ) ? value[metric][mode].fontOption : null;
              const textAlign = (
                  metric in value &&
                  mode in value[metric] &&
                  'textAlign' in value[metric][mode]
              ) ? value[metric][mode].textAlign : null;
              const formatting = (
                  metric in value &&
                  mode in value[metric] &&
                  'formatting' in value[metric][mode]
              ) ? value[metric][mode].formatting : null;
              return (
                <tbody key={mode}>
                  <tr>
                    <td><span>Comparision options</span></td>
                    <td>
                      <SelectControl
                        name={mode + '___' + metric + '___comparisionOption'}
                        default={COMPARISION_OPTIONS[0]}
                        choices={COMPARISION_OPTIONS}
                        clearable
                        onChange={this.onValueChange.bind(this, metric, mode, 'comparisionOption')}
                        value={comparisionOption}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><span>Basement setting</span></td>
                    <td>
                      <TextControl
                        name={mode + '___' + metric + '___basementSetting'}
                        default={''}
                        clearable
                        onChange={this.onValueChange.bind(this, metric, mode, 'basement')}
                        value={basement}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><span>Coloring options</span></td>
                    <td>
                      <SelectControl
                        name={mode + '___' + metric + '___coloringOption'}
                        default={COLORING_OPTIONS[0]}
                        choices={COLORING_OPTIONS}
                        clearable
                        onChange={this.onValueChange.bind(this, metric, mode, 'coloringOption')}
                        value={coloringOption}
                      /> 
                    </td>
                  </tr>
                  <tr>
                    <td><span>Background(Contrast) Coloring options</span></td>
                    <td>
                      <SelectControl
                        name={mode + '___' + metric + '___bcColoringOption'}
                        default={BC_COLORING_OPTIONS[0]}
                        choices={BC_COLORING_OPTIONS}
                        clearable
                        onChange={this.onValueChange.bind(this, metric, mode, 'bcColoringOption')}
                        value={bcColoringOption}
                      /> 
                    </td>
                  </tr>
                  <tr>
                    <td><span>Font options</span></td>
                    <td>
                      <SelectControl
                        name={mode + '___' + metric + '___fontOption'}
                        default={FONT_OPTIONS[0]}
                        choices={FONT_OPTIONS}
                        clearable
                        onChange={this.onValueChange.bind(this, metric, mode, 'fontOption')}
                        value={fontOption}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><span>Text Align</span></td>
                    <td>
                      <SelectControl
                        name={mode + '___' + metric + '___textAlign'}
                        default={TEXT_ALIGN[2]}
                        choices={TEXT_ALIGN}
                        clearable
                        onChange={this.onValueChange.bind(this, metric, mode, 'textAlign')}
                        value={textAlign}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><span>Formatting</span></td>
                    <td>
                      <SelectControl
                        name={mode + '___' + metric + '___formatting'}
                        default={D3_TIME_FORMAT_OPTIONS[0]}
                        choices={D3_TIME_FORMAT_OPTIONS}
                        clearable
                        freeForm
                        onChange={this.onValueChange.bind(this, metric, mode, 'formatting')}
                        value={formatting}
                      />
                    </td>
                  </tr>
                </tbody>
                );
              })}
          </table>
        </div>
      );
    }
    return (
      <div>
        <div className="panel panel-default" style={{ border: 'initial', borderColor: '#ddd' }}>
          <div className="panel-heading">
            <SelectControl
              name="column_focus"
              choices={this.getUnique((this.props.columns || []).map(
                  (v, _) => (typeof(v) == 'string' ? v : v[0])
                ))}
              onChange={this.onSelectedMetricChange.bind(this)}
              value={this.state.selectedMetric}
            />
          </div>
        </div>
        {selectedColumnsHeader}
        <div className="panel panel-default" style={{ border: 'initial', borderColor: '#ddd' }}>
          {selectedColumnsElement}
          {metricElement}
          {hideAllElement}
        </div>
      </div>
    );
  }
}

ColumnControl.propTypes = propTypes;
ColumnControl.defaultProps = defaultProps;
