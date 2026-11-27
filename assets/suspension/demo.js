import { airRate, baseline, endTime, roadAt, roadLoad, simulate, sineResponse, step, summarize, volumeAtRate } from "./model.js";

const root = document.querySelector("[data-quarter-car]");
const find = (selector) => root.querySelector(selector);
const lab = find("[data-lab]");
const spectrum = find("[data-spectrum]");
const motionCanvas = find("[data-motion]");
const plotCanvas = find("[data-plot]");
const timeline = find("[data-time]");
const playButton = find("[data-play]");
const signalSelect = find("[data-signal]");
const horizonSelect = find("[data-horizon]");
const caseSelect = find("[data-case]");
const linearToggle = find("[data-linear]");
const contact = find("[data-contact]");
const frequencyInput = find("[data-frequency]");
const frequencyOutput = find("[data-frequency-value]");
const spectrumContact = find("[data-spectrum-contact]");
const frequencyJumps = root.querySelectorAll("[data-jump]");
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
const metrics = {
  bodyPeak: [1000, 2, "mm"],
  accelPeak: [1, 2, "m/s²"],
  accelRMS: [1, 3, "m/s²"],
  travel: [1000, 2, "mm"],
  minLoad: [.001, 3, "kN"],
  settling: [1, 2, "s"],
};
const sineMetrics = { body: [1000, 2, "mm"], acceleration: [1, 2, "m/s²"], tire: [.001, 3, "kN"] };
const spectra = {
  body: { title: "Body displacement (mm)", scale: 1000 },
  tire: { title: "Tire-load variation (kN)", scale: .001 },
};
const frequencyRange = { min: .5, max: 14, ticks: [.5, 1, 2, 4, 8, 14] };
const setupCases = { baseline: {}, soft: { volume: .010 }, damped: { damping: 1600 }, large: { height: .080 } };
const inputFactors = { height: .001, duration: 1, damping: 1, coilRate: 1000, volume: .001 };

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
  find('[data-value="coilRate"]').value = `${(options.coilRate / 1000).toFixed(2)} kN/m`;
  const liters = options.volume * 1000;
  const exactMatch = Math.abs(options.volume - volumeAtRate(options.coilRate)) < 1e-9;
  find('[data-value="volume"]').value = `${liters.toFixed(exactMatch ? 3 : 2)} L`;
  find("[data-rate]").textContent = `Air tangent rate ${(airRate(options.volume) / 1000).toFixed(2)} kN/m`;
}

function formatMetric(value, [scale, precision, unit], signed = false) {
  const scaled = value * scale;
  const magnitude = Math.abs(scaled).toFixed(precision);
  const sign = Number(magnitude) === 0 ? "" : scaled < 0 ? "−" : signed ? "+" : "";
  return `${sign}${magnitude} ${unit}`;
}

