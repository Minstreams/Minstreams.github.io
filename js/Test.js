// // 开启严格模式
// "use strict";

// // 随便输出点东西
// var hitCount = localStorage.getItem("hitCount") || 0;
// hitCount++;
// localStorage.setItem("hitCount", hitCount);
// document.write("<p>这是用JS的write方法输出的一段文字</p>")
// document.write("您已经浏览了此页面" + hitCount + "次!");

// // 随便定义点函数
// function OverrideContent(target) {
//     target.innerHTML = 1001;
// }

// /** @type {HTMLCanvasElement} */
// var testCanvas = document.getElementById("testCanvas");
// var tc2d = testCanvas.getContext("2d");

// var gradient = tc2d.createLinearGradient(140, 110, 240, 190);
// gradient.addColorStop("0", "#222222");
// gradient.addColorStop("1.0", "black");

// tc2d.strokeStyle = gradient;
// tc2d.lineCap = "round";
// tc2d.shadowColor = 'black'
// tc2d.shadowBlur = 40;
// tc2d.lineWidth = 24;
// var flip = false;
// var angleT = false;
// function TimeUpdate() {
//     tc2d.clearRect(30, 0, 340, 300);
//     var nowTime = Date.now();
//     var endAngle = nowTime / 300 % 2 * Math.PI;
//     var startAngle = nowTime / 427 % 2 * Math.PI;
//     var delta = endAngle - startAngle;
//     if (delta < 0) delta += 2 * Math.PI;
//     if (angleT != (delta < Math.PI)) {
//         angleT = !angleT;
//         if (angleT) flip = !flip;
//     }
//     tc2d.beginPath();
//     tc2d.arc(200, 150, 35 - 35 * Math.sin(delta / 2 + (flip ? 0 : Math.PI) - 0.5 * Math.PI), startAngle, endAngle, !flip);
//     tc2d.stroke();
//     tc2d.beginPath();
//     tc2d.arc(200, 150, 75 + 25 * Math.sin(delta / 2 + (flip ? 0 : Math.PI) - 0.5 * Math.PI), startAngle, endAngle, flip);
//     tc2d.stroke();
//     document.getElementById("debugT").innerHTML = delta;
// }
// setInterval(TimeUpdate, 1000 / 60);







// //画图示例代码
// var tttt = mpData.bufferSections[0]._dataNodes[0]._texData;
// for (var i = 0, len = tttt.length; i < len; i += 4) {
//     tttt[i] = 255 - tttt[i];
//     tttt[i + 1] = 255 - tttt[i + 1];
//     tttt[i + 2] = 255 - tttt[i + 2];
//     tttt[i + 3] = 255;
// }
// mpData.bufferSections[0]._dataNodes[0].Boardcast("texData");


// <!--<canvas id="myCanvas">抱歉，您的浏览器还不支持canvas。</canvas>
//         <input type="file" id="myFile" />
//         <button onclick="putImage2Canvas()">PutToCanvas!</button>
//         <button onclick="Adjust()">Adjust!</button>
//         <button onclick="STest()">STest!</button>
//         <button onclick="RTest()">RTest!</button>-->

//         <!--<script>
//             /**@type {HTMLCanvasElement} */
//             var myCanvas = document.getElementById('myCanvas');
//             /**@type {HTMLInputElement} */
//             var myFile = document.getElementById('myFile');
//             var reader = new FileReader();
//             var img = new Image();
//             var context = myCanvas.getContext('2d');

//             myFile.onchange = function (event) {
//                 reader.readAsDataURL(event.target.files[0]);
//             }

//             function putImage2Canvas() {
//                 img.src = reader.result;
//                 img.onload = function () {
//                     myCanvas.width = img.width;
//                     myCanvas.height = img.height;
//                     context.drawImage(img, 0, 0);

