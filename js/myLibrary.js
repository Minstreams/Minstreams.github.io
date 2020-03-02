/**这是我的扩展库
 * 包含了一些通用的扩展方法
 */

/**一个空方法 */
var nullFunc = function () { };


//#region 数学方法
/**将数据循环限制在-180到180之间 */
function wrap180(i) {
    while (i > 180) i -= 360;
    while (i < -180) i += 360;
    return i;
}
function isInRange(value, min, max) { return value >= min && value < max; }
function clamp01(value) { return value > 1 ? 1 : value < 0 ? 0 : value; }
function randomRange(min, max) { return min + (max - min) * Math.random(); }
/**将0-1的浮点数转换为0-255的整数 */
function to8Bit(val) { return Math.floor(clamp01(val) * 255.99); }
//#endregion



/**阻止事件冒泡传播
 * @param {Event} e 事件变量
 */
function stopBubbling(e) {
    e = window.event || e;
    if (e.stopPropagation) {
        e.stopPropagation();      //阻止事件 冒泡传播
    } else {
        e.cancelBubble = true;   //ie兼容
    }
}
/**获取url参数 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}


/**Array的扩充方法，删除元素。
 * 没有做异常处理，若删除不存在的元素大概会崩溃吧
 * @param {any} element 要删除的元素
 * @return 此元素
 */
Array.prototype.remove = function (element) {
    if (!this.includes(element)) {
        return null;
    }
    return this.splice(this.indexOf(element), 1)[0];
};

/**JQuery扩展 */
$.fn.extend({
    /**检查是否所有元素都符合条件
     * @return {boolean} 结果
     */
    every: function (checkFunc) {
        let result = true;
        this.each(function (index) {
            if (!checkFunc.call(this, index)) result = false;
        });
        return result;
    },
});
