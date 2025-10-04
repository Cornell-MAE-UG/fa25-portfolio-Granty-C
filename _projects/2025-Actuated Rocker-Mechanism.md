---
layout: project
title: Actuated Rocker Mechanism
description: Designing a linear actuator mechanism with Python analysis
technologies: [Statics, Python, PyScript]
image: /assets/images/Actuator-Sketch.jpeg
---

### Story of the Design

When given the challenge to design a mechanism that could lift the most amount of force over the highest change in elevation possible for our Statics class at Cornell, it seemed that the task would be simple, but after looking into the incredible amount of design considerations and criteria that a seemingly simple project offered, I certainly had my work cut out for me. The primary constraints of our design were that it had to fit into a 150cm wide by 50cm tall design space, with a maximum allowence of 3 pins, 1 solid beam, and 1 linear actuator. 

The first step of approaching the task was turning to actuator catalogs.  
The **IMA55 linear actuator** stood out immediately - it offered an impressively large strength rating in addition to a comfortable 18 inch stroke - plenty considering our space limitations. On paper, it seemed like the perfect choice.

I began sketching a rocker mechanism where the IMA55 would push against a rigid bar, rotating it upwards to generate lift. At first glance, everything looked feasible, with initial calculations offering exceedingly suffiecient load capactiy even at near horizontal. But I made a critical oversight: I had neglected to account for the body length of the actuator itself. My initial sketch assumed only the stroke mattered. Once I realized the actuator had a ~20-inch body in addition to the stroke, the entire geometry changed.

That realization forced me to redo my sketch and rethink the pivot placement. Here’s the corrected analysis and sketch after including the actuator body length:

<p align="center">
  <img src="{{ '/assets/images/Actuator-Calculations.png' | relative_url }}" 
       alt="Rocker–actuator analysis" 
       style="max-width:600px; height:auto;">
</p>

With the corrected geometry, the design became much more realistic — the actuator could still fully extend, and the rocker could move all the way from 15 degrees (a "bottom" point that I felt was reasonable) to 90 degrees. As one can deduce from intuition, the actuator is comparitively "weakest" when the rocker is closest to horizontal. The beauty of this design is rather than being fixed at one change in height with the set payload, by moving the base of the actuator nearer/further from the rocker arm, we can exchange change in height and maximum payload. The only issue is every time I wanted to make an alteration, I would have to re-do all of the math. Clearly, I needed a better system.

---

### Taking it Further with Code

While the sketch gave me intuition, I wanted something more powerful: a way to try **any** actuator to instantly calculate the geometry and capacity. So I wrote a Python program that:

- Prompts the user for actuator specs (force, stroke, retracted body length) and rocker dimensions,  
- Computes the **ground spacing (b)** and **actuator pin radius (rₐ)**,  
- Reports the **lift height (h)** from the starting angle to 90°,  
- Calculates the **maximum payload at the start angle** using torque balance.  

This turned my one-off sketch into a reusable design tool.

---

## Try it!

{% raw %}
<link rel="stylesheet" href="https://pyscript.net/releases/2024.9.1/core.css">
<script type="module" src="https://pyscript.net/releases/2024.9.1/core.js"></script>

