
/**	----------------------------------------
*	GRIDLY example
*	Author: Marco Segreto
*	Github: msecret
----------------------------------------  */

$(document).ready(function() {

    var numRows = 40,
        numCols = 70,
        $text = $('.text');

        // dependencies
		gridly = GRIDLY,
        $stage = gridly.$stage,
        grid = gridly.grid,
        utils = gridly.utils;

    grid.initDisplay(numRows, numCols, function() {
        var i,
            ilen,
            j,
            boxdata;
        $('.stage').fadeIn('slow');

        boxdata = [[5, 8], [5, 24], [5, 40], [16, 10], [16, 30], [16, 50], [27, 10], [27, 30], [27, 50]];

        for ( i = 0, ilen = boxdata.length; i < ilen; i++) {
            var s = new grid.BigCell({
                r: boxdata[i][0],
                c: boxdata[i][1],
                w: 12,
                h: 8
            });
            GRIDLY.$boxes.push(s);
            s.render();
        }

        // TODO use map function here
        $('.text .contentbox').each(function(i) {
            GRIDLY.$boxes[i].$element.html($(this).html());
        });

        GRIDLY.$boxes[0].$element.html($text.find('.explore').html());

        $(window).resize(function() {
            for (i = 0, ilen = GRIDLY.$boxes.length; i < ilen; i++) {
                GRIDLY.$boxes[i].render();
            }
        });

    });

});
