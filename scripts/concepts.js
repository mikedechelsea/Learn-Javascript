// ── Concept data ────────────────────────────────────────────────
// Every "real" snippet below is lifted, unmodified in substance, from
// an actual Google Apps Script report project and its companion
// Cloudflare Worker — not invented for this course. The "simple"
// snippet shows the same idea stripped down to its smallest form.
const concepts = [
  {
    id: "data-types",
    name: "Data Types",
    category: "fundamentals",
    icon: "🔢",
    level: "beginner",
    levelLabel: "Start here",
    what: "A data type tells JavaScript what kind of information a value is — text, a number, a yes/no answer, or nothing at all. The five you'll see constantly are String, Number, Boolean, null, and undefined.",
    source: "4_Auth.gs — authHex_()",
    real: `function authHex_(bytes) {
  let out = '';                       // String — builds up character by character

  for (let i = 0; i < bytes.length; i++) {
    const b = (bytes[i] + 256) % 256; // Number — arithmetic result, 0-255

    // b < 16 is a Boolean — either true or false
    out += (b < 16 ? '0' : '') + b.toString(16);
  }
  return out;
}`,
    simple: `// String
let name = 'Grace';

// Number
let age = 26;

// Boolean
let isStudent = true;

// null — nothing here, on purpose
let middleName = null;

// undefined — JavaScript sets this automatically
let nickname;
console.log(nickname); // -> undefined`
  },
  {
    id: "variables",
    name: "Variables",
    category: "fundamentals",
    icon: "📦",
    level: "beginner",
    levelLabel: "Start here",
    what: "A variable is a named box that holds a value. var is the old way and can be re-declared by accident. let is for values that will change. const is for values that should never be reassigned — use it by default.",
    source: "2e_Menu.gs + 4_Auth.gs",
    real: `// var — the old style, still seen in older code
var REFRESH_HOUR = 2;              // run the refresh at 2am

function authLogin_(accessId, code) {
  // const — set once, never reassigned
  const id  = authNormalizeId_(accessId);
  const row = authFindCode_(id);

  if (digest !== row.digest) {
    // row.failed might be missing — || 0 supplies a default
    const failed = (row.failed || 0) + 1;
  }
}`,
    simple: `const MAX_TRIES = 3;   // never changes

let tries = 0;         // will change
tries = tries + 1;      // allowed — tries is now 1

// MAX_TRIES = 5;       // ERROR — const can't be reassigned`
  },
  {
    id: "operators",
    name: "Operators &amp; Logic",
    category: "fundamentals",
    icon: "⚖️",
    level: "beginner",
    levelLabel: "Start here",
    what: "Operators compare values (===, !==, <, >) and combine conditions (&& for AND, || for OR, ! for NOT). The || operator is also used as a quick default: value || fallback.",
    source: "3_Api.gs — doPost()",
    real: `const secret = PropertiesService.getScriptProperties()
                 .getProperty('SERVICE_SECRET');

// && (AND) and ! (NOT) combined — reject if ANY of these is true:
//   !secret            -> no secret is configured at all
//   !body.secret        -> the request sent no secret
//   body.secret !== secret -> the two secrets don't match
if (!secret || !body.secret || body.secret !== secret) {
  return edgeJson_({ ok: false, note: 'Forbidden.' });
}

if (body.action === 'sendMail') return edgeJson_(edgeSendMail_(body));`,
    simple: `const isAdult  = age >= 18;
const canEnter = hasTicket && isAdult;     // both must be true

const displayName = nickname || 'Guest';   // fallback if nickname is empty

console.log(5 === 5);    // true
console.log(5 === '5');  // false — different types!
console.log(!true);      // false`
  },
  {
    id: "loops",
    name: "Loops",
    category: "control",
    icon: "🔁",
    level: "beginner",
    levelLabel: "Core skill",
    what: "A loop repeats a block of code. A for loop runs a set number of times — great when you need the position (the index). forEach runs a function once per array item — cleaner when you just need each value.",
    source: "4_Auth.gs + 2e_Menu.gs",
    real: `// for loop — step through each byte by its position
for (let i = 0; i < bytes.length; i++) {
  const b = (bytes[i] + 256) % 256;
  out += (b < 16 ? '0' : '') + b.toString(16);
}

// forEach — step through each installed trigger
ScriptApp.getProjectTriggers().forEach(function (trigger) {
  if (handlers.indexOf(trigger.getHandlerFunction()) !== -1) {
    ScriptApp.deleteTrigger(trigger);
  }
});`,
    simple: `const students = ['Grace', 'Temi', 'Chidi'];

for (let i = 0; i < students.length; i++) {
  console.log('Student ' + (i + 1) + ': ' + students[i]);
}

students.forEach(function (name) {
  console.log('Hello, ' + name + '!');
});`
  },
  {
    id: "functions",
    name: "Functions",
    category: "structures",
    icon: "🧩",
    level: "beginner",
    levelLabel: "Core skill",
    what: "A function is a named set of instructions you write once and run whenever you need it. It can take inputs (parameters) and send a result back out (return).",
    source: "4_Auth.gs",
    real: `function authNormalizeId_(id) {
  return String(id || '').trim().toUpperCase().replace(/\\s+/g, '-');
}

function authSignToken_(accessId) {
  const expires = Date.now() + EDGE.auth.sessionHours * 3600 * 1000;
  const payload = authNormalizeId_(accessId) + '.' + expires;
  return payload + '.' + authHmac_(payload);
}

// Calling it:
const cleanId = authNormalizeId_('  tl-grace  ');
// cleanId is now 'TL-GRACE'`,
    simple: `function greet(name) {
  return 'Hello, ' + name + '!';
}

console.log(greet('Grace'));  // -> "Hello, Grace!"

// Arrow function — shorter, same idea
const greet2 = (name) => 'Hello, ' + name + '!';`
  },
  {
    id: "arrays",
    name: "Arrays",
    category: "structures",
    icon: "📋",
    level: "intermediate",
    levelLabel: "Core skill",
    what: "An array is an ordered list. Items are numbered starting from 0. .map() transforms every item into a new array; .filter() keeps only the items that pass a test.",
    source: "2e_Menu.gs + 4_Auth.gs",
    real: `const handlers = ['nightlyRefresh', 'halfHourlyRefresh', 'refreshDaily'];

// edgeQuery_ returns rows like [{cohort:'5'}, {cohort:''}]
const rows = edgeQuery_('SELECT DISTINCT cohort FROM cohorts', []);

return (rows || [])
  .map(function (r) { return Number(r.cohort); })   // ['5',''] -> [5, 0]
  .filter(function (n) { return n; });               // [5, 0]  -> [5]  (0 is falsy)`,
    simple: `const fruits = ['apple', 'banana', 'mango'];

console.log(fruits[0]);        // -> 'apple'  (index starts at 0)
console.log(fruits.length);    // -> 3

const upper    = fruits.map(f => f.toUpperCase());
const longOnes = fruits.filter(f => f.length > 5);
// upper -> ['APPLE', 'BANANA', 'MANGO']
// longOnes -> ['banana', 'mango']`
  },
  {
    id: "objects",
    name: "Objects",
    category: "structures",
    icon: "🗂️",
    level: "intermediate",
    levelLabel: "Core skill",
    what: "An object groups related values under named keys instead of numbered positions — like a filled-in form. Read a property with dot notation: object.propertyName.",
    source: "4_Auth.gs — authToAccess_()",
    real: `function authToAccess_(row, via) {
  return {
    email:    row.email || '',
    accessId: row.access_id || '',
    name:     row.name,
    role:     row.role,
    isAdmin:  Number(row.is_admin) === 1,
    via:      via   // 'code' or 'email' — however they logged in
  };
}

const access = authToAccess_(row, 'code');
console.log(access.name);    // "Grace"
console.log(access.isAdmin); // false`,
    simple: `const student = {
  name: 'Grace',
  cohort: 26,
  isActive: true
};

console.log(student.name);      // -> 'Grace'
student.cohort = 27;             // update a property
student.score = 98.5;            // add a new property`
  },
  {
    id: "dom",
    name: "The DOM",
    category: "browser",
    icon: "🌐",
    level: "intermediate",
    levelLabel: "Browser skill",
    what: "DOM stands for Document Object Model. It's how JavaScript finds elements on a webpage, reads or changes them, and reacts to clicks and other events.",
    source: "worker.js — admin nav link injection",
    real: `if (!document.getElementById("edge-admin-link")) {
  var items = document.querySelectorAll(".sidebar .navitem");
  var last  = items[items.length - 1];

  var item = document.createElement("div");
  item.id = "edge-admin-link";
  item.innerHTML = '<span>Access codes</span>';
  item.onclick = function () {
    window.top.location.href = "/admin";
  };

  last.parentNode.insertBefore(item, last.nextSibling);
}`,
    simple: `const btn = document.getElementById('loginBtn');

btn.addEventListener('click', function () {
  document.getElementById('message').textContent = 'Signed in!';
});`
  },
  {
    id: "local-storage",
    name: "Local Storage",
    category: "browser",
    icon: "💾",
    level: "intermediate",
    levelLabel: "Browser skill",
    what: "Local Storage lets a webpage remember small pieces of text even after the browser tab is closed. It only stores strings, and it's private to each website — always wrap it in try/catch since private browsing can block it.",
    source: "worker.js — uniformLocksHidden",
    real: `// Saving a value
try {
  localStorage.setItem("uniformLocksHidden", sig);
} catch (e) {}

// Reading it back later
try {
  hidden = localStorage.getItem("uniformLocksHidden") === sig;
} catch (e) {
  hidden = false;
}`,
    simple: `localStorage.setItem('username', 'Grace');

const name = localStorage.getItem('username');
console.log(name);  // -> 'Grace'

localStorage.removeItem('username');`
  }
];

