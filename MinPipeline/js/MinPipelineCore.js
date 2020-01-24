function isNumber(obj) {
    let res = typeof obj;
    return res == "number";
}

var _stopMark = false;
function StopFrame() {
    _stopMark = true;
}
function nextFrame(fName) {
    $('canvas').RespondProperty();
    if (_stopMark) {
        return;
    }
    requestAnimationFrame(fName);
}

/**Array的扩充方法，删除元素。
 * 没有做异常处理，若删除不存在的元素大概会崩溃吧
 * @param {any} element 要删除的元素
 * @return 此元素
 */
Array.prototype.remove = function (element) {
    if (!this.includes(element)) {
        return null;
    }
    return this.splice(this.indexOf(element), 1)[0];
};

/**阻止事件冒泡传播
 * @param {Event} e 事件变量
 */
function stopBubbling(e) {
    e = window.event || e;
    if (e.stopPropagation) {
        e.stopPropagation();      //阻止事件 冒泡传播
    } else {
        e.cancelBubble = true;   //ie兼容
    }
}

/**获取rul参数 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}


/**各种元素的绑定模板 */
var propertyBindTemplate = {
    text: {
        respondFunc: function (target, propertyName) {
            this.text(target["_" + propertyName]);
        },
        updateFunc: function (target, propertyName) {
            if (!this.text()) return;
            target["_" + propertyName] = this.text().replace(/[\f\n\r\t\v]/g, "").replace(/ +/g, " ");
        },
        updateEvent: "blur remove",
        onBind: function () {
            this.on("dblclick", function () { $(this).attr({ contentEditable: 'plaintext-only', spellCheck: false }).focus(); })
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
    number: {
        respondFunc: function (target, propertyName) {
            this.text(target["_" + propertyName].toFixed(4));
        },
        updateFunc: function (target, propertyName) {
            if (!this.text()) return;
            target["_" + propertyName] = new Number(this.text().replace(/[^0-9.-]/g, ""));
        },
        updateEvent: "blur remove",
        onBind: function () {
            this.on("dblclick", function () { $(this).attr({ contentEditable: 'plaintext-only', spellCheck: false }).focus(); })
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
    display: {
        respondFunc: function (target, propertyName) {
            this.text(target["_" + propertyName]);
        },
        updateFunc: function (target, propertyName) { },
        onBind: function () {
            this.disableSelection();
        }
    },
    name: {
        respondFunc: function (target, propertyName) {
            this.text(target["_" + propertyName]);
        },
        updateFunc: function (target, propertyName) {
            if (!this.text()) return;
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
            console.log("code doesn't need to respond!");
        },
        updateFunc: function (target, propertyName) {
            target["_" + propertyName] = this.data("mirror").getValue();
        },
        updateEvent: "blur remove",
        onBind: function (target, propertyName) {
            var cmr = CodeMirror(this[0], {
                value: target["_" + propertyName],
                lineNumbers: true,
                mode: "javascript",
                theme: "codewarm",
            });
            //$(cmr.getGutterElement)
            this.data("mirror", cmr);
            cmr.refresh();
        }
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

            this.data("imgData").data.set(target[propertyName]);
            this.data("c2d").putImageData(this.data("imgData"), 0, 0);
        },
        updateFunc: function (target, propertyName) {
            this.data("imgData", this.data("c2d").getImageData(0, 0, width, height));
            target["_" + propertyName].set(this.data("imgData").data);
        }
    }
};

$.fn.extend({
    /**将UI元素绑定到一个数据属性上，并响应其广播
     * @param {MPPrototype} target 属性所在对象
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

        // 记录属性
        el.addClass(propertyName);

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
    /**检查是否所有元素都符合条件
     * @return {boolean} 结果
     */
    every: function (checkFunc) {
        let result = true;
        this.each(function (index) {
            if (!checkFunc.call(this, index)) result = false;
        });
        return result;
    }
});

/**@name MP数据原型
 * @description 所有MP数据对象的父类，定义了公共描述模块
 */
class MPPrototype {
    /**广播一个属性，在对象内调用
     * @param {string} propertyName 属性名字
     */
    Boardcast(propertyName) {
        if (this["BoardcastArray" + propertyName] === undefined) return;
        this["BoardcastArray" + propertyName].forEach((el) => { el.data("respondFunc")(); });
    }

    /**名称
     * @type {string}
     */
    get name() { return this._name; }
    set name(val) {
        this._name = val;
        this.Boardcast("name");
    }

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
        if (new.target === MPPrototype) {
            throw new Error("MPDataPrototype是抽象类！不能有实例！");
        }
        /**名称数据
         * @type {string}
         */
        this._name = name || "Name";
        /**描述数据
         * @type {string}
         */
        this._description = description || "描述";
    }
}

/**@name 管线总数据容器
 * @description 包含了组成一个管线所需的所有数据
 */
class MPData extends MPPrototype {
    constructor(name, description) {
        super(name, description);
        /**缓存Sections
         * @type {BufferSection[]}
         */
        this.bufferSections = new Array();
        /**主函数入口
         * @type {CodeDataPrototype}
         */
        this.mainCodeData = new CodeDataJavaScript("main", "函数入口");
    }

    /**处理所有的Section的代码并整合 
     * @return {string} 整合后的JS代码
     */
    codeToJs(mpDataName) {
        let code = "";
        for (let si = 0; si < this.bufferSections.length; si++) {
            let cs = this.bufferSections[si]._codeSection;
            for (let ci = 0; ci < cs._codeNodes.length; ci++) {
                let cn = cs._codeNodes[ci];
                let cc = "function " + cn._name + "(){\n" + cn._codeText + "\n}";
                let dn = this.bufferSections[si]._dataNodes;
                for (let di = 0; di < dn.length; di++) {
                    let avater = mpDataName + ".bufferSections[" + si + "]._dataNodes[" + di + "].avater.";
                    cc = cc.replace(new RegExp('([^._#@\$]?)\\b' + dn[di]._name + '\\b\.', "g"), "$1" + avater);
                    cc = cc.replace(new RegExp('([^._#@\$]?)\\b' + dn[di]._name + '\\b', "g"), "$1" + avater + "self");
                }
                if (si + 1 < this.bufferSections.length) {
                    let dnf = this.bufferSections[si + 1]._dataNodes;
                    for (let di = 0; di < dnf.length; di++) {
                        let avater = mpDataName + ".bufferSections[" + (si + 1) + "]._dataNodes[" + di + "].avater.";
                        cc = cc
                            .replace(new RegExp('([^._#@\$]?)\\b' + dnf[di]._name + '\\b\.', "g"), "$1" + avater)
                            .replace(new RegExp('([^._#@\$]?)\\b' + dnf[di]._name + '\\b', "g"), "$1" + avater + "self");
                    }
                }
                code += cc;
            }
        }
        code += this.mainCodeData._codeText;
        return code;
    }
}



//#region 代码相关
/**@name 代码section
 * @description 保存了若干代码数据的一个节点
 */
class CodeSection extends MPPrototype {
    /**@param {string} name section名称
     * @param {string} description section描述
     * @param {CodeDataPrototype[]} codeNodes 代码数据项数组
     */
    constructor(name, description, codeNodes) {
        super(name, description);
        /**代码数据项数组
         * @type {CodeDataPrototype[]}
         */
        this._codeNodes = codeNodes || new Array();
    }
}

/**@name 代码数据项父类原型
 * @description 应该是抽象类，包含代码数据项共有的描述数据，以及一些上下文信息
 */
class CodeDataPrototype extends MPPrototype {
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
        /**@type {string}
         */
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

//#region 缓存相关
/**@name 缓存section
 * @description 包含了若干缓存数据的一个节点
 */
class BufferSection extends MPPrototype {
    /**@param {string} name section名称
     * @param {string} description section描述
     * @param {BufferDataPrototype[]} dataNodes 缓存数据项数组
     */
    constructor(name, description, dataNodes) {
        super(name, description);
        /**缓存数据项数组
         * @type {BufferDataPrototype[]}
         */
        this._dataNodes = dataNodes || new Array();
        /**@type {CodeSection}
         */
        this._codeSection = new CodeSection("new", "new", [new CodeDataJavaScript()]);
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
class BufferDataPrototype extends MPPrototype {
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
        this.avater ={
            get self(){
                return this._x;
            },
            set self(val) {
                this._x = val;
                this.Boardcast("x");
            },
            get x(){
                return this._x;
            },
            set x(val) {
                this._x = val;
                this.Boardcast("x");
            },
            get r(){
                return this._x;
            },
            set r(val) {
                this._x = val;
                this.Boardcast("x");
            },
        }
    }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, "x", "number"));
    }
}

/**@name 二维浮点数据项
 * @description 一个二维浮点数
 */
class BufferDataF2 extends BufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} x x
     * @param {number} y y
     */
    constructor(name, description, x, y) {
        super(name, description);
        /**@type {number}
         */
        this._x = x || this._x || 0;
        /**@type {number}
         */
        this._y = y || this._y || 0;
        let d = this;
        this.avater = {
            get x() {
                return d._x;
            },
            set x(val) {
                d._x = val;
                d.Boardcast("x");
            },
            get y() {
                return d._y;
            },
            set y(val) {
                d._y = val;
                d.Boardcast("y");
            },
            get xy() {
                return [d._x, d._y];
            },
            set xy(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("y");
            },
            get self() {
                return [d._x, d._y];
            },
            set self(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("y");
            },
        }
    }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, "x", "number"));
        contentDiv.append($("<div></div>").BindProperty(this, "y", "number"));
    }
}

