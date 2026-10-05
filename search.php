<?php
$pageTitle    = 'Search Destination';
$activePage   = 'search';
$extraScripts = '<script src="assets/js/search.js"></script>';
require __DIR__ . '/includes/header.php';
?>

<div class="container py-4">
    <h1 class="h3 fw-bold mb-1"><i class="bi bi-search text-success"></i> Search Destination</h1>
    <p class="text-body-secondary mb-3">Look for classrooms, offices, laboratories and other places in the campus.</p>

    <div class="search-box mb-3">
        <i class="bi bi-search"></i>
        <input type="search" id="searchInput" class="form-control form-control-lg"
               placeholder="Type a place, e.g. registrar, library, comlab, RM 205" autocomplete="off"
               value="<?= e($_GET['q'] ?? '') ?>">
    </div>

    <div class="d-flex flex-wrap gap-2 mb-2" id="categoryFilters">
        <button class="category-chip active" data-category="">All</button>
        <?php foreach (navi_categories() as $name => [$color, $icon]): ?>
            <button class="category-chip" style="--c: <?= e($color) ?>" data-category="<?= e($name) ?>">
                <i class="bi <?= e($icon) ?>"></i> <?= e($name) ?>
            </button>
        <?php endforeach; ?>
    </div>
    <div class="btn-group btn-group-sm mb-3" role="group" aria-label="Floor filter" id="floorFilters">
        <button class="btn btn-outline-success active" data-floor="">All floors</button>
        <button class="btn btn-outline-success" data-floor="1">Ground Floor</button>
        <button class="btn btn-outline-success" data-floor="2">Second Floor</button>
    </div>

    <p class="small text-body-secondary mb-2" id="resultCount" aria-live="polite">Loading destinations…</p>
    <div class="row g-3" id="results"></div>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
