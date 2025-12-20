---
layout: project
title: Heat Exchanger Flow Configuration Study – Parallel vs Counter Flow
description: Experimental comparison of flow arrangement and temperature gradient on heat transfer effectiveness
image: assets/images/Heat Exchanger Cross-Section.jpg
technologies: [Thermodynamics, Heat Exchangers, Energy Balance, Entropy Generation, Experimental Methods]
---

<style>
  /* Widen content for this page */
  .page-content .wrapper { max-width: 1250px; }

  .hx-card{
    max-width: 1220px;
    margin: 1rem 0;
    padding: 1.1rem 1.25rem;
    border: 1px solid #ddd;
    border-radius: 14px;
    background: #fff;
  }

  .hx-note{
    background:#fafafa;
    border:1px solid #eee;
    border-radius:12px;
    padding:1rem 1.1rem;
  }

  .hx-figure{
    margin: 1rem 0 1.1rem;
    border: 1px solid #eee;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
  }
  .hx-figure img{
    width: 100%;
    height: auto;
    display: block;
  }
  .hx-figcap{
    padding: .7rem .9rem;
    font-size: .95rem;
    color: #333;
    background: #fcfcfc;
    border-top: 1px solid #eee;
  }

  .hx-table-wrap{
    width: 100%;
    overflow-x: auto;
    border: 1px solid #eee;
    border-radius: 12px;
    background: #fff;
  }
  .hx-table{
    width: 100%;
    min-width: 1020px;
    border-collapse: collapse;
    font-size: 1rem;
  }
  .hx-table th, .hx-table td{
    border-bottom: 1px solid #eee;
    padding: .7rem .6rem;
    text-align: left;
    vertical-align: top;
  }
  .hx-table th{
    background:#fcfcfc;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .mono{
    font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
  }
  .small{ font-size: .95rem; color:#444; }

  .callout{
    border-left: 5px solid #0d6efd;
    padding: .25rem 0 .25rem .9rem;
    margin: 1rem 0;
  }

  /* 2x2 graph grid */
  .hx-grid-2x2{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: start;
  }
  @media (max-width: 900px){
    .hx-grid-2x2{ grid-template-columns: 1fr; }
  }

  .hx-mini{
    border: 1px solid #eee;
    border-radius: 12px;
    padding: .7rem .7rem .6rem;
    background: #fff;
  }
  .hx-mini-title{
    font-size: 1.02rem;
    margin: .1rem 0 .5rem;
    font-weight: 650;
  }

  .legend{
    display:flex;
    flex-wrap: wrap;
    gap: 1.1rem;
    align-items:center;
    font-size: .95rem;
    color:#333;
    margin-top: .9rem;
  }
  .swatch{
    width: 16px;
    height: 11px;
    border: 1px solid #333;
    display: inline-block;
    vertical-align: middle;
    margin-right: .35rem;
  }

  svg { display:block; width:100%; height:auto; }

  /* Keep lists text-only (no math in bullets to avoid your renderer issues) */
  li { line-height: 1.45; }
</style>

## Overview

Heat exchangers show up everywhere in engineering: car radiators, HVAC coils, industrial heat recovery systems, and computer cooling loops. The core idea is always the same: two fluid streams exchange thermal energy across a wall, ideally with no mixing. But one design decision changes performance a lot:

**Do the fluids run in the same direction (parallel flow) or in opposite directions (counterflow)?**

In this experiment I used a compact benchtop liquid–liquid heat exchanger and compared performance across four trials: two “high-flow / large temperature gradient” trials and two “low-flow / smaller-gradient” trials.

The pumps pull from heated / cooled source buckets, send fluid through the exchanger, and dump the outlet into a different bucket where the ultimate stream temperature is measured. Though it seemed simple at first, this experiment lead me to unexpected results, forcing me to think hard about the concepts of thermodynamics.

---

## How a heat exchanger works

At the conceptual level, the hot and cold streams exchange heat according to:

$$
\dot Q = U A \Delta T_{\mathrm{lm}}
$$

This expression can be read almost directly as a physical statement. The heat transfer rate increases if the exchanger material conducts heat well and convects efficiently (captured by the overall heat-transfer coefficient \(U\)), if there is more surface area available for heat to cross, or if the two streams are, on average, very different in temperature. The log-mean temperature difference represents that *average thermal driving force* along the length of the exchanger, accounting for the fact that the temperature difference changes from inlet to outlet.

<div class="hx-figure">
  <p align="center">
  <img
    src="{{ '/assets/images/Heat Exchanger Diagrams.jpg' | relative_url }}"
    alt="Heat Exchanger Diagrams"
    style="max-width:800px; height:auto;">
  </p>
  <div class="hx-figcap">
    <b>Heat Exchanger Diagrams.</b> Control-volume diagram of the heat exchanger operating in parallel flow (left) and counterflow (right). Mass enters and exits each side of the exchanger at fixed inlet and outlet temperatures, while heat is transferred continuously along the exchanger length. In the parallel-flow configuration, the temperature difference between streams is largest near the inlet and decays rapidly downstream, leading to a strongly non-uniform heat-transfer distribution. In contrast, the counterflow configuration maintains a more uniform temperature difference along the exchanger, producing a nearly constant local heat-transfer rate and a larger effective driving force overall.
  </div>
</div>

In this experiment, the exchanger hardware is fixed, so \(U\) and \(A\) are effectively constant. As a result, changes in performance primarily reflect how the flow arrangement (parallel versus counterflow) shapes the temperature difference profile along the exchanger, along with real-world nonidealities such as flow restriction, inlet temperature drift, and heat loss to the surroundings.

---

## Experimental setup

<div class="hx-figure">
  <p align="center">
  <img
    src="{{ '/assets/images/Heat Exchanger Setup.jpg' | relative_url }}"
    alt="Heat Exchanger Setup"
    style="max-width:800px; height:auto;">
  </p>
  <div class="hx-figcap">
    <b>Full setup.</b> Our complete experiment setup consisted of two pumps, tubing, the heat exchanger, the source buckets, and the receiving buckets. Depending on the trial, we would re-plumb the exchanger as parallel or counter-flow, and adjust pump speed.
    Outlet temperatures were measured in the receiving buckets immediatly after flow through the exchanger.
  </div>
</div>

### Procedure summary

- Set hot source bucket temperature and cold source bucket temperature.
- Configure the exchanger plumbing as either parallel flow or counterflow.
- Pump each stream through the exchanger.
- Collect each outlet stream into its own receiving bucket.
- Measure inlet temperatures at the source buckets and outlet temperatures at the receiving buckets.

One thing to note that certainly affected results more than expected was the tendency of the tubing to kink, especially when hot. Throughout the trials, we did out best to prevent the tubing from kinking, but getting ideal results is near impossible without better equiptment. This tendency certainly played into our results, which will become apparent later.

---

## Data

Below is a clean transcription of my recorded values.

<style>
  .hx-table-wrap{
    display: flex;
    justify-content: center;
    margin: 1rem 0;
    overflow-x: visible;
  }

  .hx-table{
    width: min(1200px, 100%);
    border-collapse: collapse;
    table-layout: fixed;
    background: #fff;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    overflow: hidden;
  }

  .hx-table th,
  .hx-table td{
    padding: .65rem .75rem;
    border-bottom: 1px solid #eee;
    vertical-align: top;
    font-size: 0.95rem;
    line-height: 1.25rem;
    overflow-wrap: anywhere;
  }

  .hx-table thead th{
    background: #f7f8fa;
    font-weight: 600;
  }

  .hx-table tbody tr:last-child td{ border-bottom: 0; }

  .hx-table .mono{
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    white-space: nowrap;
  }

  /* column widths */
  .hx-table th:nth-child(1), .hx-table td:nth-child(1){ width: 6%;  }
  .hx-table th:nth-child(2), .hx-table td:nth-child(2){ width: 12%; }
  .hx-table th:nth-child(3), .hx-table td:nth-child(3){ width: 12%; }
  .hx-table th:nth-child(4), .hx-table td:nth-child(4){ width: 10%; }
  .hx-table th:nth-child(5), .hx-table td:nth-child(5){ width: 10%; }
  .hx-table th:nth-child(6), .hx-table td:nth-child(6){ width: 10%; }
  .hx-table th:nth-child(7), .hx-table td:nth-child(7){ width: 10%; }
  .hx-table th:nth-child(8), .hx-table td:nth-child(8){ width: 30%; }

  @media (max-width: 700px){
    .hx-table .mono{ white-space: normal; }
  }
</style>

<div class="hx-table-wrap">
  <table class="hx-table">
    <thead>
      <tr>
        <th>Trial</th>
        <th>Configuration</th>
        <th>Flow</th>
        <th>Hot Inlet (°C)</th>
        <th>Cold Inlet (°C)</th>
        <th>Hot Outlet (°C)</th>
        <th>Cold Outlet (°C)</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mono">1</td>
        <td>Counter</td>
        <td>Normal</td>
        <td class="mono">40.0</td>
        <td class="mono">4.6</td>
        <td class="mono">19.4</td>
        <td class="mono">21.1</td>
        <td>Exchanger body measured ~34.9°C</td>
      </tr>
      <tr>
        <td class="mono">2</td>
        <td>Parallel</td>
        <td>Normal</td>
        <td class="mono">40.0</td>
        <td class="mono">5.9</td>
        <td class="mono">23.5</td>
        <td class="mono">20.0</td>
        <td>Exchanger body noted ~33°C</td>
      </tr>
      <tr>
        <td class="mono">3</td>
        <td>Parallel</td>
        <td>Low-flow</td>
        <td class="mono">31.5</td>
        <td class="mono">10.0</td>
        <td class="mono">21.3</td>
        <td class="mono">19.3</td>
        <td>Low-flow: more sensitive to ambient loss + timing</td>
      </tr>
      <tr>
        <td class="mono">4</td>
        <td>Counter</td>
        <td>Low-flow</td>
        <td class="mono">30.0</td>
        <td class="mono">13.2</td>
        <td class="mono">17.9</td>
        <td class="mono">20.1</td>
        <td>Outlet “swap” observed (cold outlet slightly above hot outlet)</td>
      </tr>
    </tbody>
  </table>
</div>

---

## Outlet temperature trends

The figure below shows the results of the trials across four inlet-to-outlet line plots, each showing:

- hot stream inlet to hot stream outlet
- cold stream inlet to cold stream outlet

All plots share the same axis from 0 to 45°C for direct comparison.

<div class="hx-card">
  <div class="hx-grid-2x2">

    <!-- Mapping for all mini-plots:
      y = 160 - (T/45)*140
      Frame: x from 38 to 258, y from 20 to 160
      Points: Inlet at x=72, Outlet at x=214
    -->

    <!-- Trial 1 -->
    <div class="hx-mini">
      <div class="hx-mini-title">Trial 1 — Counter, large gradient</div>
      <svg viewBox="0 0 280 200" role="img" aria-label="Trial 1 inlet to outlet">
        <rect x="38" y="20" width="220" height="140" fill="white" stroke="#ddd"/>
        <g stroke="#eee">
          <line x1="38" x2="258" y1="160" y2="160"/>
          <line x1="38" x2="258" y1="113.3" y2="113.3"/>
          <line x1="38" x2="258" y1="66.7" y2="66.7"/>
          <line x1="38" x2="258" y1="20" y2="20"/>
        </g>
        <g class="mono" font-size="11" fill="#333">
          <text x="12" y="164">0</text>
          <text x="6"  y="117">15</text>
          <text x="6"  y="71">30</text>
          <text x="6"  y="24">45</text>
          <text x="64" y="192">Inlet</text>
          <text x="206" y="192">Outlet</text>
        </g>
        <polyline points="72,35.6 214,99.6" fill="none" stroke="#333" stroke-width="2.5"/>
        <circle cx="72" cy="35.6" r="3.4" fill="#333"/>
        <circle cx="214" cy="99.6" r="3.4" fill="#333"/>
        <polyline points="72,145.7 214,94.3" fill="none" stroke="#777" stroke-width="2.5"/>
        <circle cx="72" cy="145.7" r="3.4" fill="#777"/>
        <circle cx="214" cy="94.3" r="3.4" fill="#777"/>
        <g class="mono" font-size="10.5" fill="#333">
          <text x="46" y="32">40.0</text>
          <text x="220" y="104">19.4</text>
          <text x="50" y="157">4.6</text>
          <text x="220" y="92">21.1</text>
        </g>
      </svg>
    </div>

    <!-- Trial 2 -->
    <div class="hx-mini">
      <div class="hx-mini-title">Trial 2 — Parallel, large gradient</div>
      <svg viewBox="0 0 280 200" role="img" aria-label="Trial 2 inlet to outlet">
        <rect x="38" y="20" width="220" height="140" fill="white" stroke="#ddd"/>
        <g stroke="#eee">
          <line x1="38" x2="258" y1="160" y2="160"/>
          <line x1="38" x2="258" y1="113.3" y2="113.3"/>
          <line x1="38" x2="258" y1="66.7" y2="66.7"/>
          <line x1="38" x2="258" y1="20" y2="20"/>
        </g>
        <g class="mono" font-size="11" fill="#333">
          <text x="12" y="164">0</text>
          <text x="6"  y="117">15</text>
          <text x="6"  y="71">30</text>
          <text x="6"  y="24">45</text>
          <text x="64" y="192">Inlet</text>
          <text x="206" y="192">Outlet</text>
        </g>
        <polyline points="72,35.6 214,86.9" fill="none" stroke="#333" stroke-width="2.5"/>
        <circle cx="72" cy="35.6" r="3.4" fill="#333"/>
        <circle cx="214" cy="86.9" r="3.4" fill="#333"/>
        <polyline points="72,141.6 214,97.8" fill="none" stroke="#777" stroke-width="2.5"/>
        <circle cx="72" cy="141.6" r="3.4" fill="#777"/>
        <circle cx="214" cy="97.8" r="3.4" fill="#777"/>
        <g class="mono" font-size="10.5" fill="#333">
          <text x="46" y="32">40.0</text>
          <text x="220" y="92">23.5</text>
          <text x="50" y="154">5.9</text>
          <text x="220" y="103">20.0</text>
        </g>
      </svg>
    </div>

    <!-- Trial 3 -->
    <div class="hx-mini">
      <div class="hx-mini-title">Trial 3 — Parallel, low flow</div>
      <svg viewBox="0 0 280 200" role="img" aria-label="Trial 3 inlet to outlet">
        <rect x="38" y="20" width="220" height="140" fill="white" stroke="#ddd"/>
        <g stroke="#eee">
          <line x1="38" x2="258" y1="160" y2="160"/>
          <line x1="38" x2="258" y1="113.3" y2="113.3"/>
          <line x1="38" x2="258" y1="66.7" y2="66.7"/>
          <line x1="38" x2="258" y1="20" y2="20"/>
        </g>
        <g class="mono" font-size="11" fill="#333">
          <text x="12" y="164">0</text>
          <text x="6"  y="117">15</text>
          <text x="6"  y="71">30</text>
          <text x="6"  y="24">45</text>
          <text x="64" y="192">Inlet</text>
          <text x="206" y="192">Outlet</text>
        </g>
        <polyline points="72,62.0 214,93.7" fill="none" stroke="#333" stroke-width="2.5"/>
        <circle cx="72" cy="62.0" r="3.4" fill="#333"/>
        <circle cx="214" cy="93.7" r="3.4" fill="#333"/>
        <polyline points="72,128.9 214,100.0" fill="none" stroke="#777" stroke-width="2.5"/>
        <circle cx="72" cy="128.9" r="3.4" fill="#777"/>
        <circle cx="214" cy="100.0" r="3.4" fill="#777"/>
        <g class="mono" font-size="10.5" fill="#333">
          <text x="44" y="58">31.5</text>
          <text x="220" y="99">21.3</text>
          <text x="48" y="141">10.0</text>
          <text x="220" y="105">19.3</text>
        </g>
      </svg>
    </div>

    <!-- Trial 4 -->
    <div class="hx-mini">
      <div class="hx-mini-title">Trial 4 — Counter, low flow</div>
      <svg viewBox="0 0 280 200" role="img" aria-label="Trial 4 inlet to outlet">
        <rect x="38" y="20" width="220" height="140" fill="white" stroke="#ddd"/>
        <g stroke="#eee">
          <line x1="38" x2="258" y1="160" y2="160"/>
          <line x1="38" x2="258" y1="113.3" y2="113.3"/>
          <line x1="38" x2="258" y1="66.7" y2="66.7"/>
          <line x1="38" x2="258" y1="20" y2="20"/>
        </g>
        <g class="mono" font-size="11" fill="#333">
          <text x="12" y="164">0</text>
          <text x="6"  y="117">15</text>
          <text x="6"  y="71">30</text>
          <text x="6"  y="24">45</text>
          <text x="64" y="192">Inlet</text>
          <text x="206" y="192">Outlet</text>
        </g>
        <polyline points="72,66.7 214,104.4" fill="none" stroke="#333" stroke-width="2.5"/>
        <circle cx="72" cy="66.7" r="3.4" fill="#333"/>
        <circle cx="214" cy="104.4" r="3.4" fill="#333"/>
        <polyline points="72,118.9 214,97.5" fill="none" stroke="#777" stroke-width="2.5"/>
        <circle cx="72" cy="118.9" r="3.4" fill="#777"/>
        <circle cx="214" cy="97.5" r="3.4" fill="#777"/>
        <g class="mono" font-size="10.5" fill="#333">
          <text x="48" y="63">30.0</text>
          <text x="220" y="110">17.9</text>
          <text x="48" y="114">13.2</text>
          <text x="220" y="103">20.1</text>
        </g>
      </svg>
    </div>

  </div>

  <div class="legend">
    <span><span class="swatch" style="background:#333"></span> Hot stream</span>
    <span><span class="swatch" style="background:#777"></span> Cold stream</span>
    <span class="small">All plots share the same 0–45°C axis for comparison.</span>
  </div>
</div>

---

## What I expected before seeing the data

Before taking data, my mental model was the textbook one:

- Counterflow generally gives higher effectiveness than parallel flow.
- Hot outlet temperature should still be above cold outlet temperature.

The first expectation held up. The second one was what caused confusion.

---

## The temperature swap and why it confused me

In Trial 1 and Trial 4, the measured cold outlet temperature ended up slightly above the measured hot outlet temperature. The first time I saw that, it felt like a contradiction. I assumed either:

- I mixed up which bucket was which, or
- I wrote down a number wrong, or
- a thermometer was drifting or miscalibrated.

So we did the fastest “engineering sanity check” we could:

<div class="hx-figure">
  <p align="center">
  <img
    src="{{ '/assets/images/Thermometer Testing.jpg' | relative_url }}"
    alt="Thermometer Testing"
    style="max-width:800px; height:auto;">
  </p>
  <div class="hx-figcap">
    <b>Thermometer cross-check.</b> Two thermometers reading the same fluid to verify consistency.
  </div>
</div>

When the thermometers agreed reasonably well, the conclusion was that the swap probably reflected the system rather than a single bad sensor.

---

## Why a swap is not impossible

The correct physical requirement is not “hot outlet must be hotter than cold outlet.” The correct requirement is:

- Heat must flow from the hot stream to the cold stream *locally* through the exchanger wall (so the rate of heat transfer is positive from hot to cold everywhere along the exchanger).
- The outlet temperatures are set by how much energy is transferred and by the relative ability of each stream to absorb/reject energy, which is captured by the heat-capacity rates.

The heat-capacity rate is:

$$
C = \dot m c_p
$$

and, for each stream, the energy balance across the exchanger (ideal single-phase, negligible shaft work) is:

$$
\dot Q = \dot m_h c_p (T_{h,in}-T_{h,out})
= \dot m_c c_p (T_{c,out}-T_{c,in})
$$

Rearranging gives a very useful “sensitivity” view:

$$
T_{h,out} = T_{h,in} - \frac{\dot Q}{C_h},
\qquad
T_{c,out} = T_{c,in} + \frac{\dot Q}{C_c}
$$

So the temperature changes scale like:

$$
\Delta T_h = T_{h,in}-T_{h,out} = \frac{\dot Q}{C_h},
\qquad
\Delta T_c = T_{c,out}-T_{c,in} = \frac{\dot Q}{C_c}
$$

This is why a swap can happen: if one side has a *much smaller* heat-capacity rate, its temperature change becomes large.

A clean way to see the condition for the “swap” (cold outlet above hot outlet) is to compare the two outlet temperatures:

$$
T_{c,out} > T_{h,out}
$$

Substitute the expressions above:

$$
T_{c,in} + \frac{\dot Q}{C_c} \;>\; T_{h,in} - \frac{\dot Q}{C_h}
$$

Bring terms together:

$$
\dot Q\left(\frac{1}{C_c} + \frac{1}{C_h}\right) \;>\; T_{h,in} - T_{c,in}
$$

This inequality shows two important things:

1. A swap does **not** violate thermodynamics; it only requires enough heat transfer relative to the inlet temperature difference.
2. Decreasing the heat-capacity rate of either stream increases the relative impact of the transferred heat compared to the inlet temperature difference, which makes a temperature swap **more likely**.

This is exactly where the kink-prone tubing matters. A kink reduces the effective flow area and increases pressure drop, which reduces mass flow rate and therefore reduces \(C\). Once \(C\) drops, that side becomes “thermally easier to move,” meaning its outlet temperature shifts more for the same rate of heat transfer.

In particular, if the **hot-side tubing softened and partially kinked** (which we were actively seeing during the trial), then the hot-side heat-capacity decreases. Since:

$$
\Delta T_h = \frac{\dot Q}{C_h},
$$

a smaller hot-side heat-capacity rate forces a larger temperature drop in the hot stream, driving the hot outlet temperature downward. Meanwhile, if the cold side maintains a higher flow rate, its heat-capacity rate remains larger and the cold outlet temperature rises more moderately. The combined effect can produce:

$$
T_{c,out} \gtrsim T_{h,out}
$$

even though heat still flowed in the correct direction through the exchanger wall the entire time.

---

## Connecting the theory to the configuration result

The temperature swap analysis explains *how* the outlet temperatures could cross without violating thermodynamics. What remains is *why this behavior appeared most clearly in the counterflow configuration*.

A compact expression for exchanger heat transfer is:

$$
\dot Q = U A \Delta T_{\mathrm{lm}}
$$

For a given exchanger, the geometry and materials are fixed, so \(U\) and \(A\) are effectively constant. This means the rate of heat transfer is controlled almost entirely by the temperature driving force. Counterflow configurations sustain a more uniform temperature difference along the exchanger length, which increases the log-mean temperature difference compared to parallel flow.

From a second-law perspective, this also means counterflow exchangers operate with higher entropic efficiency. Counterflow minimizes entropy generation by transferring heat across smaller local temperature differences, making it closer to the ideal (reversible) limit than parallel flow. In that sense, counterflow has a higher “isentropic” or second-law efficiency than parallel flow.

This higher effectiveness does not by itself force a temperature inversion, but it *amplifies the consequences of any flow imbalance*. When the hot-side flow is reduced (for example, by partial kinking of softened tubing), the exchanger is already operating near its maximum thermal and second-law efficiency. As a result, even a modest reduction in hot-side heat-capacity rate can produce a disproportionately large drop in the hot outlet temperature.

In contrast, parallel flow loses temperature driving force rapidly near the inlet and operates further from the reversible limit, with greater entropy generation overall. This limits how far the hot stream can cool regardless of flow imbalance, making parallel flow less sensitive to the same nonidealities. This explains why the temperature swap appeared in the counterflow trials but not in the parallel-flow trials.

---

## Quantitative interpretation with one more measurement

With flow rates, the cleanest analysis would be:

$$
\dot Q_h = \dot m_h c_p (T_{h,in}-T_{h,out})
$$

$$
\dot Q_c = \dot m_c c_p (T_{c,out}-T_{c,in})
$$

In an ideal, well-insulated exchanger, these would match closely. In this experiment, mismatch is expected because of ambient losses, inlet drift, and possible flow imbalance from kinking.

If I repeated this, I would measure flow rates by collecting volume over time for each stream. That would let me quantify whether a kink changed one side’s mass flow rate and explain the outlet swap with numbers.

---

## Analysis

#### Is the heat exchanger operating adiabatically?

In most textbook heat-exchanger problems, we assume the exchanger is adiabatic to the surroundings, meaning any heat lost by the hot stream is gained by the cold stream. In this benchtop setup, that assumption is only approximately true.

There are several pathways for heat to leak to or from the room:

- the metal exchanger body is exposed to air and can convect heat to the surroundings,
- the tubing has significant surface area and can gain or lose heat,
- the receiving buckets are open to the room and can exchange heat with air during the run,
- the pumps add a small amount of heat through electrical work and friction.

This matters for interpretation: if the hot stream loses some heat to the room, the cold stream will not gain the full amount, so an energy balance based only on stream temperatures will not close perfectly.

It also matters for real-world design. In applications like radiators and HVAC coils, exchanging heat with the environment is the entire point. But in liquid-to-liquid applications where you want to transfer heat between two loops without wasting it to the room, insulation and packaging matter. In a practical system, a designer would:

- insulate the exchanger and lines if the goal is transferring energy between loops efficiently,
- deliberately expose the exchanger if the goal is dumping heat to ambient,
- place sensors close to the exchanger to reduce the influence of ambient drift.

#### Are we achieving steady state operation?

A steady state heat exchanger typically means inlet temperatures, flow rates, and outlet temperatures are roughly constant with time. In this experiment, steady state is difficult to achieve because:

- the source buckets are finite reservoirs whose temperatures drift during the run,
- ice melting changes the cold inlet temperature over time,
- the hot reservoir cools as it feeds the exchanger,
- kinks can change flow rate during the trial as tubing warms and softens.

Even if the exchanger itself reaches a quasi-steady internal temperature, the boundary conditions are still evolving. This is why low-flow trials are especially sensitive: when flow is low, it takes longer to exchange a given amount of energy, so inlet drift and ambient losses have more time to act.

To move closer to steady state in a repeat experiment, I would:
- recirculate each loop back into its own source bucket so inlet temperatures stay more uniform over time,
- stir or mix source buckets to prevent stratification,
- run longer and only record data after temperatures change slowly over a fixed time window,
- clamp tubing to prevent kinks so the mass flow rate stays constant.

#### Are kinetic energy changes important from inlet to outlet?

In the steady-flow energy equation, kinetic energy terms appear as a change in velocity head between inlet and outlet. In many heat exchanger analyses, these terms are neglected because temperature and enthalpy changes dominate.

In this setup, the kinetic energy change is likely small relative to thermal energy transfer, but it is still worth checking the logic:

- The flow is driven by pumps and through relatively small tubing.
- If the tubing kinks or the cross-sectional area changes, local velocity can change.
- However, the thermal energy associated with even a few degrees Celsius temperature change in water is large compared to the kinetic energy associated with typical tubing velocities.

A quick order-of-magnitude comparison: the specific kinetic energy is approximately one-half times velocity squared, while the specific thermal energy change is on the order of the specific heat times the temperature change. For water, a temperature change of even 10°C corresponds to tens of thousands of joules per kilogram, while typical tubing velocities correspond to kinetic energies many orders of magnitude smaller.

Kinetic energy changes are not a dominant term in the energy balance for this experiment. The key nonidealities are instead ambient heat loss, drifting inlet temperatures, and mass flow imbalance caused by tubing restrictions.

---

## Conclusions

The experiment supported the main theoretical point: counterflow generally gives higher effectiveness than parallel flow for the same exchanger. The “swap” outcome turned out to be the most educational part because it forced me to think like an engineer rather than assume an idealized picture:

- Outlet temperatures can cross without violating thermodynamics.
- The system is sensitive to flow imbalance, and kinked tubing is a plausible cause.
- Instrument cross-checks are critical before blaming physics.

---

## Improvements for next time

To strengthen the conclusion quantitatively:

- Measure flow rate for each stream by collecting a known volume and timing it.
- Route and clamp tubing to prevent kinks, especially when warm.
- Measure inlet and outlet temperatures closer to the exchanger ports in addition to the buckets.
- Record data after a consistent run time and with consistent mixing in receiving buckets.

---
