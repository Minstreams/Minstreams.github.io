const PID = 360 / Math.PI;

function matrix() {
    switch (arguments.length) {
        case 0:
            return Matrix.Identity;
        case 1:
            let ta = arguments[0].constructor.name;
            let a = arguments[0];
            switch (ta) {
                case 'Number': return new Matrix(a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a);
                case 'Matrix': return new Matrix(...Array.from(a));
            }
            break;
        case 4:
            if (Array.from(arguments).every(function (val, i) { return val.constructor.name === 'Vector4' }))
                return new Matrix(
                    arguments[0].x, arguments[0].y, arguments[0].z, arguments[0].w,
                    arguments[1].x, arguments[1].y, arguments[1].z, arguments[1].w,
                    arguments[2].x, arguments[2].y, arguments[2].z, arguments[2].w,
                    arguments[3].x, arguments[3].y, arguments[3].z, arguments[3].w);
            break;
        case 16:
            if (Array.from(arguments).every(function (val, i) { return val.constructor.name === 'Number' }))
                return new Matrix(...Array.from(arguments));
            break;
    }
    throw new Error("matrix()接收了不支持的参数类型!");
}

class Matrix {
    constructor(
        m0, m1, m2, m3,
        m4, m5, m6, m7,
        m8, m9, m10, m11,
        m12, m13, m14, m15, callback
    ) {
        this._m = new Array(16);
        for (let i = 0; i < 16; i++)this._m[i] = arguments[i];
        this._callback = callback || nullFunc;
    }

    // 运算符重载
    static __MatMulMat(l, r) {
        let out = Matrix.Identity;
        for (let ro = 0; ro < 4; ro++) {
            for (let c = 0; c < 4; c++) {
                let tmp = 0;
                for (let i = 0; i < 4; i++) {
                    tmp += l[ro * 4 + i] * r[i * 4 + c];
                }
                out[ro * 4 + c] = tmp;
            }
        }
        return out;
    }
    static __MatMulVec4(m, r) {
        return vec4(
            m[0] * rhs.x + m[1] * rhs.y + m[2] * rhs.z + m[3] * rhs.w,
            m[4] * rhs.x + m[5] * rhs.y + m[6] * rhs.z + m[7] * rhs.w,
            m[8] * rhs.x + m[9] * rhs.y + m[10] * rhs.z + m[11] * rhs.w,
            m[12] * rhs.x + m[13] * rhs.y + m[14] * rhs.z + m[15] * rhs.w
        );
    }

    // 访问器
    get length() { return 16; }
    get _m0() { return this._m[0]; }
    get _m1() { return this._m[1]; }
    get _m2() { return this._m[2]; }
    get _m3() { return this._m[3]; }
    get _m4() { return this._m[4]; }
    get _m5() { return this._m[5]; }
    get _m6() { return this._m[6]; }
    get _m7() { return this._m[7]; }
    get _m8() { return this._m[8]; }
    get _m9() { return this._m[9]; }
    get _m10() { return this._m[10]; }
    get _m11() { return this._m[11]; }
    get _m12() { return this._m[12]; }
    get _m13() { return this._m[13]; }
    get _m14() { return this._m[14]; }
    get _m15() { return this._m[15]; }
    set _m0(val) { this._m[0] = val; }
    set _m1(val) { this._m[1] = val; }
    set _m2(val) { this._m[2] = val; }
    set _m3(val) { this._m[3] = val; }
    set _m4(val) { this._m[4] = val; }
    set _m5(val) { this._m[5] = val; }
    set _m6(val) { this._m[6] = val; }
    set _m7(val) { this._m[7] = val; }
    set _m8(val) { this._m[8] = val; }
    set _m9(val) { this._m[9] = val; }
    set _m10(val) { this._m[10] = val; }
    set _m11(val) { this._m[11] = val; }
    set _m12(val) { this._m[12] = val; }
    set _m13(val) { this._m[13] = val; }
    set _m14(val) { this._m[14] = val; }
    set _m15(val) { this._m[15] = val; }
    get 0() { return this._m[0]; }
    get 1() { return this._m[1]; }
    get 2() { return this._m[2]; }
    get 3() { return this._m[3]; }
    get 4() { return this._m[4]; }
    get 5() { return this._m[5]; }
    get 6() { return this._m[6]; }
    get 7() { return this._m[7]; }
    get 8() { return this._m[8]; }
    get 9() { return this._m[9]; }
    get 10() { return this._m[10]; }
    get 11() { return this._m[11]; }
    get 12() { return this._m[12]; }
    get 13() { return this._m[13]; }
    get 14() { return this._m[14]; }
    get 15() { return this._m[15]; }
    set 0(val) { this._m[0] = val; this._callback('m0'); }
    set 1(val) { this._m[1] = val; this._callback('m1'); }
    set 2(val) { this._m[2] = val; this._callback('m2'); }
    set 3(val) { this._m[3] = val; this._callback('m3'); }
    set 4(val) { this._m[4] = val; this._callback('m4'); }
    set 5(val) { this._m[5] = val; this._callback('m5'); }
    set 6(val) { this._m[6] = val; this._callback('m6'); }
    set 7(val) { this._m[7] = val; this._callback('m7'); }
    set 8(val) { this._m[8] = val; this._callback('m8'); }
    set 9(val) { this._m[9] = val; this._callback('m9'); }
    set 10(val) { this._m[10] = val; this._callback('m10'); }
    set 11(val) { this._m[11] = val; this._callback('m11'); }
    set 12(val) { this._m[12] = val; this._callback('m12'); }
    set 13(val) { this._m[13] = val; this._callback('m13'); }
    set 14(val) { this._m[14] = val; this._callback('m14'); }
    set 15(val) { this._m[15] = val; this._callback('m15'); }
    get self() { return this; }
    set self(val) {
        switch (val.constructor.name) {
            case 'Matrix':
                for (let i = 0; i < 16; i++)this[i] = val[i];
                return;
        }
        throw new Error("赋值给Matrix不兼容的数据类型！")
    }

