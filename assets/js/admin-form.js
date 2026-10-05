/* Navi Admin – draw a destination's rectangle and door on the floor map */
(async function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const svg = $('previewSvg');
    const map = new NaviMap.FloorMap(svg, {});
    const num = id => Number($(id).value);
    let others = [];
    try { others = await Navi.fetchDestinations(); } catch (e) { /* preview still works */ }
    const editingId = Number(document.querySelector('input[name="id"]').value);

    function draw() {
        const floor = num('floorField');
        const me = {
            id: -1, name: document.querySelector('[name="name"]').value || 'New place',
            category: document.querySelector('[name="category"]').value, floor,
            x: num('f_x'), y: num('f_y'), w: num('f_w'), h: num('f_h')
        };
        me.door_x = $('f_door_x').value === '' ? me.x + me.w / 2 : num('f_door_x');
        me.door_y = $('f_door_y').value === '' ? me.y + me.h / 2 : num('f_door_y');
        if (map.floor !== floor) map.setFloor(floor);
        map.destinations = others.filter(d => d.id !== editingId).concat(me);
        map.selectedId = -1;
        map.markers = { to: me };
        map.render();
    }

    // "Draw rectangle" (or Ctrl + drag) sets x/y/w/h; "Set door" (or Shift + click) sets the door.
    // These listeners run before the map's own pan handler and stop it.
    const toMap = e => {
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    };
    let start = null;
    svg.addEventListener('pointerdown', e => {
        if ($('doorMode').checked || e.shiftKey) {
            const p = toMap(e);
            $('f_door_x').value = Math.round(p.x); $('f_door_y').value = Math.round(p.y);
            e.stopImmediatePropagation(); draw(); return;
        }
        if (e.ctrlKey || e.metaKey || $('drawMode').checked) { start = toMap(e); e.stopImmediatePropagation(); }
    }, true);
    svg.addEventListener('pointermove', e => {
        if (!start) return;
        e.stopImmediatePropagation();
        const p = toMap(e);
        $('f_x').value = Math.round(Math.min(start.x, p.x)); $('f_y').value = Math.round(Math.min(start.y, p.y));
        $('f_w').value = Math.round(Math.abs(p.x - start.x)); $('f_h').value = Math.round(Math.abs(p.y - start.y));
        draw();
    }, true);
    window.addEventListener('pointerup', () => { start = null; });

    $('destForm').addEventListener('input', draw);
    map.setFloor(num('floorField'));
    draw();
    const me = map.destinations.find(d => d.id === -1);
    if (me) map.focusDestination(me);
})();
