/**数据项交互控件
 * 主要功能：
 *      数据绑定
 *      控件加载
 *      权限控制
 * 依赖:
 *      mpRuntimeLibrary.js
 *      @module mpCore
 *      @module mpDataNodes
 *      @module mpCodeEditor
 * 
 * 标签属性:{
 *      id: mpWidget,
 *      widgetType: 'data'|'code',  // 数据项（默认）|代码项
 *      mpObject: 数据项的引用
 * }
 */

import { MPPrototype, MPData } from './mpCore.js';
import { mpCodeMirror, getCodeData } from './mpCodeEditor.js';
import { Init } from './mpEvent.js';

// 一些配置
/**小数点位数,保留小数点3位 */
const numberDecimalPoint = 3;

// 数据绑定原理：
// 原始数据绑定一个UI元素包含两个基本操作
// 1.更新显示数据
//      关键字-(updateFunc)->显示更新
// 2.应用编辑数据
//      更改后的数据-(applyFunc)->更改后的原始数据
// 以上，还需要提供事件字符串来触发应用数据操作，并提供绑定时额外的初始化操作

/**所有updateFunc的集合
 * @updateFunc 是数据改变时HTML标签的响应方法
 */
var updateFunctions = {
    /**text(name) */
    text(target, propertyName) { this.text(target[propertyName]); },
    /**text(name.toFixed) */
    number(target, propertyName) {
        let n = target[propertyName];
        this.text((n >= 0 ? ' ' : '') + (n.toFixed(numberDecimalPoint)).replace(/(?<=\..+?)0+$|\.0+$/, ''));
    },
    /**text(avater._name.toFixed) */
    avaterNumber(target, propertyName) {
        let n = target.avater['_' + propertyName];
        this.text((n >= 0 ? ' ' : '') + (n.toFixed(numberDecimalPoint)).replace(/(?<=\..+?)0+$|\.0+$/, ''));
    },
};

/**所有apllyFunc的集合
 * @applyFunc 是通过HTML标签应用编辑数据的方法
 */
var applyFunctions = {
    /**不能为空，去掉特殊字符，去掉连续空格 */
    singleLine(target, propertyName) {
        let text = this.text().replace(/[\f\n\r\t\v]/g, '').replace(/ +/g, ' ')
        if (text) target[propertyName] = text;
    },
    /**限定为数字 */
    number(target, propertyName) {
        let text = this.text().replace(/[^0-9.-]/g, '');
        if (text) target[propertyName] = new Number(text);
    },
    /**限定为嵌套数据数字 */
    avaterNumber(target, propertyName) {
        let text = this.text().replace(/[^0-9.-]/g, '');
        if (text) target.avater['_' + propertyName] = new Number(text);
    },
    /**去除所有空格 */
    noSpace(target, propertyName) {
        let text = this.text().replace(/\W/g, '');
        if (text) target[propertyName] = text;
    },
    /**只有字母数字下划线的参数表列 */
    args(target, propertyName) {
        //先去掉连续空格和特殊字符，再去掉参数首数字/连续逗号/头尾部逗号
        target[propertyName] = this.text().replace(/  +/g,' ').replace(/[^\w, ]/g, '').replace(/^,+|(?<![\da-zA-Z])\d+|(?<=,),+|,+$/g, '');
    }
};
/**所有OnBind方法的集合 
 * @onBind 是绑定时额外调用的函数，用于添加特定功能
 */
