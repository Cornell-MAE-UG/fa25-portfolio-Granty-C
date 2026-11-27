import { airRate, baseline, endTime, matchedVolume, roadAt, roadLoad, simulate, step, summarize } from "./model.js";

const root = document.querySelector("[data-quarter-car]");
const find = (selector) => root.querySelector(selector);
const lab = find("[data-lab]");
const motionCanvas = find("[data-motion]");
const plotCanvas = find("[data-plot]");
const timeline = find("[data-time]");
const playButton = find("[data-play]");
const signalSelect = find("[data-signal]");
const horizonSelect = find("[data-horizon]");
const linearToggle = find("[data-linear]");
const contact = find("[data-contact]");
const fields = Object.fromEntries([...root.querySelectorAll("[data-option]")].map((el) => [el.dataset.option, el]));
const clock = find("[data-clock]");
const coilReading = find('[data-reading="coil"]');
const airReading = find('[data-reading="air"]');
const ink = { coil: "#344779", air: "#007464", linear: "#a95018", road: "#697c81", text: "#354f55" };
const channels = {
  body: { label: "Body displacement", unit: "mm", scale: 1000 },
  acceleration: { label: "Body acceleration", unit: "m/s²", scale: 1 },
  compression: { label: "Suspension compression", unit: "mm", scale: 1000 },
  tireLoad: { label: "Total tire load", unit: "kN", scale: .001 },
};

let options = { ...baseline };
let series;
let time = 0;
let lastFrame = null;
let playback = 0;
let rebuildPending = false;
const plotLayer = document.createElement("canvas");

