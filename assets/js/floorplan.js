/* =====================================================================
 * Navi – Campus floor plans, route finding and the interactive SVG map
 *
 * The floor layouts below were traced from the posted evacuation plans of
 * CvSU – Cavite City Campus:
 *   Ground Floor : "CvSU-CCC Ground Site Map" + "As-Built Ground Floor Plan"
 *   Second Floor : "CvSU-CCC Second Floor Emergency Exit Plan"
 * Rooms / offices themselves come from the database (api/destinations.php).
 * This file only holds the hallways, stairs and walkways used for routing.
 * ===================================================================== */
(function () {
    'use strict';

    // ---------------------------------------------------------------
    //  Floor layouts
    // ---------------------------------------------------------------
    const FLOORS = {
        1: {
            name: 'Ground Floor',
            viewBox: [80, 390, 1380, 1420],
            metersPerUnit: 0.06,          // about 66 m across the main building
            shapes: [
                { t: 'poly', cls: 'grounds', pts: '105,485 460,420 1428,408 1432,1782 190,1790 190,755 105,755' },
                { t: 'rect', cls: 'other-bldg', x: 135, y: 525, w: 115, h: 195, label: 'Annex' },
                { t: 'rect', cls: 'walkway', x: 215, y: 745, w: 720, h: 790 },
                { t: 'rect', cls: 'walkway', x: 925, y: 695, w: 480, h: 840 },
                { t: 'rect', cls: 'building', x: 240, y: 835, w: 1110, h: 660 },
                { t: 'rect', cls: 'building', x: 940, y: 712, w: 410, h: 270 },
                { t: 'rect', cls: 'garden', x: 720, y: 765, w: 170, h: 280 },
                // hallways
                { t: 'rect', cls: 'corridor', x: 385, y: 850, w: 55, h: 460 },
                { t: 'rect', cls: 'corridor', x: 385, y: 1245, w: 975, h: 65 },
                { t: 'rect', cls: 'corridor', x: 795, y: 1060, w: 80, h: 440 },
                { t: 'rect', cls: 'corridor', x: 440, y: 970, w: 272, h: 15 },
                { t: 'rect', cls: 'corridor', x: 695, y: 980, w: 33, h: 300 },
                { t: 'rect', cls: 'corridor', x: 895, y: 700, w: 50, h: 370 },
                { t: 'rect', cls: 'corridor', x: 945, y: 975, w: 405, h: 30 },
                { t: 'rect', cls: 'corridor', x: 940, y: 700, w: 410, h: 20 },
                { t: 'rect', cls: 'corridor', x: 1345, y: 980, w: 45, h: 330 },
                // stairs
                { t: 'rect', cls: 'stairs', x: 300, y: 842, w: 85, h: 40, label: 'Stairs' },
                { t: 'rect', cls: 'stairs', x: 880, y: 1085, w: 60, h: 110, label: 'Stairs' },
                { t: 'rect', cls: 'stairs', x: 1272, y: 1380, w: 73, h: 100, label: 'Stairs' },
                // outdoor paths
                { t: 'line', cls: 'path', pts: '290,640 1385,640' },
                { t: 'line', cls: 'path', pts: '805,640 805,765' },
                { t: 'line', cls: 'path', pts: '891,480 891,640' },
                { t: 'line', cls: 'path', pts: '1036,480 1036,640' },
                { t: 'line', cls: 'path', pts: '1161,480 1161,640' },
                { t: 'line', cls: 'path', pts: '1300,457 1300,640' },
                { t: 'line', cls: 'path', pts: '1385,457 1385,640' },
                { t: 'line', cls: 'path', pts: '230,1520 1385,1520' },
                { t: 'line', cls: 'path', pts: '405,1520 405,1770' },
                { t: 'line', cls: 'path', pts: '835,1500 835,1770' },
                { t: 'line', cls: 'path', pts: '1255,1520 1255,1770' },
                { t: 'line', cls: 'path', pts: '1368,1310 1368,1520' },
                { t: 'text', cls: 'area-label', x: 640, y: 560, text: 'Open Grounds' },
                { t: 'text', cls: 'area-label', x: 620, y: 1650, text: 'Front Grounds / Parking' },
                { t: 'text', cls: 'area-label small', x: 600, y: 1290, text: 'Main Hallway' },
                { t: 'text', cls: 'area-label small', x: 835, y: 1236, text: 'Lobby', vertical: false }
            ],
            nodes: {
                g_s1: [342, 862], g_w1: [412, 862], g_w2: [412, 978], g_w3: [412, 1120],
                g_h1: [412, 1278], g_h2: [525, 1278], g_h3: [712, 1278], g_h4: [835, 1278],
                g_h5: [1000, 1278], g_h6: [1180, 1278], g_h7: [1308, 1278], g_h8: [1368, 1278],
                g_i2: [712, 978],
                g_l1: [835, 1072], g_l2: [835, 1140], g_l3: [835, 1480], g_l4: [835, 1520],
                g_s2: [910, 1140], g_s3: [1308, 1430],
                g_e1: [918, 1060], g_e2: [918, 990], g_e3: [1100, 990], g_e4: [1368, 990],
                g_e5: [918, 708], g_e6: [1350, 708],
                g_c1: [805, 1045], g_c2: [805, 900], g_c3: [805, 765],
                g_n0: [290, 640], g_n1: [805, 640], g_n2: [891, 640], g_n3: [1036, 640],
                g_n4: [1161, 640], g_n5: [1300, 640], g_n6: [1385, 640],
                g_la: [891, 490], g_lb: [1036, 490], g_lc: [1161, 490], g_m: [1300, 465], g_wm: [1385, 465],
                g_x2: [1368, 1520], g_p0: [405, 1520], g_p2: [1255, 1520],
                g_gw: [405, 1770], g_gm: [835, 1770], g_ge: [1255, 1770]
            },
            edges: [
                ['g_s1', 'g_w1'], ['g_w1', 'g_w2'], ['g_w2', 'g_w3'], ['g_w3', 'g_h1'],
                ['g_h1', 'g_h2'], ['g_h2', 'g_h3'], ['g_h3', 'g_h4'], ['g_h4', 'g_h5'],
                ['g_h5', 'g_h6'], ['g_h6', 'g_h7'], ['g_h7', 'g_h8'],
                ['g_w2', 'g_i2'], ['g_i2', 'g_h3'],
                ['g_l1', 'g_l2'], ['g_l2', 'g_h4'], ['g_h4', 'g_l3'], ['g_l3', 'g_l4'],
                ['g_l2', 'g_s2'], ['g_h7', 'g_s3'],
                ['g_l1', 'g_e1'], ['g_e1', 'g_e2'], ['g_e2', 'g_e3'], ['g_e3', 'g_e4'],
                ['g_e2', 'g_e5'], ['g_e5', 'g_e6'], ['g_e4', 'g_h8'],
                ['g_l1', 'g_c1'], ['g_c1', 'g_c2'], ['g_c2', 'g_c3'], ['g_c3', 'g_n1'],
                ['g_n0', 'g_n1'], ['g_n1', 'g_n2'], ['g_n2', 'g_n3'], ['g_n3', 'g_n4'],
                ['g_n4', 'g_n5'], ['g_n5', 'g_n6'], ['g_e5', 'g_n2'],
                ['g_n2', 'g_la'], ['g_n3', 'g_lb'], ['g_n4', 'g_lc'], ['g_n5', 'g_m'], ['g_n6', 'g_wm'],
                ['g_h8', 'g_x2'], ['g_x2', 'g_p2'], ['g_p2', 'g_l4'], ['g_l4', 'g_p0'],
                ['g_p0', 'g_gw'], ['g_l4', 'g_gm'], ['g_p2', 'g_ge']
            ]
        },
        2: {
            name: 'Second Floor',
            viewBox: [0, 0, 1200, 860],
            metersPerUnit: 0.06,
            shapes: [
                { t: 'poly', cls: 'building', pts: '30,22 200,22 200,84 384,84 384,316 1170,316 1170,840 30,840' },
                { t: 'rect', cls: 'corridor', x: 152, y: 40, w: 48, h: 508 },
                { t: 'rect', cls: 'corridor', x: 152, y: 492, w: 1008, h: 112 },
                { t: 'rect', cls: 'corridor', x: 472, y: 604, w: 32, h: 192 },
                { t: 'rect', cls: 'stairs', x: 632, y: 324, w: 72, h: 168, label: 'Stairs' },
                { t: 'rect', cls: 'stairs', x: 1072, y: 604, w: 88, h: 192, label: 'Stairs' },
                { t: 'text', cls: 'area-label small', x: 760, y: 554, text: 'Hallway' },
                { t: 'text', cls: 'area-label', x: 760, y: 190, text: 'Second Floor' }
            ],
            nodes: {
                f_w0: [148, 50], f_w1: [176, 90], f_w2: [176, 300],
                f_h1: [176, 548], f_h2: [312, 548], f_h3: [488, 548], f_h4: [668, 548],
                f_h5: [830, 548], f_h6: [1000, 548], f_h7: [1116, 548], f_h8: [1175, 548],
                f_s2: [668, 420], f_p1: [488, 796], f_s3: [1116, 700]
            },
            edges: [
                ['f_w0', 'f_w1'], ['f_w1', 'f_w2'], ['f_w2', 'f_h1'],
                ['f_h1', 'f_h2'], ['f_h2', 'f_h3'], ['f_h3', 'f_h4'], ['f_h4', 'f_h5'],
                ['f_h5', 'f_h6'], ['f_h6', 'f_h7'], ['f_h7', 'f_h8'],
                ['f_h4', 'f_s2'], ['f_h3', 'f_p1'], ['f_h7', 'f_s3']
            ]
        }
    };

    // Stairs that connect the two floors (west, central, east)
    const STAIR_LINKS = [['g_s1', 'f_w0'], ['g_s2', 'f_s2'], ['g_s3', 'f_s3']];
    const STAIR_NODES = new Set(STAIR_LINKS.flat());
    const STAIR_COST = 250;   // extra cost for climbing one floor (≈ 15 m of walking)

    // ---------------------------------------------------------------
    //  Graph + route finding (Dijkstra)
    // ---------------------------------------------------------------
    function baseGraph() {
        const nodes = {}, adj = {};
        const link = (a, b, w, stairs) => {
            (adj[a] = adj[a] || []).push({ to: b, w, stairs });
            (adj[b] = adj[b] || []).push({ to: a, w, stairs });
        };
        for (const [floor, f] of Object.entries(FLOORS)) {
            for (const [id, [x, y]] of Object.entries(f.nodes)) nodes[id] = { x, y, floor: +floor };
        }
        for (const f of Object.values(FLOORS)) {
            for (const [a, b] of f.edges) link(a, b, dist(nodes[a], nodes[b]));
        }
        for (const [a, b] of STAIR_LINKS) link(a, b, STAIR_COST, true);
        return { nodes, adj, link };
    }

    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

    function project(p, a, b) {
        const dx = b.x - a.x, dy = b.y - a.y, len2 = dx * dx + dy * dy;
        let t = len2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2 : 0;
        t = Math.max(0, Math.min(1, t));
        const q = { x: a.x + t * dx, y: a.y + t * dy };
        return { q, d: dist(p, q) };
    }

    /** Connect a destination's door to the nearest hallway segment. */
    function attach(g, dest, tag) {
        const floor = Number(dest.floor);
        const door = { x: Number(dest.door_x), y: Number(dest.door_y), floor };
        let best = null;
        for (const [a, b] of FLOORS[floor].edges) {
            if (STAIR_NODES.has(a) || STAIR_NODES.has(b)) continue;
            const r = project(door, g.nodes[a], g.nodes[b]);
            if (!best || r.d < best.d) best = { ...r, a, b };
        }
        const p = tag + '_p';
        g.nodes[tag] = door;
        g.nodes[p] = { x: best.q.x, y: best.q.y, floor };
        g.link(tag, p, best.d);
        g.link(p, best.a, dist(best.q, g.nodes[best.a]));
        g.link(p, best.b, dist(best.q, g.nodes[best.b]));
        return { edge: best.a + '|' + best.b, p };
    }

    /**
     * Shortest walking route between two destinations.
     * Returns { points:[{x,y,floor}], meters, stairs, steps:[...], floors:[...] } or null.
     */
    function findRoute(from, to) {
        if (!from || !to) return null;
        const g = baseGraph();
        const A = attach(g, from, '__from');
        const B = attach(g, to, '__to');
        if (A.edge === B.edge) g.link(A.p, B.p, dist(g.nodes[A.p], g.nodes[B.p]));

        // Dijkstra
        const D = {}, prev = {}, done = new Set();
        for (const id in g.nodes) D[id] = Infinity;
        D.__from = 0;
        while (true) {
            let u = null;
            for (const id in D) if (!done.has(id) && D[id] < Infinity && (u === null || D[id] < D[u])) u = id;
            if (u === null || u === '__to') break;
            done.add(u);
            for (const e of g.adj[u] || []) {
                const nd = D[u] + e.w;
                if (nd < D[e.to]) { D[e.to] = nd; prev[e.to] = u; }
            }
        }
        if (D.__to === Infinity) return null;

        const ids = [];
        for (let id = '__to'; id; id = prev[id]) ids.unshift(id);
        const points = ids.map(id => ({ ...g.nodes[id], id }));

        let meters = 0, stairs = 0;
        for (let i = 1; i < points.length; i++) {
            if (points[i].floor !== points[i - 1].floor) stairs++;
            else meters += dist(points[i], points[i - 1]) * FLOORS[points[i].floor].metersPerUnit;
        }
        const floors = [...new Set(points.map(p => p.floor))];
        return {
            points, meters, stairs, floors,
            minutes: Math.max(1, Math.round((meters / 1.2 + stairs * 20) / 60)),
            steps: buildSteps(points, from, to)
        };
    }

    /** Turn the route points into simple turn-by-turn instructions. */
    function buildSteps(pts, from, to) {
        const fname = f => FLOORS[f].name;
        const steps = [{ icon: 'bi-geo-alt-fill', floor: pts[0].floor, text: `Start at ${from.name} (${fname(from.floor)}).` }];
        let prevDir = null, walk = null;
        for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1], b = pts[i];
            if (a.floor !== b.floor) {
                const up = b.floor > a.floor;
                steps.push({ icon: up ? 'bi-arrow-up-square-fill' : 'bi-arrow-down-square-fill', floor: b.floor, stairs: true,
                    text: `Take the stairs ${up ? 'up' : 'down'} to the ${fname(b.floor)}.` });
                prevDir = null; walk = null;
                continue;
            }
            const len = dist(a, b);
            if (len < 1) continue;
            const dir = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
            if (walk && prevDir && dir.x * prevDir.x + dir.y * prevDir.y > 0.94) {
                walk.len += len; prevDir = dir; continue;
            }
            let turn = '';
            if (prevDir) {
                const dot = dir.x * prevDir.x + dir.y * prevDir.y;
                const cross = prevDir.x * dir.y - prevDir.y * dir.x;   // SVG y-axis points down
                turn = dot < -0.7 ? 'around' : (cross > 0 ? 'right' : 'left');
            }
            walk = { kind: 'walk', turn, len, floor: a.floor };
            steps.push(walk);
            prevDir = dir;
        }
        const out = [];
        for (const s of steps) {
            if (s.kind !== 'walk') { out.push(s); continue; }
            const m = Math.round(s.len * FLOORS[s.floor].metersPerUnit);
            if (m < 2 && out.length > 1) continue;       // skip tiny moves
            const icon = { left: 'bi-arrow-left', right: 'bi-arrow-right', around: 'bi-arrow-counterclockwise' }[s.turn] || 'bi-arrow-up';
            const verb = s.turn === 'around' ? 'Turn around and walk' : s.turn ? `Turn ${s.turn} and walk` : 'Walk straight';
            out.push({ icon, floor: s.floor, text: `${verb} about ${Math.max(1, m)} m.` });
        }
        out.push({ icon: 'bi-flag-fill', floor: to.floor, text: `Arrive at ${to.name} (${fname(to.floor)}).` });
        return out;
    }

    // ---------------------------------------------------------------
    //  Optional GPS → map conversion (affine transform from 3 points)
    // ---------------------------------------------------------------
    function makeGeoTransform(points) {
        if (!Array.isArray(points) || points.length < 3) return null;
        const [p1, p2, p3] = points.map(p => ({ x: +p.x, y: +p.y, lat: +p.lat, lng: +p.lng }));
        const det = p1.lat * (p2.lng - p3.lng) - p1.lng * (p2.lat - p3.lat) + (p2.lat * p3.lng - p3.lat * p2.lng);
        if (Math.abs(det) < 1e-14) return null;
        const solve = (v1, v2, v3) => [
            (v1 * (p2.lng - p3.lng) - p1.lng * (v2 - v3) + (v2 * p3.lng - v3 * p2.lng)) / det,
            (p1.lat * (v2 - v3) - v1 * (p2.lat - p3.lat) + (p2.lat * v3 - p3.lat * v2)) / det,
            (p1.lat * (p2.lng * v3 - p3.lng * v2) - p1.lng * (p2.lat * v3 - p3.lat * v2) + v1 * (p2.lat * p3.lng - p3.lat * p2.lng)) / det
        ];
        const X = solve(p1.x, p2.x, p3.x), Y = solve(p1.y, p2.y, p3.y);
        return (lat, lng) => ({ x: X[0] * lat + X[1] * lng + X[2], y: Y[0] * lat + Y[1] * lng + Y[2] });
    }

    // ---------------------------------------------------------------
    //  Interactive SVG map
    // ---------------------------------------------------------------
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function wrapWords(words, maxChars) {
        const lines = [];
        let line = '';
        for (const w of words) {
            if (w.length > maxChars) return null;
            if (!line) line = w;
            else if ((line + ' ' + w).length <= maxChars) line += ' ' + w;
            else { lines.push(line); line = w; }
        }
        if (line) lines.push(line);
        return lines;
    }

    function fitLabel(text, w, h) {
        const words = text.split(/\s+/);
        for (let fs = Math.min(17, h * 0.42); fs >= 6; fs -= 0.5) {
            const maxChars = Math.floor((w - 6) / (fs * 0.56));
            if (maxChars < 2) continue;
            const lines = wrapWords(words, maxChars);
            if (lines && lines.length * fs * 1.12 <= h - 4) return { fs, lines };
        }
        return null;
    }

    function textBlock(x, y, lines, fs, cls) {
        const lh = fs * 1.12, top = y - ((lines.length - 1) * lh) / 2;
        return `<text class="${cls}" x="${x}" y="${top}" font-size="${fs.toFixed(1)}">` +
            lines.map((l, i) => `<tspan x="${x}" dy="${i ? lh.toFixed(1) : 0}">${esc(l)}</tspan>`).join('') + '</text>';
    }

    class FloorMap {
        constructor(svg, options = {}) {
            this.svg = svg;
            this.floor = 1;
            this.destinations = [];
            this.route = null;
            this.markers = {};
            this.selectedId = null;
            this.user = null;
            this.onSelect = options.onSelect || (() => {});
            this.vb = null;
            this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            this._bindPanZoom();
        }

        setDestinations(list) { this.destinations = list; this.render(); }

        setFloor(floor) {
            floor = Number(floor) === 2 ? 2 : 1;
            if (floor !== this.floor || !this.vb) {
                this.floor = floor;
                this.resetView(false);
            }
            this.render();
        }

        setRoute(route) { this.route = route; this.render(); }
        setMarkers(m) { this.markers = m || {}; this.render(); }
        select(id) { this.selectedId = id; this.render(); }
        setUser(pos) { this.user = pos; this.render(); }

        resetView(apply = true) {
            const [x, y, w, h] = FLOORS[this.floor].viewBox;
            this.vb = { x, y, w, h };
            if (apply) this._applyView();
        }

        /** Zoom to a rectangle (map units) with some padding. */
        fitTo(x1, y1, x2, y2, pad = 80) {
            const base = FLOORS[this.floor].viewBox;
            let w = Math.max(x2 - x1 + pad * 2, base[2] / 3.2);
            let h = Math.max(y2 - y1 + pad * 2, base[3] / 3.2);
            const r = this.svg.clientWidth / Math.max(1, this.svg.clientHeight) || 1;
            if (w / h < r) w = h * r; else h = w / r;
            this.vb = { x: (x1 + x2) / 2 - w / 2, y: (y1 + y2) / 2 - h / 2, w, h };
            this._applyView();
        }

        focusDestination(d) {
            if (Number(d.floor) !== this.floor) this.setFloor(d.floor);
            this.fitTo(d.x, d.y, d.x + d.w, d.y + d.h, 120);
        }

        fitRoute() {
            if (!this.route) return;
            const pts = this.route.points.filter(p => p.floor === this.floor);
            if (!pts.length) return;
            const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
            this.fitTo(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 140);
        }

        zoom(factor, cx, cy) {
            const base = FLOORS[this.floor].viewBox;
            const nw = Math.min(base[2] * 1.4, Math.max(base[2] / 10, this.vb.w * factor));
            const f = nw / this.vb.w;
            if (cx === undefined) { cx = this.vb.x + this.vb.w / 2; cy = this.vb.y + this.vb.h / 2; }
            this.vb = { x: cx - (cx - this.vb.x) * f, y: cy - (cy - this.vb.y) * f, w: this.vb.w * f, h: this.vb.h * f };
            this._applyView();
        }

        _applyView() {
            const v = this.vb;
            this.svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
        }

        render() {
            if (!this.vb) this.resetView(false);
            const F = FLOORS[this.floor];
            let html = '<g class="layer-static">';
            for (const s of F.shapes) {
                if (s.t === 'rect') {
                    html += `<rect class="${s.cls}" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="2"/>`;
                    if (s.label) {
                        const fit = fitLabel(s.label, s.w, s.h);
                        if (fit) html += textBlock(s.x + s.w / 2, s.y + s.h / 2, fit.lines, fit.fs, 'static-label');
                    }
                } else if (s.t === 'poly') {
                    html += `<polygon class="${s.cls}" points="${s.pts}"/>`;
                } else if (s.t === 'line') {
                    html += `<polyline class="${s.cls}" points="${s.pts}"/>`;
                } else if (s.t === 'text') {
                    html += `<text class="${s.cls}" x="${s.x}" y="${s.y}">${esc(s.text)}</text>`;
                }
            }
            html += '</g><g class="layer-rooms">';

            const onFloor = this.destinations.filter(d => Number(d.floor) === this.floor);
            const routeIds = [this.markers.fromId, this.markers.toId].map(Number);
            for (const d of onFloor) {
                const cat = (window.NAVI_CONFIG?.categories || {})[d.category] || { color: '#475569' };
                const garden = /quadrangle/i.test(d.name);
                const cls = ['room', garden ? 'room-garden' : '',
                    d.id === this.selectedId ? 'selected' : '',
                    routeIds.includes(d.id) ? 'on-route' : ''].join(' ');
                html += `<g class="${cls}" data-id="${d.id}" style="--c:${cat.color}">` +
                    `<title>${esc(d.name)}</title>` +
                    `<rect x="${d.x}" y="${d.y}" width="${d.w}" height="${d.h}" rx="3"/>`;
                const fit = fitLabel(d.name, d.w, d.h);
                if (fit) html += textBlock(d.x + d.w / 2, d.y + d.h / 2, fit.lines, fit.fs, 'room-label');
                html += '</g>';
            }
            html += '</g><g class="layer-route">';

            if (this.route) {
                // draw each continuous run of points on this floor
                let run = [];
                const flush = () => {
                    if (run.length > 1) {
                        const pts = run.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
                        html += `<polyline class="route-casing" points="${pts}"/><polyline class="route-line" points="${pts}"/>`;
                    }
                    run = [];
                };
                const P = this.route.points;
                P.forEach((p, i) => {
                    if (p.floor === this.floor) run.push(p); else flush();
                    // stairs badge where the route changes floor
                    const next = P[i + 1];
                    if (next && next.floor !== p.floor && p.floor === this.floor) {
                        const up = next.floor > p.floor;
                        html += `<g class="stairs-badge" transform="translate(${p.x},${p.y})">` +
                            `<rect x="-44" y="-40" width="88" height="28" rx="14"/>` +
                            `<text y="-21">${up ? '▲ 2nd Floor' : '▼ Ground'}</text></g>`;
                    }
                });
                flush();
            }
            html += '</g><g class="layer-markers">';

            const pin = (d, cls, label) => {
                if (!d || Number(d.floor) !== this.floor) return '';
                return `<g class="pin ${cls}" transform="translate(${d.door_x},${d.door_y})">` +
                    `<path d="M0 0 C-4 -10 -16 -18 -16 -30 A16 16 0 1 1 16 -30 C16 -18 4 -10 0 0Z"/>` +
                    `<text y="-25">${label}</text></g>`;
            };
            html += pin(this.markers.from, 'pin-from', 'A');
            html += pin(this.markers.to, 'pin-to', 'B');

            if (this.user && this.floor === 1) {
                html += `<g class="user-dot" transform="translate(${this.user.x},${this.user.y})">` +
                    `<circle class="acc" r="${Math.max(12, this.user.r || 0)}"/><circle class="pulse" r="14"/><circle class="dot" r="9"/></g>`;
            }
            html += '</g>';
            this.svg.innerHTML = html;
            this._applyView();
        }

        _bindPanZoom() {
            const svg = this.svg;
            const pointers = new Map();
            let moved = 0, downTarget = null, pinchDist = 0;

            const toMap = (clientX, clientY) => {
                const pt = svg.createSVGPoint();
                pt.x = clientX; pt.y = clientY;
                const m = svg.getScreenCTM();
                return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 };
            };
            const scale = () => {
                const r = svg.getBoundingClientRect();
                return Math.max(this.vb.w / r.width, this.vb.h / r.height);
            };

            svg.addEventListener('wheel', e => {
                e.preventDefault();
                const p = toMap(e.clientX, e.clientY);
                this.zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15, p.x, p.y);
            }, { passive: false });

            svg.addEventListener('pointerdown', e => {
                svg.setPointerCapture(e.pointerId);
                pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
                if (pointers.size === 1) { moved = 0; downTarget = e.target.closest('[data-id]'); }
                if (pointers.size === 2) {
                    const [a, b] = [...pointers.values()];
                    pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
                }
            });

            svg.addEventListener('pointermove', e => {
                if (!pointers.has(e.pointerId)) return;
                const last = pointers.get(e.pointerId);
                const now = { x: e.clientX, y: e.clientY };
                if (pointers.size === 1) {
                    const s = scale();
                    this.vb.x -= (now.x - last.x) * s;
                    this.vb.y -= (now.y - last.y) * s;
                    moved += Math.abs(now.x - last.x) + Math.abs(now.y - last.y);
                    this._applyView();
                }
                pointers.set(e.pointerId, now);
                if (pointers.size === 2) {
                    const [a, b] = [...pointers.values()];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (pinchDist) {
                        const mid = toMap((a.x + b.x) / 2, (a.y + b.y) / 2);
                        this.zoom(pinchDist / d, mid.x, mid.y);
                    }
                    pinchDist = d;
                    moved = 99;
                }
            });

            const up = e => {
                if (!pointers.has(e.pointerId)) return;
                pointers.delete(e.pointerId);
                if (pointers.size < 2) pinchDist = 0;
                if (pointers.size === 0 && moved < 8 && downTarget) {
                    const id = Number(downTarget.getAttribute('data-id'));
                    const d = this.destinations.find(x => x.id === id);
                    if (d) this.onSelect(d);
                }
                if (pointers.size === 0) downTarget = null;
            };
            svg.addEventListener('pointerup', up);
            svg.addEventListener('pointercancel', up);
        }
    }

    window.NaviMap = { FLOORS, findRoute, FloorMap, makeGeoTransform };
})();
