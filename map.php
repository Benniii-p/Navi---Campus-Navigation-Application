<?php
$pageTitle    = 'Campus Map';
$activePage   = 'map';
$hideFooter   = true;
$extraScripts = '<script src="assets/js/floorplan.js"></script><script src="assets/js/map.js"></script>';
require __DIR__ . '/includes/header.php';

// Photos of the maps posted around CvSU – Cavite City Campus: [tab id, title, file, note]
$officialMaps = [
    ['site', 'Ground Site Map', 'cvsu-ccc-ground-site-map.webp', 'CvSU-CCC Ground Site Map (Emergency Exit Plan): the whole campus, including the grounds, Quadrangle, Canteen and gates.'],
    ['ground', 'Ground Floor Plan', 'cvsu-ccc-ground-floor-plan.webp', 'As-Built Ground Floor Plan (Contingency / Evacuation Route) of the main building.'],
    ['second', 'Second Floor Plan', 'cvsu-ccc-second-floor-plan.webp', 'CvSU-CCC Second Floor Emergency Exit Plan: classrooms, Library and departments.'],
];
?>

<div class="map-layout">
    <!-- Map -->
    <section class="map-stage">
        <div class="map-toolbar">
            <div class="d-flex flex-column align-items-start gap-2">
            <div class="btn-group shadow-sm" role="group" aria-label="Choose floor" id="floorTabs">
                <button class="btn btn-light active" data-floor="1"><i class="bi bi-1-square"></i> Ground Floor <span class="route-dot"></span></button>
                <button class="btn btn-light" data-floor="2"><i class="bi bi-2-square"></i> Second Floor <span class="route-dot"></span></button>
            </div>
            <button class="btn btn-warning btn-sm shadow-sm fw-semibold" data-bs-toggle="modal" data-bs-target="#officialMaps">
                <i class="bi bi-image"></i> CvSU-CCC Campus Map
            </button>
            </div>
            <div class="btn-group-vertical shadow-sm map-zoom">
                <button class="btn btn-light" id="zoomIn" title="Zoom in" aria-label="Zoom in"><i class="bi bi-plus-lg"></i></button>
                <button class="btn btn-light" id="zoomOut" title="Zoom out" aria-label="Zoom out"><i class="bi bi-dash-lg"></i></button>
                <button class="btn btn-light" id="zoomReset" title="Show whole floor" aria-label="Show whole floor"><i class="bi bi-arrows-fullscreen"></i></button>
                <button class="btn btn-light" id="locateBtn" title="Show my GPS position" aria-label="Show my GPS position"><i class="bi bi-crosshair"></i></button>
            </div>
        </div>
        <svg id="floorSvg" class="floor-svg" role="img" aria-label="Campus floor map"></svg>
        <div class="map-legend small" id="legend"></div>
        <div class="map-hint small"><i class="bi bi-hand-index"></i> Tap a room for details · drag to move · pinch or scroll to zoom</div>
    </section>

    <!-- Side panel -->
    <aside class="map-panel">
        <div class="card border-0 shadow-sm mb-3">
            <div class="card-body">
                <h1 class="h6 fw-bold mb-3"><i class="bi bi-signpost-split text-success"></i> Get directions</h1>
                <div class="route-inputs">
                    <div class="route-row">
                        <span class="route-badge from">A</span>
                        <select id="fromSelect" class="form-select" aria-label="Starting point"></select>
                    </div>
                    <button class="btn btn-sm btn-light swap-btn" id="swapBtn" title="Swap" aria-label="Swap start and destination"><i class="bi bi-arrow-down-up"></i></button>
                    <div class="route-row">
                        <span class="route-badge to">B</span>
                        <select id="toSelect" class="form-select" aria-label="Destination"></select>
                    </div>
                </div>
                <div id="routeSummary" class="route-summary mt-3 d-none"></div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3 d-none" id="placeCard"></div>

        <div class="card border-0 shadow-sm mb-3 d-none" id="stepsCard">
            <div class="card-body">
                <h2 class="h6 fw-bold mb-2"><i class="bi bi-list-ol text-success"></i> Step-by-step</h2>
                <ol class="steps list-unstyled mb-0" id="stepsList"></ol>
            </div>
        </div>

        <div class="alert alert-light border small mb-0" id="mapHelp">
            <i class="bi bi-lightbulb text-warning"></i>
            Choose where you are (<strong>A</strong>) and where you want to go (<strong>B</strong>).
            Scanning a <strong>Navi QR poster</strong> sets your starting point automatically.
        </div>
    </aside>
</div>


<!-- Official CvSU-CCC campus maps (photos of the posted maps) -->
<div class="modal fade" id="officialMaps" tabindex="-1" aria-labelledby="officialMapsLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-md-down">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title h5 fw-bold" id="officialMapsLabel"><i class="bi bi-map text-success"></i> CvSU-CCC Campus Map</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul class="nav nav-pills mb-3 flex-nowrap overflow-auto" role="tablist">
                    <?php foreach ($officialMaps as $i => [$key, $label]): ?>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link text-nowrap <?= $i === 0 ? 'active' : '' ?>" data-bs-toggle="pill" data-bs-target="#om-<?= $key ?>" type="button" role="tab"><?= e($label) ?></button>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <div class="tab-content">
                    <?php foreach ($officialMaps as $i => [$key, $label, $file, $note]): ?>
                        <div class="tab-pane fade <?= $i === 0 ? 'show active' : '' ?>" id="om-<?= $key ?>" role="tabpanel">
                            <p class="small text-body-secondary mb-2"><?= e($note) ?></p>
                            <a href="assets/img/maps/<?= e($file) ?>" target="_blank" rel="noopener" title="Open full size">
                                <img src="assets/img/maps/<?= e($file) ?>" alt="<?= e($label) ?>" class="official-map-img" loading="lazy">
                            </a>
                            <div class="small mt-2"><a href="assets/img/maps/<?= e($file) ?>" target="_blank" rel="noopener"><i class="bi bi-zoom-in"></i> Open full size</a></div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
