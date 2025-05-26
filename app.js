// elzGotThis

const dealsBody = document.getElementById('dealsBody');
const airlineFilter = document.getElementById('airlineFilter');
const sortBy = document.getElementById('sortBy');

// Supabase credentials
const SUPABASE_URL = "https://ppkezwgxjljjqlzfscna.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwa2V6d2d4amxqanFsemZzY25hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDAwNzksImV4cCI6MjA2MzgxNjA3OX0.l1gfSx3tnDFqf1rKPy02-4c8iTe49bSuhzmVg91Pplg";

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
    const res = await fetch(`${SUPABASE_URL}/rest/v1/Deals`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      }
    });
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

// Listen for filter and sort changes
airlineFilter.addEventListener('change', applyFilters);
sortBy.addEventListener('change', applyFilters);

fetchDeals();