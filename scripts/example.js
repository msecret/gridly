
/**	----------------------------------------
*	GRIDLY example
*	Author: Marco Segreto
*	Github: msecret
----------------------------------------  */

$(document).ready(function() {

    var numRows = 40,
        numCols = 72,
        $text = $('.text'),
        options,

    // dependencies
        $stage = GRIDLY.$stage,
        grid = GRIDLY.grid,
        utils = GRIDLY.utils;

    options = {
        rows: numRows,
        cols: numCols,
        textDiv: $text
    };
    grid.initDisplay(options, function() {

        $stage.animate({
            opacity: 1.0
        }, 1000);

    });

});