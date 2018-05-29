import Vector from './vector';


export class StrokeExtruder {
  constructor(opt) {
    opt = opt||{}
    this.miterLimit = isFinite(opt.miterLimit) ? opt.miterLimit : 10
    this.thickness = isFinite(opt.thickness) ? opt.thickness : 1
    this.join = opt.join || 'miter'
    this.cap = opt.cap || 'butt'
    this.closed = opt.closed || false
    this.mvMatrix = [1,0,0,0,
                     0,1,0,0,
                     0,0,1,0,
                     0,0,0,1];
    this.invMvMatrix = this.mvMatrix;
  }

  build(points) {
    var halfThickness = this.thickness / 2;

    // TODO: proper docstring
    // Expects points to be a flat array of the form [x0, y0, x1, y1, ...]

    if (points.length <= 4) {
      return [];
    }
    if (points.length % 2 != 0) {
      throw new TypeError("Points array length is not a multiple of 2")
    }

    let triangles = []

    let prevL1 = this._vec(points, 0);
    let prevSeg = null;

    if (this.closed) {
      prevSeg = this._segmentGeometry(triangles, 
        this._segmentDescriptor(this._vec(points, -2), this._vec(points, 0)),
        this._segmentDescriptor(this._vec(points, -4), this._vec(points, -2))
      );
    } else {
      let firstSeg = this._segmentDescriptor(this._vec(points, 0), this._vec(points, 2));
      if (this.cap == "round") {
        let startTheta = Math.atan2(firstSeg.normal.y, firstSeg.normal.x);
        let endTheta = startTheta + Math.PI;
        this._fanGeometry(triangles, firstSeg.L0, startTheta, endTheta);
      } else if (this.cap == "square") {
        prevL1 = prevL1.subtract(firstSeg.direction.multiply(halfThickness))
      }
    }

    // TODO: does global alpha reveal the triangle overlaps here?

    for (let i = 2; i < points.length; i+=2) {
      let seg = this._segmentDescriptor(
        prevL1,
        this._vec(points, i)
      );
      
      if (!this.closed && i == points.length-2 && this.cap == "square") {
        seg = this._segmentDescriptor(
          seg.L0,
          seg.L1.add(seg.direction.multiply(halfThickness))
        );
      }

      prevL1 = seg.L1;  
      prevSeg = this._segmentGeometry(triangles, seg, prevSeg)
    }

    if (!this.closed) {
      if (this.cap == "round") {
        let startTheta = Math.atan2(prevSeg.normal.y, prevSeg.normal.x) + Math.PI;
        let endTheta = startTheta + Math.PI;
        this._fanGeometry(triangles, prevSeg.L1, startTheta, endTheta);
      }
    }

    return triangles;
  }

  _fanGeometry(triangles, center, startTheta, endTheta) {
    var halfThickness = this.thickness / 2;

    let incr = 10/this.thickness;
    for (let theta = startTheta; theta < endTheta; theta += incr) {
      if (theta + incr > endTheta) {
        incr = endTheta - theta;
      }
      this._pushPt(triangles, center);
      this._pushPt(triangles, center.x + halfThickness * Math.cos(theta), center.y + halfThickness * Math.sin(theta));
      this._pushPt(triangles, center.x + halfThickness * Math.cos(theta + incr), center.y + halfThickness * Math.sin(theta + incr));
    }
  }

  _segmentDescriptor(L0, L1) {
    var halfThickness = this.thickness / 2;

    let seg = {}
    seg.L0 = L0;
    seg.L1 = L1;
    seg.direction = L1.subtract(L0).unit();
    seg.normal = new Vector(-seg.direction.y, seg.direction.x);

    // TODO: convert to a triangle strip with restarts, to more
    // efficiently handle degenerate vs. common cases some day
    // (lol, some day, sigh)
    seg.points = [
      L0.add(seg.normal.multiply(halfThickness)),
      L0.add(seg.normal.multiply(-halfThickness)),
      L1.add(seg.normal.multiply(-halfThickness)),
      L1.add(seg.normal.multiply(halfThickness))
    ]
    return seg;
  }

  _segmentGeometry (triangles, seg, prevSeg) {
      var halfThickness = this.thickness / 2;

      this._pushPt(triangles, seg.points[0]);
      this._pushPt(triangles, seg.points[1]);
      this._pushPt(triangles, seg.points[2]);

      this._pushPt(triangles, seg.points[0]);
      this._pushPt(triangles, seg.points[3]);
      this._pushPt(triangles, seg.points[2]);

      if (prevSeg) {
        // TODO: can bendDirection be based on miter angle?
        let bendDirection = prevSeg.direction.negative().cross(seg.direction).z > 0

        let joinP0 = seg.points[1]
        let joinP1 = prevSeg.points[2]
        if (bendDirection) {
          joinP0 = seg.points[0]
          joinP1 = prevSeg.points[3]
        }

        let miterAngle = Math.PI-prevSeg.direction.negative().angleTo(seg.direction)
        
        if (this.join == 'round') {
          let startTheta = Math.atan2(prevSeg.normal.y, prevSeg.normal.x);
          let endTheta = startTheta;
          if (bendDirection) {
            startTheta -= miterAngle;
          } else {
            startTheta += Math.PI;
            endTheta += Math.PI + miterAngle;
          }

          this._fanGeometry(triangles, seg.L0, startTheta, endTheta)
        } else {
          // TODO: seams are a problem with this triangle -
          this._pushPt(triangles, seg.L0);
          this._pushPt(triangles, joinP0);
          this._pushPt(triangles, joinP1);

          if (this.join == 'miter') {
            let miterLength = halfThickness / Math.cos(miterAngle/2);

            if (miterLength/halfThickness <= this.miterLimit) {
              let miterVec = prevSeg.direction.negative().unit().add(seg.direction.unit()).unit().multiply(miterLength) // TODO: factor neg into a subtraction?
              let miterPt = seg.L0.subtract(miterVec);

              this._pushPt(triangles, joinP0);
              this._pushPt(triangles, joinP1);
              this._pushPt(triangles, miterPt);
            }
          }
        }

      }

      return seg;
  }

  _pushPt (triangles, pt) {

    // TODO: problem!!! path was already transformed, so do we have to "unproject" here?
    //  ahhhhhh what to do????? it seems like the arc()s already sort of dealt with this issue??

    let original_x = pt.x;
    let original_y = pt.y;
    if (arguments.length == 3) {
      original_x = arguments[1];
      original_y = arguments[2];
    }

    let transformed_x = original_x * this.mvMatrix[0] + original_y * this.mvMatrix[4] + this.mvMatrix[12];
    let transformed_y = original_x * this.mvMatrix[1] + original_y * this.mvMatrix[5] + this.mvMatrix[13];
    triangles.push(transformed_x);
    triangles.push(transformed_y);
  }


  _vec(arr, idx) {
    if (idx < 0) {
      idx = arr.length + idx;
    }
    //return new Vector(arr[idx], arr[idx+1]);
    return new Vector(
      arr[idx] * this.invMvMatrix[0] + arr[idx+1] * this.invMvMatrix[4] + this.invMvMatrix[12],
      arr[idx] * this.invMvMatrix[1] + arr[idx+1] * this.invMvMatrix[5] + this.invMvMatrix[13]
    );
  }


}
