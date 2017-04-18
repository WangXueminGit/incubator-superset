import React, { PropTypes } from 'react';
import Select, { Creatable } from 'react-select';
import { TwitterPicker } from 'react-color';
import { WithContext as ReactTags } from 'react-tag-input';
import '../../../../stylesheets/react-tag/react-tag.css';

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
    this.handleAddition(color.hex);
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
    value.splice(currPos, 1);
    value.splice(newPos, 0, tag);

    // re-render
    this.setState({ value: value });
    this.getTagArray();
    this.props.onChange(value);
  }
  renderColorTag(value) {
    const style = {
      width: "10px",
      height: "10px",
      display: "inline-block",
      background: value.text
    };
    return (<div style={{display: "inline-block"}}><span style={Object.assign({}, style)}></span>{value.text}</div>);
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
                                   inline={false}/>);
    const defaultColors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#F44336', '#E91E63'];
    const colorPicker = (<TwitterPicker onChangeComplete={this.handleColorAddition.bind(this)} colors={defaultColors} />);
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
