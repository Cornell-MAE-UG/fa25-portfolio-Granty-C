import math

def optimize_beam(
    W=2990.0,        # tip load [lbf]
    L=19.5,          # beam length [in]
    sigma_allow=20000.0,  # allowable bending stress [psi]
    tf=0.1875,       # flange thickness [in]
    E=29e6           # Young's modulus [psi]
):
    """
    Return the lightest welded wide-flange section that satisfies:
      - bending stress <= sigma_allow
      - tip deflection <= 0.02 * L
      - web/flange slenderness limits
    """

    tw = tf
    rho = 0.283              # lb / in^3
    delta_allow = 0.02 * L   # 2% deflection limit

    # Slenderness limits (same as page version)
    lambda_w_max = 28.4      # hw / tw
    lambda_f_max = 12.0      # bf / tf

    # Search ranges
    D_min = 3.0
    D_max = lambda_w_max * tw + 2.0 * tf   # ~5.7 in
    D_step = 0.02

    bf_min = 0.5
    bf_max = lambda_f_max * tf
    bf_step = 0.02

    best = None  # (A, D, bf, hw, I, S, sigma, delta, lam_w, lam_f)

    D = D_min
    while D <= D_max + 1e-9:
        bf = bf_min
        while bf <= bf_max + 1e-9:
            hw = D - 2.0 * tf
            c = D / 2.0

            # Section properties
            Af = bf * tf
            Aw = tw * hw
            A = 2.0 * Af + Aw

            y_f = c - tf / 2.0
            If_local = (bf * tf**3) / 12.0
            If_total = 2.0 * (If_local + Af * y_f**2)
            Iw = (tw * hw**3) / 12.0
            I = If_total + Iw
            S = I / c

            # Slenderness checks
            lam_w = hw / tw
            lam_f = bf / tf
            if lam_w > lambda_w_max or lam_f > lambda_f_max:
                bf += bf_step
                continue

            # Strength
            M_max = W * L
            sigma_max = M_max * c / I
            if sigma_max > sigma_allow:
                bf += bf_step
                continue

            # Deflection
            delta_max = W * L**3 / (3.0 * E * I)
            if delta_max > delta_allow:
                bf += bf_step
                continue

            # Keep the lightest (smallest A)
            if best is None or A < best[0]:
                best = (A, D, bf, hw, I, S, sigma_max, delta_max, lam_w, lam_f)

            bf += bf_step
        D += D_step

    if best is None:
        return None

    A, D, bf, hw, I, S, sigma_max, delta_max, lam_w, lam_f = best
    W_beam = rho * A * L

    return {
        "W": W,
        "L": L,
        "sigma_allow": sigma_allow,
        "tf": tf,
        "E": E,
        "A": A,
        "D": D,
        "bf": bf,
        "hw": hw,
        "I": I,
        "S": S,
        "sigma_max": sigma_max,
        "delta_max": delta_max,
        "delta_ratio": delta_max / L,
        "lambda_w": lam_w,
        "lambda_f": lam_f,
        "W_beam": W_beam,
    }


if __name__ == "__main__":
    # You can tweak these defaults or later swap them for input() calls.
    result = optimize_beam()

    if result is None:
        print("No section satisfies all constraints.")
    else:
        print("Best (lightest) wide-flange section:\n")
        print(f"  Depth D          = {result['D']:.3f} in")
        print(f"  Flange width bf  = {result['bf']:.3f} in")
        print(f"  Flange thickness = {result['tf']:.3f} in")
        print(f"  Web thickness    = {result['tf']:.3f} in")
        print(f"  Web height hw    = {result['hw']:.3f} in\n")

        print(f"  Area A           = {result['A']:.3f} in^2")
        print(f"  I                = {result['I']:.3f} in^4")
        print(f"  S                = {result['S']:.3f} in^3\n")

        print(f"  sigma_max        = {result['sigma_max']:.1f} psi "
              f"(allow {result['sigma_allow']:.0f} psi)")
        print(f"  delta_max        = {result['delta_max']:.4f} in")
        print(f"  delta_max / L    = {result['delta_ratio']*100:.3f} % "
              f"(limit 2.000 %)\n")

        print(f"  web slenderness  = hw/tw = {result['lambda_w']:.2f}")
        print(f"  flange slender   = bf/tf = {result['lambda_f']:.2f}\n")

        print(f"  Beam self-weight = {result['W_beam']:.2f} lb "
              f"over {result['L']:.2f} in span")
