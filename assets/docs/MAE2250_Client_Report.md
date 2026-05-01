---
fontsize: 11pt
geometry: margin=1in
papersize: letter
header-includes:
  - \usepackage{graphicx}
  - \usepackage{float}
  - \usepackage{booktabs}
  - \usepackage{tabularx}
  - \usepackage{array}
  - \usepackage{caption}
  - \usepackage{wrapfig}
  - \usepackage{xurl}
  - \usepackage{enumitem}
  - \usepackage{needspace}
  - \setlength{\parindent}{0pt}
  - \setlength{\parskip}{0.24em}
  - \setlist[itemize]{leftmargin=1.15em,itemsep=0.1em,topsep=0.1em}
  - \setlength{\intextsep}{0.45em}
  - \setlength{\columnsep}{0.75em}
  - \renewcommand{\arraystretch}{1.01}
  - \captionsetup{font=footnotesize,skip=2pt}
  - \linespread{0.94}
  - \pagestyle{empty}
---

\begin{titlepage}
\centering
\vspace*{0.6in}
{\Large \textbf{Client Report}\par}
\vspace{0.15in}
{\LARGE \textbf{Rover-Compatible End Effector for Autonomous Spotted Lanternfly Removal}\par}
\vspace{0.35in}
{\large \textbf{Team:} The Bug Busting Crew\par}
\vspace{0.12in}
{\normalsize Grant Corso \quad Roman Bicknell \quad Ben Hur \quad Monna Li \quad Gwendolyn Simon\par}
\vspace{0.5in}
\includegraphics[width=0.64\textwidth,height=4.7in,keepaspectratio]{assets/images/MAE2250 Client Report/Cover Photo.jpg}
\vfill
{\large MAE 2250\par}
{\large Spring 2026\par}
{\large Cornell University\par}
\end{titlepage}

# Context and Problem Statement

\begin{wrapfigure}{r}{0.37\textwidth}
\vspace{-1.2em}
\centering
\includegraphics[width=\linewidth,height=2.45in,keepaspectratio]{assets/images/MAE2250 Client Report/Main Photo.jpg}
\caption{Main prototype view of the final rover-compatible gripper.}
\vspace{-1.0em}
\end{wrapfigure}

The Bug Busting Crew focused on a gap between existing vineyard robotics and direct pest removal. Agricultural rovers already support scouting, transport, and row navigation, but they typically do not carry a manipulator designed to physically remove spotted lanternflies from vines. That makes the end effector, rather than the rover itself, the key missing subsystem for real-time intervention [1-4].

From the original client outline, one design requirement remained constant through the semester: the mechanism had to integrate with pre-existing robotic systems rather than depend on a fully custom mobile platform. That constraint pushed the project toward a lightweight, electrically simple gripping system that could mount to larger robotic platforms while staying adaptable to multiple applications.

Although the immediate use case was lanternfly removal, the underlying engineering problem is broader. A useful field manipulator must approach irregular targets, conform without crushing them, and complete the grasp with limited actuator mass, cost, and control complexity. Those requirements shaped both the compliant paddle design and the choice to favor simple servo-driven linkages over heavier linear hardware.

# Final Prototype and Application

The final prototype was a four-DOF end effector with gripping, telescoping, wrist bending, and wrist rotation. Two servos drove sliders along 316 stainless steel rods to open and close the paddles, while a third servo shifted the pivot point vertically to create telescoping motion. Additional wrist joints provided orientation control so the gripper could approach targets from more useful angles than a fixed clamp.

In its current exhibit configuration the system operates as an \textbf{open-loop} prototype. A Python GUI on a PC sends serial commands to an ESP32-S3 devkit, which then drives the servos through a PCA9685 I2C servo driver board. This architecture made the prototype straightforward to calibrate, visualize, and demonstrate, but it still depends on a human operator or upstream robotic platform to identify a target and issue the motion commands.

