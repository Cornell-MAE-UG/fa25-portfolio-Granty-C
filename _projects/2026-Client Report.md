---
layout: project
title: Client Report - ODP 6
description: Final client-facing report and exhibit summary for The Bug Busting Crew's rover-compatible robotic gripper.
image: /assets/images/MAE2250 Client Report/Cover Photo.jpg
imagealt: Close-up of the final lanternfly-removal gripper
technologies: [Client Reporting, Mechatronics, Robotic Grippers, Servo Mechanisms, Testing, Design Communication]
hide_from_projects: true
---

<div class="mae2250-series-bar">
  <span class="mae2250-series-label">MAE 2250 Project Series</span>
  <a href="{{ '/projects/2026-Rover-Compatible%20End%20Effector/' | relative_url }}">Overview</a>
  <a href="{{ '/projects/2026-Client%20Outline/' | relative_url }}">Client Outline</a>
  <a href="{{ '/projects/2026-Functional%20Prototype/' | relative_url }}">Functional Prototype</a>
  <a href="#context-and-problem-statement">Client Report</a>
</div>

<div class="mae2250-download-row">
  <a class="mae2250-download primary" href="{{ '/assets/docs/MAE2250_Client_Report.pdf' | relative_url }}">Download Client Report PDF</a>
  <a class="mae2250-download" href="{{ '/assets/docs/BBC Poster.pdf' | relative_url }}">Open Poster PDF</a>
</div>

<div class="mae2250-note">
  <p>
    <b>Report focus.</b> This milestone turns the earlier client framing and prototype work into a final recommendation.
    The current system is an open-loop benchtop prototype. Its strongest next step is closed-loop integration with AI vision
    and a compatible rover platform.
  </p>
</div>

<h2 id="context-and-problem-statement">Context and Problem Statement</h2>

<div class="mae2250-split">
  <div>
    <p>
      The Bug Busting Crew focused on a gap between existing vineyard robotics and direct pest removal. Mobile agricultural
      robots already handle scouting, transport, and row navigation, but they typically do not carry an end effector built
      for physically removing spotted lanternflies from vines. Our project therefore targeted the manipulator, not the entire rover.
    </p>
    <p>
      From the original client outline, one guiding constraint stayed constant: the device had to be compatible with pre-existing
      robotic systems rather than depend on a fully custom vehicle. That pushed the design toward a lightweight, adaptable,
      electrically simple end effector that could eventually mount on rover platforms already used in agriculture or research.
    </p>
    <p>
      While the project originated around lanternfly removal, the broader engineering problem is more general:
      how to build a compliant gripper that can approach fragile or irregular targets, conform gently, and still integrate
      with an upstream robotic system.
    </p>
  </div>
  <div class="mae2250-figure mae2250-side-figure" style="margin-top:0;">
    <img
      src="{{ '/assets/images/MAE2250 Client Report/Cover Photo.jpg' | relative_url }}"
      alt="Cover photo showing a close-up of the final robotic gripper"
    >
    <div class="mae2250-figcap">
      <b>Cover image.</b> The final gripper was designed as a modular attachment that could plug into a larger robotic workflow
      rather than act as a standalone machine.
    </div>
  </div>
</div>

<h2 id="final-prototype-and-application">Final Prototype and Application</h2>

<div class="mae2250-split mae2250-hero-split">
  <div class="mae2250-figure mae2250-hero-figure">
    <img
      src="{{ '/assets/images/MAE2250 Client Report/Main Photo.jpg' | relative_url }}"
      alt="Main photo of the final robotic gripper prototype"
    >
    <div class="mae2250-figcap">
      <b>Main prototype view.</b> The final prototype combined the gripper paddles, telescoping linkage, and wrist joints into a
      rover-compatible end effector intended for direct interaction with lanternflies on grapevines.
    </div>
  </div>
  <div class="mae2250-tight">
    <p>
      The final prototype was a four-DOF end effector consisting of a gripping mechanism, telescoping motion, wrist bending, and wrist rotation.
      In the current exhibit configuration the system is controlled as an <b>open-loop</b> device: a Python GUI on a PC sends serial commands to
      an ESP32-S3, which then drives the servos through an I2C servo driver board. This architecture made the prototype easy to calibrate,
      visualize, and demonstrate, but it still depends on a human operator or upstream robot to identify the target and command the motion.
    </p>
    <div class="mae2250-callout" style="margin:0.85rem 0;">
      <p class="mae2250-kicker">Future Control Direction</p>
      <h3 style="margin-top:0.15rem;">Closed-loop AI vision is the recommended next step</h3>
      <p>
        The most valuable next improvement is to move from open-loop positioning to closed-loop control using AI vision systems.
        With vision feedback, the gripper could detect object shape, position, and gripping requirements in real time, then adjust
        paddle spacing, approach angle, and reach automatically.
      </p>
    </div>
    <p>
      That future direction also broadens the prototype's usefulness well beyond grabbing bugs. The same compliant gripping approach could be used
      to pick fruit from vines without bruising, to handle irregular parts on a robotic assembly line, or to interact with any target where a
      gentle but adaptable grasp is more useful than a rigid industrial clamp.
    </p>
  </div>
