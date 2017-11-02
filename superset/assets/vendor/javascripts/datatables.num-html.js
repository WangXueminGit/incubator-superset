/**
 * This sorting plug-in allows for HTML tags with numeric data. With the 'html'
 * type it will strip the HTML and then sorts by strings, with this type it 
 * strips the HTML and then sorts by numbers. Note also that this sorting 
 * plug-in has an equivalent type detection plug-in which can make integration
 * easier.
 * 
 * DataTables 1.10+ has HTML numeric data type detection and sorting abilities
 * built-in. As such this plug-in is marked as deprecated, but might be useful
 * when working with old versions of DataTables.
 *
 */
jQuery.fn.dataTableExt.oSort['num-html-asc'] = function(a,b) {
    if (isNaN(a) || isNaN(b)) {
        return ((a > b) ? 1 : ((a < b) ? -1 : 0));
    }
    return a - b;
};

jQuery.fn.dataTableExt.oSort['num-html-desc'] = function(a,b) {
    if (isNaN(a) || isNaN(b)) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
    return b - a;
};