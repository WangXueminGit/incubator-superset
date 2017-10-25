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

module.exports = function(slice, payload) {
  const container = slice.container;
  const fd = slice.formData;
  const height = container.height();
  // payload data is a string of html with a single table element
  container.html(payload.data.html);
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
  for (const metric in columnConfiguration) {
    for (const mode in columnConfiguration[metric]) {
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
    // Remove "All" row for pivot table
    /*
    if (this.cells[0].innerText == 'All') {
      $(this).hide();
    }
<<<<<<< HEAD
    */
    for (var m = 0; m < this.cells.length - groups; m += 1) {
      arrForMax[columns[m]].push(parseFloat(this.cells[m+groups].innerText));
    }
    $(this).find('td').addClass('text-right');
=======
    // If hideColumnAll is true, then hide the column who contains 'all'
    // This section is used to hide 'td' elements
    $(this).find('td').addClass('text-right').each(function (index){
      var column = columns[index];
      arrForMax[columns[index]].push(parseFloat(this.innerText));
      if (hideColumnAll) {
        if ($.inArray('All', column) !== -1) {
          $(this).hide();
        }
      }
    });
>>>>>>> ba3af5a3... Fix the bug of wrong percentage showed in the
  });
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
      rowCallback: (row, data, index) => {
        $(row).find('td').each(function (index) {
          var column = columns[index];
          var originalColumn = columns[index];
          if (Array.isArray(column)) {
            column = column[0];
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
          $(this).css('background-image',progressBarStyle);
        });
      },
    });
    table.column('-1').order('desc').draw();
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
  } else {
    // When there is more than 1 group by column we just render the table, without using
    // the DataTable plugin, so we need to handle the scrolling ourselves.
    // In this case the header is not fixed.
    //const groups = fd.groupby.length;
    container.css('overflow', 'auto');
    container.css('height', `${height + 10}px`);
    container.find('table tbody tr').each(function () {
      // Remove "All" row for pivot table
      if (this.cells[0].innerText == 'All') {
        $(this).hide();
      }
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
      $(this).find('td').each(function (index) {
        var column = columns[index];
        if (Array.isArray(column)) {
          column = column[0];
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
        var cellTotalColumn = column;
        if (Array.isArray(cellTotalColumn)) {
            cellTotalColumn = cellTotalColumn[0];
        }
        const progressBarStyle = `linear-gradient(to right, rgba(` +
            styling[cellTotalColumn] + `, 0.7), rgba(` +
            styling[cellTotalColumn] + `, 0.7) ${perc}%,     ` +
            `rgba(0,0,0,0.01) ${perc}%, rgba(0,0,0,0.001) 100%)`;
        $(this).css('background-image',progressBarStyle);
      });
    });
  }
};