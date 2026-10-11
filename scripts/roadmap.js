// ── Phase data ────────────────────────────────────────────────
const phases = [
  {
    id: "phase1",
    title: "Phase 1 — Fundamentals",
    weeks: "Weeks 1–2",
    tasks: [
      "Learn the five core data types: String, Number, Boolean, null, undefined",
      "Declare variables with const and let, and understand why const comes first",
      "Practice comparison (===, !==) and logical operators (&&, ||, !)",
      "Debug with console.log() — the single most useful tool you'll use all course"
    ]
  },
  {
    id: "phase2",
    title: "Phase 2 — Control Flow",
    weeks: "Weeks 3–4",
    tasks: [
      "Write if / else if / else chains to branch logic",
      "Master the for loop: start, condition, step",
      "Learn forEach() as the cleaner way to loop over arrays",
      "Mini-project: a number guessing game using a while loop"
    ]
  },
  {
    id: "phase3",
    title: "Phase 3 — Functions &amp; Data Structures",
    weeks: "Weeks 5–7",
    tasks: [
      "Write functions with parameters and return values",
      "Learn arrow functions as a shorter alternative",
      "Work with arrays: push, map, filter, indexOf",
      "Work with objects: reading, updating, and nesting properties"
    ]
  },
  {
    id: "phase4",
    title: "Phase 4 — The Browser: DOM &amp; Events",
    weeks: "Weeks 8–9",
    tasks: [
      "Select elements with getElementById and querySelector",
      "Change text and styles with JavaScript",
      "Respond to clicks and form submissions with addEventListener",
      "Save and restore small pieces of data with Local Storage"
    ]
  },
  {
    id: "phase5",
    title: "Phase 5 — Build Real Projects",
    weeks: "Weeks 10–12",
    tasks: [
      "Complete at least two of the practice projects below, start to finish",
      "Read through a real codebase (like the one this course is built from) and identify each concept",
      "Debug a project that isn't yours — reading other people's code is its own skill",
      "Publish a project on GitHub Pages so it's live and shareable"
    ]
  }
];

const PROGRESS_KEY = "scriptstartProgress";

// ── Render roadmap phases ─────────────────────────────────────
function renderPhases() {
  const container = document.getElementById("phases-container");
  if (!container) return;

  const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");

  container.innerHTML = phases.map(phase => `
    <div class="phase-card">
      <div class="phase-head">
        <h3>${phase.title}</h3>
        <span class="weeks-badge">${phase.weeks}</span>
      </div>
      <div class="phase-body">
        <ul>
          ${phase.tasks.map(t => `<li>${t}</li>`).join("")}
        </ul>
        <label class="phase-complete">
          <input type="checkbox" id="${phase.id}-done"
            ${saved.includes(phase.id) ? "checked" : ""}
            data-phase="${phase.id}">
          Mark phase as complete
        </label>
      </div>
    </div>
  `).join("");

  container.querySelectorAll("input[type='checkbox']").forEach(cb => {
    cb.addEventListener("change", saveProgress);
  });

  updateOverallProgress();
}

function saveProgress() {
  const completed = phases
    .filter(p => document.getElementById(`${p.id}-done`)?.checked)
    .map(p => p.id);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
  updateOverallProgress();
}

function updateOverallProgress() {
  const saved  = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
  const total  = phases.length;
  const done   = saved.length;
  const pct    = Math.round((done / total) * 100);
  const bar    = document.getElementById("overall-progress-bar");
  const label  = document.getElementById("overall-progress-label");
  if (bar)   bar.style.width   = `${pct}%`;
  if (label) label.textContent = `${done} of ${total} phases complete — ${pct}% of your roadmap done!`;
}

// ── Goal form ─────────────────────────────────────────────────
function buildPersonalizedPlan(data) {
  const { name, level, goal, topics, hours } = data;

  // Determine starting phase based on experience
  let startPhase;
  if (level === "complete-beginner") {
    startPhase = "Phase 1 (Fundamentals)";
  } else if (level === "know-html-css") {
    startPhase = "Phase 1 (Fundamentals), moving quickly";
  } else if (level === "know-basics") {
    startPhase = "Phase 3 (Functions &amp; Data Structures)";
  } else {
    startPhase = "Phase 4 (The Browser: DOM &amp; Events)";
  }

  // Estimate timeline based on hours per week
  let timeline;
  if (hours === "1-3") {
    timeline = "approximately 5–6 months";
  } else if (hours === "4-7") {
    timeline = "approximately 3–4 months";
  } else if (hours === "8-14") {
    timeline = "approximately 6–8 weeks";
  } else {
    timeline = "approximately 4–5 weeks";
  }

  // Focus recommendation based on goal
  let focusRec;
  if (goal === "job") {
    focusRec = "functions, arrays, and the DOM — the three areas interview exercises lean on most.";
  } else if (goal === "course") {
    focusRec = "whatever your syllabus covers next, in order — don't skip ahead of your own course.";
  } else if (goal === "personal") {
    focusRec = "the DOM and Local Storage early, so your own projects feel interactive right away.";
  } else {
    focusRec = "the Concepts &amp; Real Code page — seeing JavaScript in an actual project answers 'why does this matter?' fast.";
  }

  // Topic list from checkboxes
  const topicList = topics.length > 0
    ? topics.join(", ")
    : "a broad overview of every concept";

  const greeting = name.trim() ? `Hi ${name.trim()}, here` : "Here";

  return `
    <h3>Your Personalized Learning Plan</h3>
    <p>${greeting} is a plan tailored to your goals and schedule.</p>
    <p><strong>Where to start:</strong> Based on your current experience, begin at <strong>${startPhase}</strong>.</p>
    <p><strong>Estimated timeline:</strong> Studying at your available pace, completing the full roadmap should take <strong>${timeline}</strong>.</p>
    <p><strong>What to focus on:</strong> Given your primary goal, prioritize <strong>${focusRec}</strong></p>
    <p><strong>Topics you selected:</strong> ${topicList}. Use the concepts checklist to track your progress as you work through each one.</p>
    <p>Scroll up to the roadmap phases and start checking off tasks as you complete them — your progress is saved automatically.</p>
  `;
}

function initGoalForm() {
  const form = document.getElementById("goal-form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name   = form.querySelector("#goal-name").value;
    const level  = form.querySelector("#experience-level").value;
    const goal   = form.querySelector("input[name='primary-goal']:checked")?.value || "personal";
    const topics = [...form.querySelectorAll("input[name='topics']:checked")].map(cb => cb.value);
    const hours  = form.querySelector("#hours-per-week").value;

    const resultBox = document.getElementById("result-box");
    resultBox.innerHTML = buildPersonalizedPlan({ name, level, goal, topics, hours });
    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ── Init ──────────────────────────────────────────────────────
renderPhases();
initGoalForm();
