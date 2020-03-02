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
export class MPF1 extends MPBufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} x x
     */
    constructor(name, description, x) {
        super(name || "newFloat", description || "这是一个浮点数");
        /**@type {number}
         */
        this.x = x || 0;
        let d = this;
        this.avater = {
            get self() { return d.x; },
            get x() { return d.x; },
            get r() { return d.x; },
            set self(val) { d.x = val; },
            set x(val) { d.x = val; },
            set r(val) { d.x = val; },
        }
    }
}
/**@name 二维浮点数据项
 * @description 一个二维浮点数
 */
export class MPF2 extends MPBufferDataPrototype {
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
export class MPF3 extends MPBufferDataPrototype {
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
export class MPF4 extends MPBufferDataPrototype {
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
export class MPMatrix extends MPBufferDataPrototype {
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
/**@name 贴图数据项
 * @description 二维贴图，本质上是固定尺寸的数组
 */
export class MPTexture extends MPBufferDataPrototype {
    Resize(width, height) {
        /**尺寸宽度
         * @type {number}
         */
        this._width = width || this._width;
        /**尺寸高度
         * @type {number}
         */
        this._height = height || this._height;
        /**贴图核心数据
         * @type {Uint8ClampedArray}
         */
        this._texData = new Uint8ClampedArray(this._width * this._height * 4);
        this._texData.fill(255);
    }

    get texData() {
        if (!this._texData) {
            this.Resize(this._width, this._height);
        }
        return this._texData;
    }

    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} width
     * @param {number} height
     */
    constructor(name, description, width, height) {
        super(name, description);
        this.Resize(width || 256, height || 256);
        let d = this;
        this.avater = {
            color(x, y, val) {
                switch (arguments.length) {
                    case 1:
                        let t = x.constructor.name;
                        switch (t) {
                            case 'Number':
                                let c = to8Bit(x * 256);
                                for (let i = 0; i < d._texData.length; i += 4) {
                                    d._texData[i] = c;
                                    d._texData[i + 1] = c;
                                    d._texData[i + 2] = c;
                                    d._texData[i + 3] = 255;
                                }
                                return;
                            case 'Vector3':
                                for (let i = 0; i < d._texData.length; i += 4) {
                                    d._texData[i] = to8Bit(x.x);
                                    d._texData[i + 1] = to8Bit(x.y);
                                    d._texData[i + 2] = to8Bit(x.z);
                                    d._texData[i + 3] = 255;
                                }
                                return;
                            case 'Vector4':
                                for (let i = 0; i < d._texData.length; i += 4) {
                                    d._texData[i] = to8Bit(x.x);
                                    d._texData[i + 1] = to8Bit(x.y);
                                    d._texData[i + 2] = to8Bit(x.z);
                                    d._texData[i + 3] = to8Bit(x.w);;
                                }
                                return;
                        }
                        break;
                    case 2:
                    case 3:
                        if (typeof x != 'number' || typeof y != 'number') break;
                        x = x < 0 ? 0 : (x > d._width ? d._width - 1 : Math.floor(x));
                        y = y < 0 ? 0 : (y > d._height ? d._height - 1 : Math.floor(y));
                        let pos = (y * d._width + x) * 4;
                        if (val === undefined) {
                            // 只有两个参数，返回对应的颜色
                            return vec4(
                                d._texData[pos + 0] / 255,
                                d._texData[pos + 1] / 255,
                                d._texData[pos + 2] / 255,
                                d._texData[pos + 3] / 255
                            );
                        }
                        switch (val.constructor.name) {
                            case 'Number':
                                let c = to8Bit(val);
                                d._texData[pos + 0] = c;
                                d._texData[pos + 1] = c;
                                d._texData[pos + 2] = c;
                                d._texData[pos + 3] = c;
                                return;
                            case 'Vector3':
                                d._texData[pos + 0] = to8Bit(val.x);
                                d._texData[pos + 1] = to8Bit(val.y);
                                d._texData[pos + 2] = to8Bit(val.z);
                                d._texData[pos + 3] = 255;
                                return;
                            case 'Vector4':
                                d._texData[pos + 0] = to8Bit(val.x);
                                d._texData[pos + 1] = to8Bit(val.y);
                                d._texData[pos + 2] = to8Bit(val.z);
                                d._texData[pos + 3] = to8Bit(val.w);
                                return;
                        }
                        break;
                }
                throw new Error("color()接收了不支持的参数类型!");
            },
            get width() {
                return d._width;
            },
            set width(val) {
                d._width = val;
                d.Resize();
            },
            get w() {
                return d._width;
            },
            set w(val) {
                d._width = val;
                d.Resize();
            },
            get height() {
                return d._height;
            },
            set height(val) {
                d._height = val;
                d.Resize();
            },
            get h() {
                return d._height;
            },
            set h(val) {
                d._height = val;
                d.Resize();
            },
        }
        this.avater.self = this.avater.color;
    }
}
