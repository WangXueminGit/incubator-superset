import d3 from 'd3';
import '../vendor/parallel_coordinates/d3.parcoords.css';
import './parallel_coordinates.css';

d3.parcoords = require('../vendor/parallel_coordinates/d3.parcoords.js');
d3.divgrid = require('../vendor/parallel_coordinates/divgrid.js');

const $ = require('jquery');

function parallelCoordVis(slice, payload) {
  $('#code').attr('rows', '15');
  const fd = slice.formData;

  const verbose_map = slice.datasource.verbose_map;

  let cols = [];
  if (fd.include_series) {
    cols = [(verbose_map[fd.series] || fd.series)];
  }

  fd.metrics.forEach(function(element) {
    cols.push(verbose_map[element] || element);
  });

  let data = [];

  payload.data.forEach(function(element) {
    let temp_obj = {};
    for (let key in element) {
      temp_obj[(verbose_map[key] || verbose_map[key] || key)] = element[key];
    }
    data.push(temp_obj);
  });

  const ttypes = {};
  cols.forEach(function (v) {
    ttypes[v] = 'number';
  });
  ttypes[(verbose_map[fd.series] || fd.series)] = 'string';

  let ext = d3.extent(data, function (d) {
    return d[(verbose_map[fd.secondary_metric] || fd.secondary_metric)];
  });
  ext = [ext[0], (ext[1] - ext[0]) / 2, ext[1]];
  const cScale = d3.scale.linear()
    .domain(ext)
    .range(['red', 'grey', 'blue'])
    .interpolate(d3.interpolateLab);

  const color = function (d) {
    return cScale(d[(verbose_map[fd.secondary_metric] || fd.secondary_metric)]);
  };
  const container = d3.select(slice.selector);
  container.selectAll('*').remove();
  const effHeight = fd.show_datatable ? (slice.height() / 2) : slice.height();

  container.append('div')
      .attr('id', 'parcoords_' + slice.container_id)
      .style('height', effHeight + 'px')
      .classed('parcoords', true);

  const parcoords = d3.parcoords()('#parcoords_' + slice.container_id)
      .width(slice.width())
      .color(color)
      .alpha(0.5)
      .composite('darken')
      .height(effHeight)
      .data(data)
      .dimensions(cols)
      .types(ttypes)
      .render()
      .createAxes()
      .shadows()
      .reorderable()
      .brushMode('1D-axes');

  if (fd.show_datatable) {
      // create data table, row hover highlighting
    const grid = d3.divgrid();
    container.append('div')
        .style('height', effHeight + 'px')
        .datum(data)
        .call(grid)
        .classed('parcoords grid', true)
        .selectAll('.row')
        .on({
          mouseover(d) {
            parcoords.highlight([d]);
          },
          mouseout: parcoords.unhighlight,
        });
      // update data table on brush event
    parcoords.on('brush', function (d) {
      d3.select('.grid')
        .datum(d)
        .call(grid)
        .selectAll('.row')
        .on({
          mouseover(dd) {
            parcoords.highlight([dd]);
          },
          mouseout: parcoords.unhighlight,
        });
    });
  }
}

module.exports = parallelCoordVis;
