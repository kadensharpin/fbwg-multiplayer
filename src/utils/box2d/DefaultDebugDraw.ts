import * as box2d from "phaser-box2d";

export default class DefaultDebugDraw implements box2d.b2Draw {
  context: CanvasRenderingContext2D | null;
  color = new box2d.b2Color(1, 1, 1);
  pixelsPerMeter: number;
  flags: box2d.b2DrawFlags;

  get m_drawFlags() {
    return this.flags;
  }

  constructor(pixelsPerMeter: number) {
    this.context = null;
    this.pixelsPerMeter = pixelsPerMeter;
    this.flags = box2d.b2DrawFlags.e_shapeBit;
  }

  ClearFlags(_flags: box2d.b2DrawFlags): void {
    throw new Error("Not implemented");
  }
  AppendFlags(_flags: box2d.b2DrawFlags): void {
    throw new Error("Not implemented");
  }
  SetFlags(flags: box2d.b2DrawFlags) {
    this.flags = flags;
  }
  GetFlags() {
    return this.flags;
  }
  start(context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.save();
    this.context.scale(-1, -1);
    this.context.scale(this.pixelsPerMeter, this.pixelsPerMeter);
  }
  stop() {
    this.context?.restore();
  }
  PushTransform(transform: box2d.b2Transform) {
    this.context?.save();
    this.context?.translate(transform.p.x, transform.p.y);
    this.context?.rotate(transform.q.GetAngle());
  }
  PopTransform() {
    this.context?.restore();
  }
  DrawPolygon(
    vertices: Array<box2d.b2Vec2>,
    vertexCount: number,
    color: box2d.b2Color,
  ) {
    if (vertexCount && this.context) {
      this.context.lineWidth = 1 / this.pixelsPerMeter;
      this.context.beginPath();
      this.context.moveTo(vertices[0].x, vertices[0].y);
      for (var vLN12 = 1; vLN12 < vertexCount; vLN12++) {
        this.context.lineTo(vertices[vLN12].x, vertices[vLN12].y);
      }
      this.context.closePath();
      // @ts-expect-error
      this.context.strokeStyle = color.MakeStyleString(1);
      this.context.stroke();
    }
  }
  DrawSolidPolygon(
    vertices: Array<box2d.b2Vec2>,
    vertexCount: number,
    color: box2d.b2Color,
  ) {
    if (vertexCount && this.context) {
      this.context.lineWidth = 1 / this.pixelsPerMeter;
      this.context.beginPath();
      this.context.moveTo(vertices[0].x, vertices[0].y);
      for (var vLN13 = 1; vLN13 < vertexCount; vLN13++) {
        this.context.lineTo(vertices[vLN13].x, vertices[vLN13].y);
      }
      this.context.closePath();
      // @ts-expect-error
      this.context.fillStyle = color.MakeStyleString(0.5);
      this.context.fill();
      // @ts-expect-error
      this.context.strokeStyle = color.MakeStyleString(1);
      this.context.stroke();
    }
  }
  DrawCircle(center: box2d.b2Vec2, radius: number, color: box2d.b2Color) {
    if (radius && this.context) {
      this.context.beginPath();
      this.context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
      // @ts-expect-error
      this.context.strokeStyle = color.MakeStyleString(1);
      this.context.stroke();
    }
  }
  DrawSolidCircle(
    center: box2d.b2Vec2,
    radius: number,
    axis: box2d.b2Vec2,
    color: box2d.b2Color,
  ) {
    if (radius && this.context) {
      this.context.lineWidth = 1 / this.pixelsPerMeter;
      var v133 = center.x;
      var v134 = center.y;
      this.context.beginPath();
      this.context.arc(v133, v134, radius, 0, Math.PI * 2, true);
      this.context.moveTo(v133, v134);
      this.context.lineTo(v133 + axis.x * radius, v134 + axis.y * radius);
      // @ts-expect-error
      this.context.fillStyle = color.MakeStyleString(0.5);
      this.context.fill();
      // @ts-expect-error
      this.context.strokeStyle = color.MakeStyleString(1);
      this.context.stroke();
    }
  }
  DrawSegment(p1: box2d.b2Vec2, p2: box2d.b2Vec2, color: box2d.b2Color) {
    if (!this.context) return;
    this.context.lineWidth = 1 / this.pixelsPerMeter;
    this.context.beginPath();
    this.context.moveTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    // @ts-expect-error
    this.context.strokeStyle = color.MakeStyleString(1);
    this.context.stroke();
  }
  DrawTransform(transform: box2d.b2Transform) {
    if (!this.context) return;
    this.context.lineWidth = 1 / this.pixelsPerMeter;
    this.PushTransform(transform);
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(1, 0);
    // @ts-expect-error
    this.context.strokeStyle = box2d.b2Color.RED.MakeStyleString(1);
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(0, 1);
    // @ts-expect-error
    this.context.strokeStyle = box2d.b2Color.GREEN.MakeStyleString(1);
    this.context.stroke();
    this.PopTransform();
  }
  DrawPoint(point: box2d.b2Vec2, radius: number, color: box2d.b2Color) {
    if (!this.context) return;
    // @ts-expect-error
    this.context.fillStyle = color.MakeStyleString();
    var v138 = radius / 2;
    this.context.fillRect(point.x - v138, point.y - v138, radius, radius);
  }
  DrawAABB(aabb: box2d.b2AABB, color: box2d.b2Color) {
    if (!this.context) return;
    // @ts-expect-error
    this.context.strokeStyle = color.MakeStyleString();
    var v140 = aabb.lowerBound.x;
    var v141 = aabb.lowerBound.y;
    var v142 = aabb.upperBound.x - aabb.lowerBound.x;
    var v143 = aabb.upperBound.y - aabb.lowerBound.y;
    this.context.strokeRect(v140, v141, v142, v143);
  }
  get shapes() {
    return this.flags & box2d.b2DrawFlags.e_shapeBit;
  }
  set shapes(p351) {
    if (p351) {
      this.flags |= box2d.b2DrawFlags.e_shapeBit;
    } else {
      this.flags &= ~box2d.b2DrawFlags.e_shapeBit;
    }
  }

  get joints() {
    return this.flags & box2d.b2DrawFlags.e_jointBit;
  }
  set joints(p352) {
    if (p352) {
      this.flags |= box2d.b2DrawFlags.e_jointBit;
    } else {
      this.flags &= ~box2d.b2DrawFlags.e_jointBit;
    }
  }

  get aabbs() {
    return this.flags & box2d.b2DrawFlags.e_aabbBit;
  }
  set aabbs(p353) {
    if (p353) {
      this.flags |= box2d.b2DrawFlags.e_aabbBit;
    } else {
      this.flags &= ~box2d.b2DrawFlags.e_aabbBit;
    }
  }

  get pairs() {
    return this.flags & box2d.b2DrawFlags.e_pairBit;
  }
  set pairs(p354) {
    if (p354) {
      this.flags |= box2d.b2DrawFlags.e_pairBit;
    } else {
      this.flags &= ~box2d.b2DrawFlags.e_pairBit;
    }
  }

  get centerOfMass() {
    return this.flags & box2d.b2DrawFlags.e_centerOfMassBit;
  }
  set centerOfMass(p355) {
    if (p355) {
      this.flags |= box2d.b2DrawFlags.e_centerOfMassBit;
    } else {
      this.flags &= ~box2d.b2DrawFlags.e_centerOfMassBit;
    }
  }
}
