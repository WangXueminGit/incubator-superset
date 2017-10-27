import d3 from 'd3';
import 'datatables-bootstrap3-plugin/media/css/datatables-bootstrap3.css';
import 'datatables.net';
import dt from 'datatables.net-bs';

import {
  fixDataTableBodyHeight
}
  from '../javascripts/modules/utils';
import {
  timeFormatFactory, formatDate
}
  from '../javascripts/modules/dates';
import './table.css';
import './table.scss';

import $ from 'jquery';

dt(window, $);

var imported = document.createElement('script');
imported.src = "/static/assets/vendor/javascripts/dataTables.colResize.js";
document.head.appendChild(imported);

function tableVis(slice, payload) {
  const container = $(slice.selector);
  const fC = d3.format('0,000');
  let timestampFormatter;
  const data = payload.data;
  const fd = slice.formData;
  const styling = fd.styling ? fd.styling : null;
  const columnConfiguration = fd.column_configuration ? fd.column_configuration : {};
  const rowConfiguration = fd.row_configuration ? fd.row_configuration : {};
  const formatting = {};
  const comparisionOptions = {};
  const basements = {};
  const coloringOptions = {};
  const bcColoringOptions = {};
  const fontOptions = {};
  const textAligns = {};
  let metric;
  let mode;
  const colorings = ['seagreen', 'lightpink', 'lightblue', 'beige',
    'lightgray'
  ];
  const colorStyles = ['background-lightseagreen', 'background-lightpink',
    'background-lightblue', 'background-beige', 'background-lightgray'
  ];
  const fontWeights = ['bold', 'normal'];
  const fontWeightStyles = ['bold', 'normal'];
  // variables for row configuration
  var rowContains = [];
  var rowColor = '';
  var rowFont = '';
  for (metric in columnConfiguration) {
    for (mode in columnConfiguration[metric]) {
      const columnName = mode === 'Normal' ? metric : mode + ' ' +
        metric;
      if (columnConfiguration[metric][mode].comparisionOption) {
        comparisionOptions[columnName] = columnConfiguration[metric]
        [mode].comparisionOption;
      }
      if (columnConfiguration[metric][mode].basement) {
        basements[columnName] = columnConfiguration[metric][mode]
          .basement;
      }
      if (columnConfiguration[metric][mode].coloringOption) {
        coloringOptions[columnName] = columnConfiguration[metric][
          mode
        ].coloringOption;
      }
      if (columnConfiguration[metric][mode].bcColoringOption) {
        bcColoringOptions[columnName] = columnConfiguration[metric]
        [mode].bcColoringOption;
      }
      if (columnConfiguration[metric][mode].formatting) {
        formatting[columnName] = columnConfiguration[metric][mode]
          .formatting;
      }
      if (columnConfiguration[metric][mode].fontOption) {
        fontOptions[columnName] = columnConfiguration[metric][mode]
          .fontOption;
      }
      if (columnConfiguration[metric][mode].textAlign) {
        textAligns[columnName] = columnConfiguration[metric][mode]
          .textAlign;
      }
    }
  }
  if (rowConfiguration.coloringOption) {
    rowColor = colorStyles[colorings.indexOf(
      rowConfiguration.coloringOption)];
  }
  if (rowConfiguration.fontOption) {
    rowFont = fontWeightStyles[fontWeights.indexOf(
      rowConfiguration.fontOption)];
  }
  if (rowConfiguration.basements) {
    rowContains = rowConfiguration.basements;
  }
  // Removing metrics (aggregates) that are strings
  //const tempMetrics = data.columns.map(m => m.toLowerCase()) || [];
  //const metrics = tempMetrics.filter(m => !isNaN(data.records[0][m]));
  const metrics = data.columns.filter(m => !isNaN(data.records[0][m]));
  //const percentageMetrics = tempMetrics.filter(m => /%/.test(m));

  function col(c) {
    const arr = [];
    for (let i = 0; i < data.records.length; i += 1) {
      arr.push(data.records[i][c]);
    }
    return arr;
  }
  const maxes = {};
  for (let i = 0; i < metrics.length; i += 1) {
    maxes[metrics[i]] = d3.max(col(metrics[i]));
  }
  if (fd.table_timestamp_format === 'smart_date') {
    timestampFormatter = formatDate;
  } else if (fd.table_timestamp_format !== undefined) {
    timestampFormatter = timeFormatFactory(fd.table_timestamp_format);
  }

  const div = d3.select(slice.selector);
  div.html('');
  const table = div.append('table')
    .classed(
    'dataframe dataframe table table-striped table-bordered ' +
    'table-condensed table-hover dataTable no-footer', true)
    .attr('width', '100%');

  table.append('thead').append('tr')
    .selectAll('th')
    .data(data.columns)
    .enter()
    .append('th')
    .text(function (d) {
      return d;
    });

  table.append('tbody')
    .selectAll('tr')
    .data(data.records)
    .enter()
    .append('tr')
    .selectAll('td')
    .data(row => data.columns.map((c) => {
      var val = row[c];
      let html = val;
      const isMetric = metrics.indexOf(c.toLowerCase()) >= 0;
      if (c === 'timestamp') {
        html = timestampFormatter(val);
      }
      if (typeof (val) === 'string') {
        html = `<span class="like-pre">${val}</span>`;
      }
      if (formatting[c]) {
        if (val.toString().length > 0) {
          html = d3.format(formatting[c])(val);
        }
      }
      return {
        col: c,
        val,
        html,
        isMetric,
        comparisionOption: comparisionOptions[c],
        basement: basements[c],
        coloringOption: coloringOptions[c],
        bcColoringOption: bcColoringOptions[c],
        fontOption: fontOptions[c],
        textAlign: textAligns[c],
      };
    }))
    .enter()
    .append('td')
    .attr('class', function (d) {
      var base = $.trim(d.basement)
      var coloringOptionClass = ''
      var bcColoringOptionClass = ''
      var fontOptionClass = ''
      if (d.coloringOption !== null) {
        if (d.coloringOption === 'seagreen') {
          coloringOptionClass = 'background-lightseagreen'
        } else if (d.coloringOption === 'lightpink') {
          coloringOptionClass = 'background-lightpink'
        } else if (d.coloringOption === 'lightblue') {
          coloringOptionClass = 'background-lightblue'
        } else if (d.coloringOption === 'beige') {
          coloringOptionClass = 'background-beige'
        } else if (d.coloringOption === 'lightgray') {
          coloringOptionClass = 'background-lightgray'
        }
      }
      if (d.bcColoringOption !== null) {
        if (d.bcColoringOption === 'seagreen') {
          bcColoringOptionClass = 'background-lightseagreen'
        } else if (d.bcColoringOption === 'lightpink') {
          bcColoringOptionClass = 'background-lightpink'
        } else if (d.bcColoringOption === 'lightblue') {
          bcColoringOptionClass = 'background-lightblue'
        } else if (d.bcColoringOption === 'beige') {
          bcColoringOptionClass = 'background-beige'
        } else if (d.bcColoringOption === 'lightgray') {
          bcColoringOptionClass = 'background-lightgray'
        }
      }
    /*
      if (styling !== null) {
        coloringOptionClass = ''
        bcColoringOptionClass = ''
      }
    */
      if (d.fontOption !== null) {
        if (d.fontOption === 'bold') {
          fontOptionClass = 'bold'
        } else if (d.fontOption === 'normal') {
          fontOptionClass = 'normal'
        }
      }
      if (!isNaN(parseFloat(base))) {
        if (d.comparisionOption !== null) {
          if (d.comparisionOption === '<') {
            return d.val < base ? coloringOptionClass + ' ' +
              fontOptionClass : bcColoringOptionClass;
          } else if (d.comparisionOption === '=') {
            return d.val == base ? coloringOptionClass +
              ' ' + fontOptionClass :
              bcColoringOptionClass;
          } else if (d.comparisionOption === '>') {
            return d.val > base ? coloringOptionClass + ' ' +
              fontOptionClass : bcColoringOptionClass;
          }
        }
      }
      if (d.comparisionOption !== null) {
        if (d.comparisionOption === 'contains') {
          return (d.val.toString().indexOf(base) !== -1) ?
            coloringOptionClass + ' ' + fontOptionClass :
            bcColoringOptionClass;
        } else if (d.comparisionOption === 'startsWith') {
          return (d.val.toString().startsWith(base)) ?
            coloringOptionClass + ' ' + fontOptionClass :
            bcColoringOptionClass;
        } else if (d.comparisionOption === 'endsWith') {
          return (d.val.toString().endsWith(base)) ?
            coloringOptionClass + ' ' + fontOptionClass :
            bcColoringOptionClass;
        }
      }
      return null;
    })
    .style('background-image', function (d) {
      //if (styling === null || !d.isMetric) {
      if (styling === null || !$.isNumeric(d.val)) {
        return null;
      }
      //if (d.isMetric) {
      if ($.isNumeric(d.val)) {
        const perc = Math.round((d.val / maxes[d.col]) * 100);
        const colorIndex = metrics.indexOf(d.col);
        const progressBarStyle = `linear-gradient(to right, rgba(` +
        styling[d.col] + `, 0.6), rgba(` +
        styling[d.col] + `, 0.6) ${perc}%,     ` +
        `rgba(0,0,0,0.01) ${perc}%, rgba(0,0,0,0.001) 100%)`;
        // The 0.01 to 0.001 is a workaround for what appears to be a
        // CSS rendering bug on flat, transparent colors
        return (
          progressBarStyle
        );
      }
      return null;
    })
    //.classed('text-right', d=>d.isMetric)
    .classed('text-right', d=>$.isNumeric(d.val) && (d.textAlign=='right' || d.textAlign == undefined))
    .classed('text-left', d=>$.isNumeric(d.val) && d.textAlign=='left')
    .classed('text-center', d=>$.isNumeric(d.val) && d.textAlign=='center')
    .attr('title', (d) => {
      if (!isNaN(d.val)) {
        return fC(d.val);
      }
      return null;
    })
    .attr('data-sort', function (d) {
      return (d.isMetric) ? d.val : null;
    })
    .on('click', function (d) {
      if (!d.isMetric && fd.table_filter) {
        const td = d3.select(this);
        if (td.classed('filtered')) {
          slice.removeFilter(d.col, [d.val]);
          d3.select(this).classed('filtered', false);
        } else {
          d3.select(this).classed('filtered', true);
          slice.addFilter(d.col, [d.val]);
        }
      }
    })
    .style('cursor', function (d) {
      return (!d.isMetric) ? 'pointer' : '';
    })
    .html(d => d.html ? d.html : d.val);
  table.selectAll('tr').each(function () {
    for (var i in rowContains) {
      for (var j in this.cells) {
        if (this.cells[j].innerText == rowContains[i]) {
          $(this).addClass(rowColor);
          $(this).addClass(rowFont);
        }
        continue;
      }
      continue;
    }
  });
  const height = slice.height();
  let paging = false;
  let pageLength;
  if (fd.page_length && fd.page_length > 0) {
    paging = true;
    pageLength = parseInt(fd.page_length, 10);
  }
  const datatable = container.find('.dataTable').DataTable({
    "dom": 'Zlfrtip',
    "colResize": {
      "tableWidthFixed": true,
    },
    "autoWidth": false,
    paging,
    pageLength,
    aaSorting: [],
    searching: fd.include_search,
    bInfo: false,
    scrollY: height + 'px',
    scrollCollapse: true,
    scrollX: true,
    stateSave: true,
    stateDuration: 0,
    slice: slice,
    sliceId: slice.formData.slice_id,
    stateSaveCallback: function(settings, data) {
      localStorage.setItem('datatable_slice_state_' +
                           settings.oInit.sliceId, JSON.stringify(data))
    },
    stateLoadCallback: function(settings) {
      if (('slice_state' in settings.oInit.slice.formData) && 
        (settings.oInit.slice.formData['slice_state']!==undefined)) {
          console.log("state load for datatable_slice_state_" +
                    settings.oInit.sliceId);
          return JSON.parse(settings.oInit.slice.formData.slice_state);
        }
      else {
        return null;
      }
    },
  });
  fixDataTableBodyHeight(container.find('.dataTables_wrapper'), height);
  // Sorting table by main column
  // if (metrics.length > 0) {
  //   const mainMetric = metrics[0];
  //   datatable.column(data.columns.indexOf(mainMetric)).order('desc').draw();
  // }
  container.parents('.widget').find('.tooltip').remove();
}

module.exports = tableVis;
