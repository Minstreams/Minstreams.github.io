/**Array的扩充方法，删除元素。
 * 没有做异常处理，若删除不存在的元素大概会崩溃吧
 * @param {any} element 要删除的元素
 */
Array.prototype.remove = function (element) { this.splice(this.indexOf(element), 1); };


/**各种元素的绑定模板 */
var propertyBindTemplate = {
    text: {
        respondFunc: function (target, propertyName) {
            this.text(target["_" + propertyName]);
        },
        updateFunc: function (target, propertyName) {
            target["_" + propertyName] = this.text().replace(/[\f\n\r\t\v]/g, "").replace(/ +/g, " ");
        },
        updateEvent: "blur remove",
        onBind: function () {
            this
                .on("dblclick", function () { $(this).attr({ contentEditable: 'plaintext-only', spellCheck: false }).focus(); })
                .on("blur", function () { this.removeAttribute("contenteditable"); this.removeAttribute("spellcheck"); })
                .keydown(function (e) {
                    if (e.which == 13) {
                        // 阻止回车事件，从而阻止换行
                        e.preventDefault();
                        this.blur();
                    }
                });
        }
    },
    name: {
        respondFunc: function (target, propertyName) {
            this.text(target["_" + propertyName]);
        },
        updateFunc: function (target, propertyName) {
            target["_" + propertyName] = this.text().replace(/\W/g, "");
        },
        updateEvent: "blur remove",
        onBind: function () {
            this
                .on("dblclick", function () { $(this).attr({ contentEditable: 'plaintext-only', spellCheck: false }).focus(); })
                .on("blur", function () { this.removeAttribute("contenteditable"); this.removeAttribute("spellcheck"); })
                .keydown(function (e) {
                    if (e.which == 13) {
                        // 阻止回车事件，从而阻止换行
                        e.preventDefault();
                        this.blur();
                    }
                    else if (e.which == 32) {
                        // 阻止空格
                        e.preventDefault();
                    }
                });
        }
    },
    code: {
        respondFunc: function (target, propertyName) {
            this.html(target["_" + propertyName]);
        },
        updateFunc: function (target, propertyName) {
            target["_" + propertyName] = this[0].innerHTML;
        },
        updateEvent: "blur remove"
    },
    texture: {
        respondFunc: function (target, propertyName) {
            if (!this.data("c2d")) this.data("c2d", this[0].getContext("2d"));
            let width = target["_width"];
            let height = target["_height"];
            if ((width != this[0].width) || (height != this[0].height)) {
                // resize
                this[0].width = width;
                this[0].height = height;
                this.data("imgData", this.data("c2d").getImageData(0, 0, width, height));
            }
            if (!this.data("imgData")) this.data("imgData", this.data("c2d").getImageData(0, 0, width, height));

            this.data("imgData").data.set(target["_" + propertyName]);
            this.data("c2d").putImageData(this.data("imgData"), 0, 0);
        },
        updateFunc: function (target, propertyName) {
            this.data("imgData", this.data("c2d").getImageData(0, 0, width, height));
            target["_" + propertyName].set(this.data("imgData").data);
        },
        updateEvent: ""
    }
}

$.fn.extend({
    /**将UI元素绑定到一个数据属性上，并响应其广播
     * @param {MPDataPrototype} target 属性所在对象
     * @param {string} propertyName 属性名称
     * @param {string} template 绑定模板名称
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    BindProperty: function (target, propertyName, template) {
        var el = $(this);
        // 查重
        if (el.data("binded")) return el;
        // 查存在
        if (target["BoardcastArray" + propertyName] === undefined) {
            target["BoardcastArray" + propertyName] = new Array();
        }

        // 动态记录
        target["BoardcastArray" + propertyName].push(el);
        el.on("remove", function () { target["BoardcastArray" + propertyName].remove(el); });

        // 读取方法模板
        template = template || "text";
        let temp = propertyBindTemplate[template];

        // 定义响应方法
        el.data("respondFunc", function () { temp.respondFunc.call(el, target, propertyName); return el; })
            // 定义更新方法
            .data("updateFunc", function () { temp.updateFunc.call(el, target, propertyName); target.Boardcast(propertyName); return el; })
            // 标记绑定状态
            .data("binded", true)
            // 初始化数据
            .data("respondFunc")();

        // 绑定更新事件
        if (temp.updateEvent) el.on(temp.updateEvent, function () { el.data("updateFunc")(); })

        // 绑定响应
        if (temp.onBind) temp.onBind.call(el);

        return el;
    },
    /**更新所有绑定的属性
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    UpdateProperty: function () {
        this.each(function () {
            if ($(this).data("updateFunc"))
                $(this).data("updateFunc")();
        })
        return this;
    },
    /**主动获取属性数据，更新自身
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    RespondProperty: function () {
        this.each(function () {
            if ($(this).data("respondFunc"))
                $(this).data("respondFunc")();
        })
        return this;
    },
    /**检查是否所有元素都符合条件
     * @return {boolean} 结果
     */
    every: function (checkFunc) {
        let result = true;
        this.each(function () {
            if (!checkFunc.call(this)) result = false;
        });
        return result;
    }
});



/**@name 管线总数据容器
 * @description 包含了组成一个管线所需的所有数据
 */
class MPData {
    /**缓存Sections
     * @type {BufferSection[]}
     */
    bufferSections;
    constructor() {
        this.bufferSections = new Array();
    }
}

/**@name MP数据原型
 * @description 所有MP数据对象的父类，定义了公共描述模块
 */
