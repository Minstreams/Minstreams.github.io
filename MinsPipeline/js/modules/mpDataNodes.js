/**mp数据节点定义
 * 在这里添加数据节点类型后，还需要在mpWidget.js中添加对应类型的UI控件
 * 依赖：
 *      mpRuntimeLibrary.js
 *      @module mpCore
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
        super(name || "newFloat", description || "这是一个浮点数");
        /**@type {number}
         */
        this._x = x || 0;
        let d = this;
        this.avater = {
            get self() { return d._x; },
            get x() { return d._x; },
            get r() { return d._x; },
            set self(val) { d._x = val; },
            set x(val) { d._x = val; },
            set r(val) { d._x = val; },
        }
    }

    get x() { return this._x; }
    set x(val) { this._x; }
}
/**@name 二维浮点数据项
 * @description 一个二维浮点数
 */
export class BufferDataF2 extends MPBufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} x x
     * @param {number} y y
     */
    constructor(name, description, x, y) {
        super(name || "newVec2", description || "这是一个二维向量");
        this.avater = new Vector2(x || 0, y || 0);
    }

    get x() { return this.avater.x; }
    get y() { return this.avater.y; }
}
/**@name 三维浮点数据项
 * @description 一个三维浮点数
 */
export class BufferDataF3 extends MPBufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} x x
     * @param {number} y y
     * @param {number} z z
     */
    constructor(name, description, x, y, z) {
        super(name || "newVec3", description || "这是一个三维向量");
        this.avater = new Vector3(x || 0, y || 0, z || 0);
    }

    get x() { return this.avater.x; }
    get y() { return this.avater.y; }
    get z() { return this.avater.z; }
}
/**@name 四维浮点数据项
 * @description 一个四维浮点数
 */
export class BufferDataF4 extends MPBufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} x x
     * @param {number} y y
     * @param {number} z z
     * @param {number} w w
     */
    constructor(name, description, x, y, z, w) {
        super(name || "newVec4", description || "这是一个四维向量");
        this.avater = new Vector4(x || 0, y || 0, z || 0, w || 0);
    }

    get x() { return this.avater.x; }
    get y() { return this.avater.y; }
    get z() { return this.avater.z; }
    get w() { return this.avater.w; }
}
/**@name 矩阵数据项
 * @description 一个4*4矩阵
 */
export class BufferDataMatrix extends MPBufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number[]} m 矩阵，长度为16
     */
    constructor(name, description, m) {
        super(name || "newMatrix", description || "这是一个矩阵");
        m = m || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.avater = new Matrix(...m);
    }
}
