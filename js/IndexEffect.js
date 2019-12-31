// some values
const canvasMaxWidth = 1900;
var enableComplexAnimation = true;

// some inline functions
function inRange(value, min, max) {
    return value >= min && value < max;
}
function clamp01(value) {
    return value > 1 ? 1 : value < 0 ? 0 : value;
}
function RandomRange(min, max) {
    return min + (max - min) * Math.random();
}

// Some References
/** @type {HTMLCanvasElement} */
var mainCanvas = document.getElementById("mainCanvas");
var c2d = mainCanvas.getContext("2d");
var fpsMark = document.getElementById("fpsMark");

// input Events
function OnCheck0(value) {
    enableComplexAnimation = value;
}





// animations
var anim0 = {
    s: 3.0,     // 持续秒数
    b: false,   // 有效域flag
    t: 0.0      // 计时器
}
var anim1 = {
    s: 5.0,     // 持续秒数
    b: false,   // 有效域flag
    t: 0.0      // 计时器
}
var anim2 = {
    s: 1.0,     // 持续秒数
    b: false,   // 有效域flag
    t: 0.0      // 计时器
}
var anim3 = {
    s: 1.0,     // 持续秒数
    b: false,   // 有效域flag
    t: 0.0      // 计时器
}
var anim4 = {
    s: 1.0,     // 持续秒数
    b: false,   // 有效域flag
    t: 0.0      // 计时器
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

var y = -1;     // 记录浏览器滚动位置
var lastT = 0;      // 计时器
var deltaT = 0.05;     // 计时器
// 封装一个动画
function doAnimation(min, max, anim, animFunc) {
    if (inRange(y, min - window.innerHeight, max)) {
        if (!anim.b) {
            anim.b = true;
            anim.t = 0;
        }
        else {
            if (anim.t < 1) {
                anim.t += deltaT / anim.s;
            }
            else {
                anim.t = 1;
            }
        }
        animFunc(1 - (1 - anim.t) * (1 - anim.t), 2 * (y - min + window.innerHeight) / (max - min + window.innerHeight) - 1);
    }
    else {
        anim.b = false;
    }
}


// 屏幕尺寸相关
var mw = 0; // 记录canvas中间坐标
var cloudTopY = 1;
var horizonTopY = 2;
var horizonMaxHeight = 1000;   // 地面景物的高度
var surfaceY = 3;
var bottomHeight = 2000;    // 底部页面高度
function onResize() {
    mainCanvas.width = Math.min(canvasMaxWidth, window.innerWidth - 20);
    mw = mainCanvas.width / 2;
    cloudTopY = window.innerHeight;    // 增加标题所占高度
    horizonTopY = cloudTopY + window.innerHeight; // 增加云所占高度
    surfaceY = horizonTopY + horizonMaxHeight; // 增加地面所占高度
    mainCanvas.height = surfaceY + bottomHeight;
    console.log("窗口大小: 宽度=" + window.innerWidth + ", 高度=" + window.innerHeight
        + "\nmainCanvas.width:" + mainCanvas.width);
}
onResize();

var horizonY;
// 封装一些渲染方法
function DrawBuilding(hy, xOffset, width, height, yOffset) {
    yOffset = yOffset || 0;
    var x0 = mw + xOffset;
    var y0 = hy - height + yOffset;
    c2d.fillRect(x0, y0, width, height);

    if (y0 < horizonY) return;
    var thickness = width * height / 30000;
    thickness = 1 - (1 - thickness) * (1 - thickness) * (1 - thickness);
    thickness *= 0.26;
    thickness *= 300 / (Math.abs(xOffset) + 300);
    c2d.beginPath();
    c2d.moveTo(x0, y0);
    c2d.lineTo(x0 + width, y0);
    var y1 = y0 - (y0 - horizonY) * thickness;
    c2d.lineTo(x0 + width + (mw - x0 - width) * thickness, y1);
    c2d.lineTo(x0 + (mw - x0) * thickness, y1);
    c2d.closePath();
    c2d.fill();

    c2d.beginPath();
    c2d.moveTo(x0, y0);
    c2d.lineTo(x0 + (mw - x0) * thickness, y1);
    c2d.lineTo(x0 + (mw - x0) * thickness, hy + yOffset);
    c2d.lineTo(x0, hy + yOffset);
    c2d.closePath();
    c2d.fill();
}

// 渲染主体
function Render(currentT) {
    deltaT = (currentT - lastT) / 1000;
    lastT = currentT;
    if (!enableComplexAnimation && y === window.scrollY && !IsAnimUpdating(anim0, anim1)) {
        c2d.fillStyle = "rgb(0, 0, 255)"
        c2d.font = "32px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
        c2d.fillText("Rendering Pause", 0, y + window.innerHeight - 10);
        requestAnimationFrame(Render);
        return;
    }
    y = window.scrollY;

    // 复杂动画
    var rt = 0; // 当前秒数
    var sinrt0 = 0;
    var cosrt0 = 1;
    var rt1mask = 0;
    var sinrt1 = 0;
    var cosrt1 = 0;
    if (enableComplexAnimation) {
        rt = Date.now() / 1000;
        var rt0 = rt * Math.PI * 0.4; // PI 代表小行星一秒转180度
        sinrt0 = Math.sin(rt0);
        cosrt0 = Math.cos(rt0);

        var rt1 = rt0 * 3;        // 小行星周期2倍
        rt1mask = clamp01(sinrt0 + 0.5);  // 用于和rt1结果相乘
        rt1mask *= rt1mask;   // 过渡更平缓
        sinrt1 = Math.sin(rt1);
        cosrt1 = Math.cos(rt1);
    }

    doAnimation(cloudTopY, horizonTopY - window.innerHeight, anim0, function (t, k) {
        // 背景
        var bgGradient = c2d.createLinearGradient(0, y, 0, y + window.innerHeight);
        var yRate = (k * 0.5 + 0.5) * 0.5;
        bgGradient.addColorStop(0, "rgba(" + (16 + 2 * 48 * yRate) + "," + (16 + 2 * 32 * yRate) + "," + (18 + 2 * 120 * yRate) + "," + 0.1 + ")");
        bgGradient.addColorStop(1, "rgba(" + (16 + 2 * 60 * yRate) + "," + (8 + 2 * 64 * yRate) + "," + (24 + 2 * 146 * yRate) + "," + 0.7 + ")");
        c2d.fillStyle = bgGradient;
        c2d.fillRect(0, 0, mainCanvas.width, surfaceY);
    });


    // 标题
    doAnimation(0, cloudTopY, anim1, function (t, k) {
        // 背景大圆
        var k0 = clamp01(1 - k * 1.6);
        c2d.shadowColor = "rgba(" + (215) + "," + (200) + "," + (215) + "," + (0.24) + ")";
        c2d.shadowBlur = 180 * t;
        var tbgGradient = c2d.createLinearGradient(0, 0, 0, window.innerHeight);
        tbgGradient.addColorStop(0, "rgba(" + (255) + "," + (255) + "," + (215) + "," + t * k0 + ")");
        tbgGradient.addColorStop(1, "rgba(" + (230) + "," + (215) + "," + (230) + "," + t * k0 + ")");
        c2d.fillStyle = tbgGradient;
        c2d.beginPath();
        c2d.arc(mw, window.innerHeight / (2 * (2 * t * (1 - t) + t)) + y * 0.7, 300, 0, 360);
        c2d.fill();

        // 小圆
        c2d.shadowColor = "empty";
        var tbgGradient2 = c2d.createLinearGradient(0, 0, 0, window.innerHeight);
        tbgGradient2.addColorStop(0, "rgba(" + (190) + "," + (190) + "," + (170) + "," + t * k0 + ")");
        tbgGradient2.addColorStop(1, "rgba(" + (190) + "," + (170) + "," + (190) + "," + t * k0 + ")");
        c2d.fillStyle = tbgGradient2;
        c2d.beginPath();
        c2d.arc(mw + 60, window.innerHeight / (2 * (1.2 * t * (1 - t) + t)) + y * 0.7 - 80, 200, 0, 360);
        c2d.fill();

        // 标题
        var t1 = clamp01(t * 1.4 - 0.4);
        c2d.shadowColor = "rgba(" + (32) + "," + (8) + "," + (40) + "," + (0.4) + ")";
        c2d.shadowBlur = 20 * t1;
        c2d.fillStyle = "rgba(" + (32) + "," + (8) + "," + (40) + "," + t1 * (1 - k) + ")";
        c2d.font = (120 + t1 * 40) + "px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";
        c2d.fillText("Planet", mw - 242 + 80 * (1 - t1), window.innerHeight / 2 + 120 + 50 * (1 - t1) + y * 0.7 + t1 * sinrt1 * rt1mask * 10.0);
        var t2 = clamp01(t1 * 1.3 - 0.3);
        c2d.shadowBlur = 20 * t2;
        c2d.fillStyle = "rgba(" + (32) + "," + (8) + "," + (40) + "," + t2 * (1 - k) + ")";
        c2d.font = (120 - t2 * 24) + "px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";
        c2d.fillText("Minstreams'", mw - 234 - 80 * (1 - t2), window.innerHeight / 2 + 100 * (1 - t2) + y * 0.7 + t2 * cosrt1 * rt1mask * 10.0);

        // 小行星
        c2d.shadowColor = "rgba(" + (32) + "," + (8) + "," + (40) + "," + (0.3) + ")";
        c2d.shadowBlur = 30 * clamp01(sinrt0 + 0.4);
        c2d.fillStyle = "rgba(" + (235 - sinrt0 * 0) + "," + (235 - sinrt0 * 10) + "," + (215 + sinrt0 * 10) + "," + (clamp01(sinrt0 * 0.9 + 0.75) * (1 - k)) + ")";
        c2d.beginPath();
        c2d.arc(mw + 450 * cosrt0, window.innerHeight / (2 * (0.5 * t * (1 - t) + t)) + y * 0.7 + 120 * sinrt0 + cosrt0 * 120, 50 + 30 * sinrt0, 0, 360);
        c2d.fill();

        c2d.shadowColor = "empty";
        c2d.shadowBlur = 0;
    });

    // 云层/天空
    doAnimation(cloudTopY, horizonTopY, anim2, function (t, k) {

    });


    // 景物
    doAnimation(horizonTopY, surfaceY, anim3, function (t, k) {
        // 重新计算层次景深高度
        var buildingHeight = 100;// 最远的最高的建筑高度
        horizonY = horizonTopY + buildingHeight + (1 + k) * (horizonMaxHeight - buildingHeight) * 0.55;
        var horizonHeight = surfaceY - horizonY;

        var kk = (1 - k) * 0.5;

        // 背景
        var bgGradient = c2d.createLinearGradient(0, y, 0, y + window.innerHeight);
        var yRate = clamp01(k * 0.5 + 1);
        bgGradient.addColorStop(0, "rgba(" + (16 + 2 * 48 * yRate) + "," + (16 + 2 * 32 * yRate) + "," + (18 + 2 * 120 * yRate) + "," + 0.1 + ")");
        bgGradient.addColorStop(1, "rgba(" + (16 + 2 * 60 * yRate) + "," + (8 + 2 * 64 * yRate) + "," + (24 + 2 * 146 * yRate) + "," + 0.7 + ")");
        c2d.fillStyle = bgGradient;
        c2d.fillRect(0, 0, mainCanvas.width, horizonY);

        // 地面
        var groundGradient = c2d.createLinearGradient(0, horizonY, 0, horizonY + horizonHeight);
        groundGradient.addColorStop(0, "rgba(" + (14) + "," + (16) + "," + (23) + "," + (0.7) + ")");
        groundGradient.addColorStop(1, "rgba(" + (16) + "," + (18) + "," + (22) + "," + (0.4) + ")");
        c2d.fillStyle = groundGradient;
        c2d.fillRect(0, horizonY, mainCanvas.width, horizonHeight);


        //远处建筑
        c2d.fillStyle = "rgba(" + (46) + "," + (64) + "," + (72) + "," + (1) + ")";
        for (var i = 0; i < 8; i++) {
            DrawBuilding(horizonY, RandomRange(-mw, mw), RandomRange(5, 13), RandomRange(30, 100), RandomRange(0, 8));
        }
        //近处建筑
        var hy = horizonY + horizonHeight * 0.2;
        c2d.fillStyle = "rgba(" + (20) + "," + (30) + "," + (40) + "," + (0.8) + ")";
        for (var i = 0; i < 20; i++) {
            DrawBuilding(hy, RandomRange(-mw, mw), RandomRange(16, 30), RandomRange(50, 150), RandomRange(-20 * kk, 40 * kk));
        }

        var hy = horizonY + horizonHeight * 0.5;
        c2d.fillStyle = "rgba(" + (20) + "," + (30) + "," + (40) + "," + (0.9) + ")";
        for (var i = 0; i < 20; i++) {
            DrawBuilding(hy, RandomRange(-mw, mw), RandomRange(30, 60), RandomRange(80, 200), RandomRange(-50 * kk, 50 * kk));
        }

        var hy = horizonY + horizonHeight * 1;
        c2d.fillStyle = "rgba(" + (16) + "," + (26) + "," + (32) + "," + (1) + ")";
        for (var i = 0; i < 10; i++) {
            DrawBuilding(hy, RandomRange(-mw, mw), RandomRange(60, 120), RandomRange(120, 240), RandomRange(-50 * kk, 0));
        }

        c2d.shadowColor = "empty";
        c2d.shadowBlur = 0;
    });

    // 地底
    doAnimation(surfaceY, mainCanvas.height - window.innerHeight, anim4, function (t, k) {
        c2d.fillStyle = "rgba(" + (14) + "," + (16) + "," + (23) + "," + (1) + ")";
        c2d.fillRect(0, surfaceY, mainCanvas.width, mainCanvas.height - surfaceY);


        c2d.fillStyle = "rgba(" + (236) + "," + (236) + "," + (255) + "," + t * (1 - k) + ")";
        c2d.font = (120 - t * 24) + "px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";
        c2d.fillText("Undergorund'", 40 - 80 * (1 - t), surfaceY + 128 + 100 * (1 - t) );
        c2d.fillText("---------------------------------------------------------", 40 - 150 * (1 - t), surfaceY + 200 + 300 * (1 - t) );

    });

    // debug
    c2d.fillStyle = "rgb(0, 0, 255)"
    c2d.font = "32px Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
    c2d.fillText(y - window.innerHeight, 0, y + window.innerHeight - 10);
    fpsMark.innerHTML = "FPS:" + parseInt(1 / deltaT);

    requestAnimationFrame(Render);
}

requestAnimationFrame(Render);