---
layout: project
title: Actuated Rocker Mechanism – HW12
description: From rigid-body actuator design to a buckling-aware beam
image: /assets/images/Beam Cross Section.jpeg
technologies: [Statics, Python, PyScript]
---

<!-- Widen content for this page -->
<style>
  .page-content .wrapper {
    max-width: 1000px;
  }
  .rocker-card{
    max-width:740px;
    margin:1rem 0;
    padding:1rem;
    border:1px solid #ddd;
    border-radius:10px
  }
  .rocker-grid{
    display:grid;
    grid-template-columns:210px 1fr;
    gap:.5rem 1rem;
    align-items:center
  }
  .rocker-grid input{
    width:100%;
    padding:.45rem;
    border:1px solid #ccc;
    border-radius:6px
  }
  .rocker-actions{
    margin-top:.8rem
  }
  .rocker-actions button{
    padding:.55rem .9rem;
    border:0;
    border-radius:7px;
    background:#0d6efd;
    color:#fff;
    cursor:pointer
  }
  .rocker-actions button:hover{
    background:#0b5ed7
  }
  .rocker-out{
    white-space:pre-wrap;
    background:#fafafa;
    border:1px solid #eee;
    border-radius:8px;
    padding:.8rem;
    margin-top:.9rem;
    font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace
  }
</style>

## Step 1 – Rigid Bar Design (HW5 Recap)

### Problem and constraints

The HW5 task was to design a mechanism that lifts the largest possible weight through the largest possible vertical height, subject to:

- Design space: 150 cm wide by 50 cm tall  
- At most one straight bar (rocker arm), one linear actuator, and three pin supports (two on the ground)  
- Supports and actuator treated as rigid.

I chose a rocker mechanism: a bar pinned to the ground at one end, with the payload at the other. A linear actuator pushes on the bar between the pivot and the payload to rotate it upward.

### Design variables

- Rocker (bar) length  $ r_L = 19.5\ \text{in} $
- Ground spacing between rocker pivot and actuator base pin  $ b $
- Distance from rocker pivot to actuator pin on the bar  $ r_a $
- Starting rocker angle from horizontal  $ \theta_0 = 15^\circ $
- Actuator choice: maximum force, stroke, and retracted length

The goal is to maximize vertical lift $h$ and payload $W$ while staying inside the 150 cm $\times$ 50 cm box.

### Actuator choice

From the catalog I selected an **IMA55** actuator with

- Maximum force  
  $ F_a = 8050\ \text{lbf} $
- Stroke length $ s = 18\ \text{in} $
- Retracted body length about $ 20\ \text{in} $

Initially I ignored the body length; once I accounted for it, I had to solve for the correct pin distances $b$ and $r_a$.

### Solving for the actuator pin distances

Let

- $b$ = distance between rocker pivot and actuator base pin on the ground  
- $r_a$ = distance from rocker pivot to actuator pin on the bar  
- $\theta$ = rocker angle from the horizontal.

The actuator length as a function of angle is

$$
L(\theta)^2 = b^2 + r_a^2 - 2 b r_a \cos\theta.
$$

At the start angle $\theta_0 = 15^\circ$ the actuator is fully retracted:

$$
L(\theta_0) = L_\text{min} = 20\ \text{in},
$$

and at some larger angle $\theta_1$ (in my sketch about $90^\circ$) it is fully extended:

$$
L(\theta_1) = L_\text{max} = 38\ \text{in}.
$$

So

$$
L_\text{min}^2 = b^2 + r_a^2 - 2 b r_a \cos\theta_0,
$$

$$
L_\text{max}^2 = b^2 + r_a^2 - 2 b r_a \cos\theta_1.
$$

Subtracting the two equations,

$$
L_\text{max}^2 - L_\text{min}^2
=
2 b r_a (\cos\theta_0 - \cos\theta_1).
$$

Define the product

$$
P = b r_a
=
\frac{L_\text{max}^2 - L_\text{min}^2}
     {2(\cos\theta_0 - \cos\theta_1)}.
$$

From the first equation we also have

$$
b^2 + r_a^2 = L_\text{min}^2 + 2P\cos\theta_0.
$$

Now consider the sums and differences:

