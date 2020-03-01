/**mp控件加载器
 * 用于在浏览器界面中加载mp控件
 * 
 * 标签属性:{
 *      id: mpWidget,
 *      widgetType: 'data'|'code',  // 数据项（默认）|代码项
 *      section: id|name,           // 节的序号|名称
 *      ndoe: id|name               // 节点序号|名称
 * }
 */
/**MP模块 */
var _MP;

/**存放所有的mpData */
var mpData;

async function _onload() {
    _MP = await import('./mpModule');

    $("#mpWidget").text("这是一个mpWidget");
}