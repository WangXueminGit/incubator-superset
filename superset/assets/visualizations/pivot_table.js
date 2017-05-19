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
  let percentageIndex = [];
  for (let j = 0; j < payload.data.isPercentage.length; j++) {
    if (!!payload.data.isPercentage[j]) {
      percentageIndex.push(j);
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
        if (percentageIndex.length > 0) {
          for (let i = 0; i < percentageIndex.length; i++) {
            $(row).find('td:nth-child(' + (percentageIndex[i] + 1) + ')').addClass(data[percentageIndex[i]] >= 100 ? 'pivot-table-hit' : 'pivot-table-not-hit');
          }
        }
      },
    });
    table.column('-1').order('desc').draw();
    fixDataTableBodyHeight(container.find('.dataTables_wrapper'), height);
  } else {
    // When there is more than 1 group by column we just render the table, without using
    // the DataTable plugin, so we need to handle the scrolling ourselves.
    // In this case the header is not fixed.
    container.css('overflow', 'auto');
    container.css('height', `${height + 10}px`);
    if (percentageIndex.length > 0) {
      container.find('table tbody tr').each(function () {
        $(this).find('td').each(function (index) {
          if (percentageIndex.indexOf(index) >= 0) {
            const val = $(this).data('originalvalue') || $(this).html();
            $(this).data('originalvalue', val);
            $(this).html(d3.format('.2%')(val));
            $(this).addClass(val >= 1.0 ? 'pivot-table-hit' : 'pivot-table-not-hit');
          }
        });
      });
    }
  }
};
