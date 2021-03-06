/**事件模块
 * 主要功能：
 *      全局事件控制
 * 依赖:
 *      mpRuntimeLibrary.js
 * }
 */

var initFuncs = [];
/**所有模块共同的初始化方法 */
export function Init(func) {
    if (func) {
        initFuncs.push(func);
    }
    else {
        initFuncs.forEach(i => i());
    }
}

Init(function () {
    $('EventHandler').on('restruct', function () {
        $(':data(preRestructFunc)').executeAll('preRestructFunc');
        $(':data(restructFunc)').executeAll('restructFunc');
        $(':data(afterRestructFunc)').executeAll('afterRestructFunc');
        _MP.UpdateAll();
    });
});