function renderMetrics() {
  const coil = summarize(series.coil, options);
  const air = summarize(series.air, options);
  for (const [key, format] of Object.entries(metrics)) {
    const coilValue = coil[key];
    const airValue = air[key];
    const limit = `> ${(endTime - options.duration).toFixed(2)} s`;
    find(`[data-coil="${key}"]`).textContent = coilValue === null ? limit : formatMetric(coilValue, format);
    find(`[data-air="${key}"]`).textContent = airValue === null ? limit : formatMetric(airValue, format);
    find(`[data-diff="${key}"]`).textContent = coilValue === null || airValue === null
      ? "—" : formatMetric(airValue - coilValue, format, true);
  }
  const failed = [["coil", coil], ["air", air]].filter(([, result]) => result.minLoad <= 0).map(([name]) => name);
  if (linearToggle.checked && summarize(series.linear, options).minLoad <= 0) failed.push("linear air");
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

function drawSpectrum(canvas, signal, frequency, selected, sweep) {
  const { title, scale } = spectra[signal];
  const { min, max, ticks } = frequencyRange;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ctx = sizeCanvas(canvas, width, height, resolution());
  const left = 38;
  const right = width - 17;
  const top = 29;
  const bottom = height - 43;
  const x = (hz) => left + Math.log(hz / min) / Math.log(max / min) * (right - left);
  const reference = signal === "tire" ? roadLoad * scale : 0;
  const largest = Math.max(reference, ...sweep.map((row) => Math.max(row.coil[signal], row.air[signal]) * scale));
  const yStep = tickSpacing(largest);
  const peak = Math.ceil(largest / yStep) * yStep;
  const y = (amplitude) => bottom - (amplitude / peak) * (bottom - top);

  ctx.font = "12px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "right";
  ctx.fillStyle = ink.text;
  for (let a = 0; a <= peak + 1e-9; a += yStep) {
    stroke(ctx, [[left, y(a)], [right, y(a)]], a === 0 ? "#879b9b" : "#e0eae6", 1);
    ctx.fillText(Number(a.toFixed(2)), left - 6, y(a));
  }
  ctx.textAlign = "center";
  for (const hz of ticks) {
    stroke(ctx, [[x(hz), top], [x(hz), bottom]], "#e2ebe8", 1);
    ctx.fillText(hz, x(hz), bottom + 13);
  }
  ctx.fillText("Road frequency (Hz)", (left + right) / 2, height - 9);
  ctx.font = "600 13px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(title, left, 12);
  if (reference > 0) stroke(ctx, [[left, y(reference)], [right, y(reference)]], ink.road, 1.4, [2, 4]);

  for (const mode of ["coil", "air"]) {
    const coordinates = sweep.map((row) => [x(row.frequency), y(row[mode][signal] * scale)]);
    stroke(ctx, coordinates, ink[mode], 2.2, mode === "coil" ? [7, 4] : []);
  }
  const marker = x(frequency);
  stroke(ctx, [[marker, top], [marker, bottom]], "#879b9b", 1);
  for (const mode of ["coil", "air"]) {
    ctx.beginPath();
    ctx.arc(marker, y(selected[mode][signal] * scale), 4, 0, 2 * Math.PI);
    ctx.fillStyle = ink[mode];
    ctx.fill();
  }
}

let sineSweep;

function sampleSpectrum() {
  const { min, max } = frequencyRange;
  sineSweep = Array.from({ length: 241 }, (_, index) => {
    const frequency = min * (max / min) ** (index / 240);
    return { frequency, coil: sineResponse(frequency, options, "coil"), air: sineResponse(frequency, options, "air") };
  });
}

function renderSpectrum() {
  const frequency = frequencyInput.valueAsNumber;
  const selected = { coil: sineResponse(frequency, options, "coil"), air: sineResponse(frequency, options, "air") };
  frequencyOutput.value = `${frequency.toFixed(2)} Hz`;
  frequencyInput.setAttribute("aria-valuetext", `${frequency.toFixed(2)} hertz`);
  for (const button of frequencyJumps) button.setAttribute("aria-pressed", String(Number(button.dataset.jump) === frequency));
  for (const [mode, response] of Object.entries(selected)) {
    for (const [key, format] of Object.entries(sineMetrics)) {
      find(`[data-sine-${mode}="${key}"]`).textContent = formatMetric(response[key], format);
    }
  }
  for (const signal of Object.keys(spectra)) {
    drawSpectrum(find(`[data-spectrum-plot="${signal}"]`), signal, frequency, selected, sineSweep);
  }
  const coilLoad = roadLoad - selected.coil.tire;
  const airLoad = roadLoad - selected.air.tire;
  const loadFormat = [.001, 3, "kN"];
  const invalid = coilLoad <= 0 || airLoad <= 0;
  spectrumContact.dataset.invalid = String(invalid);
  spectrumContact.textContent = invalid
    ? "The predicted load reaches zero or below. The linear tire contact assumption breaks down."
    : `Predicted minimum tire load is ${formatMetric(coilLoad, loadFormat)} for the coil and ${formatMetric(airLoad, loadFormat)} for linear air.`;
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
  const ticks = horizon === 3.5
    ? (width < 380 ? [0, 1, 2, 3.5] : [0, .5, 1, 1.5, 2, 2.5, 3, 3.5])
    : [0, horizon / 4, horizon / 2, 3 * horizon / 4, horizon];
  for (const t of ticks) {
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
  options = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.valueAsNumber * inputFactors[key]]));
  series = { coil: simulate(options, "coil"), air: simulate(options, "air"), linear: simulate(options, "linear") };
  renderOptions();
  renderMetrics();
  sampleSpectrum();
  renderSpectrum();
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
  link.download = `quarter-car-${fields.height.value}mm-${Math.round(options.duration * 1000)}ms.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function loadCase(name) {
  const settings = { ...baseline, ...setupCases[name] };
  for (const [key, field] of Object.entries(fields)) field.value = String(settings[key] / inputFactors[key]);
  signalSelect.value = name === "large" ? "tireLoad" : "body";
  horizonSelect.value = name === "large" ? "1" : "3.5";
  timeline.max = horizonSelect.value;
  time = 0;
  linearToggle.checked = false;
  queueRebuild();
}

for (const field of Object.values(fields)) {
  field.addEventListener("input", () => {
    caseSelect.value = "custom";
    queueRebuild();
  });
}
caseSelect.addEventListener("change", () => loadCase(caseSelect.value));
find("[data-match]").addEventListener("click", () => {
  fields.volume.value = String(1000 * volumeAtRate(fields.coilRate.valueAsNumber * 1000));
  caseSelect.value = "custom";
  linearToggle.checked = true;
  queueRebuild();
});
find("[data-reset]").addEventListener("click", () => { caseSelect.value = "baseline"; loadCase("baseline"); });
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
plotCanvas.addEventListener("click", (event) => {
  const { width, margins } = plotGeometry;
  const rect = plotCanvas.getBoundingClientRect();
  const fraction = (event.clientX - rect.left - margins.left) / (width - margins.left - margins.right);
  if (fraction < 0 || fraction > 1) return;
  stop();
  time = fraction * Number(horizonSelect.value);
  draw();
});
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
frequencyInput.addEventListener("input", renderSpectrum);
for (const button of frequencyJumps) {
  button.addEventListener("click", () => { frequencyInput.value = button.dataset.jump; renderSpectrum(); });
}
lab.hidden = false;
spectrum.hidden = false;
rebuild();
new ResizeObserver(() => { buildPlot(); draw(); }).observe(plotCanvas);
const resizeSpectrum = new ResizeObserver(renderSpectrum);
for (const canvas of root.querySelectorAll("[data-spectrum-plot]")) resizeSpectrum.observe(canvas);