<style>
  .rocker-card{max-width:740px;margin:1rem 0;padding:1rem;border:1px solid #ddd;border-radius:10px}
  .rocker-grid{display:grid;grid-template-columns:220px 1fr;gap:.5rem 1rem;align-items:center}
  .rocker-grid input{width:100%;padding:.45rem;border:1px solid #ccc;border-radius:6px}
  .rocker-actions{margin-top:.8rem}
  .rocker-actions button{padding:.55rem .9rem;border:0;border-radius:7px;background:#0d6efd;color:#fff;cursor:pointer}
  .rocker-actions button:hover{background:#0b5ed7}
  .rocker-out{white-space:pre-wrap;background:#fafafa;border:1px solid #eee;border-radius:8px;padding:.8rem;margin-top:.9rem;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace}
</style>

<div class="rocker-card">
  <h3>Actuated Rocker Calculator</h3>
  <div class="rocker-grid">
    <label for="F">Actuator force <small>(lbf)</small></label>
    <input id="F" type="number" step="1">

    <label for="s">Actuator stroke <small>(in)</small></label>
    <input id="s" type="number" step="0.01">

    <label for="L0">Body length retracted <small>(pin-to-pin, in)</small></label>
    <input id="L0" type="number" step="0.01">

    <label for="rL">Rocker radius r<sub>L</sub> <small>(in)</small></label>
    <input id="rL" type="number" step="0.01">

    <label for="th0">Start angle θ<sub>0</sub> <small>(deg)</small></label>
    <input id="th0" type="number" step="0.1">
  </div>

  <div class="rocker-actions">
    <button id="go" py-click="compute">Compute</button>
  </div>

  <div id="out" class="rocker-out" aria-live="polite"></div>
</div>

<py-script>
import math
from js import document

def _val(id_, label):
    el = document.getElementById(id_)
    if el is None:
        raise Exception(f"Missing input: {label}")
    raw = (el.value or "").strip()
    if not raw:
        raise Exception(f"Please enter: {label}")
    try:
        return float(raw)
    except:
        raise Exception(f"{label} must be a number.")

def solve_geom(L0, L1, th0_deg, th1_deg=90.0):
    t0, t1 = math.radians(th0_deg), math.radians(th1_deg)
    c0, c1 = math.cos(t0), math.cos(t1)
    if abs(c0 - c1) < 1e-12:
        raise Exception("θ₀ and θ₁ must be different.")
    S0, S1 = L0**2, L1**2
    R = (S1 - S0) / (2.0 * (c0 - c1))     # = b * r_a
    B = S1 + 2.0 * R * c1                 # = b² + r_a²
    if B < 2.0 * abs(R):
        raise Exception("Infeasible geometry for these inputs.")
    s1 = math.sqrt(max(0.0, B + 2.0*R))
    s2 = math.sqrt(max(0.0, B - 2.0*R))
    b  = 0.5 * (s1 + s2)
    ra = 0.5 * (s1 - s2)
    return b, ra

def actuator_len(b, ra, th):
    return math.sqrt(max(0.0, b*b + ra*ra - 2*b*ra*math.cos(th)))

def w_max_start(F, rL, b, ra, th):
    L = actuator_len(b, ra, th)
    if L < 1e-9:
        return 0.0
    return F * (b*ra/L) * math.sin(th) / (rL * max(math.cos(th), 1e-9))

def compute(event=None):
    out = document.getElementById("out")
    try:
        F   = _val("F",   "Actuator force (lbf)")
        s   = _val("s",   "Actuator stroke (in)")
        L0  = _val("L0",  "Body length retracted (in)")
        rL  = _val("rL",  "Rocker radius rL (in)")
        th0 = _val("th0", "Start angle θ₀ (deg)")
        th1 = 90.0

        b, ra = solve_geom(L0, L0 + s, th0, th1)
        t0, t1 = math.radians(th0), math.radians(th1)
        h  = rL * (math.sin(t1) - math.sin(t0))
        W0 = w_max_start(F, rL, b, ra, t0)

        out.textContent = (
            "Inputs\n"
            f"  Actuator force: {F:.0f} lbf\n"
            f"  Stroke: {s:.2f} in\n"
            f"  Body length (retracted): {L0:.2f} in\n"
            f"  Rocker radius rL: {rL:.2f} in\n"
            f"  Start angle θ₀: {th0:.1f}°\n"
            f"  End angle θ₁: {th1:.1f}°\n\n"
            "Geometry\n"
            f"  Ground spacing b: {b:.2f} in   (pivot → actuator base)\n"
            f"  Actuator pin radius rₐ: {ra:.2f} in   (pivot → actuator pin)\n"
            f"  Lift h: {h:.2f} in   ({h*2.54:.1f} cm)\n\n"
            "Capacity\n"
            f"  Wₘₐₓ at θ₀={th0:.1f}°: {W0:,.0f} lbf\n"
        )
    except Exception as e:
        out.textContent = f"Error: {e}"
</py-script>
{% endraw %}

---
### Actuator Sketch
A sketch for dimension reference of the actuator in extended position: 
<p align="center">
  <img src="{{ '/assets/images/Actuator-Sketch.jpeg' | relative_url }}" 
       alt="Rocker–actuator analysis" 
       style="max-width:600px; height:auto;">
</p>

### Code Download
In case you are interested, here is the raw Python file for download:  
[Download actuator-analysis.py]({{ "/assets/code/Actuator-Analysis.py" | relative_url }})