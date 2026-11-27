"""Quarter-car bump and frequency response. Requires Python 3.10 or later."""

import cmath
import csv
import math
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class QuarterCar:
    sprung: float = 300.0
    unsprung: float = 60.0
    tire: float = 190_000.0
    coil: float = 16_000.0
    damping: float = 1_000.0
    area: float = 0.015
    volume: float = 0.0075
    exponent: float = 1.30
    atmosphere: float = 101_325.0
    gravity: float = 9.81

    @property
    def pressure(self):
        return self.atmosphere + self.sprung * self.gravity / self.area

    @property
    def air_rate(self):
        return self.exponent * self.pressure * self.area**2 / self.volume

    @property
    def static_tire(self):
        return (self.sprung + self.unsprung) * self.gravity


@dataclass(frozen=True)
class Bump:
    height: float = 0.050
    duration: float = 0.20

    def road(self, time):
        if 0.0 <= time <= self.duration:
            return self.height * (1 - math.cos(math.tau * time / self.duration)) / 2
        return 0.0


@dataclass(frozen=True)
class Sample:
    time: float
    road: float
    body: float
    wheel: float
    acceleration: float
    compression: float
    tire_load: float


def incremental_force(compression, parameters, model):
    if model == "air":
        compression_ratio = parameters.area * compression / parameters.volume
        if compression_ratio >= 1:
            raise ValueError("Compression exhausted the assumed air chamber volume")
        return parameters.area * parameters.pressure * math.expm1(
            -parameters.exponent * math.log1p(-compression_ratio)
        )
    rate = parameters.air_rate if model == "linear_air" else parameters.coil
    return rate * compression


def derivatives(time, state, parameters, model, bump):
    body, body_velocity, wheel, wheel_velocity = state
    force = incremental_force(wheel - body, parameters, model)
    force += parameters.damping * (wheel_velocity - body_velocity)
    tire_increment = parameters.tire * (bump.road(time) - wheel)
    return body_velocity, force / parameters.sprung, wheel_velocity, (
        tire_increment - force
    ) / parameters.unsprung


def simulate(parameters=QuarterCar(), model="coil", bump=Bump(), end=6.0, dt=0.0005):
    if model not in {"coil", "linear_air", "air"}:
        raise ValueError(f"Unknown suspension model: {model}")
    if dt <= 0 or end <= 0:
        raise ValueError("Use a positive time horizon and time step")
    steps = math.ceil(end / dt)
    dt = end / steps
    state = (0.0, 0.0, 0.0, 0.0)
    samples = []

    def slope(time, current):
        return derivatives(time, current, parameters, model, bump)

    for index in range(steps + 1):
        time = index * dt
        road = bump.road(time)
        body, _, wheel, _ = state
        k1 = slope(time, state)
        samples.append(Sample(time, road, body, wheel, k1[1], wheel - body,
                              parameters.static_tire + parameters.tire * (road - wheel)))
        if index == steps:
            break
        half_step = dt / 2
        k2 = slope(time + half_step, tuple(x + half_step * k for x, k in zip(state, k1)))
        k3 = slope(time + half_step, tuple(x + half_step * k for x, k in zip(state, k2)))
        k4 = slope(time + dt, tuple(x + dt * k for x, k in zip(state, k3)))
        state = tuple(x + dt * (a + 2 * b + 2 * c + d) / 6
                      for x, a, b, c, d in zip(state, k1, k2, k3, k4))
    return samples


def metrics(samples, bump=Bump(), rms_end=2.0):
    body_peak = max(abs(row.body) for row in samples)
    band = 0.02 * body_peak
    settling = 0.0
    for index in range(len(samples) - 1, -1, -1):
        row = samples[index]
        if row.time < bump.duration:
            break
        if abs(row.body) > band:
            if index == len(samples) - 1:
                settling = None
            else:
                next_row = samples[index + 1]
                fraction = (abs(row.body) - band) / (abs(row.body) - abs(next_row.body))
                settling = row.time + fraction * (next_row.time - row.time) - bump.duration
            break
    rms_rows = [row for row in samples if row.time <= rms_end + 1e-10]
    if len(rms_rows) < 2 or not math.isclose(rms_rows[-1].time, rms_end, abs_tol=1e-9):
        raise ValueError("RMS window must end on the simulation grid")
    integral = sum((b.time - a.time) * (a.acceleration**2 + b.acceleration**2) / 2
                   for a, b in zip(rms_rows, rms_rows[1:]))
    return {
        "body_mm": body_peak * 1000,
        "accel_peak": max(abs(row.acceleration) for row in samples),
        "accel_rms": math.sqrt(integral / rms_end),
        "travel_mm": max(abs(row.compression) for row in samples) * 1000,
        "min_load_n": min(row.tire_load for row in samples),
        "settle_s": settling,
    }


def frequency_response(omega, parameters=QuarterCar(), model="coil"):
    if model not in {"coil", "linear_air"}:
        raise ValueError("Frequency response requires a linear suspension")
    k = parameters.air_rate if model == "linear_air" else parameters.coil
    s = complex(0, omega)
    h = k + parameters.damping * s
    determinant = (parameters.sprung * s**2 + h) * (
        parameters.unsprung * s**2 + h + parameters.tire
    ) - h**2
    body = parameters.tire * h / determinant
    wheel = parameters.tire * (parameters.sprung * s**2 + h) / determinant
    return body, s**2 * body, wheel - body, parameters.tire * (1 - wheel)


def write_csv(path, samples):
    with Path(path).open("w", newline="", encoding="utf-8") as output:
        writer = csv.writer(output)
        writer.writerow(["time_s", "road_m", "body_m", "wheel_m", "body_accel_m_s2",
                         "compression_m", "total_tire_load_n"])
        for row in samples:
            writer.writerow([row.time, row.road, row.body, row.wheel, row.acceleration,
                             row.compression, row.tire_load])


def main():
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", choices=("coil", "air", "linear_air"), default="coil")
    parser.add_argument("--height-mm", type=float, default=50.0)
    parser.add_argument("--duration-s", type=float, default=0.20)
    parser.add_argument("--volume-l", type=float, default=7.5)
    parser.add_argument("--damping", type=float, default=1000.0)
    parser.add_argument("--csv", type=Path)
    args = parser.parse_args()
    if min(args.height_mm, args.duration_s, args.volume_l, args.damping) <= 0:
        parser.error("Height, duration, volume and damping must all be positive")
    if args.duration_s >= 2.0:
        parser.error("Bump duration must be shorter than the 2 second RMS window")
    parameters = QuarterCar(damping=args.damping, volume=args.volume_l / 1000)
    bump = Bump(args.height_mm / 1000, args.duration_s)
    try:
        samples = simulate(parameters, args.model, bump)
    except ValueError as error:
        parser.error(str(error))
    result = metrics(samples, bump)
    for label, value in result.items():
        print(f"{label:<15} {value:.5g}" if value is not None else f"{label:<15} > 6 s")
    if result["min_load_n"] <= 0:
        print("The run predicts loss of tire contact. The contact assumption fails for part of the trace.")
    if args.csv:
        write_csv(args.csv, samples)


if __name__ == "__main__":
    main()
