import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

const propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  formData: PropTypes.object,
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  value: {
    mtd: [],
    keep: [],
  },
  formData: {},
  onChange: () => {},
};

export default class ColumnControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }
  onToggle(type, metric) {
    const value = this.props.value;
    const index = value[type].indexOf(metric);
    if (index >= 0) {
      value[type].splice(index, 1);
    }
    else {
      value[type].push(metric);
    }
    this.setState({value});
    this.props.onChange(value);
  }
  render() {
    const metrics = this.props.formData.metrics || [];
    const value = this.state.value;
    return (
        <table className="table">
          <thead>
          <tr>
            <td><span>Metric</span></td>
            <td><span>MTD</span></td>
            <td><span>Keep</span></td>
          </tr>
          </thead>
          <tbody>
          {metrics.map((metric) => {
            const mtdChecked = value.mtd.indexOf(metric) >= 0;
            const keepChecked = value.keep.indexOf(metric) >= 0;
            return (
                <tr key={metric}>
                  <td><span>{metric}</span></td>
                  <td>
                    <Checkbox
                      checked={mtdChecked}
                      onChange={this.onToggle.bind(this, 'mtd', metric)}
                    />
                  </td>
                  <td>
                    <Checkbox
                      checked={keepChecked}
                      onChange={this.onToggle.bind(this, 'keep', metric)}
                    />
                  </td>
                </tr>
            );
          })}
          </tbody>
        </table>
    );
  }
}

ColumnControl.propTypes = propTypes;
ColumnControl.defaultProps = defaultProps;
