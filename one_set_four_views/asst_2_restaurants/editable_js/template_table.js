
/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined ? 'Not listed' : value;
}
// I wanted to have a column that showed what kind of violation there was generally
// the view is for a diner so I make categories that are relevant to a diner
// and generalizes the specific violations into those categories

const VIOLATION_GROUPS = {
  'Employee Sanitation': [
    'ill_workers_restricted', 'proper_hand_washing', 'no_bare_hand_contact', 'adequate_hand_washing',
  ],
  'Safe Food Handling': [
    'food_from_approved_source', 'food_protected_from', 'cooling_time_and_temperature',
    'cold_holding_temperature', 'hot_holding_temperature', 'cooking_time_and_temperature',
    'reheating_time_and_temperature',
  ],
  'Establishment Cleanliness': [
    'hot_and_cold_running_water', 'proper_sewage_disposal', 'rodent_and_insects', 'food_contact_surfaces_and',
  ],
};

function getViolationCategories(inspection) {
  return Object.entries(VIOLATION_GROUPS)
    .filter(([groupName, checks]) =>
      checks.some((check) => inspection[check] === 'Out of Compliance')
    )
    .map(([groupName]) => groupName);
}


function showTable(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Use a real HTML <table>, with <th> header cells and a <caption> saying what the table shows
  // - Include the 4-6 most useful fields
  // - Show "Not listed" instead of undefined when a value is missing
  // - Optional: add sorting
    const rows = data
    .map((inspection) => {
      const categories = getViolationCategories(inspection);
      const violationText = categories.length > 0 ? categories.join(', ') : 'None';
      return `
        <tr>
          <th scope="row">${inspection.name}</th>
          <td>${orNotListed(inspection.address_line_1)}</td>
          <td>${formatDate(inspection.inspection_date)}</td>
          <td>${orNotListed(inspection.inspection_results)}</td>
          <td>${violationText}</td>
        </tr>`;
    })
    .join('');
  /*html*/ 
  return `
    <h2 class="view-title">The Din(n)er Table</h2>
    <p class="view-description">Scan and see where, when, and how these restaurants did on their health inspections</p>
    <div style="overflow-x: auto;">
      <table class="restaurant-table">
        <caption>
          ${data.length} food safety inspections in Prince George's County, with the
          category of any violations found
        </caption>
        <thead>
          <tr>
            <th scope="col">Establishment</th>
            <th scope="col">Address</th>
            <th scope="col">Inspection date</th>
            <th scope="col">Result</th>
            <th scope="col">Violation category</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
            `;
}

export default showTable;