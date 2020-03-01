/**这是代码编辑器扩展库
 * 记录了代码编辑器可用的扩展方法
 * 不属于给代码编辑器调用的方法和属性分别用__和_作为前缀
 */

var _stopMark = false;
function __StopFrame() {
    _stopMark = true;
}


function nextFrame(fName) {
    respondElements = respondElements.add('canvas');
    if (_stopMark) {
        return;
    }
    requestAnimationFrame(RespondEverything);
    requestAnimationFrame(fName);
}