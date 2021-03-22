import Vector from './vector';

export class StrokeExtruder {
  constructor(opt) {
    opt = opt || {};
    this.miterLimit = isFinite(opt.miterLimit) ? opt.miterLimit : 10;
    this.thickness = isFinite(opt.thickness) ? opt.thickness : 1;
    this.join = opt.join || 'miter';
    this.cap = opt.cap || 'butt';
    this.closed = opt.closed || false;
    this.mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    this.invMvMatrix = this.mvMatrix;
    this.dashList = [];
    this.dashOffset = 0;

    // Constants (set at build() time)
    this._halfThickness = undefined;
    this._dashListLength = undefined;
  }

  get supportedCaps() {
    return ['butt', 'square', 'round'];
  }

  get supportedJoins() {
    return ['miter', 'bevel', 'round'];
  }

  build(points) {
    // TODO: proper docstring
    // Expects points to be a flat array of the form [x0, y0, x1, y1, ...]
    // Optional points._arcs attribute

    // Set buildtime constants
    this._halfThickness = this.thickness / 2;
    this._dashListLength = this.dashList.reduce((x, y) => {
      return x + y;
    }, 0);

    const halfThickness = this._halfThickness;
    let currentPosition = this.dashOffset;
    if (currentPosition < 0) {
      currentPosition %= this._dashListLength;
      currentPosition += this._dashListLength;
    }
    let dashOn = this._dashStatus(currentPosition);

    if (points.length % 2 !== 0) {
      throw new TypeError('Points array length is not a multiple of 2');
    }

    if (points.length < 4) {
      return [];
    }

    const arcs = points._arcs || [];

    const triangles = [];

    let prevL1 = this._vec(points, 0);
    let prevSeg = null;

    if (this.closed) {
      const firstPt = this._vec(points, 0);

      const lastPtIdx = this._nextNonDupIdx(points, firstPt, -2);
      if (lastPtIdx < 0) {
        return [];
      }
      const lastPt = this._vec(points, lastPtIdx);

      const secondToLastPtIdx = this._nextNonDupIdx(points, lastPt, lastPtIdx - 2);
      if (secondToLastPtIdx < 0) {
        return [];
      }
      const secondToLastPt = this._vec(points, secondToLastPtIdx);

      const endConnectorSeg = this._segmentDescriptor(lastPt, firstPt);
      let finalSegArc = null;
      if (arcs.length > 0 && arcs[arcs.length - 1].endIdx > lastPt) {
        finalSegArc = arcs[arcs.length - 1];
      }

      prevSeg = endConnectorSeg;

      let endConnectorSegDashPosition = currentPosition - endConnectorSeg.length;
      if (endConnectorSegDashPosition < 0) {
        endConnectorSegDashPosition %= this._dashListLength;
        endConnectorSegDashPosition += this._dashListLength;
      }

      this._segmentGeometry(
        triangles,
        endConnectorSeg,
        this._segmentDescriptor(secondToLastPt, lastPt, finalSegArc),
        endConnectorSegDashPosition,
        this._dashStatus(endConnectorSegDashPosition)
      );
    } else {
      const firstPt = this._vec(points, 0);

      const secondPtIdx = this._nextNonDupIdx(points, firstPt, 2);
      if (secondPtIdx < 0) {
        return [];
      }
      const secondPt = this._vec(points, secondPtIdx);

      const firstSeg = this._segmentDescriptor(firstPt, secondPt);
      if (arcs.length > 0 && arcs[0].startIdx === 0) {
        firstSeg.arc = arcs[0];
      }
      if (dashOn) {
        if (this.cap === 'round') {
          const startTheta = Math.atan2(firstSeg.normal.y, firstSeg.normal.x);
          const endTheta = startTheta + Math.PI;
          this._fanGeometry(triangles, firstSeg.L0, startTheta, endTheta);
        } else if (this.cap === 'square') {
          prevL1 = prevL1.subtract(firstSeg.direction.multiply(halfThickness));
        }
      }
    }

    let arcIdx = 0;
    for (let i = 2; i < points.length; i += 2) {
      let seg = this._segmentDescriptor(prevL1, this._vec(points, i));
      if (arcIdx < arcs.length) {
        if (i >= arcs[arcIdx].endIdx) {
          arcIdx++;
        } else if (i > arcs[arcIdx].startIdx) {
          seg.arc = arcs[arcIdx];
        }
      }

      if (seg.direction.x === 0 && seg.direction.y === 0) {
        continue;
      }

      if (!this.closed && i === points.length - 2 && this.cap === 'square') {
        // TODO: This might not produce accurate results at the end of an arc,
        //       but shouldn't bother anyone...
        seg = this._segmentDescriptor(
          seg.L0,
          seg.L1.add(seg.direction.multiply(halfThickness)),
          seg.arc
        );
      }

      const prevDashOn = dashOn;
      prevL1 = seg.L1;
      dashOn = this._segmentGeometry(triangles, seg, prevSeg, currentPosition, dashOn);
      currentPosition += seg.length;
      // The conditional here prevents line joins when the previous segment
      // happened to end exactly where a 'dash-off' region ended:
      prevSeg = prevDashOn ? seg : null;
    }

    if (!this.closed && dashOn) {
      if (this.cap === 'round') {
        const startTheta = Math.atan2(prevSeg.normal.y, prevSeg.normal.x) + Math.PI;
        const endTheta = startTheta + Math.PI;
        this._fanGeometry(triangles, prevSeg.L1, startTheta, endTheta);
      }
    }

    return triangles;
  }

