/*! RowsGroup for DataTables v2.0.0
 * 2015-2016 Alexey Shildyakov ashl1future@gmail.com
 * 2016 Tibor Wekerle
 */

/**
 * @summary     RowsGroup
 * @description Group rows by specified columns
 * @version     2.0.0
 * @file        dataTables.rowsGroup.js
 * @author      Alexey Shildyakov (ashl1future@gmail.com)
 * @contact     ashl1future@gmail.com
 * @copyright   Alexey Shildyakov
 *
 * License      MIT - http://datatables.net/license/mit
 *
 * This feature plug-in for DataTables automatically merges columns cells
 * based on it's values equality. It supports multi-column row grouping
 * in according to the requested order with dependency from each previous
 * requested columns. Now it supports ordering and searching.
 * Please see the example.html for details.
 *
 * Rows grouping in DataTables can be enabled by using any one of the following
 * options:
 *
 * * Setting the `rowsGroup` parameter in the DataTables initialisation
 *   to array which containes columns selectors
 *   (https://datatables.net/reference/type/column-selector) used for grouping. i.e.
 *    rowsGroup = [1, 'columnName:name', ]
 * * Setting the `rowsGroup` parameter in the DataTables defaults
 *   (thus causing all tables to have this feature) - i.e.
 *   `$.fn.dataTable.defaults.RowsGroup = [0]`.
 * * Creating a new instance: `new $.fn.dataTable.RowsGroup( table, columnsForGrouping );`
 *   where `table` is a DataTable's API instance and `columnsForGrouping` is the array
 *   described above.
 *
 * For more detailed information please see:
 *
 */