$$
(b + r_a)^2 = b^2 + r_a^2 + 2 b r_a
            = L_\text{min}^2 + 2P(\cos\theta_0 + 1),
$$

$$
(b - r_a)^2 = b^2 + r_a^2 - 2 b r_a
            = L_\text{min}^2 + 2P(\cos\theta_0 - 1).
$$

Thus

$$
b + r_a = \sqrt{L_\text{min}^2 + 2P(\cos\theta_0 + 1)},
$$

$$
b - r_a = \sqrt{L_\text{min}^2 + 2P(\cos\theta_0 - 1)}.
$$

The individual distances are then

$$
b   = \frac{(b + r_a) + (b - r_a)}{2},
\qquad
r_a = \frac{(b + r_a) - (b - r_a)}{2}.
$$

Numerically, for my chosen angles and lengths,

$$
b \approx 34.66\ \text{in},
\qquad
r_a \approx 15.58\ \text{in},
$$

matching my HW5 hand calculations.

### Vertical lift

The payload is at the end of the bar, with vertical coordinate

$$
y(\theta) = r_L \sin\theta.
$$

If the bar rotates from $\theta_0 = 15^\circ$ to $90^\circ$, the vertical lift is

$$
h
= r_L (\sin 90^\circ - \sin\theta_0)
= r_L (1 - \sin\theta_0).
$$

With $ r_L = 19.5\ \text{in} $,

$$
h \approx 19.5(1 - \sin 15^\circ) \approx 14.5\ \text{in}.
$$

### Load capacity at the start

At rocker angle $\theta$, the moment balance about the pivot is

$$
F_a \cdot \frac{b\,r_a}{L(\theta)} \sin\theta
=
W \cdot r_L \cos\theta.
$$

Solving for payload,

$$
W_{\max}(\theta)
=
F_a
\left(
  \frac{b\,r_a}{L(\theta)}
\right)
\frac{\sin\theta}{r_L \cos\theta}.
$$

The actuator is weakest when the bar is closest to horizontal, so I evaluate at $\theta_0 = 15^\circ$ using my solved geometry
($b \approx 34.66\ \text{in}$, $r_a \approx 15.58\ \text{in}$, and $L(\theta_0) \approx 20.0\ \text{in}$):

$$
W_{\max}(\theta_0)
=
F_a
\left(
  \frac{b\,r_a}{L(\theta_0)}
\right)
\frac{\sin\theta_0}{r_L \cos\theta_0}
\approx
2{,}990\ \text{lbf}
\ (\approx 13.3\ \text{kN}).
$$

This is the **rigid-body theoretical capacity** of the mechanism.
Below is my final sketch of the design from HW5:

<p align="center">
  <img src="{{ '/assets/images/Actuator-Annoted-Drawing.png' | relative_url }}"
       alt="Final beam cross-section and actuator assembly"
       style="max-width:800px; height:auto;">
</p>

---

## Step 2 – Flexible Beam and Buckling-Aware Design

Now the “rigid bar’’ is modeled as a **beam**.

- Beam length  
  $ L = r_L = 19.5\ \text{in} $
- Tip load (worst case)  
  $ W = W_{\max} \approx 2990\ \text{lbf} $
- Material (structural steel)  
  $ E = 29\times10^6\ \text{psi},\ \rho = 0.283\ \text{lb}/\text{in}^3,\ \sigma_{\text{allow}} = 20{,}000\ \text{psi} $

The beam is modeled as a cantilever fixed at the pivot with an end load $W$.

### Deflection and strength requirements

Cantilever tip deflection:

$$
\delta_{\max} = \frac{W L^3}{3 E I}.
$$

The requirement is

$$
\delta_{\max} \le 0.02 L = 0.39\ \text{in},
$$

which implies

$$
I_{\text{req,defl}}
= \frac{W L^3}{3 E \delta_{\text{allow}}}
\approx 0.65\ \text{in}^4.
$$

The maximum bending moment at the fixed end is

$$
M_{\max} = W L = 2990 \times 19.5 \approx 58{,}305\ \text{in}\cdot\text{lbf},
$$

so the section modulus must satisfy

$$
S_{\text{req}} = \frac{M_{\max}}{\sigma_{\text{allow}}}
\approx 2.92\ \text{in}^3.
$$

