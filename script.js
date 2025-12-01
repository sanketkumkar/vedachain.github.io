/* Demo counts animation */
function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  if(!obj) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

animateValue('totalTx', 0, 0, 800);
animateValue('activeBatches', 0, 0, 800);
animateValue('nodesCount', 0, 5, 900);

/* Donut chart (Chart.js) */
(function(){
  const canvas = document.getElementById('donutChart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const donut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Compliant','Warning','Non-compliant'],
      datasets: [{
        data: [72, 18, 10],
        backgroundColor: ['#10b981','#f59e0b','#ef4444'],
        hoverOffset: 6,
        borderWidth: 0
      }]
    },
    options: {
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: {
          label: function(ctx) {
            const v = ctx.formattedValue || ctx.raw;
            return ctx.label + ': ' + v + '%';
          }
        } }
      },
      maintainAspectRatio: false
    }
  });
})();

/* Export CSV demo */
(function(){
  const btn = document.getElementById('exportBtn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    const rows = [
      ['id','type','status','timestamp'],
      ['BATCH-001','collection','compliant','2025-01-12 08:10'],
      ['BATCH-002','processing','warning','2025-01-12 09:02']
    ];
    let csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'vedachain_export.csv'; a.style.display = 'none';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
})();

/* GPS capture for farmer page */
(function(){
  const btn = document.getElementById('captureGPS');
  const out = document.getElementById('gpsOutput');
  if(!btn) return;
  btn.addEventListener('click', function(){
    if(!navigator.geolocation){
      out.textContent = 'Geolocation not supported in this browser.';
      return;
    }
    out.textContent = 'Requesting location…';
    navigator.geolocation.getCurrentPosition(function(pos){
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      out.textContent = `Lat: ${lat}, Lon: ${lon}`;
      out.style.color = '#0b5d45';
      // store into hidden inputs or localStorage as needed
      try{ localStorage.setItem('vedachain_last_location', JSON.stringify({lat,lon,t:Date.now()})); }catch(e){}
    }, function(err){
      out.textContent = 'Could not get location: ' + (err.message || 'error');
      out.style.color = '#d9534f';
    }, { enableHighAccuracy: true, timeout: 10000 });
  });
})();

/* Commit to blockchain (demo placeholder) */
(function(){
  const commit = document.getElementById('commitBtn');
  if(!commit) return;
  commit.addEventListener('click', function(){
    const batchId = document.getElementById('batchId') ? document.getElementById('batchId').value : '';
    const species = document.getElementById('species') ? document.getElementById('species').value : '';
    const quantity = document.getElementById('quantity') ? document.getElementById('quantity').value : '';
    const location = localStorage.getItem('vedachain_last_location') || null;
    if(!location){
      alert('Please capture GPS location before committing.');
      return;
    }
    alert('Demo: would commit to blockchain.\nBatch: ' + batchId + '\nSpecies: ' + species + '\nQuantity: ' + quantity + '\nLocation: ' + location);
  });
})();