    /**默认空矩阵 */
    get Identity() {
        return new Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    /**应用Vector作为平移矩阵 */
    SetTransition(v3) {
        this[12] = v3.x;
        this[13] = v3.y;
        this[14] = v3.z;
    }
    /**应用四元数作为旋转矩阵 */
    SetRotation(v4) {
        let
            x2 = v4.x * v4.x,
            y2 = v4.y * v4.y,
            z2 = v4.z * v4.z,
            xy = v4.x * v4.y,
            xz = v4.x * v4.z,
            yz = v4.y * v4.z,
            wx = v4.w * v4.x,
            wy = v4.w * v4.y,
            wz = v4.w * v4.z;
        this._m[0] = 1 - 2 * (y2 + z2);
        this._m[4] = 2 * (xy - wz);
        this._m[8] = 2 * (wy + xz);
        this._m[1] = 2 * (xy + wz);
        this._m[5] = 1 - 2 * (x2 + z2);
        this._m[9] = 2 * (yz - wx);
        this._m[2] = 2 * (xz - wy);
        this._m[6] = 2 * (wx + yz);
        this._m[10] = 1 - 2 * (x2 + y2);
    }
    /**获取四元数 */
    GetRotation() {
        let m = this._m;
        let w = 0.5 * Math.sqrt(1 + m[0] + m[5] + m[10]);
        let t = 1.0 / (4 * w);
        return Quaternion.Normalize(vec4(
            (m[6] - m[9]) * t,
            (m[8] - m[2]) * t,
            (m[1] - m[4]) * t,
            w));
    }
    /**求逆矩阵 */
    static Reverse(mat) {
        throw new Error("Matrix.Reverse方法未实现！");
    }
    /**取四个向量作为列向量 */
    static FromColumns(v1, v2, v3, v4) {
        v4 = v4 || vec4(0, 0, 0, 1);
        return matrix(
            v1.x, v2.x, v3.x, v4.x,
            v1.y, v2.y, v3.y, v4.y,
            v1.z, v2.z, v3.z, v4.z,
            v1.w, v2.w, v3.w, v4.w
        );
    }
}

// 补充的高级四元数方法
Quaternion.LookAtRotation = function (forward, up) {
    up = up || vec3(0, 1, 0);
    forward = Vector3.Normalize(forward);
    up = Vector3.Normalize(up);
    let right = Vector3.Cross(forward, up);
    up = Vector3.Cross(right, forward);
    let m = Matrix.VectorAsRow(right, up, -forward);
    return Matrix.GetRotation(m);
}

/**@name 矩阵数据项
 * @description 一个4*4矩阵
 */
class BufferDataMatrix extends BufferDataPrototype {
    /**@param {string} name Buffer数据项名称
     * @param {string} description Buffer数据项描述
     * @param {Array} m 矩阵，长度为16
     */
    constructor(name, description, m) {
        super(name, description);
        let d = this;
        m = m || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.avater = new Matrix(...m, function (val) { d.Boardcast(val); });
    }
    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, "m0", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m1", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m2", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m3", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m4", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m5", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m6", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m7", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m8", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m9", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m10", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m11", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m12", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m13", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m14", "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, "m15", "avaterNumber"));
    }
}

