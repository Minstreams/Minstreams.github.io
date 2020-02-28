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
        this.avater = {
            get self() { return d._x; },
            get x() { return d._x; },
            get r() { return d._x; },
            set self(val) { d._x = val; d.Boardcast("x"); },
            set x(val) { d._x = val; d.Boardcast("x"); },
            set r(val) { d._x = val; d.Boardcast("x"); },
        }
    }

    get x() { return this._x; }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, "x", "number"));
    }
}


//#region Vector2
/**给代码编辑器调用的接口 */
function vec2(x, y) {
    switch (arguments.length) {
        case 0: return new Vector2(0, 0);
        case 1:
            switch (x.constructor.name) {
                case 'Number': return new Vector2(x, x);
                case 'Vector2': return new Vector2(x.x, x.y);
            }
            break;
        case 2:
            if (x.constructor.name === 'Number' && y.constructor.name === 'Number') return new Vector2(x, y);
            break;
    }
    throw new Error("vec2()接收了不支持的参数类型!");
}
/**代码编辑器操作的实际数据类型 */
class Vector2 {
    constructor(x, y, callback) {
        this.length = 2;
        this[0] = x || 0;
        this[1] = y || 0;
        this._callback = callback || nullFunc;
    }
    // 运算符重载
    static __Negative(r) { return vec2(-r.x, -r.y); }
    static __Vec2AddNum(l, r) { return vec2(l.x + r, l.y + r); }
    static __Vec2MinNum(l, r) { return vec2(l.x - r, l.y - r); }
    static __Vec2MulNum(l, r) { return vec2(l.x * r, l.y * r); }
    static __Vec2DivNum(l, r) { return vec2(l.x / r, l.y / r); }
    static __NumAddVec2(l, r) { return vec2(l + r.x, l + r.y); }
    static __NumMinVec2(l, r) { return vec2(l - r.x, l - r.y); }
    static __NumMulVec2(l, r) { return vec2(l * r.x, l * r.y); }
    static __NumDivVec2(l, r) { return vec2(l / r.x, l / r.y); }
    static __Vec2AddVec2(l, r) { return vec2(l.x + r.x, l.y + r.y); }
    static __Vec2MinVec2(l, r) { return vec2(l.x - r.x, l.y - r.y); }
    static __Vec2MulVec2(l, r) { return vec2(l.x * r.x, l.y * r.y); }
    static __Vec2DivVec2(l, r) { return vec2(l.x / r.x, l.y / r.y); }

    get x() { return this[0]; }
    get r() { return this[0]; }
    get y() { return this[1]; }
    get g() { return this[1]; }
    set x(val) { this[0] = val; this._callback('avater0'); }
    set r(val) { this[0] = val; this._callback('avater0'); }
    set y(val) { this[1] = val; this._callback('avater1'); }
    set g(val) { this[1] = val; this._callback('avater1'); }
    get self() { return vec2(this[0], this[1]); }
    get xy() { return vec2(this[0], this[1]); }
    get rg() { return vec2(this[0], this[1]); }
    set self(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.x = val;
                this.y = val;
                break;
            case 'Vector2':
                this.x = val.x;
                this.y = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set xy(val) { this.self = val; }
    set rg(val) { this.self = val; }
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
        let d = this;
        /**@type {Vector2} */
        this.avater = new Vector2(x || 0, y || 0, function (val) { d.Boardcast(val); });
    }

    get x() { return this.avater.x; }
    get y() { return this.avater.y; }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, 'avater0', "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, 'avater1', "avaterNumber"));
    }
}
//#endregion


//#region Vector3
function vec3(x, y, z) {
    let tx, ty, tz;
    switch (arguments.length) {
        case 0: return new Vector3(0, 0, 0);
        case 1:
            switch (x.constructor.name) {
                case 'Number': return new Vector3(x, x, x);
                case 'Vector3': return new Vector3(x.x, x.y, x.z);
            }
            break;
        case 2:
            tx = x.constructor.name;
            ty = y.constructor.name;
            if (tx === 'Vector2' && ty === 'Number') return new Vector3(x.x, x.y, y);
            if (tx === 'Number' && ty === 'Vector2') return new Vector3(x, y.x, y.y);
            break;
        case 3:
            tx = x.constructor.name;
            ty = y.constructor.name;
            tz = z.constructor.name;
            if (tx === 'Number' && ty === 'Number' && tz === 'Number') return new Vector3(x, y, z);
            break;
    }
    throw new Error("vec3()接收了不支持的参数类型!");
}
class Vector3 {
    constructor(x, y, z, callback) {
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this._callback = callback || nullFunc;
    }