</div>

<h2 id="conclusion-and-recommendation">Conclusion and Recommendation</h2>

<p>
  Our recommendation is to continue developing this concept rather than replace it. The final prototype met the main benchtop success criteria,
  exceeded the motion and speed targets, and demonstrated enough grip strength to justify integration work. At the same time, it is not yet ready
  for field deployment because target selection and motion remain open-loop and the current validation was conducted in a controlled test environment.
</p>

<p>
  The next design cycle should therefore focus on three priorities:
</p>

<ul class="mae2250-list">
  <li>Integrate the end effector with an upstream AI vision system so target pose and gripping commands can be generated automatically.</li>
  <li>Package the electronics, power, and mounting interfaces for compatibility with existing rover platforms.</li>
  <li>Retain the compliant mesh paddle concept while improving durability and repeatability for longer testing campaigns.</li>
</ul>

<h2 id="testing-and-results">Testing and Results</h2>

<p>
  Testing focused on the criteria most relevant to a client deciding whether the concept is worth continuing:
  strength, range of motion, and response speed. The poster results are summarized below, with additional benchtop notes from the internal
  strength log and hand-timed speed trials included to clarify how the trials were run.
</p>

<div class="mae2250-table-wrap">
  <table class="mae2250-table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Success criterion</th>
        <th>Result</th>
        <th>What it implies</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Strength testing</td>
        <td>Lift at least 5 g without losing the target</td>
        <td>50 g lifted and manipulated</td>
        <td>Grip force was more than sufficient for the original SLF use case.</td>
      </tr>
      <tr>
        <td>Motion testing</td>
        <td>Wrist rotation 180 deg, wrist bending +/-45 deg, paddle opening 40 mm</td>
        <td>270 deg rotation, +/-90 deg bending, 80 mm opening</td>
        <td>The end effector has enough flexibility to navigate cluttered vine geometry.</td>
      </tr>
      <tr>
        <td>Telescoping range</td>
        <td>25 mm of travel</td>
        <td>30 mm of travel</td>
        <td>The telescoping linkage exceeded the target while avoiding a heavier ball screw assembly.</td>
      </tr>
      <tr>
        <td>Speed testing</td>
        <td>All primary motions under 1 s</td>
        <td>0.53 s close, 0.72 s telescope, 0.96 s wrist bend</td>
        <td>Response time is fast enough for practical robotic sequencing.</td>
      </tr>
      <tr>
        <td>Positioning</td>
        <td>No formal requirement set</td>
        <td>+/-2 mm at the grippers</td>
        <td>The GUI and geometry model gave useful repeatability for a benchtop prototype.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="mae2250-grid-3">
  <div class="mae2250-card mae2250-tight">
    <p class="mae2250-kicker">Strength Test</p>
    <h3>Static and dynamic holding</h3>
    <div class="mae2250-table-wrap">
      <table class="mae2250-table mae2250-mini-table">
        <thead>
          <tr>
            <th>Object</th>
            <th>Mass</th>
            <th>Static</th>
            <th>Dynamic</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Washer</td><td>0.5 g</td><td>Yes</td><td>Yes</td></tr>
          <tr><td>Hex nut</td><td>2 g</td><td>Yes</td><td>Yes</td></tr>
          <tr><td>Eraser</td><td>4 g</td><td>Yes</td><td>Yes</td></tr>
          <tr><td>Screw</td><td>14 g</td><td>Yes</td><td>Yes</td></tr>
          <tr><td>Keys</td><td>46 g</td><td>Yes</td><td>No</td></tr>
        </tbody>
      </table>
    </div>
    <p>
      Internal testing split the grip task into <b>static holding</b> and <b>dynamic holding while moving</b>. The compliant paddle surface
      prevented the rolling behavior seen in the earlier rigid-paddle prototype and kept lighter objects stable even during motion.
    </p>
  </div>
  <div class="mae2250-card mae2250-tight">
    <p class="mae2250-kicker">Motion Test</p>
    <h3>Travel margins above goal</h3>
    <div class="mae2250-table-wrap">
      <table class="mae2250-table mae2250-mini-table">
        <thead>
          <tr>
            <th>Motion</th>
            <th>Goal</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Wrist rotation</td><td>180 deg</td><td>270 deg</td></tr>
          <tr><td>Wrist bend</td><td>+/-45 deg</td><td>+/-90 deg</td></tr>
          <tr><td>Paddle opening</td><td>40 mm</td><td>80 mm</td></tr>
          <tr><td>Telescope travel</td><td>25 mm</td><td>30 mm</td></tr>
        </tbody>
      </table>
    </div>
    <p>
      Repeated range checks confirmed that the final mechanism reached all required positions, including a measured telescoping span
      of 30 mm across full-travel cycles. That exceeded the 25 mm benchmark and improved access into tighter spaces.
    </p>
  </div>
  <div class="mae2250-card mae2250-tight">
    <p class="mae2250-kicker">Speed Test</p>
    <h3>Ten-trial averages below one second</h3>
    <div class="mae2250-table-wrap">
      <table class="mae2250-table mae2250-mini-table">
        <thead>
          <tr>
            <th>Motion</th>
            <th>Range</th>
            <th>Avg.</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Paddle close</td><td>0.48-0.58 s</td><td>0.53 s</td></tr>
          <tr><td>Telescope</td><td>0.68-0.77 s</td><td>0.72 s</td></tr>
          <tr><td>Wrist bend</td><td>0.92-1.00 s</td><td>0.96 s</td></tr>
        </tbody>
      </table>
    </div>
    <p>
      The motion timing reported on the poster came from ten <b>hand-timed</b> trials per axis. After the measurements were recorded,
      the team later slowed several software presets so demo viewers could more easily see each degree of freedom and understand what the
      mechanism was doing.
    </p>
  </div>
