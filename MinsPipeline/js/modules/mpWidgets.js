/**数据项交互控件
 * 依赖:
 *      mpRuntimeLibrary.js
 *      @module mpCore
 *      @module mpDataNodes
 * 
 * 标签属性:{
 *      id: mpWidget,
 *      widgetType: 'data'|'code',  // 数据项（默认）|代码项
 *      mpObject: 数据项的引用
 * }
 */

$.fn.extend({
    /**加载MP控件 */
    MPLoadWidget: function () {
        $(this).each(function (i, el) {
            let widgetType = el.attr("widgetType");
            let mpObject = el.data("mpObject");
            //TODO
        });
    },
});

