/// <amd-module name="bevelFilter" />

import { Filter, Game } from "@azerion/phaser";

class BevelFilter extends Filter {
  maxStep: number;
  res: number;
  passes: this[];

  constructor(
    game: Game,
    width: number,
    height: number,
    thickness: number,
    hexColor: number,
    isOuter: number, // 1.0 for true, 0.0 for false
    lightDirection: number, // Usually 1.0 or -1.0
  ) {
    const maxStep = 1 / thickness;
    const res = 3;
    super(
      game,
      {
        outer: { type: "1f", value: isOuter },
        dir: { type: "1f", value: lightDirection },
        thickness: { type: "1f", value: thickness },
        outlineColor: { type: "4f", value: null },
        pixelWidth: { type: "1f", value: null },
        pixelHeight: { type: "1f", value: null },
      },
      [
        "precision mediump float;",
        "varying vec2 vTextureCoord;",
        "uniform float outer;",
        "uniform float dir;",
        "uniform sampler2D uSampler;",
        "uniform vec4 filterArea;",
        "void main(void)",
        "{",
        "  vec2 onePixel = vec2(1.0);",
        "  vec4 color = texture2D(uSampler, vTextureCoord);",
        "  float a1 = 0.0;",
        "  float a2 = 0.0;",
        "  for (float step = 0.; step < " +
          maxStep +
          "; step += " +
          maxStep / res +
          ") {",
        "    a1 = a1 + texture2D(uSampler, vec2(vTextureCoord.x + step , vTextureCoord.y + step)).a;",
        "  }",
        "  for (float step = 0.; step < " +
          maxStep +
          "; step += " +
          maxStep / res +
          ") {",
        "    a2 = a2 + texture2D(uSampler, vec2(vTextureCoord.x - step , vTextureCoord.y - step)).a;",
        "  }",
        "  a1 = a1/" + res.toFixed(4) + ";",
        "  a2 = a2/" + res.toFixed(4) + ";",
        "  color.rgb = vec3(0.5);",
        "  float alpha = texture2D(uSampler, vTextureCoord).a;",
        "  if (outer == 1.0){",
        "    alpha = a1 + a2;",
        "    color.rgb = vec3(0.5-dir*a1/6.0+dir*a2/6.0);",
        " }else{",
        "    alpha = texture2D(uSampler, vTextureCoord).a;",
        "    color.rgb = vec3(0.5+dir*a1/6.0-dir*a2/6.0);",
        "  }",
        "  if(alpha>0.5){",
        "    alpha = 1.0;",
        "  }",
        "  gl_FragColor = vec4(color.rgb * alpha, alpha);",
        "}",
      ],
    );

    this.color = hexColor;
    this.viewWidth = width;
    this.viewHeight = height;
    this.passes = [this];
    this.maxStep = maxStep;
    this.res = res;
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

  public set thickness(value: number) {
    this.uniforms.thickness.value = 1 / value;
    this.dirty = true;
  }
}

export = BevelFilter;
