(() => {
  const lab = document.querySelector('[data-torque-lab]');
  if (!lab) return;
  const slider = lab.querySelector('input[type="range"]');
  const torqueOut = lab.querySelector('[data-torque]');
  const forceOut = lab.querySelector('[data-force]');
  const gripOut = lab.querySelector('[data-grip]');
  const throwOut = lab.querySelector('[data-throw]');
  const setbackOut = lab.querySelector('[data-setback]');
  const tube = lab.querySelector('[data-pointer-tube]');
  const tip = lab.querySelector('[data-pointer-tip]');
  const guide = lab.querySelector('[data-straight-line]');
  const guideControl = lab.querySelector('[data-guide]');
  const marks = JSON.parse(lab.querySelector('[data-positions]').textContent);
  const signed = (v, decimals) => (v < 0 ? '−' : v > 0 ? '+' : '') + Math.abs(v).toFixed(decimals);

  function pointerPose(torque) {
    const station = (torque - marks[0][0]) / (marks[1][0] - marks[0][0]);
    const index = Math.min(Math.floor(station), marks.length - 2);
    const a = marks[index], b = marks[index + 1], t = station - index;
    return a.slice(1).map((v, i) => v + (b[i+1] - v)*t);
  }

  function drawPointer(baseX, baseY, tipX, tipY) {
    const length = Math.hypot(tipX-baseX, tipY-baseY);
    const dx = (tipX-baseX)/length, dy = (tipY-baseY)/length;
    const point = (x, y, offset) => [x-dy*offset, y+dx*offset].join(',');
    const radius = 0.21875*250/2, nose = 0.010*250;
    const farX = baseX-500*dx, farY = baseY-500*dy;
    tube.setAttribute('points', [point(farX,farY,radius), point(baseX,baseY,radius),
      point(baseX,baseY,-radius), point(farX,farY,-radius)].join(' '));
    tip.setAttribute('points', [point(baseX,baseY,radius), point(tipX,tipY,nose),
      point(tipX,tipY,-nose), point(baseX,baseY,-radius)].join(' '));
  }

  function update() {
    const t = Number(slider.value), fraction = t/600;
    const signKey = t < 0 ? 'Neg' : 'Pos';
    torqueOut.textContent = signed(t,0) + ' in·lbf';
    slider.setAttribute('aria-valuetext',signed(t,0)+' inch-pounds');
    forceOut.textContent = signed(t/22,2)+' lbf';
    gripOut.textContent = signed(fraction*Number(lab.dataset['grip'+signKey]),3)+' in';
    const [baseX, baseY, tipX, tipY, across, setback] = pointerPose(t);
    throwOut.textContent = signed(across,3)+' in';
    setbackOut.textContent = Math.max(0,setback).toFixed(3)+' in';
    drawPointer(baseX,baseY,tipX,tipY);
  }
  slider.addEventListener('input',update);
  guideControl.addEventListener('change',()=>{
    guide.setAttribute('visibility',guideControl.checked?'visible':'hidden');
  });
  lab.querySelector('[data-zero]').addEventListener('click',()=>{slider.value='0';update();});
  update();

  const frame = document.querySelector('[data-viewer]');
  if (!frame) return;
  const button = frame.querySelector('[data-open]');
  const fallback = frame.querySelector('img');
  const status = frame.querySelector('[role=status]');
  const controls = document.querySelector('[data-model-tools]');
  const animate = controls.querySelector('[data-play]');
  const reset = controls.querySelector('[data-reset]');
  let viewer;
  let objectUrl;
  let preparingViewer = false;
  function frameAssembly() {
    const aspect = viewer.clientWidth/Math.max(1,viewer.clientHeight);
    const halfLength = 25.07*0.0254/2;
    const distance = halfLength/(Math.tan(29*Math.PI/360)*aspect*0.84) + 0.035;
    viewer.cameraOrbit = frame.dataset.orbit+' '+Math.max(0.4,distance).toFixed(4)+'m';
    viewer.cameraTarget = 'auto auto auto';
    viewer.fieldOfView = '29deg';
    viewer.jumpCameraToGoal();
  }
  function rest() {
    if (!viewer) return;
    viewer.pause();viewer.currentTime=0;
    animate.textContent='Play load cycle';animate.setAttribute('aria-pressed','false');
  }
  animate.addEventListener('click',()=>{
    if (viewer.paused) {
      viewer.play();animate.textContent='Pause load cycle';animate.setAttribute('aria-pressed','true');
    } else {
      viewer.pause();animate.textContent='Resume load cycle';animate.setAttribute('aria-pressed','false');
    }
  });
  reset.addEventListener('click',()=>{
    rest();frameAssembly();
  });
  function isExploring() {
    return button.getAttribute('aria-expanded') === 'true';
  }

  function showView(expanded, message = '') {
    const ready = Boolean(viewer && viewer.loaded);
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Back to cover image' : 'Explore in 3D';
    fallback.hidden = expanded && Boolean(viewer);
    controls.hidden = !expanded || !ready;
    if (viewer) viewer.hidden = !expanded;

    if (expanded && ready) {
      frameAssembly();
      animate.hidden = !viewer.availableAnimations.length;
      status.textContent = 'Drag to rotate. Scroll or pinch to zoom.';
    } else if (expanded) {
      status.textContent = 'Loading model…';
    } else {
      if (ready) rest();
      status.textContent = message;
    }
  }

  function handleViewerError() {
    const message = isExploring() ? 'The 3D model could not load. Select Explore in 3D to retry.' : '';
    if (viewer) viewer.remove();
    viewer = null;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
    button.removeAttribute('aria-controls');
    showView(false, message);
  }

  async function loadViewerLibrary() {
    if (customElements.get('model-viewer')) return;
    const embeddedLibrary = document.getElementById('wrench-viewer-library');
    if (!embeddedLibrary) {
      await import(frame.dataset.library);
      return;
    }
    const bytes = Uint8Array.from(atob(embeddedLibrary.textContent.trim()), c => c.charCodeAt(0));
    const libraryUrl = URL.createObjectURL(new Blob([bytes], {type: 'text/javascript'}));
    try {
      await import(libraryUrl);
    } finally {
      URL.revokeObjectURL(libraryUrl);
    }
  }

  frame.closest('figure').addEventListener('keydown', event => {
    if (event.key === 'Escape' && isExploring()) {
      event.preventDefault();
      showView(false);
      button.focus({preventScroll: true});
    }
  });

  button.addEventListener('click', async () => {
    const expanded = !isExploring();
    showView(expanded);
    if (!expanded || viewer || preparingViewer) return;

    preparingViewer = true;
    try {
      await loadViewerLibrary();
      if (!isExploring()) return;
      viewer=document.createElement('model-viewer');
      viewer.id = 'wrench-interactive-model';
      button.setAttribute('aria-controls', viewer.id);
      viewer.alt='Assembled beam torque wrench, with a square drive, reference pointer and transverse scale';
      viewer.setAttribute('camera-controls','');viewer.setAttribute('touch-action','pan-y');
      viewer.setAttribute('camera-orbit',frame.dataset.orbit+' auto');
      viewer.setAttribute('min-camera-orbit','auto 0deg 0.07m');
      viewer.setAttribute('max-camera-orbit','auto 180deg 3.6m');
      viewer.setAttribute('field-of-view','29deg');viewer.setAttribute('min-field-of-view','5deg');
      viewer.setAttribute('max-field-of-view','50deg');viewer.setAttribute('shadow-intensity','0');
      viewer.setAttribute('exposure','1.12');viewer.setAttribute('interaction-prompt','none');
      viewer.addEventListener('load', () => {
        if (isExploring()) showView(true);
      });
      viewer.addEventListener('error', handleViewerError);
      // A local HTML export can optionally embed the model for opening offline.
      const embedded=document.getElementById('wrench-model-bytes');
      if (embedded) {
        const bytes=Uint8Array.from(atob(embedded.textContent.trim()),c=>c.charCodeAt(0));
        objectUrl=URL.createObjectURL(new Blob([bytes],{type:'model/gltf-binary'}));
      }
      viewer.src=objectUrl||frame.dataset.model;
      frame.prepend(viewer);
      showView(true);
    } catch {
      handleViewerError();
    } finally {
      preparingViewer = false;
    }
  });
})();
