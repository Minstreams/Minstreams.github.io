/**mp代码编辑器模块
 * 主要功能：
 *      代码编辑相关的扩展功能，供予mpWidget模块使用
 * 依赖：
 *      mpRuntimeLibrary.js
 *      @module mpCore
 */

import { MPData, MPSection, MPCodeData } from "./mpCore.js";
import { ConvertArgs } from "./mpCompilation.js";

/**运行时库中的所有变量 */
var constVars = ['Math', 'Vector3', 'Vector4', 'Quaternion'];
/**运行时库中的所有方法 */
var constFuncs = [];
/**运行时库的用户手册 */
var constDocument = "文档";

/**获取mp数据对应的运行时数据结构名 */
var runtimeClass = {
    'MPF1': 'float',
    'MPF2': 'vec2',
    'MPF3': 'vec3',
    'MPF4': 'vec4',
    'MPMatrix': 'matrix',
    'MPTexture': 'texture',
}

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

function getCodeInfo(mpData, codeData) {
    if (codeData === mpData.mainCode) return { section: 0, node: -1 };
    let cn = mpData.uniformSection.codeSection._codeNodes;
    for (let i = 0; i < cn.length; ++i) {
        if (codeData === cn[i]) return { section: -1, node: i };
    }
    for (let sec = 0; sec < mpData.sections.length; ++sec) {
        let cn = mpData.sections[sec].codeSection._codeNodes;
        for (let i = 0; i < cn.length; ++i) {
            if (codeData === cn[i]) return { section: sec, node: i };
        }
    }
    return { section: undefined, node: undefined };
}

/**生成一个代码编辑器
 * @param {JQuery<HTMLElement>} codeDiv
 * @param {MPData} mpData
 * @param {MPCodeData} codeData
 */
export function mpCodeMirror(codeDiv, mpData, codeData) {
    let calContext = function () {
        // 查找上下文，更新关键词，并生成文档
        let codeInfo = getCodeInfo(mpData, codeData);
        let dynamVars = [];
        let dynamFuncs = [];
        let document = constDocument;
        /**@param {MPSection} mpSec */
        function proceedSection(mpSec, noDn, noCn) {
            if ((noDn || mpSec.bufferSection._dataNodes.length == 0) && (noCn || mpSec.codeSection._codeNodes.length == 0)) return;
            let dn, cn;
            document += '\n【' + mpSec.bufferSection.name + '】\t//' + mpSec.bufferSection.description;
            if (!noDn) {
                dn = mpSec.bufferSection._dataNodes;
                if (dn.length > 0) document += '\nVariables:';
                for (let i = 0; i < dn.length; ++i) {
                    dynamVars.push(dn[i].name);
                    document += '\n\t' + runtimeClass[dn[i].constructor.name] + ' ' + dn[i].name + '\n\t\t-' + dn[i].description;
                }
            }
            if (!noCn) {
                cn = mpSec.codeSection._codeNodes;
                if (cn.length > 0) document += '\nFunctions:';
                for (let i = 0; i < cn.length; ++i) {
                    dynamFuncs.push(cn[i].name);
                    document += '\n\t' + cn[i].name + '(' + cn[i].args + ');' + '\n\t\t-' + cn[i].description;
                }
            }
        }
        // 先找uniform变量和方法
        proceedSection(mpData.uniformSection);
        // 再找别的
        if (codeInfo.node < 0) {
            // 主函数，遍历所有
            for (let i = 0; i < mpData.sections.length; ++i) {
                proceedSection(mpData.sections[i]);
            }
        } else if (codeInfo.section >= 0) {
            if (codeInfo.section < mpData.sections.length - 1) proceedSection(mpData.sections[codeInfo.section + 1], false, true);
            proceedSection(mpData.sections[codeInfo.section]);
            if (codeInfo.section > 0) proceedSection(mpData.sections[codeInfo.section - 1], true);
        }
        // 添加形式参数
        if (codeData.args) ConvertArgs(codeData.args).split(',').forEach(arg => {
            dynamVars.push(arg);
        });
        return {
            dynamVars,
            dynamFuncs,
            document
        }
    }
    let config = calContext();
    codeDiv.data('document', config.document);
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
        dynamVars: config.dynamVars,
        dynamFuncs: config.dynamFuncs,
    });
    let applyFunc = function () {
        codeData._codeText = $('<div>').text(cmr.getValue()).html();
        $('EventHandler').trigger('change');
    };
    let restructFunc = function () {
        let config = calContext();
        cmr.setOption('dynamVars', config.dynamVars);
        cmr.setOption('dynamFuncs', config.dynamFuncs);
        codeDiv.data('document', config.document);
        console.log('Restruct!' + config.document);
        cmr.refresh();
    }
    codeDiv.addClass('codeText').data('binded', true).data('applyFunc', applyFunc).on('blur remove', applyFunc)
        .data('restructFunc', restructFunc);
    cmr.refresh();
    return codeData;
}


function generateDocument(mpData, section, node) {

}