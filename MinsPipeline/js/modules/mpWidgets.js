/**数据项交互控件
 * 主要功能：
 *      数据绑定
 *      控件加载
 *      权限控制
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

import { MPPrototype } from './mpCore';

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
    number(target, propertyName) { this.text(target[propertyName].toFixed(numberDecimalPoint)); },
    /**text(avater._name.toFixed) */
    avaterNumber(target, propertyName) { this.text(target.avater['_' + propertyName].toFixed(numberDecimalPoint)); },
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
    /**将代码强制转换为html */
    html(target, propertyName) {
        target['_' + propertyName] = $('<div>').text(this.data('mirror').getValue()).html();
    }
};
/**所有OnBind方法的集合 
 * @onBind 是绑定时额外调用的函数，用于添加特定功能
 */
var onBindFunctions = {
    /**双击可编辑 */
    editable() {
        this.on('dblclick', function () { $(this).attr({ contentEditable: 'plaintext-only', spellCheck: false }).focus(); })
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
    /**初始化代码框 */
    code(target, propertyName) {
        var cmr = CodeMirror(this[0], {
            value: $('<div>').html(target[propertyName]).text(),
            lineNumbers: true,
            mode: 'javascript',
            theme: 'codewarm',
        });
        this.data('mirror', cmr);
        cmr.refresh();
        cmr.focus();
    }
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
    code: {
        applyFunc: applyFunctions.html,
        applyEvent: 'blur remove',
        onBind: 'code',
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
     * @return {JQuery<HTMLElement>} 元素自身的引用
     */
    BindProperty(target, propertyName, template) {
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
        if (temp.applyFunc) { el.data('applyFunc', function () { temp.applyFunc.call(el, target, propertyName); UpdateAll(); return el; }); }
        // 绑定更新事件
        if (temp.applyEvent) el.on(temp.applyEvent, el.data('applyFunc'));
        // 绑定响应
        if (temp.onBind) temp.onBind.split(' ').forEach(bindF => onBindFunctions[bindF].call(el, target, propertyName));

        // 标记绑定状态
        el.data('binded', true);

        return el;
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

        // 数据项
        let mpObjName = mpObject.constructor.name;
        if (mpObjName !== 'MPCodeData') {
            el.addClass('contentDiv ' + mpObjName)
                .AppendProperties(['name'], 'h3', auth.fullControl ? 'name' : 'readonly')
                .AppendProperties(['description'], 'p', auth.fullControl ? 'text' : 'readonly');
        }
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
                el.AppendProperties(['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15'], 'div', auth.editable ? 'avaterNumber' : 'readonlyAvaterNumber');
                break;
            case 'MPTexture':
                el.AppendProperties(['texData'], 'canvas', 'texture');
                break;
            case 'MPCodeData':
                el.addClass('codeTextDiv cm-s-codewarm')
                    .append(
                        $('<span>// </span>').addClass('cm-comment'),
                        $('<span></span>').BindProperty(mpObject, 'description', auth.fullControl ? 'text' : 'readonly').addClass('cm-comment'),
                        $('<br />').addClass('cm-comment'),
                        $('<span>function </span>').addClass('cm-keyword'),
                        $('<span></span>').addClass('cm-def').BindProperty(mpObject, 'name', auth.fullControl ? 'name' : 'readonly'),
                        $('<span>(…){</span>').addClass('cm-operator'),
                        $('<div></div>').BindProperty(mpObject, 'codeText', 'code'),
                        $('<span>}</span>').addClass('cm-operator')
                    );
                break;
        }
        return this;
    },
});

