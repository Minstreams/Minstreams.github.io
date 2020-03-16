/**mp代码编译模块
 * 主要功能：
 *      代码编译
 *          重载运算符
 *      代码运行和报错
 *          代码进程控制与停止
 * 依赖：
 *      mpRuntimeLibrary.js
 *      @module mpCore
 */

import { MPData, MPCodeData } from './mpCore.js';

/**编译代码原理：
 *      翻译所有参数引用（加前缀MPARG_）
 *      控制变量作用域，翻译数据项引用(考虑在此时把额外信息转化为特殊字符，防止函数引用查找重名)
 *      控制函数作用域，重命名所有函数引用（加前缀MPFUNC_）
 *      封装函数引用，添加额外的进程控制指令
 *      分析修改表达式，实现运算符重载
 *      考虑用try块封装函数调用，抛出自定义的异常，以定位代码出错区域
 */

/**编译过程中保存MPData的临时引用
 * @type {MPData}
 */
var mpd;
/**特殊字符Mark，转换固定的特殊字符串，防止重名 */
var mk = {
    'this.uniformSection.bufferSection._dataNodes[': '❶',
    'this.sections[': '❷',
    '].bufferSection._dataNodes[': '❸',
    '].avater': '❹',
    '.self': '❺',
    'function ': '❻',
    '.call(this,': '❼',
    'let ': '❽.',
};
var declaration = ['let ', 'var ', 'int ', 'string ', 'float ', 'vec2 ', 'vec3 ', 'vec4 ', 'matrix ', 'texture ', 'array '];
var declareArgReg = /(?:let|var|int|string|float|vec2|vec3|vec4|matrix|texture|array) /g;
var argPrefix = 'MPARG_';
var funcPrefix = 'MPFUNC_';
/**编译后代码调用模块内方法时使用的前缀 */
var modulePrefix = '_MP.';
/**运行 */
MPData.prototype.Run = function () {
    let js = ToJs(this);
    console.log(js);
    try { eval(js); }
    catch (err) {
        console.warn(err.stack);
        throw err;
    }
}
MPData.prototype.LocateError = function () {

}
/**编译代码为JavaScript
 * @param {MPData} mpData
 */
function ToJs(mpData) {
    let code = '';
    mpd = mpData;
    mpData.uniformSection.codeSection._codeNodes.forEach(cn => {
        let c = InitCodeData(cn);
        c = ImportBufferSection(c, -1);
        c = ImportCodeSection(c, -1);
        code += c;
    });
    let cm = InitCodeData(mpData.mainCode);
    cm = ImportBufferSection(cm, -1);
    cm = ImportCodeSection(cm, -1);
    for (let i = 0; i < mpData.sections.length; ++i) {
        mpData.sections[i].codeSection._codeNodes.forEach(cn => {
            let c = InitCodeData(cn);
            c = ImportBufferSection(c, -1);
            c = ImportBufferSection(c, i);
            c = ImportCodeSection(c, -1);
            c = ImportCodeSection(c, i);
            if (i > 0) {
                c = ImportCodeSection(c, i - 1);
            }
            if (i < mpData.sections.length - 1) {
                c = ImportBufferSection(c, i + 1);
            }
            code += c;
        });
        cm = ImportBufferSection(cm, i);
        cm = ImportCodeSection(cm, i);
    }
    code += cm;
    for (let key in mk) { code = code.replace(new RegExp(mk[key], 'g'), key); }
    code += 'MPFUNC_main.call(this);';
    mpd = null;
    return code;
}

export function ConvertArgs(args) {
    return args.replace(declareArgReg, '').replace(/ /g, '');
}
/**初始化一个代码块，在这里处理函数格式，并翻译数据项引用
 * @param {MPCodeData} cd 代码项
 * @return {string} 生成的代码
 */
function InitCodeData(cd) {
    //将代码从html格式转换为可执行的文本
    let code = $('<div>').html(cd._codeText).text();
    //去掉注释
    code = code.replace(/\/\*(?:.|\n)*?(?:\*\/|$)/g, '').replace(/\/\/.*\n/g, '');
    //先去掉连续空格
    code = code.replace(/\s+/g, ' ');
    //再去掉非变量声明处的空格
    code = code.replace(/(?<=\w) (?=\W)|(?<=\W) (?=\W)|(?<=\W) (?=\w)/g, '');
    //翻译所有参数引用
    if (cd.args) ConvertArgs(cd.args).split(',').forEach(arg => {
        code = code.replace(new RegExp('(?<![\\.\\w])' + arg + '(?!\\w)', 'g'), argPrefix + arg);
    });
    //转换所有声明引用
    declaration.forEach(dec => code = code.replace(new RegExp(dec + '(?=\\w)', 'g'), mk['let ']));
    code = CompileOperators(code);
    return mk['function '] + funcPrefix + cd.name + '(' + (cd.args ? ConvertArgs(cd.args).replace(/(?<!\w)/g, argPrefix) : '') + '){\n' + code + '\n}\n';
}
/**引入缓存节作用域，翻译相关数据项引用
 * @param {string} code 源代码
 * @param {number} bsIndex 缓存节序号，-1代表全局变量
 * @return {string} 处理后的代码
 */
