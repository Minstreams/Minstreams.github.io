/**mp序列化模块
 * 依赖：
 * ·    mpCore.js
 */



 /**MP对象专用序列化方法 */
export var MPOS = {
    /**将MP对象转化为json字符串
     * @param {MPPrototype} obj MP对象
     * @return {string} json字符串
     */
    stringify: function (obj) {
        let result = "";
        function serializeInternal(o, path) {
            for (key in o) {
                var value = o[key];
                if (key.match(/(?:^Boardcast|remove|avater)/)) {
                    // 此为排除条件
                    continue;
                }
                if (typeof value != "object") {
                    if (typeof value == "string") {
                        result += "\n" + path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "] = " + "\"" + value.replace(/\"/g, "\\\"").replace(/[\n\r]/g, "\\n") + "\"" + ";";
                    } else {
                        result += "\n" + path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "] = " + value + ";";
                    }
                }
                else if (key == "_texData") {
                    result += "\n" + path + ".Resize();";
                }
                else {
                    if (value instanceof Array) {
                        result += "\n" + path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "]" + "=" + "new Array();";
                        serializeInternal(value, path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "]");
                    } else {
                        result += "\n" + path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "]" + "=" + "new " + value.constructor.name + "();";
                        serializeInternal(value, path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "]");
                    }
                }
            }
        }
        serializeInternal(obj, "#mpObject");
        return result;
    },
    /**将json字符串转化为MP对象
     * @param {string} str json字符串
     * @return {MPPrototype} MP对象
     */
    parse: function (obj, str, name) {
        if (!str) return;
        str = str.replace(/#mpObject/g, name);
        eval(str);
    }
}