/**	----------------------------------------
*	GRIDLY
*	Author: Marco Segreto
*	Github: msecret
----------------------------------------  */

var GRIDLY = GRIDLY || {};

GRIDLY.$stage = $('.stage');
GRIDLY.$boxes = [];
GRIDLY.$cells = [];

GRIDLY.utils = (function() {
    function extend(C, P) {
        var F = function() {};
        F.prototype = P.prototype;
        C.prototype = new F();
        C.uber = P.prototype;
        C.prototype.constructor = C;
    }
    function inherit(C, P) {
        C.prototype = new P();
    }
    return {
        inherit: inherit,
        extend: extend
    }
})();

GRIDLY.grid = (function($) {

    // dependencies
    var $stage = GRIDLY.$stage,
        utils = GRIDLY.utils,

    // private vars
        id = 0,
        offset = 0;

    // Cell
    function Cell(pos) {
        this.id = id;
        this.gridPos = pos;

        id++;
    }
    Cell.prototype.getRealPos = function() {
        var updatedPos = {},
            marginX = Math.ceil($stage.width() * 0.002),
            marginY = Math.ceil($stage.height() * 0.0025),
            $inner = this.$element.find('.innercell');

        updatedPos.x = $inner.position().left;
        updatedPos.y = $inner.position().top;
        updatedPos.w = $inner.width();
        updatedPos.h = $inner.height();

        return updatedPos;   
    };
    Cell.prototype.appended = function() {
        var elem = this.$element,
            classList =$(elem).attr('class').split(/\s+/),
            classString = '',
            i = 0,
            ilen = classList.length;

        for ( ; i < ilen; i++) {
            classString += '.' + classList[i] + '';
        }
        if($('.stage '+classString).length < 1) {
            return false;
        }
        return true;
    };
    Cell.prototype.render = function() {
        if (!(this.appended())) {
            $stage.append(this.$element);
        }

    };

    function SmallCell(pos, elem) {
        this.id = id;
        this.gridPos = pos;
        this.$element = elem || $('' +
            '<div class="cell smallcell row'+pos[0]+ ' col'+pos[1]+' id'+this.id+'">' +
                '<div class="innercell"></div>' +
            '</div>');
        id++;
    }
    utils.extend(SmallCell, Cell);

    function BigCell(pos) {
        this.id = id;
        this.gridPos = pos;
        this.$element = $('<div class="cell bigcell id'+this.id+'"></div>');
        this.startCell = getCell([pos.r, pos.c]);
        this.endCell = getCell([parseInt(pos.r+pos.h, 10), parseInt(pos.c+pos.w, 10)]);
        id++;
    }
    utils.extend(BigCell, Cell);
    BigCell.prototype.getRealPos = function() {
        var updatedPos = {},
            updatedStart = this.startCell.getRealPos(),
            updatedEnd = this.endCell.getRealPos();

        updatedPos.x = updatedStart.x;
        updatedPos.y = updatedStart.y;
        updatedPos.w = updatedEnd.x + updatedEnd.w - updatedStart.x;
        updatedPos.h = updatedEnd.y + updatedEnd.h - updatedStart.y;

        return updatedPos;
    };
    BigCell.prototype.render = function() {
        var updatedPos = this.getRealPos();
        if (!(this.appended())) {
            $stage.append(this.$element);
        }
        this.$element
            .css('left', updatedPos.x + offset)
            .css('top', updatedPos.y + offset)
            .css('width', updatedPos.w)
            .css('height', updatedPos.h);

    };

    function initDisplay(r, c, callback) {

        var stageWorker = new Worker('js/stage.js');
        $stage.append($('<div class="message">loading...</div>'));

        stageWorker.onmessage = function(e) {
            addCells(e.data);
            $('.message').remove();
            callback();
        };
        stageWorker.onerror = function(e) {
            $('.message').remove();
            $stage.append($('<div class="message">error: line ' + e.lineno + ' in ' + e.filename + ': ' + e.message +'</div>'));
        };

        // TODO add here so you pass in string of div
        stageWorker.postMessage({'cmd': 'initDisplay',
            'rows': r,
            'cols': c
        });

    }

    function addCells(data) {
        var i = 0,
            ilen = data.length,
            rowRegEx = new RegExp(/row(\d+)/),
            colRegEx = new RegExp(/col(\d+)/);

        for( ; i < ilen; i++) {
            if (data[i].search(rowRegEx) > 0) {
               var s = new SmallCell([parseInt(data[i].match(rowRegEx)[1], 10), parseInt(data[i].match(colRegEx)[1], 10)], $(data[i]));
               GRIDLY.$cells.push(s);
               $stage.append(s.$element);
            }
            else { $stage.append($(data[i])) }
        }

    }

    function getCell(pos) {
        var i = 0,
            ilen = GRIDLY.$cells.length,
            $cells = GRIDLY.$cells;

        // TODO change to binary search
        for ( ; i < ilen; i++) {
            if ($cells[i].gridPos[0] === pos[0] && $cells[i].gridPos[1] === pos[1]) {
                return $cells[i];
            }
        }
        return -1;
    }

    function write(word, padding) {
        var i = 0,
            ilen = word.length;

        for ( ; i < ilen; i++) {
            letter(word[i], padding);
            padding.y += 4;
        }

    }
    function letter(letter, offset) {
        var alpha = {
            'o': [
                {x: 0, y: 0},
                {x: 0, y: 1},
                {x: 0, y: 2},
                {x: 1, y: 0},
                {x: 1, y: 2},
                {x: 2, y: 0},
                {x: 2, y: 1},
                {x: 2, y: 2}
            ],
            'r': [
                {x: 0, y: 0},
                {x: 0, y: 1},
                {x: 0, y: 2},
                {x: 1, y: 0},
                {x: 2, y: 0}
            ],
            't': [
                {x: 0, y: 0},
                {x: 0, y: 1},
                {x: 0, y: 2},
                {x: 1, y: 1},
                {x: 2, y: 1}
            ],
            'u': [
                {x: 0, y: 0},
                {x: 0, y: 2},
                {x: 1, y: 0},
                {x: 1, y: 2},
                {x: 2, y: 0},
                {x: 2, y: 1},
                {x: 2, y: 2}
            ]
        }
        var i = 0,
            ilen = alpha[letter].length,
            current = alpha[letter];

        for ( ; i < ilen; i++) {
            $('.stage .row'+parseInt(current[i].x + offset.x )+'.col'+parseInt(current[i].y + offset.y - 2)).css('background-color', 'red');
        }
    }

    return {
        Cell: Cell,
        BigCell: BigCell,
        SmallCell: SmallCell,
        getCell: getCell,
        initDisplay: initDisplay
    }

})(jQuery);