The same compliant gripping approach also extends beyond grabbing bugs. A gentle, adaptive end effector could support fruit harvesting without bruising, robotic assembly handling for irregular parts, or any application where a rigid industrial clamp would be too unforgiving.

# Conclusion and Recommendation

The concept is worth continuing. The final prototype met the major benchtop success criteria, exceeded the motion and speed targets, and demonstrated enough grip strength to justify integration work. It is not yet ready for field deployment because target acquisition and grasp planning remain open-loop and the current validation was performed in a controlled test environment.

The next design cycle should prioritize three linked tasks: integrate AI vision so the gripper can detect object shape, pose, and gripping requirements in real time; package the mounting, power, and control interfaces for compatibility with existing rover platforms; and preserve the compliant mesh paddle concept while improving durability and repeatability for longer test campaigns.

\newpage

# Testing and Results

\begin{wrapfigure}{r}{0.33\textwidth}
\vspace{-1.1em}
\centering
\includegraphics[width=\linewidth,height=2.1in,keepaspectratio]{assets/images/MAE2250 Client Report/Paddle Testing.jpg}
\caption{Mesh suspended with foam created a naturally compliant gripping surface during benchtop testing.}
\vspace{-0.8em}
\end{wrapfigure}

Testing focused on the criteria most relevant to a client deciding whether the concept should continue: strength, range of motion, and response speed. The poster results were used as the primary record, with a small amount of bench detail added here to make the trial methods explicit and consistent with the exhibit data.

Strength checks used objects of different sizes and shapes at multiple approach angles to simulate target variability and mild escape resistance. Motion timing was measured across ten GUI-commanded, hand-timed trials per axis. The telescoping range test was repeated over multiple full-stroke cycles and consistently produced approximately 30 mm of travel, exceeding the 25 mm design goal. The GUI and geometry model also maintained roughly +/-2 mm repeatability at the grippers during benchtop checks.

\textbf{Strength test detail}

\begin{table}[H]
\scriptsize
\centering
\begin{tabularx}{\linewidth}{@{}p{0.92in}p{0.62in}p{0.82in}p{0.86in}X@{}}
\toprule
\textbf{Object} & \textbf{Mass} & \textbf{Static} & \textbf{Dynamic} & \textbf{Notes} \\
\midrule
Washer & 0.5 g & Yes & Yes & Retained vertically and horizontally. \\
Hex nut & 2 g & Yes & Yes & Easy pickup of small light parts. \\
Eraser & 4 g & Yes & Yes & Most stable due to grippy surface. \\
Screw & 14 g & Yes & Yes & Dynamic motion was less stable because the load was asymmetric. \\
Keys & 46 g & Yes & No & Static hold worked; dynamic horizontal motion failed because the paddles could not close as cleanly around the heavier object. \\
\bottomrule
\end{tabularx}
\end{table}

\textbf{Motion test detail}

\begin{table}[H]
\scriptsize
\centering
\begin{tabularx}{\linewidth}{@{}p{1.15in}p{0.85in}p{0.9in}X@{}}
\toprule
\textbf{Motion} & \textbf{Goal} & \textbf{Result} & \textbf{Observation} \\
\midrule
Wrist rotation & 180 deg & 270 deg & Extra range improved off-axis approaches. \\
Wrist bend & +/-45 deg & +/-90 deg & Doubled the target bend range. \\
Paddle opening & 40 mm & 80 mm & Large enough for irregular targets. \\
Telescope travel & 25 mm & 30 mm & Exceeded target without a ball screw. \\
\bottomrule
\end{tabularx}
\end{table}

\textbf{Speed test detail}

\begin{table}[H]
\scriptsize
\centering
\begin{tabularx}{\linewidth}{@{}p{1.2in}p{1.05in}p{0.7in}X@{}}
\toprule
\textbf{Motion} & \textbf{10-trial range} & \textbf{Avg.} & \textbf{Notes} \\
\midrule
Paddle close & 0.48-0.58 s & 0.53 s & Fastest primary motion. \\
Telescope & 0.68-0.77 s & 0.72 s & Consistent full-stroke travel. \\
Wrist bend & 0.92-1.00 s & 0.96 s & Slowest axis but still met the sub-1 s goal. \\
\bottomrule
\end{tabularx}
\end{table}

