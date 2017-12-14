import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, ButtonGroup, FormControl, InputGroup,
  Label, OverlayTrigger, Popover, Glyphicon,
} from 'react-bootstrap';
import Select from 'react-select';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';

import ControlHeader from '../ControlHeader';
import PopoverSection from '../../../components/PopoverSection';

//const RELATIVE_TIME_OPTIONS = ['ago', 'from now'];
const RELATIVE_TIME_OPTIONS = ['ago'];
const TIME_GRAIN_OPTIONS = ['seconds', 'minutes', 'days', 'weeks', 'months', 'years'];
const Suggestions_of_Date = [
    'Today',
    'Yesterday',
    'This week, Monday',
    '1 week ago, Monday',
    '2 weeks ago, Monday',
    'This month, 1st',
    'Last month, 1st',
    'Last 2 months, 1st',
];
const Result_of_Suggestions = [
    'Today',
    'Yesterday',
    'This Monday',
    'This Monday and 7 days ago',
    'This Monday and 14 days ago',
    'This Month',
    'Last Month',
    'Last Month and 1 month ago',
];
const SuggestionsMap = [
    {label: 'Today', value: 'Today'},
    {label: 'Yesterday', value: 'Yesterday'},
    {label: 'This week, Monday', value: 'This Monday'},
    {label: '1 week ago, Monday', value: 'This Monday and 7 days ago'},
    {label: '2 weeks ago, Monday', value: 'This Monday and 14 days ago'},
    {label: 'This month, 1st', value: 'This Month'},
    {label: 'Last month, 1st', value: 'Last Month'},
    {label: 'Last 2 months, 1st', value: 'Last Month and 1 month ago'},
];

const propTypes = {
  animation: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  height: PropTypes.number,
};

const defaultProps = {
  animation: true,
  onChange: () => {},
  value: '',
};

export default class DateFilterControl extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || '';
    this.state = {
      num: '7',
      grain: 'days',
      rel: 'ago',
      dttm: '',
      type: 'free',
      free: '',
      sug: '',
    };
    const words = value.split(' ');
    if (words.length >= 3 && RELATIVE_TIME_OPTIONS.indexOf(words[2]) >= 0) {
      this.state.num = words[0];
      this.state.grain = words[1];
      this.state.rel = words[2];
      this.state.type = 'rel';
    } else if (moment(value).isValid()) {
      this.state.dttm = value;
      this.state.type = 'fix';
    } else if ((Suggestions_of_Date.includes(value)) || (Result_of_Suggestions.includes(value))) {
      this.state.sug = value;
      this.state.type = 'sug';
    } else {
      this.state.free = value;
      this.state.type = 'free';
    }
  }
  onControlChange(target, opt) {
    this.setState({ [target]: opt.value }, this.onChange);
  }
  onNumberChange(event) {
    this.setState({ num: event.target.value }, this.onChange);
  }
  onChange() {
    let val;
    if (this.state.type === 'rel') {
      val = `${this.state.num} ${this.state.grain} ${this.state.rel}`;
    } else if (this.state.type === 'fix') {
      val = this.state.dttm;
    } else if (this.state.type === 'free') {
      val = this.state.free;
    } else if (this.state.type === 'sug') {
      val = this.state.sug;
    }
    this.props.onChange(val);
  }
  onFreeChange(event) {
    this.setState({ free: event.target.value }, this.onChange);
  }
  setType(type) {
    this.setState({ type }, this.onChange);
  }
  setValue(val) {
    this.setState({ type: 'free', free: val }, this.onChange);
    this.close();
  }
  setDatetime(dttm) {
    this.setState({ dttm: dttm.format().substring(0, 19) }, this.onChange);
  }
  close() {
    this.refs.trigger.hide();
  }
  renderPopover() {
    var today = Datetime.moment();
    var valid = function( current ){
      return current.isBefore( today );
    };
    return (
      <Popover id="filter-popover">
        <div style={{ width: '240px' }}>
          <PopoverSection
            title="Fixed"
            isSelected={this.state.type === 'fix'}
            onSelect={this.setType.bind(this, 'fix')}
          >
            <InputGroup bsSize="small">
              <InputGroup.Addon>
                <Glyphicon glyph="calendar" />
              </InputGroup.Addon>
              <Datetime
                inputProps={{ className: 'form-control input-sm' }}
                dateFormat="YYYY-MM-DD"
                defaultValue={this.state.dttm}
                onFocus={this.setType.bind(this, 'fix')}
                onChange={this.setDatetime.bind(this)}
                timeFormat="h:mm:ss"
                isValidDate={ valid }
              />
            </InputGroup>
          </PopoverSection>
          <PopoverSection
            title="Relative"
            isSelected={this.state.type === 'rel'}
            onSelect={this.setType.bind(this, 'rel')}
          >
            <div className="clearfix">
              <div style={{ width: '50px' }} className="input-inline">
                <FormControl
                  onFocus={this.setType.bind(this, 'rel')}
                  value={this.state.num}
                  onChange={this.onNumberChange.bind(this)}
                  bsSize="small"
                />
              </div>
              <div style={{ width: '95px' }} className="input-inline">
                <Select
                  onFocus={this.setType.bind(this, 'rel')}
                  value={this.state.grain}
                  clearable={false}
                  options={TIME_GRAIN_OPTIONS.map(s => ({ label: s, value: s }))}
                  onChange={this.onControlChange.bind(this, 'grain')}
                />
              </div>
              <div style={{ width: '95px' }} className="input-inline">
                <Select
                  value={this.state.rel}
                  onFocus={this.setType.bind(this, 'rel')}
                  clearable={false}
                  options={RELATIVE_TIME_OPTIONS.map(s => ({ label: s, value: s }))}
                  onChange={this.onControlChange.bind(this, 'rel')}
                />
              </div>
            </div>
          </PopoverSection>
          <PopoverSection
            title="Presets"
            isSelected={this.state.type === 'sug'}
            onSelect={this.setType.bind(this, 'sug')}
            info={
              'Some useful suggestions of presets.'
            }
          >
            <div className="clearfix">
              <div style={{ width: '240px' }} className="input-inline">
                <Select
                  onFocus={this.setType.bind(this, 'sug')}
                  value={this.state.sug}
                  clearable={false}
                  options={SuggestionsMap}
                  onChange={this.onControlChange.bind(this, 'sug')}
                />
              </div>
            </div>
          </PopoverSection>
          <div className="clearfix">
            <Button
              bsSize="small"
              className="float-left ok"
              bsStyle="primary"
              onClick={this.close.bind(this)}
            >
              Ok
            </Button>
            <ButtonGroup
              className="float-right"
            >
              <Button
                bsSize="small"
                onClick={this.setValue.bind(this, 'now')}
              >
                Now
              </Button>
              <Button
                bsSize="small"
                onClick={this.setValue.bind(this, '')}
              >
                Clear
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Popover>
    );
  }
  render() {
    const value = this.props.value || '';
    var showValue = value || '';
    if (Result_of_Suggestions.includes(value)) {
      showValue = Suggestions_of_Date[Result_of_Suggestions.indexOf(value)];
    }
    return (
      <div>
        <OverlayTrigger
          animation={this.props.animation}
          container={document.body}
          trigger="click"
          rootClose
          ref="trigger"
          placement="right"
          overlay={this.renderPopover()}
        >
          <Label style={{ cursor: 'pointer', fontSize: '12px' }}>
            {showValue.replace('T00:00:00', '') || '∞'}
          </Label>
        </OverlayTrigger>
      </div>
    );
  }
}

DateFilterControl.propTypes = propTypes;
DateFilterControl.defaultProps = defaultProps;
