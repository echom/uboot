np.define('model.Interpolation', (require, name) => {
  var easeInQuad = v => v * v,
      easeOutQuad = v => 1 - easeInQuad(1 - v),
      easeInOutQuad = v => v < 0.5 ? easeInQuad(v) : easeOutQuad(v),
      easeInCubic = v => v * v * v,
      easeOutCubic = v => 1 - easeInCubic(1 - v),
      easeInOutCubic = v => v < 0.5 ? easeInCubic(v) : easeOutCubic(v),
      easeOutElastic = v => Math.pow(2, -10 * v) * Math.sin((v - 0.3 / 4) * (2 * Math.PI) / 0.3);

  class Interpolation {
    constructor(fn) {
      this._fn = fn;
    }

    interpolate(t, st = 0, et = 1, sv = 0, ev = 1) {
      var nt = (t - st) / (et - st),
          dv = ev - sv;
      return this._fn(nt) * dv;
    }

    serialize(serializer) {
      var key,
          name;
      for (key in Interpolation) {
        if (Interpolation[key] === this) {
          name = key;
        }
      }
      if (name) {
        serializer.write(name);
      } else {
        throw new Error(
          'Interpolation.serialize: Cannot serialize unknown interpolation: ' + name
        );
      }
    }

    static deserialize(serializer) {
      let name = serializer.read('name');
      if (!Interpolation[name]) {
        throw new Error(
          'Interpolation.deserialize: Cannot deserialize interpolation with name: ' + name
        );
      }
      return Interpolation[name];
    }
  }

  Interpolation.none = new Interpolation(v => 0);
  Interpolation.linear = new Interpolation(v => v);
  Interpolation.easeInQuad = new Interpolation(easeInQuad);
  Interpolation.easeOutQuad = new Interpolation(easeOutQuad);
  Interpolation.easeInOutQuad = new Interpolation(easeInOutQuad);
  Interpolation.easeInCubic = new Interpolation(easeInCubic);
  Interpolation.easeOutCubic = new Interpolation(easeOutCubic);
  Interpolation.easeInOutCubic = new Interpolation(easeInOutCubic);
  Interpolation.easeOutElastic = new Interpolation(easeOutElastic);

  require('np.doc.Serializer').register(name, Interpolation);

  return Interpolation;
});
