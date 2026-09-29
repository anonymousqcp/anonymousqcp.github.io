"use strict";
(() => {
  const data = window.QCP_COMPARISONS || [];
  const track = document.getElementById("comparison-track");
  const filterList = document.querySelector(".filter-list");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  const status = document.getElementById("gallery-status");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const states = [];
  let currentFilter = "all";
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const pause = state => {
    state.playing = false;
    state.playRequest = (state.playRequest || 0) + 1;
    state.videos.forEach(video => video.pause());
    state.play.textContent = "▶ Play pair";
    state.play.setAttribute("aria-label", `Play Base and QCP: ${state.item.task}`);
    state.play.setAttribute("aria-pressed", "false");
  };
  const ensureLoaded = state => {
    state.videos.forEach(video => {
      if (!video.getAttribute("src")) video.src = video.dataset.src;
    });
  };
  const attachResult = (frame, video, item, ours) => {
    if (!item.endResult) return;
    const result = item.endResult[ours ? "ours" : "base"];
    const overlay = make("div", "result-overlay");
    overlay.setAttribute("aria-hidden", "true");
    const content = make("div", `result-content${result.unit ? " result-content--metric" : " result-content--outcome"}`);
    if (result.kicker) content.append(make("span", "result-kicker", result.kicker));
    content.append(make("strong", "result-title", result.title));
    if (result.unit) content.append(make("span", "result-unit", result.unit));
    content.append(make("span", "result-detail", result.detail)); overlay.append(content); frame.append(overlay);
    const update = () => {
      const shown = video.currentTime >= item.endResult.at - .04;
      frame.classList.toggle("is-result", shown); overlay.setAttribute("aria-hidden", String(!shown));
    };
    video.addEventListener("timeupdate", update); video.addEventListener("seeked", update); video.addEventListener("ended", update);
  };
  const ready = video => video.readyState >= 3 ? Promise.resolve() : new Promise((resolve, reject) => {
    const timer = setTimeout(() => { cleanup(); reject(new Error("Video loading timed out")); }, 15000);
    const loaded = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("Video could not load")); };
    const cleanup = () => { clearTimeout(timer); video.removeEventListener("canplay", loaded); video.removeEventListener("error", failed); };
    video.addEventListener("canplay", loaded, { once: true }); video.addEventListener("error", failed, { once: true });
  });
  const playPair = async state => {
    states.filter(other => other !== state).forEach(pause);
    const resumeAt = Math.min(...state.videos.map(video => video.currentTime));
    state.videos.forEach(video => { video.preload = "auto"; });
    ensureLoaded(state);
    const ended = state.videos.some(video => video.ended || (video.duration && video.currentTime >= video.duration - .2));
    if (ended) state.videos.forEach(video => { video.currentTime = 0; });
    state.videos.forEach(video => { if (video.readyState < 3) video.load(); });
    state.playing = true;
    state.play.textContent = "Ⅱ Pause pair";
    state.play.setAttribute("aria-label", `Pause Base and QCP: ${state.item.task}`);
    state.play.setAttribute("aria-pressed", "true");
    const request = state.playRequest = (state.playRequest || 0) + 1;
    const loaded = await Promise.allSettled(state.videos.map(ready));
    if (!state.playing || state.playRequest !== request) return;
    if (loaded.some(result => result.status === "rejected")) { pause(state); state.note.textContent = "Video could not load. Please retry playback."; return; }
    const targetTime = ended ? 0 : resumeAt;
    state.videos.forEach(video => { video.currentTime = targetTime; });
    const results = await Promise.allSettled(state.videos.map(video => video.play()));
    if (state.playRequest !== request) { if (!state.playing) state.videos.forEach(video => video.pause()); return; }
    if (results.some(result => result.status === "rejected")) {
      pause(state);
      state.note.textContent = "Playback could not start. Try Play pair again, or open each video directly.";
    }
  };
  data.forEach((item, index) => {
    const card = make("article", "comparison-card");
    card.dataset.quality = item.quality;
    card.setAttribute("aria-labelledby", `${item.id}-title`);
    const heading = make("div", "card-heading");
    const titles = make("div");
    const title = make("h3", "", item.title); title.id = `${item.id}-title`;
    titles.append(title, make("p", "task-label", item.task));
    heading.append(titles, make("span", "quality-tag", item.quality));
    card.append(heading);
    const state = { card, item, videos: [], playing: false };
    [false, true].forEach(ours => {
      const cell = make("div", `video-cell${ours ? " ours-cell" : ""}`);
      const frame = make("div", "video-frame");
      const video = make("video");
      video.dataset.src = ours ? item.ours : item.base;
      video.poster = ours ? item.oursPoster : item.basePoster;
      video.preload = "none";
      video.muted = true; video.playsInline = true;
      video.setAttribute("aria-label", `${item.task}, ${ours ? "QCP (ours)" : "Base"}`);
      const fallback = make("a", "", "Open comparison video"); fallback.href = video.dataset.src;
      video.append(fallback);
      frame.append(video, make("span", `video-identity${ours ? " ours" : ""}`, ours ? "QCP / Ours" : "Base"));
      attachResult(frame, video, item, ours);
      const metrics = make("div", "video-metric");
      const score = make("span"); score.append(make("strong", "", ours ? item.oursValue : item.baseValue), make("span", "unit", item.unit));
      const metricLabel = make("span", "metric-label", item.metric);
      if (item.outcomes) metricLabel.append(make("small", `outcome ${item.outcomes[ours ? 1 : 0] ? "success" : "failure"}`, item.outcomes[ours ? 1 : 0] ? "Completed" : "Not completed"));
      metrics.append(metricLabel, score);
      cell.append(frame, metrics); card.append(cell); state.videos.push(video);
      video.addEventListener("error", () => {
        if (!frame.querySelector(".video-error")) {
          const error = make("div", "video-error");
          const link = make("a", "", "Open video directly"); link.href = video.dataset.src;
          error.append(link); frame.append(error);
        }
        pause(state);
      });
      video.addEventListener("ended", () => {
        if (state.videos.every(v => v.ended || (Number.isFinite(v.duration) && v.currentTime >= v.duration - .1))) pause(state);
      });
    });
    const summary = make("div", "card-summary");
    const play = make("button", "pair-play", "▶ Play pair"); play.type = "button";
    play.setAttribute("aria-label", `Play Base and QCP: ${item.task}`); play.setAttribute("aria-pressed", "false");
    state.play = play;
    play.addEventListener("click", () => state.playing ? pause(state) : playPair(state));
    summary.append(make("span", "delta", item.delta), make("span", "delta-label", item.deltaLabel), play);
    state.note = make("p", "clip-note", item.note);
    const timeline = make("div", "pair-timeline");
    const seek = make("input", "pair-seek"); seek.type = "range"; seek.min = "0"; seek.max = "1000"; seek.value = "0";
    seek.setAttribute("aria-label", `Seek both videos: ${item.task}`);
    const clock = make("span", "pair-clock", "0:00");
    state.seek = seek; state.clock = clock;
    seek.addEventListener("input", () => {
      ensureLoaded(state);
      const duration = Math.max(...state.videos.map(v => v.duration || 0));
      const time = Number(seek.value) / 1000 * duration;
      state.videos.forEach(v => { if (Number.isFinite(v.duration)) v.currentTime = Math.min(time, Math.max(0, v.duration - .01)); });
    });
    const expand = make("button", "expand-pair", "↗"); expand.type = "button";
    expand.setAttribute("aria-label", `Enlarge comparison: ${item.task}`);
    expand.addEventListener("click", () => openExpanded(state));
    timeline.append(seek, clock, expand);
    card.append(summary, timeline, make("p", "card-caption", item.description), state.note);
    track.append(card); states.push(state);
  });
  const dialog = make("dialog", "expanded-comparison");
  document.body.append(dialog);
  const openExpanded = state => {
    const at = state.videos[0].currentTime || 0;
    states.forEach(pause); dialog.replaceChildren();
    const close = make("button", "dialog-close", "Close ×"); close.addEventListener("click", () => dialog.close());
    const heading = make("h2", "", state.card.querySelector(".task-label").textContent); heading.id = "expanded-title"; dialog.setAttribute("aria-labelledby", heading.id);
    const grid = make("div", "expanded-grid");
    state.videos.forEach((original, i) => {
      const block = make("div"); const frame = make("div", "expanded-video-frame"); const v = make("video"); v.src = original.dataset.src; v.poster = original.poster; v.controls = false; v.muted = true; v.playsInline = true;
      v.addEventListener("loadedmetadata", () => { v.currentTime = Math.min(at, v.duration - .05); }, { once: true });
      frame.append(v); attachResult(frame, v, state.item, Boolean(i));
      const originalFrame = state.card.querySelectorAll(".video-frame")[i];
      [".result-kicker", ".result-title", ".result-unit", ".result-detail"].forEach(selector => {
        const source = originalFrame.querySelector(selector), target = frame.querySelector(selector);
        if (source && target) target.textContent = source.textContent;
      });
      block.append(make("h3", "", originalFrame.querySelector(".video-identity").textContent), frame); grid.append(block);
    });
    const start = make("button", "dialog-play", "▶ Play both");
    const timeline = make("input", "pair-seek dialog-seek"); timeline.type = "range"; timeline.min = "0"; timeline.max = "1000"; timeline.value = "0";
    timeline.setAttribute("aria-label", `Seek enlarged comparison: ${state.item.task}`);
    const videos = [...grid.querySelectorAll("video")];
    videos.forEach(v => v.addEventListener("ended", () => { if (videos.every(video => video.ended)) start.textContent = "↻ Replay both"; }));
    videos[0].addEventListener("timeupdate", () => { if (document.activeElement !== timeline && videos[0].duration) timeline.value = String(videos[0].currentTime / videos[0].duration * 1000); });
    timeline.addEventListener("input", () => { const time = Number(timeline.value) / 1000 * (videos[0].duration || 0); videos.forEach(v => { if (Number.isFinite(v.duration)) v.currentTime = Math.min(time, v.duration - .01); }); });
    start.addEventListener("click", async () => {
      if (videos.some(v => !v.paused)) { videos.forEach(v => v.pause()); start.textContent = "▶ Play both"; }
      else {
        const t = videos[0].ended ? 0 : videos[0].currentTime;
        videos.forEach(v => { v.currentTime = t; });
        const results = await Promise.allSettled(videos.map(v => v.play()));
        if (results.some(result => result.status === "rejected")) { videos.forEach(v => v.pause()); start.textContent = "Retry playback"; }
        else start.textContent = "Ⅱ Pause both";
      }
    });
    dialog.append(close, heading, grid, start, timeline, make("p", "", state.card.querySelector(".card-caption").textContent)); dialog.showModal();
  };
  dialog.addEventListener("close", () => { dialog.querySelectorAll("video").forEach(v => v.pause()); dialog.replaceChildren(); });
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  setInterval(() => {
    states.forEach(state => {
      const first = state.videos[0], second = state.videos[1];
      if (state.playing && first.readyState >= 3 && second.readyState >= 3 && !first.ended && !second.ended && Math.abs(first.currentTime - second.currentTime) > .2) second.currentTime = first.currentTime;
      const duration = Math.max(...state.videos.map(v => Number.isFinite(v.duration) ? v.duration : 0));
      const time = Math.max(...state.videos.map(v => v.currentTime));
      if (document.activeElement !== state.seek) state.seek.value = duration ? String(time / duration * 1000) : "0";
      state.clock.textContent = `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;
    });
  }, 250);
  [...new Set(data.map(item => item.quality))].forEach(quality => {
    const button = make("button", "filter", quality);
    button.dataset.filter = quality; button.setAttribute("aria-pressed", "false");
    filterList.append(button);
  });
  const updateControls = () => {
    const canBrowse = track.scrollWidth > track.clientWidth + 3;
    previous.disabled = !canBrowse;
    next.disabled = !canBrowse;
    const count = states.filter(state => !state.card.hidden).length;
    status.textContent = `${String(count).padStart(2, "0")} ${count === 1 ? "comparison" : "comparisons"} · ${currentFilter === "all" ? "All qualities" : currentFilter}`;
    const first = states.find(state => !state.card.hidden);
    if (first) {
      const rows = first.card.querySelectorAll(".video-cell");
      const labels = document.querySelectorAll(".row-labels > span");
      rows.forEach((row, i) => { labels[i].style.top = `${row.offsetTop + row.clientHeight / 2 - labels[i].clientHeight / 2}px`; });
    }
  };
  filterList.addEventListener("click", event => {
    const button = event.target.closest("button[data-filter]"); if (!button) return;
    finishWheelScroll();
    currentFilter = button.dataset.filter;
    filterList.querySelectorAll("button").forEach(b => {
      b.classList.toggle("active", b === button); b.setAttribute("aria-pressed", String(b === button));
    });
    states.forEach(state => {
      state.card.hidden = currentFilter !== "all" && state.item.quality !== currentFilter;
      if (state.card.hidden) pause(state);
    });
    track.scrollLeft = 0; updateControls();
  });
  const step = direction => {
    const first = states.find(state => !state.card.hidden);
    if (!first) return;
    const limit = Math.max(0, track.scrollWidth - track.clientWidth);
    const distance = first.card.offsetWidth + parseFloat(getComputedStyle(track).gap);
    const wraps = direction > 0 ? track.scrollLeft >= limit - 3 : track.scrollLeft <= 3;
    const left = wraps ? (direction > 0 ? 0 : limit) : Math.min(limit, Math.max(0, track.scrollLeft + direction * distance));
    track.scrollTo({ left, behavior: wraps || reducedMotion ? "instant" : "smooth" });
  };
  let wheelEndTimer;
  const finishWheelScroll = () => {
    clearTimeout(wheelEndTimer);
    track.classList.remove("is-wheel-scrolling");
  };
  track.addEventListener("wheel", event => {
    const shiftedWheel = event.shiftKey && event.deltaX === 0;
    const horizontal = shiftedWheel ? event.deltaY : event.deltaX;
    if (event.ctrlKey || !horizontal || (!shiftedWheel && Math.abs(horizontal) <= Math.abs(event.deltaY))) return;
    const limit = Math.max(0, track.scrollWidth - track.clientWidth);
    if (limit <= 3) return;
    event.preventDefault();
    // Keep the gesture continuous, then restore card snapping when it settles.
    track.classList.add("is-wheel-scrolling");
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1;
    let left = Math.max(0, Math.min(limit, track.scrollLeft)) + horizontal * unit;
    if (left > limit) left %= limit;
    else if (left < 0) left = limit - (-left % limit);
    track.scrollTo({ left, behavior: "instant" });
    clearTimeout(wheelEndTimer);
    wheelEndTimer = setTimeout(finishWheelScroll, 160);
  }, { passive: false });
  previous.addEventListener("click", () => { finishWheelScroll(); step(-1); });
  next.addEventListener("click", () => { finishWheelScroll(); step(1); });
  track.addEventListener("keydown", event => {
    if (event.target !== track) return;
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) finishWheelScroll();
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); }
    if (event.key === "Home" || event.key === "End") { event.preventDefault(); track.scrollTo({ left: event.key === "Home" ? 0 : track.scrollWidth, behavior: "instant" }); }
  });
  track.addEventListener("scroll", updateControls, { passive: true });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const state = states.find(s => s.card === entry.target);
      if (state && (!entry.isIntersecting || entry.intersectionRatio < .25)) pause(state);
      else if (state) { state.videos.forEach(v => { v.preload = "metadata"; }); ensureLoaded(state); }
    });
  }, { threshold: [0, .25] });
  states.forEach(state => observer.observe(state.card));
  document.addEventListener("visibilitychange", () => { if (document.hidden) states.forEach(pause); });
  new ResizeObserver(updateControls).observe(track);
  document.fonts.ready.then(updateControls);
  updateControls();
})();
