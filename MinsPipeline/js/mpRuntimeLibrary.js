/**管线运行时库
 * 包含特殊数据结构的定义，运行时的方法
 * 
 * 不应该依赖基础库外的任何文件
 */
const _PID = 360 / Math.PI;

//#region Vector
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
    /**@param {number} x x
     * @param {number} y y
     */
    constructor(x, y) {
        this._x = x || 0;
        this._y = y || 0;
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


    // 访问器
    get length() { return 2; }
    get x() { return this._x; }
    get r() { return this._x; }
    get 0() { return this._x; }
    get y() { return this._y; }
    get g() { return this._y; }
    get 1() { return this._y; }
    set x(val) { this._x = val; }
    set r(val) { this._x = val; }
    set y(val) { this._y = val; }
    set g(val) { this._y = val; }
    get self() { return vec2(this._x, this._y); }
    get xy() { return vec2(this._x, this._y); }
    get rg() { return vec2(this._x, this._y); }
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

    static Lerp(lhs, rhs, k) {
        let kp = 1 - k;
        return vec2(
            kp * lhs.x + k * rhs.x,
            kp * lhs.y + k * rhs.y
        );
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
    /**@param {number} x x
     * @param {number} y y
     * @param {number} z z
     */
    constructor(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
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
    get length() { return 3; }
    get x() { return this._x; }
    get r() { return this._x; }
    get 0() { return this._x; }
    get y() { return this._y; }
    get g() { return this._y; }
    get 1() { return this._y; }
    get z() { return this._z; }
    get b() { return this._z; }
    get 2() { return this._z; }
    set x(val) { this._x = val; }
    set r(val) { this._x = val; }
    set y(val) { this._y = val; }
    set g(val) { this._y = val; }
    set z(val) { this._z = val; }
    set b(val) { this._z = val; }
    get xy() { return vec2(this._x, this._y); }
    get rg() { return vec2(this._x, this._y); }
    get xz() { return vec2(this._x, this._z); }
    get rb() { return vec2(this._x, this._z); }
    get yz() { return vec2(this._y, this._z); }
    get gb() { return vec2(this._y, this._z); }
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
    get self() { return vec3(this._x, this._y, this._z); }
    get xyz() { return vec3(this._x, this._y, this._z); }
    get rgb() { return vec3(this._x, this._y, this._z); }
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
    /**@param {number} x x
     * @param {number} y y
     * @param {number} z z
     * @param {number} w w
     */
    constructor(x, y, z, w) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
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
    get length() { return 4; }
    get x() { return this._x; }
    get r() { return this._x; }
    get 0() { return this._x; }
    get y() { return this._y; }
    get g() { return this._y; }
    get 1() { return this._y; }
    get z() { return this._z; }
    get b() { return this._z; }
    get 2() { return this._z; }
    get w() { return this._w; }
    get a() { return this._w; }
    get 3() { return this._w; }
    set x(val) { this._x = val; }
    set r(val) { this._x = val; }
    set y(val) { this._y = val; }
    set g(val) { this._y = val; }
    set z(val) { this._z = val; }
    set b(val) { this._z = val; }
    set w(val) { this._w = val; }
    set a(val) { this._w = val; }
    get xy() { return vec2(this._x, this._y); }
    get rg() { return vec2(this._x, this._y); }
    get xz() { return vec2(this._x, this._z); }
    get rb() { return vec2(this._x, this._z); }
    get yz() { return vec2(this._y, this._z); }
    get gb() { return vec2(this._y, this._z); }
    get xw() { return vec2(this._x, this._w); }
    get ra() { return vec2(this._x, this._w); }
    get yw() { return vec2(this._y, this._w); }
    get ga() { return vec2(this._y, this._w); }
    get zw() { return vec2(this._z, this._w); }
    get ba() { return vec2(this._z, this._w); }
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
    get xyz() { return vec3(this._x, this._y, this._z); }
    get rgb() { return vec3(this._x, this._y, this._z); }
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
    get self() { return vec4(this._x, this._y, this._z, this._w); }
    get xyzw() { return vec4(this._x, this._y, this._z, this._w); }
    get rgba() { return vec4(this._x, this._y, this._z, this._w); }
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

    static Normalize(v4) {
        let ww = Math.abs(v4.w);
        return vec4(v4.x / ww, v4.y / ww, v4.z / ww, v4.w > 0 ? 1 : -1);
    }
}
//#endregion
//#endregion

/**各种四元数方法 */
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
        x /= _PID;
        y /= _PID;
        z /= _PID;
        let
            sx = Math.sin(x),
            cx = Math.cos(x),
            sy = Math.sin(y),
            cy = Math.cos(y),
            sz = Math.sin(z),
            cz = Math.cos(z);
        return Quaternion.Normalize(
            vec4(
                sx * cy * cz + cx * sy * sz,
                cx * sy * cz - sx * cy * sz,
                cx * cy * sz + sx * sy * cz,
                cx * cy * cz + sx * sy * sz
            ));
    },
    EulerX(x) {
        x /= _PID;
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
        y /= _PID;
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
        z /= _PID;
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
        angle /= _PID;
        let sinA = Math.sin(angle);
        return vec4(
            u.x * sinA,
            u.y * sinA,
            u.z * sinA,
            Math.cos(angle)
        );
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
        m12, m13, m14, m15
    ) {
        this._m = new Array(16);
        for (let i = 0; i < 16; i++)this._m[i] = arguments[i];
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
            m[0] * r.x + m[1] * r.y + m[2] * r.z + m[3] * r.w,
            m[4] * r.x + m[5] * r.y + m[6] * r.z + m[7] * r.w,
            m[8] * r.x + m[9] * r.y + m[10] * r.z + m[11] * r.w,
            m[12] * r.x + m[13] * r.y + m[14] * r.z + m[15] * r.w
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
    set 0(val) { this._m[0] = val; }
    set 1(val) { this._m[1] = val; }
    set 2(val) { this._m[2] = val; }
    set 3(val) { this._m[3] = val; }
    set 4(val) { this._m[4] = val; }
    set 5(val) { this._m[5] = val; }
    set 6(val) { this._m[6] = val; }
    set 7(val) { this._m[7] = val; }
    set 8(val) { this._m[8] = val; }
    set 9(val) { this._m[9] = val; }
    set 10(val) { this._m[10] = val; }
    set 11(val) { this._m[11] = val; }
    set 12(val) { this._m[12] = val; }
    set 13(val) { this._m[13] = val; }
    set 14(val) { this._m[14] = val; }
    set 15(val) { this._m[15] = val; }
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
    static get Identity() {
        return new Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    /**应用Vector作为平移矩阵 */
    SetTransition(v3) {
        this[3] = v3.x;
        this[7] = v3.y;
        this[11] = v3.z;
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
    static GetRotation(m) {
        let w = 0.5 * Math.sqrt(1 + m[0] + m[5] + m[10]);
        let t = 1.0 / (4 * w);
        return Quaternion.Normalize(vec4(
            (m[6] - m[9]) * t,
            (m[8] - m[2]) * t,
            (m[1] - m[4]) * t,
            w));
    }
    /**求逆矩阵,通过观察得到的，特化适用于只有平移和旋转功能的变换矩阵 */
    static Reverse(m) {
        if (m[12] !== 0 || m[13] !== 0 || m[14] !== 0 || m[15] !== 1) {
            throw new Error("这不是平移旋转矩阵，我不知道怎么算！")
        }
        return matrix(
            m[0], m[4], m[8], -m[0] * m[3] - m[4] * m[7] - m[8] * m[11],
            m[1], m[5], m[9], -m[1] * m[3] - m[5] * m[7] - m[9] * m[11],
            m[2], m[6], m[10], -m[2] * m[3] - m[6] * m[7] - m[10] * m[11],
            0, 0, 0, 1
        );
    }
    static Conjugate(m) {
        return matrix(
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[14]
        );
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
    /**正交投影矩阵的复杂版
     * @param {number} l x下界,left
     * @param {number} r x上界,right
     * @param {number} b y下界,bottom
     * @param {number} t y上界,top
     * @param {number} n 深度下界，正数,near
     * @param {number} f 深度上界，正数，大于n,far
     */
    static OrthographicProjectionAdvanced(l, r, b, t, n, f) {
        return matrix(
            2 / (r - l), 0, 0, -(r + l) / (r - l),
            0, 2 / (t - b), 0, -(t + b) / (t - b),
            0, 0, 1 / (f - n), -n / (f - n),
            0, 0, 0, 1
        );
    }
    /**正交投影矩阵的简化版
     * @param {number} w 视野宽度,width
     * @param {number} h 视野高度,height
     * @param {number} n 深度下界，正数,near
     * @param {number} f 深度上界，正数，大于n,far
     */
    static OrthographicProjection(w, h, n, f) {
        return matrix(
            2 / w, 0, 0, 0,
            0, 2 / h, 0, 0,
            0, 0, 1 / (f - n), -n / (f - n),
            0, 0, 0, 1
        );
    }
    /**透视投影矩阵的复杂版
         * @param {number} l x下界,left
         * @param {number} r x上界,right
         * @param {number} b y下界,bottom
         * @param {number} t y上界,top
         * @param {number} n 深度下界，正数,near
         * @param {number} f 深度上界，正数，大于n,far
         */
    static PerspectiveProjectionAdvanced(l, r, b, t, n, f) {
        return matrix(
            2 * n / (r - l), 0, -(r + l) / (r - l), 0,
            0, 2 * n / (t - b), -(t + b) / (t - b), 0,
            0, 0, f / (f - n), -f * n / (f - n),
            0, 0, 1, 0
        );
    }
    /**透视投影矩阵的简化版
     * @param {number} w 视野宽度,width
     * @param {number} h 视野高度,height
     * @param {number} n 深度下界，正数,near
     * @param {number} f 深度上界，正数，大于n,far
     */
    static PerspectiveProjection(w, h, n, f) {
        return matrix(
            2 * n / w, 0, 0, 0,
            0, 2 * n / h, 0, 0,
            0, 0, f / (f - n), -f * n / (f - n),
            0, 0, 1, 0
        );
    }
    /**垂直可视范围角度a和横纵比ar构成的透视投影矩阵
         * @param {number} a 垂直可视范围角度,angle
         * @param {number} ar 横纵比,aspect ratio
         * @param {number} n 深度下界，正数,near
         * @param {number} f 深度上界，正数，大于n,far
         */
    static PerspectiveProjectionAspect(a, ar, n, f) {
        let cota_2 = 1 / Math.tan(a / 2);
        return matrix(
            cota_2 / ar, 0, 0, 0,
            0, cota_2, 0, 0,
            0, 0, f / (f - n), -f * n / (f - n),
            0, 0, 1, 0
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