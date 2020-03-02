/**MinPipeline的基础结构 */


/**所有getFunc的集合 */
var getFunctions = {
    simpleGet: function (target, propertyName) {
        return target[propertyName];
    },
    avaterGet: function (target, propertyName) {
        return target.avater["_" + propertyName];
    },
}

/**所有respondFunc的集合
 * @respondFunc 是数据改变时元素的响应方法
 */
var respondFunctions = {
    /**简单输出为text */
    text: function (val) {
        this.text(val);
    },
    /**保留小数点4位 */
    fixed4: function (val) {
        this.text(val.toFixed(4));
    },
};

/**所有updateFunc的集合
 * @updateFunc 是通过元素更新数据的方法
 */
var updateFunctions = {
    /**不能为空，去掉特殊字符，去掉连续空格 */
    normalText: function (target, propertyName) {
        if (!this.text()) return;
        target["_" + propertyName] = this.text().replace(/[\f\n\r\t\v]/g, "").replace(/ +/g, " ");
    },
    /**限定为数字 */
    number: function (target, propertyName) {
        if (!this.text()) return;
        target["_" + propertyName] = new Number(this.text().replace(/[^0-9.-]/g, ""));
    },
    /**限定为嵌套数据数字 */
    avaterNumber: function (target, propertyName) {
        if (!this.text()) return;
        target.avater["_" + propertyName] = new Number(this.text().replace(/[^0-9.-]/g, ""));
    },
    /**不更新数据 */
    diabled: function (target, propertyName) { },
    /**去除所有空格 */
    noSpace: function (target, propertyName) {
        if (!this.text()) return;
        target["_" + propertyName] = this.text().replace(/\W/g, "");
    },
};

/**所有OnBind方法的集合 
 * @onBind 是绑定时额外调用的函数，用于添加特定功能
 */
var onBindFunctions = {
    /**双击可编辑 */
    dbClickToEdit: function () {
        this.on("dblclick", function () { $(this).attr({ contentEditable: 'plaintext-only', spellCheck: false }).focus(); })
            .on("blur", function () { this.removeAttribute("contenteditable"); this.removeAttribute("spellcheck"); })
            .keydown(function (e) {
                if (e.which == 13) {
                    // 阻止回车事件，从而阻止换行
                    e.preventDefault();
                    this.blur();
                }
            });
    },
    /**双击可编辑，屏蔽空格 */
    dbClickToEditNoSpace: function () {
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
    },
    /**禁止选择 */
    disableSelection: function () {
        this.disableSelection();
    },
};

/**各种元素的绑定模板
 * @respondFunc 是数据改变时元素的响应方法
 * @updateFunc 是通过元素更新数据的方法
 * @updateEvent 是元素更新数据的事件表列
 * @onBind 是绑定时额外调用的函数，用于添加特定功能
 */
