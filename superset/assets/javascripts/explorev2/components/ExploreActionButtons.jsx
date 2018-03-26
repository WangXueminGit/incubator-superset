import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import URLShortLinkButton from './URLShortLinkButton';
import EmbedCodeButton from './EmbedCodeButton';
import DisplayQueryButton from './DisplayQueryButton';
import { downloadTableAsXls } from '../../modules/xlsUtils.js';

const propTypes = {
  canDownload: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    .isRequired,
  slice: PropTypes.object,
  queryEndpoint: PropTypes.string.isRequired,
  queryResponse: PropTypes.object,
  chartStatus: PropTypes.string,
  vizType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
export default function ExploreActionButtons({
  chartStatus,
  canDownload,
  slice,
  queryResponse,
  queryEndpoint,
  vizType,
  title,
}) {
  const exportToCSVClasses = cx('btn btn-default btn-sm', {
    'disabled disabledButton': !canDownload,
  });
  let xlsExportButton = null;
  if (vizType === 'pivot_table' || vizType === 'table') {
    xlsExportButton = (
      <button
        onClick={downloadTableAsXls.bind(this, slice, title)}
        className={exportToCSVClasses}
        title="Export to .xls format"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fa fa-file-excel-o" /> .xlsx
      </button>
    );
  }
  if (slice) {
    return (
      <div className="btn-group results" role="group">
        <URLShortLinkButton slice={slice} />

        <EmbedCodeButton slice={slice} />

        <a
          href={slice.data.json_endpoint}
          className="btn btn-default btn-sm"
          title="Export to .json"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-file-code-o" /> .json
        </a>

        <a
          href={slice.data.csv_endpoint}
          className={exportToCSVClasses}
          title="Export to .csv format"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-file-text-o" /> .csv
        </a>
        {xlsExportButton}
        <DisplayQueryButton
          queryResponse={queryResponse}
          queryEndpoint={queryEndpoint}
          chartStatus={chartStatus}
        />
      </div>
    );
  }
  return <DisplayQueryButton queryEndpoint={queryEndpoint} />;
}

ExploreActionButtons.propTypes = propTypes;
