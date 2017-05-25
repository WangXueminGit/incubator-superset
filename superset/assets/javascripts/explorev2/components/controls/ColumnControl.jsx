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

const propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  formData: PropTypes.object,
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
};

const modes = ['Default', 'MTD'];

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
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('formData' in nextProps && 'metrics' in nextProps.formData && nextProps.formData.metrics !== this.state.metrics) {
      const differenceToAdd = nextProps.formData.metrics.filter(x => this.state.metrics.indexOf(x) === -1);
      const differenceToDelete = nextProps.formData.metrics.filter(x => this.state.metrics.indexOf(x) === -1);
      const value = this.state.value;
      for (let i = 0; i < differenceToAdd.length; i++) {
        value[differenceToAdd[i]] = {};
      }
      for (let i = 0; i < differenceToDelete.length; i++) {
        delete value[differenceToDelete[i]];
      }
      value.activate = [...new Set(value.activate)]
      this.setState({ metrics: nextProps.formData.metrics, value });
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
  render() {
    const metrics = this.props.formData.metrics || [];
    const value = this.state.value === null ? {} : this.state.value;
    return (
        <div>
          {metrics.map((metric) => {
            return (
                <div key={metric}>
                  {metric}
                  <table className="table" style={{fontSize: '12px'}}>
                    <thead>
                    <tr>
                      <td><span>Metric</span></td>
                      <td><span>Activate</span></td>
                      <td><span>Reverse coloring</span></td>
                      <td><span>Format</span></td>
                    </tr>
                    </thead>
                    <tbody>
                    {modes.map((mode) => {
                      const activateChecked = mode === 'Default' ?
                          !(
                              metric in value &&
                              mode in value[metric] &&
                              'remove' in value[metric][mode] &&
                              !value[metric][mode].remove
                          ) :
                          (
                              metric in value &&
                              mode in value[metric]
                              && 'remove' in value[metric][mode] &&
                              value[metric][mode].remove
                          );
                      const reverseColoringChecked = (
                          metric in value &&
                          mode in value[metric] &&
                          'reverseColoring' in value[metric][mode] &&
                          value[metric][mode].reverseColoring
                      );
                      const formatting = (
                          metric in value &&
                          mode in value[metric] &&
                          'formatting' in value[metric][mode]
                      ) ? value[metric][mode].formatting : null;
                      return (
                        <tr key={mode}>
                          <td><span>{mode}</span></td>
                          <td>
                            <Checkbox
                              checked={activateChecked}
                              onChange={this.onToggle.bind(this, metric, mode, 'remove')}
                            />
                          </td>
                          <td>
                            <Checkbox
                              checked={reverseColoringChecked}
                              onChange={this.onToggle.bind(this, metric, mode, 'reverseColoring')}
                            />
                          </td>
                          <td>
                            <SelectControl
                              name={mode + '___' + metric}
                              default={D3_TIME_FORMAT_OPTIONS[0]}
                              choices={D3_TIME_FORMAT_OPTIONS}
                              clearable
                              freeForm
                              onChange={this.onValueChange.bind(this, metric, mode, 'formatting')}
                              value={formatting}
                            />
                          </td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
            );
          })}
        </div>
    );
  }
}

ColumnControl.propTypes = propTypes;
ColumnControl.defaultProps = defaultProps;
