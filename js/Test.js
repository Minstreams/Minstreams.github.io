// 开启严格模式
"use strict";

// 随便输出点东西
var hitCount = localStorage.getItem("hitCount") || 0;
hitCount++;
localStorage.setItem("hitCount", hitCount);
document.write("<p>这是用JS的write方法输出的一段文字</p>")
document.write("您已经浏览了此页面" + hitCount + "次!");

// 随便定义点函数
function OverrideContent(target) {
    target.innerHTML = 1001;
}

/** @type {HTMLCanvasElement} */
var testCanvas = document.getElementById("testCanvas");
var tc2d = testCanvas.getContext("2d");

var gradient = tc2d.createLinearGradient(140, 110, 240, 190);
gradient.addColorStop("0", "#222222");
gradient.addColorStop("1.0", "black");

tc2d.strokeStyle = gradient;
tc2d.lineCap = "round";
tc2d.shadowColor = 'black'
tc2d.shadowBlur = 40;
tc2d.lineWidth = 24;
var flip = false;
var angleT = false;
function TimeUpdate() {
    tc2d.clearRect(30, 0, 340, 300);
    var nowTime = Date.now();
    var endAngle = nowTime / 300 % 2 * Math.PI;
    var startAngle = nowTime / 427 % 2 * Math.PI;
    var delta = endAngle - startAngle;
    if (delta < 0) delta += 2 * Math.PI;
    if (angleT != (delta < Math.PI)) {
        angleT = !angleT;
        if (angleT) flip = !flip;
    }
    tc2d.beginPath();
    tc2d.arc(200, 150, 35 - 35 * Math.sin(delta / 2 + (flip ? 0 : Math.PI) - 0.5 * Math.PI), startAngle, endAngle, !flip);
    tc2d.stroke();
    tc2d.beginPath();
    tc2d.arc(200, 150, 75 + 25 * Math.sin(delta / 2 + (flip ? 0 : Math.PI) - 0.5 * Math.PI), startAngle, endAngle, flip);
    tc2d.stroke();
    document.getElementById("debugT").innerHTML = oDelta;
}
setInterval(TimeUpdate, 1000 / 60);