function ImportBufferSection(code, bsIndex) {
    //dataNodes
    let dn, path;
    if (bsIndex < 0) {
        dn = mpd.uniformSection.bufferSection._dataNodes;
        path = mk['this.uniformSection.bufferSection._dataNodes['];
    }
    else {
        dn = mpd.sections[bsIndex].bufferSection._dataNodes;
        path = mk['this.sections['] + bsIndex + mk['].bufferSection._dataNodes['];
    }
    for (let di = 0; di < dn.length; ++di) {
        let avater = path + di + mk['].avater'];
        code = code.replace(new RegExp('(?<=(?<![\\.\\w])' + dn[di]._name + ')(?![\\.\\[\\w])', 'g'), mk['.self'])
            .replace(new RegExp('(?<![\\.\\w])' + dn[di]._name + '(?!\\w)', 'g'), avater);
    }
    return code;
}
/**引入代码节作用域，翻译相关代码项引用
 * @param {string} code 源代码
 * @param {number} csIndex 代码节序号，-1代表全局方法
 * @return {string} 处理后的代码
 */
function ImportCodeSection(code, csIndex) {
    //codeNodes
    let cn;
    if (csIndex < 0) {
        cn = mpd.uniformSection.codeSection._codeNodes;
    } else {
        cn = mpd.sections[csIndex].codeSection._codeNodes;
    }
    for (let ci = 0; ci < cn.length; ++ci) {
        code = code.replace(new RegExp('(?<![\\.\\w])' + cn[ci].name + '\\(', 'g'), funcPrefix + cn[ci].name + mk['.call(this,']);
    }
    return code;
}

//#region 运算符重载
// 按运算优先级倒序排序的所有运算符
var operators = {
    '①': 1,
    '②': 1,
    '③': 2,
    '④': 2,
    '⑫': 3,
};
var operatorReplacerInversed = {
    '①': '+',
    '②': '-',
    '③': '*',
    '④': '/',
    '⑤': ',',
    '⑥': '(',
    '⑦': ')',
    '⑧': '[',
    '⑨': ']',
    '⑩': ';',
    '⑪': '=',
    '⑫': '^',
}
// 所有的运算符重载方法在此注册
var overrides = {
    '': {
        '-': {
            'Number': function (l) { return -l; },
            'Vector2': Vector2.__Negative,
            'Vector3': Vector3.__Negative,
            'Vector4': Vector4.__Negative,
        },
    },
    'Number': {
        '+': {
            'Number': function (l, r) { return l + r; },
            'Vector2': Vector2.__NumAddVec2,
            'Vector3': Vector3.__NumAddVec3,
            'Vector4': Vector4.__NumAddVec4,
        },
        '-': {
            'Number': function (l, r) { return l - r; },
            'Vector2': Vector2.__NumMinVec2,
            'Vector3': Vector3.__NumMinVec3,
            'Vector4': Vector4.__NumMinVec4,
        },
        '*': {
            'Number': function (l, r) { return l * r; },
            'Vector2': Vector2.__NumMulVec2,
            'Vector3': Vector3.__NumMulVec3,
            'Vector4': Vector4.__NumMulVec4,
        },
        '/': {
            'Number': function (l, r) { return l / r; },
            'Vector2': Vector2.__NumDivVec2,
            'Vector3': Vector3.__NumDivVec3,
            'Vector4': Vector4.__NumDivVec4,
        },
    },
    'Vector2': {
        '+': {
            'Number': Vector2.__Vec2AddNum,
            'Vector2': Vector2.__Vec2AddVec2,
        },
        '-': {
            'Number': Vector2.__Vec2MinNum,
            'Vector2': Vector2.__Vec2MinVec2,
        },
        '*': {
            'Number': Vector2.__Vec2MulNum,
            'Vector2': Vector2.__Vec2MulVec2,
        },
        '/': {
            'Number': Vector2.__Vec2DivNum,
            'Vector2': Vector2.__Vec2DivVec2,
        },
    },
    'Vector3': {
        '+': {
            'Number': Vector3.__Vec3AddNum,
            'Vector3': Vector3.__Vec3AddVec3,
        },
        '-': {
            'Number': Vector3.__Vec3MinNum,
            'Vector3': Vector3.__Vec3MinVec3,
        },
        '*': {
            'Number': Vector3.__Vec3MulNum,
            'Vector3': Vector3.__Vec3MulVec3,
        },
        '/': {
            'Number': Vector3.__Vec3DivNum,
            'Vector3': Vector3.__Vec3DivVec3,
        },
    },
    'Vector4': {
        '+': {
            'Number': Vector4.__Vec4AddNum,
            'Vector4': Vector4.__Vec4AddVec4,
        },
        '-': {
            'Number': Vector4.__Vec4MinNum,
            'Vector4': Vector4.__Vec4MinVec4,
        },
        '*': {
            'Number': Vector4.__Vec4MulNum,
            'Vector4': Vector4.__Vec4MulVec4,
        },
        '/': {
            'Number': Vector4.__Vec4DivNum,
            'Vector4': Vector4.__Vec4DivVec4,
        },
        '^': {
            'Vector4': Vector4.__QuatMulQuat,
            'Vector3': Vector4.__QuatMulVec3,
        },
    },
    'Matrix': {
        '*': {
            'Vector4': Matrix.__MatMulVec4,
            'Matrix': Matrix.__MatMulMat,
        },
    },
};

