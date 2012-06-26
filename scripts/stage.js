/**
 * Created by JetBrains PhpStorm.
 * User: Marco
 * Date: 6/24/12
 * Time: 10:37 PM
 * To change this template use File | Settings | File Templates.
 */


function initDisplay(r, c) {
    var i,
        ilen,
        j,
        jlen,
        $divs = [];

    for (i = 0, ilen = r; i < ilen; i++) {
        for (j = 0, jlen = c; j < jlen; j++) {
            if (j % 120 === 0) {
                $divs.push('<br >');
            }
            $divs.push('<div class="smallcell row'+i+' col'+j+'"><div class="innercell"></div></div>');
        }
    }
    self.postMessage($divs);
}

self.onmessage = function(e) {
    initDisplay(e.data.rows, e.data.cols);
};