function sizeCanvas(canvas, width, height, ratio) {
  const physicalWidth = Math.round(width * ratio);
  const physicalHeight = Math.round(height * ratio);
  if (canvas.width !== physicalWidth || canvas.height !== physicalHeight) {
    canvas.width = physicalWidth;
    canvas.height = physicalHeight;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return ctx;
}

const resolution = () => Math.min(window.devicePixelRatio || 1, 2);

function renderOptions() {
  find('[data-value="height"]').value = `${fields.height.value} mm`;
  find('[data-value="duration"]').value = `${options.duration.toFixed(2)} s`;
  find('[data-value="damping"]').value = `${options.damping.toLocaleString("en-US")} N·s/m`;
  const liters = options.volume * 1000;
  const exactMatch = Math.abs(options.volume - matchedVolume) < 1e-9;
  find('[data-value="volume"]').value = `${liters.toFixed(exactMatch ? 3 : 2)} L`;
  find("[data-rate]").textContent = `Air tangent rate ${(airRate(options.volume) / 1000).toFixed(2)} kN/m`;
}

function renderMetrics() {
  const present = {
    bodyPeak: (v) => `${(v * 1000).toFixed(2)} mm`,
    accelPeak: (v) => `${v.toFixed(2)} m/s²`,
    accelRMS: (v) => `${v.toFixed(3)} m/s²`,
    travel: (v) => `${(v * 1000).toFixed(2)} mm`,
    minLoad: (v) => `${(v * .001).toFixed(3)} kN`,
    settling: (v) => v === null ? `> ${(endTime - options.duration).toFixed(2)} s` : `${v.toFixed(2)} s`,
  };
  const failed = [];
  for (const mode of ["coil", "air", ...(linearToggle.checked ? ["linear"] : [])]) {
    const summary = summarize(series[mode], options);
    if (summary.minLoad <= 0) failed.push({ coil: "coil", air: "air", linear: "linear air" }[mode]);
    if (mode === "linear") continue;
    for (const [key, format] of Object.entries(present)) {
      find(`[data-${mode}="${key}"]`).textContent = format(summary[key]);
    }
  }
  contact.dataset.invalid = String(failed.length > 0);
  contact.textContent = failed.length > 0
    ? `Zero or negative tire load predicted for ${new Intl.ListFormat("en-US").format(failed)}. The continuous-contact assumption fails for that part of the trace.`
    : "All displayed models retain positive tire load for this run.";
}

function stroke(ctx, points, color, width = 1.4, dash = []) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash(dash);
  ctx.beginPath();
  points.forEach(([x, y], index) => index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ctx.stroke();
  ctx.setLineDash([]);
}

function spring(ctx, x, top, bottom, color) {
  const ends = [0, .13, .24, .34, .44, .54, .64, .74, .84, 1];
  const zig = [0, 0, -4.8, 4.8, -4.8, 4.8, -4.8, 4.8, 0, 0];
  stroke(ctx, ends.map((fraction, index) => [x + zig[index], top + fraction * (bottom - top)]), color, 1.6);
}

function damper(ctx, x, upper, lower, color) {
  const center = (upper + lower) / 2;
  stroke(ctx, [[x, upper], [x, center], [x - 4, center], [x + 4, center]], color);
  stroke(ctx, [[x - 5, center - 2], [x - 5, center + 8], [x + 5, center + 8], [x + 5, center - 2]], color);
  stroke(ctx, [[x, center + 8], [x, lower]], color);
}

function drawVehicle(ctx, center, width, height, state, mode) {
  const scale = Math.min(440, height * 1.85);
  const bodyY = height * .265 - state.body * scale;
  const wheelY = height * .615 - state.wheel * scale;
  const ground = height * .90;
  const groundY = ground - roadAt(time, options) * scale;
  const massWidth = Math.min(width * .72, 105);
  const springX = center - massWidth * .23;
  const damperX = center + massWidth * .23;
  const color = ink[mode];
  const top = bodyY + 11;
  const bottom = wheelY - 10;

  if (mode === "coil") {
    spring(ctx, springX, top, bottom, color);
  } else {
    const middle = (top + bottom) / 2;
    stroke(ctx, [[springX, top], [springX, middle - 9]], color);
    stroke(ctx, [[springX, middle + 9], [springX, bottom]], color);
    ctx.fillStyle = "#d2eee5";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    ctx.roundRect(springX - 7, middle - 9, 14, 18, 4);
    ctx.fill();
    ctx.stroke();
  }
  damper(ctx, damperX, top, bottom, color);
  spring(ctx, center, wheelY + 10, groundY, ink.text);

  for (const [y, label] of [[bodyY, "Body"], [wheelY, "Wheel"]]) {
    ctx.fillStyle = mode === "coil" ? "#e7edf8" : "#e3f2eb";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.45;
    ctx.beginPath();
    ctx.roundRect(center - massWidth / 2, y - 11, massWidth, 22, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#273b42";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.fillText(label, center, y);
  }

  const road = Array.from({ length: 51 }, (_, i) => {
    const offset = (i / 50 - .5) * width * .87;
    const localTime = time + offset / (width * .62) * options.duration;
    return [center + offset, ground - roadAt(localTime, options) * scale];
  });
  stroke(ctx, road, "#597478", 1.7);
}

function drawMotion() {
  const width = motionCanvas.clientWidth;
  const height = motionCanvas.clientHeight;
  const ctx = sizeCanvas(motionCanvas, width, height, resolution());
  ctx.fillStyle = "#f4f8f6";
  ctx.fillRect(0, 0, width, height);
  for (let y = 16; y < height; y += 23) stroke(ctx, [[0, y], [width, y]], "#e3eeeb", 1);
  stroke(ctx, [[width / 2, 10], [width / 2, height - 10]], "#cbdad6", 1);
  const index = Math.min(series.coil.body.length - 1, Math.round(time / step));
  for (const [indexOnCanvas, mode] of ["coil", "air"].entries()) {
    const state = { body: series[mode].body[index], wheel: series[mode].wheel[index] };
    drawVehicle(ctx, width * (indexOnCanvas ? .75 : .25), width * .5, height, state, mode);
  }
  coilReading.textContent = `${(series.coil.body[index] * 1000).toFixed(1)} mm`;
  airReading.textContent = `${(series.air.body[index] * 1000).toFixed(1)} mm`;
}

function tickSpacing(span) {
  const increment = span / 4;
  const multiple = 10 ** Math.floor(Math.log10(increment));
  return ([1, 2, 2.5, 5, 10].find((value) => value >= increment / multiple) || 10) * multiple;
}

let plotGeometry;

function buildPlot() {
  const signal = signalSelect.value;
  const horizon = Number(horizonSelect.value);
  const channel = channels[signal];
  const width = plotCanvas.clientWidth;
  const height = plotCanvas.clientHeight;
  const ratio = resolution();
  const ctx = sizeCanvas(plotLayer, width, height, ratio);
  const margins = { top: 25, right: 14, bottom: 29, left: 42 };
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;
  const lastIndex = Math.round(horizon / step);
  const modes = linearToggle.checked ? ["coil", "air", "linear"] : ["coil", "air"];
  const showRoad = signal === "body";
  let low = 0;
  let high = showRoad ? options.height * channel.scale : 0;
  for (const mode of modes) {
    const values = series[mode][signal];
    for (let i = 0; i <= lastIndex; i += 1) {
      low = Math.min(low, values[i] * channel.scale);
      high = Math.max(high, values[i] * channel.scale);
    }
  }
  const yStep = tickSpacing(Math.max(high - low, .001));
  const yMin = Math.floor(low / yStep) * yStep;
  const yMax = Math.ceil(high / yStep) * yStep;
  const x = (t) => margins.left + t / horizon * chartWidth;
  const y = (v) => margins.top + (yMax - v) / (yMax - yMin) * chartHeight;

  ctx.fillStyle = "#eaf1ee";
  ctx.fillRect(x(0), margins.top, x(options.duration) - x(0), chartHeight);
  ctx.font = "12px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillStyle = ink.text;
  ctx.textAlign = "right";
  for (let value = yMin; value <= yMax + 1e-9; value += yStep) {
    stroke(ctx, [[x(0), y(value)], [x(horizon), y(value)]], Math.abs(value) < 1e-9 ? "#879b9b" : "#dfe8e5", 1);
    ctx.fillText(String(Number(value.toFixed(3))), x(0) - 7, y(value));
  }
  ctx.textAlign = "center";
  const divisions = horizon === 3.5 ? (width < 380 ? 3 : 7) : 4;
  for (let i = 0; i <= divisions; i += 1) {
    const t = i / divisions * horizon;
    stroke(ctx, [[x(t), margins.top], [x(t), height - margins.bottom]], "#e2ebe8", 1);
    ctx.fillText(Number(t.toFixed(2)), x(t), height - 13);
  }
  ctx.textAlign = "left";
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.fillText(`${channel.label} (${channel.unit})`, x(0), 10);
  ctx.textAlign = "right";
  ctx.fillText("Time (s)", x(horizon), 10);

  if (signal === "tireLoad") {
    stroke(ctx, [[x(0), y(roadLoad * channel.scale)], [x(horizon), y(roadLoad * channel.scale)]], "#a0b1ad", 1, [2, 4]);
  }
  const stride = Math.max(1, Math.floor(lastIndex / Math.max(chartWidth * 1.5, 1)));
  if (showRoad) {
    const road = [];
    for (let i = 0; i <= lastIndex; i += stride) road.push([x(i * step), y(roadAt(i * step, options) * channel.scale)]);
    stroke(ctx, road, ink.road, 1.5, [2, 4]);
  }
  const dash = { coil: [7, 4], air: [], linear: [1, 4] };
  for (const mode of modes) {
    const coordinates = [];
    for (let i = 0; i <= lastIndex; i += stride) {
      coordinates.push([x(i * step), y(series[mode][signal][i] * channel.scale)]);
    }
    coordinates.push([x(horizon), y(series[mode][signal][lastIndex] * channel.scale)]);
    stroke(ctx, coordinates, ink[mode], 2.15, dash[mode]);
  }
  find("[data-road-key]").hidden = !showRoad;
  find("[data-linear-key]").hidden = !linearToggle.checked;
  plotCanvas.setAttribute("aria-label", `${channel.label} in ${channel.unit} over ${horizon} s. Coil and air traces. The table below shows full-run metrics.`);
  plotGeometry = { width, height, ratio, x, margins };
}

function draw() {
  drawMotion();
  const { width, height, ratio, x, margins } = plotGeometry;
  const ctx = sizeCanvas(plotCanvas, width, height, ratio);
  ctx.drawImage(plotLayer, 0, 0, width, height);
  stroke(ctx, [[x(time), margins.top], [x(time), height - margins.bottom]], "#4a6467", 1.1);
  clock.value = `${time.toFixed(2)} s`;
  timeline.value = String(time);
  timeline.setAttribute("aria-valuetext", `${time.toFixed(2)} seconds`);
}

function stop() {
  cancelAnimationFrame(playback);
  playback = 0;
  lastFrame = null;
  playButton.textContent = "Play";
}

function play(timestamp) {
  if (lastFrame !== null) time = Math.min(Number(horizonSelect.value), time + (timestamp - lastFrame) / 1000);
  lastFrame = timestamp;
  draw();
  if (time >= Number(horizonSelect.value)) stop();
  else playback = requestAnimationFrame(play);
}

function rebuild() {
  rebuildPending = false;
  options = {
    height: Number(fields.height.value) / 1000,
    duration: Number(fields.duration.value),
    damping: Number(fields.damping.value),
    volume: Number(fields.volume.value) / 1000,
  };
  series = { coil: simulate(options, "coil"), air: simulate(options, "air"), linear: simulate(options, "linear") };
  renderOptions();
  renderMetrics();
  buildPlot();
  draw();
}

function queueRebuild() {
  stop();
  if (!rebuildPending) {
    rebuildPending = true;
    requestAnimationFrame(rebuild);
  }
}

function exportTrace() {
  const keys = ["body", "wheel", "acceleration", "compression", "tireLoad"];
  const labels = ["body_m", "wheel_m", "body_accel_m_s2", "compression_m", "total_tire_load_n"];
  const modes = linearToggle.checked ? ["coil", "air", "linear"] : ["coil", "air"];
  const headings = ["time_s", "road_m", ...modes.flatMap((model) => labels.map((label) => `${model}_${label}`))];
  const csv = [headings.join(",")];
  for (let i = 0; i < series.coil.body.length; i += 1) {
    const t = i * step;
    const values = modes.flatMap((model) => keys.map((key) => series[model][key][i].toPrecision(10)));
    csv.push([t.toFixed(4), roadAt(t, options).toPrecision(10), ...values].join(","));
  }
  const url = URL.createObjectURL(new Blob([csv.join("\n"), "\n"], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "quarter-car-bump-trace.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

for (const field of Object.values(fields)) field.addEventListener("input", queueRebuild);
find("[data-match]").addEventListener("click", () => {
  fields.volume.value = String(matchedVolume * 1000);
  linearToggle.checked = true;
  queueRebuild();
});
find("[data-reset]").addEventListener("click", () => {
  for (const field of Object.values(fields)) field.value = field.defaultValue;
  signalSelect.value = "body";
  horizonSelect.value = "3.5";
  timeline.max = "3.5";
  time = 0;
  linearToggle.checked = false;
  queueRebuild();
});
linearToggle.addEventListener("change", () => { renderMetrics(); buildPlot(); draw(); });
signalSelect.addEventListener("change", () => { buildPlot(); draw(); });
horizonSelect.addEventListener("change", () => {
  stop();
  timeline.max = horizonSelect.value;
  time = Math.min(time, Number(timeline.max));
  buildPlot();
  draw();
});
timeline.addEventListener("input", () => { stop(); time = Number(timeline.value); draw(); });
playButton.addEventListener("click", () => {
  if (playback) {
    stop();
  } else {
    if (time >= Number(timeline.max)) time = 0;
    playButton.textContent = "Pause";
    playback = requestAnimationFrame(play);
  }
});
find("[data-export]").addEventListener("click", exportTrace);
lab.hidden = false;
rebuild();
new ResizeObserver(() => { buildPlot(); draw(); }).observe(plotCanvas);