(function( factory ) {
    "use strict";

    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( ['jquery'], function ( $ ) {
            return factory( $, window, document );
        } );
    }
    else if ( typeof exports === 'object' ) {
        // CommonJS
        module.exports = function (root, $) {
            if ( ! root ) {
                root = window;
            }

            if ( ! $ ) {
                $ = typeof window !== 'undefined' ?
                    require('jquery') :
                    require('jquery')( root );
            }

            return factory( $, root, root.document );
        };
    }
    else {
        // Browser
        factory( jQuery, window, document );
    }
}
(function($, window, document){

ShowedDataSelectorModifier = {
    order: 'current',
    page: 'current',
    search: 'applied',
}

GroupedColumnsOrderDir = 'asc';


/*
 * columnsForGrouping: array of DTAPI:cell-selector for columns for which rows grouping is applied
 */
var RowsGroup = function ( dt, columnsForGrouping )
{
    this.table = dt.table();
    this.columnsForGrouping = columnsForGrouping;
     // set to True when new reorder is applied by RowsGroup to prevent order() looping
    this.orderOverrideNow = false;
    this.mergeCellsNeeded = false; // merge after init
    this.order = dt.table().order();

    var self = this;
    dt.on('order.dt.rowsGroup', function ( e, settings) {
        if (!self.orderOverrideNow) {
            self.orderOverrideNow = true;
            self._updateOrderAndDraw()
        } else {
            self.orderOverrideNow = false;
        }
    })

    dt.on('preDraw.dt.rowsGroup', function ( e, settings) {
        if (self.mergeCellsNeeded) {
            self.mergeCellsNeeded = false;
            self._mergeCells()
        }
    })

    dt.on('column-visibility.dt.rowsGroup', function ( e, settings) {
        self.mergeCellsNeeded = true;
    })

    dt.on('search.dt.rowsGroup', function ( e, settings) {
        // This might to increase the time to redraw while searching on tables
        //   with huge shown columns
        self.mergeCellsNeeded = true;
    })

    dt.on('page.dt.rowsGroup', function ( e, settings) {
        self.mergeCellsNeeded = true;
    })

    dt.on('length.dt.rowsGroup', function ( e, settings) {
        self.mergeCellsNeeded = true;
    })

    dt.on('xhr.dt.rowsGroup', function ( e, settings) {
        self.mergeCellsNeeded = true;
    })

    dt.on('destroy.dt.rowsGroup', function ( e ) {
        dt.off('.rowsGroup');
    })

    this._updateOrderAndDraw();

/* Events sequence while Add row (also through Editor)
 * addRow() function
 *   draw() function
 *     preDraw() event
 *       mergeCells() - point 1
 *     Appended new row breaks visible elements because the mergeCells() on previous step doesn't apllied to already processing data
 *   order() event
 *     _updateOrderAndDraw()
 *       preDraw() event
 *         mergeCells()
 *       Appended new row now has properly visibility as on current level it has already applied changes from first mergeCells() call (point 1)
 *   draw() event
 */
};


RowsGroup.prototype = {
    setMergeCells: function(){
        this.mergeCellsNeeded = true;
    },

    mergeCells: function()
    {
        this.setMergeCells();
        this.table.draw();
    },

    _getOrderWithGroupColumns: function (order, groupedColumnsOrderDir)
    {
        // The default order
        if (groupedColumnsOrderDir === undefined) {
            groupedColumnsOrderDir = GroupedColumnsOrderDir;
        }
        // if there are some grouped columns have no order,
        // then give them a default value
        // Check the table's order, because for non-grouped column,
        // the order should be set by only one column,
        // if there are more than one nongroup order, remove them
        // if all nongrouped columns don't have order,
        // then give the first an order
        var self = this;
        var groupedColumnsknownOrder = this.order.filter(function(columnOrder){
            return self.columnsForGrouping.indexOf(columnOrder[0]) >= 0;
        });
        var groupedColumnsKnownOrderIndexes = groupedColumnsknownOrder.map(function(columnOrder){
            return columnOrder[0];
        });
        var groupedColumnsUnknownOrderIndexes = this.columnsForGrouping.filter(function(columnOrder){
            return groupedColumnsKnownOrderIndexes.indexOf(columnOrder) < 0;
        })
        for (var h in groupedColumnsUnknownOrderIndexes) {
            this.order.push([groupedColumnsUnknownOrderIndexes[h], groupedColumnsOrderDir]);
        }
        var nonGroupSortExists = false;
        for (var k in this.order) {
            if (this.columnsForGrouping.indexOf(this.order[k][0]) < 0) {
                //for order in non-grouped column
                if (!nonGroupSortExists) {
                    nonGroupSortExists = true;
                }
                else {
                    this.order.splice(k, 1);
                }
            }
        }
        // set the first nongrouped column an default order.
        var firstNonGroupedColumn = 0;
        if (this.columnsForGrouping.length > 0){
            firstNonGroupedColumn = this.columnsForGrouping[this.columnsForGrouping.length - 1] + 1;
        }
        if (!nonGroupSortExists) {
            this.order.push([firstNonGroupedColumn, groupedColumnsOrderDir]);
        }
        // current sorting
        var resultOrder = this.order;
        // new sorting by user
        if (order.length === 1) {
            var orderingColumn = order[0][0];
            var previousOrderIndex = this.order.map(function(val){
                return val[0];
            })
            var iColumn = previousOrderIndex.indexOf(orderingColumn);
            if (iColumn >= 0 ) {
                // The column's order already in table's order, need update
                resultOrder[iColumn][1] = order[0][1];
            }
            else {
                if (this.columnsForGrouping.indexOf(orderingColumn) >= 0) {
                    // The column is a grouped column, add it to table's order
                    resultOrder.push(order[0]);
                }
                else {
                    // The index of non group column which has order
                    // If nongroupIndex = -1,
                    // The previous order doesn't contain any order of nongroup column,
                    // just push it into table's order
                    var nongroupIndex = -1;
                    for (var i in previousOrderIndex) {
                        if (this.columnsForGrouping.indexOf(previousOrderIndex[i]) < 0) {
                            nongroupIndex = previousOrderIndex[i];
                        }
                    }
                    if (nongroupIndex == -1) {
                        resultOrder.push(order[0]);
                    }
                    else {
                        // delete the order one, add the new one
                        for (var i in resultOrder) {
                            if (resultOrder[i][0] == nongroupIndex) {
                                resultOrder[i][0] = order[0][0];
                                resultOrder[i][1] = order[0][1];
                                continue;
                            }
                        }
                    }
                }
            }
        } else {
            // previous sorting
            resultOrder = order;
        }
        return resultOrder;
    },

    // Workaround: the DT reset ordering to 'asc' from multi-ordering if user order on one column (without shift)
    // but because we always has multi-ordering due to grouped rows this happens every time
    _getInjectedMonoSelectWorkaround: function(order)
    {
        if (this.columnsForGrouping.length == 0) {
            return order;
        }
        if (order.length === 1) {
            // got mono order - workaround here
            var orderingColumn = order[0][0]
            var previousOrder = this.order.map(function(val){
                return val[0]
            })
            var iColumn = previousOrder.indexOf(orderingColumn);
            if (iColumn >= 0) {
                // assume change the direction, because we already has that in previos order
                return [[orderingColumn, this._toogleDirection(this.order[iColumn][1])]]
            } // else This is the new ordering column. Proceed as is.
        } // else got milti order - work normal
        return order;
    },

    _mergeCells: function()
    {
        var columnsIndexes = this.table.columns(this.columnsForGrouping, ShowedDataSelectorModifier).indexes().toArray()
        var showedRowsCount = this.table.rows(ShowedDataSelectorModifier)[0].length
        this._mergeColumn(0, showedRowsCount - 1, columnsIndexes)
    },

    // the index is relative to the showed data
    //    (selector-modifier = {order: 'current', page: 'current', search: 'applied'}) index
    _mergeColumn: function(iStartRow, iFinishRow, columnsIndexes)
    {
        var columnsIndexesCopy = columnsIndexes.slice()
        currentColumn = columnsIndexesCopy.shift()
        currentColumn = this.table.column(currentColumn, ShowedDataSelectorModifier)

        var columnNodes = currentColumn.nodes()
        var columnValues = currentColumn.data()

        var newSequenceRow = iStartRow,
            iRow;
        for (iRow = iStartRow + 1; iRow <= iFinishRow; ++iRow) {

            if (columnValues[iRow] === columnValues[newSequenceRow]) {
                $(columnNodes[iRow]).hide()
            } else {
                $(columnNodes[newSequenceRow]).show()
                $(columnNodes[newSequenceRow]).attr('rowspan', (iRow-1) - newSequenceRow + 1)

                if (columnsIndexesCopy.length > 0)
                    this._mergeColumn(newSequenceRow, (iRow-1), columnsIndexesCopy)

                newSequenceRow = iRow;
            }

        }
        $(columnNodes[newSequenceRow]).show()
        $(columnNodes[newSequenceRow]).attr('rowspan', (iRow-1)- newSequenceRow + 1)
        if (columnsIndexesCopy.length > 0)
            this._mergeColumn(newSequenceRow, (iRow-1), columnsIndexesCopy)
    },

    _toogleDirection: function(dir)
    {
        return dir == 'asc'? 'desc': 'asc';
    },

    _updateOrderAndDraw: function()
    {
        this.mergeCellsNeeded = true;

        var currentOrder = this.table.order();
        currentOrder = this._getInjectedMonoSelectWorkaround(currentOrder);
        this.order = this._getOrderWithGroupColumns(currentOrder)
        this.table.order($.extend(true, Array(), this.order))
        this.table.draw()
    },
};


$.fn.dataTable.RowsGroup = RowsGroup;
$.fn.DataTable.RowsGroup = RowsGroup;

// Automatic initialisation listener
$(document).on( 'init.dt.rowsGroup', function ( e, settings ) {
    if ( e.namespace !== 'dt' ) {
        return;
    }

    var api = new $.fn.dataTable.Api( settings );

    if ( settings.oInit.rowsGroup ||
         $.fn.dataTable.defaults.rowsGroup )
    {
        options = settings.oInit.rowsGroup?
            settings.oInit.rowsGroup:
            $.fn.dataTable.defaults.rowsGroup;
        var rowsGroup = new RowsGroup( api, options );
        $.fn.dataTable.Api.register( 'rowsgroup.update()', function () {
            rowsGroup.mergeCells();
            return this;
        } );
        $.fn.dataTable.Api.register( 'rowsgroup.updateNextDraw()', function () {
            rowsGroup.setMergeCells();
            return this;
        } );
    }
} );
}));
