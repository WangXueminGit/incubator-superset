/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { getExploreUrl } from '../../explorev2/exploreUtils';
import { downloadTableAsXls } from '../../modules/xlsUtils.js';

const propTypes = {
  dashboard: PropTypes.object.isRequired,
  slice: PropTypes.object.isRequired,
  removeSlice: PropTypes.func.isRequired,
  expandedSlices: PropTypes.object,
};

function SliceCell({ expandedSlices, removeSlice, dashboard, slice }) {
  let xlsExportButton = null;
  let moveChartButton = null;
  let editChartButton = null;
  let exploreChartButton = null;
  let removeChartButton = null;
  if (slice.form_data.viz_type === 'pivot_table' || slice.form_data.viz_type === 'table') {
    xlsExportButton = (
      <a
        className="exportCSV"
        onClick={downloadTableAsXls.bind(this, slice, slice.slice_name)}
        title="Export as XLS"
        data-toggle="tooltip"
      >
        <i className="fa fa-file-excel-o" />
      </a>
    )
  }
  if (dashboard.curUserType == 'admin' || dashboard.curUserType == 'owner') {
    moveChartButton = (
      <a title="Move chart" data-toggle="tooltip">
        <i className="fa fa-arrows drag" />
      </a>
    )
    editChartButton = (
      <a
        href={slice.edit_url}
        title="Edit chart"
        data-toggle="tooltip"
      >
        <i className="fa fa-pencil" />
      </a>
    )
    exploreChartButton = (
      <a href={slice.slice_url} title="Explore chart" data-toggle="tooltip">
        <i className="fa fa-share" />
      </a>
    )
    removeChartButton = (
      <a
        className="remove-chart"
        title="Remove chart from dashboard"
        data-toggle="tooltip"
      >
        <i
          className="fa fa-close"
          onClick={() => { removeSlice(slice.slice_id); }}
        />
      </a>
    )
  }
  return (
      <div className="slice-cell" id={`${slice.slice_id}-cell`}>
        <div className="chart-header">
          <div className="row">
            <div className="col-md-12 header">
              <span>{slice.slice_name}</span>
            </div>
            <div className="col-md-12 chart-controls">
              <div className="pull-right">
                {moveChartButton}
                <a className="refresh" title="Force refresh data" data-toggle="tooltip">
                  <i className="fa fa-repeat" />
                </a>
                {slice.description &&
                  <a title="Toggle chart description">
                    <i
                      className="fa fa-info-circle slice_info"
                      title={slice.description}
                      data-toggle="tooltip"
                    />
                  </a>
                }
                {editChartButton}
                {exploreChartButton}
                {removeChartButton}
                <a
                  className="exportCSV"
                  title="Export as CSV"
                  data-toggle="tooltip"
                >
                  <i className="fa fa-table"
                     onClick={() => {window.location = getExploreUrl(slice.form_data, 'csv', true, null,
                                     dashboard.id)}} />
                </a>
                {xlsExportButton}
              </div>
            </div>
          </div>
        </div>
        <div
          className="slice_description bs-callout bs-callout-default"
          style={
            expandedSlices &&
            expandedSlices[String(slice.slice_id)] ? {} : { display: 'none' }
          }
          dangerouslySetInnerHTML={{ __html: slice.description_markeddown }}
        />
        <div className="row chart-container">
          <input type="hidden" value="false" />
          <div id={'token_' + slice.slice_id} className="token col-md-12">
            <img
              src="/static/assets/images/loading.gif"
              className="loading"
              alt="loading"
            />
            <div
              id={'con_' + slice.slice_id}
              className={`slice_container ${slice.form_data.viz_type}`}
            />
          </div>
        </div>
      </div>
    );
}

SliceCell.propTypes = propTypes;

export default SliceCell;
