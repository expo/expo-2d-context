import Vector from './vector';


export class StrokeExtruder {
  constructor(opt) {
    opt = opt||{}
    this.miterLimit = isFinite(opt.miterLimit) ? opt.miterLimit : 10
    this.thickness = isFinite(opt.thickness) ? opt.thickness : 1
    this.join = opt.join || 'miter'
    this.cap = opt.cap || 'butt'
    this.closed = opt.closed || false
  }

  build(points) {
    // TODO: proper docstring
    // Expects points to be a flat array of the form [x0, y0, x1, y1, ...]

    // TODO: once closing here is implemented, make sure the rest of the code
    // doesn't do its own closing

    if (points.length <= 4) {
      return [];
    }
    if (points.length % 2 != 0) {
      throw new TypeError("Points array length is not a multiple of 2")
    }

    triangles = []

    let prevL1 = new Vector(points[0], points[1])
    let prevSeg = null;

    if (this.closed) {
      prevSeg = this._segmentDescriptor(
        new Vector(points[points.length-4], points[points.length-3]),
        new Vector(points[points.length-2], points[points.length-1])
      );
      prevSeg = this._segmentGeometry(triangles,
        new Vector(points[points.length-2], points[points.length-1]),
        new Vector(points[0], points[1]),
        prevSeg);
    }

    // TODO: does global alpha reveal the triangle overlaps here?

    for (let i = 2; i < points.length; i+=2) {
      let L0 = prevL1;
      let L1 = new Vector(points[i+0], points[i+1]);
      prevL1 = L1;  
      prevSeg = this._segmentGeometry(triangles, L0, L1, prevSeg)
    }

    // TODO: caps

    return triangles;
  }

  _segmentDescriptor(L0, L1) {
    var halfThickness = this.thickness / 2;

    let seg = {}
    seg.direction = L1.subtract(L0).unit(),
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

  _segmentGeometry (triangles, L0, L1, prevSeg) {
      var halfThickness = this.thickness / 2;

      let seg = this._segmentDescriptor(L0, L1)

      triangles.push(seg.points[0].x); triangles.push(seg.points[0].y)
      triangles.push(seg.points[1].x); triangles.push(seg.points[1].y)
      triangles.push(seg.points[2].x); triangles.push(seg.points[2].y)

      triangles.push(seg.points[0].x); triangles.push(seg.points[0].y)
      triangles.push(seg.points[3].x); triangles.push(seg.points[3].y)
      triangles.push(seg.points[2].x); triangles.push(seg.points[2].y)

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

          let incr = 10/this.thickness;
          for (let theta = startTheta; theta < endTheta; theta += incr) {
            triangles.push(L0.x); triangles.push(L0.y)
            triangles.push(L0.x + halfThickness * Math.cos(theta)); triangles.push(L0.y + halfThickness * Math.sin(theta))
            triangles.push(L0.x + halfThickness * Math.cos(theta + incr)); triangles.push(L0.y + halfThickness * Math.sin(theta + incr))
          }
        } else {
          // TODO: seams are a problem with this triangle -
          triangles.push(L0.x); triangles.push(L0.y)
          triangles.push(joinP0.x); triangles.push(joinP0.y)
          triangles.push(joinP1.x); triangles.push(joinP1.y)

          if (this.join == 'miter') {
            let miterLength = halfThickness / Math.cos(miterAngle/2);

            if (miterLength/halfThickness <= this.miterLimit) {
              let miterVec = prevSeg.direction.negative().unit().add(seg.direction.unit()).unit().multiply(miterLength) // TODO: factor neg into a subtraction?
              let miterPt = L0.subtract(miterVec);

              triangles.push(joinP0.x); triangles.push(joinP0.y)
              triangles.push(joinP1.x); triangles.push(joinP1.y)
              triangles.push(miterPt.x); triangles.push(miterPt.y)
            }
          }
        }

      }

      return seg;
  }

}
