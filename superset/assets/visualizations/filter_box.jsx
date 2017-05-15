// JS
import d3 from 'd3';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import '../stylesheets/react-select/select.less';
import { TIME_CHOICES } from './constants';
import './filter_box.css';
import 'react-datepicker/dist/react-datepicker.css';

const propTypes = {
  origSelectedValues: PropTypes.object,
  origSelectedGroupByValues: PropTypes.array,
  instantFiltering: PropTypes.bool,
  filtersChoices: PropTypes.object,
  groupByChoices: PropTypes.array,
  onChange: PropTypes.func,
  onGroupByChange: PropTypes.func,
  showDateFilter: PropTypes.bool,
};

const defaultProps = {
  origSelectedValues: {},
  onChange: () => {},
  showDateFilter: false,
  instantFiltering: true,
};

class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: props.origSelectedValues,
      selectedGroupByValues: props.origSelectedGroupByValues,
      hasChanged: false,
      startDate: null,
      endDate: null,
    };
  }
  clickApply() {
    this.props.onChange(Object.keys(this.state.selectedValues)[0], [], true, true);
    this.setState({ hasChanged: false });
  }
  changeFilter(filter, options) {
    let vals = null;
    if (options) {
      if (Array.isArray(options)) {
        vals = options.map(opt => opt.value);
      } else {
        vals = options.value;
      }
    }
    const selectedValues = Object.assign({}, this.state.selectedValues);
    selectedValues[filter] = vals;
    this.setState({ selectedValues, hasChanged: true });
    this.props.onChange(filter, vals, false, this.props.instantFiltering);
  }
  changeDateFilter(filter, option) {
    let val = null,
      mom = null;
    if (option) {
      val = option.format('YYYY-MM-DD');
      if (filter === '__to') {
        val = option.add(1, 'day').format('YYYY-MM-DD');
      }
      mom = option;
    }
    const selectedValues = Object.assign({}, this.state.selectedValues);
    selectedValues[filter] = val;
    this.setState({ selectedValues, hasChanged: true });
    if (filter === '__from') {
      this.setState({ startDate: mom});
    }
    else if (filter === '__to') {
      this.setState({ endDate: mom});
    }
    this.props.onChange(filter, val, false, this.props.instantFiltering);
  }
  changeGroupBy(options) {
    const selectedGroupByValues = options;
    this.setState({ selectedGroupByValues, hasChanged: true });
    this.props.onGroupByChange(options, this.props.instantFiltering);
  }
  render() {
    let dateFilter;
    if (this.props.showDateFilter) {
      // dateFilter = ['__from', '__to'].map((field) => {
      //   const val = this.state.selectedValues[field];
      //   const choices = TIME_CHOICES.slice();
      //   if (!choices.includes(val)) {
      //     choices.push(val);
      //   }
      //   const options = choices.map(s => ({ value: s, label: s }));
      //   return (
      //     <div className="m-b-5" key={field}>
      //       {field.replace('__', '')}
      //       <Select.Creatable
      //         options={options}
      //         value={this.state.selectedValues[field]}
      //         onChange={this.changeFilter.bind(this, field)}
      //       />
      //     </div>
      //   );
      // });
      dateFilter = (
        <div className={'input-group input-daterange'} style={{ display: 'block' }}>
          <div className="form-group">
            <label style={{ display: 'block' }}>From</label>
            <DatePicker
              selected={this.state.startDate}
              selectsStart
              placeholderText="From"
              isClearable={true}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={this.changeDateFilter.bind(this, '__from')}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block' }}>To</label>
            <DatePicker
              selected={this.state.endDate}
              selectsEnd
              placeholderText="to"
              isClearable={true}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={this.changeDateFilter.bind(this, '__to')}
              className="form-control"
            />
          </div>
        </div>
      );
    }
    const filters = Object.keys(this.props.filtersChoices).map((filter) => {
      const data = this.props.filtersChoices[filter];
      const maxes = {};
      maxes[filter] = d3.max(data, function (d) {
        return d.metric;
      });
      return (
        <div key={filter} className="m-b-5">
          {filter}
          <Select
            placeholder={`Select [${filter}]`}
            key={filter}
            multi
            value={this.state.selectedValues[filter]}
            options={data.map((opt) => {
              const perc = Math.round((opt.metric / maxes[opt.filter]) * 100);
              const backgroundImage = (
                'linear-gradient(to right, lightgrey, ' +
                `lightgrey ${perc}%, rgba(0,0,0,0) ${perc}%`
              );
              const style = {
                backgroundImage,
                padding: '2px 5px',
              };
              return { value: opt.id, label: opt.id, style };
            })}
            onChange={this.changeFilter.bind(this, filter)}
          />
        </div>
      );
    });
    let groupby;
    if (this.props.groupByChoices.length > 0) {
      groupby = (
        <div key="groupBy" className="m-b-5">
          Group By
          <Select
              placeholder={`Select Group By Fields`}
              key='groupBy'
              multi
              value={this.state.selectedGroupByValues}
              options={this.props.groupByChoices.map((opt) => {
                return { value: opt, label: opt };
              })}
              onChange={this.changeGroupBy.bind(this)}
          />
        </div>
      );
    }
    return (
      <div>
        {dateFilter}
        {filters}
        {groupby}
        {!this.props.instantFiltering &&
          <Button
            bsSize="small"
            bsStyle="primary"
            onClick={this.clickApply.bind(this)}
            disabled={!this.state.hasChanged}
          >
            Apply
          </Button>
        }
      </div>
    );
  }
}
FilterBox.propTypes = propTypes;
FilterBox.defaultProps = defaultProps;

function filterBox(slice, payload) {
  const d3token = d3.select(slice.selector);
  d3token.selectAll('*').remove();

  // filter box should ignore the dashboard's filters
  // const url = slice.jsonEndpoint({ extraFilters: false });
  const fd = slice.formData;
  const filtersChoices = {};
  const groupByChoices = fd.groupby;
  // Making sure the ordering of the fields matches the setting in the
  // dropdown as it may have been shuffled while serialized to json
  fd.filterby.forEach((f) => {
    filtersChoices[f] = payload.data[f];
  });
  ReactDOM.render(
    <FilterBox
      filtersChoices={filtersChoices}
      groupByChoices={groupByChoices}
      onChange={slice.addFilter}
      onGroupByChange={slice.addGroupByFilter}
      showDateFilter={fd.date_filter}
      origSelectedValues={slice.getFilters() || {}}
      instantFiltering={fd.instant_filtering}
    />,
    document.getElementById(slice.containerId),
  );
}

module.exports = filterBox;