var __minCurveTester = /(?<!for|if|while|switch)⑥[^⑥⑦]*⑦/g;
var __midCurveTester = /⑧[^⑧⑨]*⑨/g;
var forTester = /for⑥[^⑥⑦]*⑦/g;
var ifTester = /if⑥[^⑥⑦]*⑦/g;
var whileTester = /while⑥[^⑥⑦]*⑦/g;
var switchTester = /switch⑥[^⑥⑦]*⑦/g;

/**预处理代码，将运算符转换为Cal方法 
 * @param {string} code
 */
function CompileOperators(code) {
    // 进行Replace操作
    for (let key in operatorReplacerInversed) code = code.replace(new RegExp('\\' + operatorReplacerInversed[key], 'g'), key);
    // 开始处理
    let t = code;
    // 先反复去掉小括号
    do {
        code = t;
        t = code.replace(__minCurveTester, function (subs) { return '(' + CompileOperators_Parameters(subs.substring(1, subs.length - 1)) + ')'; });
    } while (t != code);
    // 反复去掉中括号
    do {
        code = t;
        t = code.replace(__midCurveTester, function (subs) { return '[' + CompileOperators_Expression(subs.substring(1, subs.length - 1)) + ']'; });
    } while (t != code);
    // 再处理for循环
    code = code.replace(forTester, function (subs) {
        let subEx = subs.substring(4, subs.length - 1).split('⑩');// 用分号分割
        let out = CompileOperators_Expression(subEx[0]);
        for (let i = 1; i < subEx.length; ++i)out += ';' + CompileOperators_Expression(subEx[i]);
        return 'for(' + out + ')\t';
    });
    // 再处理if语句
    code = code.replace(ifTester, function (subs) { return 'if(' + CompileOperators_Expression(subs.substring(3, subs.length - 1)) + ')\t'; });
    // 再处理while语句
    code = code.replace(whileTester, function (subs) { return 'while(' + CompileOperators_Expression(subs.substring(6, subs.length - 1)) + ')\t'; });
    // 再处理switch语句
    code = code.replace(switchTester, function (subs) { return 'switch(' + CompileOperators_Expression(subs.substring(7, subs.length - 1)) + ')\t'; });
    // 用分号和\t分割语句
    code = code.replace(/[^⑩\t\{\}]+/g, CompileOperators_Expression);
    // 恢复分号
    code = code.replace(/⑩/g, ';\n');
    return code;
}
/**参数分割的Reg */
var paramReg = /⑤/g;
function CompileOperators_Parameters(code) {
    paramReg.lastIndex = 0;
    if (!paramReg.test(code)) {
        return CompileOperators_Expression(code);
    }
    let subCodes = code.split(paramReg);
    let res = CompileOperators_Expression(subCodes[0]);
    for (let i = 1; i < subCodes.length; ++i)res += ',' + CompileOperators_Expression(subCodes[i]);
    return res;
}

