<?php
/**
 * GET api/destinations.php            → all active destinations
 * GET api/destinations.php?id=5       → one destination
 * GET api/destinations.php?q=library  → search by name / keywords / description
 *     optional filters: &category=Office &floor=1
 */
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$columns = 'id, name, category, floor, description, keywords, office_hours, x, y, w, h, door_x, door_y';

try {
    if (isset($_GET['id'])) {
        $stmt = db()->prepare("SELECT $columns FROM destinations WHERE id = ? AND is_active = 1");
        $stmt->execute([(int) $_GET['id']]);
        $row = $stmt->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'Destination not found']);
            exit;
        }
        echo json_encode(cast_row($row), JSON_UNESCAPED_UNICODE);
        exit;
    }

    $where  = ['is_active = 1'];
    $params = [];
    $q = trim($_GET['q'] ?? '');
    if ($q !== '') {
        $where[]  = '(name LIKE ? OR keywords LIKE ? OR description LIKE ? OR category LIKE ?)';
        $like     = '%' . $q . '%';
        array_push($params, $like, $like, $like, $like);
    }
    if (!empty($_GET['category'])) {
        $where[]  = 'category = ?';
        $params[] = $_GET['category'];
    }
    if (!empty($_GET['floor'])) {
        $where[]  = 'floor = ?';
        $params[] = (int) $_GET['floor'];
    }

    $stmt = db()->prepare("SELECT $columns FROM destinations WHERE " . implode(' AND ', $where) . ' ORDER BY floor, category, name');
    $stmt->execute($params);
    echo json_encode(array_map('cast_row', $stmt->fetchAll()), JSON_UNESCAPED_UNICODE);
} catch (PDOException $ex) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error. Check that MySQL is running in XAMPP and that navi_db was imported.',
    ]);
}

function cast_row(array $r): array
{
    foreach (['id', 'floor', 'x', 'y', 'w', 'h'] as $k) {
        $r[$k] = (int) $r[$k];
    }
    $r['door_x'] = $r['door_x'] === null ? $r['x'] + intdiv($r['w'], 2) : (int) $r['door_x'];
    $r['door_y'] = $r['door_y'] === null ? $r['y'] + intdiv($r['h'], 2) : (int) $r['door_y'];
    return $r;
}
