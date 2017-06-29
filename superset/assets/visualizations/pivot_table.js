import 'datatables.net';
import dt from 'datatables.net-bs';
import $ from 'jquery';
import 'datatables-bootstrap3-plugin/media/css/datatables-bootstrap3.css';
import { fixDataTableBodyHeight } from '../javascripts/modules/utils';
import './pivot_table.css';

dt(window, $);

module.exports = function (slice, payload) {
  const container = slice.container;
  const fd = slice.formData;
  const height = container.height();

  // payload data is a string of html with a single table element
  container.html(payload.data.html);
  const columns = payload.data.columns;

  const columnConfiguration = fd.column_configuration ? fd.column_configuration : {};
  const formatting = {};
  const coloringOptions = {};
  for (const metric in columnConfiguration) {
    for (const mode in columnConfiguration[metric]) {
      const columnName = metric;
      if (columnConfiguration[metric][mode].coloringOption) {
        coloringOptions[columnName] = columnConfiguration[metric][mode].coloringOption;
      }
      if (columnConfiguration[metric][mode].formatting) {
        formatting[columnName] = columnConfiguration[metric][mode].formatting;
      }
    }
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
          const column = columns[index];
          if (column in formatting && formatting[column] !== null) {
            const val = $(this).data('originalvalue') || $(this).html();
            $(this).data('originalvalue', val);
            $(this).html(d3.format(formatting[column])(val));
          }
          if (column in coloringOptions && coloringOptions[column] !== null) {
            if (coloringOptions[column] === 'Green over 100%') {
              $(this).addClass(val >= 1.0 ? 'pivot-table-hit' : 'pivot-table-not-hit');
            }
            else if (coloringOptions[column] === 'Red over 100%') {
              $(this).addClass(val <= 1.0 ? 'pivot-table-hit' : 'pivot-table-not-hit');
            }
          }
        });
      },
    });
    table.column('-1').order('desc').draw();
    fixDataTableBodyHeight(container.find('.dataTables_wrapper'), height);
  }
  else {
    // When there is more than 1 group by column we just render the table, without using
    // the DataTable plugin, so we need to handle the scrolling ourselves.
    // In this case the header is not fixed.
    container.css('overflow', 'auto');
    container.css('height', `${height + 10}px`);
    container.find('table tbody tr').each(function () {
      $(this).find('td').each(function (index) {
        const column = columns[index];
        if (column in formatting && formatting[column] !== null) {
          const val = $(this).data('originalvalue') || $(this).html();
          $(this).data('originalvalue', val);
          $(this).html(d3.format(formatting[column])(val));
        }
        if (column in coloringOptions && coloringOptions[column] !== null) {
          const val = $(this).data('originalvalue') || $(this).html();
          if (coloringOptions[column] === 'Green over 100%') {
            $(this).addClass(val >= 1.0 ? 'pivot-table-hit' : 'pivot-table-not-hit');
          }
          else if (coloringOptions[column] === 'Red over 100%') {
            $(this).addClass(val <= 1.0 ? 'pivot-table-hit' : 'pivot-table-not-hit');
          }
        }
      });
    });
  }
};
