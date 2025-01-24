console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: "index.html", title: "Home" },
  { url: "./projects/index.html", title: "Projects" },
  { url: "./resume/index.html", title: "Resume" },
  { url: "./contact/index.html", title: "Contact" },
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
