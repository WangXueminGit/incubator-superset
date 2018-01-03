/* global notify */
import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Col, Modal } from 'react-bootstrap';

import Select from 'react-select';
import { Table } from 'reactable';
import shortid from 'shortid';
import $ from 'jquery';
import { getExploreUrl } from '../../explorev2/exploreUtils';

const CHART_TYPES = [
  { value: 'dist_bar', label: 'Distribution - Bar Chart', requiresTime: false },
  { value: 'pie', label: 'Pie Chart', requiresTime: false },
  { value: 'line', label: 'Time Series - Line Chart', requiresTime: true },
  { value: 'bar', label: 'Time Series - Bar Chart', requiresTime: true },
];

const propTypes = {
  onHide: PropTypes.func,
  query: PropTypes.object,
  show: PropTypes.bool,
};
const defaultProps = {
  show: false,
  query: {},
  onHide: () => {},
};

class VisualizeModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chartType: CHART_TYPES[0],
      datasourceName: this.datasourceName(),
      columns: {},
      hints: [],
    };
  }
  componentDidMount() {
    this.validate();
  }
  componentWillReceiveProps(nextProps) {
    this.setStateFromProps(nextProps);
  }
  setStateFromProps(props) {
    if (
        !props.query ||
        !props.query.results ||
        !props.query.results.columns) {
      return;
    }
    const columns = {};
    props.query.results.columns.forEach((col) => {
      columns[col.name] = col;
      // add for visulization generization
      columns[col.name].is_temporal = col.is_date;
      columns[col.name].is_groupable = col.is_dim;
      columns[col.name].is_filterable = col.is_dim;
    });
    this.setState({ columns, schema: props.query.schema });
  }
  datasourceName() {
    const { query } = this.props;
    const uniqueId = shortid.generate();
    let datasourceName = uniqueId;
    if (query) {
      datasourceName = query.user ? `${query.user}-` : '';
      datasourceName += query.db ? `${query.db}-` : '';
      datasourceName += `${query.tab}-${uniqueId}`;
    }
    return datasourceName;
  }
  validate() {
    const hints = [];
    const cols = this.mergedColumns();
    const re = /^\w+$/;
    Object.keys(cols).forEach((colName) => {
      if (!re.test(colName)) {
        hints.push(
          <div>
            "{colName}" is not right as a column name, please alias it
            (as in SELECT count(*) <strong>AS my_alias</strong>) using only
            alphanumeric characters and underscores
          </div>);
      }
    });
    if (this.state.chartType === null) {
      hints.push('Pick a chart type!');
    } else if (this.state.chartType.requiresTime) {
      let hasTime = false;
      for (const colName in cols) {
        const col = cols[colName];
        if (col.hasOwnProperty('is_date') && col.is_date) {
          hasTime = true;
        }
      }
      if (!hasTime) {
        hints.push(
          'To use this chart type you need at least one column ' +
          'flagged as a date');
      }
    }
    this.setState({ hints });
  }
  changeChartType(option) {
    this.setState({ chartType: option }, this.validate);
  }
  mergedColumns() {
    const columns = Object.assign({}, this.state.columns);
    if (this.props.query && this.props.query.results.columns) {
      this.props.query.results.columns.forEach((col) => {
        if (columns[col.name] === undefined) {
          columns[col.name] = col;
        }
      });
    }
    return columns;
  }
  visualize() {
    const vizOptions = {
      chartType: this.state.chartType.value,
      datasourceName: this.state.datasourceName,
      schema: this.state.schema,
      columns: this.state.columns,
      sql: this.props.query.sql,
      dbId: this.props.query.dbId,
    };
    notify.info('Creating a data source and popping a new tab');
    $.ajax({
      type: 'POST',
      url: '/superset/sqllab_viz/',
      async: false,
      data: {
        data: JSON.stringify(vizOptions),
      },
      dataType: 'json',
      success: (resp) => {
        const columns = Object.keys(this.state.columns).map(k => this.state.columns[k]);
        const data = JSON.parse(resp);
        const mainMetric = columns.filter(d => d.agg)[0];
        const mainGroupBy = columns.filter(d => d.is_dim)[0];
        const formData = {
          datasource: `${data.table_id}__table`,
          viz_type: this.state.chartType.value,
          since: '100 years ago',
          limit: '0',
        };
        if (mainMetric) {
          formData.metrics = [mainMetric.name];
          formData.metric = mainMetric.name;
        }
        if (mainGroupBy) {
          formData.groupby = [mainGroupBy.name];
        }
        window.open(getExploreUrl(formData));
      },
      error: () => notify('An error occurred while creating the data source'),
    });
  }
  changeDatasourceName(event) {
    this.setState({ datasourceName: event.target.value });
    this.validate();
  }
  changeCheckbox(attr, columnName, event) {
    let columns = this.mergedColumns();
    const column = Object.assign({}, columns[columnName], { [attr]: event.target.checked });
    columns = Object.assign({}, columns, { [columnName]: column });
    this.setState({ columns }, this.validate);
  }
  changeAggFunction(columnName, option) {
    let columns = this.mergedColumns();
    const val = (option) ? option.value : null;
    const column = Object.assign({}, columns[columnName], { agg: val });
    columns = Object.assign({}, columns, { [columnName]: column });
    this.setState({ columns }, this.validate);
  }
  render() {
    if (!(this.props.query) || !(this.props.query.results) || !(this.props.query.results.columns)) {
      return (
        <div className="VisualizeModal">
          <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Body>
              No results available for this query
            </Modal.Body>
          </Modal>
        </div>
      );
    }
    const tableData = this.props.query.results.columns.map(col => ({
      column: col.name,
      type: col.type,
      is_dim: col.is_dim,
      is_date: col.is_date,
      groupable: (
        <input
          type="checkbox"
          onChange={this.changeCheckbox.bind(this, 'is_groupable', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_groupable : false}
          className="form-control"
        />
      ),
      filterable: (
        <input
          type="checkbox"
          onChange={this.changeCheckbox.bind(this, 'is_filterable', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_filterable : false}
          className="form-control"
        />
      ),
      count_distinct: (
        <input
          type="checkbox"
          onChange={this.changeCheckbox.bind(this, 'is_count_distinct', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_count_distinct : false}
          className="form-control"
        />
      ),
      sum: (
        <input
          type="checkbox"
          onChange={this.changeCheckbox.bind(this, 'is_sum', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_sum : false}
          className="form-control"
        />
      ),
      min: (
        <input
          type="checkbox"
          onChange={this.changeCheckbox.bind(this, 'is_min', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_min : false}
          className="form-control"
        />
      ),
      max: (
        <input
          type="checkbox"
          onChange={this.changeCheckbox.bind(this, 'is_max', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_max : false}
          className="form-control"
        />
      ),
      is_temporal: (
        <input
          type="checkbox"
          onChange={this.changeCheckbox.bind(this, 'is_temporal', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_temporal : false}
          className="form-control"
        />
      ),
      base16_encoded: (
        <input
          type="checkbox"
          onChange={this.changeCheckbox.bind(this, 'is_base16_encoded', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_base16_encoded : false}
          className="form-control"
        />
      ),
    }));
    const alerts = this.state.hints.map((hint, i) => (
      <Alert bsStyle="warning" key={i}>{hint}</Alert>
    ));
    const modal = (
      <div className="VisualizeModal">
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header closeButton>
            <Modal.Title>Visualize</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {alerts}
            <div className="row">
              <Col md={6}>
                Chart Type
                <Select
                  name="select-chart-type"
                  placeholder="[Chart Type]"
                  options={CHART_TYPES}
                  value={(this.state.chartType) ? this.state.chartType.value : null}
                  autosize={false}
                  onChange={this.changeChartType.bind(this)}
                />
              </Col>
              <Col md={6}>
                Datasource Name
                <input
                  type="text"
                  className="form-control input-sm"
                  placeholder="datasource name"
                  onChange={this.changeDatasourceName.bind(this)}
                  value={this.state.datasourceName}
                />
              </Col>
            </div>
            <hr />
            <Table
              className="table table-condensed"
              columns={['column', 'type', 'groupable', 'filterable', 'count_distinct',
                        'sum', 'min', 'max', 'is_temporal', 'base16_encoded']}
              data={tableData}
            />
            <Button
              onClick={this.visualize.bind(this)}
              bsStyle="primary"
              disabled={(this.state.hints.length > 0)}
            >
              Visualize
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    );
    return modal;
  }
}
VisualizeModal.propTypes = propTypes;
VisualizeModal.defaultProps = defaultProps;

export default VisualizeModal;
