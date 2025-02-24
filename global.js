console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: "index.html", title: "Home" },
  { url: "./projects/index.html", title: "Projects" },
  { url: "./resume/index.html", title: "Resume" },
  { url: "./contact/index.html", title: "Contact" },
  { url: "./meta/index.html", title: "Meta" },
  { url: "https://github.com/MarcoLIU27", title: "GitHub" }
];

// Detect if we are on the home page
const ARE_WE_HOME = document.documentElement.classList.contains("home");

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !ARE_WE_HOME && !url.startsWith("http") ? "../" + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  a.classList.toggle("current", a.host === location.host && a.pathname === location.pathname);

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

// Add color scheme selector
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

document.body.insertAdjacentHTML(
  "afterbegin",
  `
    <label class="color-scheme">
        Theme:
        <select id="theme-selector">
            <option value="light dark">Automatic (${isDark ? "Dark" : "Light"})</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
  `
);

const select = document.querySelector("#theme-selector");

function setColorScheme(scheme) {
  document.documentElement.style.setProperty("color-scheme", scheme);
  select.value = scheme;
}

const savedScheme = localStorage.getItem("colorScheme") || "light dark";
setColorScheme(savedScheme);

// Event listener to change theme and save preference
select.addEventListener("input", function (event) {
  const newScheme = event.target.value;
  setColorScheme(newScheme);
  localStorage.setItem("colorScheme", newScheme);
});

// Fix the contact form
const form = document.querySelector("#contact-form");

form?.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  const data = new FormData(form);

  let mailtoURL = form.action + "?";
  let params = [];
  for (let [name, value] of data) {
    params.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
  }
  mailtoURL += params.join("&");

  // Open the mail client
  location.href = mailtoURL;
});


export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;


  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  for (let p of project) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${p.title}</${headingLevel}>
      <img src="${p.image}" alt="${p.title}">
      <div class="description-container">
        <p>${p.description}</p>
        <span class="project-year">${p.year}</span>
      </div>
    `;
    containerElement.append(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}