// elzGotThis
const SHEET_API = 'https://sheetdb.io/api/v1/xn9ohh5i4a1lw'; // Replace with your real URL

const dealsBody = document.getElementById('dealsBody');
const airlineFilter = document.getElementById('airlineFilter');
const sortBy = document.getElementById('sortBy');

let allDeals = [];

function renderDeals(deals) {
  dealsBody.innerHTML = '';

  if (!deals || deals.length === 0) {
    dealsBody.innerHTML = `<tr><td colspan="10">No deals found.</td></tr>`;
    return;
  }

  deals.forEach(deal => {
    const row = `
      <tr>
        <!-- <td><img src="${deal.logo}" alt="${deal.airline}" width="50"/> ${deal.airline}</td> -->
        <td>${deal.acode}</td>
        <td>${deal.airline}</td>
        <td>${deal.iata}</td>
        <td>${deal.first}</td>
        <td>${deal.bus}</td>
        <td>${deal.prm_eco}</td>
        <td>${deal.eco}</td>
        <td>${deal.validity}</td>
        <td>${deal.comments}</td>
      </tr>
    `;
    dealsBody.innerHTML += row;
  });
}

function populateFilterOptions() {
  const airlines = [...new Set(allDeals.map(d => d.airline))];
  airlineFilter.innerHTML += airlines.map(a => `<option value="${a}">${a}</option>`).join('');
}

function applyFilters() {
  let filtered = [...allDeals];
  if (airlineFilter.value) {
    filtered = filtered.filter(d => d.airline === airlineFilter.value);
  }
 if (sortBy.value === 'acode') {
  filtered.sort((a, b) => a.acode.localeCompare(b.acode));
} else if (sortBy.value === 'acode-reverse') {
  filtered.sort((a, b) => b.acode.localeCompare(a.acode));
}
  renderDeals(filtered);
}

async function fetchDeals() {
  try {
    console.log("Fetching from:", SHEET_API);
    const res = await fetch(SHEET_API);
    const data = await res.json();
    console.log("Fetched data:", data);
    allDeals = data;
    renderDeals(allDeals);
    populateFilterOptions();
  } catch (error) {
    console.error("Error fetching data:", error);
    dealsBody.innerHTML = '<tr><td colspan="10">Error loading deals.</td></tr>';
  }
}

airlineFilter.addEventListener('change', applyFilters);
sortBy.addEventListener('change', applyFilters);

fetchDeals();