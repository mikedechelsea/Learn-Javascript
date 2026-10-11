// ── Mobile navigation ─────────────────────────────────────────
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav    = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.textContent = isOpen ? "✕" : "☰";
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close menu when a nav link is tapped
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.textContent = "☰";
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ── Active nav link ───────────────────────────────────────────
function setActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#primary-nav a").forEach(link => {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

// ── Footer dates ──────────────────────────────────────────────
function setFooterDates() {
  const yearEl = document.getElementById("currentyear");
  const modEl  = document.getElementById("lastModified");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl)  modEl.textContent  = `Last Modified: ${document.lastModified}`;
}

// ── Tiny JavaScript syntax highlighter ─────────────────────────
// Shared by concepts.js so every "real code" and "simple code" panel
// gets the same light-touch coloring: strings, comments, keywords,
// numbers. Not a full parser — just enough to make the examples
// easier to read for someone meeting this syntax for the first time.
function highlightJS(code) {
  const escapeMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
  const esc = s => s.replace(/[&<>]/g, c => escapeMap[c]);

  const pattern = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(function|const|let|var|return|if|else|for|while|true|false|null|undefined|new|try|catch|throw|typeof|this|break|continue|switch|case|default)\b|\b(\d+(?:\.\d+)?)\b/gm;

  let result = "";
  let lastIndex = 0;
  let m;
  while ((m = pattern.exec(code))) {
    result += esc(code.slice(lastIndex, m.index));
    if (m[1]) result += '<span class="tok-comment">' + esc(m[1]) + "</span>";
    else if (m[2]) result += '<span class="tok-string">' + esc(m[2]) + "</span>";
    else if (m[3]) result += '<span class="tok-keyword">' + esc(m[3]) + "</span>";
    else if (m[4]) result += '<span class="tok-number">' + esc(m[4]) + "</span>";
    lastIndex = pattern.lastIndex;
  }
  result += esc(code.slice(lastIndex));
  return result;
}

// ── Apply highlighting to any static <pre data-code> on the page ──
// (used by the hero editor mock on index.html)
function highlightStaticBlocks() {
  document.querySelectorAll("pre[data-code] code").forEach(el => {
    el.innerHTML = highlightJS(el.textContent);
  });
}

initNav();
setActiveNav();
setFooterDates();
highlightStaticBlocks();