</div>

<h2 id="prototype-and-testing-details">Prototype and Testing Details</h2>

<div class="mae2250-card">
  <p>
    The gripper mechanism was built around a lightweight, low-friction linkage rather than a heavier linear stage. Two clamp servos drive the
    primary paddle motion by moving sliders along stainless rods, and a third servo shifts the pivot point vertically to telescope the arm.
    The final system achieved <b>30 mm</b> of travel, exceeding the <b>25 mm</b> design goal while avoiding the mass and cost of a ball screw assembly.
  </p>
  <p>
    Friction reduction was a recurring design priority. The assembly used low-friction features, including PTFE washers, so the servos could spend
    more of their torque on useful motion instead of rubbing at the joints and collars.
  </p>
  <p>
    Assembly clarity was another design goal. The team mounted the servos into the chassis first, attached the printed arm links, built the guide-rod
    and paddle subassemblies, slid the lower pivot axle through the arm bases, and then connected the upper links to the slider collars to complete
    the motion chain. That order kept the fasteners accessible, made alignment easier, and simplified later design revisions.
  </p>
</div>

<div class="mae2250-figure-stack mae2250-figure-stack-3">
  <div class="mae2250-figure" style="margin-top:0;">
    <img
      src="{{ '/assets/images/MAE2250 Client Report/Mechanism.jpg' | relative_url }}"
      alt="Mechanism photo showing the servo-driven gripper linkage"
    >
    <div class="mae2250-figcap">
      <b>Mechanical design.</b> Two servos drive sliders along 316 stainless steel rods to open and close the paddles.
    </div>
  </div>
  <div class="mae2250-figure">
    <img
      src="{{ '/assets/images/MAE2250 Client Report/Pivot Closeup.jpg' | relative_url }}"
      alt="Close-up of the pivot hardware, set screws, and low-friction washers"
    >
    <div class="mae2250-figcap">
      <b>Pivot close-up.</b> Set screws, collars, and low-friction washers created a glueless assembly.
    </div>
  </div>
  <div class="mae2250-figure">
    <img
      src="{{ '/assets/images/MAE2250 Client Report/Paddle Testing.jpg' | relative_url }}"
      alt="Paddle testing photo showing the compliant mesh-and-foam contact surface"
    >
    <div class="mae2250-figcap">
      <b>Compliant paddles.</b> Mesh suspended with foam adapted to different target shapes.
    </div>
  </div>