class MPDataPrototype {
    /**广播一个属性，在对象内调用
     * @param {string} propertyName 属性名字
     */
    Boardcast(propertyName) {
        if (this["BoardcastArray" + propertyName] === undefined) return;
        this["BoardcastArray" + propertyName].forEach((el) => { el.data("respondFunc")(); });
    }
    /**名称数据
     * @type {string}
     */
    _name;
    /**名称
     * @type {string}
     */
    get name() { return this._name; }
    set name(val) {
        this._name = val;
        this.Boardcast("name");
    }

    /**描述数据
     * @type {string}
     */
    _description;
    /**描述
     * @type {string}
     */
    get description() { return this._description; }
    set description(val) {
        this._description = val;
        this.Boardcast("description");
    }

    /**@param {string} name 名称
     * @param {string} description 描述
     */
    constructor(name, description) {
        if (new.target === MPDataPrototype) {
            throw new Error("MPDataPrototype是抽象类！不能有实例！");
        }
        this._name = name || "名称";
        this._description = description || "描述";
    }
}

//#region 缓存相关
/**@name 缓存section
 * @description 包含了若干缓存数据的一个节点
 */
class BufferSection extends MPDataPrototype {
    /**缓存数据项数组
     * @type {BufferDataPrototype[]}
     */
    _dataNodes;

    /**@param {string} name section名称
     * @param {string} description section描述
     * @param {BufferDataPrototype[]} dataNodes 缓存数据项数组
     */
    constructor(name, description, dataNodes) {
        super(name, description);
        this._dataNodes = dataNodes || new Array();
    }

    /**用于初始化缓存Section的UI界面
     * @method 加载UI
     * @param {JQuery<HTMLDivElement>} bufferDiv UI界面区块
     */
    LoadUI(bufferDiv) {
        bufferDiv.append($("<h2></h2>").BindProperty(this, "name"));
        bufferDiv.append($("<p></p>").BindProperty(this, "description"));
        this._dataNodes.forEach(dataNode => {
            var contentDiv = $("<div></div>");
            bufferDiv.append(contentDiv);
            dataNode.LoadUI(contentDiv);
        });
    }
}

/**@name 缓存数据项父类原型
 * @description 应该是抽象类，包含数据项共有的描述数据
 */
class BufferDataPrototype extends MPDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     */
    constructor(name, description) {
        super(name, description);
        if (new.target === BufferDataPrototype) {
            throw new Error("BufferDataPrototype是抽象类！不能有实例！");
        }
    }

    LoadUI(contentDiv) {
        contentDiv.addClass("contentDiv " + this.constructor.name)
        contentDiv.append($("<h3></h3>").BindProperty(this, "name", "name"));
        contentDiv.append($("<p></p>").BindProperty(this, "description"));
    }
}

/**@name 一维浮点数据项
 * @description 一个一维浮点数
 */
class BufferDataF1 extends BufferDataPrototype {
    /**@type {number}
     */
    _x;
    get x() {
        return this._x;
    }
    set x(val) {
        this._x = val;
        this.Boardcast("x");
    }

    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} x x
     */
    constructor(name, description, x) {
        super(name, description);
        this._x = x || 0;
    }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, "x"));
    }
}

/**@name 贴图数据项
 * @description 一维，二维，三维等长度的贴图，本质上是固定尺寸的数组
 */
class BufferDataTexture extends BufferDataPrototype {
    /**贴图核心数据
     * @type {Uint8ClampedArray}
     */
    _texData;
    /**尺寸宽度
     * @type {number}
     */
    _width = 256;
    /**尺寸高度
     * @type {number}
     */
    _height = 256;

    Resize(width, height) {
        this._width = width || this._width;
        this._height = height || this._height;
        this._texData = new Uint8ClampedArray(this._width * this._height * 4);
        this._texData.fill(255);
        this.Boardcast("texData");
    }

    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} width
     * @param {number} height
     */
    constructor(name, description, width, height) {
        super(name, description);
        this.Resize(width, height);
    }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<canvas></canvas>").BindProperty(this, "texData", "texture"));
    }
}
//#endregion

//#region 代码相关
/**@name 代码section
 * @description 保存了若干代码数据的一个节点
 */
class CodeSection extends MPDataPrototype {
    /**代码数据项数组
     * @type {CodeDataPrototype[]}
     */
    _codeNodes;

    /**@param {string} name section名称
     * @param {string} description section描述
     * @param {CodeDataPrototype[]} codeNodes 代码数据项数组
     */
    constructor(name, description, codeNodes) {
        super(name, description);
        this._codeNodes = codeNodes || new Array();
    }
}

/**@name 代码数据项父类原型
 * @description 应该是抽象类，包含代码数据项共有的描述数据，以及一些上下文信息
 */
class CodeDataPrototype extends MPDataPrototype {
    /**@type {string}
 */
    _codeText;
    /**用户编辑的原代码字符串 */
    get codeText() { return this._codeText; }
    set codeText(val) {
        this._codeText = val;
        this.Boardcast("codeText");
    }


    /**@param {string} name Code数据项名称
     * @param {string} description Code数据项描述
     * @param {string} codeText Code源代码
     */
    constructor(name, description, codeText) {
        super(name, description);
        this._codeText = codeText || "";
    }

    /**处理后的完整JS代码 */
    get codeJS() {
        var _codeJS = this._codeText.replace(/&lt\u003b/g, "<");
        return _codeJS;
    }
}

/**@name JavaScript数据项
 * @description 这个数据项需要的转换最简单
 */
class CodeDataJavaScript extends CodeDataPrototype {


}

//#endregion