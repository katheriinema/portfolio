console.log("✅ script.js loaded");

const tabBar      = document.getElementById("tabBar");
const homeSection = document.getElementById("home");
const tabContent  = document.getElementById("tab-content");

const tabData = {
  search:   { label: "Search"              },            // home
  about:    { label: "About Me",  file: "tabs/about.html"    },
  projects: { label: "Projects", file: "tabs/projects.html" },
  resume:   { label: "Resume",   file: "tabs/resume.html"   },
  contact:  { label: "Contact",  file: "tabs/contact.html"  }
};

function goHome() {
  console.log("goHome()");
  homeSection.style.display  = "block";
  tabContent.style.display   = "none";
  setActive("Search");
}

async function openTab(key) {
  const info = tabData[key];
  if (!info) return;
  console.log("openTab()", key);

  // hide home, show tab content area
  homeSection.style.display = "none";
  tabContent.style.display  = "block";

  // fetch from file if given, else use inline html
  if (info.file) {
    try {
      const res = await fetch(info.file);
      tabContent.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      tabContent.innerHTML = `<p style="color:red">Failed to load ${info.label} page.</p>`;
    }
  } else if (info.html) {
    tabContent.innerHTML = info.html;
  }

  // add a tab button if needed
  if (![...document.querySelectorAll(".tab")]
      .some(t => t.getAttribute("data-key") === key)) {

    const t = document.createElement("div");
    t.className = "tab";
    t.setAttribute("data-key", key);

    const label = document.createElement("span");
    label.textContent = info.label;
    label.onclick = () => openTab(key);

    if (key !== "search") {
      const close = document.createElement("span");
      close.className = "tab-close";
      close.textContent = "×";
      close.onclick = e => {
        e.stopPropagation();
        removeTab(key);
      };
      t.append(label, close);
    } else {
      t.append(label);
    }

    const plus = document.querySelector(".add-tab");
    tabBar.insertBefore(t, plus);
  }

  setActive(info.label);
}

function removeTab(key) {
  const selector = `.tab[data-key="${key}"]`;
  const tabEl = document.querySelector(selector);
  if (!tabEl) return;

  const wasActive = tabEl.classList.contains("active");
  tabEl.remove();
  if (wasActive) goHome();
}

function setActive(label) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle(
      "active",
      t.textContent.trim().startsWith(label)
    )
  );
}

// search‐bar Enter
function handleKey(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const v = document.getElementById("searchBox").value.toLowerCase();
    if (v.includes("project"))   return openTab("projects");
    if (v.includes("resume"))    return openTab("resume");
    if (v.includes("about"))     return openTab("about");
    if (v.includes("contact"))   return openTab("contact");
    doSearch(v);
  }
}

// kick things off at load
goHome();


// —————— CHAT INTEGRATION ——————

const systemPrompt = `
Hi! I’m Katherine’s Virtual Assistant, nice to meet you! Ask me anything about Katherine and I’ll do my best to answer by searching the database I have about her.

Here’s what I know:
- Katherine Ma is originally from New Jersey, moved to Taipei in 8th grade and attended high school there, then returned to New Jersey for 10th grade.
- She began her undergraduate studies in Business Analytics (Data Science) but transferred into Computer Engineering to learn the technical skills she loves and build things hands-on.
- She’s now a Purdue Computer Engineering student focusing on AI & robotics and plans to graduate by May 2027 (three-year accelerated timeline). 
- Roles she’s interested in include product development in physical AI, scientific AI research, and AI-driven innovation.
- She’s built projects like the “Penguin Village Game” to pursue and develop her creative and technical skills.
- She founded and directs the ML@P Accelerator Program to help students learn about machine learning and AI.
- She enjoys creating interactive tech projects, playing Minecraft and The Sims 4, tinkering with LEGO, journalism, and scrapbooking.
- In high school she was on the FRC robotics travel team—qualified for Worlds and placed 2nd at Canadian Regionals (fun fact: she ignored a 7-Eleven robbery there, earning a “Most Likely to Ignore a Robbery” superlative).
- She’s competed in several case competitions, advanced to finals, and won a Best Speaker award.
- She’s participated in hackathons across campus, including InnovateHer, where she created a travel itinerary platform targeted for female solo travelers.
- She’s conducted chemical-isotope research on Purdue’s Negishi supercomputer, running over 700 simulations with computational models and leveraging R and Python for data analysis.
- Personal motto: “Where comfort ends, creativity begins.” and “Risk over routine; creation over comfort.”
- She has two corgis and absolutely loves dogs.
- She has interned remotely at a startup based in Silicon Valley, where she leveraged Gen-AI to develop months’ worth of marketing content and helped debug 60+ products.
- If you don’t know the answer, do NOT hallucinate, just reply:
  “I’m not sure about that—please check the About Me tab or click Contact to reach out directly.”
`;

function showChatPanel() {
  document.getElementById("chatPanel").classList.remove("hidden");
}
function hideChatPanel() {
  document.getElementById("chatPanel").classList.add("hidden");
}

function appendToChat(role, text) {
  const log = document.getElementById("chatLog");
  const msg = document.createElement("div");
  msg.className = "message " + (role === "user" ? "user" : "assistant");
  msg.textContent = text;
  log.append(msg);
  log.scrollTop = log.scrollHeight;
}

async function doSearch(query) {
  console.log("doSearch()", query);
  goHome();
  showChatPanel();
  appendToChat("user", query);

  try {
    const res = await fetch("https://api.katherinema.my/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: query }
        ]
      })
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const json = await res.json();
    appendToChat("assistant", json.content);
  } catch (err) {
    console.error(err);
    appendToChat("assistant", "Oops, something went wrong. Try clicking Contact below.");
  }
}

// close-button for chat
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("chatClose");
  if (closeBtn) closeBtn.onclick = () => hideChatPanel();
});


// —————— SPA project loader ——————

const projectData = {
  "penguin":      "tabs/projects/penguin.html",
  "solo-travel":  "tabs/projects/solo-travel.html",
  "dodge":        "tabs/projects/dodge.html",
  "habit":        "tabs/projects/habit.html",
  "arduino":      "tabs/projects/arduino.html",
  "research":     "tabs/projects/research.html",
  "robotics":     "tabs/projects/robotics.html"
};

async function openProject(slug) {
  const file = projectData[slug];
  if (!file) return console.error("Unknown project:", slug);

  homeSection.style.display = "none";
  tabContent.style.display  = "block";

  try {
    const res = await fetch(file);
    tabContent.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    tabContent.innerHTML = `<p style="color:red">Failed to load project.</p>`;
  }
}