/**@name 三维浮点数据项
 * @description 一个三维浮点数
 */
class BufferDataF3 extends BufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} x x
     * @param {number} y y
     * @param {number} z z
     */
    constructor(name, description, x, y, z) {
        super(name, description);
        /**@type {number}
         */
        this._x = x || this._x || 0;
        /**@type {number}
         */
        this._y = y || this._y || 0;
        /**@type {number}
         */
        this._z = z || this._z || 0;
        let d = this;
        this.avater = {
            get x() {
                return d._x;
            },
            set x(val) {
                d._x = val;
                d.Boardcast("x");
            },
            get r() {
                return d._x;
            },
            set r(val) {
                d._x = val;
                d.Boardcast("x");
            },
            get y() {
                return d._y;
            },
            set y(val) {
                d._y = val;
                d.Boardcast("y");
            },
            get g() {
                return d._y;
            },
            set g(val) {
                d._y = val;
                d.Boardcast("y");
            },
            get z() {
                return d._z;
            },
            set z(val) {
                d._z = val;
                d.Boardcast("z");
            },
            get b() {
                return d._z;
            },
            set b(val) {
                d._z = val;
                d.Boardcast("z");
            },
            get xy() {
                return [d._x, d._y];
            },
            set xy(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("y");
            },
            get rb() {
                return [d._x, d._y];
            },
            set rb(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("y");
            },
            get xz() {
                return [d._x, d._z];
            },
            set xz(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._z = val;
                }
                else {
                    d._x = val[0];
                    d._z = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("z");
            },
            get rb() {
                return [d._x, d._z];
            },
            set rb(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._z = val;
                }
                else {
                    d._x = val[0];
                    d._z = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("z");
            },
            get yz() {
                return [d._y, d._z];
            },
            set yz(val) {
                if (isNumber(val)) {
                    d._y = val;
                    d._z = val;
                }
                else {
                    d._y = val[0];
                    d._z = val[1];
                }
                d.Boardcast("y");
                d.Boardcast("z");
            },
            get gb() {
                return [d._y, d._z];
            },
            set gb(val) {
                if (isNumber(val)) {
                    d._y = val;
                    d._z = val;
                }
                else {
                    d._y = val[0];
                    d._z = val[1];
                }
                d.Boardcast("y");
                d.Boardcast("z");
            },
            get xyz() {
                return [d._x, d._y, d._z];
            },
            set xyz(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                    d._z = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                    d._z = val[2];
                }
                d.Boardcast("x");
                d.Boardcast("y");
                d.Boardcast("z");
            },
            get rgb() {
                return [d._x, d._y, d._z];
            },
            set rgb(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                    d._z = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                    d._z = val[2];
                }
                d.Boardcast("x");
                d.Boardcast("y");
                d.Boardcast("z");
            },
            get self() {
                return [d._x, d._y, d._z];
            },
            set self(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                    d._z = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                    d._z = val[2];
                }
                d.Boardcast("x");
                d.Boardcast("y");
                d.Boardcast("z");
            },
        }
    }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, "x", "number"));
        contentDiv.append($("<div></div>").BindProperty(this, "y", "number"));
        contentDiv.append($("<div></div>").BindProperty(this, "z", "number"));
    }
}

