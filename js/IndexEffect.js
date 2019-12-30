// some const values
const canvasMaxWidth = 1000;
const canvasMaxHeight = 2800;
const fps = 60.0;

// animations
var anim0 = {
    f: 180.0,    //持续帧数
    b: false,   //有效域flag
    t: 0.0      //计时器
}
var anim1 = {
    f: 180.0,    //持续帧数
    b: false,   //有效域flag
    t: 0.0      //计时器
}

function inRange(value, min, max) {
    return value >= min && value < max;
}
function clamp01(value) {
    return value > 1 ? 1 : value < 0 ? 0 : value;
}
function doAnimation(y, min, max, anim, animFunc) {
    if (inRange(y, min, max)) {
        if (!anim.b) {
            anim.b = true;
            anim.t = 0;
        }
        else {
            if (anim.t < 1) {
                anim.t += 1.0 / anim.f;
            }
            else {
                anim.t = 1;
            }
        }
        animFunc(1 - (1 - anim.t) * (1 - anim.t));
    }
    else {
        anim.b = false;
    }
}

/** @type {HTMLCanvasElement} */
var mainCanvas = document.getElementById("mainCanvas");
var c2d = mainCanvas.getContext("2d");

function onResize() {
    mainCanvas.width = Math.min(canvasMaxWidth, window.innerWidth - 20);
    mainCanvas.height = window.innerHeight * 2 + canvasMaxHeight;
    console.log("窗口大小: 宽度=" + window.outerWidth + ", 高度=" + window.outerHeight
        + "\nmainCanvas.width:" + mainCanvas.width);
}
onResize();
mainCanvas.height = canvasMaxHeight;



function Render() {
    var y = window.scrollY;

    // 背景
    var bgGradient = c2d.createLinearGradient(0, y, 0, y + window.innerHeight);
    var yRate = y / mainCanvas.height;
    bgGradient.addColorStop(0, "rgb(" + (16 + 48 * yRate) + "," + (16 + 32 * yRate) + "," + (18 + 120 * yRate) + ")");
    bgGradient.addColorStop(1, "rgb(" + (16 + 60 * yRate) + "," + (8 + 64 * yRate) + "," + (24 + 146 * yRate) + ")");
    c2d.fillStyle = bgGradient;
    c2d.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    // debug
    // c2d.fillStyle = "rgb(0, 0, 255)"
    // c2d.font = "32px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
    // c2d.fillText(y, 0, 32 + y);

    // animations

    //标题
    doAnimation(y, 0, window.innerHeight * 2, anim0, function (t) {
        //背景
        c2d.shadowColor = "rgba(" + (215) + "," + (200) + "," + (215) + "," + (0.24) + ")";
        c2d.shadowBlur = 180 * t;
        var tbgGradient = c2d.createLinearGradient(0, 0, 0, window.innerHeight);
        tbgGradient.addColorStop(0, "rgba(" + (255) + "," + (255) + "," + (215) + "," + t * (400 - y) / 400 + ")");
        tbgGradient.addColorStop(1, "rgba(" + (230) + "," + (215) + "," + (230) + "," + t * (400 - y) / 400 + ")");
        c2d.fillStyle = tbgGradient;
        c2d.beginPath();
        c2d.arc(mainCanvas.width / 2, window.innerHeight / (2 * t) + y * 0.7, 300, 0, 360);
        c2d.fill();

        c2d.shadowColor = "empty";
        var tbgGradient2 = c2d.createLinearGradient(0, 0, 0, window.innerHeight);
        tbgGradient2.addColorStop(0, "rgba(" + (190) + "," + (190) + "," + (170) + "," + t * (400 - y) / 400 + ")");
        tbgGradient2.addColorStop(1, "rgba(" + (190) + "," + (170) + "," + (190) + "," + t * (400 - y) / 400 + ")");
        c2d.fillStyle = tbgGradient2;
        c2d.beginPath();
        c2d.arc(mainCanvas.width / 2 + 60, window.innerHeight / (2 * t) + y * 0.7 - 80, 200, 0, 360);
        c2d.fill();

        //标题
        t = clamp01(t * 2 - 1);
        c2d.shadowColor = "rgba(" + (32) + "," + (8) + "," + (40) + "," + (0.7) + ")";
        c2d.shadowBlur = 20 * t;
        c2d.fillStyle = "rgba(" + (32) + "," + (8) + "," + (40) + "," + t * (400 - y) / 400 + ")"
        c2d.font = (60 + t * 36) + "px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
        c2d.fillText("Minstreams'", mainCanvas.width / 2 - 234 + 80 * (1 - t), window.innerHeight / 2 + 200 * (1 - t) + y * 0.7);
        c2d.font = (120 + t * 40) + "px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
        c2d.fillText("Planet", mainCanvas.width / 2 - 242 + 80 * (1 - t), window.innerHeight / 2 + 120 + 240 * (1 - t) + y * 0.7);
    });

}

setInterval(Render, 1000 / fps);