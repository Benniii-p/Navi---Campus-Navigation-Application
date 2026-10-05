/* Navi – Search Destination screen */
(async function () {
    'use strict';
    const input = document.getElementById('searchInput');
    const results = document.getElementById('results');
    const countEl = document.getElementById('resultCount');
    const params = new URLSearchParams(location.search);
    let category = params.get('category') || '';
    let floor = params.get('floor') || '';
    let all = [];

    try {
        all = await Navi.fetchDestinations();
    } catch (err) {
        countEl.innerHTML = `<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> ${Navi.escapeHtml(err.message)}</span>`;
        return;
    }

    const setActive = (wrap, attr, value) =>
        wrap.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset[attr] === value));

    document.getElementById('categoryFilters').addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        category = b.dataset.category; setActive(e.currentTarget, 'category', category); render();
    });
    document.getElementById('floorFilters').addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        floor = b.dataset.floor; setActive(e.currentTarget, 'floor', floor); render();
    });
    input.addEventListener('input', render);
    setActive(document.getElementById('categoryFilters'), 'category', category);
    setActive(document.getElementById('floorFilters'), 'floor', floor);

    /** Simple relevance score: name matches rank above keyword/description matches. */
    function score(d, terms) {
        const name = d.name.toLowerCase();
        const other = `${d.keywords || ''} ${d.category} ${d.description || ''}`.toLowerCase();
        let s = 0;
        for (const t of terms) {
            if (name.startsWith(t)) s += 5;
            else if (name.includes(t)) s += 3;
            else if (other.includes(t)) s += 1;
            else return 0;               // every word must match somewhere
        }
        return s;
    }

    function render() {
        const q = input.value.trim().toLowerCase();
        const terms = q.split(/\s+/).filter(Boolean);
        let list = all.filter(d => (!category || d.category === category) && (!floor || String(d.floor) === floor));
        if (terms.length) {
            list = list.map(d => ({ d, s: score(d, terms) })).filter(x => x.s > 0)
                .sort((a, b) => b.s - a.s || a.d.name.localeCompare(b.d.name)).map(x => x.d);
        } else {
            list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name, undefined, { numeric: true }));
        }

        const url = new URL(location.href);
        q ? url.searchParams.set('q', input.value.trim()) : url.searchParams.delete('q');
        history.replaceState(null, '', url);

        countEl.textContent = list.length
            ? `${list.length} destination${list.length > 1 ? 's' : ''} found`
            : 'No destination found. Try another word (e.g. "comlab", "cr", "office").';

        results.innerHTML = list.map(d => {
            const c = Navi.category(d.category);
            return `<div class="col-md-6 col-xl-4">
              <div class="card dest-card h-100 border-0 shadow-sm">
                <div class="card-body d-flex gap-3">
                  <span class="dest-icon" style="--c:${c.color}"><i class="bi ${c.icon}"></i></span>
                  <div class="flex-grow-1 min-w-0">
                    <h2 class="h6 fw-bold mb-1">${Navi.escapeHtml(d.name)}</h2>
                    <div class="small mb-2">
                      <span class="badge rounded-pill" style="background:${c.color}">${Navi.escapeHtml(d.category)}</span>
                      <span class="badge rounded-pill text-bg-light border"><i class="bi bi-layers"></i> ${Navi.floorName(d.floor)}</span>
                    </div>
                    <p class="small text-body-secondary mb-1">${Navi.escapeHtml(d.description || '')}</p>
                    ${d.office_hours ? `<p class="small mb-0"><i class="bi bi-clock"></i> ${Navi.escapeHtml(d.office_hours)}</p>` : ''}
                  </div>
                </div>
                <div class="card-footer bg-transparent border-0 pt-0 d-flex gap-2">
                  <a class="btn btn-sm btn-outline-secondary flex-fill" href="map.php?id=${d.id}"><i class="bi bi-eye"></i> View on map</a>
                  <a class="btn btn-sm btn-success flex-fill" href="map.php?to=${d.id}"><i class="bi bi-signpost-2"></i> Directions</a>
                </div>
              </div></div>`;
        }).join('');
    }

    render();
    if (!params.get('category') && !params.get('all')) input.focus();
})();