//                 }
//             }
//             function Adjust() {
//                 var imgdata = context.getImageData(0, 0, img.width, img.height);
//                 var sl = imgdata.width * imgdata.height * 4;
//                 var newImgData = new Uint8ClampedArray(sl);
//                 // 处理imgdata
//                 for (var i = 0, len = imgdata.data.length; i < len; i += 4) {
//                     newImgData[i] = 255 - imgdata.data[i];
//                     newImgData[i + 1] = 255 - imgdata.data[i + 1];
//                     newImgData[i + 2] = 255 - imgdata.data[i + 2];
//                     newImgData[i + 3] = 255;
//                 }
//                 imgdata.data.set(newImgData);
//                 context.putImageData(imgdata, 0, 0);
//             }
//         </script>-->
//         <!--<script>
//             var tt=0;
//             function STest() {
//                 $("#st").remove();
//                 $("pipeline").append($("<script id='st'>< /script>").html(
//                     "var TestAlert = ()=> {\n" +
//                     "   console.log('TestAlert!'+"+ tt++ +");\n" +
//                     "};\n" +
//                     "TestAlert();\n"));
//                 console.log($("#st").html());
//                 TestAlert();
//             }
//             function  RTest() {
//                 $("pipeline").empty();
//                 console.log($("#st").html());
//                 TestAlert();
//             }
//         </script>-->



// if (!this.data("c2d")) this.data("c2d", this[0].getContext("2d"));
// let width = target["_width"];
// let height = target["_height"];
// //一些注释
// if ((width != this[0].width) || (height != this[0].height)) {
//     // resize
//     this[0].width = width;
//     this[0].height = height;
// 	this.data("imgData", 
//               this.data("c2d").getImageData(0, 0, width, height));
// }
// if (!this.data("imgData")) 
//     this.data("imgData", 
//               this.data("c2d").getImageData(0, 0, width, height));

// this.data("imgData").data.set(target["_" + propertyName]);
// this.data("c2d").putImageData(this.data("imgData"), 0, 0);

















