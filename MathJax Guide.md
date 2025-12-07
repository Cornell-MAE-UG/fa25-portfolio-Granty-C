MathJax Usage Notes:

This site is now configured to render LaTeX-style math using MathJax on any page that uses the project layout.

How to write math in markdown

Can write math in .md files using standard LaTeX syntax. Use $...$ for inline math and $$...$$ for display (centered) math.

Inline math examples:
$ \theta_0 = 15^\circ $
$ r_L = 19.5\ \text{in} $
$ \delta_{\text{allow}} = 0.02\,L $

These will appear in a paragraph as normal text with math embedded.

Display (block) math examples:
$$
\delta = \frac{W L^3}{3 E I}
$$

or

$$
F_a \cdot \frac{b\,r_a}{L(\theta)} \sin(\theta)
=
W \cdot r_L \cos(\theta)
$$

Display math is centered and on its own line.

Can use subscripts and superscripts as usual:
$ W_{\max} $
$ \theta_0, \theta_1 $
$ L^3, E I $

Can also use \text{} for units or words inside math:
$ r_L = 19.5\ \text{in} $
$ \delta_{\text{allow}} = 0.02\,L $

Summary of changes to the project layout and config:

The site is still using layout: project for portfolio pages. That layout now includes MathJax, so any page that uses layout: project can render LaTeX.

A new include file _includes/mathjax.html was added. It loads MathJax v3 from a CDN and configures it to recognize both $...$/$$...$$ and \(...\)/\[...\] as math delimiters.

The _layouts/project.html file was modified to include that file with:
{% include mathjax.html %}
before rendering the page content.

The _config.yml file’s kramdown section was extended so that kramdown knows we are using MathJax as the math engine. The relevant part now looks like:

markdown: kramdown
kramdown:
  input: GFM
  math_engine: mathjax
  math_engine_opts:
    preview: none

With these changes in place, any future project page that uses layout: project can simply include LaTeX expressions using $...$ and $$...$$, and MathJax will render them automatically.


Demo MathJax Script:
---
layout: project
title: HW12 – MathJax Test
description: Quick check that LaTeX equations render correctly
image: /assets/images/Actuator-Sketch.jpeg
---

<!-- Optional: widen content a bit for this page -->
<style>
  .page-content .wrapper {
    max-width: 960px;
  }
</style>

## HW12 – LaTeX Rendering Test

This page is just to check that LaTeX math is working.

### Inline math

The starting rocker angle is

$ \theta_0 = 15^\circ $

and the rocker length is

$ r_L = 19.5\ \text{in} $.

The 2% deflection limit is

$ \delta_{\text{allow}} = 0.02\,L $.

### Display equations

The cantilever tip deflection formula I am using is:

$$
\delta = \frac{W L^3}{3 E I}
$$

The rigid-body moment balance at the rocker pivot is:

$$
F_a \cdot \frac{b\,r_a}{L(\theta)} \sin(\theta)
=
W \cdot r_L \cos(\theta)
$$

From this, the maximum payload can be written as:

$$
W_{\max}(\theta_0)
=
F_a
\left(
    \frac{b\,r_a}{L(\theta_0)}
\right)
\frac{\sin(\theta_0)}{r_L \cos(\theta_0)}
$$

If these show up as nicely typeset math on the page, MathJax is working.