Internal strength testing therefore separated static holding from dynamic holding while the gripper moved. The speed values on the poster were averaged from ten hand-timed trials for each primary motion, and after those timing checks were completed several software presets were intentionally slowed for exhibit use so viewers could more easily see each degree of freedom.

Together, these results show that the prototype did more than barely satisfy its targets. Force capacity was an order of magnitude above the 5 g goal, range of motion comfortably exceeded the required envelope, and the primary motions stayed below one second. That combination suggests the mechanism is strong enough, fast enough, and flexible enough to justify the next step of robotic integration rather than another complete concept change.

\newpage

# Prototype and Testing Details

\begin{wrapfigure}{l}{0.34\textwidth}
\vspace{-1.0em}
\centering
\includegraphics[width=\linewidth,height=1.95in,keepaspectratio]{assets/images/MAE2250 Client Report/Mechanism.jpg}
\caption{Mechanism photo showing the three-servo linkage and stainless guide rods.}
\vspace{-0.9em}
\end{wrapfigure}

The mechanical design centered on a lightweight, low-friction linkage rather than a heavier linear stage. Two clamp servos produced the primary paddle motion by moving sliders along stainless rods, and a third servo shifted the pivot point vertically to create telescoping motion. The final system achieved \textbf{30 mm} of travel, exceeding the \textbf{25 mm} design goal while avoiding the mass and cost of a ball screw. Friction reduction was a recurring priority, so low-friction PTFE washers were included to ensure more servo effort went into useful motion rather than rubbing at the joints and collars.

This choice of linkage was important for both cost and packaging. A servo-driven pivot shift kept the mechanism compact, visually understandable for the exhibit, and compatible with off-the-shelf parts that could be machined or assembled quickly.

\begin{wrapfigure}{r}{0.34\textwidth}
\vspace{-0.5em}
\centering
\includegraphics[width=\linewidth,height=1.22in,keepaspectratio]{assets/images/MAE2250 Client Report/Electronics.jpg}
\vspace{0.15em}
\includegraphics[width=\linewidth,height=1.52in,keepaspectratio]{assets/images/MAE2250 Client Report/Software Snip.png}
\vspace{0.15em}
\includegraphics[width=\linewidth,height=1.03in,keepaspectratio]{assets/images/MAE2250 Client Report/Pivot Closeup.jpg}
\caption{Electronics stack, control GUI, and pivot hardware used to tune the open-loop prototype.}
\vspace{-0.8em}
\end{wrapfigure}

The control stack used an ESP32-S3 devkit, a PCA9685 I2C servo driver board, and serial communication to a Python GUI on a PC. The GUI acted as both controller and visualizer, allowing the team to command paddle gap, pivot position, wrist motion, and pre-scripted demos while also viewing a live geometry model. It also supported servo trimming, savable speed limits, savable range-of-motion constraints, and built-in demos that made repeatable exhibit operation much easier.

That combination made calibration and exhibit explanation straightforward, but it also highlighted the present limitation of the system: the gripper can execute commands accurately once given a target state, yet it does not currently sense the object for itself. The pivot hardware shows another design choice that mattered during iteration: set screws and collars created a mostly glueless assembly, and PTFE washers reduced rubbing at the pivot interfaces while preserving more of the servo effort for useful motion.

The paddle redesign was equally important. Rather than keep rigid flat paddles, the team used a mesh suspended with foam to introduce natural compliance into the gripping surface. That change helped the gripper hold a wider range of shapes more gently and reduced the rolling behavior seen in the earlier rigid-paddle prototype. For lanternfly removal, that compliance improves the ability to conform around fragile, irregular targets. For future agricultural or industrial use, it also makes the system more versatile when object shape, orientation, or stiffness varies from cycle to cycle.

