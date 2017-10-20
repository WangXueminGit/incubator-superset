import 'datatables.net';
import dt from 'datatables.net-bs';
import $ from 'jquery';
import 'datatables-bootstrap3-plugin/media/css/datatables-bootstrap3.css';
import {
    fixDataTableBodyHeight
}
from '../javascripts/modules/utils';
import './pivot_table.css';
dt(window, $);

var imported = document.createElement('script');
imported.src = "/static/assets/vendor/javascripts/dataTables.rowsGroup.js"
document.head.appendChild(imported);

module.exports = function(slice, payload) {
  const container = slice.container;
  const fd = slice.formData;
  const height = container.height();
  // payload data is a string of html with a single table element
  container.html(payload.data.html);
  // Example:
  // fd.columns: ["state"]
  // fd.groupby: ["name"]
  // fd.metrics: ["metrics"]
  // payload.data.columns: [["sum__num", "CA"], ["sum_num", "FL"]]
  const metrics = fd.metrics;
  const columns = payload.data.columns;
  const styling = fd.styling ? fd.styling : null;
  const columnConfiguration =
    fd.column_configuration ? fd.column_configuration : {};
  const rowConfiguration = fd.row_configuration ? fd.row_configuration : {};
  const formatting = {};
  const comparisionOptions = {};
  const basements = {};
  const coloringOptions = {};
  const bcColoringOptions = {};
  const fontOptions = {};
  const textAligns = {};
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
  // array of string indicates to hide the row contains these string
  var hide = [];
  // boolean for column configuration to indicates hide all or not
  var hideColumnAll = false;
  var metricUnderColumn = fd.show_metrics_under_columns;
  for (const metric in columnConfiguration) {
    for (const mode in columnConfiguration[metric]) {
      if (mode == 'hide') {
        hideColumnAll = columnConfiguration[metric][mode].hideAll;
      }
      else{
        const columnName = metric;
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
        if (columnConfiguration[metric][mode].comparisionOption) {
            comparisionOptions[columnName] = columnConfiguration[metric]
            [mode].comparisionOption;
        }
        if (columnConfiguration[metric][mode].basement) {
            basements[columnName] = columnConfiguration[metric][mode]
            .basement;
        }
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
  if (rowConfiguration.hide) {
    hide = rowConfiguration.hide;
  }
  // The function accepts option configuration name and
  // return corresponding style class name
  var getColumnConfigStyleClass = function (column, optionsName, options,
    styleClassName) {
    if (column in optionsName && optionsName[column] !== null) {
      for (var i in options) {
        if (optionsName[column] == options[i]) {
          return styleClassName[i]
        }
      }
      return null;
    }
    return null;
  }
  var checkBaseIsFloat = function (base) {
    return !isNaN(parseFloat(base));
  }
  var checkAddclassOrnot = function (base, val, compare) {
    if (compare === '<') {
      return val < base;
    } else if (compare === '=') {
      return val == base;
    } else if (compare == '>') {
      return val > base;
    } else if (compare === 'contains') {
      return val.toString().indexOf(base) !== -1;
    } else if (compare === 'startsWith') {
      return val.toString().startsWith(base);
    } else if (compare === 'endsWith') {
      return val.toString().endsWith(base);
    }
  }
  var addClass = function (obj, base, val, compare, coloringOptionClass,
    fontOptionClass, bcColoringOptionClass) {
    if (coloringOptionClass == null) {
      coloringOptionClass = '';
    }
    if (fontOptionClass == null) {
      fontOptionClass = '';
    }
    if (bcColoringOptionClass == null) {
      bcColoringOptionClass = '';
    }
    if (compare !== null) {
      if (checkAddclassOrnot(base, val, compare)) {
        obj.addClass(coloringOptionClass + ' ' +
          fontOptionClass);
      } else {
        obj.addClass(bcColoringOptionClass);
      }
    }
  }
  // The function will add class to the certain td object
  // to reflect the configuration
  var addClassAccordingConfig = function (obj, base, val, compare,
    coloringOptionClass, fontOptionClass, bcColoringOptionClass) {
    if (checkBaseIsFloat(base)) {
      val = parseFloat(val)
    }
    addClass(obj, base, val, compare, coloringOptionClass,
      fontOptionClass, bcColoringOptionClass);
  }
  const groups = fd.groupby.length;
  var arrForMax ={};
  for (var j in columns) {
    arrForMax[columns[j]] = [];
  }
  container.find('table tbody tr').each(function () {
    if (hide) {
      // Remove row contains "rowContains" for pivot table
      if ($.inArray(this.cells[0].innerText, hide) !== -1) {
        $(this).hide();
      }
    }
    // If hideColumnAll is true, then hide the column who contains 'all'
    // This section is used to hide 'td' elements
    //$(this).find('td').addClass('text-right').each(function (index){
    $(this).find('td').each(function (index){
      var column = columns[index];
      arrForMax[columns[index]].push(parseFloat(this.innerText));
      if (hideColumnAll) {
        if ($.inArray('All', column) !== -1) {
          $(this).hide();
        }
      }
    });
  });
  // If hideColumnAll is true, then hide the column who contains 'all'
  // This section is used to hide 'th' elements
  if (hideColumnAll) {
    container.find('table thead tr').each(function () {
      var firstTh = $(this).find('th')[groups];
      var theColSpan = $(firstTh).prop('colSpan');
      //acc is set for get the column index
      var acc = 0;
      $(this).find('th').each(function (index){
        if (index >= groups) {
          if (metricUnderColumn) {
            var column = columns[acc];
            acc += $(this).prop('colSpan');
            if ($.inArray('All', column) !== -1) {
              $(this).hide();
            }
          }
          else {
            if ($.inArray(firstTh.innerText, metrics) !== -1) {
              if (theColSpan > 1 ) {
                $(this).prop('colSpan', theColSpan - 1);
              }
            }
            else {
              var column = columns[acc];
              acc += $(this).prop('colSpan');
              if ($.inArray('All', column) !== -1) {
                $(this).hide();
              }
            }
          }
        }
      })
    });
  }
  var lengthOfarr = Object.keys(arrForMax).length;
  for (var q=0; q < lengthOfarr; q+=1) {
    var l = arrForMax[columns[q]].length;
    arrForMax[columns[q]].splice(l-1, 1);
  }
  const maxes = {};
  for (var n = 0; n < Object.keys(arrForMax).length; n += 1) {
    maxes[columns[n]] = d3.max(arrForMax[columns[n]]);
  }
  if (fd.groupby.length === 1) {
    // When there is only 1 group by column,
    // we use the DataTable plugin to make the header fixed.
    // The plugin takes care of the scrolling so we don't need
    // overflow: 'auto' on the table.
    container.css('overflow', 'hidden');
    const table = container.find('table').DataTable({
      paging: false,
      searching: false,
      bInfo: false,
      scrollY: `${height}px`,
      scrollCollapse: true,
      scrollX: true,
      colReorder: true,
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
      rowCallback: (row, data, index) => {
        $(row).find('td').each(function (index) {
          var column = columns[index];
          var originalColumn = columns[index];
          // Change for dealing with different situations:
          // metircs on the top or columns on the top
          if (Array.isArray(column)) {
            if (metricUnderColumn) {
              var lengthOfCol = column.length;
              column = column[lengthOfCol - 1];
            }
            else {
              column = column[0];
            }
          }
          if (column in formatting &&
            formatting[column] !== null) {
            const val = $(this).data(
              'originalvalue') || $(
                this).html();
            $(this).data('originalvalue',
              val);
            $(this).html(d3.format(
              formatting[column])
              (val));
          }
          var val = $(this).data(
            'originalvalue') || $(this)
              .html();
          var base = ''
          if (column in basements &&
            basements[column] !== null) {
            base = $.trim(basements[column])
          }
          var coloringOptionClass =
            getColumnConfigStyleClass(
              column, coloringOptions,
              colorings, colorStyles);
          var bcColoringOptionClass =
            getColumnConfigStyleClass(
              column, bcColoringOptions,
              colorings, colorStyles);
          var fontOptionClass =
            getColumnConfigStyleClass(
              column, fontOptions,
              fontWeights,
              fontWeightStyles);
          addClassAccordingConfig($(this),
            base, val,
            comparisionOptions[column],
            coloringOptionClass,
            fontOptionClass,
            bcColoringOptionClass);
          const perc = Math.round((val / maxes[originalColumn]) * 100);
          var cellTotalColumn = column;
          if (Array.isArray(cellTotalColumn)) {
            cellTotalColumn = cellTotalColumn[0];
          }
          const progressBarStyle = `linear-gradient(to right, rgba(` +
          styling[cellTotalColumn] + `, 0.7), rgba(` +
          styling[cellTotalColumn] + `, 0.7) ${perc}%,     ` +
          `rgba(0,0,0,0.01) ${perc}%, rgba(0,0,0,0.001) 100%)`;
          const textAlign = textAligns[column] == undefined ? 'right' : textAligns[column];
          $(this).css('background-image',progressBarStyle);
          $(this).addClass('text-' + textAlign);
        });
      },
    });
    fixDataTableBodyHeight(container.find('.dataTables_wrapper'),
      height);
    table.rows().eq(0).each(function (index) {
      var row = table.row(index);
      var data = row.data();
      var rowNode = row.node();
      for (var k in rowContains) {
        if ($.inArray(rowContains[k], data) !== -1) {
          $(rowNode).addClass(rowFont);
          $(rowNode).addClass(rowColor);
        }
        continue;
      }
    });
    //this section for hiding some column using datatable may be used later
    /*
    table.columns().eq(0).each(function (index) {
      var column = table.column(index);
      var thisColumn = columns[index];
      var data = column.data();
      console.log("column's data is " + data);
      var columnNodes = column.nodes();
      if ($.inArray('All', thisColumn) !== -1) {
        //$(columnNode).hide();
        //fnSetColumnVis( index, false );
        //$(columnNodes).hide();
        table.column(index + groups).visible( false );
        //table.columns.adjust().draw( false );
      }
    });
    */
  } else {
    // When there is more than 1 group by column we just render the table, without using
    // the DataTable plugin, so we need to handle the scrolling ourselves.
    // In this case the header is not fixed.
    container.css('overflow', 'auto');
    container.css('height', `${height + 10}px`);
    container.find('table tbody tr').each(function () {
      for (var i in rowContains) {
        for (var j in this.cells) {
          if (this.cells[j].innerText == rowContains[i]) {
            // remove the class of rowcolor and rowfont when this cell's
            // rowspan is more than 1
            $(this).find('td, th').each(function (index) {
              if (!($(this).attr('rowspan') > 1)) {
                $(this).addClass(rowColor);
                $(this).addClass(rowFont);
              }
            });
          }
          continue;
        }
        continue;
      }
      $(this).find('td').each(function (index) {
        var column = columns[index];
        // Change for dealing with different situations:
        // metircs on the top or columns on the top
        if (Array.isArray(column)) {
          if (metricUnderColumn) {
            var lengthOfCol = column.length;
            column = column[lengthOfCol - 1];
          }
          else {
            column = column[0];
          }
        }
        if (column in formatting && formatting[
          column] !== null) {
          const val = $(this).data(
            'originalvalue') || $(this).html();
          $(this).data('originalvalue', val);
          $(this).html(d3.format(formatting[
            column])(val));
        }
        var val = $(this).data('originalvalue') ||
          $(this).html();
        var base = ''
        var coloringOptionClass = ''
        var fontOptionClass = ''
        if (column in basements && basements[column] !==
          null) {
          base = $.trim(basements[column])
        }
        var coloringOptionClass =
          getColumnConfigStyleClass(column,
            coloringOptions, colorings,
            colorStyles);
        var bcColoringOptionClass =
          getColumnConfigStyleClass(column,
            bcColoringOptions, colorings,
            colorStyles);
        var fontOptionClass =
          getColumnConfigStyleClass(column,
            fontOptions, fontWeights,
            fontWeightStyles);
        addClassAccordingConfig($(this), base, val,
          comparisionOptions[column],
          coloringOptionClass,
          fontOptionClass,
          bcColoringOptionClass);
        const perc = Math.round((val / maxes[columns[index]]) * 100);
        var cellTotalColumn = columns[index];
        if (Array.isArray(cellTotalColumn)) {
            cellTotalColumn = cellTotalColumn[0];
        }
        const progressBarStyle = `linear-gradient(to right, rgba(` +
            styling[cellTotalColumn] + `, 0.7), rgba(` +
            styling[cellTotalColumn] + `, 0.7) ${perc}%,     ` +
            `rgba(0,0,0,0.01) ${perc}%, rgba(0,0,0,0.001) 100%)`;
        const textAlign = textAligns[column] == undefined ? 'right' : textAligns[column];
        $(this).css('background-image',progressBarStyle);
        $(this).addClass('text-' + textAlign);
      });
    });

    // Add for make rowsgroup plugin can be used which means datatable can be used
    // to enable sorting in pivot table with multiple group.
    var rowsGroup = [];
    container.find('table tbody td[rowspan], table tbody th[rowspan]').each(function () {
      var cell = $(this);
      var row = cell.parent();
      var index = cell.get(0).cellIndex;
      if (rowsGroup.indexOf(index) == -1) {
        rowsGroup.push(index);
      }
      var count = parseInt(cell.attr('rowspan')) - 1;
      cell.removeAttr('rowspan');
      var childIndex = index + 1;
      while(count > 0) {
        row = row.next();
        row.find("td:nth-child(" + childIndex + ")," + " th:nth-child(" + childIndex + ")").before(cell.clone());
        count--;
      }
    });
    const table = container.find('table').DataTable({
      paging: false,
      searching: false,
      bInfo: false,
      colReorder: true,
      rowsGroup: rowsGroup,
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
    fixDataTableBodyHeight(container.find('.dataTables_wrapper'),
      height);
  }
};
