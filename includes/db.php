<?php
require_once __DIR__ . '/config.php';

/** Returns a shared PDO connection to the MySQL database. */
function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

/** Escape text for HTML output. */
function e(?string $text): string
{
    return htmlspecialchars((string) $text, ENT_QUOTES, 'UTF-8');
}

/** Categories used across the app (name => [color, icon]). */
function navi_categories(): array
{
    return [
        'Office'        => ['#2563eb', 'bi-briefcase'],
        'Classroom'     => ['#16a34a', 'bi-easel'],
        'Laboratory'    => ['#9333ea', 'bi-pc-display'],
        'Department'    => ['#0891b2', 'bi-people'],
        'Facility'      => ['#ea580c', 'bi-building'],
        'Restroom'      => ['#64748b', 'bi-badge-wc'],
        'Entrance/Exit' => ['#dc2626', 'bi-door-open'],
    ];
}

function floor_name(int $floor): string
{
    return $floor === 2 ? 'Second Floor' : 'Ground Floor';
}

/** Settings shared with JavaScript as window.NAVI_CONFIG */
function navi_js_config(): array
{
    return [
        'campusName'   => CAMPUS_NAME,
        'campusLat'    => CAMPUS_LAT,
        'campusLng'    => CAMPUS_LNG,
        'campusRadius' => CAMPUS_RADIUS_M,
        'geoPoints'    => GEO_POINTS,
        'categories'   => array_map(fn($c) => ['color' => $c[0], 'icon' => $c[1]], navi_categories()),
    ];
}