var propertyBindTemplate = {
    /**描述性文字元素 */
    text: {
        getFunc: getFunctions.simpleGet,
        respondFunc: respondFunctions.text,
        updateFunc: updateFunctions.normalText,
        updateEvent: "blur remove",
        onBind: onBindFunctions.dbClickToEdit,
    },
    /**数字元素 */
    number: {
        getFunc: getFunctions.simpleGet,
        respondFunc: respondFunctions.fixed4,
        updateFunc: updateFunctions.number,
        updateEvent: "blur remove",
        onBind: onBindFunctions.dbClickToEdit,
    },
    /**嵌套数字 */
    avaterNumber: {
        getFunc: getFunctions.avaterGet,
        respondFunc: respondFunctions.fixed4,
        updateFunc: updateFunctions.avaterNumber,
        updateEvent: "blur remove",
        onBind: onBindFunctions.dbClickToEdit,
    },
    /**只读数字 */
    displayNumber: {
        getFunc: getFunctions.simpleGet,
        respondFunc: respondFunctions.fixed4,
        updateFunc: updateFunctions.diabled,
        onBind: onBindFunctions.disableSelection,
    },
    /**只读元素 */
    display: {
        getFunc: getFunctions.simpleGet,
        respondFunc: respondFunctions.text,
        updateFunc: updateFunctions.diabled,
        onBind: onBindFunctions.disableSelection,
    },
    /**嵌套数据只读数字 */
    avaterDisplayNumber: {
        getFunc: getFunctions.avaterGet,
        respondFunc: respondFunctions.fixed4,
        updateFunc: updateFunctions.diabled,
        onBind: onBindFunctions.disableSelection,
    },
    /**名称 */
    name: {
        getFunc: getFunctions.simpleGet,
        respondFunc: respondFunctions.text,
        updateFunc: updateFunctions.noSpace,
        updateEvent: "blur remove",
        onBind: onBindFunctions.dbClickToEditNoSpace,
    },
    code: {
        getFunc: nullFunc,
        respondFunc: function (target, propertyName) {
            console.log("code doesn't need to respond!");
        },
        updateFunc: function (target, propertyName) {
            target["_" + propertyName] = $('<div>').text(this.data("mirror").getValue()).html();
        },
        updateEvent: "blur remove",
        onBind: function (target, propertyName) {
            var cmr = CodeMirror(this[0], {
                value: $('<div>').html(target["_" + propertyName]).text(),
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
        getFunc: function (target, propertyName) {
            return { target, propertyName };
        },
        respondFunc: function (val) {
            let target = val.target,
                propertyName = val.propertyName;
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
        var el = this;
        // 查重
        if (el.data("binded")) return el;
        // 读取方法模板
        let temp = propertyBindTemplate[template || "readonly"];
        // 查存在
        if (target["BoardcastArray" + propertyName] === undefined) {
            target["BoardcastArray" + propertyName] = $();
            target["BoardcastLastFrame" + propertyName] = -1;
            target["BoardcastLastValue" + propertyName] = temp.getFunc(target, propertyName);
            target["BoardcastChanged" + propertyName] = function () {
                let t = temp.getFunc(target, propertyName);
                if (target["BoardcastLastValue" + propertyName] !== t) {
                    target["BoardcastLastValue" + propertyName] = t;
                    return true;
                }
                return false;
            };

        }

        // 动态记录
        target["BoardcastArray" + propertyName] = target["BoardcastArray" + propertyName].add($(el));
        el.on("remove", function () { target["BoardcastArray" + propertyName] = target["BoardcastArray" + propertyName].not(el); });

        // 记录属性
        el.addClass(propertyName);

        // 定义响应方法
        el.data("respondFunc", function () { temp.respondFunc.call(el, temp.getFunc(target, propertyName)); return el; })
            // 定义更新方法
            .data("updateFunc", function () { temp.updateFunc.call(el, target, propertyName); target.Boardcast(propertyName); return el; })
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
});

var respondElements;
respondElements = $();
var _curFrame;
_curFrame = 0;
/**每帧调用一次，更新所有注册的元素显示数据 */
function RespondEverything() {
    _curFrame++;
    respondElements.RespondProperty();
    respondElements = $();
}


/**@name MP数据原型
 * @description 所有MP数据对象的父类，定义了公共描述模块
 */
class MPPrototype {
    /**广播一个属性，在对象内调用
     * @param {string} propertyName 属性名字
     */
    Boardcast(propertyName) {
        if (!this.display || this["BoardcastArray" + propertyName] === undefined || this["BoardcastLastFrame" + propertyName] == _curFrame || !this["BoardcastChanged" + propertyName]()) return;
        this["BoardcastLastFrame" + propertyName] = _curFrame;
        // this["BoardcastArray" + propertyName].forEach((el) => { el.data("respondFunc")(); });
        respondElements = respondElements.add(this["BoardcastArray" + propertyName]);
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
        this.display = true;
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
                let innerCc = $('<div>').html(cn._codeText).text();
                let cc = "function " + cn._name + "(){\n" + __preCal(innerCc) + "\n}\n";
                let dn = this.bufferSections[si]._dataNodes;
                for (let di = 0; di < dn.length; di++) {
                    if (cn._name == dn[di]._name) continue;
                    let avater = mpDataName + ".bufferSections[" + si + "]._dataNodes[" + di + "].avater.";
                    cc = cc.replace(new RegExp('([^\\._#@\\$])\\b' + dn[di]._name + '\\.', "g"), "$1" + avater);
                    cc = cc.replace(new RegExp('([^\\._#@\\$])\\b' + dn[di]._name + '\\b', "g"), "$1" + avater + "self");
                }
                if (si + 1 < this.bufferSections.length) {
                    let dnf = this.bufferSections[si + 1]._dataNodes;
                    for (let di = 0; di < dnf.length; di++) {
                        if (cn._name == dnf[di]._name) continue;
                        let avater = mpDataName + ".bufferSections[" + (si + 1) + "]._dataNodes[" + di + "].avater.";
                        cc = cc
                            .replace(new RegExp('([^\\._#@\\$])\\b' + dnf[di]._name + '\\.', "g"), "$1" + avater)
                            .replace(new RegExp('([^\\._#@\\$])\\b' + dnf[di]._name + '\\b', "g"), "$1" + avater + "self");
                    }
                }
                code += cc;
            }
        }
        code += this.mainCodeData._codeText + "\n";
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
        if (new.target === CodeDataPrototype) {
            throw new Error("CodeDataPrototype是抽象类！不能有实例！");
        }
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



/**@name 贴图数据项
 * @description 一维，二维，三维等长度的贴图，本质上是固定尺寸的数组
 */
class BufferDataTexture extends BufferDataPrototype {
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
                        x = x < 0 ? 0 : (x > d._width ? d._width - 1 : x);
                        y = y < 0 ? 0 : (y > d._height ? d._height - 1 : y);
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

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<canvas></canvas>").BindProperty(this, "texData", "texture"));
    }
}
//#endregion


/**MP对象专用序列化方法 */
var MPOS = {
    /**将MP对象转化为json字符串
     * @param {MPPrototype} obj MP对象
     * @return {string} json字符串
     */
    stringify: function (obj) {
        let result = "";
        function serializeInternal(o, path) {
            for (key in o) {
                var value = o[key];
                if (key.match(/(?:^Boardcast|remove|avater)/)) {
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
        str = str.replace(/#mpObject/g, name);
        eval(str);
    }
}