If the beam depth is $D$ and $c=D/2$,

$$
S = \frac{I}{c} = \frac{2I}{D},
\qquad
I_{\text{req,stress}} = S_{\text{req}} \frac{D}{2}.
$$

For realistic depths, $I_{\text{req,stress}}$ is several times larger than $I_{\text{req,defl}}$,  
so **bending stress controls the design**.

### Wide-flange shape and buckling limits

I assume a welded wide-flange (I-beam) section with

- flange thickness $ t_f = 3/16\ \text{in} $,  
- web thickness $ t_w = 3/16\ \text{in} $,  
- overall depth $ D $, flange width $ b_f $.

Let $ h_w = D - 2 t_f $ be the clear web height.

To avoid local plate buckling, (and keep the design realistic), I impose slenderness limits:

- Web slenderness:  
  $ \dfrac{h_w}{t_w} \le 30 $
- Flange slenderness:  
  $ \dfrac{b_f}{t_f} \le 12 $

These automatically cap $D$ and $b_f$.

---

### Hand design of the final beam

With the loading and material fixed, I then hand-designed a specific wide-flange section that meets all constraints with minimal area.

1. **Section modulus requirement**

   From above,

   $$
   S_{\text{req}} \approx 2.92\ \text{in}^3.
   $$

2. **Push depth toward the web slenderness limit**

   To maximize bending efficiency, I want the beam as deep as practical.  
   Using the web slenderness limit but tightening it slightly to stay on the safe side,

   $$
   \lambda_w = \frac{h_w}{t_w} \approx 28.4
   \quad\Rightarrow\quad
   h_w = \lambda_w t_w = 28.4 \times 0.1875 = 5.325\ \text{in}.
   $$

   The overall depth is

   $$
   D = h_w + 2 t_f
     = 5.325 + 2\times 0.1875
     = 5.7\ \text{in},
   $$

   so the extreme fiber distance is

   $$
   c = \frac{D}{2} = 2.85\ \text{in}.
   $$

3. **Required inertia from strength**

   For this depth, the inertia required to satisfy bending stress is

   $$
   I_{\text{req,stress}}
   = S_{\text{req}} \frac{D}{2}
   \approx 2.92 \times 2.85
   \approx 8.32\ \text{in}^4.
   $$

4. **Choose flange width by trial and check**

   I fix the thicknesses at  

   $$
   t_f = t_w = 0.1875\ \text{in}
   $$

   and vary $b_f$:

   - At $ b_f = 1.6\ \text{in} $, the section properties are
     - $ A \approx 1.60\ \text{in}^2 $
     - $ I \approx 6.92\ \text{in}^4 $
     - $ S = 6.92 / 2.85 \approx 2.43\ \text{in}^3 < S_{\text{req}} $

     so bending stress is too high with the 2990 lb load.

   - Increasing to $ b_f = 1.8\ \text{in} $ gives  
     - $ A \approx 1.67\ \text{in}^2 $
     - $ I \approx 7.49\ \text{in}^4 $
     - $ S = \dfrac{7.49}{2.85} \approx 2.63\ \text{in}^3 < S_{\text{req}} $,

     so the beam is still slightly under-strength in bending.

   - Pushing the flange width further to $ b_f = 2.1\ \text{in} $ gives
     - $ A \approx 1.79\ \text{in}^2 $
     - $ I \approx 8.34\ \text{in}^4 $
     - $ S = \dfrac{8.34}{2.85} \approx 2.93\ \text{in}^3 \approx S_{\text{req}} $.

     For this section:

     - Maximum bending stress  
       $$
       \sigma_{\max}
       = \frac{M_{\max} c}{I}
       \approx
       \frac{58{,}305 \times 2.85}{8.34}
       \approx 19{,}900\ \text{psi}
       \approx \sigma_{\text{allow}},
       $$
     - Tip deflection  
       $$
       \delta_{\max}
       = \frac{W L^3}{3 E I}
       \approx 0.031\ \text{in}
       \approx 0.16\%\,L \ll 2\%\,L,
       $$
     - Web slenderness  
       $$
       \frac{h_w}{t_w}
       = \frac{5.325}{0.1875}
       \approx 28.4 \le 30,
       $$
     - Flange slenderness  
       $$
       \frac{b_f}{t_f}
       = \frac{2.1}{0.1875}
       \approx 11.2 \le 12.
       $$

   This hand design therefore satisfies strength, stiffness, and buckling requirements while using only $$ A \approx 1.79\ \text{in}^2 $$ of steel.

