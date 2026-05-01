---
layout: project
title: Rover-Compatible End Effector for Autonomous Lanternfly Removal
description: Three linked MAE 2250 milestones documenting the client pitch, functional prototype, and final client report for The Bug Busting Crew.
image: /assets/images/MAE2250 Client Report/Cover Photo.jpg
imagealt: Close-up of the BBC robotic gripper contacting a test surface
technologies: [Agricultural Robotics, Mechanical Design, Mechatronics, Controls, Prototyping, Client Reporting]
---

<div class="mae2250-callout">
  <p class="mae2250-kicker">MAE 2250 Project Series</p>
  <h2 style="margin-top:0.1rem;">The Bug Busting Crew project arc</h2>
  <p>
    This project developed a rover-compatible robotic end effector for physically removing spotted lanternflies from grapevines.
    The three milestones below trace the work from early client framing, through mechanism validation, to the final prototype
    and client-facing recommendation.
  </p>
</div>

<h2 id="milestones">Milestone Map</h2>

<div class="mae2250-milestones">
  <a class="mae2250-milestone-link" href="{{ '/projects/2026-Client%20Outline/' | relative_url }}">
    <div class="mae2250-card">
      <span class="mae2250-step">01</span>
      <h3>Client Outline</h3>
      <p>
        Defined the vineyard pest-removal problem, clarified the value of integration with existing robotic systems,
        and proposed a modular removal arm.
      </p>
      <p class="mae2250-link-line">Open Milestone 1</p>
    </div>
  </a>
  <a class="mae2250-milestone-link" href="{{ '/projects/2026-Functional%20Prototype/' | relative_url }}">
    <div class="mae2250-card">
      <span class="mae2250-step">02</span>
      <h3>Functional Prototype</h3>
      <p>
        Built and tested the first working mechanism to validate telescoping travel, paddle behavior, friction,
        and assembly decisions before the final exhibit build.
      </p>
      <p class="mae2250-link-line">Open Milestone 2</p>
    </div>
  </a>
  <a class="mae2250-milestone-link" href="{{ '/projects/2026-Client%20Report/' | relative_url }}">
    <div class="mae2250-card">
      <span class="mae2250-step">03</span>
      <h3>Client Report</h3>
      <p>
        Summarizes the final open-loop prototype, testing outcomes, bill of materials, and recommendation to pursue
        future closed-loop control through AI vision integration.
      </p>
      <p class="mae2250-link-line">Open Milestone 3</p>
    </div>
  </a>
</div>

<div class="mae2250-stats" style="margin-top:1.2rem;">
  <div class="mae2250-stat">
    <span class="mae2250-stat-value">50 g</span>
    <span class="mae2250-stat-label">Lifted during strength and compliance testing against a 5 g design goal.</span>
  </div>
  <div class="mae2250-stat">
    <span class="mae2250-stat-value">30 mm</span>
    <span class="mae2250-stat-label">Measured telescoping travel, exceeding the 25 mm reach target.</span>
  </div>
  <div class="mae2250-stat">
    <span class="mae2250-stat-value">&lt; 1 s</span>
    <span class="mae2250-stat-label">Average actuation time for paddle closure, telescoping, and wrist bending.</span>
  </div>
</div>

<div class="mae2250-grid-2">
  <div class="mae2250-card">
    <p class="mae2250-kicker">Final Recommendation</p>
    <h3>Promising platform, not yet field-ready</h3>
    <p>
      The final prototype met its core benchtop success criteria and demonstrated that a compliant, lightweight gripper can
      integrate with a larger robotic system. The next step is not a full redesign. It is system integration:
      vision, targeting, and rover mounting.
    </p>
  </div>
  <div class="mae2250-card">
    <p class="mae2250-kicker">Control Direction</p>
    <h3>Open-loop today, closed-loop next</h3>
    <p>
      During the exhibit phase, the end effector was driven as an open-loop system from a Python GUI over serial to an ESP32-S3.
      Future work should pair that mechanism with AI vision so object pose, paddle gap, and approach angle can adapt in real time.
    </p>
  </div>
</div>

<div class="mae2250-figure">
  <img
    src="{{ '/assets/images/MAE2250 Client Report/BBC Poster.png' | relative_url }}"
    alt="Poster summarizing the final BBC robotic gripper project"
  >
  <div class="mae2250-figcap">
    <b>Final exhibit poster.</b> The poster became the basis for the client report and captures the final prototype,
    testing results, and recommended next steps.
  </div>
</div>
