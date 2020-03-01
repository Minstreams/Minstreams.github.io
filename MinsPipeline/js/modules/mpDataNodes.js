/**mp数据节点定义
 * 在这里添加数据节点类型后，还需要在mpWidget.js中添加对应类型的UI控件
 * 依赖：
 *      mpCore.js
 *      mpRuntimeLibrary.js
 */
import { MPBufferDataPrototype } from "./mpCore";


 /**@name 一维浮点数据项
 * @description 一个一维浮点数
 */
export class BufferDataF1 extends MPBufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} x x
     */
    constructor(name, description, x) {
        super(name, description);
        /**@type {number}
         */
        this._x = x || this._x || 0;
        let d = this;
        this.avater = {
            get self() { return d._x; },
            get x() { return d._x; },
            get r() { return d._x; },
            set self(val) { d._x = val; d.Boardcast("x"); },
            set x(val) { d._x = val; d.Boardcast("x"); },
            set r(val) { d._x = val; d.Boardcast("x"); },
        }
    }

    get x() { return this._x; }
    set x(val) { this._x; this.Boardcast("x"); }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, "x", "number"));
    }
}