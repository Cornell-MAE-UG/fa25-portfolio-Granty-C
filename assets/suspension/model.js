export const vehicle = Object.freeze({
  sprungMass: 300,
  wheelMass: 60,
  tireRate: 190000,
  area: 0.015,
  atmosphere: 101325,
  exponent: 1.30,
  gravity: 9.81,
});

export const baseline = Object.freeze({ height: 0.05, duration: 0.20, damping: 1000, coilRate: 16000, volume: 0.0075 });
export const step = 0.0005;
export const endTime = 6;
export const roadLoad = (vehicle.sprungMass + vehicle.wheelMass) * vehicle.gravity;
const pressure = vehicle.atmosphere + vehicle.sprungMass * vehicle.gravity / vehicle.area;
const rateTimesVolume = vehicle.exponent * pressure * vehicle.area ** 2;

export function airRate(volume) {
  return rateTimesVolume / volume;
}

export function volumeAtRate(rate) {
  return rateTimesVolume / rate;
}

export function roadAt(time, { height, duration }) {
  return time >= 0 && time <= duration ? height * (1 - Math.cos(2 * Math.PI * time / duration)) / 2 : 0;
}

function springRate(options, model) {
  return model === "coil" ? options.coilRate : airRate(options.volume);
}

function stateSlope(out, state, road, options, model) {
  const [body, bodyVelocity, wheel, wheelVelocity] = state;
  const compression = wheel - body;
  const springForce = model === "air"
    ? vehicle.area * pressure * Math.expm1(-vehicle.exponent * Math.log1p(-vehicle.area * compression / options.volume))
    : springRate(options, model) * compression;
  const suspensionForce = springForce + options.damping * (wheelVelocity - bodyVelocity);
  out[0] = bodyVelocity;
  out[1] = suspensionForce / vehicle.sprungMass;
  out[2] = wheelVelocity;
  out[3] = (vehicle.tireRate * (road - wheel) - suspensionForce) / vehicle.wheelMass;
}

export function sineResponse(frequencyHz, options, model, roadAmplitude = 0.005) {
  const { sprungMass, wheelMass, tireRate } = vehicle;
  const omega = 2 * Math.PI * frequencyHz;
  const omegaSquared = omega ** 2;
  const massSum = sprungMass + wheelMass;
  const rate = springRate(options, model);
  const dampingTerm = options.damping * omega;

  // Evaluate the common fourth-order denominator at s = jω.
  const denominatorReal = sprungMass * wheelMass * omegaSquared ** 2
    - (rate * massSum + sprungMass * tireRate) * omegaSquared + rate * tireRate;
  const denominatorImaginary = dampingTerm * (tireRate - massSum * omegaSquared);
  const denominator = Math.hypot(denominatorReal, denominatorImaginary);
  const body = roadAmplitude * tireRate * Math.hypot(rate, dampingTerm) / denominator;

  // The total tire load is the static load plus k_t times road minus wheel motion.
  const wheelNumeratorReal = tireRate * (rate - sprungMass * omegaSquared);
  const wheelNumeratorImaginary = tireRate * dampingTerm;
  const tire = roadAmplitude * tireRate * Math.hypot(denominatorReal - wheelNumeratorReal,
    denominatorImaginary - wheelNumeratorImaginary) / denominator;
  return { body, acceleration: omegaSquared * body, tire };
}

function offsetState(out, state, slope, dt) {
  for (let i = 0; i < 4; i += 1) out[i] = state[i] + slope[i] * dt;
}

export function simulate(options, model) {
  const count = Math.round(endTime / step) + 1;
  const body = new Float64Array(count);
  const wheel = new Float64Array(count);
  const acceleration = new Float64Array(count);
  const compression = new Float64Array(count);
  const tireLoad = new Float64Array(count);
  const current = new Float64Array(4);
  const temp = current.slice();
  const k1 = current.slice();
  const k2 = current.slice();
  const k3 = current.slice();
  const k4 = current.slice();

  for (let i = 0; i < count; i += 1) {
    const time = i * step;
    const road = roadAt(time, options);
    stateSlope(k1, current, road, options, model);
    body[i] = current[0];
    wheel[i] = current[2];
    acceleration[i] = k1[1];
    compression[i] = current[2] - current[0];
    tireLoad[i] = roadLoad + vehicle.tireRate * (road - current[2]);
    if (i === count - 1) break;

    const middleRoad = roadAt(time + step / 2, options);
    offsetState(temp, current, k1, step / 2);
    stateSlope(k2, temp, middleRoad, options, model);
    offsetState(temp, current, k2, step / 2);
    stateSlope(k3, temp, middleRoad, options, model);
    offsetState(temp, current, k3, step);
    stateSlope(k4, temp, roadAt(time + step, options), options, model);
    for (let j = 0; j < 4; j += 1) {
      current[j] += step / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]);
    }
  }
  return { body, wheel, acceleration, compression, tireLoad };
}

export function summarize(series, options) {
  const { body, acceleration, compression, tireLoad } = series;
  let bodyPeak = 0;
  let accelPeak = 0;
  let travel = 0;
  let minLoad = roadLoad;
  let energy = 0;
  const rmsSamples = Math.round(2 / step);

  for (let i = 0; i < body.length; i += 1) {
    bodyPeak = Math.max(bodyPeak, Math.abs(body[i]));
    accelPeak = Math.max(accelPeak, Math.abs(acceleration[i]));
    travel = Math.max(travel, Math.abs(compression[i]));
    minLoad = Math.min(minLoad, tireLoad[i]);
    if (i > 0 && i <= rmsSamples) energy += step / 2 * (acceleration[i - 1] ** 2 + acceleration[i] ** 2);
  }

  let settling = 0;
  const band = 0.02 * bodyPeak;
  for (let i = body.length - 1; i * step >= options.duration; i -= 1) {
    const magnitude = Math.abs(body[i]);
    if (magnitude <= band) continue;
    if (i === body.length - 1) {
      settling = null;
    } else {
      const fraction = (magnitude - band) / (magnitude - Math.abs(body[i + 1]));
      settling = (i + fraction) * step - options.duration;
    }
    break;
  }
  return { bodyPeak, accelPeak, accelRMS: Math.sqrt(energy / 2), travel, minLoad, settling };
}