    // 运算符重载
    static __Negative(r) { return vec3(-r.x, -r.y, -r.z); }
    static __Vec3AddNum(l, r) { return vec3(l.x + r, l.y + r, l.z + r); }
    static __Vec3MinNum(l, r) { return vec3(l.x - r, l.y - r, l.z - r); }
    static __Vec3MulNum(l, r) { return vec3(l.x * r, l.y * r, l.z * r); }
    static __Vec3DivNum(l, r) { return vec3(l.x / r, l.y / r, l.z / r); }
    static __NumAddVec3(l, r) { return vec3(l + r.x, l + r.y, l + r.z); }
    static __NumMinVec3(l, r) { return vec3(l - r.x, l - r.y, l - r.z); }
    static __NumMulVec3(l, r) { return vec3(l * r.x, l * r.y, l * r.z); }
    static __NumDivVec3(l, r) { return vec3(l / r.x, l / r.y, l / r.z); }
    static __Vec3AddVec3(l, r) { return vec3(l.x + r.x, l.y + r.y, l.z + r.z); }
    static __Vec3MinVec3(l, r) { return vec3(l.x - r.x, l.y - r.y, l.z - r.z); }
    static __Vec3MulVec3(l, r) { return vec3(l.x * r.x, l.y * r.y, l.z * r.z); }
    static __Vec3DivVec3(l, r) { return vec3(l.x / r.x, l.y / r.y, l.z / r.z); }

    // 访问器
    get x() { return this[0]; }
    get r() { return this[0]; }
    get y() { return this[1]; }
    get g() { return this[1]; }
    get z() { return this[2]; }
    get b() { return this[2]; }
    set x(val) { this[0] = val; this._callback('avater0'); }
    set r(val) { this[0] = val; this._callback('avater0'); }
    set y(val) { this[1] = val; this._callback('avater1'); }
    set g(val) { this[1] = val; this._callback('avater1'); }
    set z(val) { this[2] = val; this._callback('avater2'); }
    set b(val) { this[2] = val; this._callback('avater2'); }
    get xy() { return vec2(this[0], this[1]); }
    get rg() { return vec2(this[0], this[1]); }
    get xz() { return vec2(this[0], this[2]); }
    get rb() { return vec2(this[0], this[2]); }
    get yz() { return vec2(this[1], this[2]); }
    get gb() { return vec2(this[1], this[2]); }
    set xy(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.x = val;
                this.y = val;
                break;
            case 'Vector2':
                this.x = val.x;
                this.y = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set rg(val) { this.xy = val; }
    set xz(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.x = val;
                this.z = val;
                break;
            case 'Vector2':
                this.x = val.x;
                this.z = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set rb(val) { this.xz = val; }
    set yz(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.y = val;
                this.z = val;
                break;
            case 'Vector2':
                this.y = val.x;
                this.z = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set gb(val) { this.yz = val; }
    get self() { return vec3(this[0], this[1], this[2]); }
    get xyz() { return vec3(this[0], this[1], this[2]); }
    get rgb() { return vec3(this[0], this[1], this[2]); }
    set self(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.x = val;
                this.y = val;
                this.z = val;
                break;
            case 'Vector3':
                this.x = val.x;
                this.y = val.y;
                this.z = val.z;
                break;
            default:
                throw new Error("赋值给Vector3不兼容的数据类型" + val);
        }
    }
    set xyz(val) { this.self = val; }
    set rgb(val) { this.self = val; }

    static magnitude(v3) {
        let x = v3.x, y = v3.y, z = v3.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    static sqrMagnitude(v3) {
        let x = v3.x, y = v3.y, z = v3.z;
        return x * x + y * y + z * z;
    }
    static Normalize(v3) {
        let m = Vector3.magnitude(v3);
        let x = v3.x, y = v3.y, z = v3.z;
        x /= m;
        y /= m;
        z /= m;
        return vec3(x, y, z);
    }
    static Dot(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    }
    static Cross(lhs, rhs) {
        return vec3(
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x
        );
    }
    static Lerp(lhs, rhs, k) {
        let kp = 1 - k;
        return vec3(
            kp * lhs.x + k * rhs.x,
            kp * lhs.y + k * rhs.y,
            kp * lhs.z + k * rhs.z
        );
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
        let d = this;
        /**@type {Vector3} */
        this.avater = new Vector3(x || 0, y || 0, z || 0, function (val) { d.Boardcast(val); });
    }

    get x() { return this.avater.x; }
    get y() { return this.avater.y; }
    get z() { return this.avater.z; }

    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, 'avater0', "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, 'avater1', "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, 'avater2', "avaterNumber"));
    }
}
//#endregion


