// Retrieved on 04/26/18 from:
// https://github.com/evanw/lightgl.js/blob/master/src/vector.js
// Last modified by Leo Alterman on 04/26/18
//
// Copyright (C) 2011 by Evan Wallace
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// Provides a simple 3D vector class. Vector operations can be done using member
// functions, which return new vectors, or static functions, which reuse
// existing vectors to avoid generating garbage.
//

// TODO(Leo) - Add op_() versions of each method for in-place modification

export default function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

// ### Instance Methods
// The methods `add()`, `subtract()`, `multiply()`, and `divide()` can all
// take either a vector or a number as an argument.
Vector.prototype = {
  negative() {
    return new Vector(-this.x, -this.y, -this.z);
  },
  add(v) {
    if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    else return new Vector(this.x + v, this.y + v, this.z + v);
  },
  subtract(v) {
    if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    else return new Vector(this.x - v, this.y - v, this.z - v);
  },
  multiply(v) {
    if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    else return new Vector(this.x * v, this.y * v, this.z * v);
  },
  divide(v) {
    if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    else return new Vector(this.x / v, this.y / v, this.z / v);
  },
  equals(v) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  },
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  cross(v) {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  },
  length() {
    return Math.sqrt(this.dot(this));
  },
  unit() {
    return this.divide(this.length());
  },
  min() {
    return Math.min(Math.min(this.x, this.y), this.z);
  },
  max() {
    return Math.max(Math.max(this.x, this.y), this.z);
  },
  toAngles() {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.length()),
    };
  },
  angleTo(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  },
  toArray(n) {
    return [this.x, this.y, this.z].slice(0, n || 3);
  },
  clone() {
    return new Vector(this.x, this.y, this.z);
  },
  init(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  },
};

// ### Static Methods
// `Vector.randomDirection()` returns a vector with a length of 1 and a
// statistically uniform direction. `Vector.lerp()` performs linear
// interpolation between two vectors.
Vector.negative = function (a, b) {
  b.x = -a.x;
  b.y = -a.y;
  b.z = -a.z;
  return b;
};
Vector.add = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x + b.x;
    c.y = a.y + b.y;
    c.z = a.z + b.z;
  } else {
    c.x = a.x + b;
    c.y = a.y + b;
    c.z = a.z + b;
  }
  return c;
};
Vector.subtract = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x - b.x;
    c.y = a.y - b.y;
    c.z = a.z - b.z;
  } else {
    c.x = a.x - b;
    c.y = a.y - b;
    c.z = a.z - b;
  }
  return c;
};
Vector.multiply = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x * b.x;
    c.y = a.y * b.y;
    c.z = a.z * b.z;
  } else {
    c.x = a.x * b;
    c.y = a.y * b;
    c.z = a.z * b;
  }
  return c;
};
Vector.divide = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x / b.x;
    c.y = a.y / b.y;
    c.z = a.z / b.z;
  } else {
    c.x = a.x / b;
    c.y = a.y / b;
    c.z = a.z / b;
  }
  return c;
};
Vector.cross = function (a, b, c) {
  c.x = a.y * b.z - a.z * b.y;
  c.y = a.z * b.x - a.x * b.z;
  c.z = a.x * b.y - a.y * b.x;
  return c;
};
Vector.unit = function (a, b) {
  const length = a.length();
  b.x = a.x / length;
  b.y = a.y / length;
  b.z = a.z / length;
  return b;
};
Vector.fromAngles = function (theta, phi) {
  return new Vector(
    Math.cos(theta) * Math.cos(phi),
    Math.sin(phi),
    Math.sin(theta) * Math.cos(phi)
  );
};
Vector.randomDirection = function () {
  return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
};
Vector.min = function (a, b) {
  return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};
Vector.max = function (a, b) {
  return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};
Vector.lerp = function (a, b, fraction) {
  return b.subtract(a).multiply(fraction).add(a);
};
Vector.fromArray = function (a) {
  return new Vector(a[0], a[1], a[2]);
};
Vector.angleBetween = function (a, b) {
  return a.angleTo(b);
};
