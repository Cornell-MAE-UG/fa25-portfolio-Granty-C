---
layout: project
title: Functional Prototype - ODP 5
description: First functional prototype for The Bug Busting Crew's lanternfly removal end effector
image: /assets/images/Prototype_1.jpg
technologies: [Mechanical Design, CAD, 3D Printing, Servo Mechanisms, Prototyping, Design Testing]
hide_from_projects: true
---

<div class="mae2250-series-bar">
  <span class="mae2250-series-label">MAE 2250 Project Series</span>
  <a href="{{ '/projects/2026-Rover-Compatible%20End%20Effector/' | relative_url }}">Overview</a>
  <a href="{{ '/projects/2026-Client%20Outline/' | relative_url }}">Client Outline</a>
  <a href="{{ '/projects/2026-Functional%20Prototype/' | relative_url }}">Functional Prototype</a>
  <a href="{{ '/projects/2026-Client%20Report/' | relative_url }}">Client Report</a>
</div>

<style>
  .fp-hero,
  .fp-card,
  .fp-test,
  .fp-figure,
  .fp-table-wrap {
    border: 1px solid #e7e7e2;
    border-radius: 16px;
    background: #fff;
  }

  .fp-hero,
  .fp-card,
  .fp-test {
    padding: 1.2rem 1.3rem;
    margin: 1rem 0;
  }

  .fp-hero {
    background: linear-gradient(135deg, #f7f8f2 0%, #ffffff 55%, #f3f7f5 100%);
  }

  .fp-kicker {
    font-size: 0.92rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #4d6b5d;
    font-weight: 700;
    margin-bottom: 0.35rem;
  }

  .fp-lead {
    font-size: 1.05rem;
    color: #2f2f2f;
    margin: 0.4rem 0 0.9rem;
  }

  .fp-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
    margin-top: 1rem;
  }

  .fp-nav a,
  .fp-mini-nav a {
    text-decoration: none;
  }

  .fp-nav-item {
    display: block;
    padding: 1rem 1.05rem;
    border-radius: 14px;
    border: 1px solid #d7ddd8;
    background: rgba(255, 255, 255, 0.82);
    color: #1f1f1f;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .fp-nav-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(31, 31, 31, 0.08);
  }

  .fp-nav-title {
    display: block;
    font-weight: 700;
    margin-bottom: 0.2rem;
    color: #204b3a;
  }

  .fp-nav-text {
    display: block;
    font-size: 0.95rem;
    color: #4b4b4b;
  }

  .fp-mini-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-top: 0.9rem;
  }

  .fp-pill {
    display: inline-block;
    padding: 0.45rem 0.75rem;
    border-radius: 999px;
    border: 1px solid #d9e2dc;
    background: #fbfcfb;
    color: #315846;
    font-size: 0.92rem;
  }

  .fp-grid-2,
  .fp-grid-3,
  .fp-gallery {
    display: grid;
    gap: 1rem;
    align-items: start;
  }

  .fp-grid-2 {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .fp-grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .fp-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fp-test-stack {
    display: grid;
    gap: 1rem;
  }

  .fp-card h3,
  .fp-test h3 {
    margin-top: 0;
  }

  .fp-note {
    border-left: 5px solid #799d4b;
    background: #f8fbf3;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    margin: 1rem 0;
  }

  .fp-figure {
    overflow: hidden;
    margin: 1rem 0;
  }

  .fp-figure img {
    width: 100%;
    height: auto;
    display: block;
  }

  .fp-figcap {
    padding: 0.8rem 0.95rem;
    font-size: 0.95rem;
    color: #3d3d3d;
    background: #fcfcfb;
    border-top: 1px solid #ededea;
  }

  .fp-table-wrap {
    overflow-x: auto;
    margin: 1rem 0;
  }

  .fp-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .fp-table th,
  .fp-table td {
    padding: 0.75rem 0.8rem;
    border-bottom: 1px solid #ededea;
    text-align: left;
    vertical-align: top;
    overflow-wrap: anywhere;
  }

  .fp-table th {
    background: #f7f8f5;
    font-weight: 700;
  }

  .fp-table tr:last-child td {
    border-bottom: 0;
  }

  .fp-steps {
    margin: 0.6rem 0 0;
  }

  .fp-steps li + li {
    margin-top: 0.4rem;
  }

  .fp-status {
    font-weight: 700;
    color: #204b3a;
  }

  .fp-status.warn {
    color: #9a5a0a;
  }

  .fp-status.pending {
    color: #6a4fb3;
  }

  @media (max-width: 900px) {
    .fp-grid-2,
    .fp-grid-3,
    .fp-gallery,
    .fp-nav {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .fp-table {
      min-width: 640px;
      table-layout: auto;
    }
  }
</style>

<div class="fp-hero">
  <div class="fp-kicker">Open Design Project 5</div>
  <h2 id="functional-prototype" style="margin-top:0.1rem;">BBC functional prototype</h2>
  <p class="fp-lead">
    This first prototype aimed to create address the main mechanical challenge behind our lanternfly removal concept:
    can a compact end effector both telescope into tight spaces and close around bug-sized targets using simple servo-driven linkages?
  </p>

  <div class="fp-note">
    The prototype was built to test the fundemental mechanisms of our design. Our immediate goals were to validate
    the 2-DOF geometry, document how the assembly goes together, and quantify what worked well enough to keep for the next iteration.
  </div>

  <div class="fp-nav">
    <a href="{{ '/projects/2026-Client%20Outline/' | relative_url }}">
      <span class="fp-nav-item">
        <span class="fp-nav-title">Milestone 1: Client Pitch</span>
        <span class="fp-nav-text">Project context, stakeholders, and the original problem statement.</span>
      </span>
    </a>
    <a href="#prototype-overview">
      <span class="fp-nav-item">
        <span class="fp-nav-title">Milestone 2: Functional Prototype</span>
        <span class="fp-nav-text">Design intent, assembly, testing, and what we learned.</span>
      </span>
    </a>
  </div>

  <div class="fp-mini-nav">
    <a class="fp-pill" href="#design-intent">Design intent</a>
    <a class="fp-pill" href="#assembly">Assembly</a>
    <a class="fp-pill" href="#testing">Testing</a>
    <a class="fp-pill" href="#criteria">Success criteria</a>
  </div>
</div>

<h2 id="prototype-overview">Prototype Overview</h2>

Our ODP team, The Bug Busting Crew, is developing a robotic attachment intended to physically remove spotted lanternflies from grapevines. This first functional prototype was a focused build of the specialized end effector, rather than a full robot integration. The idea was to validate the mechanism that is the most unique: a lightweight hand that can both open and close around a target and shift its pivot point to telescope without relying on a more complicated leadscrew or linear stage.

**The design uses three servo-driven motions in the full concept:**

- Two upper linkages open and close the paddles while sliders travel along brass rods to avoid binding.
- A lower linkage shifts the main pivot point, producing telescoping motion through the arms.
- A 3D printed chassis keeps the assembly compact and makes the mechanism easy to revise between iterations.

One important note was that our ordered servo motors had not arrived in time for the prototype checkoff. Because of that, we adapted the tests to manual actuation so we could still evaluate the geometry, travel, grip behavior, and smoothness of the mechanism itself.

<h2 id="design-intent">Design Intent</h2>

<div class="fp-figure">
  <img
    src="{{ '/assets/images/Functionality Sketch.png' | relative_url }}"
    alt="Annotated functionality sketch of the BBC prototype"
  >
  <div class="fp-figcap">
    <b>Annotated functionality sketch.</b> The end effector combines two gripper arms, a telescoping pivot arrangement,
    slider collars on brass guide rods, and a 3D printed central chassis sized for micro servos. The upper motion closes
    the paddles around a target, while the lower motion shifts the pivot to extend the hand into narrow spaces.
  </div>
</div>

<div class="fp-grid-3">
  <div class="fp-card">
    <h3>Open / Close Motion</h3>
    <p>
      The top two linkages are intended to pull the paddles inward so the hand can clamp around a bug-sized target.
      The sliders riding on the brass rods help constrain the motion and reduce the tendency of the arms to twist.
    </p>
  </div>
  <div class="fp-card">
    <h3>Telescoping Motion</h3>
    <p>
      Instead of a dedicated linear actuator, the lower linkage shifts the gripper pivot point through a slotted path.
      This gives the hand extra reach without the nead of a heavy (and expensive) ballscrew and keeps the end effector compact.
    </p>
  </div>
  <div class="fp-card">
    <h3>Prototype Focus</h3>
    <p>
      At this stage we prioritized mechanism packaging, and assembly simplicity over cosmetics. The prototype
      was meant to reveal friction, play, and retention issues early, before committing to a final build.
    </p>
  </div>
</div>

### Core components

<div class="fp-table-wrap">
  <table class="fp-table">
    <thead>
      <tr>
        <th>Component</th>
        <th>Purpose</th>
        <th>Source / spec</th>
        <th>Fabrication note</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Brass guide rods</td>
        <td>Guide the slider collars and support the moving arm assembly</td>
        <td>1/8 in ultra-machinable 360 brass rod, McMaster 8953K101</td>
        <td>Cut into two 150 mm rods and one 35 mm axle</td>
      </tr>
      <tr>
        <td>Shaft collars</td>
        <td>Retain the brass axle in the chassis</td>
        <td>Set screw shaft collar, McMaster 9414T3</td>
        <td>Used as off-the-shelf retention hardware</td>
      </tr>
      <tr>
        <td>M3 and M2 fasteners</td>
        <td>Secure servo horns and small linkage connections</td>
        <td>McMaster 91292A109 and 91292A834</td>
        <td>Standard hardware, no modification required</td>
      </tr>
      <tr>
        <td>Micro servos</td>
        <td>Planned actuation for the upper grippers and lower telescoping linkage</td>
        <td>Miuzei MG90S 9 g metal gear servos</td>
        <td>Designed into the chassis, but unavailable during physical testing</td>
      </tr>
      <tr>
        <td>Custom printed parts</td>
        <td>Main chassis, arm links, slider collars, and paddles</td>
        <td>Custom CAD geometry</td>
        <td>Printed to test fit, motion path, and assembly order</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="assembly">Assembly</h2>

<div class="fp-grid-2">
  <div class="fp-figure">
    <img
      src="{{ '/assets/images/Assembly Sketch 1.png' | relative_url }}"
      alt="Assembly sketch showing the first half of the BBC prototype build"
    >
    <div class="fp-figcap">
      <b>Assembly sketch, steps 1-3.</b> The first half of the build inserts the servos into the chassis,
      connects the arm links, and prepares the gripper arms with their sliders.
    </div>
  </div>
  <div class="fp-figure">
    <img
      src="{{ '/assets/images/Assembly Sketch 2.png' | relative_url }}"
      alt="Assembly sketch showing the final steps of the BBC prototype build"
    >
    <div class="fp-figcap">
      <b>Assembly sketch, steps 4-5.</b> The brass axle is slid through the arm set and lower servo connection,
      then the top servo links are attached to the slider collars via M3 bolts to complete the mechanism.
    </div>
  </div>
</div>

The full assembly sequence is:

1. Screw the servos into the chassis, using the self-tapping screws included with the servos.
2. Press the printed arm links to the servos.
3. Build the two gripper arms by pressing on the arm bases, slipping the sliders onto the brass rods, and pressing on the printed paddles.
4. Slide the axle through the lower pivot features and arm bases, and securing with a collar on either side.
5. Connect the upper links to the slider collars so the rods, paddles, and servo links move as one mechanism.

This hand-sketched assembly guide was important for the project because it forced us to think through part order, access to fasteners, and where tolerances might stack up before the final revision.

## Prototype Gallery

<div class="fp-gallery">
  <div class="fp-figure">
    <img src="{{ '/assets/images/Prototype_1.jpg' | relative_url }}" alt="Overall view of the first BBC prototype">
    <div class="fp-figcap">
      <b>Overall assembly.</b> The first prototype combines the printed chassis, brass guide rods, slider collars, and simple paddle-style grippers in a lightweight test rig.
    </div>
  </div>
  <div class="fp-figure">
    <img src="{{ '/assets/images/Prototype_2.jpg' | relative_url }}" alt="Close-up of the lower linkage and slotted chassis">
    <div class="fp-figcap">
      <b>Lower linkage detail.</b> The bottom mechanism creates the telescoping motion, but this close-up also shows where friction between the chassis and collars started to appear during manual testing.
    </div>
  </div>
  <div class="fp-figure">
    <img src="{{ '/assets/images/Prototype_3.jpg' | relative_url }}" alt="Close-up of the upper linkage connected to the slider collar">
    <div class="fp-figcap">
      <b>Upper slider linkage.</b> The top arm link drives the collar along the guide rod so the paddles can open and close while staying aligned.
    </div>
  </div>
  <div class="fp-figure">
    <img src="{{ '/assets/images/Prototype_4.jpg' | relative_url }}" alt="Close-up of the printed paddle grippers">
    <div class="fp-figcap">
      <b>Paddle grippers.</b> The flat paddles were quick to prototype, but testing showed they are not yet ideal for retaining wider or more rounded objects.
    </div>
  </div>
</div>

<h2 id="testing">Testing</h2>

<div class="fp-note">
  Because the servos had not arrived by the day of testing, both evaluations were done by manually moving the mechanism.
  That limitation still gave us useful information: it isolated the mechanical design from motor performance and made it easier to identify where geometry, friction, and gripper shape needed work.
</div>

<div class="fp-test-stack">
  <div class="fp-test">
    <h3>Test 1: Telescoping Range</h3>
    <p><b>What we tested:</b> Whether the lower linkage could extend the gripper assembly far enough to reach into tighter spaces.</p>
    <p><b>How we tested it:</b> We manually pushed the pivot to each end of travel and measured the displacement between the two extreme positions.</p>
    <p><b>Success target:</b> At least 1.0 inch of telescoping travel.</p>

    <div class="fp-table-wrap">
      <table class="fp-table">
        <thead>
          <tr>
            <th>Target travel (in)</th>
            <th>Reached?</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>0.25</td><td>Yes</td></tr>
          <tr><td>0.50</td><td>Yes</td></tr>
          <tr><td>0.75</td><td>Yes</td></tr>
          <tr><td>1.00</td><td>Yes</td></tr>
          <tr><td>1.25</td><td>No</td></tr>
          <tr><td>1.50</td><td>No</td></tr>
        </tbody>
      </table>
    </div>

    <p>
      <span class="fp-status">Outcome:</span> The mechanism successfully delivered about 1 inch of travel, which met our minimum goal.
      The main issue was not range but quality of motion: Specifically, along some points of the travel, the assembly had alot of friction, and at others, it had some play. This is likely because the 3D printed chassis only had one end of the pivot support fixed, and the other was allowed to freely flex, making the mechanism more compliant.
    </p>
    <p>
      <b>Implication for the next iteration:</b> The single-sided support around the pivot is too compliant. The next version should either support the pivot on both sides for better rigidity or add a spring assembly to remove backlash and reduce rubbing. In both cases, a nylon washer between the retaining collar and plastic chassis would go a long way in reducing friction.
    </p>
  </div>

  <div class="fp-test">
    <h3>Test 2: Object Retention</h3>
    <p><b>What we tested:</b> Whether the gripper could hold small objects with masses and shapes similar to the spotted lanternfly targets.</p>
    <p><b>How we tested it:</b> We placed five small objects between the paddles and manually actuated the gripper, then scored how easy each item was to hold.</p>
    <p><b>Scoring method:</b> Lower is better. A score of 1 corresponds to a light squeeze force, while 5 reflects a much more difficult hold. This is a human assessed squeeze metric. These “scores” were precalibrated on a scale, with a 1 being around 30 grams of force and a 5 being around 150 grams. Values in between step up in increments of 30 grams.</p>

    <div class="fp-table-wrap">
      <table class="fp-table">
        <thead>
          <tr>
            <th>Object</th>
            <th>Mass (g)</th>
            <th>Holding difficulty</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Cough drop</td><td>4</td><td>4</td></tr>
          <tr><td>Tape ball</td><td>3</td><td>2</td></tr>
          <tr><td>Hot glue stick</td><td>4</td><td>1</td></tr>
          <tr><td>Nut</td><td>5</td><td>5</td></tr>
          <tr><td>Allen key</td><td>4</td><td>3</td></tr>
        </tbody>
      </table>
    </div>

    <p>
      <span class="fp-status warn">Outcome:</span> Grip quality depended much more on shape than on mass. Despite the objects all being similar weight, the ones that were physically “wider” along the gripper’s direction were far more difficult to hold, as they had a tendency to want to “roll out” from between the grabbers. We believe this to largely be due to the fact that the grippers are fairly small flat paddles, and the farther they are apart, the more they try to push objects out, rather than hold them flat to eachother. 

    </p>
    <p>
      <b>Implication for the next iteration:</b> The end effector needs a better contact surface. Changing the paddles shape, either adding teeth, a curvature, or making it a frame with a compliant mesh inside might be more conducive to catching and retaining small, bug-shaped objects.
    </p>
  </div>
</div>

### What this prototype proved

- The overall mechanism concept is viable: the hand can telescope and the grippers can close around small objects.
- The 1 inch telescoping target was met, so the lower linkage is worth carrying forward.
- The flat paddle geometry is the weakest part of the current design and should be redesigned before the final prototype.
- Chassis stiffness and friction at the pivot matter enough that they should be addressed, and treated as a primary design risk.

<h2 id="criteria">Summary of Success Criteria</h2>

The functional prototype helped us turn our rough concept into measurable design targets for the final build. Our prototype design criterion continue to be useful considerations as we move forward, and should certainly be taken into account in our next generation prototype and exhibit-day demo.

<div class="fp-table-wrap">
  <table class="fp-table">
    <thead>
      <tr>
        <th>Criterion</th>
        <th>How it is measured</th>
        <th>Current status</th>
        <th>Why it matters</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Telescoping reach of at least 1.0 in</td>
        <td>Measure total travel between both extreme positions with a ruler</td>
        <td><span class="fp-status">Met in Prototype 1</span></td>
        <td>Shows the hand can extend into tighter spaces around vines, bark, or trellis hardware</td>
      </tr>
      <tr>
        <td>Reliable retention of small 3-5 g targets across multiple shapes</td>
        <td>Hold at least 4 of 5 bug-sized objects with a difficulty score of 3 or lower</td>
        <td><span class="fp-status warn">Partially met</span></td>
        <td>Capturing a target is more important than simply touching it; shape robustness is critical in the field</td>
      </tr>
      <tr>
        <td>Repeatable motorized operation without binding</td>
        <td>Complete at least 20 open-close and telescope cycles with no loose joints, jams, or visible alignment drift</td>
        <td><span class="fp-status pending">Still to be tested</span></td>
        <td>This is the clearest bridge from a hand-actuated bench prototype to a real robotic attachment</td>
      </tr>
    </tbody>
  </table>
</div>

For an exhibit demonstration, the most compelling setup would be a short, repeatable sequence where the mechanism extends toward a mock target, closes around it, and retracts while visibly retaining the object. That demo ties directly to the two criteria tested: **can it reach the target, and can it actually keep hold of it?**

## Reflection

This prototype did exactly what we hoped our first prototype would do: it validated the central mechanism, exposed where the design is too compliant, and gave us ideas for what needs to change next. The telescoping concept is strong enough to keep. The gripper geometry and pivot support need revision before the final prototype, but that is a useful outcome, not a failure. This process turned our concept from a promising sketch into a mechanism with measurable strengths, visible weaknesses, and a much clearer path to the next build.
