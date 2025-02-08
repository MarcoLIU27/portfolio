import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const projectsTitle = document.querySelector('.projects-title');
const projectsCount = document.querySelectorAll('.projects > *').length;
projectsTitle.textContent = `${projectsCount} Projects`;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Highlighting selected wedge
let selectedIndex = -1;

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    // clear up paths and legends
    d3.select('svg').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();
    // update paths and legends, refer to steps 1.4 and 2.2
    newArcs.forEach((arc, idx) => {
        d3.select('svg')
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(idx))
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;
                console.log(selectedIndex);
                d3.select('svg')
                    .selectAll('path')
                    .attr('class', (_, idx) => (
                        idx === selectedIndex ? 'selected' : ''
                    ));
                d3.select('.legend')
                    .selectAll('.legend-item')
                    .attr('class', (_, idx) => (
                        idx === selectedIndex ? 'legend-item selected' : 'legend-item'
                    ));

                if (selectedIndex === -1) {
                    renderProjects(projectsGiven, projectsContainer, 'h2');
                } else {
                    const selectedYear = newData[selectedIndex].label;
                    const filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
                    renderProjects(filteredProjects, projectsContainer, 'h2');
                }
            });
    })
    let newLegend = d3.select('.legend');
    newData.forEach((d, idx) => {
        newLegend.append('li')
            .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    })
}

// Render pip chart on page load
renderPieChart(projects);

// Search bar
let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    // update query value
    query = event.target.value;
    // filter the projects
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    // render updated projects!
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

