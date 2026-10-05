/* Navi Admin – generate printable QR codes */
(function () {
    'use strict';
    const base = document.getElementById('baseUrl');
    const filter = document.getElementById('placeFilter');

    function build() {
        const url = base.value.trim().replace(/\/?$/, '/');
        document.querySelectorAll('.qr-card').forEach(card => {
            const box = card.querySelector('.qr-code');
            box.innerHTML = '';
            new QRCode(box, { text: url + card.dataset.path, width: 150, height: 150, correctLevel: QRCode.CorrectLevel.M });
            box.title = url + card.dataset.path;
        });
    }
    function applyFilter() {
        document.querySelectorAll('.qr-card').forEach(card => {
            card.hidden = filter.value !== 'all' && card.dataset.floor !== '0' && card.dataset.floor !== filter.value;
        });
    }
    let t;
    base.addEventListener('input', () => { clearTimeout(t); t = setTimeout(build, 400); });
    filter.addEventListener('change', applyFilter);
    build();
})();
