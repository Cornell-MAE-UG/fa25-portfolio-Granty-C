---
layout: default
title: Grant Corso - Portfolio
permalink: /projects/
---

<section class="projects-header">
  <p class="projects-kicker">Selected Work</p>
  <h1>Project Portfolio</h1>
  <p class="projects-lead">
    A collection of coursework, design studies, experimental writeups, and build-focused engineering projects.
  </p>
</section>

<div class="gallery-container">
  <div class="project-gallery">
    {% assign sorted_projects = site.projects | sort: "path" | reverse %}
    {% for project in sorted_projects %}
      <a class="gallery-item" href="{{ project.url | relative_url }}">
        <div class="gallery-media">
          <img src="{{ project.image | relative_url }}" alt="{{ project.title }}" />
        </div>
        <div class="gallery-copy">
          <h3>{{ project.title }}</h3>
          {% if project.description %}
            <p>{{ project.description }}</p>
          {% endif %}
        </div>
      </a>
    {% endfor %}
  </div>
</div>
