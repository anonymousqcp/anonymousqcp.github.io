"use strict";
// Only presentation data is loaded here. Editing and publishing stay private.
(() => {
  const entries = new Map();
  const mobile = matchMedia("(max-width: 600px)");
  const properties = { x: "--copy-x", y: "--copy-y", fontSize: "font-size", width: "width", lineHeight: "line-height", align: "text-align", weight: "font-weight" };
  let documentData = { version: 1, elements: {} };
  const textOf = element => element.innerText || element.textContent;
  const add = (key, element, label) => {
    if (!element) return;
    element.dataset.copyKey = key;
    entries.set(key, { key, element, label, html: element.innerHTML, text: textOf(element), style: element.getAttribute("style") || "" });
  };
  const group = (prefix, selector, label) => document.querySelectorAll(selector).forEach((element, i) => add(`${prefix}.${i + 1}`, element, `${label} ${i + 1}`));
  const direct = (key, selector, label) => {
    const parent = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!parent) return;
    const nodes = [...parent.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    nodes.forEach((node, i) => {
      const span = document.createElement("span");
      node.replaceWith(span); span.append(node); add(`${key}.${i + 1}`, span, label);
    });
  };
  direct("header.logo", ".masthead .wordmark", "상단 로고");
  direct("header.venue", ".submission", "학회 이름");
  add("header.anonymous", document.querySelector(".submission span:last-child"), "익명 제출 문구");
  group("header.nav", ".masthead nav a", "상단 메뉴");
  group("hero", ".hero .eyebrow, .hero h1, .hero-subtitle, .hero-description", "첫 화면");
  direct("hero.link", ".primary-link", "첫 화면 링크");
  ["comparisons", "quality", "idea"].forEach(id => group(`${id}.heading`, `#${id} .section-heading .eyebrow, #${id} .section-heading h2, #${id} .section-heading .section-intro`, `${id} 제목`));
  add("row.base", document.querySelector(".base-row-label"), "Base 행 이름");
  direct("row.qcp", ".qcp-row-label", "QCP 행 이름");
  add("row.ours", document.querySelector(".qcp-row-label small"), "Ours 행 이름");
  group("filters", ".filter-list button", "품질 필터");
  group("gallery.footer", ".gallery-footer p:not(#gallery-status)", "갤러리 안내");
  document.querySelectorAll(".comparison-card").forEach(card => {
    const id = card.getAttribute("aria-labelledby").replace(/-title$/, "");
    const root = `card.${id}`;
    ["h3", ".task-label", ".quality-tag", ".delta", ".delta-label", ".card-caption", ".clip-note"].forEach(selector => add(`${root}.${selector.replace(/[^a-z0-9-]/g, "")}`, card.querySelector(selector), `${id} · ${selector.replace(".", "")}`));
    [".video-identity", ".video-metric strong", ".video-metric .unit", ".outcome", ".result-kicker", ".result-title", ".result-unit", ".result-detail"].forEach(selector => card.querySelectorAll(selector).forEach((element, i) => add(`${root}.${selector.replace(/[^a-z0-9-]/g, "")}.${i + 1}`, element, `${id} · ${i === 0 ? "Base" : "QCP"} ${selector}`)));
    card.querySelectorAll(".metric-label").forEach((element, i) => direct(`${root}.metric.${i + 1}`, element, `${id} · 지표 이름`));
  });
  group("quality.count", ".quality-count", "품질 개수");
  document.querySelectorAll(".quality-grid article").forEach((article, i) => ["h3", "p", ".metric-definition", ".quality-number"].forEach(selector => add(`quality.${i + 1}.${selector.replace(".", "")}`, article.querySelector(selector), `품질 ${i + 1} · ${selector}`)));
  group("quality.note", ".section-note", "품질 설명");
  group("idea.copy", ".idea-copy p", "방법 설명");
  add("idea.figure-label", document.querySelector("figcaption span"), "그림 제목");
  direct("idea.figure-caption", "figcaption", "그림 설명");
  group("footer.link", ".footer a", "하단 링크");
  direct("footer.venue", ".footer p", "하단 학회 이름");
  add("footer.note", document.querySelector(".footer p span:last-child"), "하단 안내");

  const safeLayout = input => {
    const output = {};
    if (!input || typeof input !== "object") return output;
    Object.entries({ x: [-1500, 1500], y: [-1500, 1500], fontSize: [8, 160], width: [20, 1400], lineHeight: [.7, 3] }).forEach(([key, [min, max]]) => {
      if (Number.isFinite(input[key]) && input[key] >= min && input[key] <= max) output[key] = input[key];
    });
    if (["left", "center", "right"].includes(input.align)) output.align = input.align;
    if (["400", "700"].includes(input.weight)) output.weight = input.weight;
    return output;
  };
  const applyEntry = (entry, override) => {
    const element = entry.element;
    if (typeof override?.text === "string") {
      if (textOf(element) !== override.text) element.textContent = override.text;
      element.style.whiteSpace = "pre-wrap";
    } else if (!element.isContentEditable) {
      if (element.innerHTML !== entry.html) element.innerHTML = entry.html;
      element.style.removeProperty("white-space");
    }
    const layout = safeLayout(override?.[mobile.matches ? "mobile" : "desktop"]);
    Object.values(properties).forEach(property => element.style.removeProperty(property));
    element.style.removeProperty("translate"); element.style.removeProperty("display");
    if (Object.keys(layout).length) {
      if (getComputedStyle(element).display === "inline") element.style.display = "inline-block";
      Object.entries(layout).forEach(([key, value]) => element.style.setProperty(properties[key], String(value) + (["x", "y", "fontSize", "width"].includes(key) ? "px" : "")));
      element.style.translate = "var(--copy-x, 0px) var(--copy-y, 0px)";
    }
  };
  const apply = data => {
    documentData = data && data.version === 1 && data.elements && typeof data.elements === "object" ? data : { version: 1, elements: {} };
    entries.forEach(entry => applyEntry(entry, documentData.elements[entry.key]));
    window.dispatchEvent(new Event("resize"));
  };
  const ready = fetch("assets/content.json", { cache: "no-cache" }).then(response => response.ok ? response.json() : Promise.reject(new Error("Content unavailable"))).then(apply).catch(() => apply(documentData));
  mobile.addEventListener("change", () => apply(documentData));
  window.QCP_LAYOUT = { entries, apply, safeLayout, ready, get data() { return documentData; } };
})();
