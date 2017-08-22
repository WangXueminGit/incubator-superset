import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';
import SelectControl from './SelectControl';

const COLORING_OPTIONS = [
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

const propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  value: {},
  onChange: () => {},
};

export default class RowControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }
  onSelectChange(value) {
    this.setState(value);
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
  render() {
    const value = this.state.value === null ? {} : this.state.value;
    let metricElement = null;
    const basements = (
        'basements' in value
    ) ? value.basements : null;
    const coloringOption = (
        'coloringOption' in value
    ) ? value.coloringOption : null;
    const fontOption = (
        'fontOption' in value
    ) ? value.fontOption : null;
    return (
        <div className="panel panel-default" style={{ border: 'initial', borderColor: '#ddd' }}>
          <div className="panel-body">
          <table className="table table-bordered" style={{fontSize: '12px'}}>
                <tbody>
                  <tr>
                    <td><span>Row Contains</span></td>
                    <td>
                      <SelectControl
                        multi={true}
                        freeForm
                        name="contains-value"
                        clearable
                        onChange={this.onValueChange.bind(this, 'basements')}
                        value={basements}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><span>Coloring options</span></td>
                    <td>
                      <SelectControl
                        name={'___coloringOption'}
                        default={COLORING_OPTIONS[0]}
                        choices={COLORING_OPTIONS}
                        clearable
                        onChange={this.onValueChange.bind(this, 'coloringOption')}
                        value={coloringOption}
                      /> 
                    </td>
                  </tr>
                  <tr>
                    <td><span>Font options</span></td>
                    <td>
                      <SelectControl
                        name={'___fontOption'}
                        default={FONT_OPTIONS[0]}
                        choices={FONT_OPTIONS}
                        clearable
                        onChange={this.onValueChange.bind(this, 'fontOption')}
                        value={fontOption}
                      />
                    </td>
                  </tr>
                </tbody>
          </table>
        </div>
        </div>
    );
  }
}

RowControl.propTypes = propTypes;
RowControl.defaultProps = defaultProps;