  _fanGeometry(triangles, center, startTheta, endTheta) {
    const halfThickness = this._halfThickness;

    let incr = 10 / this.thickness;
    for (let theta = startTheta; theta < endTheta; theta += incr) {
      if (theta + incr > endTheta) {
        incr = endTheta - theta;
      }
      this._pushPt(triangles, center);
      this._pushPt(
        triangles,
        center.x + halfThickness * Math.cos(theta),
        center.y + halfThickness * Math.sin(theta)
      );
      this._pushPt(
        triangles,
        center.x + halfThickness * Math.cos(theta + incr),
        center.y + halfThickness * Math.sin(theta + incr)
      );
    }
  }

  _segmentDescriptor(L0, L1, arc) {
    const seg = {};
    seg.L0 = L0;
    seg.L1 = L1;

    const L1_L0 = L1.subtract(L0);
    seg.length = L1_L0.length();
    seg.direction = L1_L0.unit();
    seg.normal = new Vector(-seg.direction.y, seg.direction.x);

    seg.arc = arc || null;

    seg.cornerPoints = this._rhombusCorners(L0, L1, seg);

    return seg;
  }

  _rhombusCorners(startPt, endPt, seg) {
    const halfThickness = this._halfThickness;

    if (!seg.arc) {
      // TODO: this epsilon removes line artifacts, but makes them
      //       non-pixel-perfect (and hence fail conformance). figure out
      //       a good way to deal with artifacts that doesn't involve
      //       ignorantly expanding rectangles
      // TODO: make sure that this epsilon works properly when everything
      //       is scaled
      //var epsilon = seg.direction;
      const epsilon = 0;
      return [
        startPt.add(seg.normal.multiply(halfThickness).subtract(epsilon)),
        startPt.add(seg.normal.multiply(-halfThickness).subtract(epsilon)),
        endPt.add(seg.normal.multiply(-halfThickness).add(epsilon)),
        endPt.add(seg.normal.multiply(halfThickness).add(epsilon)),
      ];
    } else {
      const arc = seg.arc;
      return [
        arc.center.add(
          startPt
            .subtract(arc.center)
            .unit()
            .multiply(arc.radius + halfThickness)
        ),
        arc.center.add(
          startPt
            .subtract(arc.center)
            .unit()
            .multiply(arc.radius - halfThickness)
        ),
        arc.center.add(
          endPt
            .subtract(arc.center)
            .unit()
            .multiply(arc.radius - halfThickness)
        ),
        arc.center.add(
          endPt
            .subtract(arc.center)
            .unit()
            .multiply(arc.radius + halfThickness)
        ),
      ];
    }
  }

