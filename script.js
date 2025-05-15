console.log("✅ script.js loaded");

const tabBar      = document.getElementById("tabBar");
const homeSection = document.getElementById("home");
const tabContent  = document.getElementById("tab-content");

const tabData = {
  search:   { label: "Search"             },            // home
  about:    { label: "About Me", file: "tabs/about.html"    },
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

  // if a file is specified, fetch it; otherwise fallback to inline HTML
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

  // create the tab on the bar if it doesn’t already exist
  if (![...document.querySelectorAll(".tab")]
      .some(t => t.getAttribute("data-key") === key)) {

    const t = document.createElement("div");
    t.className = "tab";
    t.setAttribute("data-key", key);

    // tab label
    const label = document.createElement("span");
    label.textContent = info.label;
    label.onclick = () => openTab(key);

    // append close button for non‐search tabs
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

    // insert the new tab just before the “＋”
    const plus = document.querySelector(".add-tab");
    tabBar.insertBefore(t, plus);
  }

  // highlight active
  setActive(info.label);
}

function removeTab(key) {
  const selector = `.tab[data-key="${key}"]`;
  const tabEl = document.querySelector(selector);
  if (!tabEl) return;

  const wasActive = tabEl.classList.contains("active");
  tabEl.remove();

  // if that tab was active, go back “home”
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

// override search‐bar Enter to either open tab or search
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

// initialize to home
goHome();


// —————— CHAT INTEGRATION ——————

const systemPrompt = `
Hi! I’m Katherine’s Virtual Assistant, nice to meet you! Ask me anything about Katherine and I’ll do my best to answer by searching the database I have about her.

Here’s what I know:
- Katherine Ma is originally from New Jersey, moved to Taipei in 8th grade and attended high school there, then returned to New Jersey for 10th grade.
- She began her undergraduate studies in Business Analytics (Data Science) but transferred into Computer Engineering to learn the technical skills she loves and build things hands-on.
- She’s now a Purdue Computer Engineering student focusing on AI & robotics and plans to graduate by May 2027 (three years accelerated timeline).
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
- She has interned remotely at a startup based in Silicon Valley, where she leveraged Gen-AI to develop several months' worth of marketing content and helped debug 60+ products. She was closely mentored by the Senior Marketing Manager and the CEOs. There, she learned her love for working in a tight-knit environment where every action makes a great impact.
- She was a part of journalism where her school newspaper qualified for multiple National Scholastic Press Association awards in highschool. She was the print managing editor and helped negotiate multiple censorship policies with the school adminstration. 
- She was a part of the FRC robotics team in high school where she was on the mechanical and statistics subteams, helping the team qualify for the World Championships. She was also a part of the travel team and helped mentor younger students. She has a lot of fun facts related to her time in robotics. 
- Fun fact: while competing at FRC Canadian Regionals (where her team placed 2nd and qualified for Worlds), a 7-Eleven was robbed while her team was shopping in it and she ignored it so completely she earned a “Most Likely to Ignore a Robbery” team superlative.
- Fun fact: she once over pumped a tire for a remote controlled seat she was making in her robotics and engineering class to the point it burst after she left the lab that day and scared the whole lab. 
- Fun fact: she once broke three of the drills of her lab's CNC machine because she didn't set the coordinates of the machine correctly. 
- She is interning at KPMG for Summer 2025 as a tech consultant intern. She will be conducting data analytics and working with AI models to develop solutionss for her clients. 
- She speaks English and Mandarin fluently, and learned Spanish throughout high school. Do not she is illiterate in Mandarin and is desperately trying to learn how to read and write it.
- She did a lot of volunteer work and still loves to. She created the Taiwan branch of an international non profit, helping expand branches in Singapore, South Korea, and Hong Kong. She is very good at making connections and experienced in leading organizations. She is a 4x Gold Presidential Volunteer Service Award Recipient as a result. 
- She founded a club to support the unhoused in high school called Home 4 the Night where she established multiple parrtnerships with local Taiwan-government sponsored non profits. 
- From all her experiences in general, Katherine is very good at making connections and establishing partnerships. She is also very good at leading organizations and has a lot of experience in doing so. She loves making connections and making a difference in her community. 
- Currently also working on robotics research aiming to make data collection for a general robot foundation model easier. Through this, she has learned many computer vision technologies like MediaPipe, OpenCV, Sam2, etc. 
- She has taken courses in Programming, Physics, Math, and robotics. She knows C/C++, Java, Python, and JavaScript. She is also familiar with HTML/CSS and SQL. She is currently learning Tensorflow and PyTorch. 

If you don’t know the answer, respond:
“I’m not sure about that—please check the About Me tab or click Contact to reach out directly.”`;

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
    const res = await fetch("http://localhost:3001/api/chat", {
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
    console.log("AI reply:", json.content);
    appendToChat("assistant", json.content);
  } catch (err) {
    console.error(err);
    appendToChat("assistant", "Oops, something went wrong. Try clicking Contact below.");
  }
}

// hook the close button once the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("chatClose");
  if (closeBtn) {
    closeBtn.onclick = () => hideChatPanel();
  }
});

// Map of project slugs → snippet files
const projectData = {
  "penguin": "tabs/projects/penguin.html",
  "solo-travel": "tabs/projects/solo-travel.html",
  "dodge": "tabs/projects/dodge.html",
  "habit": "tabs/projects/habit.html",
  "arduino": "tabs/projects/arduino.html",
  "research": "tabs/projects/research.html",
  "robotics": "tabs/projects/robotics.html"
};

// Load a project snippet into your SPA
async function openProject(slug) {
  const file = projectData[slug];
  if (!file) return console.error("Unknown project:", slug);

  // Hide home & tab-content just in case
  homeSection.style.display = "none";
  tabContent.style.display  = "block";

  try {
    const res = await fetch(file);
    tabContent.innerHTML = await res.text();
  } catch (err) {
    tabContent.innerHTML = `<p style="color:red">Failed to load project.</p>`;
    console.error(err);
  }
}
