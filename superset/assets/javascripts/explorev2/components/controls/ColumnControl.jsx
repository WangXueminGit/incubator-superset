import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';
import SelectControl from './SelectControl';

const D3_TIME_FORMAT_OPTIONS = [
  ['.3s', '.3s | 12.3k'],
  ['.3%', '.3% | 1234543.210%'],
  ['.4r', '.4r | 12350'],
  ['.3f', '.3f | 12345.432'],
  ['+,', '+, | +12,345.4321'],
  ['$,.2f', '$,.2f | $12,345.43'],
];

const COLORING_OPTIONS = [
  'Green over 100%',
  'Red over 100%',
]

const propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  formData: PropTypes.object,
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
};

const modes = ['Normal', 'MTD'];

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
  onSelectChange(value) {
    this.setState({selectedMetric: value});
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
  render() {
    const metrics = this.props.formData.metrics || [];
    const value = this.state.value === null ? {} : this.state.value;
    const metric = this.state.selectedMetric;
    let metricElement = null;
    if (this.state.selectedMetric !== null) {
      metricElement = (
        <div className="panel-body">
          <table className="table table-bordered" style={{fontSize: '12px'}}>
            {modes.map((mode) => {
              const activateChecked = mode === 'Normal' ?
                    !(
                        metric in value &&
                        mode in value[metric] &&
                        'remove' in value[metric][mode] &&
                        !value[metric][mode].remove
                    ) :
                    (
                        metric in value &&
                        mode in value[metric] &&
                        (!('remove' in value[metric][mode]) || !value[metric][mode].remove)
                    );
              const coloringOption = (
                  metric in value &&
                  mode in value[metric] &&
                  'coloringOption' in value[metric][mode]
              ) ? value[metric][mode].coloringOption : null;
              const formatting = (
                  metric in value &&
                  mode in value[metric] &&
                  'formatting' in value[metric][mode]
              ) ? value[metric][mode].formatting : null;
              return (
                <tbody key={mode}>
                  <tr>
                    <td rowSpan={3}>{mode}</td>
                    <td><span>Visible</span></td>
                    <td>
                      <Checkbox
                        checked={activateChecked}
                        onChange={this.onToggle.bind(this, metric, mode, 'remove')}
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
        <div className="panel panel-default" style={{ border: 'initial', borderColor: '#ddd' }}>
          <div className="panel-heading">
            <SelectControl
              name="column_focus"
              default={metrics[0]}
              choices={metrics}
              onChange={this.onSelectChange.bind(this)}
              value={this.state.selectedMetric}
            />
          </div>
          {metricElement}
        </div>
    );
  }
}

ColumnControl.propTypes = propTypes;
ColumnControl.defaultProps = defaultProps;
