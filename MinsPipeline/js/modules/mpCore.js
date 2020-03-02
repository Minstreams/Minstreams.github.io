/**核心数据类型定义
 * 不应该依赖基础库外的任何文件
 */

/**@name MP数据原型
 * @description 所有MP数据对象的父类，定义了公共描述模块
 */
export class MPPrototype {
    /**名称
     * @type {string}
     */
    get name() { return this._name; }
    set name(val) {
        this._name = val;
    }
    /**描述
     * @type {string}
     */
    get description() { return this._description; }
    set description(val) {
        this._description = val;
    }
    /**@param {string} name 名称
     * @param {string} description 描述
     */
    constructor(name, description) {
        if (new.target === MPPrototype) {
            throw new Error("MPDataPr ototype是抽象类！不能有实例！");
        }
        /**名称数据
         * @type {string}
         */
        this._name = name || "Name";
        /**描述数据
         * @type {string}
         */
        this._description = description || "Description";
    }
}
/**@name 管线总数据容器
 * @description 包含了组成一个管线所需的所有数据
 */
export class MPData extends MPPrototype {
    constructor(name, description) {
        super(name || "新管线", description || "这是一个管线");
        /**管线节
         * @type {MPSection[]}
         */
        this.sections = new Array();
        /**主函数入口
         * @type {MPCodeData}
         */
        this.mainCode = new MPCodeData("main", "函数入口");
    }
}
/**@name 管线节
 * @description 包含了一个缓存节和一个代码节
 */
export class MPSection {
    /**@param {string} bufName 缓存节名称
     * @param {string} bufDesc 缓存节描述
     * @param {string} codeName 代码节名称
     * @param {string} codeDesc 代码节描述
     */
    constructor(bufName, bufDesc, codeName, codeDesc) {
        /**缓存节
         * @type {MPBufferSection}
         */
        this.bufferSection = new MPBufferSection(bufName, bufDesc);
        /**代码节
         * @type {MPCodeSection}
         */
        this.codeSection = new MPCodeSection(codeName, codeDesc);
    }
}
/**@name 缓存节
 * @description 包含了若干缓存数据的一个节
 */
export class MPBufferSection extends MPPrototype {
    /**@param {string} name section名称
     * @param {string} description section描述
     */
    constructor(name, description) {
        super(name || "新缓存节点", description || "这是一个缓存节点");
        /**缓存数据项数组
         * @type {MPBufferDataPrototype[]}
         */
        this._dataNodes = new Array();
    }
}
/**@name 缓存数据项父类原型
 * @description 应该是抽象类，包含数据项共有的描述数据
 */
export class MPBufferDataPrototype extends MPPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     */
    constructor(name, description) {
        super(name || "新数据项", description || "这是一个数据项");
        if (new.target === MPBufferDataPrototype) {
            throw new Error("MPBufferDataPrototype是抽象类！不能有实例！");
        }
    }
}
/**@name 代码节
 * @description 保存了若干代码数据的一个节
 */
export class MPCodeSection extends MPPrototype {
    /**@param {string} name section名称
     * @param {string} description section描述
     */
    constructor(name, description) {
        super(name || "新代码节点", description || "这是一个代码节点");
        /**代码数据项数组
         * @type {MPCodeData[]}
         */
        this._codeNodes = new Array();
    }
}
/**@name 代码数据项
 * @description 代码数据项
 */
export class MPCodeData extends MPPrototype {
    /**@param {string} name Code数据项名称
     * @param {string} description Code数据项描述
     * @param {string} codeText Code源代码
     */
    constructor(name, description, codeText) {
        super(name || "newMethod", description || "这是一个方法");
        /**用户编辑的原代码字符串
         * @type {string}
         */
        this._codeText = codeText || "";
    }
}