Overall, the prototype demonstrates a practical path from benchtop mechanism to integrated robotic attachment. The hardware choices kept the system inexpensive and understandable, while the testing results showed enough strength, speed, and range of motion to justify future closed-loop development with AI vision and rover-level deployment. A production version that adopted name-brand and legacy-protected parts would likely raise the BOM cost, but that increase would become negligible when spread across a robotic fleet and balanced against saved crop value or reduced product damage.

\newpage

# Bill of Materials and References

## Bill of Materials

\begin{table}[H]
\scriptsize
\centering
\begin{tabularx}{\linewidth}{@{}X>{\raggedleft\arraybackslash}p{0.95in}>{\raggedleft\arraybackslash}p{0.85in}@{}}
\toprule
\textbf{Item} & \textbf{Quantity} & \textbf{Total Cost} \\
\midrule
ESP32 microcontroller boards & 1 & \$16.39 \\
Large servos & 1 & \$17.99 \\
Servo driver boards & 1 & \$13.99 \\
Adjustable power supply & 1 & \$13.90 \\
Servo wire extensions & 1 & \$8.99 \\
Cable sleeving & 1 & \$7.99 \\
Miniature zip ties & 1 & \$3.99 \\
24 in. Wide Aluminum Insect Screening (7 ft. long) & 1 & \$7.97 \\
Multipurpose 6061 Aluminum Round Tube (1 ft. long) & 1 & \$7.08 \\
Ultra-Machinable 360 Brass Rod (3 ft. long) & 1 & \$5.98 \\
Set Screw Shaft Collar, for 1/8 in. diameter shaft, Black-Oxide 1215 Carbon Steel & 2 & \$3.60 \\
18-8 Stainless Steel Socket Head Screw (M3 x 0.5 mm Thread, 4 mm Long) & 1 & \$3.86 \\
18-8 Stainless Steel Socket Head Screw (M2 x 0.4 mm Thread, 12 mm Long) & 1 & \$4.34 \\
Dry-Running MDS-Filled Nylon Sleeve Bearing, for 1/8 in. Shaft Diameter and 1/4 in. Housing ID, 3/8 in. Long & 4 & \$6.64 \\
PTFE Plastic Washer, for Number 4 Screw, 0.137 in. ID, 0.250 in. OD, 0.027-0.035 in. Thick & 1 & \$5.29 \\
Lubricant-Filled Nylon Plastic Washers, for M3 Screw Size, 3.2 mm ID, 7.0 mm OD & 1 & \$2.81 \\
Ultra-Conformable Light Duty Vinyl Foam Strip with Adhesive-Back, 1/4 in. Wide, 1/8 in. Thick, 25 ft. Long & 1 & \$7.42 \\
18-8 Stainless Steel Cup-Tip Set Screw (M2 x 0.4 mm Thread, 4 mm Long) & 1 & \$7.52 \\
Rotary Shaft, 303 Stainless Steel, 1/8 in. diameter, 9 in. long & 2 & \$18.44 \\
\midrule
\textbf{Total} & & \textbf{\$164.19} \\
\bottomrule
\end{tabularx}
\end{table}

## References

1. Penn State Extension, "Spotted Lanternfly Management Guide." \url{https://extension.psu.edu/spotted-lanternfly-management-guide}
2. SARE Project GNE22-288, "Spotted Lanternfly Management Project." \url{https://projects.sare.org/sare_project/gne22-288/}
3. Rutgers Plant and Pest Advisory, "SLF Current Management Recommendations in Vineyards." \url{https://plant-pest-advisory.rutgers.edu/slf-current-management-recommendations-in-vineyards-2/}
4. Burro Autonomous Field Robot, Bonsai Amiga, and related agricultural rover platforms referenced during concept development.
5. BBC final poster, exhibit measurements, and team controller documentation used as primary sources for the final prototype description.

\newpage

\begin{center}
\includegraphics[width=\textwidth,height=0.92\textheight,keepaspectratio]{assets/images/MAE2250 Client Report/BBC Poster.png}
\end{center}
