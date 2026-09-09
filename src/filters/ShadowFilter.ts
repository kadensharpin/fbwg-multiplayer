import { Filter, Game } from "phaser";

class ShadowFilter extends Filter {
  passes: this[];
  constructor(
    game: Game,
    width: number,
    height: number,
    thickness: number,
    hexColor: number,
  ) {
    super(
      game,
      {
        thickness: { type: "1f", value: thickness },
        outlineColor: { type: "4f", value: null },
        pixelWidth: { type: "1f", value: null },
        pixelHeight: { type: "1f", value: null },
      },
      [
        "precision mediump float;",
        "varying vec2 vTextureCoord;",
        "uniform sampler2D texture;",
        "uniform float thickness;",
        "uniform vec4 outlineColor;",
        "uniform float pixelWidth;",
        "uniform float pixelHeight;",
        "vec2 px = vec2(pixelWidth, pixelHeight);",
        "void main(void) {",
        "  const float PI = 3.14159265358979323846264;",
        "  vec4 curColor;",
        "  vec4 ownColor = texture2D(texture, vTextureCoord);",
        "  float maxAlpha = 0.;",
        "  float angle = -3.*PI/4.;",
        "  curColor = texture2D(texture, vec2(vTextureCoord.x + thickness * px.x * cos(angle), vTextureCoord.y + thickness * px.y * sin(angle)));",
        "  if (ownColor.a > 0.8) gl_FragColor = ownColor;",
        "  else gl_FragColor = vec4(outlineColor.rgb, curColor.a*0.1);",
        "}",
      ],
    );
    this.color = hexColor;
    this.viewWidth = width;
    this.viewHeight = height;
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

export default ShadowFilter;
