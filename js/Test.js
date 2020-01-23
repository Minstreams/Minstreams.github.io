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
    document.getElementById("debugT").innerHTML = delta;
}
setInterval(TimeUpdate, 1000 / 60);







//画图示例代码
var tttt = mpData.bufferSections[0]._dataNodes[0]._texData;
for (var i = 0, len = tttt.length; i < len; i += 4) {
    tttt[i] = 255 - tttt[i];
    tttt[i + 1] = 255 - tttt[i + 1];
    tttt[i + 2] = 255 - tttt[i + 2];
    tttt[i + 3] = 255;
}
mpData.bufferSections[0]._dataNodes[0].Boardcast("texData");


<!--<canvas id="myCanvas">抱歉，您的浏览器还不支持canvas。</canvas>
        <input type="file" id="myFile" />
        <button onclick="putImage2Canvas()">PutToCanvas!</button>
        <button onclick="Adjust()">Adjust!</button>
        <button onclick="STest()">STest!</button>
        <button onclick="RTest()">RTest!</button>-->

        <!--<script>
            /**@type {HTMLCanvasElement} */
            var myCanvas = document.getElementById('myCanvas');
            /**@type {HTMLInputElement} */
            var myFile = document.getElementById('myFile');
            var reader = new FileReader();
            var img = new Image();
            var context = myCanvas.getContext('2d');

            myFile.onchange = function (event) {
                reader.readAsDataURL(event.target.files[0]);
            }

            function putImage2Canvas() {
                img.src = reader.result;
                img.onload = function () {
                    myCanvas.width = img.width;
                    myCanvas.height = img.height;
                    context.drawImage(img, 0, 0);

                }
            }
            function Adjust() {
                var imgdata = context.getImageData(0, 0, img.width, img.height);
                var sl = imgdata.width * imgdata.height * 4;
                var newImgData = new Uint8ClampedArray(sl);
                // 处理imgdata
                for (var i = 0, len = imgdata.data.length; i < len; i += 4) {
                    newImgData[i] = 255 - imgdata.data[i];
                    newImgData[i + 1] = 255 - imgdata.data[i + 1];
                    newImgData[i + 2] = 255 - imgdata.data[i + 2];
                    newImgData[i + 3] = 255;
                }
                imgdata.data.set(newImgData);
                context.putImageData(imgdata, 0, 0);
            }
        </script>-->
        <!--<script>
            var tt=0;
            function STest() {
                $("#st").remove();
                $("pipeline").append($("<script id='st'>< /script>").html(
                    "var TestAlert = ()=> {\n" +
                    "   console.log('TestAlert!'+"+ tt++ +");\n" +
                    "};\n" +
                    "TestAlert();\n"));
                console.log($("#st").html());
                TestAlert();
            }
            function  RTest() {
                $("pipeline").empty();
                console.log($("#st").html());
                TestAlert();
            }
        </script>-->



if (!this.data("c2d")) this.data("c2d", this[0].getContext("2d"));
let width = target["_width"];
let height = target["_height"];
//一些注释
if ((width != this[0].width) || (height != this[0].height)) {
    // resize
    this[0].width = width;
    this[0].height = height;
	this.data("imgData", 
              this.data("c2d").getImageData(0, 0, width, height));
}
if (!this.data("imgData")) 
    this.data("imgData", 
              this.data("c2d").getImageData(0, 0, width, height));

this.data("imgData").data.set(target["_" + propertyName]);
this.data("c2d").putImageData(this.data("imgData"), 0, 0);

