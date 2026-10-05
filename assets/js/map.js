/* Navi – Campus Map screen (floor plans + directions) */
(async function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const fromSel = $('fromSelect'), toSel = $('toSelect');
    const params = new URLSearchParams(location.search);
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage disabled */ } }
    };

    const map = new NaviMap.FloorMap($('floorSvg'), { onSelect: showPlace });
    let destinations = [];
    let route = null;

    // ---- legend ----
    $('legend').innerHTML = Object.entries(Navi.config.categories).map(([name, c]) =>
        `<span><i style="background:${c.color}"></i>${Navi.escapeHtml(name)}</span>`).join('') +
        '<span><i class="lg-route"></i>Route</span>';

    // ---- ?official=site|ground|second opens the CvSU-CCC campus map photos ----
    const official = params.get('official');
    if (official) {
        const tab = document.querySelector(`[data-bs-target="#om-${official}"]`);
        if (tab) bootstrap.Tab.getOrCreateInstance(tab).show();
        bootstrap.Modal.getOrCreateInstance($('officialMaps')).show();
    }
    // When the photos open, show the tab for the floor being viewed
    $('officialMaps').addEventListener('show.bs.modal', () => {
        if (official) return;
        const tab = document.querySelector(`[data-bs-target="#om-${map.floor === 2 ? 'second' : 'site'}"]`);
        if (tab) bootstrap.Tab.getOrCreateInstance(tab).show();
    });

    try {
        destinations = await Navi.fetchDestinations();
    } catch (err) {
        $('mapHelp').className = 'alert alert-danger small mb-0';
        $('mapHelp').innerHTML = `<i class="bi bi-exclamation-triangle"></i> ${Navi.escapeHtml(err.message)}`;
        map.render();
        return;
    }
    const byId = id => destinations.find(d => d.id === Number(id));

    // ---- fill the From / To dropdowns (grouped by floor) ----
    function options(placeholder) {
        let html = `<option value="">${placeholder}</option>`;
        for (const f of [1, 2]) {
            html += `<optgroup label="${Navi.floorName(f)}">`;
            destinations.filter(d => d.floor === f)
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
                .forEach(d => { html += `<option value="${d.id}">${Navi.escapeHtml(d.name)}</option>`; });
            html += '</optgroup>';
        }
        return html;
    }
    fromSel.innerHTML = options('Where are you now?');
    toSel.innerHTML = options('Where do you want to go?');

    // ---- starting values from the URL / QR code ----
    const qrFrom = params.get('from');
    if (qrFrom && byId(qrFrom)) {
        store.set('navi_from', qrFrom);
        Navi.toast(`You are at: ${byId(qrFrom).name}`, 'success');
    }
    const savedFrom = qrFrom || store.get('navi_from');
    const mainGate = destinations.find(d => d.name === 'Main Gate');
    fromSel.value = savedFrom && byId(savedFrom) ? savedFrom : (params.get('to') && mainGate ? mainGate.id : '');
    if (params.get('to')) toSel.value = params.get('to');

    map.setDestinations(destinations);

    // ---- floor tabs ----
    $('floorTabs').addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        setFloor(+b.dataset.floor, true);
    });
    function setFloor(f, fit) {
        map.setFloor(f);
        document.querySelectorAll('#floorTabs button').forEach(b => b.classList.toggle('active', +b.dataset.floor === f));
        if (fit && route && route.floors.includes(f)) map.fitRoute();
    }

    $('zoomIn').onclick = () => map.zoom(1 / 1.3);
    $('zoomOut').onclick = () => map.zoom(1.3);
    $('zoomReset').onclick = () => map.resetView();

    fromSel.addEventListener('change', () => { if (fromSel.value) store.set('navi_from', fromSel.value); update(true); });
    toSel.addEventListener('change', () => update(true));
    $('swapBtn').addEventListener('click', () => {
        [fromSel.value, toSel.value] = [toSel.value, fromSel.value];
        update(true);
    });

    // ---- compute & show the route ----
    function update(fit) {
        const from = byId(fromSel.value), to = byId(toSel.value);
        const url = new URL(location.href);
        ['from', 'to', 'id'].forEach(k => url.searchParams.delete(k));
        if (to) url.searchParams.set('to', to.id);
        history.replaceState(null, '', url);

        route = from && to && from.id !== to.id ? NaviMap.findRoute(from, to) : null;
        map.setMarkers({ from, to, fromId: from?.id, toId: to?.id });
        map.setRoute(route);

        document.querySelectorAll('#floorTabs button').forEach(b =>
            b.classList.toggle('has-route', !!route && route.floors.includes(+b.dataset.floor)));

        const summary = $('routeSummary'), stepsCard = $('stepsCard');
        if (!route) {
            summary.classList.add('d-none');
            stepsCard.classList.add('d-none');
            if (to) { setFloor(to.floor); if (fit) map.focusDestination(to); showPlace(to, true); }
            if (to && !from) Navi.toast('Choose your starting point (A) to see the route.');
            return;
        }

        summary.classList.remove('d-none');
        summary.innerHTML = `
            <div><i class="bi bi-person-walking"></i><strong>${Math.round(route.meters)} m</strong><small>distance</small></div>
            <div><i class="bi bi-clock"></i><strong>~${route.minutes} min</strong><small>walk</small></div>
            <div><i class="bi bi-layers"></i><strong>${route.stairs ? route.stairs + ' stairs' : 'Same floor'}</strong><small>${route.floors.map(f => f === 1 ? 'GF' : '2F').join(' → ')}</small></div>`;

        stepsCard.classList.remove('d-none');
        $('stepsList').innerHTML = route.steps.map((s, i) => `
            <li class="${s.stairs ? 'step-stairs' : ''}" data-floor="${s.floor}">
                <span class="step-icon"><i class="bi ${s.icon}"></i></span>
                <span>${Navi.escapeHtml(s.text)}${s.stairs ? ` <button class="btn btn-link btn-sm p-0 align-baseline" data-goto="${s.floor}">Show ${Navi.floorName(s.floor)}</button>` : ''}</span>
            </li>`).join('');

        showPlace(to, true);
        setFloor(from.floor);
        if (fit) map.fitRoute();
    }

    $('stepsList').addEventListener('click', e => {
        const b = e.target.closest('[data-goto]');
        if (b) setFloor(+b.dataset.goto, true);
    });

    // ---- place details card ----
    function showPlace(d, keepView) {
        map.select(d.id);
        const c = Navi.category(d.category);
        const card = $('placeCard');
        card.classList.remove('d-none');
        card.innerHTML = `<div class="card-body">
            <div class="d-flex gap-3 align-items-start">
              <span class="dest-icon" style="--c:${c.color}"><i class="bi ${c.icon}"></i></span>
              <div class="flex-grow-1">
                <h2 class="h6 fw-bold mb-1">${Navi.escapeHtml(d.name)}</h2>
                <div class="small mb-2">
                  <span class="badge rounded-pill" style="background:${c.color}">${Navi.escapeHtml(d.category)}</span>
                  <span class="badge rounded-pill text-bg-light border"><i class="bi bi-layers"></i> ${Navi.floorName(d.floor)}</span>
                </div>
                <p class="small text-body-secondary mb-1">${Navi.escapeHtml(d.description || '')}</p>
                ${d.office_hours ? `<p class="small mb-0"><i class="bi bi-clock"></i> ${Navi.escapeHtml(d.office_hours)}</p>` : ''}
              </div>
              <button class="btn-close" aria-label="Close" id="closePlace"></button>
            </div>
            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-sm btn-outline-primary flex-fill" id="setFrom"><i class="bi bi-person-standing"></i> I'm here</button>
              <button class="btn btn-sm btn-success flex-fill" id="setTo"><i class="bi bi-signpost-2"></i> Go here</button>
            </div></div>`;
        $('closePlace').onclick = () => { card.classList.add('d-none'); map.select(null); };
        $('setFrom').onclick = () => { fromSel.value = d.id; store.set('navi_from', d.id); update(true); };
        $('setTo').onclick = () => { toSel.value = d.id; update(true); };
        if (!keepView && window.innerWidth < 768) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ---- GPS dot on the ground floor map (needs GEO_POINTS in config.php) ----
    const geo = NaviMap.makeGeoTransform(Navi.config.geoPoints);
    let watchId = null;
    $('locateBtn').addEventListener('click', () => {
        if (!geo) {
            Navi.toast('GPS on the floor map is not set up yet (GEO_POINTS in includes/config.php). Use "My Location" for your coordinates.', 'secondary');
            return;
        }
        if (!navigator.geolocation) { Navi.toast('Your browser does not support location.', 'danger'); return; }
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId); watchId = null; map.setUser(null);
            $('locateBtn').classList.remove('active'); return;
        }
        $('locateBtn').classList.add('active');
        watchId = navigator.geolocation.watchPosition(pos => {
            const p = geo(pos.coords.latitude, pos.coords.longitude);
            const r = pos.coords.accuracy / NaviMap.FLOORS[1].metersPerUnit;
            setFloor(1);
            map.setUser({ x: p.x, y: p.y, r });
        }, err => {
            Navi.toast(Navi.geoErrorMessage(err), 'danger');
            $('locateBtn').classList.remove('active'); watchId = null;
        }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
    });

    // ---- initial view ----
    if (params.get('floor')) setFloor(+params.get('floor'));
    const focus = byId(params.get('id'));
    if (focus) {
        setFloor(focus.floor);
        map.focusDestination(focus);
        showPlace(focus, true);
    }
    update(!focus);
    if (params.get('locate')) $('locateBtn').click();

})();
