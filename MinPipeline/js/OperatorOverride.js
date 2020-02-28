/**运算符重载库
 * 因为运算符重载的方法会在这里注册，所以这个文件要在数据类型库之后引用
 */

// 按运算优先级排序的所有运算符
var __operators = {
    '*': 2,
    '/': 2,
    '+': 1,
    '-': 1,
    '=': 0,
    '+=': 0,
    '-=': 0,
    '*=': 0,
    '/=': 0,
};

// 所有的运算符重载方法在此注册
var __overrides = {
    '': {
        '-': {
            'Vector2': Vector2.__Negative,
            'Vector3': Vector3.__Negative,
            'Vector4': Vector4.__Negative,
        },
    },
    'Number': {
        '+': {
            'Vector2': Vector2.__NumAddVec2,
            'Vector3': Vector3.__NumAddVec3,
            'Vector4': Vector4.__NumAddVec4,
        },
        '-': {
            'Vector2': Vector2.__NumMinVec2,
            'Vector3': Vector3.__NumMinVec3,
            'Vector4': Vector4.__NumMinVec4,
        },
        '*': {
            'Vector2': Vector2.__NumMulVec2,
            'Vector3': Vector3.__NumMulVec3,
            'Vector4': Vector4.__NumMulVec4,
        },
        '/': {
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
    },
};

/**预处理代码，将运算符转换为__Cal方法 
 * @param {string} code
 */
function __preCal(code) {
    // 在调用此方法之前，应该将代码切分，并去掉所有空格？

    let os = [];    // 运算符栈
    let es = [''];    // 表达式栈
    let ets = [''];   // 表达式后缀栈
    let ps = 0;     // 栈顶指针

    let curve = 0;  // 小括号数量

    let p = 0;  // 字符串指针
    while (p < code.length) {
        let l = code[p];    // letter
        if (__operators.hasOwnProperty(l)) {
            // 如果是运算符
            let o = l;
            if (p + 1 < code.length && code[p + 1] === '=') {
                // 若后面一个是等于号，则复合到一起
                o += code[++p];
            }

            // 运算符栈操作
            let op = __operators[o];    // 操作符优先级 operator piority
            if (ps > 0 && op <= os[ps - 1]) {
                // 运算符优先级低，合并先前运算的表达式
                es[ps - 1] += es[ps] + ets[ps - 1];
                ps--;
            }
            os[ps] = op;
            if (op > 0) {
                if (es[ps] === '') {
                    // 如果是单目运算符，第一个参数设为''
                    es[ps] = '\'\'';
                }
                // 常规运算符
                es[ps] = '__Cal(' + es[ps] + ',\'' + o + '\',';
            }
            else {
                // 赋值运算符
                if (o === '=') {
                    es[ps] += '=__Get(';
                }
                else {
                    es[ps] = es[ps] + '=__Cal(' + es[ps] + ',\'' + o[1] + '\',';
                }
            }
            ets[ps] = ')';
            // 栈深度加一，并初始化新数据
            ps++;
            es[ps] = '';
            ets[ps] = '';
        }
        else if (l === '(') {
            es[ps] += l;
            os[ps] = -1;
            ets[ps] = ')';
            // 栈深度加一，并初始化新数据
            ps++;
            es[ps] = '';
            ets[ps] = '';
            curve++;
        }
        else if (l === ')') {
            curve--;
            if (curve < 0) throw new Error("表达式正反括号数量不匹配！");
            os[ps] = 0;
            // 合并括号中所有内容
            while (os[ps] >= 0) {
                ps--;
                es[ps] += es[ps + 1] + ets[ps];
            }
        }
        else {
            // 如果是表达式的一部分
            es[ps] += l;
        }
        p++;
    }

    if (curve != 0) throw new Error("表达式正反括号数量不匹配！");

    while (ps > 0) {
        ps--;
        es[ps] += es[ps + 1] + ets[ps];
    }

    return es[0];
}

/**运算符重载的主体 */
function __Cal(lhs, operator, rhs) {
    let calOverride;
    if (lhs === '') {
        // 单目运算符
        calOverride = __overrides[''][operator][rhs.constructor.name];
        if (calOverride === undefined) throw new Error("没有定义对于" + rhs.constructor.name + "类型的" + operator + "单目运算符！");
        return calOverride(rhs);
    }
    else {
        // 双目运算符
        calOverride = __overrides[lhs.constructor.name][operator][rhs.constructor.name](lhs, rhs);
        if (calOverride === undefined) throw new Error("没有定义对于" + lhs.constructor.name + "和" + rhs.constructor.name + "类型的" + operator + "运算符！");
        return calOverride(lhs, rhs);
    }
}

/**等式右边的表达式，根据类型需要做转换，从而实现值复制 */
function __Get(val) {
    switch (val.constructor.name) {
        case 'Vector2':
            return vec2(val);
        case 'Vector3':
            return vec3(val);
        case 'Vector4':
            return vec4(val);
        default:
            return val;
    }
}