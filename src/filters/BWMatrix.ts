/// <amd-module name="bwMatrix" />

import { Filter, Game } from "@azerion/phaser";

class BWMatrix extends Filter {
  passes: this[];
  constructor(game: Game, _width: number, _height: number, _hexColor: number) {
    super(
      game,
      {
        matrix: {
          type: "mat4",
          value: [
            0.3, 0.6, 0.1, 0, 0.3, 0.6, 0.1, 0, 0.3, 0.6, 0.1, 0, 0, 0, 0, 1,
          ],
        },
      },
      [
        "precision mediump float;",
        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",
        "uniform float invert;",
        "uniform mat4 matrix;",
        "uniform sampler2D uSampler;",
        "void main(void) {",
        "   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;",
        "}",
      ],
    );

    this.passes = [this];
  }

  public set color(hexColor: number) {
    const red = ((0xff0000 & hexColor) >> 16) / 255;
    const green = ((0x00ff00 & hexColor) >> 8) / 255;
    const blue = (0x0000ff & hexColor) / 255;
    this.uniforms.outlineColor.value = { x: red, y: green, z: blue, w: 1 };
    this.dirty = true;
  }

  public set viewWidth(width: number) {
    this.uniforms.pixelWidth.value = 1 / width;
    this.dirty = true;
  }

  public set viewHeight(height: number) {
    this.uniforms.pixelHeight.value = 1 / height;
    this.dirty = true;
  }
}

export = BWMatrix;