var setPlusReg = /^(.*?)([①②③④]⑪)(.*)$/;
var setReg = /^(.*)(?<!⑪)(⑪)(?!⑪)(.*?)$/;
var equalReg = /^(.*?)(⑪⑪)(.*)$/;
var returnReg = /^return /;
/**没有括号/逗号/分号的表达式句 */
function CompileOperators_Expression(code) {
    let $1, $2, $3;
    // 转换复合赋值等号
    if (setPlusReg.test(code)) {
        $1 = RegExp.$1;
        $2 = RegExp.$2;
        $3 = RegExp.$3;
        return $1 + '=' + modulePrefix + 'Cal(' + $1 + ',\'' + operatorReplacerInversed[$2[0]] + '\',' + CompileOperators_Expression($3) + ')';
    }
    // 转换赋值等号
    if (setReg.test(code)) {
        $1 = RegExp.$1;
        $2 = RegExp.$2;
        $3 = RegExp.$3;
        return $1 + (numberTest.test($3) ? '=' + CompileOperators_Expression($3) : '=' + modulePrefix + 'Get(' + CompileOperators_Expression($3) + ')');
    }
    // 转换判断等号
    if (equalReg.test(code)) {
        $1 = RegExp.$1;
        $2 = RegExp.$2;
        $3 = RegExp.$3;
        return CompileOperators_SimpleExpression($1) + '==' + CompileOperators_SimpleExpression($3);
    }
    if (returnReg.test(code)) {
        return 'return ' + CompileOperators_Expression(code.slice(7));
    }
    return CompileOperators_SimpleExpression(code);
}

/**加减乘除的Reg */
var opTester = /[①②③④⑫]/;
var numberTest = /^[^a-zA-Z]*$/;
/**无括号，无等于号 */
function CompileOperators_SimpleExpression(code) {
    // 替换自增、自减符号
    code = code.replace(/①①/g, '++');
    code = code.replace(/②②/g, '--');
    // 最简表达式直接返回
    if (!opTester.test(code)) return code;
    let ops = [];    // 运算符优先级栈
    let es = [''];    // 表达式栈
    let os = [''];    // 运算符栈
    let ets = [''];   // 表达式后缀栈
    let ps = 0;     // 栈顶指针
    let p = 0;  // 字符串指针
    while (p < code.length) {
        let l = code[p];    // letter
        if (operators.hasOwnProperty(l)) {
            // 如果是运算符
            let o = l;
            // 运算符栈操作
            let op = operators[o];    // 操作符优先级 operator piority
            if (ps > 0 && op <= ops[ps - 1]) {
                // 运算符优先级低，合并先前运算的表达式
                if (numberTest.test(es[ps - 1] + es[ps])) { es[ps - 1] += operatorReplacerInversed[os[ps - 1]] + es[ps]; }
                else if (es[ps - 1] === '') es[ps - 1] = modulePrefix + 'Cal(\'\',\'' + operatorReplacerInversed[os[ps - 1]] + '\',' + es[ps] + ')';
                else es[ps - 1] = modulePrefix + 'Cal(' + es[ps - 1] + ',\'' + operatorReplacerInversed[os[ps - 1]] + '\',' + es[ps] + ')';
                ps--;
            }
            os[ps] = o;
            ops[ps] = op;
            // 栈深度加一，并初始化新数据
            ps++;
            es[ps] = '';
            ets[ps] = '';
        }
        else {
            // 如果是表达式的一部分
            es[ps] += l;
        }
        p++;
    }
    while (ps > 0) {
        ps--;
        if (numberTest.test(es[ps] + es[ps + 1])) { es[ps] += operatorReplacerInversed[os[ps]] + es[ps + 1]; }
        else if (es[ps] === '') es[ps] = modulePrefix + 'Cal(\'\',\'' + operatorReplacerInversed[os[ps]] + '\',' + es[ps + 1] + ')';
        else es[ps] = modulePrefix + 'Cal(' + es[ps] + ',\'' + operatorReplacerInversed[os[ps]] + '\',' + es[ps + 1] + ')';
    }
    return es[0];
}
/**运算符重载的主体 */
export function Cal(lhs, operator, rhs) {
    let calOverride;
    if (lhs === '') {
        // 单目运算符
        calOverride = overrides[''][operator][rhs.constructor.name];
        if (calOverride === undefined) throw new Error("没有定义对于" + rhs.constructor.name + "类型的" + operator + "单目运算符！");
        return calOverride(rhs);
    }
    else {
        // 双目运算符
        try {
            calOverride = overrides[lhs.constructor.name][operator][rhs.constructor.name];
        } catch (err) {
            throw new Error(err + "[lhs:]" + lhs + "[operator:]" + operator + "[rhs:]" + rhs);
        }
        if (calOverride === undefined) throw new Error("没有定义对于" + lhs.constructor.name + "和" + rhs.constructor.name + "类型的" + operator + "运算符！");
        return calOverride(lhs, rhs);
    }
}
/**等式右边的表达式，根据类型需要做转换，从而实现值复制 */
export function Get(val) {
    switch (val.constructor.name) {
        case 'Vector2':
            return vec2(val);
        case 'Vector3':
            return vec3(val);
        case 'Vector4':
            return vec4(val);
        case 'Matrix':
            return matrix(val);
        default:
            return val;
    }
}
//#endregion