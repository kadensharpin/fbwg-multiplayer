import { b2Fixture, b2FixtureDef, b2Readonly, b2Vec2 } from "@box2d/core";
import Portal from "../States/Level/Devices/Portal";

export type SimpleFixtureDef<UserData = never> = Omit<
  b2FixtureDef,
  "userData"
> & {
  userData?: UserData;
};

export declare class SimpleFixture<UserData = never> extends b2Fixture {
  // @ts-expect-error
  readonly m_userData: UserData;
  // @ts-expect-error
  GetUserData(): UserData;
  // @ts-expect-error
  SetUserData(userData: UserData): void;
}

export type FixtureDef<
  Light extends LightProperties | null = null,
  Liquid extends LiquidProperties | null = null,
> = SimpleFixtureDef<FixtureData<Light, Liquid>>;

export declare class Fixture<
  Light extends LightProperties | null = null,
  Liquid extends LiquidProperties | null = null,
> extends SimpleFixture<FixtureData<Light, Liquid>> {}

export class FixtureData<
  Light extends LightProperties | null = LightProperties | null,
  Liquid extends LiquidProperties | null = LiquidProperties | null,
> {
  /** This doesn't actually exist. However, it stops unwanted type-coercion */
  declare private _unused: string;

  constructor(
    public readonly lightProperties: Light,
    public readonly liquidProperties: Liquid,
    public readonly isPortalSensor: boolean,
  ) {}

  static getData(
    fixture: b2Fixture,
  ): FixtureData<LightProperties | null, LiquidProperties | null> | null {
    const data = fixture.GetUserData();
    return data instanceof FixtureData ? data : null;
  }

  static builder(): DataBuilder<null, null> {
    return new DataBuilder();
  }
}

class DataBuilder<
  Light extends LightProperties | null,
  Liquid extends LiquidProperties | null,
> {
  private lightProperties: Light = null as Light;
  private liquidProperties: Liquid = null as Liquid;
  private isPortalSensor: boolean = false;

  constructor() {}

  withPortalSensor(isPortalSensor: true): this {
    this.isPortalSensor = isPortalSensor;
    return this;
  }

  withTransparentLight(): DataBuilder<TransparentLightProperties, Liquid> {
    return this.withLightProperties(new TransparentLightProperties());
  }

  withNormalLight(
    illuminate = false,
    reflect = false,
  ): DataBuilder<NormalLightProperties, Liquid> {
    return this.withLightProperties(
      new NormalLightProperties(illuminate, reflect),
    );
  }

  withPortalLight(portal: Portal): DataBuilder<PortalLightProperties, Liquid> {
    return this.withLightProperties(new PortalLightProperties(portal));
  }

  withLightProperties<L1 extends LightProperties>(
    lightProperties: L1,
  ): DataBuilder<L1, Liquid> {
    this.lightProperties = lightProperties as any as Light;
    return this as any as DataBuilder<L1, Liquid>;
  }

  withLiquid(
    type: LiquidProperties["type"],
    liquid: LiquidProperties["liquid"],
  ): DataBuilder<Light, LiquidProperties> {
    this.liquidProperties = { liquid, type } as Liquid;
    return this as DataBuilder<Light, LiquidProperties>;
  }

  build(): FixtureData<Light, Liquid> {
    return new FixtureData(
      this.lightProperties,
      this.liquidProperties,
      this.isPortalSensor,
    );
  }
}

export type LightProperties =
  | TransparentLightProperties
  | NormalLightProperties
  | PortalLightProperties;

export class TransparentLightProperties {}

export class NormalLightProperties {
  /** The colour of light produced by the beamer */
  illuminationColour: "red" | "blue" | "yellow" | null | undefined = null;
  /** The point where the beamer hit the fixture */
  illuminationPoint: b2Vec2 | null | undefined = null;

  constructor(
    /** Whether to set the illumination colour and point when hit by the beamer */
    public illuminate = false,
    /** Whether the light should stop or be reflected when hit by the beamer */
    public reflect = false,
  ) {}
}

export class PortalLightProperties {
  constructor(readonly portal: Portal) {}

  getPoint(point: b2Readonly<b2Vec2>, normal: b2Readonly<b2Vec2>): b2Vec2 {
    if (!this.portal.other) return point.Clone();
    normal = new b2Vec2(0, 1).Rotate(this.portal.getRotation());
    let offset = point.Clone().Subtract(this.portal.body.data.GetPosition());
    if (
      this.portal.other.options.properties.inverted !==
      this.portal.options.properties.inverted
    ) {
      offset = normal
        .Clone()
        .Scale((2 * offset.Dot(normal)) / normal.Length())
        .Subtract(offset);
    }
    const rotation =
      this.portal.other.getRotation() - this.portal.getRotation();
    offset.Rotate(rotation);
    return offset.Add(this.portal.other.body.data.GetPosition());
  }

  getOutput(i: b2Readonly<b2Vec2>): b2Vec2 {
    const input = i.Clone() as b2Vec2;
    if (!this.portal.other) return input;
    const rotation =
      this.portal.other.getRotation() - this.portal.getRotation();
    return this.portal.other.options.properties.inverted ===
      this.portal.options.properties.inverted
      ? input.Rotate(rotation + Math.PI)
      : input.Rotate(rotation);
  }
}

export const enum LiquidType {
  WATER = 5,
  FIRE = 6,
  GREEN = 7,
}

export type LiquidProperties = {
  type: "liquid_death" | "liquid" | "ice";
  liquid: LiquidType;
};