//#region Vector4
function vec4(x, y, z, w) {
    let tx, ty, tz, tw;
    switch (arguments.length) {
        case 0: return new Vector4(0, 0, 0, 0);
        case 1:
            tx = x.constructor.name;
            if (tx === 'Vector4') return new Vector4(x.x, x.y, x.z, x.w);
            if (tx === 'Number') return new Vector4(x, x, x, x);
            break;
        case 2:
            tx = x.constructor.name;
            ty = y.constructor.name;
            if (tx === 'Vector3' && ty === 'Number') return new Vector4(x.x, x.y, x.z, y);
            if (tx === 'Vector2' && ty === 'Vector2') return new Vector4(x.x, x.y, y.x, y.y);
            if (tx === 'Number' && ty === 'Vector3') return new Vector4(x, y.x, y.y, y.z);
            break;
        case 3:
            tx = x.constructor.name;
            ty = y.constructor.name;
            tz = z.constructor.name;
            if (tx === 'Vector2' && ty === 'Number' && tz === 'Number') return new Vector4(x.x, x.y, y, z);
            if (tx === 'Number' && ty === 'Vector2' && tz === 'Number') return new Vector4(x, y.x, y.y, z);
            if (tx === 'Number' && ty === 'Number' && tz === 'Vector2') return new Vector4(x, y, z.x, z.y);
            break;
        case 4:
            tx = x.constructor.name;
            ty = y.constructor.name;
            tz = z.constructor.name;
            tw = w.constructor.name;
            if (tx === 'Number' && ty === 'Number' && tz === 'Number' && tw === 'Number') return new Vector4(x, y, z, w);
            break;
    }
    throw new Error("vec4无法识别的构造参数类型！");
}

class Vector4 {
    constructor(x, y, z, w, callback) {
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
        this._callback = callback || nullFunc;
    }

    // 运算符重载
    static __Negative(r) { return vec4(-r.x, -r.y, -r.z, -r.w); }
    static __Vec4AddNum(l, r) { return vec4(l.x + r, l.y + r, l.z + r, l.w + r); }
    static __Vec4MinNum(l, r) { return vec4(l.x - r, l.y - r, l.z - r, l.w - r); }
    static __Vec4MulNum(l, r) { return vec4(l.x * r, l.y * r, l.z * r, l.w * r); }
    static __Vec4DivNum(l, r) { return vec4(l.x / r, l.y / r, l.z / r, l.w / r); }
    static __NumAddVec4(l, r) { return vec4(l + r.x, l + r.y, l + r.z, l + r.w); }
    static __NumMinVec4(l, r) { return vec4(l - r.x, l - r.y, l - r.z, l - r.w); }
    static __NumMulVec4(l, r) { return vec4(l * r.x, l * r.y, l * r.z, l * r.w); }
    static __NumDivVec4(l, r) { return vec4(l / r.x, l / r.y, l / r.z, l / r.w); }
    static __Vec4AddVec4(l, r) { return vec4(l.x + r.x, l.y + r.y, l.z + r.z, l.w + r.w); }
    static __Vec4MinVec4(l, r) { return vec4(l.x - r.x, l.y - r.y, l.z - r.z, l.w - r.w); }
    static __Vec4MulVec4(l, r) { return vec4(l.x * r.x, l.y * r.y, l.z * r.z, l.w * r.w); }
    static __Vec4DivVec4(l, r) { return vec4(l.x / r.x, l.y / r.y, l.z / r.z, l.w / r.w); }

