<?php
$pageTitle  = 'Home';
$activePage = 'home';
require __DIR__ . '/includes/header.php';

// Counts per category for the quick buttons
$counts = [];
$total  = 0;
$dbError = null;
try {
    foreach (db()->query('SELECT category, COUNT(*) AS n FROM destinations WHERE is_active = 1 GROUP BY category') as $row) {
        $counts[$row['category']] = (int) $row['n'];
        $total += (int) $row['n'];
    }
    $popular = db()->query("SELECT id, name, category, floor FROM destinations
        WHERE is_active = 1 AND name IN ('Registrar''s Office','Library','Canteen','Administration Office','Clinic','Accounting Office')
        ORDER BY FIELD(name,'Registrar''s Office','Library','Canteen','Administration Office','Clinic','Accounting Office')")->fetchAll();
} catch (PDOException $ex) {
    $dbError = $ex->getMessage();
    $popular = [];
}
$cats = navi_categories();
?>

<section class="hero text-white">
    <div class="container py-4 py-md-5">
        <div class="row align-items-center g-4">
            <div class="col-lg-7">
                <span class="badge rounded-pill hero-badge mb-3"><i class="bi bi-mortarboard"></i> <?= e(CAMPUS_NAME) ?></span>
                <h1 class="display-5 fw-bold mb-2">Find your way around campus.</h1>
                <p class="lead mb-4 opacity-90">Search for classrooms, offices and facilities, see them on the campus map, and get step-by-step directions from the ground floor to the second floor.</p>
                <form action="search.php" method="get" class="hero-search" role="search">
                    <i class="bi bi-search"></i>
                    <input type="search" name="q" class="form-control form-control-lg" placeholder="Where do you want to go? e.g. Registrar, Library, RM 205" aria-label="Search destination" autocomplete="off">
                    <button class="btn btn-warning btn-lg fw-semibold" type="submit">Search</button>
                </form>
            </div>
            <div class="col-lg-5 d-none d-lg-block text-center">
                <img src="assets/img/navi-logo.svg" alt="Navi logo" class="hero-logo">
            </div>
        </div>
    </div>
</section>

<div class="container py-4">
    <?php if ($dbError): ?>
        <div class="alert alert-danger">
            <h5 class="alert-heading"><i class="bi bi-database-x"></i> Cannot connect to the database</h5>
            <p class="mb-1">Make sure <strong>MySQL</strong> is running in the XAMPP Control Panel and that you imported <code>database/navi_db.sql</code> in phpMyAdmin.</p>
            <small class="text-body-secondary"><?= e($dbError) ?></small>
        </div>
    <?php endif; ?>

    <!-- Main screens -->
    <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
            <a href="search.php" class="feature-card">
                <span class="icon bg-primary-subtle text-primary"><i class="bi bi-search"></i></span>
                <strong>Search Destination</strong>
                <small>Find offices, rooms and facilities</small>
            </a>
        </div>
        <div class="col-6 col-lg-3">
            <a href="map.php" class="feature-card">
                <span class="icon bg-success-subtle text-success"><i class="bi bi-map"></i></span>
                <strong>Campus Map</strong>
                <small>Ground &amp; second floor with directions</small>
            </a>
        </div>
        <div class="col-6 col-lg-3">
            <a href="location.php" class="feature-card">
                <span class="icon bg-danger-subtle text-danger"><i class="bi bi-crosshair"></i></span>
                <strong>Current Location</strong>
                <small>Your latitude &amp; longitude</small>
            </a>
        </div>
        <div class="col-6 col-lg-3">
            <a href="search.php?all=1" class="feature-card">
                <span class="icon bg-warning-subtle text-warning-emphasis"><i class="bi bi-list-ul"></i></span>
                <strong>All Destinations</strong>
                <small><?= $total ?> places listed</small>
            </a>
        </div>
    </div>

    <div class="row g-4">
        <div class="col-lg-7">
            <h2 class="h5 fw-bold mb-3">Popular destinations</h2>
            <div class="list-group shadow-sm">
                <?php foreach ($popular as $p): [$color, $icon] = $cats[$p['category']] ?? ['#475569', 'bi-geo']; ?>
                    <a href="map.php?to=<?= (int) $p['id'] ?>" class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3">
                        <span class="dest-icon" style="--c: <?= e($color) ?>"><i class="bi <?= e($icon) ?>"></i></span>
                        <span class="flex-grow-1">
                            <strong class="d-block"><?= e($p['name']) ?></strong>
                            <small class="text-body-secondary"><?= e($p['category']) ?> · <?= floor_name((int) $p['floor']) ?></small>
                        </span>
                        <span class="btn btn-sm btn-outline-success rounded-pill"><i class="bi bi-signpost-2"></i> Directions</span>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="col-lg-5">
            <h2 class="h5 fw-bold mb-3">Browse by category</h2>
            <div class="d-flex flex-wrap gap-2 mb-4">
                <?php foreach ($cats as $name => [$color, $icon]): ?>
                    <a href="search.php?category=<?= urlencode($name) ?>" class="category-chip" style="--c: <?= e($color) ?>">
                        <i class="bi <?= e($icon) ?>"></i> <?= e($name) ?>
                        <span class="count"><?= $counts[$name] ?? 0 ?></span>
                    </a>
                <?php endforeach; ?>
            </div>
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <h3 class="h6 fw-bold"><i class="bi bi-info-circle text-success"></i> How to use Navi</h3>
                    <ol class="small mb-0 ps-3">
                        <li><strong>Search</strong> for the place you need.</li>
                        <li>Tap <strong>Directions</strong> to see it on the campus map.</li>
                        <li>Choose your <strong>starting point</strong> (or scan a Navi QR poster).</li>
                        <li>Follow the green route and the step-by-step guide.</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
