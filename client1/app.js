// 1. init map centered on WA (lat/lng, zoom) :contentReference[oaicite:5]{index=5}
let lastLayer = null;
const map = L.map('map', { 
    zoomControl: false,
    attributionControl: false,
}).setView([47.6, -122.3], 7)

  L.control.zoom({
    position: 'bottomright'   // options: 'topleft'|'topright'|'bottomleft'|'bottomright'
  }).addTo(map)
  L.control.attribution({
    position: 'topright',
    prefix: false
  })
    .addTo(map)

    map.on('click', () => {
        if (sheet.classList.contains('open')) {
          sheet.classList.remove('open')
        }
      })

// 2. add OpenStreetMap tiles :contentReference[oaicite:6]{index=6}
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 3. fetch county data via Fetch API :contentReference[oaicite:7]{index=7}
fetch('https://firesource.onrender.com/api/counties')
  .then(res => res.json())
  .then(counties => renderCounties(counties))
  .catch(err => console.error('fetch error:', err));

// 4. style callback for risk levels :contentReference[oaicite:8]{index=8}
const colors = { green: '#4caf50', yellow: '#ffeb3b', red: '#f44336' };
function styleByFeature(feature) {
  return {
    weight: 1,
    color: '#555',
    fillColor: colors[feature.properties.riskLevel],
    fillOpacity: 0.6
  };
}

function onEachFeature(feature, layer) {
    layer.on('click', (e) => {
      layer.setStyle({ fillOpacity: 0.9 });
  
      setTimeout(() => {
        layer.setStyle(styleByFeature(feature));
      }, 100);
  
      fetch(`https://firesource.onrender.com/api/counties/${feature.properties.fips}`)
        .then(r => r.json())
        .then(data => {
          content.innerHTML = `
            <h1 class="text-county">${data.countyName}</h1>
            <p><strong>⚠️ Risk Score:</strong> ${data.riskScore}</p>
            <p><strong>🌡️ Temperature:</strong> ${data.weather.temp.toFixed(1)} °F</p>
            <p><strong>💧 Humidity:</strong> ${data.weather.humidity}%</p>
            <p><strong>💨 Wind:</strong> ${data.weather.windSpeed} mph</p>
            <p><strong>Description: </strong>${data.weather.description}</p>
          `;
          sheet.classList.add('open');
        })
        .catch(err => console.error('detail fetch failed', err));
    });
  }

// 5. render each county and add click handler :contentReference[oaicite:9]{index=9}
function renderCounties(counties) {
    counties.forEach(county => {
      const feature = {
        type: 'Feature',
        geometry: county.geometry,
        properties: {
          countyName: county.countyName,
          riskLevel: county.riskLevel,
          fips: county.fips             // ← include fips here
        }
      };
  
      L.geoJSON(feature, {
        style: styleByFeature,
        onEachFeature: onEachFeature    // ← reference the named fn
      }).addTo(map);
    });
  }

// 6. sheet logic: fill & toggle CSS class :contentReference[oaicite:10]{index=10}
const sheet = document.getElementById('sheet');
const content = document.getElementById('sheet-content');

function openSheet(props) {
  content.innerHTML = `<h2>${props.countyName}</h2><p>Risk: ${props.riskLevel}</p>`;
  sheet.classList.add('open');
}

// close sheet if you tap the handle again
document.getElementById('sheet-handle')
  .addEventListener('click', () => sheet.classList.toggle('open'));

const tabMap       = document.getElementById('tab-map');
const tabResources = document.getElementById('tab-resources');
const resourcesPg  = document.getElementById('resources-page');
const mapDiv       = document.getElementById('map');

function showMap() {
    tabMap.classList.add('active');
    tabResources.classList.remove('active');
    resourcesPg.classList.add('hidden');
    mapDiv.style.display = 'block';
    map.invalidateSize(); // redraw map correctly
  }
  function showResources() {
    tabMap.classList.remove('active');
    tabResources.classList.add('active');
    resourcesPg.classList.remove('hidden');
    mapDiv.style.display = 'none';
  }
  
  // attach listeners
  tabMap.addEventListener('click', showMap);
  tabResources.addEventListener('click', showResources);

  const searchInput = document.getElementById('search-input');
  const searchBtn   = document.getElementById('search-btn');
  
  let searchMarker = null

  // geocode + flyTo helper
  async function geocodeAndFly(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
    const res = await fetch(url, { headers:{'User-Agent':'FireSourceApp/1.0'} })
    const [result] = await res.json()
    if (!result) return alert('no results found')
  
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
  
    if (searchMarker) {
      map.removeLayer(searchMarker)
    }
  
    map.flyTo([lat, lon], 12)
  
    searchMarker = L.marker([lat, lon]).addTo(map)
  }
  
  
  // handle search
  searchBtn.addEventListener('click', () => {
    const q = searchInput.value.trim();
    if (q) geocodeAndFly(q);
  });
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (q) geocodeAndFly(q);
    }
  });

