/* jshintbrowser: true */


var fingerMatch = {
    tiger: 2,
    fly: 1
};
var fingers, score;
var nextSymbol, currentSymbol, running;
var startEvent, endEvent;
var timerStart, timerLength;

timerLength = 15000; // 15s

function g( id ) {
    return document.getElementById( id );
}

g( 'start' ).onclick = start;

function start() {
    g('teach').style.display = 'none';
    g('start').style.display = 'none';
    g('game').style.display = 'block';
    g('timer').style.display = 'block';
    g('timer').innerHTML = '准备好就开始吧！';
    score = 0;
    fingers = 0;
    timerStart = 0;
    nextSymbol = generate();
    next();
    running = true;
}

function stop() {
    running = false;
    var t = g('timer');
    if (score < 5) {
        t.innerHTML = '“战斗力小于5的渣渣！”<br />——你还是别分享给朋友丢脸了！';
    } else if (score < 30) {
        t.innerHTML = '“谢谢你为人类做出的贡献！”<br/>——分享一下吧！';
    } else if (score < 50) {
        t.innerHTML = '“独孤求败，无人能敌！”<br/>——分享一下吧！';
    } else {
        t.innerHTML = '“我不是人类！”<br/>——分享一下吧！';
    }
    g('start').style.display = 'block';
    g('start').innerHTML = '再来一盘';
}

function next() {
    currentSymbol = nextSymbol;
    nextSymbol = generate();
    update();
}

function generate() {
    return Math.random() > 0.5 ? 'tiger' : 'fly';
}

function update() {
    g('current').src = currentSymbol + '.png';
    g('next').src = nextSymbol + '.png';
}

function slash(color) {
    g('slash').style.background = color;
    g('slash').classList.add('play');
    setTimeout(function() {
        g('slash').classList.remove('play');
    }, 100);
}


function clock() {
    var ellapsed = +new Date() - timerStart;
    var left = (timerLength - ellapsed) / 1000;
    if (left <= 0) {
        stop();
    } else {
        g('timer').innerHTML = left.toFixed(2);
        setTimeout(clock);
    }
}

if ('ontouchstart' in document.body) {
    startEvent = 'touchstart';
    endEvent = 'touchend';
} else {
    startEvent = 'mousedown';
    endEvent = 'mouseup';
}

g('game').addEventListener(startEvent, function(e) {
    e.preventDefault();
    if (!running) return;
    fingers++;
    if (!timerStart) {
        timerStart = +new Date();
        clock();
    }
});

g('game').addEventListener(endEvent, function(e) {
    e.preventDefault();
    if (!running || !fingers) return;
    if (fingerMatch[currentSymbol] == fingers) {
        next();
        g('score').innerHTML = '杀死：' + (++score);
        slash('red');
        g('current').style.webkitTransform = (score % 2) ? 'scale(-1, 1)' : '';
    } else {
        g('current').classList.add('shake');
        setTimeout(function() {
            g('current').classList.remove('shake');
        }, 80);
    }
    fingers = 0;
});

g('game').addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
