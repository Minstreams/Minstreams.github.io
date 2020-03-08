/**mp序列化模块
 * 主要功能：
 *      mp序列化/反序列化
 *      对序列化结果进行压缩/解压
 * 依赖：
 *      @module mpCore
 */
import { MPData } from "./mpCore.js";

// MinsPipelineObject，序列化的临时中间变量，变量名尽量简短，以减少序列化文件的大小（不过现在有了压缩技术所以无所谓了）
var mo;
// debug模式下不删去回车
const debug = false;
/**MP对象专用序列化方法 */
export var MPOS = {
    /**将MP对象转化为mpos字符串
     * @param {MPPrototype} obj MP对象
     * @return {string} mpos字符串
     */
    stringify: function (obj) {
        let result = '';
        function serializeInternal(o, path) {
            if (debug) result += '\n';
            let args = o.constructor.toString().match(/(?<=constructor\().+?(?=\))/);
            if (args) {
                result += path + '=new ' + o.constructor.name + '(';
                args.pop().replace(/[^\w,]+/g, '').split(',').forEach(a => {
                    result += (typeof o[a] === 'string' ? '\'' + o[a].replace(/\'/g, '\\\'').replace(/[\n\r]/g, '\\n') + '\'' : o[a]) + ','
                });
                result = result.slice(0, -1) + ');';
            }
            else result += path + '=new ' + o.constructor.name + '();';
            for (let key in o) {
                var value = o[key];
                // 此为排除条件
                if (key.match(/^(?:^avater|_texData)$/)) continue;
                if (typeof value != 'object') continue;
                serializeInternal(value, path + (isNaN(key) ? '.' + key : '[' + key + ']'));
            }
        }
        serializeInternal(obj, 'mo');
        return compress(result.replace(/MP/g, '_MP.MP'));
    },
    /**将mpos字符串转化为MP对象
     * @param {string} str mpos字符串
     * @return {MPPrototype} MP对象
     */
    parse: function (str) {
        if (!str) return;
        try {
            eval(decompress(str));
        }
        catch (err) {
            console.error(err.message);
            return new MPData();
        }
        return mo;
    }
}
/**压缩路径记号 */
const pathMark = {
    cur: '①',
    old: '②',
}
/**记录常用记号，进一步压缩 */
var compMark = {
    '\\=new ': '③',
    '_MP\\.MP': '④',
    'Matrix': '⑤',
    '\\);': '⑥',
    '\\._dataNodes': '⑦',
    '\\._codeNodes': '⑧',
    'Array': '⑨',
    'Buffer': '⑩',
    'Code': '⑪',
    'Data': '⑫',
    '\\.buffer': '⑬',
    '\\.code': '⑭',
    'Section': '⑮',
    '.section': '⑯',
    '\\(\\\'': '⑰',
    '\\\',\\\'': '⑱',
}
var invMark = {
    '③': '=new ',
    '④': '_MP.MP',
    '⑤': 'Matrix',
    '⑥': ');',
    '⑦': '._dataNodes',
    '⑧': '._codeNodes',
    '⑨': 'Array',
    '⑩': 'Buffer',
    '⑪': 'Code',
    '⑫': 'Data',
    '⑬': '.buffer',
    '⑭': '.code',
    '⑮': 'Section',
    '⑯': '.section',
    '⑰': '(\'',
    '⑱': '\',\'',
}
/**压缩序列化结果
 * @param {string} str
 */
function compress(str) {
    if (debug) console.log('start compressing(length:' + str.length + '):\n' + str);
    str = str.replace(/\n/g, '');
    let i = 2;
    let result = pathMark.cur;
    function until(mark) {
        let c;
        do {
            c = str[i++];
            result += c;
        } while (c !== mark);
    }
    function curve(left, right) {
        right = right || left;
        let c;
        do {
            c = str[i++];
            result += c;
            if (c === left) curve(left, right);
        } while (c !== right);
    }
    function innerComp(path) {
        while (i < str.length) {
            //data部分
            while (i < str.length) {
                let c = str[i++];
                result += c;
                if (c === '\'') until('\'');
                else if (c === '"') until('"');
                else if (c === '(') curve('(', ')');
                else if (c === ';') break;
            }
            //path部分
            if (debug) result += '\n';
            while (i < str.length) {
                let l = path.length;
                let pathStr = str.slice(i).match(/^.*?(?=\=)/)[0];
                let pl = pathStr.length;
                if (pathStr === path) {
                    //原位
                    i += pl;
                    result += pathMark.cur;
                    break;
                }
                else if (pathStr.match(new RegExp('^' + path.replace(/\./g, '\\.').replace(/(\[.*\])/, '\\[$1\\]')))) {
                    //进位
                    i += pl;
                    result += pathMark.cur + pathStr.slice(l);
                    innerComp(pathStr);
                    result += pathMark.old;
                }
                else {
                    //回退
                    return;
                }
            }
        }
    }
    innerComp('mo');
    result = result.replace(/;[^;]+?$/, ';');
    //替换常用符号
    for (let key in compMark) {
        result = result.replace(new RegExp(key, 'g'), compMark[key])
    }
    if (debug) console.log('compressed to ' + result.length);
    return result;
}
/**解压 */
function decompress(str) {
    if (debug) console.log('start decompressing(length:' + str.length + '):\n' + str);
    if (str[0] !== pathMark.cur) {
        console.warn('decompress传入的不是压缩数据！');
        return str;
    }
    //还原常用符号
    for (let key in invMark) {
        str = str.replace(new RegExp(key, 'g'), invMark[key])
    }
    str = str.replace(/[\n\r]/g, '');
    let i = 1;
    let result = '';
    function until(mark) {
        let c;
        do {
            c = str[i++];
            result += c;
        } while (c !== mark);
    }
    function curve(left, right) {
        right = right || left;
        let c;
        do {
            c = str[i++];
            result += c;
            if (c === left) curve(left, right);
        } while (c !== right);
    }
    function innerDecomp(path) {
        result += path;
        while (i < str.length) {
            while (i < str.length) {
                let c = str[i++];
                result += c;
                if (c === '\'') until('\'');
                else if (c === '"') until('"');
                else if (c === '(') curve('(', ')');
                else if (c === ';') break;
            }
            //path部分
            result += '\n';
            while (i < str.length) {
                let pathMatch = str.slice(i).match(/^.*?(?=\=)/);
                if (!pathMatch) { i++; return; }
                let pathStr = pathMatch[0];
                if (pathStr[0] === pathMark.old) {
                    //回退
                    i++;
                    return;
                } else if (pathStr === pathMark.cur) {
                    //原位
                    i++;
                    result += path;
                    break;
                } else {
                    //进位
                    i += pathStr.length;
                    innerDecomp(path + pathStr.slice(1))
                }
            }
        }
    }
    innerDecomp('mo');
    if (debug) console.log('decompressed to ' + result.length + ':\n' + result);
    return result;
}