import box2d from "@box2d/core";
import {
  b2ParticleBodyContact,
  b2ParticleContact,
  b2ParticleSystem,
} from "@box2d/particles";

export default class DefaultContactListener implements box2d.b2ContactListener {
  BeginContactFixtureParticle(
    _system: b2ParticleSystem,
    _contact: b2ParticleBodyContact,
  ): void {
    throw new Error("Method not implemented.");
  }
  EndContactFixtureParticle(
    _system: b2ParticleSystem,
    _contact: b2ParticleBodyContact,
  ): void {
    throw new Error("Method not implemented.");
  }
  BeginContactParticleParticle(
    _system: b2ParticleSystem,
    _contact: b2ParticleContact,
  ): void {
    throw new Error("Method not implemented.");
  }
  EndContactParticleParticle(
    _system: b2ParticleSystem,
    _contact: b2ParticleContact,
  ): void {
    throw new Error("Method not implemented.");
  }
  BeginContact(contact: box2d.b2Contact) {
    this.handleContactBeginOrEnd(contact, true);
  }
  EndContact(contact: box2d.b2Contact) {
    this.handleContactBeginOrEnd(contact, false);
  }
  handleContactBeginOrEnd(contact: box2d.b2Contact, begin: boolean) {
    var fixtureA = contact.GetFixtureA();
    var fixtureB = contact.GetFixtureB();
    var b2BodyA = fixtureA.GetBody();
    var b2BodyB = fixtureB.GetBody();
    var categoryA = fixtureA.GetFilterData().categoryBits;
    var categoryB = fixtureB.GetFilterData().categoryBits;
    var bodyA = b2BodyA.parent;
    var bodyB = b2BodyB.parent;
    if (bodyA !== undefined && bodyB !== undefined) {
      var idA = bodyA.id;
      var idB = bodyB.id;
      if (bodyA._bodyContactCallbacks[idB]) {
        bodyA._bodyContactCallbacks[idB].call(
          bodyA._bodyContactCallbackContext[idB],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          begin,
          contact,
        );
      }
      if (bodyB._bodyContactCallbacks[idA]) {
        bodyB._bodyContactCallbacks[idA].call(
          bodyB._bodyContactCallbackContext[idA],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          begin,
          contact,
        );
      }
      if (bodyA._fixtureContactCallbacks[fixtureB.id]) {
        bodyA._fixtureContactCallbacks[fixtureB.id].call(
          bodyA._fixtureContactCallbackContext[fixtureB.id],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          begin,
          contact,
        );
      }
      if (bodyB._fixtureContactCallbacks[fixtureA.id]) {
        bodyB._fixtureContactCallbacks[fixtureA.id].call(
          bodyB._fixtureContactCallbackContext[fixtureA.id],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          begin,
          contact,
        );
      }
      if (bodyA._fixtureContactCallbacks[fixtureA.id]) {
        bodyA._fixtureContactCallbacks[fixtureA.id].call(
          bodyA._fixtureContactCallbackContext[fixtureA.id],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          begin,
          contact,
        );
      }
      if (bodyB._fixtureContactCallbacks[fixtureB.id]) {
        bodyB._fixtureContactCallbacks[fixtureB.id].call(
          bodyB._fixtureContactCallbackContext[fixtureB.id],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          begin,
          contact,
        );
      }
      if (bodyA._categoryContactCallbacks[categoryB]) {
        bodyA._categoryContactCallbacks[categoryB].call(
          bodyA._categoryContactCallbackContext[categoryB],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          begin,
          contact,
        );
      }
      if (bodyB._categoryContactCallbacks[categoryA]) {
        bodyB._categoryContactCallbacks[categoryA].call(
          bodyB._categoryContactCallbackContext[categoryA],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          begin,
          contact,
        );
      }
      if (bodyA._categoryContactCallbacks[categoryA]) {
        bodyA._categoryContactCallbacks[categoryA].call(
          bodyA._categoryContactCallbackContext[categoryA],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          begin,
          contact,
        );
      }
      if (bodyB._categoryContactCallbacks[categoryB]) {
        bodyB._categoryContactCallbacks[categoryB].call(
          bodyB._categoryContactCallbackContext[categoryB],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          begin,
          contact,
        );
      }
    }
  }
  PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold) {
    var fixtureA = contact.GetFixtureA();
    var fixtureB = contact.GetFixtureB();
    var b2BodyA = fixtureA.GetBody();
    var b2BodyB = fixtureB.GetBody();
    var categoryA = fixtureA.GetFilterData().categoryBits;
    var categoryB = fixtureB.GetFilterData().categoryBits;
    var bodyA = b2BodyA.parent;
    var bodyB = b2BodyB.parent;
    if (bodyA !== undefined && bodyB !== undefined) {
      var idA = bodyA.id;
      var idB = bodyB.id;
      if (bodyA._bodyPresolveCallbacks[idB]) {
        bodyA._bodyPresolveCallbacks[idB].call(
          bodyA._bodyPresolveCallbackContext[idB],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          contact,
          oldManifold,
        );
      }
      if (bodyB._bodyPresolveCallbacks[idA]) {
        bodyB._bodyPresolveCallbacks[idA].call(
          bodyB._bodyPresolveCallbackContext[idA],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          contact,
          oldManifold,
        );
      }
      if (bodyA._fixturePresolveCallbacks[fixtureB.id]) {
        bodyA._fixturePresolveCallbacks[fixtureB.id].call(
          bodyA._fixturePresolveCallbackContext[fixtureB.id],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          contact,
          oldManifold,
        );
      }
      if (bodyB._fixturePresolveCallbacks[fixtureA.id]) {
        bodyB._fixturePresolveCallbacks[fixtureA.id].call(
          bodyB._fixturePresolveCallbackContext[fixtureA.id],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          contact,
          oldManifold,
        );
      }
      if (bodyA._categoryPresolveCallbacks[categoryB]) {
        bodyA._categoryPresolveCallbacks[categoryB].call(
          bodyA._categoryPresolveCallbackContext[categoryB],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          contact,
          oldManifold,
        );
      }
      if (bodyB._categoryPresolveCallbacks[categoryA]) {
        bodyB._categoryPresolveCallbacks[categoryA].call(
          bodyB._categoryPresolveCallbackContext[categoryA],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          contact,
          oldManifold,
        );
      }
    }
  }
  PostSolve(contact: box2d.b2Contact, impulse: box2d.b2ContactImpulse) {
    var fixtureA = contact.GetFixtureA();
    var fixtureB = contact.GetFixtureB();
    var b2BodyA = fixtureA.GetBody();
    var b2BodyB = fixtureB.GetBody();
    var categoryA = fixtureA.GetFilterData().categoryBits;
    var categoryB = fixtureB.GetFilterData().categoryBits;
    var bodyA = b2BodyA.parent;
    var bodyB = b2BodyB.parent;
    if (bodyA !== undefined && bodyB !== undefined) {
      var idA = bodyA.id;
      var idB = bodyB.id;
      if (bodyA._bodyPostsolveCallbacks[idB]) {
        bodyA._bodyPostsolveCallbacks[idB].call(
          bodyA._bodyPostsolveCallbackContext[idB],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          contact,
          impulse,
        );
      }
      if (bodyB._bodyPostsolveCallbacks[idA]) {
        bodyB._bodyPostsolveCallbacks[idA].call(
          bodyB._bodyPostsolveCallbackContext[idA],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          contact,
          impulse,
        );
      }
      if (bodyA._fixturePostsolveCallbacks[fixtureB.id]) {
        bodyA._fixturePostsolveCallbacks[fixtureB.id].call(
          bodyA._fixturePostsolveCallbackContext[fixtureB.id],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          contact,
          impulse,
        );
      }
      if (bodyB._fixturePostsolveCallbacks[fixtureA.id]) {
        bodyB._fixturePostsolveCallbacks[fixtureA.id].call(
          bodyB._fixturePostsolveCallbackContext[fixtureA.id],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          contact,
          impulse,
        );
      }
      if (bodyA._categoryPostsolveCallbacks[categoryB]) {
        bodyA._categoryPostsolveCallbacks[categoryB].call(
          bodyA._categoryPostsolveCallbackContext[categoryB],
          bodyA,
          bodyB,
          fixtureA,
          fixtureB,
          contact,
          impulse,
        );
      }
      if (bodyB._categoryPostsolveCallbacks[categoryA]) {
        bodyB._categoryPostsolveCallbacks[categoryA].call(
          bodyB._categoryPostsolveCallbackContext[categoryA],
          bodyB,
          bodyA,
          fixtureB,
          fixtureA,
          contact,
          impulse,
        );
      }
    }
  }
}