</div>

<div class="mae2250-split">
  <div class="mae2250-card">
    <p>
      The pivot hardware was also chosen to support fast iteration. Rather than glue major joints permanently, the team used set screws
      and collars to create a mostly glueless assembly that could be disassembled, retuned, and reassembled as the prototype evolved.
    </p>
    <p>
      That mattered during exhibit preparation because small geometry changes could be made without reprinting or rebuilding the entire linkage.
      Combined with PTFE washers at the rubbing interfaces, the pivot hardware improved both adjustability and friction performance.
    </p>
    <p>
      In practical terms, the mostly glueless assembly process meant individual components could be swapped one at a time. That was especially useful
      while tuning rod spacing, collar position, and servo horn alignment because the team could change one variable without disturbing the rest of
      the mechanism.
    </p>
    <p class="mae2250-kicker">Electronics and Control</p>
    <h3>PC GUI to ESP32-S3 to I2C servo driver</h3>
    <p>
      The control stack used an ESP32-S3 devkit, an I2C servo driver breakout board, and serial communication to a Python GUI running on a PC.
      In practice, the GUI acted as both a controller and a visualizer: it let the team command paddle gap, pivot position, wrist motion,
      and motion demos while also showing a live geometry view of the mechanism.
    </p>
    <p>
      The software also made tuning practical. Individual servos could be trimmed, speed limits and range-of-motion constraints could be saved,
      and built-in demo routines made it easy to show repeatable motion sequences without hand-entering every command.
    </p>
    <p>
      This setup was a strong exhibit platform because it was easy to tune and easy to explain, but it also made the current open-loop limitation clear.
      The gripper can execute commands accurately once given a target state, yet it does not currently sense the object for itself.
    </p>
    <p>
      The paddle redesign was equally important. Rather than keep rigid flat paddles, the team used a mesh suspended with foam to create natural
      compliance in the grip surface. That made the gripper gentler on irregular targets and more adaptable for future agricultural or industrial use.
    </p>
  </div>
  <div class="mae2250-figure-column">
    <div class="mae2250-figure" style="margin-top:0;">
      <img
        src="{{ '/assets/images/MAE2250 Client Report/Electronics.jpg' | relative_url }}"
        alt="Electronics photo showing the ESP32-S3 and PCA9685 servo driver"
      >
      <div class="mae2250-figcap">
        <b>Electronics photo.</b> The benchtop controller paired an ESP32-S3 with an I2C PWM servo driver for stable multi-servo control.
      </div>
    </div>
    <div class="mae2250-figure">
      <img
        src="{{ '/assets/images/MAE2250 Client Report/Software Snip.png' | relative_url }}"
        alt="Python GUI used to command and visualize the gripper"
      >
      <div class="mae2250-figcap">
        <b>Python GUI.</b> The PC-side interface handled serial communication, live settings, and visual feedback during testing and demos.
      </div>
    </div>
  </div>
</div>

<h2 id="bill-of-materials">Bill of Materials</h2>

<p>
  The cost summary below combines the electronics and purchased hardware used for the final exhibit prototype, including the additional
  McMaster-Carr components shown in the original fabrication table. A production version that used name-brand and legacy-protected parts
  would likely cost more, but that increase would become comparatively negligible when spread across a robotic fleet and weighed against
  saved crop value or reduced product damage.
</p>