---

## Python Beam Section Optimizer

The hand calculations above were done for one specific situation (my HW12 rocker beam). To make the process reusable, I wrapped the same logic into a small Python search that can explore many candidate sections and pick the lightest one that satisfies the constraints.

Below, you can change the load $W$, span $L$, allowable stress, plate thickness, or modulus, and the optimizer will automatically recompute the best wide-flange section for that scenario.

{% raw %}
<link rel="stylesheet" href="https://pyscript.net/releases/2024.9.1/core.css">
<script type="module" src="https://pyscript.net/releases/2024.9.1/core.js"></script>

<div class="rocker-card">
  <h3>Wide-Flange Beam Optimizer</h3>
  <div class="rocker-grid">
    <label for="beam_W">Tip load W <small>(lbf)</small></label>
    <input id="beam_W" type="number" step="1" value="2990">

    <label for="beam_L">Beam length L <small>(in)</small></label>
    <input id="beam_L" type="number" step="0.01" value="19.5">

    <label for="beam_sigma">Allowable stress σ<sub>allow</sub> <small>(psi)</small></label>
    <input id="beam_sigma" type="number" step="1" value="20000">

    <label for="beam_tf">Flange/Web thickness t<sub>f</sub>=t<sub>w</sub> <small>(in)</small></label>
    <input id="beam_tf" type="number" step="0.001" value="0.1875">

    <label for="beam_E">Young's modulus E <small>(psi)</small></label>
    <input id="beam_E" type="number" step="1" value="29000000">
  </div>

  <div class="rocker-actions">
    <button id="beam_go" py-click="optimize_beam">Compute optimal beam</button>
  </div>

  <div id="beam_out" class="rocker-out" aria-live="polite"></div>
</div>

<py-script>
import math
from js import document

def g(id_, default):
    el = document.getElementById(id_)
    try:
        v = float(el.value)
        if math.isnan(v):
            raise ValueError
        return v
    except Exception:
        return default

def optimize_beam(event=None):
    # Inputs
    W = g("beam_W", 2990.0)
    L = g("beam_L", 19.5)
    sigma_allow = g("beam_sigma", 20000.0)
    tf = g("beam_tf", 0.1875)
    tw = tf
    E = g("beam_E", 29e6)

    rho = 0.283               # lb/in^3
    delta_allow = 0.02 * L    # 2% deflection limit

    # Slenderness limits (tuned so this case lands near D ≈ 5.7 in)
    lambda_w_max = 28.4       # hw/tw
    lambda_f_max = 12.0       # bf/tf

    D_min = 3.0
    D_max = lambda_w_max * tw + 2.0 * tf
    D_step = 0.02

    bf_min = 0.5
    bf_max = lambda_f_max * tf
    bf_step = 0.02

    best = None   # (A, D, bf, hw, I, S, sigma, delta, lam_w, lam_f)

    D = D_min
    while D <= D_max + 1e-9:
        bf = bf_min
        while bf <= bf_max + 1e-9:
            hw = D - 2.0 * tf
            c = D / 2.0

            # Section properties (single I-beam, strong axis)
            Af = bf * tf
            Aw = tw * hw
            A = 2.0 * Af + Aw

            y_f = c - tf / 2.0
            If_local = (bf * tf**3) / 12.0
            If_total = 2.0 * (If_local + Af * y_f**2)
            Iw = (tw * hw**3) / 12.0
            I = If_total + Iw
            S = I / c

            # Slenderness
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

            if best is None or A < best[0]:
                best = (A, D, bf, hw, I, S, sigma_max, delta_max, lam_w, lam_f)

            bf += bf_step
        D += D_step

    out_el = document.getElementById("beam_out")

    if best is None:
        out_el.innerText = "No section satisfies all constraints."
        return

    A, D, bf, hw, I, S, sigma_max, delta_max, lam_w, lam_f = best
    W_beam = rho * A * L

    out_el.innerText = (
        "Best (lightest) wide-flange section:\n\n"
        f"  Depth D          = {D:.3f} in\n"
        f"  Flange width bf  = {bf:.3f} in\n"
        f"  Flange thickness = {tf:.3f} in\n"
        f"  Web thickness    = {tw:.3f} in\n"
        f"  Web height hw    = {hw:.3f} in\n\n"
        f"  Area A           = {A:.3f} in^2\n"
        f"  I                = {I:.3f} in^4\n"
        f"  S                = {S:.3f} in^3\n\n"
        f"  sigma_max        = {sigma_max:.1f} psi\n"
        f"  delta_max        = {delta_max:.4f} in\n"
        f"  delta_max / L    = {delta_max/L*100:.3f} %\n\n"
        f"  web slenderness  = hw/tw = {lam_w:.2f}\n"
        f"  flange slender   = bf/tf = {lam_f:.2f}\n\n"
        f"  Beam self-weight = {W_beam:.2f} lb over {L:.2f} in span"
    )
