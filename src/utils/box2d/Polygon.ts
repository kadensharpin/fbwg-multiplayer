import * as box2d from "phaser-box2d";

type Vertex = { x: number; y: number };

export default class Polygon {
  vertices: Vertex[];

  constructor() {
    this.vertices = [];
  }
  setFromFlatXYCoords(vertices: number[]) {
    this.vertices = [];
    for (var vLN012 = 0; vLN012 < vertices.length / 2; vLN012++) {
      this.vertices.push({
        x: vertices[vLN012 * 2],
        y: vertices[vLN012 * 2 + 1],
      });
    }
  }
  setFromXYObjects(vertices: Vertex[]) {
    this.vertices = vertices.concat();
  }
  addVertex(vertex: Vertex) {
    this.vertices.push(vertex);
  }
  at(index: number) {
    var length = this.vertices.length;
    return this.vertices[
      index < 0 ? (index % length) + length : index % length
    ];
  }
  indicesAreAdjacent(indexA: number, indexB: number) {
    indexA %= this.vertices.length;
    indexB %= this.vertices.length;
    if (indexA == indexB) {
      return true;
    }
    var v175 = Math.abs(indexA - indexB);
    return v175 < 2 || v175 == this.vertices.length - 1;
  }
  areaInTriangle(indexA: number, indexB: number, indexC: number) {
    var vertexA = this.at(indexA);
    var vertexB = this.at(indexB);
    var vertexC = this.at(indexC);
    return (
      ((vertexB.x - vertexA.x) * (vertexC.y - vertexA.y) -
        (vertexC.x - vertexA.x) * (vertexB.y - vertexA.y)) *
      0.5
    );
  }
  left(indexA: number, indexB: number, indexC: number) {
    return this.areaInTriangle(indexA, indexB, indexC) > 0;
  }
  leftOn(indexA: number, indexB: number, indexC: number) {
    return this.areaInTriangle(indexA, indexB, indexC) >= 0;
  }
  right(indexA: number, indexB: number, indexC: number) {
    return this.areaInTriangle(indexA, indexB, indexC) < 0;
  }
  rightOn(indexA: number, indexB: number, indexC: number) {
    return this.areaInTriangle(indexA, indexB, indexC) <= 0;
  }
  static sqdist(vertexA: Vertex, vertexB: Vertex) {
    var v176 = vertexB.x - vertexA.x;
    var v177 = vertexB.y - vertexA.y;
    return v176 * v176 + v177 * v177;
  }
  makeCCW() {
    var vLN013 = 0;
    for (var vLN14 = 1, v178 = this.vertices.length; vLN14 < v178; vLN14++) {
      if (
        this.at(vLN14).y < this.at(vLN013).y ||
        (this.at(vLN14).y === this.at(vLN013).y &&
          this.at(vLN14).x > this.at(vLN013).x)
      ) {
        vLN013 = vLN14;
      }
    }
    return (
      !this.left(vLN013 - 1, vLN013, vLN013 + 1) &&
      (this.vertices.reverse(), true)
    );
  }
  isConvex() {
    var v179 = false;
    var v180 = false;
    for (var vLN014 = 0, v181 = this.vertices.length; vLN014 < v181; vLN014++) {
      var vVLN014 = vLN014;
      var v182 = (vLN014 + 1) % v181;
      var v183 = (vLN014 + 2) % v181;
      if (this.left(vVLN014, v182, v183)) {
        v179 = true;
      } else {
        v180 = true;
      }
    }
    return v180 !== v179;
  }
  isReflex(index: number) {
    return this.right(index - 1, index, index + 1);
  }
  static areVecsEqual(vertexA: Vertex, vertexB: Vertex) {
    return vertexA.x == vertexB.x && vertexA.y == vertexB.y;
  }
  static linesCross(
    lineStartA: Vertex,
    lineEndA: Vertex,
    lineStartB: Vertex,
    lineEndB: Vertex,
  ) {
    if (
      Polygon.areVecsEqual(lineEndA, lineStartB) ||
      Polygon.areVecsEqual(lineStartA, lineStartB) ||
      Polygon.areVecsEqual(lineEndA, lineEndB) ||
      Polygon.areVecsEqual(lineStartA, lineEndB)
    ) {
      return null;
    }
    var vO5 = {};
    box2d.b2SubVV(lineEndA, lineStartA, vO5);
    box2d.b2CrossVS(vO5, 1, vO5);
    var v188 = box2d.b2DotVV(vO5, lineStartA);
    var v187 = box2d.b2DotVV(vO5, lineStartB);
    var v186 = box2d.b2DotVV(vO5, lineEndB);
    if (v187 > v188 && v186 > v188) {
      return null;
    }
    if (v187 < v188 && v186 < v188) {
      return null;
    }
    var vO6 = {};
    box2d.b2SubVV(lineEndB, lineStartB, vO6);
    box2d.b2CrossVS(vO6, 1, vO6);
    var v187 = box2d.b2DotVV(vO6, lineStartB);
    var v188 = box2d.b2DotVV(vO6, lineStartA);
    var v189 = box2d.b2DotVV(vO6, lineEndA);
    if (v188 > v187 && v189 > v187) {
      return null;
    }
    if (v188 < v187 && v189 < v187) {
      return null;
    }
    var v190 = (v187 - v188) / (v189 - v188);
    return {
      x: lineStartA.x + v190 * (lineEndA.x - lineStartA.x),
      y: lineStartA.y + v190 * (lineEndA.y - lineStartA.y),
    };
  }
  canSee(indexA: number, indexB: number) {
    if (this.indicesAreAdjacent(indexA, indexB)) {
      return false;
    }
    if (
      this.leftOn(indexA + 1, indexA, indexB) &&
      this.rightOn(indexA - 1, indexA, indexB)
    ) {
      return false;
    }
    for (var vLN015 = 0; vLN015 < this.vertices.length; ++vLN015) {
      if (
        (vLN015 + 1) % this.vertices.length != indexA &&
        vLN015 != indexA &&
        this.leftOn(indexA, indexB, vLN015 + 1) &&
        this.rightOn(indexA, indexB, vLN015) &&
        Polygon.linesCross(
          this.at(indexA),
          this.at(indexB),
          this.at(vLN015),
          this.at(vLN015 + 1),
        )
      ) {
        return false;
      }
    }
    return true;
  }
  subPolygon(indexA: number, indexB: number) {
    var v191 = new Polygon();
    if (indexA < indexB) {
      for (var vLN016 = indexA; vLN016 < indexB + 1; vLN016++) {
        v191.addVertex(this.at(vLN016));
      }
    } else {
      for (var vLN016 = indexA; vLN016 < this.vertices.length; vLN016++) {
        v191.addVertex(this.at(vLN016));
      }
      for (var vLN016 = 0; vLN016 < indexB + 1; vLN016++) {
        v191.addVertex(this.at(vLN016));
      }
    }
    return v191;
  }
  decomposeOptimal(loops = 0) {
    if (loops > 1) {
      return this.vertices;
    }
    this.makeCCW();
    var vA9: Vertex[][] = [];
    var vA10 = [];
    var vA11 = [];
    var v192 = Number.MAX_VALUE;
    for (var vLN017 = 0; vLN017 < this.vertices.length; vLN017++) {
      if (this.isReflex(vLN017)) {
        for (var vLN018 = 0; vLN018 < this.vertices.length; vLN018++) {
          if (this.canSee(vLN017, vLN018)) {
            vA10 = this.subPolygon(vLN017, vLN018).decompose(loops + 1);
            vA11 = this.subPolygon(vLN018, vLN017).decompose(loops + 1);
            if (vA10.length + vA11.length < v192) {
              vA9 = vA10.concat(vA11);
              v192 = vA9.length;
            }
          }
        }
      }
    }
    if (vA9.length === 0) {
      vA9.push(this.vertices);
    }
    return vA9;
  }
  decompose(loops = 0) {
    this.makeCCW();
    var v193;
    var v194;
    var vA12: Vertex[][] = [];
    var v195 = Number.MAX_VALUE;
    var v196 = false;
    for (var vLN019 = 0; vLN019 < this.vertices.length; vLN019++) {
      if (this.isReflex(vLN019)) {
        v196 = true;
        var v197 = this.at(vLN019);
        for (var vLN020 = 0; vLN020 < this.vertices.length; vLN020++) {
          if (this.canSee(vLN019, vLN020)) {
            var v198 = this.at(vLN020);
            var v199 = v198.x - v197.x;
            var v200 = v198.y - v197.y;
            var v201 = v199 * v199 * (v200 * v200);
            if (v201 < v195) {
              v193 = vLN019;
              v194 = vLN020;
              v195 = v201;
            }
          }
        }
      }
    }
    if (!v196 && this.vertices.length > 8) {
      v193 = 0;
      v194 = Math.floor(this.vertices.length / 2);
      v196 = true;
    }
    if (v196) {
      var v202 = this.subPolygon(v193 || 0, v194 || 0).decompose(loops + 1);
      var v203 = this.subPolygon(v194 || 0, v193 || 0).decompose(loops + 1);
      vA12 = v202.concat(v203);
    }
    if (vA12.length === 0) {
      vA12.push(this.vertices);
    }
    return vA12;
  }
}
