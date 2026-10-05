<?php
/**
 * Navi: Campus Navigation Web App – configuration
 * Edit these values to match your XAMPP setup.
 */

// ---- Database (XAMPP default: user "root", empty password) ----
define('DB_HOST', 'localhost');
define('DB_NAME', 'navi_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// ---- App ----
define('APP_NAME', 'Navi');
define('APP_TAGLINE', 'Campus Navigation Web App');
define('CAMPUS_NAME', 'Cavite State University – Cavite City Campus');
define('CAMPUS_ADDRESS', 'Brgy. 8, Pulo II, Dalahican, Cavite City');

// ---- Campus location (used by the Current Location screen) ----
// APPROXIMATE values – open Google Maps, right-click the campus,
// copy the coordinates and paste them here.
define('CAMPUS_LAT', 14.4645);
define('CAMPUS_LNG', 120.8955);
define('CAMPUS_RADIUS_M', 150);   // distance (meters) still counted as "inside campus"

// ---- Optional: put the GPS dot on the Ground Floor map ----
// Stand on 3 spots that are far apart (e.g. Main Gate, West Fire Exit,
// East Fire Exit), read your latitude/longitude on the Current Location
// screen, and enter them with the matching map point (x, y) of that spot.
// Leave the array empty to turn the feature off.
// Example: ['x' => 835, 'y' => 1770, 'lat' => 14.46431, 'lng' => 120.89551],
define('GEO_POINTS', []);

// ---- Public link used in QR code posters ----
// Leave empty to use the address in the browser. When you share the site
// through a tunnel (e.g. https://xyz.trycloudflare.com/navi), put that here.
define('PUBLIC_BASE_URL', '');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