var onBindFunctions = {
    /**可编辑 */
    editable() {
        this.on('click', function () { $(this).attr({ contentEditable: 'plaintext-only', spellCheck: false }).focus(); })
            .on('blur', function () { this.removeAttribute('contenteditable'); this.removeAttribute('spellcheck'); });
    },
    /**阻止回车事件，从而阻止换行 */
    noEnter() {
        this.keydown(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                this.blur();
            }
        });
    },
    /**阻止空格事件(和回车事件)，屏蔽空格 */
    noSpace() {
        this.keydown(function (e) {
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
    noSelection() { this.disableSelection(); },
};
/**各种元素的绑定模板
 * @updateFunc 是数据改变时HTML标签的响应方法
 * @applyFunc 是通过HTML标签应用编辑数据的方法
 * @applyEvent 是通过HTML标签应用编辑数据的事件表列
 * @onBind 是绑定时额外调用的函数，用于添加特定功能
 */
var propertyBindTemplate = {
    /**描述性文字元素 */
    text: {
        updateFunc: updateFunctions.text,
        applyFunc: applyFunctions.singleLine,
        applyEvent: 'blur',
        onBind: 'editable noEnter',
    },
    /**名称 */
    name: {
        updateFunc: updateFunctions.text,
        applyFunc: applyFunctions.noSpace,
        applyEvent: 'blur',
        onBind: 'editable noSpace',
    },
    /**数字元素 */
    number: {
        updateFunc: updateFunctions.number,
        applyFunc: applyFunctions.number,
        applyEvent: 'blur',
        onBind: 'editable noSpace',
    },
    /**嵌套数字 */
    avaterNumber: {
        updateFunc: updateFunctions.avaterNumber,
        applyFunc: applyFunctions.avaterNumber,
        applyEvent: 'blur',
        onBind: 'editable noSpace',
    },
    /**只读元素 */
    readonly: {
        updateFunc: updateFunctions.text,
        onBind: 'noSelection',
    },
    /**只读数字 */
    readonlyNumber: {
        updateFunc: updateFunctions.number,
        onBind: 'noSelection',
    },
    /**嵌套数据只读数字 */
    readonlyAvaterNumber: {
        updateFunc: updateFunctions.avaterNumber,
        onBind: 'noSelection',
    },
    /**代码参数 */
    args: {
        updateFunc: updateFunctions.text,
        applyFunc: applyFunctions.args,
        applyEvent: 'blur remove',
        onBind: 'editable noEnter',
    },
    texture: {
        updateFunc: function (target, propertyName) {
            if (!this.data('c2d')) this.data('c2d', this[0].getContext('2d'));
            let width = target['_width'];
            let height = target['_height'];
            if ((width != this[0].width) || (height != this[0].height)) {
                // resize
                this[0].width = width;
                this[0].height = height;
                this.data('imgData', this.data('c2d').getImageData(0, 0, width, height));
                target.Resize();
            }
            if (!this.data('imgData')) this.data('imgData', this.data('c2d').getImageData(0, 0, width, height));

            this.data('imgData').data.set(target[propertyName]);
            this.data('c2d').putImageData(this.data('imgData'), 0, 0);
        },
        applyFunc: function (target, propertyName) {
            this.data('imgData', this.data('c2d').getImageData(0, 0, width, height));
            target[propertyName].set(this.data('imgData').data);
        }
    }
};
/**更新所有可以更新的元素 */
export function UpdateAll() {
    // todo:可以通过缓存所有可更新元素，不每次更新，来优化效率
    // todo:可以通过一个简单的计时器和相关变量，来阻止短时间内的大量更新
    $(':data(updateFunc)').UpdateProperty();
}

/**权限等级
 * 数字越小权限越高
 */
var _authority = {
    'fullControl': 0,
    'editable': 1,
    'readonly': 2,
}
function getAuth(auth) {
    let a = _authority[auth] || 0;
    return {
        fullControl: a === 0,
        editable: a <= 1,
        readonly: a === 2
    }
}

$.fn.extend({
    /**将UI元素绑定到一个数据属性上，并响应其广播
     * @param {MPPrototype} target 属性所在对象
     * @param {string} propertyName 属性名称
     * @param {string} template 绑定模板名称
     * @param {string|Function} onapply 额外事件
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    BindProperty(target, propertyName, template, onapply) {

        /**@type {JQuery<HTMLElement>} */
        var el = this;
        // 查重
        if (el.data('binded')) return el;
        // 读取方法模板
        let temp = propertyBindTemplate[template || 'readonly'];
        if (temp === undefined) console.warn('名为' + template + '的bind template不存在！')
        // 记录属性
        el.addClass(propertyName);
        // 定义响应方法
        if (temp.updateFunc) { el.data('updateFunc', function () { temp.updateFunc.call(el, target, propertyName); return el; }); }
        // 定义更新方法
        if (temp.applyFunc) {
            el.data('applyFunc', function () {
                temp.applyFunc.call(el, target, propertyName);
                $('EventHandler').trigger('change');
                el.trigger('apply');
                return el;
            });
        }
        // 绑定更新事件
        if (temp.applyEvent) el.on(temp.applyEvent, el.data('applyFunc'));
        // 绑定响应
        if (temp.onBind) temp.onBind.split(' ').forEach(bindF => onBindFunctions[bindF].call(el));

        if (onapply) {
            if (typeof onapply === 'string') el.on('apply', function () { $('EventHandler').trigger(onapply); });
            else el.on('apply', onapply);
        }
        else {
            // 默认apply时更新当前数据
            if (temp.updateFunc) el.on('apply', function () { el.data('updateFunc')(); });
        }
        // 标记绑定状态
        el.data('binded', true);

        return el;
    },
    /**取消元素绑定 */
    UnbindProperty() {
        if (!this.data('binded')) return this;
        let newEl = $(this.prop("outerHTML")).html('');
        this.after(newEl);
        this.remove()
        return newEl;
    },
    /**更新选定的所有元素
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    UpdateProperty() {
        this.filter(':data(updateFunc)').each(function () { $(this).data('updateFunc')(); });
        return this;
    },
    /**应用更改的数据
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    ApplyProperty() {
        this.filter(':data(applyFunc)').each(function () { $(this).data('applyFunc')(); });
        return this;
    },
    /**在MP控件主Div调用，批量添加变量
     * @param {string[]} propNames 变量名数组
     * @param {string} htmlEl 变量标签名称
     * @param {string} template 模板
     */
    AppendProperties(propNames, htmlEl, template) {
        let mpObject = this.data('mpObject');
        if (!mpObject) return this;
        propNames.forEach(pName => this.append($('<' + htmlEl + '></' + htmlEl + '>').BindProperty(mpObject, pName, template)));
        return this;
    },
    /**加载MP控件 */
    MPLoadWidget(mpObject, authority) {
        let el = this;
        let auth = getAuth(authority);
        el.data('mpObject', mpObject);
        console.log('Load Widget of ' + mpObject.name + ' as ' + authority);

        // 数据项
        let mpObjName = mpObject.constructor.name;
        el.addClass('contentDiv ' + mpObjName)
            .AppendProperties(['name'], 'h3', auth.fullControl ? 'name' : 'readonly', 'restruct')
            .AppendProperties(['description'], 'p', auth.fullControl ? 'text' : 'readonly', 'restruct');
        switch (mpObjName) {
            case 'MPF1':
                el.AppendProperties(['x'], 'div', auth.editable ? 'number' : 'readonlyNumber');
                break;
            case 'MPF2':
                el.AppendProperties(['x', 'y'], 'div', auth.editable ? 'avaterNumber' : 'readonlyAvaterNumber');
                break;
            case 'MPF3':
                el.AppendProperties(['x', 'y', 'z'], 'div', auth.editable ? 'avaterNumber' : 'readonlyAvaterNumber');
                break;
            case 'MPF4':
                el.AppendProperties(['x', 'y', 'z', 'w'], 'div', auth.editable ? 'avaterNumber' : 'readonlyAvaterNumber');
                break;
            case 'MPMatrix':
                el.append($('<div>┌\r\n│\n│\n│\n│\n│\n│\n└</div>').addClass('edgeL'));
                el.AppendProperties(['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15'], 'div', auth.editable ? 'avaterNumber' : 'readonlyAvaterNumber');
                el.append($('<div>┐\r\n│\n│\n│\n│\n│\n│\n┘</div>').addClass('edgeR'));
                break;
            case 'MPTexture':
                el.AppendProperties(['texData'], 'canvas', 'texture');
                el.AppendProperties(['width', 'height'], 'div', auth.fullControl ? 'number' : 'readonlyNumber');
                break;
        }
        return this;
    },
    /**加载代码编辑器 */
    MPCodeEditor(mpData, section, node, authority) {
        /**@type {JQuery<HTMLElement>} */
        let el = this;
        let auth = getAuth(authority);
        let codeData = getCodeData(mpData, section, node);
        el.addClass('codeTextDiv cm-s-codewarm')
            .append(
                $('<span>// </span>').addClass('cm-comment'),
                $('<span></span>').BindProperty(codeData, 'description', auth.fullControl ? 'text' : 'readonly', 'restruct').addClass('cm-comment'),
                $('<br />').addClass('cm-comment'),
                $('<span>function </span>').addClass('cm-keyword'),
                $('<span></span>').addClass('cm-def').BindProperty(codeData, 'name', auth.fullControl ? 'name' : 'readonly', 'restruct'),
                $('<span>(</span>').addClass('cm-operator'),
                $('<span></span>').addClass('cm-mp-variable').BindProperty(codeData, 'args', auth.fullControl ? 'args' : 'readonly', 'restruct'),
                $('<span>){</span>').addClass('cm-operator'),
                $('<div></div>'),
                $('<span>}</span>').addClass('cm-operator'),
                newWidgetTool()
            );
        let codeDiv = el.children('div');
        mpCodeMirror(codeDiv, mpData, section, node);
        el.MPAddToolFunction('showDocument', function () { showDocument(codeDiv); }, '?', '显示API文档');
        el.MPAddToolFunction('todo', function () { }, '♞', '更多选项开发中');
        return this;
    },
    /**@param {MPData} mpData */
    MPAutoCodeEditor(mpData, codeData, authority) {
        if (codeData === mpData.mainCode) return this.MPCodeEditor(mpData, 0, -1, authority);
        let cn = mpData.uniformSection.codeSection._codeNodes;
        for (let i = 0; i < cn.length; ++i) {
            if (codeData === cn[i]) return this.MPCodeEditor(mpData, -1, i, authority);
        }
        for (let section = 0; section < mpData.sections.length; ++section) {
            let cn = mpData.sections[section].codeSection._codeNodes;
            for (let i = 0; i < cn.length; ++i) {
                if (codeData === cn[i]) return this.MPCodeEditor(mpData, section, i, authority);
            }
        }
        throw new Error("???");
    },
    /**给控件小工具栏添加方法 */
    MPAddToolFunction(name, func, signal, tooltip) {
        /**@type {JQuery<HTMLElement>} */
        let panel = this.children('.widgetTool').children('.toolPanel');
        panel.append(
            $('<div></div>').addClass(name).text(signal).click(func).append($('<tooltip></tooltip>').text(tooltip))
        );
        let o = 24, r = 16;
        let funcs = panel.children();
        funcs.each(function (i, e) {
            let angle = (i / funcs.length) * 2 * Math.PI;
            $(this).css({
                top: (o + r * Math.cos(angle)) + 'px',
                left: (o - r * Math.sin(angle)) + 'px'
            });
        });
        return this;
    },
});

function newWidgetTool() {
    return $('<div></div>').addClass('widgetTool').append(
        $('<div></div>').addClass('toolPanel'),
        $('<div>┭</div>').addClass('toolImg')
    );
}


// 浮动API文档
var curCodeDiv;
Init(function () {
    let cd = $('#codeDocument');
    cd.data('afterRestructFunc', function () {
        if (cd.css('display') !== 'none') {
            $('#codeDocumentText').text(curCodeDiv.data('document'));
        }
    });
    let offX;
    let offY;
    let down = false;
    $('#codeDocumentText')
        .mousemove(function (e) {
            stopBubbling(e);
            if (down) {
                cd.css({
                    left: e.offsetX - offX + parseInt(cd.css('left')),
                    top: e.offsetY - offY + parseInt(cd.css('top'))
                });
            }
        })
        .mouseleave(function (e) {
            stopBubbling(e);
            down = false;
        })
        .mousedown(function (e) {
            stopBubbling(e);
            offX = e.offsetX;
            offY = e.offsetY;
            down = true;
        })
        .mouseup(function (e) {
            stopBubbling(e);
            down = false;
        });
    cd.children('.closeBtn')
        .click(function (e) {
            cd.css('display', 'none');
        })
        .mousedown(function (e) {
            stopBubbling(e);
        });
});
/**@param {JQuery<HTMLElement>} codeDiv */
function showDocument(codeDiv) {
    curCodeDiv = codeDiv;
    let cd = $('#codeDocument');
    if (cd.css('display') == 'none') {
        cd.css({
            display: 'block',
            left: '100px',
            top: codeDiv.offset().top
        });
    }
    $('#codeDocumentText').text(codeDiv.data('document'));
}
