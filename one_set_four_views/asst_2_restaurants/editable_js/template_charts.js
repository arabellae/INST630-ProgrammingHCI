/**
 * CHARTS VIEW - STUDENTS IMPLEMENT
 * Show patterns in your data as charts, using Chart.js
 *
 * This view has two parts:
 *   showCharts(data) returns the HTML: one <canvas> per chart, with a text alternative under each
 *   drawCharts(data) runs after that HTML is on the page, and draws a chart into each <canvas>
 *
 * Chart.js docs: https://www.chartjs.org/docs/latest/getting-started/
 */

const CHECKS = [
  'food_from_approved_source', 'food_protected_from', 'ill_workers_restricted',
  'proper_hand_washing', 'cooling_time_and_temperature', 'cold_holding_temperature',
  'hot_holding_temperature', 'cooking_time_and_temperature', 'reheating_time_and_temperature',
  'hot_and_cold_running_water', 'proper_sewage_disposal', 'no_bare_hand_contact',
  'adequate_hand_washing', 'rodent_and_insects', 'food_contact_surfaces_and',
];

// Added because Chart.js gave 2 of my categories the same color by default :/
const SLICE_COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
  '#393b79', '#e6550d', '#31a354', '#756bb1', '#636363',
];

// DATA PRE-PROCESSING FUNCTIONS
function countViolationsByCategory(data) {
  const counts = {};
  data.forEach((inspection) => {
    
    let category = inspection.category;
    if (category === '------' || category === 'N/A') {
      category = 'Not listed';
    }

    let violations = 0;
    CHECKS.forEach((check) => {
      if (inspection[check] === 'Out of Compliance') {
        violations = violations + 1;
      }
    });

    if (violations > 0) {
      counts[category] = (counts[category] || 0) + violations;
    }
  });
  return counts;
}

function countViolationsByCheck(data) {
  const counts = {};
  data.forEach((inspection) => {
    CHECKS.forEach((check) => {
      if (inspection[check] === 'Out of Compliance') {
        const label = check.replaceAll('_', ' ');  
        counts[label] = (counts[label] || 0) + 1;
      }
    });
  });
  return counts;
}

function findLargest(counts) {
  let largestName = '';
  let largestNumber = 0;
  Object.keys(counts).forEach((name) => {
    if (counts[name] > largestNumber) {
      largestName = name;
      largestNumber = counts[name];
    }
  });
  return largestName;
}


function addUp(counts) {
  let total = 0;
  Object.values(counts).forEach((number) => {
    total = total + number;
  });
  return total;
}

function showCharts(data) {
  // TODO: Replace each TODO sentence below with text that says what that chart shows.
  // Charts are drawn as pictures, so screen readers can't read them.
  // (Done: the sentences are built from the data, so they always match the charts.)
  const categoryCounts = countViolationsByCategory(data);
  const checkCounts = countViolationsByCheck(data);
  const total = addUp(checkCounts);

  const topCategory = findLargest(categoryCounts);
  const topCheck = findLargest(checkCounts);

  const categoryCaption =
    `${topCategory} had the most violations: ${categoryCounts[topCategory]} of ${total} ` +
    `found across ${data.length} inspections.`;
  const checkCaption =
    `"${topCheck}" was the most common violation: ${checkCounts[topCheck]} of ${total}.`;

  /*html*/
  return `
                <h2 class="view-title">📈 Charts View</h2>
                <p class="view-description">Where food safety violations happen, and which kinds are most common</p>
                <div class="charts-grid">
                    <figure class="chart-figure">
                        <div style="position: relative; height: 450px;">
                            <canvas id="chart-one"></canvas>
                        </div>
                        <figcaption class="chart-summary">${categoryCaption}</figcaption>
                    </figure>
                    <figure class="chart-figure">
                        <div style="position: relative; height: 450px;">
                            <canvas id="chart-two"></canvas>
                        </div>
                        <figcaption class="chart-summary">${checkCaption}</figcaption>
                    </figure>
                </div>
            `;
}

function drawCharts(data) {
  // Chart.js is loaded by a <script> tag in index.html. If it didn't load, say so instead of breaking.
  if (typeof Chart === 'undefined') {
    document.querySelector('.charts-grid').innerHTML =
      '<p class="error">Chart.js did not load, so the charts can\'t be drawn. Check the &lt;script&gt; tag in index.html.</p>';
    return;
  }

  // TODO 1: Reshape your data for the first chart.
  // Chart.js doesn't take your array of records.
  // It wants a list of labels and a matching list of numbers.
  // Example: count inspections by type of business.
  //
  //   const counts = {};
  //   data.forEach((item) => {
  //     counts[item.category] = (counts[item.category] || 0) + 1;
  //   });
  //   const labels = Object.keys(counts);
  //   const numbers = Object.values(counts);
  //
  // (Done: same idea, but we add up violations instead of inspections.)
  const categoryCounts = countViolationsByCategory(data);
  const categoryLabels = Object.keys(categoryCounts);
  const categoryNumbers = Object.values(categoryCounts);

  // TODO 2: Draw the first chart into <canvas id="chart-one">.
  // Every chart needs a title, and every axis needs a label.
  //
  //   new Chart(document.querySelector('#chart-one'), {
  //     type: 'bar',
  //     data: {
  //       labels: labels,
  //       datasets: [{ label: 'Number of inspections', data: numbers }]
  //     },
  //     options: {
  //       plugins: { title: { display: true, text: 'Inspections by type of business' } },
  //       scales: {
  //         x: { title: { display: true, text: 'Type of business' } },
  //         y: { title: { display: true, text: 'Inspections' }, beginAtZero: true }
  //       }
  //     }
  //   });
  //
  // (Done: a horizontal bar chart. With indexAxis: 'y', x is the numbers axis and y is the labels axis.)
  new Chart(document.querySelector('#chart-one'), {
    type: 'bar',
    data: {
      labels: categoryLabels,
      datasets: [{ label: 'Violations', data: categoryNumbers }]
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false, // lets the wrapper <div> control the height
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Violations by type of business' }
      },
      scales: {
        x: { title: { display: true, text: 'Number of violations' }, beginAtZero: true },
        y: { title: { display: true, text: 'Type of business' } }
      }
    }
  });

  // TODO 3: Reshape your data again, and draw a second chart of a DIFFERENT type
  // (pie, line, scatter...) into <canvas id="chart-two">, answering a different question.
  // Ideas: inspection results as a pie, inspections per month as a line,
  // or how many "Out of Compliance" checks each type of business averages.
  //
  // (Done: a doughnut of violations per food safety check. A doughnut has no axes,
  //  so it only needs a title.)
  const checkCounts = countViolationsByCheck(data);
  const checkLabels = Object.keys(checkCounts);
  const checkNumbers = Object.values(checkCounts);

  new Chart(document.querySelector('#chart-two'), {
    type: 'doughnut',
    data: {
      labels: checkLabels,
      datasets: [{ data: checkNumbers, backgroundColor: SLICE_COLORS }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Violations by food safety check' },
        legend: { position: 'bottom' }
      }
    }
  });
}

export { showCharts, drawCharts };