mpObject["_name"] = "test";
        mpObject["_description"] = "test";
        mpObject["display"] = true;
        mpObject["bufferSections"]=new Array();
        mpObject["bufferSections"][0]=new BufferSection();
        mpObject["bufferSections"][0]["_name"] = "输出";
        mpObject["bufferSections"][0]["_description"] = "最终输出";
        mpObject["bufferSections"][0]["display"] = true;
        mpObject["bufferSections"][0]["_dataNodes"]=new Array();
        mpObject["bufferSections"][0]["_dataNodes"][0]=new BufferDataTexture();
        mpObject["bufferSections"][0]["_dataNodes"][0]["_name"] = "OutColor";
        mpObject["bufferSections"][0]["_dataNodes"][0]["_description"] = "最终输出的颜色";
        mpObject["bufferSections"][0]["_dataNodes"][0]["display"] = true;
        mpObject["bufferSections"][0]["_dataNodes"][0]["_width"] = 512;
        mpObject["bufferSections"][0]["_dataNodes"][0]["_height"] = 512;
        mpObject["bufferSections"][0]["_dataNodes"][0].Resize();
        mpObject["bufferSections"][0]["_codeSection"]=new CodeSection();
        mpObject["bufferSections"][0]["_codeSection"]["_name"] = "数据操作方法组";
        mpObject["bufferSections"][0]["_codeSection"]["_description"] = "new";
        mpObject["bufferSections"][0]["_codeSection"]["display"] = true;
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"]=new Array();
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][0]=new CodeDataJavaScript();
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][0]["_name"] = "SetColor";
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][0]["_description"] = "设置颜色";
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][0]["display"] = true;
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][0]["_codeText"] = "let x = arguments[0];\nlet y = arguments[1];\nlet u = arguments[2];\nlet v = arguments[3];\n\nlet cc = vec4(Math.sin(time*0.001)*0.5+0.5,\n              Math.sin(time*0.002)*0.5+0.5,\n              Math.sin(time*0.003)*0.5+0.5,\n             Math.sin(u*Math.PI)*Math.sin(v*Math.PI));\nOutColor(x,y,cc);\n";
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][1]=new CodeDataJavaScript();
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][1]["_name"] = "ClearCanvas";
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][1]["_description"] = "清除画布";
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][1]["display"] = true;
        mpObject["bufferSections"][0]["_codeSection"]["_codeNodes"][1]["_codeText"] = "OutColor(vec4(0));\n";
        mpObject["bufferSections"][1]=new BufferSection();
        mpObject["bufferSections"][1]["_name"] = "表层数据";
        mpObject["bufferSections"][1]["_description"] = "第一层数据";
        mpObject["bufferSections"][1]["display"] = true;
        mpObject["bufferSections"][1]["_dataNodes"]=new Array();
        mpObject["bufferSections"][1]["_dataNodes"][0]=new BufferDataF1();
        mpObject["bufferSections"][1]["_dataNodes"][0]["_name"] = "time";
        mpObject["bufferSections"][1]["_dataNodes"][0]["_description"] = "记录当前时间";
        mpObject["bufferSections"][1]["_dataNodes"][0]["display"] = true;
        mpObject["bufferSections"][1]["_dataNodes"][0]["_x"]=new Number();
        mpObject["bufferSections"][1]["_dataNodes"][1]=new BufferDataF1();
        mpObject["bufferSections"][1]["_dataNodes"][1]["_name"] = "fps";
        mpObject["bufferSections"][1]["_dataNodes"][1]["_description"] = "暂时没什么用";
        mpObject["bufferSections"][1]["_dataNodes"][1]["display"] = true;
        mpObject["bufferSections"][1]["_dataNodes"][1]["_x"]=new Number();
        mpObject["bufferSections"][1]["_dataNodes"][2]=new BufferDataF2();
        mpObject["bufferSections"][1]["_dataNodes"][2]["_name"] = "coord";
        mpObject["bufferSections"][1]["_dataNodes"][2]["_description"] = "Des";
        mpObject["bufferSections"][1]["_dataNodes"][2]["display"] = true;
        mpObject["bufferSections"][1]["_dataNodes"][3]=new BufferDataF4();
        mpObject["bufferSections"][1]["_dataNodes"][3]["_name"] = "pos";
        mpObject["bufferSections"][1]["_dataNodes"][3]["_description"] = "Des";
        mpObject["bufferSections"][1]["_dataNodes"][3]["display"] = true;
        mpObject["bufferSections"][1]["_dataNodes"][4]=new BufferDataF2();
        mpObject["bufferSections"][1]["_dataNodes"][4]["_name"] = "uv";
        mpObject["bufferSections"][1]["_dataNodes"][4]["_description"] = "uv坐标，0~1";
        mpObject["bufferSections"][1]["_dataNodes"][4]["display"] = true;
        mpObject["bufferSections"][1]["_dataNodes"][4]["_x"] = 0.09546239999976029;
        mpObject["bufferSections"][1]["_dataNodes"][4]["_y"] = 0.65368000000194;
        mpObject["bufferSections"][1]["_dataNodes"][5]=new BufferDataF4();
        mpObject["bufferSections"][1]["_dataNodes"][5]["_name"] = "color";
        mpObject["bufferSections"][1]["_dataNodes"][5]["_description"] = "记录颜色，0~1";
        mpObject["bufferSections"][1]["_dataNodes"][5]["display"] = true;
        mpObject["bufferSections"][1]["_dataNodes"][5]["_x"] = 0.9799402622286909;
        mpObject["bufferSections"][1]["_dataNodes"][5]["_y"] = 0.07778692546224775;
        mpObject["bufferSections"][1]["_dataNodes"][5]["_z"] = 0.25788058407122294;
        mpObject["bufferSections"][1]["_dataNodes"][5]["_w"] = 0.2616605470618733;
        mpObject["bufferSections"][1]["_dataNodes"][6]=new BufferDataMatrix();
        mpObject["bufferSections"][1]["_dataNodes"][6]["_name"] = "matt";
        mpObject["bufferSections"][1]["_dataNodes"][6]["_description"] = "Des";
        mpObject["bufferSections"][1]["_dataNodes"][6]["display"] = true;
        mpObject["bufferSections"][1]["_codeSection"]=new CodeSection();
        mpObject["bufferSections"][1]["_codeSection"]["_name"] = "渲染循环";
        mpObject["bufferSections"][1]["_codeSection"]["_description"] = "new";
        mpObject["bufferSections"][1]["_codeSection"]["display"] = true;
        mpObject["bufferSections"][1]["_codeSection"]["_codeNodes"]=new Array();
        mpObject["bufferSections"][1]["_codeSection"]["_codeNodes"][0]=new CodeDataJavaScript();
        mpObject["bufferSections"][1]["_codeSection"]["_codeNodes"][0]["_name"] = "Cal";
        mpObject["bufferSections"][1]["_codeSection"]["_codeNodes"][0]["_description"] = "渲染循环主体";
        mpObject["bufferSections"][1]["_codeSection"]["_codeNodes"][0]["display"] = true;
        mpObject["bufferSections"][1]["_codeSection"]["_codeNodes"][0]["_codeText"] = "color = pMat*vMat*pos;";
        mpObject["bufferSections"][2]=new BufferSection();
        mpObject["bufferSections"][2]["_name"] = "Matt";
        mpObject["bufferSections"][2]["_description"] = "New";
        mpObject["bufferSections"][2]["display"] = true;
        mpObject["bufferSections"][2]["_dataNodes"]=new Array();
        mpObject["bufferSections"][2]["_dataNodes"][0]=new BufferDataF1();
        mpObject["bufferSections"][2]["_dataNodes"][0]["_name"] = "Name";
        mpObject["bufferSections"][2]["_dataNodes"][0]["_description"] = "Des";
        mpObject["bufferSections"][2]["_dataNodes"][0]["display"] = true;
        mpObject["bufferSections"][2]["_dataNodes"][0]["_x"]=new Number();
        mpObject["bufferSections"][2]["_dataNodes"][1]=new BufferDataF2();
        mpObject["bufferSections"][2]["_dataNodes"][1]["_name"] = "Name";
        mpObject["bufferSections"][2]["_dataNodes"][1]["_description"] = "Des";
        mpObject["bufferSections"][2]["_dataNodes"][1]["display"] = true;
        mpObject["bufferSections"][2]["_dataNodes"][2]=new BufferDataF3();
        mpObject["bufferSections"][2]["_dataNodes"][2]["_name"] = "oooo";
        mpObject["bufferSections"][2]["_dataNodes"][2]["_description"] = "Des";
        mpObject["bufferSections"][2]["_dataNodes"][2]["display"] = true;
        mpObject["bufferSections"][2]["_dataNodes"][3]=new BufferDataTexture();
        mpObject["bufferSections"][2]["_dataNodes"][3]["_name"] = "Name";
        mpObject["bufferSections"][2]["_dataNodes"][3]["_description"] = "Des";
        mpObject["bufferSections"][2]["_dataNodes"][3]["display"] = true;
        mpObject["bufferSections"][2]["_dataNodes"][3]["_width"] = 256;
        mpObject["bufferSections"][2]["_dataNodes"][3]["_height"] = 256;
        mpObject["bufferSections"][2]["_dataNodes"][3].Resize();
        mpObject["bufferSections"][2]["_dataNodes"][4]=new BufferDataMatrix();
        mpObject["bufferSections"][2]["_dataNodes"][4]["_name"] = "vMat";
        mpObject["bufferSections"][2]["_dataNodes"][4]["_description"] = "Des";
        mpObject["bufferSections"][2]["_dataNodes"][4]["display"] = true;
        mpObject["bufferSections"][2]["_dataNodes"][5]=new BufferDataMatrix();
        mpObject["bufferSections"][2]["_dataNodes"][5]["_name"] = "pMat";
        mpObject["bufferSections"][2]["_dataNodes"][5]["_description"] = "Des";
        mpObject["bufferSections"][2]["_dataNodes"][5]["display"] = true;
        mpObject["bufferSections"][2]["_codeSection"]=new CodeSection();
        mpObject["bufferSections"][2]["_codeSection"]["_name"] = "new";
        mpObject["bufferSections"][2]["_codeSection"]["_description"] = "new";
        mpObject["bufferSections"][2]["_codeSection"]["display"] = true;
        mpObject["bufferSections"][2]["_codeSection"]["_codeNodes"]=new Array();
        mpObject["bufferSections"][2]["_codeSection"]["_codeNodes"][0]=new CodeDataJavaScript();
        mpObject["bufferSections"][2]["_codeSection"]["_codeNodes"][0]["_name"] = "Fake";
        mpObject["bufferSections"][2]["_codeSection"]["_codeNodes"][0]["_description"] = "描述";
        mpObject["bufferSections"][2]["_codeSection"]["_codeNodes"][0]["display"] = true;
        mpObject["bufferSections"][2]["_codeSection"]["_codeNodes"][0]["_codeText"] = "vMat.SetTransition(vec3(0,5,-20));\npMat = Matrix.PerspectiveProjectionAspect(60,1,0.1,1000);";
        mpObject["bufferSections"][3]=new BufferSection();
        mpObject["bufferSections"][3]["_name"] = "New";
        mpObject["bufferSections"][3]["_description"] = "New";
        mpObject["bufferSections"][3]["display"] = true;
        mpObject["bufferSections"][3]["_dataNodes"]=new Array();
        mpObject["bufferSections"][3]["_dataNodes"][0]=new BufferDataF1();
        mpObject["bufferSections"][3]["_dataNodes"][0]["_name"] = "Name";
        mpObject["bufferSections"][3]["_dataNodes"][0]["_description"] = "Des";
        mpObject["bufferSections"][3]["_dataNodes"][0]["display"] = true;
        mpObject["bufferSections"][3]["_dataNodes"][0]["_x"]=new Number();
        mpObject["bufferSections"][3]["_dataNodes"][1]=new BufferDataF2();
        mpObject["bufferSections"][3]["_dataNodes"][1]["_name"] = "Name";
        mpObject["bufferSections"][3]["_dataNodes"][1]["_description"] = "Des";
        mpObject["bufferSections"][3]["_dataNodes"][1]["display"] = true;
        mpObject["bufferSections"][3]["_dataNodes"][2]=new BufferDataF3();
        mpObject["bufferSections"][3]["_dataNodes"][2]["_name"] = "Name";
        mpObject["bufferSections"][3]["_dataNodes"][2]["_description"] = "Des";
        mpObject["bufferSections"][3]["_dataNodes"][2]["display"] = true;
        mpObject["bufferSections"][3]["_dataNodes"][3]=new BufferDataF4();
        mpObject["bufferSections"][3]["_dataNodes"][3]["_name"] = "Name";
        mpObject["bufferSections"][3]["_dataNodes"][3]["_description"] = "Des";
        mpObject["bufferSections"][3]["_dataNodes"][3]["display"] = true;
        mpObject["bufferSections"][3]["_dataNodes"][4]=new BufferDataTexture();
        mpObject["bufferSections"][3]["_dataNodes"][4]["_name"] = "Name";
        mpObject["bufferSections"][3]["_dataNodes"][4]["_description"] = "Des";
        mpObject["bufferSections"][3]["_dataNodes"][4]["display"] = true;
        mpObject["bufferSections"][3]["_dataNodes"][4]["_width"] = 256;
        mpObject["bufferSections"][3]["_dataNodes"][4]["_height"] = 256;
        mpObject["bufferSections"][3]["_dataNodes"][4].Resize();
        mpObject["bufferSections"][3]["_codeSection"]=new CodeSection();
        mpObject["bufferSections"][3]["_codeSection"]["_name"] = "new";
        mpObject["bufferSections"][3]["_codeSection"]["_description"] = "new";
        mpObject["bufferSections"][3]["_codeSection"]["display"] = true;
        mpObject["bufferSections"][3]["_codeSection"]["_codeNodes"]=new Array();
        mpObject["bufferSections"][3]["_codeSection"]["_codeNodes"][0]=new CodeDataJavaScript();
        mpObject["bufferSections"][3]["_codeSection"]["_codeNodes"][0]["_name"] = "Name";
        mpObject["bufferSections"][3]["_codeSection"]["_codeNodes"][0]["_description"] = "描述";
        mpObject["bufferSections"][3]["_codeSection"]["_codeNodes"][0]["display"] = true;
        mpObject["bufferSections"][3]["_codeSection"]["_codeNodes"][0]["_codeText"] = "";
        mpObject["bufferSections"][4]=new BufferSection();
        mpObject["bufferSections"][4]["_name"] = "New";
        mpObject["bufferSections"][4]["_description"] = "New";
        mpObject["bufferSections"][4]["display"] = true;
        mpObject["bufferSections"][4]["_dataNodes"]=new Array();
        mpObject["bufferSections"][4]["_dataNodes"][0]=new BufferDataF1();
        mpObject["bufferSections"][4]["_dataNodes"][0]["_name"] = "Name";
        mpObject["bufferSections"][4]["_dataNodes"][0]["_description"] = "Des";
        mpObject["bufferSections"][4]["_dataNodes"][0]["display"] = true;
        mpObject["bufferSections"][4]["_dataNodes"][0]["_x"]=new Number();
        mpObject["bufferSections"][4]["_dataNodes"][1]=new BufferDataF2();
        mpObject["bufferSections"][4]["_dataNodes"][1]["_name"] = "Name";
        mpObject["bufferSections"][4]["_dataNodes"][1]["_description"] = "Des";
        mpObject["bufferSections"][4]["_dataNodes"][1]["display"] = true;
        mpObject["bufferSections"][4]["_dataNodes"][2]=new BufferDataF3();
        mpObject["bufferSections"][4]["_dataNodes"][2]["_name"] = "Name";
        mpObject["bufferSections"][4]["_dataNodes"][2]["_description"] = "Des";
        mpObject["bufferSections"][4]["_dataNodes"][2]["display"] = true;
        mpObject["bufferSections"][4]["_dataNodes"][3]=new BufferDataF4();
        mpObject["bufferSections"][4]["_dataNodes"][3]["_name"] = "Name";
        mpObject["bufferSections"][4]["_dataNodes"][3]["_description"] = "Des";
        mpObject["bufferSections"][4]["_dataNodes"][3]["display"] = true;
        mpObject["bufferSections"][4]["_dataNodes"][4]=new BufferDataTexture();
        mpObject["bufferSections"][4]["_dataNodes"][4]["_name"] = "Name";
        mpObject["bufferSections"][4]["_dataNodes"][4]["_description"] = "Des";
        mpObject["bufferSections"][4]["_dataNodes"][4]["display"] = true;
        mpObject["bufferSections"][4]["_dataNodes"][4]["_width"] = 256;
        mpObject["bufferSections"][4]["_dataNodes"][4]["_height"] = 256;
        mpObject["bufferSections"][4]["_dataNodes"][4].Resize();
        mpObject["bufferSections"][4]["_dataNodes"][5]=new BufferDataMatrix();
        mpObject["bufferSections"][4]["_dataNodes"][5]["_name"] = "Name";
        mpObject["bufferSections"][4]["_dataNodes"][5]["_description"] = "Des";
        mpObject["bufferSections"][4]["_dataNodes"][5]["display"] = true;
        mpObject["bufferSections"][4]["_codeSection"]=new CodeSection();
        mpObject["bufferSections"][4]["_codeSection"]["_name"] = "new";
        mpObject["bufferSections"][4]["_codeSection"]["_description"] = "new";
        mpObject["bufferSections"][4]["_codeSection"]["display"] = true;
        mpObject["bufferSections"][4]["_codeSection"]["_codeNodes"]=new Array();
        mpObject["bufferSections"][4]["_codeSection"]["_codeNodes"][0]=new CodeDataJavaScript();
        mpObject["bufferSections"][4]["_codeSection"]["_codeNodes"][0]["_name"] = "Name";
        mpObject["bufferSections"][4]["_codeSection"]["_codeNodes"][0]["_description"] = "描述";
        mpObject["bufferSections"][4]["_codeSection"]["_codeNodes"][0]["display"] = true;
        mpObject["bufferSections"][4]["_codeSection"]["_codeNodes"][0]["_codeText"] = "";
        mpObject["mainCodeData"]=new CodeDataJavaScript();
        mpObject["mainCodeData"]["_name"] = "main";
        mpObject["mainCodeData"]["_description"] = "函数入口";
        mpObject["mainCodeData"]["display"] = true;
        mpObject["mainCodeData"]["_codeText"] = "Fake();\n";