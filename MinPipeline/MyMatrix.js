const PID = 360 / Math.PI;
function InRange(i) {
    while (i > 180) i -= 360;
    while (i < -180) i += 360;
    return i;
}

function vec3(x, y, z) {
    return new Vector3(x, y, z);
}
class Vector3 {
    constructor(x, y, z) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        else if (y === undefined) {
            this.x = x;
            this.y = x;
            this.z = x;
        }
        else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    static magnitude(vec3) {
        let x = vec3.x, y = vec3.y, z = vec3.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    static sqrMagnitude(vec3) {
        let x = vec3.x, y = vec3.y, z = vec3.z;
        return x * x + y * y + z * z;
    }
    static Normalize(vec3) {
        let m = Vector3.magnitude(vec3);
        let x = vec3.x, y = vec3.y, z = vec3.z;
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
    add(rhs) { return Vector3.Add(this, rhs); }
    static Add(lhs, rhs) {
        return vec3(lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z);
    }
    multiple(rhs) { return Vector3.Multiple(this, rhs); }
    static Multiple(lhs, rhs) {
        return vec3(lhs.x * rhs, lhs.y * rhs, lhs.z * rhs);
    }
    static get up() { return vec3(0, 1, 0) }
    static get down() { return vec3(0, 1, 0) }
    static get left() { return vec3(-1, 0, 0) }
    static get right() { return vec3(1, 0, 0) }
    static get forward() { return vec3(0, 0, -1) }
    static get back() { return vec3(0, 0, 1) }
    static get zero() { return vec3(0, 0, 0) }
    static get one() { return vec3(1, 1, 1) }
}

class Matrix {
    constructor(
        m0, m1, m2, m3,
        m4, m5, m6, m7,
        m8, m9, m10, m11,
        m12, m13, m14, m15
    ) {
        if (m0 === undefined) {
            this.SetIdentity();
        }
        else {
            for (let i = 0; i < 16; i++)this[i] = arguments[i];
        }
    }

    /**默认空矩阵 */
    SetIdentity() {
        this.x = this[5] = this[10] = this[15] = 1;
        this.y = this.z = this.w = this[4] = this[6] = this[7] = this[8] = this[9] = this[11] = this[12] = this[13] = this[14] = 0;
    }
    /**平移矩阵 */
    SetTransition(vec3) {
        this[12] = vec3.x;
        this[13] = vec3.y;
        this[14] = vec3.z;
    }
    SetRotation(vec4) {
        if (vec4 === undefined) {
            // 欧拉角
            x = InRange(x);
            y = InRange(y);
            z = InRange(z);
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

function vec4(x, y, z, w) {
    return new Quaternion(x, y, z, w);
}
class Quaternion {
    constructor(x, y, z, w) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        }
        else if (y === undefined) {
            this.x = x;
            this.y = x;
            this.z = x;
            this.w = 1;
        }
        else if (w === undefined) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = 1;
        }
        else {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
    }
    //转换为欧拉角
    static ToEulerAngle(vec4) {
        let x = vec4.x,
            y = vec4.y,
            z = vec4.z,
            w = vec4.w;
        return vec3(
            Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)),
            Math.asin(2 * (w * y - z * x)),
            Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z))
        );
    }
    //取模
    static magnitude(vec4) {
        let x = vec4.x,
            y = vec4.y,
            z = vec4.z,
            w = vec4.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }
    static sqrMagnitude(vec4) {
        let x = vec4.x,
            y = vec4.y,
            z = vec4.z,
            w = vec4.w;
        return x * x + y * y + z * z + w * w;
    }
    //归一化
    static Normalize(vec4) {
        let x = vec4.x,
            y = vec4.y,
            z = vec4.z,
            w = vec4.w;
        let n = Quaternion.magnitude(vec4);
        x /= n;
        y /= n;
        z /= n;
        w /= n;
        return vec4(x, y, z, w);
    }
    //用欧拉角创建四元数
    static Euler(vec3) {
        let x = vec4.x,
            y = vec4.y,
            z = vec4.z;
        x = InRange(x);
        y = InRange(y);
        z = InRange(z);
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
    }
    static EulerX(x) {
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
    }
    static EulerY(y) {
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
    }
    static EulerZ(z) {
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
    }
    //绕定轴旋转
    static RotationAround(u, angle) {
        Vector3.Normalize(u);
        angle /= PID;
        let sinA = Math.sin(angle);
        return vec4(
            u.x * sinA,
            u.y * sinA,
            u.z * sinA,
            Math.cos(angle)
        );
    }
    static LookAtRotation(forward, up) {
        Vector3.Normalize(forward);
        Vector3.Normalize(up);
        let right = Vector3.Cross(forward, up);
        let m = Matrix.VectorAsRow(right, up, -forward);
        return Matrix.GetRotation(m);
    }
    static LookAtRotation(forward) {
        let forwardN = Vector3.Normalize(forward);
        let right = Vector3.Normalize(Vector3.Cross(forwardN, Vector3.up));
        let up = Vector3.Cross(right, forwardN);
        let m = Matrix.VectorAsRow(right, up, -forwardN);
        return m.GetRotation();
    }
    static FromToRotation(from, to) {
        let fromN = Vector3.Normalize(from);
        let toN = Vector3.Normalize(to);
        let axis = Vector3.Cross(from, to);
        return vec4(axis.x, axis.y, axis.z, Vector3.Dot(from, to));
    }
    //点积
    static Dot(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z + lhs.w * rhs.w;
    }
    //角度
    static Angle(lhs, rhs) {
        let out = 2 * Math.acos(Quaternion.Dot(lhs, rhs) /*/ (lhs.Length*rhs.Length)*/);
        return out;
    }
    //线性插值
    static Lerp(lhs, rhs, t) {
        return Quaternion.Normalize(vec4(
            (1 - t) * lhs.x + t * rhs.x,
            (1 - t) * lhs.y + t * rhs.y,
            (1 - t) * lhs.z + t * rhs.z,
            (1 - t) * lhs.w + t * rhs.w));
    }
    //球形插值
    static Slerp(lhs, rhs, t) {

        let theta = Quaternion.Angle(lhs, rhs);
        if (theta < 0.001) {
            return lhs;
        }
        while (theta >= 2 * Math.PI) {
            let thetaT = theta - 2 * Math.PI;
            theta = thetaT;
        }
        let sintheta = Math.sin(theta);
        let out = Quaternion.Add(lhs * (sin((1 - t) * theta) / sintheta), rhs * (sin(t * theta) / sintheta));
        return Quaternion.Normalize(out);
    }
    //共轭
    static Inverse(invec4) {
        let x = invec4.x, y = invec4.y, z = invec4.z, w = invec4.w;
        return vec4(-x, -y, -z, w);
    }
    static Add(lhs, rhs) {
        let x = lhs.x, y = lhs.y, z = lhs.z, w = lhs.w;
        return vec4(
            x + rhs.x,
            y + rhs.y,
            z + rhs.z,
            w + rhs.w
        );
    }
    //乘积
    static Multiple(lhs, rhs) {
        let x = lhs.x, y = lhs.y, z = lhs.z, w = lhs.w;
        if (typeof rhs == "number") {
            return vec4(x * rhs, y * rhs, z * rhs, w * rhs);
        }
        return vec4(
            x * rhs.w + w * rhs.x + y * rhs.z - z * rhs.y,
            y * rhs.w + w * rhs.y + z * rhs.x - x * rhs.z,
            z * rhs.w + w * rhs.z + x * rhs.y - y * rhs.x,
            w * rhs.w - x * rhs.x - y * rhs.y - z * rhs.z
        );
    }
    //乘以向量
    static Rotate(vec4, u) {
        let x = lhs.x, y = lhs.y, z = lhs.z, w = lhs.w;
        let v = vec3(x, y, z);
        return Vector3.Add(Vector3.Add(Vector3.Multiple(u, 2 * w * w - 1), Vector3.Multiple(Vector3.Cross(v, u), 2 * w)), Vector3.Multiple(v, 2 * Vector3.Dot(v, u)));
    }
    static get identity() { return [0, 0, 0, 1] }
}

