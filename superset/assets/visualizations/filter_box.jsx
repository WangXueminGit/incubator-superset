// JS
import d3 from 'd3';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import DateFilterControl from '../javascripts/explorev2/components/controls/DateFilterControl';
import ControlHeader from '../javascripts/explorev2/components/ControlHeader';
import '../stylesheets/react-select/select.less';
import { TIME_CHOICES } from './constants';
import './filter_box.css';

// maps control names to their key in extra_filters
const timeFilterMap = {
  since: '__from',
  until: '__to',
};

const propTypes = {
  origSelectedValues: PropTypes.object,
  instantFiltering: PropTypes.bool,
  filtersChoices: PropTypes.object,
  onChange: PropTypes.func,
  showDateFilter: PropTypes.bool,
  datasource: PropTypes.object.isRequired,
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
      hasChanged: false,
      startDate: null,
      endDate: null,
    };
    this.updateDateStatus();
  }
  updateDateStatus() {
    if (this.state.selectedValues) {
      if (this.state.selectedValues['__from']) {
        this.state.startDate = moment(this.state.selectedValues['__from']);
      }
      if (this.state.selectedValues['__to']) {
        this.state.endDate = moment(this.state.selectedValues['__to']);
      }
    }
  }
  clickApply() {
    this.props.onChange(Object.keys(this.state.selectedValues)[0], [], true, true);
    this.setState({ hasChanged: false });
  }
  changeFilter(filter, options) {
    const fltr = timeFilterMap[filter] || filter;
    let vals = null;
    if (options !== null) {
      if (Array.isArray(options)) {
        vals = options.map(opt => opt.value);
      } else if (options.value) {
        vals = options.value;
      } else {
        vals = options;
      }
    }
    const selectedValues = Object.assign({}, this.state.selectedValues);
    selectedValues[fltr] = vals;
    this.setState({ selectedValues, hasChanged: true });
    this.props.onChange(fltr, vals, false, this.props.instantFiltering);
  }
  changeDateFilter(filter, option) {
    let val = null, mom = null;
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
  render() {
    let dateFilter;
    const since = '__from';
    const until = '__to';
    if (this.props.showDateFilter) {
      dateFilter = (
        <div className="row space-1">
          <div className="col-lg-6 col-xs-12">
            <ControlHeader
              label="Since"
              description="Select starting date"
            />
            <DateFilterControl
              name={since}
              label="Since"
              description="Select starting date"
              onChange={this.changeFilter.bind(this, since)}
              value={this.state.selectedValues[since]}
            />
          </div>
          <div className="col-lg-6 col-xs-12">
            <ControlHeader
              label="Until"
              description="Select end date"
            />
            <DateFilterControl
              name={until}
              label="Until"
              description="Select end date"
              onChange={this.changeFilter.bind(this, until)}
              value={this.state.selectedValues[until]}
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
          {this.props.datasource.verbose_map[filter] || filter}
          <Select.Creatable
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
    return (
      <div className="scrollbar-container">
        <div className="scrollbar-content">
          {dateFilter}
          {filters}
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
  // Making sure the ordering of the fields matches the setting in the
  // dropdown as it may have been shuffled while serialized to json
  fd.groupby.forEach((f) => {
    filtersChoices[f] = payload.data[f];
  });
  ReactDOM.render(
    <FilterBox
      filtersChoices={filtersChoices}
      onChange={slice.addFilter}
      showDateFilter={fd.date_filter}
      datasource={slice.datasource}
      origSelectedValues={slice.getFilters() ? slice.getFilters().columns : {}}
      instantFiltering={fd.instant_filtering}
    />,
    document.getElementById(slice.containerId),
  );
}

module.exports = filterBox;
