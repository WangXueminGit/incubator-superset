import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, FormGroup, Radio } from 'react-bootstrap';
import { getAjaxErrorMsg, showModal } from '../../modules/utils';
import ModalTrigger from '../../components/ModalTrigger';
import Checkbox from '../../components/Checkbox';

const $ = window.$ = require('jquery');

const propTypes = {
  css: PropTypes.string,
  dashboard: PropTypes.object.isRequired,
  triggerNode: PropTypes.node.isRequired,
  refreshInterval: PropTypes.number,
};

class SaveModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dashboard: props.dashboard,
      css: props.css,
      saveType: 'overwrite',
      newDashName: props.dashboard.dashboard_title + ' [copy]',
      duplicateSlices: false,
    };
    this.modal = null;
    this.handleSaveTypeChange = this.handleSaveTypeChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.saveDashboard = this.saveDashboard.bind(this);
  }
  toggleDuplicateSlices() {
    this.setState({ duplicateSlices: !this.state.duplicateSlices });
  }
  handleSaveTypeChange(event) {
    this.setState({
      saveType: event.target.value,
    });
  }
  handleNameChange(event) {
    this.setState({
      newDashName: event.target.value,
      saveType: 'newDashboard',
    });
  }
  saveDashboardRequest(data, url, saveType) {
    const dashboard = this.props.dashboard;
    const saveModal = this.modal;
    Object.assign(data, { css: this.props.css });
    $.ajax({
      type: 'POST',
      url,
      data: {
        data: JSON.stringify(data),
      },
      success(resp) {
        saveModal.close();
        dashboard.onSave();
        if (saveType === 'newDashboard') {
          window.location = '/superset/dashboard/' + resp.slug + '/';
        } else {
          showModal({
            title: 'Success',
            body: 'This dashboard was saved successfully.',
          });
        }
      },
      error(error) {
        saveModal.close();
        const errorMsg = getAjaxErrorMsg(error);
        showModal({
          title: 'Error',
          body: 'Sorry, there was an error saving this dashboard: </ br>' + errorMsg,
        });
      },
    });
  }
  saveDashboard(saveType, newDashboardTitle) {
    const dashboard = this.props.dashboard;
    const expandedSlices = {};
    $.each($('.slice_info'), function () {
      const widget = $(this).parents('.widget');
      const sliceDescription = widget.find('.slice_description');
      if (sliceDescription.is(':visible')) {
        expandedSlices[$(widget).attr('data-slice-id')] = true;
      }
    });
    const positions = dashboard.reactGridLayout.serialize();
    const refreshInterval = this.props.refreshInterval || 0;
    const data = {
      positions,
      css: this.state.css,
      expanded_slices: expandedSlices,
      refreshInterval: refreshInterval,
      duplicate_slices: this.state.duplicateSlices,
      default_filters: dashboard.readFilters(),
    };
    let url = null;
    if (saveType === 'overwrite') {
      url = '/superset/save_dash/' + dashboard.id + '/';
      this.saveDashboardRequest(data, url, saveType);
    } else if (saveType === 'newDashboard') {
      if (!newDashboardTitle) {
        this.modal.close();
        showModal({
          title: 'Error',
          body: 'You must pick a name for the new dashboard',
        });
      } else {
        data.dashboard_title = newDashboardTitle;
        url = '/superset/copy_dash/' + dashboard.id + '/';
        this.saveDashboardRequest(data, url, saveType);
      }
    }
  }
  render() {
    return (
      <ModalTrigger
        ref={(modal) => { this.modal = modal; }}
        triggerNode={this.props.triggerNode}
        modalTitle="Save Dashboard"
        modalBody={
          <FormGroup>
            <Radio
              value="overwrite"
              onChange={this.handleSaveTypeChange}
              checked={this.state.saveType === 'overwrite'}
            >
              Overwrite Dashboard [{this.props.dashboard.dashboard_title}]
            </Radio>
            <Radio
              value="newDashboard"
              onChange={this.handleSaveTypeChange}
              checked={this.state.saveType === 'newDashboard'}
            >
              Save as:
            </Radio>
            <FormControl
              type="text"
              placeholder="[dashboard name]"
              value={this.state.newDashName}
              onFocus={this.handleNameChange}
              onChange={this.handleNameChange}
            />
            <div className="m-l-25 m-t-5">
              <Checkbox
                checked={this.state.duplicateSlices}
                onChange={this.toggleDuplicateSlices.bind(this)}
              />
              <span className="m-l-5">also copy (duplicate) slices. (Note: copied slices will link to the original data sources.)</span>
            </div>
          </FormGroup>
        }
        modalFooter={
          <div>
            <Button
              bsStyle="primary"
              onClick={() => { this.saveDashboard(this.state.saveType, this.state.newDashName); }}
            >
              Save
            </Button>
          </div>
        }
      />
    );
  }
}
SaveModal.propTypes = propTypes;

export default SaveModal;
