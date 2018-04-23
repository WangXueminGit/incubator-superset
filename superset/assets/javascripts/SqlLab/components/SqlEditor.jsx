import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  FormGroup,
  InputGroup,
  Form,
  FormControl,
  Label,
  OverlayTrigger,
  Row,
  Tooltip,
  Collapse,
} from 'react-bootstrap';
import SplitPane from 'react-split-pane';

import Button from '../../components/Button';
import SouthPane from './SouthPane';
import SaveQuery from './SaveQuery';
import Timer from '../../components/Timer';
import SqlEditorLeftBar from './SqlEditorLeftBar';
import AceEditorWrapper from './AceEditorWrapper';
import { STATE_BSSTYLE_MAP } from '../constants';
import RunQueryActionButton from './RunQueryActionButton';
import { detectOS, OS } from '../../common';

const propTypes = {
  actions: PropTypes.object.isRequired,
  getHeight: PropTypes.func.isRequired,
  database: PropTypes.object,
  latestQuery: PropTypes.object,
  tables: PropTypes.array.isRequired,
  editorQueries: PropTypes.array.isRequired,
  dataPreviewQueries: PropTypes.array.isRequired,
  queryEditor: PropTypes.object.isRequired,
  hideLeftBar: PropTypes.bool,
};

const defaultProps = {
  database: null,
  latestQuery: null,
  hideLeftBar: false,
};

class SqlEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      autorun: props.queryEditor.autorun,
      ctas: '',
    };

    this.onResize = this.onResize.bind(this);
    this.runQuery = this.runQuery.bind(this);
    this.stopQuery = this.stopQuery.bind(this);
    this.setQueryEditorSql = this.setQueryEditorSql.bind(this);
  }
  componentWillMount() {
    if (this.state.autorun) {
      this.setState({ autorun: false });
      this.props.actions.queryEditorSetAutorun(this.props.queryEditor, false);
      this.startQuery();
    }
  }
  componentDidMount() {
    this.onResize();
  }
  onResize() {
    const height = this.sqlEditorHeight();
    this.setState({
      editorPaneHeight: this.refs.ace.clientHeight,
      southPaneHeight: height - this.refs.ace.clientHeight,
      height,
    });

    if (this.refs.ace.clientHeight) {
      this.props.actions.persistEditorHeight(this.props.queryEditor, this.refs.ace.clientHeight);
    }
  }
  setQueryEditorSql(sql) {
    this.props.actions.queryEditorSetSql(this.props.queryEditor, sql);
  }
  runQuery(runAsync = false) {
    let effectiveRunAsync = runAsync;
    if (!this.props.database.allow_run_sync) {
      effectiveRunAsync = true;
    }
    this.startQuery(effectiveRunAsync);
  }
  startQuery(runAsync = false, ctas = false) {
    if (this.props.latestQuery && this.props.latestQuery.state === 'running') {
      return;
    }
    const qe = this.props.queryEditor;
    const query = {
      dbId: qe.dbId,
      sql: qe.selectedText ? qe.selectedText : qe.sql,
      sqlEditorId: qe.id,
      tab: qe.title,
      schema: qe.schema,
      tempTableName: ctas ? this.state.ctas : '',
      runAsync,
      ctas,
    };
    this.props.actions.runQuery(query);
    this.props.actions.setActiveSouthPaneTab('Results');
  }
  stopQuery() {
    this.props.actions.postStopQuery(this.props.latestQuery);
  }
  createTableAs() {
    this.startQuery(true, true);
  }
  ctasChanged(event) {
    this.setState({ ctas: event.target.value });
  }
  sqlEditorHeight() {
    // quick hack to make the white bg of the tab stretch full height.
    const horizontalScrollbarHeight = 25;
    return parseInt(this.props.getHeight(), 10) - horizontalScrollbarHeight;
  }
  renderEditorBottomBar() {
    let ctasControls;
    if (this.props.database && this.props.database.allow_ctas) {
      const ctasToolTip = 'Create table as with query results';
      ctasControls = (
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              bsSize="small"
              className="input-sm"
              placeholder="new table name"
              onChange={this.ctasChanged.bind(this)}
            />
            <InputGroup.Button>
              <Button
                bsSize="small"
                disabled={this.state.ctas.length === 0}
                onClick={this.createTableAs.bind(this)}
                tooltip={ctasToolTip}
              >
                <i className="fa fa-table" /> CTAS
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      );
    }
    const qe = this.props.queryEditor;
    let limitWarning = null;
    if (this.props.latestQuery && this.props.latestQuery.limit_reached) {
      const tooltip = (
        <Tooltip id="tooltip">
          It appears that the number of rows in the query results displayed
          was limited on the server side to
          the {this.props.latestQuery.rows} limit.
        </Tooltip>
      );
      limitWarning = (
        <OverlayTrigger placement="left" overlay={tooltip}>
          <Label bsStyle="warning" className="m-r-5">LIMIT</Label>
        </OverlayTrigger>
      );
    }
    return (
      <div className="sql-toolbar clearfix" id="js-sql-toolbar">
        <div className="pull-left">
          <Form inline>
            <RunQueryActionButton
              allowAsync={this.props.database ? this.props.database.allow_run_async : false}
              dbId={qe.dbId}
              queryState={this.props.latestQuery && this.props.latestQuery.state}
              runQuery={this.runQuery}
              selectedText={qe.selectedText}
              stopQuery={this.stopQuery}
            />
            <SaveQuery
              defaultLabel={qe.title}
              sql={qe.sql}
              onSave={this.props.actions.saveQuery}
              schema={qe.schema}
              dbId={qe.dbId}
            />
            {ctasControls}
          </Form>
        </div>
        <div className="pull-right">
          {limitWarning}
          {this.props.latestQuery &&
            <Timer
              startTime={this.props.latestQuery.startDttm}
              endTime={this.props.latestQuery.endDttm}
              state={STATE_BSSTYLE_MAP[this.props.latestQuery.state]}
              isRunning={this.props.latestQuery.state === 'running'}
            />
          }
        </div>
      </div>
    );
  }
  render() {
    const height = this.sqlEditorHeight();
    const defaultNorthHeight = this.props.queryEditor.height || 200;
    return (
      <div
        className="SqlEditor"
        style={{
          height: height + 'px',
        }}
      >
        <Row>
          <Collapse
            in={!this.props.hideLeftBar}
          >
            <Col md={3}>
              <SqlEditorLeftBar
                height={height}
                queryEditor={this.props.queryEditor}
                tables={this.props.tables}
                actions={this.props.actions}
              />
            </Col>
          </Collapse>
          <Col
            md={this.props.hideLeftBar ? 12 : 9}
            style={{ height: this.state.height }}
          >
            <SplitPane
              split="horizontal"
              defaultSize={defaultNorthHeight}
              minSize={100}
              maxSize={height-100}
              onChange={this.onResize}
              onDragFinished={this.onResize}
            >
              <div ref="ace" style={{ width: '100%' }}>
                <div>
                  <AceEditorWrapper
                    allowAsync={this.props.database ? this.props.database.allow_run_async : false}
                    actions={this.props.actions}
                    onBlur={this.setQueryEditorSql}
                    queryEditor={this.props.queryEditor}
                    onCtrlEnter={this.runQuery}
                    sql={this.props.queryEditor.sql}
                    tables={this.props.tables}
                    height={((this.state.editorPaneHeight || defaultNorthHeight) - 50) + 'px'}
                  />
                  {this.renderEditorBottomBar()}
                </div>
              </div>
              <div ref="south">
                <SouthPane
                  editorQueries={this.props.editorQueries}
                  dataPreviewQueries={this.props.dataPreviewQueries}
                  actions={this.props.actions}
                  height={this.state.southPaneHeight || 0}
                />
              </div>
            </SplitPane>
          </Col>
        </Row>
      </div>
    );
  }
}
SqlEditor.defaultProps = defaultProps;
SqlEditor.propTypes = propTypes;

export default SqlEditor;