/**@name 四维浮点数据项
 * @description 一个四维浮点数
 */
class BufferDataF4 extends BufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {number} x x
     * @param {number} y y
     * @param {number} z z
     * @param {number} w w
     */
    constructor(name, description, x, y, z, w) {
        super(name, description);
        /**@type {number}
         */
        this._x = x || this._x || 0;
        /**@type {number}
         */
        this._y = y || this._y || 0;
        /**@type {number}
         */
        this._z = z || this._z || 0;
        /**@type {number}
         */
        this._w = w || this._w || 0;
        let d = this;
        this.avater = {
            get x() {
                return d._x;
            },
            set x(val) {
                d._x = val;
                d.Boardcast("x");
            },
            get r() {
                return d._x;
            },
            set r(val) {
                d._x = val;
                d.Boardcast("x");
            },
            get y() {
                return d._y;
            },
            set y(val) {
                d._y = val;
                d.Boardcast("y");
            },
            get g() {
                return d._y;
            },
            set g(val) {
                d._y = val;
                d.Boardcast("y");
            },
            get z() {
                return d._z;
            },
            set z(val) {
                d._z = val;
                d.Boardcast("z");
            },
            get b() {
                return d._z;
            },
            set b(val) {
                d._z = val;
                d.Boardcast("z");
            },
            get w() {
                return d._w;
            },
            set w(val) {
                d._w = val;
                d.Boardcast("w");
            },
            get a() {
                return d._w;
            },
            set a(val) {
                d._w = val;
                d.Boardcast("w");
            },
            get xy() {
                return [d._x, d._y];
            },
            set xy(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("y");
            },
            get rb() {
                return [d._x, d._y];
            },
            set rb(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("y");
            },
            get xz() {
                return [d._x, d._z];
            },
            set xz(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._z = val;
                }
                else {
                    d._x = val[0];
                    d._z = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("z");
            },
            get rb() {
                return [d._x, d._z];
            },
            set rb(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._z = val;
                }
                else {
                    d._x = val[0];
                    d._z = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("z");
            },
            get yz() {
                return [d._y, d._z];
            },
            set yz(val) {
                if (isNumber(val)) {
                    d._y = val;
                    d._z = val;
                }
                else {
                    d._y = val[0];
                    d._z = val[1];
                }
                d.Boardcast("y");
                d.Boardcast("z");
            },
            get gb() {
                return [d._y, d._z];
            },
            set gb(val) {
                if (isNumber(val)) {
                    d._y = val;
                    d._z = val;
                }
                else {
                    d._y = val[0];
                    d._z = val[1];
                }
                d.Boardcast("y");
                d.Boardcast("z");
            },
            get xw() {
                return [d._x, d._w];
            },
            set xw(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._w = val;
                }
                else {
                    d._x = val[0];
                    d._w = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("w");
            },
            get ra() {
                return [d._x, d._w];
            },
            set ra(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._w = val;
                }
                else {
                    d._x = val[0];
                    d._w = val[1];
                }
                d.Boardcast("x");
                d.Boardcast("w");
            },
            get yw() {
                return [d._y, d._w];
            },
            set yw(val) {
                if (isNumber(val)) {
                    d._y = val;
                    d._w = val;
                }
                else {
                    d._y = val[0];
                    d._w = val[1];
                }
                d.Boardcast("y");
                d.Boardcast("w");
            },
            get ga() {
                return [d._y, d._w];
            },
            set ga(val) {
                if (isNumber(val)) {
                    d._y = val;
                    d._w = val;
                }
                else {
                    d._y = val[0];
                    d._w = val[1];
                }
                d.Boardcast("y");
                d.Boardcast("w");
            },
            get zw() {
                return [d._z, d._w];
            },
            set zw(val) {
                if (isNumber(val)) {
                    d._z = val;
                    d._w = val;
                }
                else {
                    d._z = val[0];
                    d._w = val[1];
                }
                d.Boardcast("z");
                d.Boardcast("w");
            },
            get ba() {
                return [d._z, d._w];
            },
            set ba(val) {
                if (isNumber(val)) {
                    d._z = val;
                    d._w = val;
                }
                else {
                    d._z = val[0];
                    d._w = val[1];
                }
                d.Boardcast("z");
                d.Boardcast("w");
            },
            get xyz() {
                return [d._x, d._y, d._z];
            },
            set xyz(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                    d._z = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                    d._z = val[2];
                }
                d.Boardcast("x");
                d.Boardcast("y");
                d.Boardcast("z");
            },
            get rgb() {
                return [d._x, d._y, d._z];
            },
            set rgb(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                    d._z = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                    d._z = val[2];
                }
                d.Boardcast("x");
                d.Boardcast("y");
                d.Boardcast("z");
            },
            get xyzw() {
                return [d._x, d._y, d._z, d._w];
            },
            set xyzw(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                    d._z = val;
                    d._w = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                    d._z = val[2];
                    d._w = val[3];
                }
                d.Boardcast("x");
                d.Boardcast("y");
                d.Boardcast("z");
                d.Boardcast("w");
            },
            get rgba() {
                return [d._x, d._y, d._z, d._w];
            },
            set rgba(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                    d._z = val;
                    d._w = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                    d._z = val[2];
                    d._w = val[3];
                }
                d.Boardcast("x");
                d.Boardcast("y");
                d.Boardcast("z");
                d.Boardcast("w");
            },
            get self() {
                return [d._x, d._y, d._z, d._w];
            },
            set self(val) {
                if (isNumber(val)) {
                    d._x = val;
                    d._y = val;
                    d._z = val;
                    d._w = val;
                }
                else {
                    d._x = val[0];
                    d._y = val[1];
                    d._z = val[2];
                    d._w = val[3];
                }
                d.Boardcast("x");
                d.Boardcast("y");
                d.Boardcast("z");
                d.Boardcast("w");
            },
        }
    }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, "x", "number"));
        contentDiv.append($("<div></div>").BindProperty(this, "y", "number"));
        contentDiv.append($("<div></div>").BindProperty(this, "z", "number"));
        contentDiv.append($("<div></div>").BindProperty(this, "w", "number"));
    }
}

