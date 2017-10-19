import React from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup } from 'react-bootstrap';

import Button from '../../components/Button';
import CssEditor from './CssEditor';
import RefreshIntervalModal from './RefreshIntervalModal';
import SaveModal from './SaveModal';
import ExportMailModal from './ExportMailModal';
import CodeModal from './CodeModal';
import SliceAdder from './SliceAdder';

const $ = window.$ = require('jquery');

const propTypes = {
  dashboard: PropTypes.object.isRequired,
};

class Controls extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      css: props.dashboard.css || '',
      cssTemplates: [],
      refreshInterval: props.dashboard.metadata.refreshInterval || 0,
    };
  }
  componentWillMount() {
    $.get('/csstemplateasyncmodelview/api/read', (data) => {
      const cssTemplates = data.result.map(row => ({
        value: row.template_name,
        css: row.css,
        label: row.template_name,
      }));
      this.setState({ cssTemplates });
    });
  }
  refresh() {
    this.props.dashboard.sliceObjects.forEach((slice) => {
      slice.render(true);
    });
  }
  changeCss(css) {
    this.setState({ css });
    this.props.dashboard.onChange();
  }
  updateRefreshInterval(refreshInterval) {
    this.setState({refreshInterval});
    this.props.dashboard.startPeriodicRender(refreshInterval * 1000);
  }
  render() {
    const dashboard = this.props.dashboard;
    const emailBody = `Checkout this dashboard: ${window.location.href}`;
    const emailLink = 'mailto:?Subject=Superset%20Dashboard%20'
      + `${dashboard.dashboard_title}&Body=${emailBody}`;
    const initialRefreshInterval = dashboard['metadata']['refreshInterval'] || 0;
    return (
      <ButtonGroup>
        <Button
          tooltip="Force refresh the whole dashboard"
          onClick={this.refresh.bind(this)}
        >
          <i className="fa fa-refresh" />
        </Button>
        <SliceAdder
          dashboard={dashboard}
          triggerNode={
            <i className="fa fa-plus" />
          }
        />
        <RefreshIntervalModal
          initialRefreshFrequency={initialRefreshInterval}
          onChange={this.updateRefreshInterval.bind(this)}
          triggerNode={
            <i className="fa fa-clock-o" />
          }
        />
        <CodeModal
          codeCallback={dashboard.readFilters.bind(dashboard)}
          triggerNode={<i className="fa fa-filter" />}
        />
        <CssEditor
          dashboard={dashboard}
          triggerNode={
            <i className="fa fa-css3" />
          }
          initialCss={dashboard.css}
          templates={this.state.cssTemplates}
          onChange={this.changeCss.bind(this)}
        />
        <Button
          onClick={() => { window.location = emailLink; }}
        >
          <i className="fa fa-envelope" />
        </Button>
        <Button
          disabled={!dashboard.dash_edit_perm}
          onClick={() => {
            window.location = `/dashboardmodelview/edit/${dashboard.id}`;
          }}
          tooltip="Edit this dashboard's properties"
        >
          <i className="fa fa-edit" />
        </Button>
        <SaveModal
          dashboard={dashboard}
          css={this.state.css}
          refreshInterval={this.state.refreshInterval}
          triggerNode={
            <Button disabled={!dashboard.dash_save_perm}>
              <i className="fa fa-save" />
            </Button>
          }
        />
        <Button
          onClick={() => {
            const dl_csv_api_path = `/dashboardmodelview/download_dashboard_csv/`
            window.location = dl_csv_api_path + `${dashboard.id}`;
          }}
          tooltip="Export as CSV"
        >
          <i className="fa fa-table" />
        </Button>
        <ExportMailModal
          dashboard={dashboard}
          css={this.state.css}
          isButton
          triggerNode={
            <i className="fa fa-share-alt" />
          }
        />
      </ButtonGroup>
    );
  }
}
Controls.propTypes = propTypes;

export default Controls;
