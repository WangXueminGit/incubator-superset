import React from 'react';
import PropTypes from 'prop-types';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderWithTooltip = createSliderWithTooltip(Slider);

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number,
};

const defaultProps = {
  value: 0,
  onChange: () => {},
};

export default class SliderControl extends React.Component {
  constructor(props) {
    super(props);
  }
  onChange(value) {
    this.props.onChange(value);
  }
  render() {
    return (
      <div>
        <SliderWithTooltip
          min={-90}
          max={90}
          marks={{ '-90': '-90', '-45': '-45', 0: '0', 45: '45', 90: '90'}}
          step={5}
          defaultValue={this.props.value}
          trackStyle={{ backgroundColor: '#00A699' }}
          handleStyle={[{ borderColor: '#00A699' }]}
          activeDotStyle={{ borderColor: '#00A699' }}
          onAfterChange={this.onChange.bind(this)}
        />
      </div>
    );
  }
}

SliderControl.propTypes = propTypes;
SliderControl.defaultProps = defaultProps;
