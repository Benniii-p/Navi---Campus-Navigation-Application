/* Navi – Current Location screen (browser Geolocation API) */
(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const cfg = Navi.config;
    const campus = [cfg.campusLat, cfg.campusLng];
    let last = null, watchId = null, userMarker = null, accCircle = null, firstFix = true;

    if (!window.isSecureContext) $('secureWarning').classList.remove('d-none');

    // ---- Leaflet map (OpenStreetMap tiles need internet) ----
    let map = null;
    if (window.L) {
        map = L.map('leafletMap', { zoomControl: true }).setView(campus, 17);
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        tiles.on('tileerror', () => { $('tileNote').textContent = 'Map tiles need an internet connection.'; });
        L.circle(campus, { radius: cfg.campusRadius, color: '#16a34a', fillOpacity: 0.12 }).addTo(map)
            .bindPopup(Navi.escapeHtml(cfg.campusName));
        L.marker(campus).addTo(map).bindTooltip('CvSU – Cavite City Campus');
    }

    // ---- "Inside a building?" dropdown ----
    Navi.fetchDestinations().then(list => {
        $('hereSelect').innerHTML += list
            .sort((a, b) => a.floor - b.floor || a.name.localeCompare(b.name, undefined, { numeric: true }))
            .map(d => `<option value="${d.id}">${Navi.escapeHtml(d.name)} (${d.floor === 2 ? '2F' : 'GF'})</option>`).join('');
    }).catch(() => { /* the map page shows the database error */ });
    $('hereBtn').onclick = () => {
        const id = $('hereSelect').value;
        location.href = id ? `map.php?from=${id}` : 'map.php';
    };

    // ---- Geolocation ----
    const options = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };

    function setStatus(html, cls = 'text-body-secondary') {
        $('status').className = 'small mb-3 ' + cls;
        $('status').innerHTML = html;
    }

    function onPosition(pos) {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        last = { lat, lng, accuracy };
        $('lat').textContent = lat.toFixed(6);
        $('lng').textContent = lng.toFixed(6);
        $('acc').textContent = `± ${Math.round(accuracy)} m`;
        $('time').textContent = new Date(pos.timestamp).toLocaleTimeString();
        $('copyBtn').disabled = false;
        $('gmapsBtn').classList.remove('disabled');
        $('gmapsBtn').href = `https://www.google.com/maps?q=${lat},${lng}`;
        setStatus(`<i class="bi bi-check-circle-fill"></i> Location found${watchId !== null ? ' · live tracking on' : ''}.`, 'text-success');

        const d = Navi.distanceMeters(lat, lng, campus[0], campus[1]);
        $('campusStatus').innerHTML = d <= cfg.campusRadius
            ? `<span class="badge text-bg-success"><i class="bi bi-check2"></i> You are inside the campus</span>
               <a href="map.php${cfg.geoPoints && cfg.geoPoints.length >= 3 ? '?locate=1' : ''}" class="ms-2">Open campus map →</a>`
            : `Distance to campus: <strong>${Navi.formatDistance(d)}</strong>
               <a class="ms-2" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${campus[0]},${campus[1]}">Directions to campus →</a>`;

        if (map) {
            const ll = [lat, lng];
            if (!userMarker) {
                accCircle = L.circle(ll, { radius: accuracy, color: '#2563eb', weight: 1, fillOpacity: 0.15 }).addTo(map);
                userMarker = L.circleMarker(ll, { radius: 8, color: '#fff', weight: 3, fillColor: '#2563eb', fillOpacity: 1 })
                    .addTo(map).bindTooltip('You are here');
            } else {
                userMarker.setLatLng(ll); accCircle.setLatLng(ll).setRadius(accuracy);
            }
            if (firstFix) {
                map.fitBounds(L.latLngBounds([ll, campus]).pad(0.3), { maxZoom: 18 });
                firstFix = false;
            }
        }
    }

    function onError(err) {
        setStatus(`<i class="bi bi-exclamation-triangle-fill"></i> ${Navi.escapeHtml(Navi.geoErrorMessage(err))}`, 'text-danger');
        stopTracking();
    }

    function supported() {
        if ('geolocation' in navigator) return true;
        setStatus('Your browser does not support the Geolocation API.', 'text-danger');
        return false;
    }

    $('getLocation').onclick = () => {
        if (!supported()) return;
        setStatus('<span class="spinner-border spinner-border-sm"></span> Getting your location…');
        navigator.geolocation.getCurrentPosition(onPosition, onError, options);
    };

    function stopTracking() {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        watchId = null;
        $('trackBtn').classList.replace('btn-danger', 'btn-outline-success');
        $('trackBtn').querySelector('span').textContent = 'Start live tracking';
    }

    $('trackBtn').onclick = () => {
        if (!supported()) return;
        if (watchId !== null) { stopTracking(); setStatus('Live tracking stopped.'); return; }
        setStatus('<span class="spinner-border spinner-border-sm"></span> Starting live tracking…');
        watchId = navigator.geolocation.watchPosition(onPosition, onError, options);
        $('trackBtn').classList.replace('btn-outline-success', 'btn-danger');
        $('trackBtn').querySelector('span').textContent = 'Stop live tracking';
    };

    $('copyBtn').onclick = async () => {
        if (!last) return;
        const text = `${last.lat.toFixed(6)}, ${last.lng.toFixed(6)}`;
        try { await navigator.clipboard.writeText(text); Navi.toast('Copied: ' + text, 'success'); }
        catch (e) { prompt('Copy your coordinates:', text); }
    };
})();
