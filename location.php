<?php
$pageTitle    = 'Current Location';
$activePage   = 'location';
$extraHead    = '<link rel="stylesheet" href="assets/vendor/leaflet/leaflet.css">';
$extraScripts = '<script src="assets/vendor/leaflet/leaflet.js"></script><script src="assets/js/location.js"></script>';
require __DIR__ . '/includes/header.php';
?>

<div class="container py-4">
    <h1 class="h3 fw-bold mb-1"><i class="bi bi-crosshair text-danger"></i> Current Location</h1>
    <p class="text-body-secondary mb-3">Navi uses your browser's location (GPS / network) to get your latitude and longitude.</p>

    <div class="alert alert-warning d-none" id="secureWarning">
        <i class="bi bi-shield-exclamation"></i>
        <strong>Location is blocked on this link.</strong> Browsers only share location on <code>https://</code> pages or on
        <code>http://localhost</code>. To test on a phone, open Navi through an HTTPS tunnel (see README).
    </div>

    <div class="row g-4">
        <div class="col-lg-5">
            <div class="card border-0 shadow-sm mb-3">
                <div class="card-body">
                    <div class="d-grid gap-2 mb-3">
                        <button class="btn btn-success btn-lg" id="getLocation"><i class="bi bi-geo-alt-fill"></i> Get my location</button>
                        <button class="btn btn-outline-success" id="trackBtn"><i class="bi bi-broadcast"></i> <span>Start live tracking</span></button>
                    </div>
                    <div id="status" class="small text-body-secondary mb-3" aria-live="polite">Press <strong>Get my location</strong> and allow location access.</div>

                    <dl class="coords mb-0">
                        <div><dt>Latitude</dt><dd id="lat">—</dd></div>
                        <div><dt>Longitude</dt><dd id="lng">—</dd></div>
                        <div><dt>Accuracy</dt><dd id="acc">—</dd></div>
                        <div><dt>Updated</dt><dd id="time">—</dd></div>
                    </dl>
                    <div class="d-flex gap-2 mt-3">
                        <button class="btn btn-sm btn-outline-secondary flex-fill" id="copyBtn" disabled><i class="bi bi-clipboard"></i> Copy</button>
                        <a class="btn btn-sm btn-outline-secondary flex-fill disabled" id="gmapsBtn" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> Google Maps</a>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm mb-3" id="campusCard">
                <div class="card-body">
                    <h2 class="h6 fw-bold"><i class="bi bi-mortarboard text-success"></i> <?= e(CAMPUS_NAME) ?></h2>
                    <p class="small text-body-secondary mb-2"><?= e(CAMPUS_ADDRESS) ?></p>
                    <div id="campusStatus" class="small">Distance to campus: —</div>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <h2 class="h6 fw-bold"><i class="bi bi-building text-primary"></i> Inside a building?</h2>
                    <p class="small text-body-secondary">GPS is not exact indoors. Tell Navi where you are to get directions on the floor map.</p>
                    <div class="input-group">
                        <select class="form-select" id="hereSelect" aria-label="Where are you?"><option value="">I am near…</option></select>
                        <button class="btn btn-primary" id="hereBtn"><i class="bi bi-map"></i> Open map</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-7">
            <div class="card border-0 shadow-sm overflow-hidden">
                <div id="leafletMap" class="leaflet-box"></div>
                <div class="card-footer small text-body-secondary bg-white">
                    <span class="me-3"><i class="bi bi-circle-fill text-primary"></i> You</span>
                    <span><i class="bi bi-circle-fill text-success"></i> Campus area</span>
                    <span class="float-end" id="tileNote"></span>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
