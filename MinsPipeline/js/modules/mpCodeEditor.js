/**mp代码编辑器模块
 * 主要功能：
 *      代码编辑相关的扩展功能，供予mpWidget模块使用
 * 依赖：
 *      mpRuntimeLibrary.js
 *      @module mpCore
 */

import { MPData } from "./mpCore.js";

/**运行时库中的所有变量 */
var constVars = [];
/**运行时库中的所有方法 */
var constFuncs = [];

/**获取codeData
 * @param {MPData} mpData
 * @param {number} section
 * @param {number} node
 */
export function getCodeData(mpData, section, node) {
    if (node === -1) return mpData.mainCode;
    if (section === -1) return mpData.uniformSection.codeSection._codeNodes[node];
    return mpData.sections[section].codeSection._codeNodes[node];
}

/**生成一个代码编辑器
 * @param {JQuery<HTMLElement>} codeDiv
 * @param {MPData} mpData
 * @param {number} section
 * @param {number} node
 */
export function mpCodeMirror(codeDiv, mpData, section, node) {
    let codeData = getCodeData(mpData, section, node);
    let cmr = CodeMirror(codeDiv[0], {
        value: $('<div>').html(codeData._codeText).text(),
        lineNumbers: true,
        mode: 'javascript',
        theme: 'codewarm',
        lineWrapping: true,
        scrollbarStyle: null,
        spellcheck: true,
        autocorrect: true,
        autocapitalize: true,
        styleActiveLine: { nonEmpty: true },
        extraKeys: {
            'Ctrl-S': function () {
                $('CM-Ctrl-S').click();
            },
            'F5': function () {
                $('CM-F5').click();
            }
        },
        constVars: constVars,
        constFuncs: constFuncs,
        dynamVars: [],
        dynamFuncs: [],
    });
    let applyFunc = function () {
        codeData._codeText = $('<div>').text(cmr.getValue()).html();
        $('EventHandler').trigger('change');
    };
    codeDiv.addClass('codeText').data('binded', true).data('applyFunc', applyFunc).on('blur remove', applyFunc);
    cmr.refresh();
    return codeData;
}

function generateDocument(mpData, section, node) {

}