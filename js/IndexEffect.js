// some const values
const canvasMaxWidth = 1900;
const canvasMaxHeight = 2800;
var fps = 60;
var enableComplexAnimation = true;

// some inline functions
function inRange(value, min, max) {
    return value >= min && value < max;
}
function clamp01(value) {
    return value > 1 ? 1 : value < 0 ? 0 : value;
}

//input Events
function OnCheck0(value) {
    enableComplexAnimation = value;
}
function OnRange0(value) {
    fps = Number(value);
}



// animations
var anim0 = {
    s: 3.0,     //持续秒数
    b: false,   //有效域flag
    t: 0.0      //计时器
}
// 动画是否都在动，用于判断是否需要停止渲染
function IsAnimUpdating() {
    for (i = 0; i < arguments.length; i++) {
        if (arguments[i].b && arguments[i].t < 1) return true;
    }
    return false;
}
// 当前区域是否存在动画，用于判断是否需要停止渲染
function HasAnimation() {
    for (i = 0; i < arguments.length; i++) {
        if (arguments[i].b) return true;
    }
    return false;
}


// 封装一个动画
function doAnimation(y, min, max, anim, animFunc) {
    if (inRange(y, min, max)) {
        if (!anim.b) {
            anim.b = true;
            anim.t = 0;
        }
        else {
            if (anim.t < 1) {
                anim.t += 1.0 / fps / anim.s;
            }
            else {
                anim.t = 1;
            }
        }
        animFunc(1 - (1 - anim.t) * (1 - anim.t), (y - min) / (max - min));
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


var y = -1;  //记录浏览器滚动位置
function Render() {
    if (!enableComplexAnimation && y === window.scrollY && !IsAnimUpdating(anim0)) {
        c2d.fillStyle = "rgb(0, 0, 255)"
        c2d.font = "32px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
        c2d.fillText("Rendering Pause", 0, y + window.innerHeight - 10);
        setTimeout(Render, 1000 / fps);
        return;
    }
    y = window.scrollY;

    // 背景
    c2d.shadowColor = "empty";
    c2d.shadowBlur = 0;
    var bgGradient = c2d.createLinearGradient(0, y, 0, y + window.innerHeight);
    var yRate = y / mainCanvas.height;
    bgGradient.addColorStop(0, "rgba(" + (16 + 48 * yRate) + "," + (16 + 32 * yRate) + "," + (18 + 120 * yRate) + "," + 0.1 + ")");
    bgGradient.addColorStop(1, "rgba(" + (16 + 60 * yRate) + "," + (8 + 64 * yRate) + "," + (24 + 146 * yRate) + "," + 0.7 + ")");
    c2d.fillStyle = bgGradient;
    c2d.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

    //复杂动画
    var rt = 0; //当前秒数
    var sinrt0 = 0;
    var cosrt0 = 1;
    var rt1mask = 0;
    var sinrt1 = 0;
    var cosrt1 = 0;
    if (enableComplexAnimation) {
        rt = Date.now() / 1000;
        var rt0 = rt * Math.PI * 0.4; //PI 代表小行星一秒转180度
        sinrt0 = Math.sin(rt0);
        cosrt0 = Math.cos(rt0);

        var rt1 = rt0 * 3;        //小行星周期2倍
        rt1mask = clamp01(sinrt0 + 0.5);  //用于和rt1结果相乘
        rt1mask *= rt1mask;   //过渡更平缓
        sinrt1 = Math.sin(rt1);
        cosrt1 = Math.cos(rt1);
    }



    //标题
    doAnimation(y, 0, window.innerHeight, anim0, function (t, k) {
        //背景大圆
        var k0 = clamp01(1 - k * 1.6);
        c2d.shadowColor = "rgba(" + (215) + "," + (200) + "," + (215) + "," + (0.24) + ")";
        c2d.shadowBlur = 180 * t;
        var tbgGradient = c2d.createLinearGradient(0, 0, 0, window.innerHeight);
        tbgGradient.addColorStop(0, "rgba(" + (255) + "," + (255) + "," + (215) + "," + t * k0 + ")");
        tbgGradient.addColorStop(1, "rgba(" + (230) + "," + (215) + "," + (230) + "," + t * k0 + ")");
        c2d.fillStyle = tbgGradient;
        c2d.beginPath();
        c2d.arc(mainCanvas.width / 2, window.innerHeight / (2 * (2 * t * (1 - t) + t)) + y * 0.7, 300, 0, 360);
        c2d.fill();

        //小圆
        c2d.shadowColor = "empty";
        var tbgGradient2 = c2d.createLinearGradient(0, 0, 0, window.innerHeight);
        tbgGradient2.addColorStop(0, "rgba(" + (190) + "," + (190) + "," + (170) + "," + t * k0 + ")");
        tbgGradient2.addColorStop(1, "rgba(" + (190) + "," + (170) + "," + (190) + "," + t * k0 + ")");
        c2d.fillStyle = tbgGradient2;
        c2d.beginPath();
        c2d.arc(mainCanvas.width / 2 + 60, window.innerHeight / (2 * (1.2 * t * (1 - t) + t)) + y * 0.7 - 80, 200, 0, 360);
        c2d.fill();

        //标题
        var t1 = clamp01(t * 1.4 - 0.4);
        c2d.shadowColor = "rgba(" + (32) + "," + (8) + "," + (40) + "," + (0.4) + ")";
        c2d.shadowBlur = 20 * t1;
        c2d.fillStyle = "rgba(" + (32) + "," + (8) + "," + (40) + "," + t1 * (1 - k) + ")";
        c2d.font = (120 + t1 * 40) + "px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";
        c2d.fillText("Planet", mainCanvas.width / 2 - 242 + 80 * (1 - t1), window.innerHeight / 2 + 120 + 50 * (1 - t1) + y * 0.7 + t1 * sinrt1 * rt1mask * 10.0);
        var t2 = clamp01(t1 * 1.3 - 0.3);
        c2d.shadowBlur = 20 * t2;
        c2d.fillStyle = "rgba(" + (32) + "," + (8) + "," + (40) + "," + t2 * (1 - k) + ")";
        c2d.font = (120 - t2 * 24) + "px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";
        c2d.fillText("Minstreams'", mainCanvas.width / 2 - 234 - 80 * (1 - t2), window.innerHeight / 2 + 100 * (1 - t2) + y * 0.7 + t2 * cosrt1 * rt1mask * 10.0);

        //小行星
        c2d.shadowColor = "rgba(" + (32) + "," + (8) + "," + (40) + "," + (0.3) + ")";
        c2d.shadowBlur = 30 * clamp01(sinrt0 + 0.4);
        c2d.fillStyle = "rgba(" + (235 - sinrt0 * 0) + "," + (235 - sinrt0 * 10) + "," + (215 + sinrt0 * 10) + "," + (clamp01(sinrt0 * 0.9 + 0.75) * (1 - k)) + ")";
        c2d.beginPath();
        c2d.arc(mainCanvas.width / 2 + 450 * cosrt0, window.innerHeight / (2 * (0.5 * t * (1 - t) + t)) + y * 0.7 + 120 * sinrt0 + cosrt0 * 120, 50 + 30 * sinrt0, 0, 360);
        c2d.fill();
    });

    // doAnimation(y, window.innerHeight + 500, window.innerHeight + 2000)


    // debug
    c2d.fillStyle = "rgb(0, 0, 255)"
    c2d.font = "32px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
    // c2d.fillText(Date.now(), 0, 32 + y);
    setTimeout(Render, 1000 / fps);
}

setTimeout(Render, 1000 / fps);