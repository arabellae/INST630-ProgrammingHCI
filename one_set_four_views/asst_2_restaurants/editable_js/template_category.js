/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories
 */

// DATA PRE-PROCESSING FUNCTIONS
function cleanCityName(city) {
  let name = city.toLowerCase();
  if (name === 'district hts') {
    name = 'district heights';
  }
  return name;
}
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined ? 'Not listed' : value;
}

function showCategories(data) {
  // Requirements:
  // - Group data by one meaningful field (category, city, inspection result, etc.)
  // - Show how many records are in each group, plus one other number per group
  //   (an average, a highest, a lowest)
  // - Show items within each group
  // - Make the groups easy to compare, and visually distinct from their items
   const groups = {};
  data.forEach((inspection) => {
    const city = cleanCityName(inspection.city);
    if (groups[city] === undefined) {
      groups[city] = [];
    }
    groups[city].push(inspection);
  });

  const cityNames = Object.keys(groups);
  cityNames.sort((a, b) => groups[b].length - groups[a].length);

  let sectionsHTML = '';
  cityNames.forEach((city) => {
    const inspections = groups[city];

 let compliantCount = 0;
    inspections.forEach((inspection) => {
      if (inspection.inspection_results === 'Compliant - No Health Risk') {
        compliantCount = compliantCount + 1;
      }
    });

  /*html*/

    let itemsHTML = '';
    inspections.forEach((inspection) => {
      itemsHTML += `
                    <div class="category-item" style="flex-wrap: wrap; gap: 0.5rem 1rem;">
                        <div>
                            <strong>${inspection.name}</strong><br>
                            ${orNotListed(inspection.address_line_1)} · ${orNotListed(inspection.category)} · ${formatDate(inspection.inspection_date)}
                        </div>
                        <span>${orNotListed(inspection.inspection_results)}</span>
                    </div>
                `;
    });
   sectionsHTML += `
                <details class="category-section">
                    <summary class="category-header" style="cursor: pointer;">
                        <strong style="text-transform: capitalize;">${city}</strong>:
                        ${inspections.length} inspections, ${compliantCount} compliant (no health risk)
                    </summary>
                    <div class="category-items">
                        ${itemsHTML}
                    </div>
                </details>
            `;
  });
  return `
                <h2 class="view-title">📂 Category View</h2>
                <p class="view-description">Pick a city to see which places were inspected there and how they did</p>
                ${sectionsHTML}
            `;
}

export default showCategories;