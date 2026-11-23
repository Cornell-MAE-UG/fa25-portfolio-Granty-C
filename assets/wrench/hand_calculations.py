"""MAE 3270 torque-wrench first cuts. Python 3, standard library only.

Run 'python hand_calculations.py' to print the numerical design iterations.
All geometry is in inches. Forces are lbf, stresses are psi and torque is in-lbf.
Float values are deliberately kept unrounded until presentation.
"""
from dataclasses import dataclass
from math import pi, sqrt


@dataclass(frozen=True)
class Material:
    name: str
    E: float
    strength: float
    toughness: float
    fatigue: float


M42 = Material("M42 (course)", 32e6, 370e3, 15e3, 150e3)
# Minimum H950 bar yield from MIL-HDBK-5J. Fracture toughness and the initial
# fatigue strength are the lower ends of the corresponding Granta ranges.
CUSTOM465 = Material("Custom 465 H950", 28.7e6, 220e3, 61.4e3, 124e3)
RATED = 600.0
CRACK = 0.040
Y = 1.12


def factors(stress, material):
    """Opening-mode edge flaw and fully reversed normal-stress amplitude."""
    intensity = Y * stress * sqrt(pi * CRACK)
    return material.strength/stress, material.toughness/intensity, material.fatigue/stress


def uniform(L, h, b, material):
    """Cantilever whose root is the drive axis, with a point force at x=L."""
    force = RATED/L
    inertia = b*h**3/12
    stress = RATED * h/(2*inertia)
    displacement = force*L**3/(3*material.E*inertia)
    return stress, displacement, factors(stress, material)


def transition(x, xa, xb, start, end):
    t = (x-xa)/(xb-xa)
    return start + (end-start)*t**3*(10-15*t+6*t*t)


def width(x):
    """Plan width of the CAD profile from the drive axis to the end of the load."""
    if x <= .4:
        return 1.10
    if x < 2.1:
        return transition(x, .4, 2.1, 1.10, .360)
    if x <= 17.6:
        return .360
    if x < 20.:
        return transition(x, 17.6, 20., .360, 1.04)
    return 1.04


def inertia(h, b=.5, r=.060):
    """Izz of a rectangular section with four quarter-circle corner rounds."""
    c = h/2-r
    corner = c*c*r*r*(1-pi/4) + c*r**3/3 + r**4*(1/3-pi/16)
    return b*h**3/12 - 4*corner


def moment(x):
    """Moment for uniform lateral traction along the 20 to 24 inch grip face."""
    force = RATED/22
    if x <= 20.:
        return force*(22.-x)
    return force*(24.-x)**2/8.


def profile(material, count=12000):
    """Euler–Bernoulli, fixed head, small rotations; midpoint quadrature.

    Integrate curvature from the head to the scale. Unit-load work gives
    the mean displacement of the loaded patch and the center-point displacement.
    The transverse rounded-section formula approximates sloped plan transitions.
    """
    dx = 24./count
    work, scale_motion, load_center = 0., 0., 0.
    peak_stress, peak_x = 0., 0.
    for j in range(count):
        x = (j+.5)*dx
        h, M = width(x), moment(x)
        I = inertia(h)
        curvature = M/(material.E*I)
        stress = M*h/(2*I)
        if stress > peak_stress:
            peak_stress, peak_x = stress, x
        work += dx*M*curvature
        scale_motion += dx*max(19.-x, 0.)*curvature
        load_center += dx*max(22.-x, 0.)*curvature
    return dict(bending_psi=peak_stress, peak_x_in=peak_x, load_patch_in=work/(RATED/22.),
                load_center_in=load_center, scale_in=scale_motion, factors=factors(peak_stress, material))


if __name__ == "__main__":
    print("Material | span, h, b [in] | stress [ksi] | travel [in] | strength, crack, fatigue factors")
    for mat, L, h in ((M42,16,.45), (CUSTOM465,16,.45), (CUSTOM465,20,.40),
                      (CUSTOM465,22,.30), (CUSTOM465,22,.36)):
        s, d, n = uniform(L, h, .5, mat)
        print(f"{mat.name:18} | {L:2} {h:.3f} .500 | {s/1000:7.3f} | {d:.4f} | "
              + ", ".join(f"{value:.3f}" for value in n))
    print("Rounded final profile:", profile(CUSTOM465))
