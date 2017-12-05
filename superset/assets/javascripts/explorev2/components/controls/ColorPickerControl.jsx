import React from 'react';
import PropTypes from 'prop-types';
import { SwatchesPicker } from 'react-color';
import { WithOutContext as ReactTags } from 'react-tag-input';
import '../../../../stylesheets/react-tag/react-tag.css';
import '../../../../stylesheets/react-color/react-color.css';
import SelectControl from './SelectControl';
import { CompactPicker } from 'react-color';
import TextControl from './TextControl';
import Button from '../../../components/Button';

const progressbarChoices = [
  'Represent with color bar length',
  'Represent with color scale',
];

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
    this.state = {
      value: props.value,
      metrics: metrics,
      selectedMetric: null,
      selectedProgressbarChoice: null,
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
  onSelectChange(type, value) {
    this.state[type] = value;
    this.setState({type});
    if (type == 'selectedProgressbarChoice') {
      this.setActiveProgressbarChoice(this.state.selectedMetric, this.state.selectedProgressbarChoice);
    }
  }
  onExcludeChange(metric, mode, newValue) {
    const value = this.props.value;
    if (!(metric in value)) {
      value[metric] = {};
    }
    if (!(mode in value[metric])) {
      value[metric][mode] = null;
    }
    value[metric][mode] = newValue;
    this.setState({value});
    this.props.onChange(value);
  }
  onValueChange(metric, progressbarChoice, type, newValue) {
    const value = this.props.value;
    if (!(metric in value)) {
      value[metric] = {};
    }
    if (!(progressbarChoice in value[metric])) {
      value[metric][progressbarChoice] = {};
    }
    if (!(type in value[metric][progressbarChoice])) {
      value[metric][progressbarChoice][type] = null;
    }
    value[metric][progressbarChoice][type] = newValue;
    this.setState({value});
    this.props.onChange(value);
  }
  setActiveProgressbarChoice(metric, progressbarChoice) {
    const value = this.props.value;
    if (!(metric in value)) {
      value[metric] = {};
    }
    value[metric]['active'] = progressbarChoice;
    this.setState({value});
    this.props.onChange(value);
  }
  onCancel(metric, progressbarChoice) {
    const value = this.props.value;
    if (!(metric in value)) {
      value[metric] = {};
    }
    if (!(progressbarChoice in value[metric])) {
      value[metric][progressbarChoice] = {};
    }
    value[metric][progressbarChoice] = {};
    this.setState({value});
    this.props.onChange(value);
  }
  render() {
    // Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const metrics = this.props.formData.metrics || [];
    let value = this.state.value === null ? {} : this.state.value;
    const metric = this.state.selectedMetric;
    const progressbarChoice = this.state.selectedProgressbarChoice;
    // For the color saved in the database, change the value structure
    if (metric in value && typeof(value[metric]) == "string") {
      let savedColorString = value[metricForStyling];
      let savedColorArray = savedColorString.split(",");
      let savedColorObject = {rgb: {r: savedColorArray[0], g: savedColorArray[1], b: savedColorArray[2]}};
      value[metricForStyling] = {};
      value[metricForStyling]['active'] = 'Represent with color bar length';
      value[metricForStyling]['Represent with color bar length'] = {};
      value[metricForStyling]['Represent with color bar length']['color'] = savedColorObject;
      value[metricForStyling]['exclude_rows_from_progress_bar'] = [];
    }
    /*
    if (metric in value && typeof(value[metric]) == "string") {
      let savedColor = value[metric];
      value[metric] = {};
      value[metric]['color'] = savedColor;
      value[metric]['exclude_rows_from_progress_bar'] = [];
    }
    */
    let progressbarChoicesSetting = null;
    let colorPicker = null;
    let exclude_rows_from_progress_bar_setting = null;
    let progressbarGradientSetting = null;
    let progressbarCancelButton = null;
    if (this.state.selectedMetric !== null) {
      progressbarChoicesSetting = (
        <div className="panel-heading">
            <SelectControl
              name="progress_bar_type"
              default={progressbarChoices[0]}
              choices={progressbarChoices}
              onChange={this.onSelectChange.bind(this, 'selectedProgressbarChoice')}
              value={this.state.selectedProgressbarChoice}
            />
        </div>);
    }
    if (this.state.selectedProgressbarChoice !== null) {
      const exclude_rows_from_progress_bar = (
        metric in value &&
        'exclude_rows_from_progress_bar' in value[metric]
      ) ? value[metric].exclude_rows_from_progress_bar : null;
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
                    onChange={this.onExcludeChange.bind(this, metric, 'exclude_rows_from_progress_bar')}
                    value={exclude_rows_from_progress_bar}/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>);
      progressbarCancelButton = (
        <Button
            type="reset"
            className="btn-custom"
            bsClass="btn"
            bsSize="sm"
            bsStyle="default"
            onClick={this.onCancel.bind(this, metric, progressbarChoice)}
        >
          <i className="fa fa-eraser"></i> Reset Progress Bar
        </Button>);
    }
    if (this.state.selectedProgressbarChoice == 'Represent with color bar length') {
      const progressbarColor = (metric in value &&
                  progressbarChoice in value[metric] &&
                  'color' in value[metric][progressbarChoice]
              ) ? value[metric][progressbarChoice].color : {hex: '#fff'};
      colorPicker = (<SwatchesPicker color={progressbarColor}
          onChangeComplete={this.onValueChange.bind(this, metric, progressbarChoice, 'color')} height={560} width={"100%"} />);
    }
    else if (this.state.selectedProgressbarChoice == 'Represent with color scale') {
      const minimumColor = (
                  metric in value &&
                  progressbarChoice in value[metric] &&
                  'minimumColor' in value[metric][progressbarChoice]
              ) ? value[metric][progressbarChoice].minimumColor : {hex: '#fff'};
      const midPoint = (
                  metric in value &&
                  progressbarChoice in value[metric] &&
                  'midPoint' in value[metric][progressbarChoice]
              ) ? value[metric][progressbarChoice].midPoint : '0';
      const maximumColor = (
                  metric in value &&
                  progressbarChoice in value[metric] &&
                  'maximumColor' in value[metric][progressbarChoice]
              ) ? value[metric][progressbarChoice].maximumColor : {hex: '#fff'};
      progressbarGradientSetting = (
          <div className="panel panel-default" style={{ border: 'initial', borderColor: '#ddd' }}>
          <div className="panel-body">
          <table className="table table-bordered" style={{fontSize: '12px'}}>
                <tbody>
                  <tr>
                    <td><span>Maximum Color</span></td>
                    <td>
                      <CompactPicker color={maximumColor}
                        onChangeComplete={this.onValueChange.bind(this, metric, progressbarChoice, 'maximumColor')} />
                    </td>
                  </tr>
                  <tr>
                    <td><span>Midpoint</span></td>
                    <td>
                      <TextControl
                        name={metric + '__midPoint'}
                        default={'0'}
                        clearable
                        onChange={this.onValueChange.bind(this, metric, progressbarChoice, 'midPoint')}
                        value={midPoint}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td><span>Minimum Color</span></td>
                    <td>
                      <CompactPicker color={minimumColor}
                        onChangeComplete={this.onValueChange.bind(this, metric, progressbarChoice, 'minimumColor')} />
                    </td>
                  </tr>
                </tbody>
          </table>
          </div>
        </div>
      );
    }
    return (
      <div className="panel panel-default"
           style={{ border: 'initial', borderColor: '#ddd' }}>
          <div className="panel-heading">
            <SelectControl
              name="column_focus"
              default={metrics[0]}
              choices={metrics}
              onChange={this.onSelectChange.bind(this, 'selectedMetric')}
              value={this.state.selectedMetric}
            />
          </div>
          {progressbarChoicesSetting}
          {progressbarCancelButton}
          {colorPicker}
          {progressbarGradientSetting}
          {exclude_rows_from_progress_bar_setting}
      </div>
    );
  }
}

ColorPickerControl.propTypes = propTypes;
ColorPickerControl.defaultProps = defaultProps;
