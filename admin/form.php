<?php
require_once __DIR__ . '/auth.php';
require_login();

$id = (int) ($_GET['id'] ?? $_POST['id'] ?? 0);
$fields = ['name', 'category', 'floor', 'description', 'keywords', 'office_hours', 'x', 'y', 'w', 'h', 'door_x', 'door_y'];
$d = ['name' => '', 'category' => 'Classroom', 'floor' => 1, 'description' => '', 'keywords' => '', 'office_hours' => '',
      'x' => 600, 'y' => 1000, 'w' => 80, 'h' => 80, 'door_x' => '', 'door_y' => '', 'is_active' => 1];

if ($id && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    $stmt = db()->prepare('SELECT * FROM destinations WHERE id = ?');
    $stmt->execute([$id]);
    $d = $stmt->fetch() ?: exit('Destination not found.');
}

$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    foreach ($fields as $k) {
        $d[$k] = trim($_POST[$k] ?? '');
    }
    $d['is_active'] = isset($_POST['is_active']) ? 1 : 0;

    if ($d['name'] === '') $errors[] = 'Name is required.';
    if (!array_key_exists($d['category'], navi_categories())) $errors[] = 'Choose a valid category.';
    if (!in_array((int) $d['floor'], [1, 2], true)) $errors[] = 'Choose a valid floor.';
    foreach (['x', 'y', 'w', 'h'] as $k) {
        if (!is_numeric($d[$k])) $errors[] = "Map value “$k” must be a number.";
    }
    if (($d['door_x'] === '') !== ($d['door_y'] === '')) $errors[] = 'Fill in both door X and door Y, or leave both empty.';

    if (!$errors) {
        $values = [
            $d['name'], $d['category'], (int) $d['floor'], $d['description'] ?: null, $d['keywords'] ?: null,
            $d['office_hours'] ?: null, (int) $d['x'], (int) $d['y'], max(10, (int) $d['w']), max(10, (int) $d['h']),
            $d['door_x'] === '' ? null : (int) $d['door_x'], $d['door_y'] === '' ? null : (int) $d['door_y'], $d['is_active'],
        ];
        if ($id) {
            $values[] = $id;
            db()->prepare('UPDATE destinations SET name=?, category=?, floor=?, description=?, keywords=?, office_hours=?,
                           x=?, y=?, w=?, h=?, door_x=?, door_y=?, is_active=? WHERE id=?')->execute($values);
            flash('Destination updated.');
        } else {
            db()->prepare('INSERT INTO destinations (name, category, floor, description, keywords, office_hours,
                           x, y, w, h, door_x, door_y, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')->execute($values);
            flash('Destination added.');
        }
        header('Location: index.php');
        exit;
    }
}

$pageTitle    = $id ? 'Edit Destination' : 'Add Destination';
$base         = '../';
$extraScripts = '<script src="../assets/js/floorplan.js"></script><script src="../assets/js/admin-form.js"></script>';
require __DIR__ . '/../includes/header.php';
?>
<div class="container py-4">
    <?php admin_nav($id ? '' : 'form.php'); ?>
    <h1 class="h4 fw-bold mb-3"><?= $id ? 'Edit' : 'Add' ?> destination</h1>
    <?php if ($errors): ?><div class="alert alert-danger"><?= implode('<br>', array_map('e', $errors)) ?></div><?php endif; ?>

    <form method="post" class="row g-4" id="destForm">
        <?= csrf_field() ?>
        <input type="hidden" name="id" value="<?= $id ?>">
        <div class="col-lg-5">
            <div class="card border-0 shadow-sm"><div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Name *</label>
                    <input name="name" class="form-control" required maxlength="120" value="<?= e($d['name']) ?>">
                </div>
                <div class="row g-2 mb-3">
                    <div class="col-7">
                        <label class="form-label">Category *</label>
                        <select name="category" class="form-select">
                            <?php foreach (navi_categories() as $c => $_): ?>
                                <option <?= $d['category'] === $c ? 'selected' : '' ?>><?= e($c) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-5">
                        <label class="form-label">Floor *</label>
                        <select name="floor" class="form-select" id="floorField">
                            <option value="1" <?= (int) $d['floor'] === 1 ? 'selected' : '' ?>>Ground Floor</option>
                            <option value="2" <?= (int) $d['floor'] === 2 ? 'selected' : '' ?>>Second Floor</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Description / location info</label>
                    <textarea name="description" class="form-control" rows="3"><?= e($d['description']) ?></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Search keywords <small class="text-body-secondary">(other names people may type)</small></label>
                    <input name="keywords" class="form-control" maxlength="255" value="<?= e($d['keywords']) ?>" placeholder="e.g. cr toilet restroom">
                </div>
                <div class="mb-3">
                    <label class="form-label">Office hours</label>
                    <input name="office_hours" class="form-control" maxlength="120" value="<?= e($d['office_hours']) ?>" placeholder="e.g. Mon–Fri, 8:00 AM – 5:00 PM">
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" name="is_active" id="isActive" <?= $d['is_active'] ? 'checked' : '' ?>>
                    <label class="form-check-label" for="isActive">Visible to users</label>
                </div>
            </div></div>
        </div>

        <div class="col-lg-7">
            <div class="card border-0 shadow-sm"><div class="card-body">
                <h2 class="h6 fw-bold">Position on the map</h2>
                <p class="small text-body-secondary mb-2">
                    Turn on <strong>Draw rectangle</strong> and drag on the map to mark the room (or hold <kbd>Ctrl</kbd> and drag).
                    Turn on <strong>Set door</strong> (or <kbd>Shift</kbd> + click) to mark where the room meets the hallway – routes start and end there.
                    Otherwise drag to move and scroll to zoom.
                </p>
                <div class="row g-2 mb-2 small">
                    <?php foreach (['x' => 'X', 'y' => 'Y', 'w' => 'Width', 'h' => 'Height', 'door_x' => 'Door X', 'door_y' => 'Door Y'] as $k => $label): ?>
                        <div class="col-4 col-md-2">
                            <label class="form-label mb-0"><?= $label ?></label>
                            <input name="<?= $k ?>" id="f_<?= $k ?>" class="form-control form-control-sm" inputmode="numeric" value="<?= e((string) $d[$k]) ?>" <?= in_array($k, ['x', 'y', 'w', 'h']) ? 'required' : '' ?>>
                        </div>
                    <?php endforeach; ?>
                </div>
                <div class="d-flex flex-wrap gap-3 mb-2 small">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="drawMode">
                        <label class="form-check-label" for="drawMode">Draw rectangle</label>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="doorMode">
                        <label class="form-check-label" for="doorMode">Set door</label>
                    </div>
                </div>
                <svg id="previewSvg" class="floor-svg preview-svg"></svg>
            </div></div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-success"><i class="bi bi-check-lg"></i> Save</button>
                <a href="index.php" class="btn btn-outline-secondary">Cancel</a>
            </div>
        </div>
    </form>
</div>
<?php require __DIR__ . '/../includes/footer.php'; ?>
