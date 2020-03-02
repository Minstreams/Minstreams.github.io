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

//#region 数据绑定
/**数据绑定原理：
 * 原始数据绑定一个UI元素包含两个基本操作
 * 1.显示数据
 *      关键字-(updataFunc)->显示更新
 * 2.更新数据
 *      更改后的数据-(setFunc)->更改后的原始数据
 * 以上，还需要提供事件字符串来触发更新数据操作，并提供绑定时额外的定制
 */
/**所有updataFunc的集合
 * @updataFunc 是数据改变时元素的响应方法
 */
var updataFunctions = {
    /**text(name) */
    text(target, propertyName) { this.text(target[propertyName]); },
    /**text(name)保留小数点3位 */
    number(target, propertyName) {this.text(target[propertyName].toFixed(3)); },
};

//#endregion

function UpdateAll(){
    
}

$.fn.extend({
    /**将UI元素绑定到一个数据属性上，并响应其广播
     * @param {MPPrototype} target 属性所在对象
     * @param {string} propertyName 属性名称
     * @param {string} template 绑定模板名称
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    BindProperty: function (target, propertyName, template) {
        var el = this;
        // 查重
        if (el.data("binded")) return el;
        // 读取方法模板
        let temp = propertyBindTemplate[template || "readonly"];
        // 记录属性
        el.addClass(propertyName);
        // 定义响应方法
        el.data("respondFunc", function () { temp.respondFunc.call(el, target, propertyName); return el; })
            // 定义更新方法
            .data("updateFunc", function () { temp.updateFunc.call(el, target, propertyName); return el; })
            // 标记绑定状态
            .data("binded", true)
            // 初始化数据
            .data("respondFunc")();

        // 绑定更新事件
        if (temp.updateEvent) el.on(temp.updateEvent, function () { el.data("updateFunc")(); RespondEverything(); })

        // 绑定响应
        if (temp.onBind) temp.onBind.call(el, target, propertyName);

        return el;
    },
    /**更新所有绑定的属性
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    UpdateProperty: function () {
        this.filter(":data(updateFunc)").each(function () { $(this).data("updateFunc")(); });
        return this;
    },
    /**主动获取属性数据，更新自身
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    RespondProperty: function () {
        this.filter(":data(respondFunc)").each(function () { $(this).data("respondFunc")(); });
        return this;
    },
    /**加载MP控件 */
    MPLoadWidget: function () {
        $(this).each(function (i, el) {
            let widgetType = $(this).attr("widgetType");
            let mpObject = $(this).data("mpObject");
            //TODO
        });
    },
});

