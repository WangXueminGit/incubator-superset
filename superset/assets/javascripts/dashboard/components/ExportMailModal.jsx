const $ = window.$ = require('jquery');

import React from 'react';
import { Button, FormControl, FormGroup, Radio } from 'react-bootstrap';
import { getAjaxErrorMsg, showModal } from '../../modules/utils';

import ModalTrigger from '../../components/ModalTrigger';

const propTypes = {
  css: React.PropTypes.string,
  dashboard: React.PropTypes.object.isRequired,
  triggerNode: React.PropTypes.node.isRequired,
};

class ExportMailModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dashboard: props.dashboard,
      css: props.css,
      target: '',
    };
    this.modal = null;
    this.handleTargetChange = this.handleTargetChange.bind(this);
    this.exportEmail = this.exportEmail.bind(this);
  }
  handleTargetChange(event) {
    this.setState({
      target: event.target.value,
    });
  }
  exportEmail(target) {
    const dashboard = this.props.dashboard;
    const exportMailModal = this.modal;
    $.ajax({
      type: 'POST',
      url: '/webshot/superset/dashboard/' + dashboard.id,
      data: {
        target: target,
        dashbaord_name: dashboard.dashboard_title
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization", "Basic " + btoa('superset_export:REyvsmZtyxdLxQH55bPSFg2xj678dnm4EazyL2SaLWPfBTyZ'));
      },
      success(resp) {
        exportMailModal.close();
        showModal({
          title: 'Success',
          body: 'This dashboard was exported to '+target+' successfully.',
        });
      },
      error(error) {
        exportMailModal.close();
        const errorMsg = getAjaxErrorMsg(error);
        showModal({
          title: 'Error',
          body: 'Sorry, there was an error exporting this dashboard: </ br>' + errorMsg,
        });
      },
    });
  }
  render() {
    return (
      <ModalTrigger
        ref={(modal) => { this.modal = modal; }}
        triggerNode={this.props.triggerNode}
        isButton
        modalTitle="Export Snapshot to email"
        modalBody={
          <FormGroup>
            <FormControl
              type="text"
              placeholder="Recepient of snapshot"
              onFocus={this.handleTargetChange}
              onChange={this.handleTargetChange}
            />
          </FormGroup>
        }
        modalFooter={
          <div>
            <Button
              bsStyle="primary"
              onClick={() => { this.exportEmail(this.state.target); }}
            >
              Export
            </Button>
          </div>
        }
      />
    );
  }
}
ExportMailModal.propTypes = propTypes;

export default ExportMailModal;