    // 访问器
    get x() { return this[0]; }
    get r() { return this[0]; }
    get y() { return this[1]; }
    get g() { return this[1]; }
    get z() { return this[2]; }
    get b() { return this[2]; }
    get w() { return this[3]; }
    get a() { return this[3]; }
    set x(val) { this[0] = val; this._callback('avater0'); }
    set r(val) { this[0] = val; this._callback('avater0'); }
    set y(val) { this[1] = val; this._callback('avater1'); }
    set g(val) { this[1] = val; this._callback('avater1'); }
    set z(val) { this[2] = val; this._callback('avater2'); }
    set b(val) { this[2] = val; this._callback('avater2'); }
    set w(val) { this[3] = val; this._callback('avater3'); }
    set a(val) { this[3] = val; this._callback('avater3'); }
    get xy() { return vec2(this[0], this[1]); }
    get rg() { return vec2(this[0], this[1]); }
    get xz() { return vec2(this[0], this[2]); }
    get rb() { return vec2(this[0], this[2]); }
    get yz() { return vec2(this[1], this[2]); }
    get gb() { return vec2(this[1], this[2]); }
    get xw() { return vec2(this[0], this[3]); }
    get ra() { return vec2(this[0], this[3]); }
    get yw() { return vec2(this[1], this[3]); }
    get ga() { return vec2(this[1], this[3]); }
    get zw() { return vec2(this[2], this[3]); }
    get ba() { return vec2(this[2], this[3]); }
    set xy(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.x = val;
                this.y = val;
                break;
            case 'Vector2':
                this.x = val.x;
                this.y = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set rg(val) { this.xy = val; }
    set xz(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.x = val;
                this.z = val;
                break;
            case 'Vector2':
                this.x = val.x;
                this.z = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set rb(val) { this.xz = val; }
    set yz(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.y = val;
                this.z = val;
                break;
            case 'Vector2':
                this.y = val.x;
                this.z = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set gb(val) { this.yz = val; }
    set xw(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.x = val;
                this.w = val;
                break;
            case 'Vector2':
                this.x = val.x;
                this.w = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set ra(val) { this.xw = val; }
    set yw(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.y = val;
                this.w = val;
                break;
            case 'Vector2':
                this.y = val.x;
                this.w = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set ga(val) { this.yw = val; }
    set zw(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.z = val;
                this.w = val;
                break;
            case 'Vector2':
                this.z = val.x;
                this.w = val.y;
                break;
            default:
                throw new Error("赋值给Vector2不兼容的数据类型" + val);
        }
    }
    set ba(val) { this.zw = val; }
    get xyz() { return vec3(this[0], this[1], this[2]); }
    get rgb() { return vec3(this[0], this[1], this[2]); }
    set xyz(val) {
        switch (val.constructor.name) {
            case 'Number':
                this.x = val;
                this.y = val;
                this.z = val;
                break;
            case 'Vector3':
                this.x = val.x;
                this.y = val.y;
                this.z = val.z;
                break;
            default:
                throw new Error("赋值给Vector3不兼容的数据类型" + val);
        }
    }
    set rgb(val) { this.self = val; }
    get self() { return vec4(this[0], this[1], this[2], this[3]); }
    get xyzw() { return vec4(this[0], this[1], this[2], this[3]); }
    get rgba() { return vec4(this[0], this[1], this[2], this[3]); }
    set self(val) {
        switch (val.constructor.name) {
            case 'Vector4':
                this.x = val.x;
                this.y = val.y;
                this.z = val.z;
                this.w = val.w;
                break;
            default:
                throw new Error("赋值给vec4不兼容的数据类型" + val);
        }
    }
    set xyzw(val) { this.self = val; }
    set rgba(val) { this.self = val; }
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
        let d = this;
        this.avater = new Vector4(x || 0, y || 0, z || 0, w || 0, function (val) { d.Boardcast(val); });
    }

    get x() { return this.avater.x; }
    get y() { return this.avater.y; }
    get z() { return this.avater.z; }
    get w() { return this.avater.w; }


    LoadUI(contentDiv) {
        super.LoadUI(contentDiv);
        contentDiv.append($("<div></div>").BindProperty(this, 'avater0', "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, 'avater1', "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, 'avater2', "avaterNumber"));
        contentDiv.append($("<div></div>").BindProperty(this, 'avater3', "avaterNumber"));
    }
}
//#endregion


var Quaternion = {
    /**转换为欧拉角 */
    ToEulerAngle(v4) {
        let x = v4.x,
            y = v4.y,
            z = v4.z,
            w = v4.w;
        return vec3(
            Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)),
            Math.asin(2 * (w * y - z * x)),
            Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z))
        );
    },
    /**取模 */
    magnitude(v4) {
        let x = v4.x,
            y = v4.y,
            z = v4.z,
            w = v4.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    },
    sqrMagnitude(v4) {
        let x = v4.x,
            y = v4.y,
            z = v4.z,
            w = v4.w;
        return x * x + y * y + z * z + w * w;
    },
    //归一化
    Normalize(v4) {
        let x = v4.x,
            y = v4.y,
            z = v4.z,
            w = v4.w;
        let n = Quaternion.magnitude(v4);
        x /= n;
        y /= n;
        z /= n;
        w /= n;
        return vec4(x, y, z, w);
    },
    //用欧拉角创建四元数
    Euler(v3) {
        let x = v3.x,
            y = v3.y,
            z = v3.z;
        x = wrap180(x);
        y = wrap180(y);
        z = wrap180(z);
        x /= PID;
        y /= PID;
        z /= PID;
        let
            sx = Math.sin(x),
            cx = Math.cos(x),
            sy = Math.sin(y),
            cy = Math.cos(y),
            sz = Math.sin(z),
            cz = Math.cos(z);
        return Quaternion.Normalize(
            vec4(
                sx * cy * cz - cx * sy * sz,
                cx * sy * cz + sx * cy * sz,
                cx * cy * sz - sx * sy * cz,
                cx * cy * cz + sx * sy * sz
            ));
    },
    EulerX(x) {
        x /= PID;
        let
            sx = Math.sin(x),
            cx = Math.cos(x);
        return vec4(
            sx,
            0,
            0,
            cx
        );
    },
    EulerY(y) {
        y /= PID;
        let
            sy = Math.sin(y),
            cy = Math.cos(y);
        return vec4(
            0,
            sy,
            0,
            cy
        );
    },
    EulerZ(z) {
        z /= PID;
        let
            sz = Math.sin(z),
            cz = Math.cos(z);
        return vec4(
            0,
            0,
            sz,
            cz
        );
    },
    //绕定轴旋转
    RotationAround(u, angle) {
        Vector3.Normalize(u);
        angle /= PID;
        let sinA = Math.sin(angle);
        return vec4(
            u.x * sinA,
            u.y * sinA,
            u.z * sinA,
            Math.cos(angle)
        );
    },
    LookAtRotation(forward, up) {
        up = up || vec3(0, 1, 0);
        forward = Vector3.Normalize(forward);
        up = Vector3.Normalize(up);
        let right = Vector3.Cross(forward, up);
        up = Vector3.Cross(right, forward);
        let m = Matrix.VectorAsRow(right, up, -forward);
        return Matrix.GetRotation(m);
    },
    /**输入为两个方向 */
    FromToRotation(from, to) {
        from = Vector3.Normalize(from);
        to = Vector3.Normalize(to);
        let axis = Vector3.Cross(from, to);
        return vec4(axis.x, axis.y, axis.z, Vector3.Dot(from, to));
    },
    //点积
    Dot(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z + lhs.w * rhs.w;
    },
    //角度
    Angle(lhs, rhs) {
        let out = 2 * Math.acos(Quaternion.Dot(lhs, rhs) /*/ (lhs.Length*rhs.Length)*/);
        return out;
    },
    //线性插值
    Lerp(lhs, rhs, t) {
        return Quaternion.Normalize(vec4(
            (1 - t) * lhs.x + t * rhs.x,
            (1 - t) * lhs.y + t * rhs.y,
            (1 - t) * lhs.z + t * rhs.z,
            (1 - t) * lhs.w + t * rhs.w));
    },
    /**球形插值
     * @param {Vector4} lhs
     * @param {Vector4} rhs
     * @param {number} t
     */
    Slerp(lhs, rhs, t) {

        let theta = Quaternion.Angle(lhs, rhs);
        if (theta < 0.001) {
            return lhs;
        }
        while (theta >= 2 * Math.PI) {
            let thetaT = theta - 2 * Math.PI;
            theta = thetaT;
        }
        let sintheta = Math.sin(theta);
        let out = Vector4.__Vec4AddVec4(Vector4.__Vec4MulNum(lhs, (sin((1 - t) * theta) / sintheta)), Vector4.__Vec4MulNum(rhs, (sin(t * theta) / sintheta)));
        return Quaternion.Normalize(out);
    },
    //共轭
    Inverse(v4) {
        let x = v4.x, y = v4.y, z = v4.z, w = v4.w;
        return vec4(-x, -y, -z, w);
    },
    //乘积
    Multiple(lhs, rhs) {
        let x = lhs.x, y = lhs.y, z = lhs.z, w = lhs.w;

        return vec4(
            x * rhs.w + w * rhs.x + y * rhs.z - z * rhs.y,
            y * rhs.w + w * rhs.y + z * rhs.x - x * rhs.z,
            z * rhs.w + w * rhs.z + x * rhs.y - y * rhs.x,
            w * rhs.w - x * rhs.x - y * rhs.y - z * rhs.z
        );
    },
    /**乘以向量
     * @param {Vector4} v4
     * @param {Vector3} u
     */
    Rotate(v4, u) {
        let x = v4.x, y = v4.y, z = v4.z, w = v4.w;
        let v = vec3(x, y, z);
        return Vector3.__Vec3AddVec3(Vector3.__Vec3AddVec3(Vector3.__Vec3MulNum(u, 2 * w * w - 1), Vector3.__Vec3MulNum(Vector3.Cross(v, u), 2 * w)), Vector3.__Vec3MulNum(v, 2 * Vector3.Dot(v, u)));
    },
    get Identity() { return vec4(0, 0, 0, 1); }
}