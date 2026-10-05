<?php
require_once __DIR__ . '/auth.php';
require_login();

$rows = db()->query('SELECT id, name, floor FROM destinations WHERE is_active = 1 ORDER BY floor, name')->fetchAll();

// Guess the public folder URL, e.g. http://192.168.1.5/navi/
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$folder = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/\\') . '/';
$guess  = PUBLIC_BASE_URL !== '' ? rtrim(PUBLIC_BASE_URL, '/') . '/' : $scheme . '://' . $_SERVER['HTTP_HOST'] . $folder;

$pageTitle    = 'QR Posters';
$base         = '../';
$extraScripts = '<script src="../assets/vendor/qrcode/qrcode.min.js"></script><script src="../assets/js/admin-qr.js"></script>';
require __DIR__ . '/../includes/header.php';
?>
<div class="container py-4">
    <div class="no-print">
        <?php admin_nav('qr.php'); ?>
        <h1 class="h4 fw-bold">QR code posters</h1>
        <p class="text-body-secondary small mb-3">
            Print and post these at each place. Scanning a poster opens Navi with that place already set as the
            <strong>starting point</strong>. The link must be one that phones can open (not <code>localhost</code>) –
            use your HTTPS tunnel or hosting link.
        </p>
        <div class="row g-2 align-items-end mb-4">
            <div class="col-md-6">
                <label class="form-label small mb-0" for="baseUrl">Public link of Navi</label>
                <input id="baseUrl" class="form-control" value="<?= e($guess) ?>">
            </div>
            <div class="col-md-4">
                <label class="form-label small mb-0" for="placeFilter">Show</label>
                <select id="placeFilter" class="form-select">
                    <option value="all">All places</option>
                    <option value="1">Ground Floor only</option>
                    <option value="2">Second Floor only</option>
                </select>
            </div>
            <div class="col-md-2 d-grid">
                <button class="btn btn-success" onclick="window.print()"><i class="bi bi-printer"></i> Print</button>
            </div>
        </div>
        <?php if (str_contains($guess, 'localhost') || str_contains($guess, '127.0.0.1')): ?>
            <div class="alert alert-warning small"><i class="bi bi-exclamation-triangle"></i> The link above uses <strong>localhost</strong>, which will not open on phones. Replace it with your tunnel / hosting link before printing.</div>
        <?php endif; ?>
    </div>

    <div class="qr-grid" id="qrGrid">
        <div class="qr-card" data-floor="0" data-path="index.php">
            <div class="qr-title">Navi</div>
            <div class="qr-code"></div>
            <div class="qr-place">Campus Navigation Web App</div>
            <small>Scan to search destinations</small>
        </div>
        <?php foreach ($rows as $r): ?>
            <div class="qr-card" data-floor="<?= (int) $r['floor'] ?>" data-path="map.php?from=<?= (int) $r['id'] ?>">
                <div class="qr-title"><i class="bi bi-geo-alt-fill"></i> You are here</div>
                <div class="qr-code"></div>
                <div class="qr-place"><?= e($r['name']) ?></div>
                <small><?= floor_name((int) $r['floor']) ?> · Scan for directions with Navi</small>
            </div>
        <?php endforeach; ?>
    </div>
</div>
<?php require __DIR__ . '/../includes/footer.php'; ?>