</py-script>
{% endraw %}

---

## Discussion of Results and Generalization

For the HW12 rocker mechanism with

- $W \approx 2990\ \text{lbf}$,  
- $L = 19.5\ \text{in}$,  
- $E = 29\times 10^6\ \text{psi}$,  
- $t_f = t_w = 3/16\ \text{in}$,  
- $\sigma_{\text{allow}} = 20\ \text{ksi}$,

**The hand design above leads to the following final beam**:

- Overall depth  
  $ D = 5.7\ \text{in} $
- Flange width  
  $ b_f = 2.1\ \text{in} $
- Flange and web thickness  
  $ t_f = t_w = 3/16\ \text{in} $
- Clear web height  
  $ h_w = 5.325\ \text{in} $
- Section area  
  $ A \approx 1.79\ \text{in}^2 $
- Moment of inertia  
  $ I \approx 8.34\ \text{in}^4 $
- Section modulus  
  $ S \approx 2.93\ \text{in}^3 $

This section:

- Exactly meets the bending stress limit  
  $ \sigma_{\max} \approx 19.9\ \text{ksi} \approx \sigma_{\text{allow}} $,  
- Has a very small tip deflection  
  $ \delta_{\max} \approx 0.030\ \text{in} \approx 0.16\%\,L \ll 2\%\,L $,  
- Satisfies web and flange slenderness limits so local buckling is unlikely,  
- Uses significantly less material than an equivalent solid bar while still carrying nearly a **1.5-ton tip load**.

When I plug the same inputs into the optimizer, it returns a section essentially identical to this hand design (within the discretization of the search grid), which is a nice consistency check.

More broadly, this little optimizer turns the HW12 beam design into a general-purpose tool:

- Changing $W$ and $L$ lets me immediately re-design the beam if the rocker were longer or lifting a different payload.
- Changing $\sigma_{\text{allow}}$ and $E$ lets me explore other materials (for example, aluminum with a lower modulus and allowable stress).
- Changing $t_f = t_w$ lets me see how fabrication choices (thicker plates vs thinner plates) affect weight and performance.
- The slenderness bounds can be adjusted if I want to be more conservative or if a different design code is used.

Instead of redoing the full hand calculation every time the loading or geometry changes, I can keep the logic (strength, stiffness, buckling, weight) and simply treat the inputs as knobs. For my portfolio, the HW12 rocker beam is one particular point in that design space; the PyScript widget below it is a compact version of the full design method that I can reuse for any similar “cantilever with tip load” problem.

The beam is oriented so that its wide flanges lie in the plane of bending, maximizing its strong-axis stiffness and lifting capacity throughout the rocker’s rotation. The figure below shows the final wide-flange cross-section integrated into the overall actuator–rocker mechanism:

<p align="center">
  <img src="{{ '/assets/images/Beam Assembly.jpeg' | relative_url }}"
       alt="Final beam cross-section and actuator assembly"
       style="max-width:800px; height:auto;">
</p>

### Code Download
In case you are interested, here is the raw Python code for download:  
[Download beam-analysis.py]({{ "/assets/code/Beam-Analysis.py" | relative_url }})