  _segmentGeometry(triangles, seg, prevSeg, currentPosition, dashOn) {
    const halfThickness = this._halfThickness;

    // Add a join to the previous line segment, if there is one and the
    // dash was on
    if (dashOn && prevSeg && !prevSeg.arc && !seg.arc) {
      const bendDirection = prevSeg.direction.negative().cross(seg.direction).z > 0;

      // TODO: for very tight curves we need joins on both sides :\
      //       figure out how to detect this
      let joinP0 = seg.cornerPoints[1];
      let joinP1 = prevSeg.cornerPoints[2];
      if (bendDirection) {
        joinP0 = seg.cornerPoints[0];
        joinP1 = prevSeg.cornerPoints[3];
      }

      const miterAngle = Math.PI - prevSeg.direction.negative().angleTo(seg.direction);

      if (this.join === 'round') {
        let startTheta = Math.atan2(prevSeg.normal.y, prevSeg.normal.x);
        let endTheta = startTheta;
        if (bendDirection) {
          startTheta -= miterAngle;
        } else {
          startTheta += Math.PI;
          endTheta += Math.PI + miterAngle;
        }

        this._fanGeometry(triangles, seg.L0, startTheta, endTheta);
      } else {
        this._pushPt(triangles, seg.L0);
        this._pushPt(triangles, joinP0);
        this._pushPt(triangles, joinP1);

        if (this.join === 'miter') {
          const miterLength = halfThickness / Math.cos(miterAngle / 2);

          if (miterLength / halfThickness <= this.miterLimit) {
            const miterVec = prevSeg.direction
              .negative()
              .unit()
              .add(seg.direction.unit())
              .unit()
              .multiply(miterLength); // TODO: factor neg into a subtraction?
            const miterPt = seg.L0.subtract(miterVec);

            this._pushPt(triangles, joinP0);
            this._pushPt(triangles, joinP1);
            this._pushPt(triangles, miterPt);
          }
        }
      }
    }

    // Add dashes for the current line segment
    let currentSegPosition = 0;
    while (currentSegPosition < seg.length) {
      const nextSegPosition =
        currentSegPosition + this._remainingDashLength(currentPosition + currentSegPosition);

      const square_cap_adjustment = this.cap === 'square' ? halfThickness : 0;

      let startPt;
      if (currentSegPosition > 0) {
        startPt = seg.L0.add(seg.direction.multiply(currentSegPosition - square_cap_adjustment));
      } else {
        startPt = seg.L0;
      }

      let endPt;
      if (nextSegPosition >= seg.length) {
        endPt = seg.L1;
      } else {
        endPt = seg.L0.add(seg.direction.multiply(nextSegPosition + square_cap_adjustment));
      }

      if (!dashOn) {
        // Transitioning to "dash off"
      } else {
        // Transitioning to "dash on"

        if (this.cap === 'round') {
          const startTheta = Math.atan2(seg.normal.y, seg.normal.x);
          const endTheta = startTheta + Math.PI;
          this._fanGeometry(triangles, startPt, startTheta, endTheta);
          this._fanGeometry(triangles, endPt, startTheta + Math.PI, endTheta + Math.PI);
        }

        const segBodyPoints = this._rhombusCorners(startPt, endPt, seg);

        // TODO: convert to a triangle strip with restarts, to more
        // efficiently handle degenerate vs. common cases some day
        // (lol, some day, sigh)
        this._pushPt(triangles, segBodyPoints[0]);
        this._pushPt(triangles, segBodyPoints[1]);
        this._pushPt(triangles, segBodyPoints[2]);

        this._pushPt(triangles, segBodyPoints[0]);
        this._pushPt(triangles, segBodyPoints[3]);
        this._pushPt(triangles, segBodyPoints[2]);
      }

      if (nextSegPosition <= seg.length) {
        dashOn = !dashOn;
      }
      currentSegPosition = nextSegPosition;
    }

    return dashOn;
  }

  _pushPt(triangles, pt) {
    let original_x = pt.x;
    let original_y = pt.y;
    if (arguments.length === 3) {
      /* eslint-disable prefer-rest-params */
      original_x = arguments[1];
      original_y = arguments[2];
    }

    const transformed_x =
      original_x * this.mvMatrix[0] + original_y * this.mvMatrix[4] + this.mvMatrix[12];
    const transformed_y =
      original_x * this.mvMatrix[1] + original_y * this.mvMatrix[5] + this.mvMatrix[13];
    triangles.push(transformed_x);
    triangles.push(transformed_y);
  }

  _vec(arr, idx) {
    if (idx < 0) {
      idx += arr.length;
    }
    return new Vector(
      arr[idx] * this.invMvMatrix[0] + arr[idx + 1] * this.invMvMatrix[4] + this.invMvMatrix[12],
      arr[idx] * this.invMvMatrix[1] + arr[idx + 1] * this.invMvMatrix[5] + this.invMvMatrix[13]
    );
  }

  _nextNonDupIdx(arr, ref, startIdx) {
    let endIdx;
    let incr;
    if (startIdx < 0) {
      endIdx = -2;
      startIdx += arr.length;
      incr = -2;
    } else {
      endIdx = arr.length;
      incr = 2;
    }

    for (let curIdx = startIdx; curIdx !== endIdx; curIdx += incr) {
      if (arr[curIdx] !== ref.x || arr[curIdx + 1] !== ref.y) {
        return curIdx;
      }
    }
    return -1;
  }

  _remainingDashLength(dashPosition) {
    if (this.dashList.length === 0) {
      return Infinity;
    }
    dashPosition %= this._dashListLength;
    let scanPosition = 0;
    for (let i = 0; i < this.dashList.length; i++) {
      scanPosition += this.dashList[i];
      if (scanPosition > dashPosition) {
        return scanPosition - dashPosition;
      }
    }
    return 0;
  }

  _dashStatus(dashPosition) {
    if (this.dashList.length === 0) {
      return true;
    }
    dashPosition %= this._dashListLength;
    let scanPosition = 0;
    for (let i = 0; i < this.dashList.length; i++) {
      scanPosition += this.dashList[i];
      if (scanPosition > dashPosition) {
        return i % 2 === 0;
      }
    }
    return false;
  }
}
