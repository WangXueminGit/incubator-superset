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

var importedRowsGroup = document.createElement('script');
importedRowsGroup.src = "/static/assets/vendor/javascripts/dataTables.rowsGroup.js"
document.head.appendChild(importedRowsGroup);

var importedColResize = document.createElement('script');
importedColResize.src = "/static/assets/vendor/javascripts/dataTables.colResize.js";
document.head.appendChild(importedColResize);

var importedSortNum = document.createElement('script');
importedSortNum.src = "/static/assets/vendor/javascripts/datatables.num-html.js";
document.head.appendChild(importedSortNum);

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
  // Check if column is present in column options
  var colInConfig = function(column, optionsName) {
    var parsedOptions = Object.keys(optionsName).map((v, i) => (v.split(",")))
    var finalOptions = parsedOptions
      .filter(
        (v1, index) =>
          (v1.every((v2, i2) =>
            (v2 === column[i2])
          )
        )
      )
    return finalOptions;
  }
  // The function accepts option configuration name and
  // return corresponding style class name
  // var compareColumns
  var getColumnConfigStyleClass = function (column, optionsName, options,
    styleClassName) {
    let validOptions = colInConfig(column, optionsName)
    if (validOptions.length >= 1) {
      let currentPriority = 0;
      let currentStyle = null;
      validOptions.forEach((optionName, _) => {
        const columnPriority = optionName.length;
        options.forEach((option, i) => {
          if (optionsName[optionName] == option
              && columnPriority > currentPriority) {
            currentStyle = styleClassName[i];
            currentPriority = columnPriority;
          }
        })
      })
      return currentStyle;
    }
    return null;
  }
  var getFormattingForColumn = function(column, formatting) {
    const validFormattingOptions = colInConfig(column, formatting)
    if (validFormattingOptions.length >= 1) {
      const formattingPriority = validFormattingOptions.map((v, _) => (v.length))
      const chosenPriority = Math.max(...formattingPriority)
      const chosenIndex = formattingPriority.indexOf(chosenPriority)
      const chosenOption = validFormattingOptions[chosenIndex]
        .slice(0, chosenPriority)
        .toString()
      return formatting[chosenOption]
    }
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
    fontOptionClass, bcColoringOptionClass, hasRowColor, rowColor) {
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
        if (coloringOptionClass !== '' && hasRowColor) {
          obj.removeClass(rowColor);
        }
        obj.addClass(coloringOptionClass + ' ' +
          fontOptionClass);
      } else {
        if (bcColoringOptionClass !== '' && hasRowColor) {
          obj.removeClass(rowColor);
        }
        obj.addClass(bcColoringOptionClass);
      }
    }
  }
  // The function will add class to the certain td object
  // to reflect the configuration
  var addClassAccordingConfig = function (obj, base, val, compare,
    coloringOptionClass, fontOptionClass, bcColoringOptionClass, hasRowColor, rowColor) {
    if (checkBaseIsFloat(base)) {
      val = parseFloat(val)
    }
    addClass(obj, base, val, compare, coloringOptionClass,
      fontOptionClass, bcColoringOptionClass, hasRowColor, rowColor);
  }
  const groups = fd.groupby.length;
  var arrForMax ={};

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
              $(this).remove();
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
                $(this).remove();
              }
            }
          }
        }
      })
    });
  }
  container.find('table tbody tr').each(function () {
    // If hideColumnAll is true, then hide the column who contains 'all'
    // This section is used to hide 'td' elements
    //$(this).find('td').addClass('text-right').each(function (index){
    $(this).find('td').each(function (index){
      var column = columns[index];
      if (hideColumnAll) {
        if ($.inArray('All', column) !== -1) {
          $(this).remove();
        }
      }
    });
  })
  if (hideColumnAll) {
    var l = columns.length;
    for (var i=0; i<l; i++) {
      if ($.inArray('All', columns[i]) !== -1) {
        columns.splice(i, 1);
        i--;
        l--;
      }
    }
  }
  for (var j in columns) {
    var maxKey = '';
    for (var k in columns[j]) {
      maxKey += columns[j][k];
    }
    arrForMax[maxKey] = [];
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
      var maxKey = '';
      for (var k in columns[index]) {
        maxKey += columns[index][k];
      }
      arrForMax[maxKey].push(parseFloat(this.innerText));
    });
  });

  var lengthOfarr = Object.keys(arrForMax).length;
  for (var q=0; q < lengthOfarr; q+=1) {
    var maxKey = '';
    for (var k in columns[q]) {
      maxKey += columns[q][k];
    }
    var l = arrForMax[maxKey].length;
    arrForMax[maxKey].splice(l-1, 1);
  }


  const maxes = {};
  for (var n = 0; n < Object.keys(arrForMax).length; n += 1) {
    var maxKey = '';
    for (var k in columns[n]) {
      maxKey += columns[n][k];
    }
    maxes[maxKey] = d3.max(arrForMax[maxKey]);
  }
  if (fd.groupby.length === 1) {
    // When there is only 1 group by column,
    // we use the DataTable plugin to make the header fixed.
    // The plugin takes care of the scrolling so we don't need
    // overflow: 'auto' on the table.
    container.css('overflow', 'hidden');
    container.find('table').attr('width', '100%');
    const table = container.find('table').DataTable({
      "aoColumnDefs": [
        { "sType": "num-html", "aTargets": [ 0 ] }
      ],
      "dom": 'Zlfrtip',
      "colResize": {
        "tableWidthFixed": true,
      },
      paging: false,
      aaSorting: [],
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
          const columnFormat =
            getFormattingForColumn(originalColumn, formatting);
          if (columnFormat) {
            const val = $(this).data(
              'originalvalue') || $(
                this).html();
            $(this).data('originalvalue',
              val);
            if (val.length > 0) {
              $(this).html(d3.format(
              columnFormat)
              (val));
            }
          }
          var val = $(this).data(
            'originalvalue') || $(this)
              .html();
          var base = ''
          const columnBase =
            getFormattingForColumn(originalColumn, basements);
          if (columnBase) {
            base = $.trim(columnBase)
          }
          var coloringOptionClass =
            getColumnConfigStyleClass(
              originalColumn, coloringOptions,
              colorings, colorStyles);
          var bcColoringOptionClass =
            getColumnConfigStyleClass(
              originalColumn, bcColoringOptions,
              colorings, colorStyles);
          var fontOptionClass =
            getColumnConfigStyleClass(
              originalColumn, fontOptions,
              fontWeights,
              fontWeightStyles);
          const columnComparisonOption =
            getFormattingForColumn(originalColumn, comparisionOptions);
          addClassAccordingConfig($(this),
            base, val,
            columnComparisonOption,
            coloringOptionClass,
            fontOptionClass,
            bcColoringOptionClass, false, null);
          var maxKey = '';
          for (var k in originalColumn) {
            maxKey += originalColumn[k];
          }
          const perc = Math.round((val / maxes[maxKey]) * 100);
          var cellTotalColumn = column;
          if (Array.isArray(cellTotalColumn)) {
            cellTotalColumn = cellTotalColumn[0];
          }
          const progressBarStyle = `linear-gradient(to right, rgba(` +
          styling[cellTotalColumn] + `, 0.7), rgba(` +
          styling[cellTotalColumn] + `, 0.7) ${perc}%,     ` +
          `rgba(0,0,0,0.01) ${perc}%, rgba(0,0,0,0.001) 100%)`;
          const textAlign = getFormattingForColumn(originalColumn, textAligns)
            ? 'right'
            : getFormattingForColumn(originalColumn, textAligns);
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
    container.find('table tbody tr').each(function () {
      var hasRowColor = false;
      for (var i in rowContains) {
        for (var j in this.cells) {
          if (this.cells[j].innerText == rowContains[i]) {
            // remove the class of rowcolor and rowfont when this cell's
            // rowspan is more than 1
            hasRowColor = true;
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
        const columnFormat =
            getFormattingForColumn(originalColumn, formatting);
        if (columnFormat) {
          const val = $(this).data(
            'originalvalue') || $(this).html();
          $(this).data('originalvalue', val);
          if (val.length > 0) {
            $(this).html(d3.format(columnFormat)(val));
          }
        }
        var val = $(this).data('originalvalue') ||
          $(this).html();
        var base = ''
        var coloringOptionClass = ''
        var fontOptionClass = ''
        const columnBase =
            getFormattingForColumn(originalColumn, basements);
        if (columnBase) {
          base = $.trim(columnBase)
        }
        var coloringOptionClass =
          getColumnConfigStyleClass(originalColumn,
            coloringOptions, colorings,
            colorStyles);
        var bcColoringOptionClass =
          getColumnConfigStyleClass(originalColumn,
            bcColoringOptions, colorings,
            colorStyles);
        var fontOptionClass =
          getColumnConfigStyleClass(originalColumn,
            fontOptions, fontWeights,
            fontWeightStyles);
        const columnComparisonOption =
            getFormattingForColumn(originalColumn, comparisionOptions)
        addClassAccordingConfig($(this), base, val,
          columnComparisonOption,
          coloringOptionClass,
          fontOptionClass,
          bcColoringOptionClass, hasRowColor, rowColor);
        var maxKey = '';
        for (var k in columns[index]) {
          maxKey += columns[index][k];
        }
        const perc = Math.round((val / maxes[maxKey]) * 100);
        var cellTotalColumn = column;
        if (Array.isArray(cellTotalColumn)) {
            cellTotalColumn = cellTotalColumn[0];
        }
        const progressBarStyle = `linear-gradient(to right, rgba(` +
            styling[cellTotalColumn] + `, 0.7), rgba(` +
            styling[cellTotalColumn] + `, 0.7) ${perc}%,     ` +
            `rgba(0,0,0,0.01) ${perc}%, rgba(0,0,0,0.001) 100%)`;
        const textAlign = getFormattingForColumn(originalColumn, textAligns)
            ? 'right'
            : getFormattingForColumn(originalColumn, textAligns);
        $(this).css('background-image',progressBarStyle);
        $(this).addClass('text-' + textAlign);
      });
/*
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
*/
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
    var groupColumns = [];
    for (var i = 0; i < groups; i++) {
      groupColumns.push(i);
    }
    container.find('table').attr('width', '100%');
    const table = container.find('table').DataTable({
      "aoColumnDefs": [
        { "sType": "num-html", "aTargets": groupColumns }
      ],
      "dom": 'Zlfrtip',
      "colResize": {
        "tableWidthFixed": true,
      },
      scrollY: height + 'px',
      scrollCollapse: true,
      scrollX: true,
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
