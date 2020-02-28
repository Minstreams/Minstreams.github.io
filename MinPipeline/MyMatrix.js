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
        m12, m13, m14, m15
    ) {
        this.length = 16;
        for (let i = 0; i < 16; i++)this[i] = arguments[i];
    }

    /**默认空矩阵 */
    get Identity() {
        return new Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    /**平移矩阵 */
    SetTransition(v3) {
        this[12] = v3.x;
        this[13] = v3.y;
        this[14] = v3.z;
    }
    SetRotation(vec4) {
        if (vec4 === undefined) {
            // 欧拉角
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
            Quaternion out(
                sx * cy * cz - cx * sy * sz,
                cx * sy * cz + sx * cy * sz,
                cx * cy * sz - sx * sy * cz,
                cx * cy * cz + sx * sy * sz
            );
            out.Normalize();

        }
        //四元数
        let
            x2 = vec4.x * vec4.x,
            y2 = vec4.y * vec4.y,
            z2 = vec4.z * vec4.z,
            xy = vec4.x * vec4.y,
            xz = vec4.x * vec4.z,
            yz = vec4.y * vec4.z,
            wx = vec4.w * vec4.x,
            wy = vec4.w * vec4.y,
            wz = vec4.w * vec4.z;
        this.x = 1 - 2 * (y2 + z2);
        this[4] = 2 * (xy - wz);
        this[8] = 2 * (wy + xz);
        this.y = 2 * (xy + wz);
        this[5] = 1 - 2 * (x2 + z2);
        this[9] = 2 * (yz - wx);
        this.z = 2 * (xz - wy);
        this[6] = 2 * (wx + yz);
        this[10] = 1 - 2 * (x2 + y2);
    }
}


