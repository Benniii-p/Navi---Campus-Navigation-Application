<?php
require_once __DIR__ . '/auth.php';
require_login();

// Delete / show-hide actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $id = (int) ($_POST['id'] ?? 0);
    if (($_POST['action'] ?? '') === 'delete') {
        db()->prepare('DELETE FROM destinations WHERE id = ?')->execute([$id]);
        flash('Destination deleted.');
    } elseif (($_POST['action'] ?? '') === 'toggle') {
        db()->prepare('UPDATE destinations SET is_active = 1 - is_active WHERE id = ?')->execute([$id]);
        flash('Visibility updated.');
    }
    header('Location: index.php');
    exit;
}

$rows = db()->query('SELECT id, name, category, floor, office_hours, is_active, updated_at
                     FROM destinations ORDER BY floor, category, name')->fetchAll();
$cats = navi_categories();

$pageTitle = 'Manage Destinations';
$base = '../';
require __DIR__ . '/../includes/header.php';
$f = flash();
?>
<div class="container py-4">
    <?php admin_nav('index.php'); ?>
    <?php if ($f): ?><div class="alert alert-<?= e($f[1]) ?> alert-dismissible"><?= e($f[0]) ?><button class="btn-close" data-bs-dismiss="alert"></button></div><?php endif; ?>

    <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
        <h1 class="h4 fw-bold mb-0 me-auto">Destinations <span class="badge text-bg-secondary"><?= count($rows) ?></span></h1>
        <input type="search" class="form-control form-control-sm" style="max-width: 260px" placeholder="Filter…" id="tableFilter">
        <a href="form.php" class="btn btn-success btn-sm"><i class="bi bi-plus-lg"></i> Add destination</a>
    </div>

    <div class="table-responsive card border-0 shadow-sm">
        <table class="table table-hover align-middle mb-0" id="destTable">
            <thead class="table-light">
                <tr><th>Name</th><th>Category</th><th>Floor</th><th class="d-none d-lg-table-cell">Office hours</th><th>Status</th><th class="text-end">Actions</th></tr>
            </thead>
            <tbody>
            <?php foreach ($rows as $r): $color = $cats[$r['category']][0] ?? '#475569'; ?>
                <tr class="<?= $r['is_active'] ? '' : 'table-secondary' ?>">
                    <td class="fw-semibold"><?= e($r['name']) ?></td>
                    <td><span class="badge rounded-pill" style="background: <?= e($color) ?>"><?= e($r['category']) ?></span></td>
                    <td><?= floor_name((int) $r['floor']) ?></td>
                    <td class="d-none d-lg-table-cell small"><?= e($r['office_hours'] ?? '') ?></td>
                    <td><?= $r['is_active'] ? '<span class="text-success small">Visible</span>' : '<span class="text-secondary small">Hidden</span>' ?></td>
                    <td class="text-end text-nowrap">
                        <a class="btn btn-sm btn-outline-primary" href="form.php?id=<?= (int) $r['id'] ?>" title="Edit"><i class="bi bi-pencil"></i></a>
                        <a class="btn btn-sm btn-outline-secondary" href="../map.php?id=<?= (int) $r['id'] ?>" target="_blank" title="View on map"><i class="bi bi-map"></i></a>
                        <form method="post" class="d-inline">
                            <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
                            <button class="btn btn-sm btn-outline-warning" name="action" value="toggle" title="Show / hide"><i class="bi bi-eye<?= $r['is_active'] ? '-slash' : '' ?>"></i></button>
                            <button class="btn btn-sm btn-outline-danger" name="action" value="delete" title="Delete"
                                    onclick="return confirm('Delete “<?= e(addslashes($r['name'])) ?>”? This cannot be undone.')"><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<script>
document.getElementById('tableFilter').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#destTable tbody tr').forEach(tr => {
        tr.hidden = q && !tr.textContent.toLowerCase().includes(q);
    });
});
</script>
<?php require __DIR__ . '/../includes/footer.php'; ?>
