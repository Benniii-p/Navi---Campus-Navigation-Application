<?php
$pageTitle    = 'Campus Map';
$activePage   = 'map';
$hideFooter   = true;
$extraScripts = '<script src="assets/js/floorplan.js"></script><script src="assets/js/map.js"></script>';
require __DIR__ . '/includes/header.php';
?>

<div class="map-layout">
    <!-- Map -->
    <section class="map-stage">
        <div class="map-toolbar">
            <div class="btn-group shadow-sm" role="group" aria-label="Choose floor" id="floorTabs">
                <button class="btn btn-light active" data-floor="1"><i class="bi bi-1-square"></i> Ground Floor <span class="route-dot"></span></button>
                <button class="btn btn-light" data-floor="2"><i class="bi bi-2-square"></i> Second Floor <span class="route-dot"></span></button>
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

<?php require __DIR__ . '/includes/footer.php'; ?>
