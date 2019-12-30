/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType) {
    // Create the shader object
    var shader = gl.createShader(shaderType);

    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(shaderSource);
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
* @param {!WebGLShader} vertexShader A vertex shader.
* @param {!WebGLShader} fragmentShader A fragment shader.
* @return {!WebGLProgram} A program.
*/
function createProgram(gl, vertexShader, fragmentShader) {
    // create a program.
    var program = gl.createProgram();

    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;

    }

    // something went wrong with the link
    throw ("program filed to link:" + gl.getProgramInfoLog(program));
};

/**
 * Creates a shader from the content of a script tag.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} scriptId The id of the script tag.
 * @param {string} opt_shaderType. The type of shader to create.
 *     If not passed in will use the type attribute from the
 *     script tag.
 * @return {!WebGLShader} A shader.
 */
function createShaderFromScript(gl, scriptId, opt_shaderType) {
    // look up the script tag by id.
    var shaderScript = document.getElementById(scriptId);
    if (!shaderScript) {
        throw ("*** Error: unknown script element" + scriptId);
    }

    // extract the contents of the script tag.
    var shaderSource = shaderScript.text;

    // If we didn't pass in a type, use the 'type' from
    // the script tag.
    if (!opt_shaderType) {
        if (shaderScript.type == "x-shader/x-vertex") {
            opt_shaderType = gl.VERTEX_SHADER;
        } else if (shaderScript.type == "x-shader/x-fragment") {
            opt_shaderType = gl.FRAGMENT_SHADER;
        } else if (!opt_shaderType) {
            throw ("*** Error: shader type not set");
        }
    }

    return compileShader(gl, shaderSource, opt_shaderType);
};

/**
 * Creates a program from 2 script tags.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} vertexShaderId The id of the vertex shader script tag.
 * @param {string} fragmentShaderId The id of the fragment shader script tag.
 * @return {!WebGLProgram} A program
 */
function createProgramFromScripts(
    gl, vertexShaderId, fragmentShaderId) {
    var vertexShader = createShaderFromScript(gl, vertexShaderId, gl.VERTEX_SHADER);
    var fragmentShader = createShaderFromScript(gl, fragmentShaderId, gl.FRAGMENT_SHADER);
    return createProgram(gl, vertexShader, fragmentShader);
}

function sendRequest(url, callback, postData) {
    var req = new XMLHttpRequest();
    if (!req) return;
    var method = postData ? "POST" : "GET";
    req.open(method, url, true);
    req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
    if (postData)
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = function () {
        if (req.readyState != 4)
            return;
        if (req.status != 200 && req.status != 304) {
            alert('HTTP error ' + req.status);
            return;
        }
        callback(req);
    }
    if (req.readyState == 4)
        return;
    req.send(postData);
}

function FileLoader(url, onLoad) {

    if (url === undefined) url = '';
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.addEventListener('load', function (event) {

        var responseText = this.responseText;

        if (!this.status === 200) return;
        // 通过正则表达式去掉注释
        responseText = responseText.replace(/(\n)|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, '');
        onLoad(responseText);

    });

    request.send(null);
}