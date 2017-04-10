const $ = window.$ = require('jquery');

import React from 'react';
import { Button, FormControl, FormGroup, Radio } from 'react-bootstrap';
import { getAjaxErrorMsg, showModal } from '../../modules/utils';

import ModalTrigger from '../../components/ModalTrigger';

const propTypes = {
  css: React.PropTypes.string,
  dashboard: React.PropTypes.object.isRequired,
  triggerNode: React.PropTypes.node.isRequired,
  slice: React.PropTypes.object,
  isButton: React.PropTypes.bool,
  isLink: React.PropTypes.bool,
};

class ExportMailModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dashboard: props.dashboard,
      css: props.css,
      target: '',
      working: false
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
  exportEmail(target, exportType) {
    const dashboard = this.props.dashboard;
    const exportMailModal = this.modal;
    const slice = this.props.slice;
    var data = {
      target: target,
      "dashbaord_name": dashboard.dashboard_title,
      selector: slice ? '#slice_' + slice.slice_id : false,
    };
    this.setState({working: true});
    $.ajax({
      type: 'POST',
      url: '/superset/export/dashboard/' + dashboard.id + '/' + exportType,
      data: data,
      success(resp) {
        this.setState({working: false});
        exportMailModal.close();
        if(exportType === 'download') {
          showModal({
            title: 'Success',
            body: 'The download of snapshot should be started immediately.',
          });
          var filename = slice ? "Lumos-Dashboard-"+dashboard.id+"-slice-"+slice.slice_id+".jpeg" : "Lumos-Dashboard-"+dashboard.id+".jpg", a = document.createElement('a');
          a.setAttribute("download", filename);
          a.setAttribute("href", 'data:image/jpeg;base64,' + resp.image);
          a.click();
        }
        else if(exportType === 'email') {
          showModal({
            title: 'Success',
            body: 'The snapshot of dashboard was sent to '+target+' successfully.',
          });
        }
      },
      error(error) {
        this.setState({working: false});
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
    let sliceFormControl = null, working = this.state.working;
    if(this.props.slice) {
      sliceFormControl = <FormControl
        type="text"
        disabled
        defaultValue={this.props.slice.slice_name}
      />
    }
    let loadingElement = null;
    if(working) {
      loadingElement = (<i className="fa fa-spinner fa-spin fa-fw"></i>)
    }
    return (
      <ModalTrigger
        ref={(modal) => { this.modal = modal; }}
        triggerNode={this.props.triggerNode}
        isButton={this.props.isButton}
        tooltip="Export"
        isLink={this.props.isLink}
        modalTitle="Export Snapshot as image"
        modalBody={
          <FormGroup>
            { sliceFormControl }
            <FormControl
              type="text"
              placeholder="Recepient emails, separated by comma(,)"
              onFocus={this.handleTargetChange}
              onChange={this.handleTargetChange}
            />
          </FormGroup>
        }
        modalFooter={
          <div>
            {loadingElement}
            <Button
              bsStyle="primary"
              onClick={() => { this.exportEmail(this.state.target, 'email'); }}
              disabled={working}
            >
              <i className="fa fa-envelope" aria-hidden="true"></i> Send to email
            </Button>
            <Button
              bsStyle="primary"
              onClick={() => { this.exportEmail(this.state.target, 'download'); }}
              disabled={working}
            >
              <i className="fa fa-download" aria-hidden="true"></i> Download to local
            </Button>
          </div>
        }
      />
    );
  }
}
ExportMailModal.propTypes = propTypes;

export default ExportMailModal;
