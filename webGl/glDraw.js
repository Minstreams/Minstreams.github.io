"use strict";
/** @type {HTMLCanvasElement} */
var glCanvas = document.getElementById("glCanvas");
var gl = glCanvas.getContext("webgl2");
if (!gl) { document.write("Your browser does not support webgl2"); }

// /** @type {HTMLScriptElement} */
// var testT = document.getElementById("test");

/** @type {HTMLTextAreaElement} */
var vertexShaderSource = document.getElementById("vertText");
/** @type {HTMLTextAreaElement} */
var fragmentShaderSource = document.getElementById("fragText");


function ProceedShader() {
    // 编译
    var vertexShader = compileShader(gl, vertexShaderSource.value, gl.VERTEX_SHADER);
    var fragmentShader = compileShader(gl, fragmentShaderSource.value, gl.FRAGMENT_SHADER);
    var program = createProgram(gl, vertexShader, fragmentShader);

    // 创建VAO，顶点数据载体
    var vao = gl.createVertexArray();

    // 挂载变量存储地址
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // 创建每个变量的Buffer
    var positionBuffer = gl.createBuffer();



    // 绑定VAO
    gl.bindVertexArray(vao);

    // 激活VAO中的变量存储地址,告诉webgl这个变量将由cpu传入
    gl.enableVertexAttribArray(positionAttributeLocation);

    // 绑定Buffer，gl.ARRAY_BUFFER是一个全局的绑定点（bind point），会与当前VAO绑定
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 指定buffer中的数据解析方式(实际上是将Shader的变量位置和当前绑定的缓存绑定)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    // 往Buffer中放数据,并标记为静态量(gl.STATIC_DRAW)
    // three 2d points
    var positions = [
        -1, 0,
        0, 0.5,
        0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);





    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    // gl.bindVertexArray(vao);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);





    // three 2d points
    var positions2 = [
        0, 0,
        0, -0.5,
        -0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW);
    gl.drawArrays(primitiveType, offset, count);
    var positions3 = [
        1, 1,
        0.7, 0.9,
        0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions3), gl.STATIC_DRAW);
    gl.drawArrays(primitiveType, offset, count);

}