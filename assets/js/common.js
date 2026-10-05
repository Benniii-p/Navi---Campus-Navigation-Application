/* Navi – helpers shared by every page */
(function () {
    'use strict';

    const cfg = window.NAVI_CONFIG || { categories: {} };
    let cache = null;

    /** Base URL of the site (works for root pages and /admin pages). */
    function siteBase() {
        const s = document.querySelector('script[src*="assets/js/common.js"]');
        return s ? s.getAttribute('src').replace('assets/js/common.js', '') : '';
    }

    /** Load all destinations from the PHP API (cached for the page). */
    async function fetchDestinations() {
        if (cache) return cache;
        const res = await fetch(siteBase() + 'api/destinations.php', { cache: 'no-store' });
        const data = await res.json().catch(() => ({ error: 'The server returned an invalid response.' }));
        if (!res.ok || data.error) throw new Error(data.error || 'Could not load destinations.');
        cache = data;
        return cache;
    }

    function escapeHtml(text) {
        return String(text ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function category(name) {
        return cfg.categories[name] || { color: '#475569', icon: 'bi-geo' };
    }

    function floorName(floor) {
        return Number(floor) === 2 ? 'Second Floor' : 'Ground Floor';
    }

    /** Distance in meters between two lat/lng points (Haversine formula). */
    function distanceMeters(lat1, lng1, lat2, lng2) {
        const R = 6371000, toRad = d => d * Math.PI / 180;
        const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(a));
    }

    function formatDistance(m) {
        return m >= 1000 ? (m / 1000).toFixed(2) + ' km' : Math.round(m) + ' m';
    }

    /** Small toast message at the bottom of the screen. */
    function toast(message, type = 'dark') {
        let box = document.getElementById('navi-toast-box');
        if (!box) {
            box = document.createElement('div');
            box.id = 'navi-toast-box';
            box.className = 'toast-container position-fixed start-50 translate-middle-x p-3';
            document.body.appendChild(box);
        }
        const el = document.createElement('div');
        el.className = `toast align-items-center text-bg-${type} border-0`;
        el.setAttribute('role', 'status');
        el.innerHTML = `<div class="d-flex"><div class="toast-body">${escapeHtml(message)}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
        box.appendChild(el);
        const t = new bootstrap.Toast(el, { delay: 4000 });
        el.addEventListener('hidden.bs.toast', () => el.remove());
        t.show();
    }

    /** Friendly message for a Geolocation API error. */
    function geoErrorMessage(err) {
        if (!window.isSecureContext) {
            return 'Location only works on https:// or http://localhost. Open Navi through a secure link (see README).';
        }
        switch (err && err.code) {
            case 1: return 'Location permission was denied. Allow location access for this site in your browser settings.';
            case 2: return 'Your location is unavailable. Turn on GPS / Location and try again.';
            case 3: return 'Getting your location took too long. Move to an open area and try again.';
            default: return 'Could not get your location.';
        }
    }

    window.Navi = {
        config: cfg, siteBase, fetchDestinations, escapeHtml, category, floorName,
        distanceMeters, formatDistance, toast, geoErrorMessage
    };
})();