const CONCEPTS_KEY = "scriptstartConcepts";

// ── Render concept cards ────────────────────────────────────────
function renderConceptCards(list) {
  const container = document.getElementById("concepts-list");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p class="section-intro">No concepts match this filter.</p>`;
    return;
  }

  const categoryLabels = {
    fundamentals: "Fundamentals",
    control: "Control Flow",
    structures: "Functions &amp; Data",
    browser: "The Browser"
  };

  container.innerHTML = list.map(c => `
    <article class="concept-card" data-id="${c.id}" data-category="${c.category}">
      <button class="concept-head" aria-expanded="false">
        <span class="concept-icon" aria-hidden="true">${c.icon}</span>
        <span class="concept-meta">
          <h3>${c.name}</h3>
          <span class="cat-tag">${categoryLabels[c.category]}</span>
        </span>
        <span class="concept-chevron" aria-hidden="true">▾</span>
      </button>
      <div class="concept-body">
        <p class="concept-explain">${c.what}</p>

        <div class="code-panel real">
          <div class="code-panel-label">📂 From the real project — ${c.source}</div>
          <pre><code>${highlightJS(c.real)}</code></pre>
        </div>

        <div class="code-panel simple">
          <div class="code-panel-label">✅ The simple version</div>
          <pre><code>${highlightJS(c.simple)}</code></pre>
        </div>
      </div>
    </article>
  `).join("");

  // Expand / collapse
  container.querySelectorAll(".concept-card").forEach(card => {
    const head = card.querySelector(".concept-head");
    head.addEventListener("click", () => {
      const open = card.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
    });
  });
}

// ── Filter buttons ──────────────────────────────────────────────
function initConceptFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      const filtered = filter === "all"
        ? concepts
        : concepts.filter(c => c.category === filter);

      renderConceptCards(filtered);
    });
  });
}

// ── Concepts checklist ───────────────────────────────────────────
function saveConceptProgress() {
  const checked = concepts
    .filter(c => document.getElementById("learned-" + c.id)?.checked)
    .map(c => c.id);
  localStorage.setItem(CONCEPTS_KEY, JSON.stringify(checked));
}

function updateConceptProgress() {
  const total = concepts.length;
  const done  = concepts.filter(c => document.getElementById("learned-" + c.id)?.checked).length;
  const pct   = Math.round((done / total) * 100);
  const bar   = document.getElementById("skills-progress-bar");
  const label = document.getElementById("skills-progress-label");
  if (bar)   bar.style.width   = `${pct}%`;
  if (label) label.textContent = `${done} of ${total} concepts learned (${pct}%)`;
}

function renderConceptChecklist() {
  const list = document.getElementById("skills-checklist");
  if (!list) return;

  const saved = JSON.parse(localStorage.getItem(CONCEPTS_KEY) || "[]");

  list.innerHTML = concepts.map(c => `
    <li>
      <label>
        <input type="checkbox" id="learned-${c.id}" ${saved.includes(c.id) ? "checked" : ""}>
        <span>${c.icon} ${c.name}</span>
      </label>
    </li>
  `).join("");

  list.querySelectorAll("input[type='checkbox']").forEach(cb => {
    cb.addEventListener("change", () => {
      saveConceptProgress();
      updateConceptProgress();
    });
  });

  updateConceptProgress();
}

// ── Init ──────────────────────────────────────────────────────
const conceptsList = document.getElementById("concepts-list");
if (conceptsList) {
  renderConceptCards(concepts);
  initConceptFilters();
}

renderConceptChecklist();