/**@name 贴图数据项
 * @description 一维，二维，三维等长度的贴图，本质上是固定尺寸的数组
 */
class BufferDataTexture extends BufferDataPrototype {
    Resize(width, height) {
        /**尺寸宽度
         * @type {number}
         */
        this._width = width || 256;
        /**尺寸高度
         * @type {number}
         */
        this._height = height || 256;
        /**贴图核心数据
         * @type {Uint8ClampedArray}
         */
        this._texData = new Uint8ClampedArray(this._width * this._height * 4);
        this._texData.fill(255);
        this.Boardcast("texData");
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
        this.Resize(width, height);
        let d = this;
        this.avater = {
            color(x, y, val) {
                if (x < 0) x = 0;
                if (x >= d._width) x = d._width - 1;
                if (y < 0) y = 0;
                if (y >= d._height) y = d._height - 1;
                if (y === undefined) {
                    if (isNumber(x)) {
                        for (let i = 0; i < d._texData.length; i += 4) {
                            d._texData[i] = Math.floor(x * 256);
                            d._texData[i + 1] = Math.floor(x * 256);
                            d._texData[i + 2] = Math.floor(x * 256);
                            d._texData[i + 3] = 255;
                        }
                    }
                    else {
                        for (let i = 0; i < d._texData.length; i += 4) {
                            d._texData[i] = Math.floor(x[0] * 256);
                            d._texData[i + 1] = Math.floor(x[1] * 256);
                            d._texData[i + 2] = Math.floor(x[2] * 256);
                            d._texData[i + 3] = Math.floor(x[3] * 256);
                        }
                    }
                }
                else if (val === undefined) {
                    if (x <= 1 && y <= 1) {
                        x = Math.floor(x * d._width);
                        y = Math.floor(y * d._height);
                    }
                    let pos = (y * d._width + x) * 4;
                    return [d._texData[pos + 0] / 255, d._texData[pos + 1] / 255, d._texData[pos + 2] / 255, d._texData[pos + 3] / 255];
                }
                else {
                    if (x <= 1 && y <= 1) {
                        x = Math.floor(x * d._width);
                        y = Math.floor(y * d._height);
                    }
                    let pos = (y * d._width + x) * 4;

                    if (isNumber(val)) {
                        d._texData[pos] = Math.floor(val * 256);
                        d._texData[pos + 1] = Math.floor(val * 256);
                        d._texData[pos + 2] = Math.floor(val * 256);
                        d._texData[pos + 3] = Math.floor(val * 256);
                    }
                    else {
                        d._texData[pos] = Math.floor(val[0] * 256);
                        d._texData[pos + 1] = Math.floor(val[1] * 256);
                        d._texData[pos + 2] = Math.floor(val[2] * 256);
                        d._texData[pos + 3] = Math.floor(val[3] * 256);
                    }
                }
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

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<canvas></canvas>").BindProperty(this, "texData", "texture"));
    }
}
//#endregion


/**MP对象专用序列化方法 */
var MPJSON = {
    /**记录构造函数 */
    _parseContructors: {
        "MPData": MPData.constructor,
        "CodeSection": CodeSection.constructor,
        "CodeDataJavaScript": CodeDataJavaScript.constructor,
        "BufferSection": BufferSection.constructor,
        "BufferDataF1": BufferDataF1.constructor,
        "BufferDataTexture": BufferDataTexture.constructor,
    },
    /**将MP对象转化为json字符串
     * @param {MPPrototype} obj MP对象
     * @return {string} json字符串
     */
    stringify: function (obj) {
        // return JSON.stringify(obj, function (key, value) {
        //     if (key.match(/^(?:Boardcast|_texData)/)) return;
        //     if (key === "_name") value = this.constructor.name + "|" + value;
        //     console.log("key:" + key + (value ? "|" + value.constructor.name : "") + "|" + value + this);
        //     return value;
        // });
        let result = "";
        function serializeInternal(o, path) {
            for (key in o) {
                var value = o[key];
                if (key.match(/(?:^Boardcast|avater|remove)/)) {
                    // 此为排除条件
                    continue;
                }
                if (typeof value != "object") {
                    if (typeof value == "string") {
                        result += "\n" + path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "] = " + "\"" + value.replace(/\"/g, "\\\"").replace(/[\n\r]/g, "\\n") + "\"" + ";";
                    } else {
                        result += "\n" + path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "] = " + value + ";";
                    }
                }
                else if (key == "_texData") {
                    result += "\n" + path + ".Resize();";
                }
                else {
                    if (value instanceof Array) {
                        result += "\n" + path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "]" + "=" + "new Array();";
                        serializeInternal(value, path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "]");
                    } else {
                        result += "\n" + path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "]" + "=" + "new " + value.constructor.name + "();";
                        serializeInternal(value, path + "[" + (isNaN(key) ? "\"" + key + "\"" : key) + "]");
                    }
                }
            }
        }
        serializeInternal(obj, "#mpObject");
        return result;
    },
    /**将json字符串转化为MP对象
     * @param {string} str json字符串
     * @return {MPPrototype} MP对象
     */
    parse: function (obj, str, name) {
        if (!str) return;
        // let objArray = new Array();
        // let pcon = this._parseContructors;
        // return JSON.parse(str, function (key, value) {
        //     if (!objArray.includes(this)) {
        //         objArray.push(this);
        //         if (this._name) {
        //             let reg = /^(.*)\|(.*)$/;
        //             this._name = this._name.replace(reg, '$2');
        //             pcon[RegExp.$1].call(this);
        //         }
        //     }
        //     if (key === "_name") {
        //         console.log(value);
        //     }
        //     return value;
        // });
        str = str.replace(/#mpObject/g, name);
        eval(str);
    }
}