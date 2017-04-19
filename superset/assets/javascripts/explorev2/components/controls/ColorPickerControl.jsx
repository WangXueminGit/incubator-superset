import React, { PropTypes } from 'react';
import Select, { Creatable } from 'react-select';
import { SwatchesPicker } from 'react-color';
import { WithContext as ReactTags } from 'react-tag-input';
import '../../../../stylesheets/react-tag/react-tag.css';
import '../../../../stylesheets/react-color/react-color.css';

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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
};

const defaultProps = {
  choices: [],
  clearable: true,
  description: null,
  freeForm: false,
  isLoading: false,
  label: null,
  multi: false,
  value: [],
  onChange: () => {},
};

export default class ColorPickerControl extends React.PureComponent {
  constructor(props) {
    super(props);
    const value = props.value ? props.value : [];
    let output = [], i;
    for (i = 0; i < value.length; i++) {
      output.push({id: value[i], text: value[i]});
    }
    this.state = {
      value: value,
      tagValue: output,
    };
  }
  handleDelete(i) {
    let value = this.state.value;
    value.splice(i, 1);
    this.setState({ value: value });
    this.getTagArray();
    this.props.onChange(value);
  }
  handleColorAddition(color) {
    let colorString = color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b;
    this.handleAddition(colorString);
    this.getTagArray();
  }
  handleAddition(tag) {
    let value = this.state.value;
    value.push(tag);
    this.setState({ value: value });
    this.props.onChange(value);
  }
  handleDrag(tag, currPos, newPos) {
    let value = this.state.value;

    // mutate array
    value.splice(newPos, 0, value.splice(currPos, 1)[0]);

    // re-render
    this.setState({ value: value });
    this.getTagArray();
    this.props.onChange(value);
  }
  renderColorTag(value) {
    const style = {
      width: "12px",
      height: "12px",
      display: "inline-block",
      background: "rgb(" + value.text + ")",
    };
    return (<div style={{display: "inline-block"}}><span style={Object.assign({}, style)}></span></div>);
  }
  getTagArray() {
    let output = [], i;
    for (i = 0; i < this.state.value.length; i++) {
      output.push({id: this.state.value[i], text: this.state.value[i]});
    }
    this.setState({tagValue: output});
  }
  render() {
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    var selectWrap = (<ReactTags tags={this.state.tagValue}
                                   suggestions={[]}
                                   handleDelete={this.handleDelete.bind(this)}
                                   handleAddition={this.handleAddition.bind(this)}
                                   handleDrag={this.handleDrag.bind(this)}
                                   renderTag={this.renderColorTag}
                                   inline={false}
                                   autofocus={false}/>);
    const colorPicker = (<SwatchesPicker onChange={this.handleColorAddition.bind(this)} height={560} width={"100%"} />);
    return (
      <div>
        {selectWrap}
        {colorPicker}
      </div>
    );
  }
}

ColorPickerControl.propTypes = propTypes;
ColorPickerControl.defaultProps = defaultProps;
