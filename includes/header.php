<?php
/**
 * Shared page header.
 * Set before including:  $pageTitle, $activePage ('home'|'search'|'map'|'location'),
 * optional $base ('' for root pages, '../' for admin pages) and $extraHead (HTML).
 */
require_once __DIR__ . '/db.php';
$base       = $base ?? '';
$activePage = $activePage ?? '';
$pageTitle  = $pageTitle ?? APP_NAME;
$navItems = [
    'home'     => ['index.php',    'bi-house-door', 'Home'],
    'search'   => ['search.php',   'bi-search',     'Search'],
    'map'      => ['map.php',      'bi-map',        'Campus Map'],
    'location' => ['location.php', 'bi-geo-alt',    'My Location'],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#0b6b3a">
    <meta name="description" content="Navi – find buildings, offices and classrooms inside <?= e(CAMPUS_NAME) ?>.">
    <title><?= e($pageTitle) ?> · <?= e(APP_NAME) ?></title>
    <link rel="icon" href="<?= $base ?>assets/img/navi-logo.svg" type="image/svg+xml">
    <link rel="stylesheet" href="<?= $base ?>assets/vendor/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="<?= $base ?>assets/vendor/bootstrap-icons/bootstrap-icons.min.css">
    <link rel="stylesheet" href="<?= $base ?>assets/css/style.css">
    <?= $extraHead ?? '' ?>
    <script>window.NAVI_CONFIG = <?= json_encode(navi_js_config(), JSON_UNESCAPED_UNICODE) ?>;</script>
</head>
<body class="page-<?= e($activePage) ?>">

<nav class="navbar navbar-expand-md navbar-dark navi-navbar sticky-top">
    <div class="container-fluid px-3">
        <a class="navbar-brand d-flex align-items-center gap-2" href="<?= $base ?>index.php">
            <img src="<?= $base ?>assets/img/navi-logo.svg" alt="" width="32" height="32">
            <span class="fw-bold">Navi</span>
            <small class="d-none d-lg-inline opacity-75 fw-normal">CvSU Cavite City Campus</small>
        </a>
        <ul class="navbar-nav ms-auto d-none d-md-flex flex-row gap-1">
            <?php foreach ($navItems as $key => [$href, $icon, $label]): ?>
                <li class="nav-item">
                    <a class="nav-link px-3 <?= $activePage === $key ? 'active' : '' ?>" href="<?= $base . $href ?>">
                        <i class="bi <?= $icon ?>"></i> <?= $label ?>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</nav>

<main class="navi-main">