<div class="mae2250-table-wrap">
  <table class="mae2250-table">
    <thead>
      <tr>
        <th>Item</th>
        <th class="num">Quantity</th>
        <th class="num">Total cost</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>ESP32 microcontroller boards</td><td class="num">1</td><td class="num">$16.39</td></tr>
      <tr><td>Large servos</td><td class="num">1</td><td class="num">$17.99</td></tr>
      <tr><td>Servo driver boards</td><td class="num">1</td><td class="num">$13.99</td></tr>
      <tr><td>Adjustable power supply</td><td class="num">1</td><td class="num">$13.90</td></tr>
      <tr><td>Servo wire extensions</td><td class="num">1</td><td class="num">$8.99</td></tr>
      <tr><td>Cable sleeving</td><td class="num">1</td><td class="num">$7.99</td></tr>
      <tr><td>Miniature zip ties</td><td class="num">1</td><td class="num">$3.99</td></tr>
      <tr><td>24 in. Wide Aluminum Insect Screening (7 ft. long)</td><td class="num">1</td><td class="num">$7.97</td></tr>
      <tr><td>Multipurpose 6061 Aluminum Round Tube (1 ft. long)</td><td class="num">1</td><td class="num">$7.08</td></tr>
      <tr><td>Ultra-Machinable 360 Brass Rod (3 ft. long)</td><td class="num">1</td><td class="num">$5.98</td></tr>
      <tr><td>Set Screw Shaft Collar, for 1/8 in. diameter shaft, Black-Oxide 1215 Carbon Steel</td><td class="num">2</td><td class="num">$3.60</td></tr>
      <tr><td>18-8 Stainless Steel Socket Head Screw (M3 x 0.5 mm Thread, 4 mm Long)</td><td class="num">1</td><td class="num">$3.86</td></tr>
      <tr><td>18-8 Stainless Steel Socket Head Screw (M2 x 0.4 mm Thread, 12 mm Long)</td><td class="num">1</td><td class="num">$4.34</td></tr>
      <tr><td>Dry-Running MDS-Filled Nylon Sleeve Bearing, for 1/8 in. Shaft Diameter and 1/4 in. Housing ID, 3/8 in. Long</td><td class="num">4</td><td class="num">$6.64</td></tr>
      <tr><td>PTFE Plastic Washer, for Number 4 Screw, 0.137 in. ID, 0.250 in. OD, 0.027-0.035 in. Thick</td><td class="num">1</td><td class="num">$5.29</td></tr>
      <tr><td>Lubricant-Filled Nylon Plastic Washers, for M3 Screw Size, 3.2 mm ID, 7.0 mm OD</td><td class="num">1</td><td class="num">$2.81</td></tr>
      <tr><td>Ultra-Conformable Light Duty Vinyl Foam Strip with Adhesive-Back, 1/4 in. Wide, 1/8 in. Thick, 25 ft. Long</td><td class="num">1</td><td class="num">$7.42</td></tr>
      <tr><td>18-8 Stainless Steel Cup-Tip Set Screw (M2 x 0.4 mm Thread, 4 mm Long)</td><td class="num">1</td><td class="num">$7.52</td></tr>
      <tr><td>Rotary Shaft, 303 Stainless Steel, 1/8 in. diameter, 9 in. long</td><td class="num">2</td><td class="num">$18.44</td></tr>
      <tr><td><b>Total</b></td><td class="num"></td><td class="num"><b>$164.19</b></td></tr>
    </tbody>
  </table>
</div>

<h2 id="references">References</h2>

<div class="mae2250-table-wrap">
  <table class="mae2250-table">
    <thead>
      <tr>
        <th>Reference</th>
        <th>Use in project</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://extension.psu.edu/spotted-lanternfly-management-guide">Penn State Extension SLF Management Guide</a></td>
        <td>Background on the spotted lanternfly problem and the need for scalable intervention.</td>
      </tr>
      <tr>
        <td><a href="https://projects.sare.org/sare_project/gne22-288/">SARE SLF management project</a></td>
        <td>Context for recurring labor and treatment burden in vineyard management.</td>
      </tr>
      <tr>
        <td><a href="https://plant-pest-advisory.rutgers.edu/slf-current-management-recommendations-in-vineyards-2/">Rutgers vineyard recommendations</a></td>
        <td>Earlier context for vineyard-specific SLF pressure and practical field constraints.</td>
      </tr>
      <tr>
        <td>Burro, Bonsai Amiga, and similar agricultural rover platforms</td>
        <td>Examples of the pre-existing robotic systems the end effector was designed to complement.</td>
      </tr>
      <tr>
        <td>BBC final poster, controller documentation, and exhibit testing records</td>
        <td>Primary sources for the final prototype description, control stack, and measured outcomes.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="poster">Poster</h2>

<div class="mae2250-figure">
  <img
    src="{{ '/assets/images/MAE2250 Client Report/BBC Poster.png' | relative_url }}"
    alt="Final project poster for the rover-compatible end effector"
  >
  <div class="mae2250-figcap">
    <b>Final poster attachment.</b> The exhibit poster is included here as the visual summary that anchored the final client report.
  </div>
</div>
