<?php
require_once __DIR__ . '/auth.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $stmt = db()->prepare('SELECT password_hash FROM admins WHERE id = ?');
    $stmt->execute([$_SESSION['admin_id']]);
    $hash = $stmt->fetchColumn();
    $new  = $_POST['new'] ?? '';
    if (!password_verify($_POST['current'] ?? '', $hash)) {
        flash('Your current password is wrong.', 'danger');
    } elseif (strlen($new) < 8) {
        flash('The new password must have at least 8 characters.', 'danger');
    } elseif ($new !== ($_POST['confirm'] ?? '')) {
        flash('The new passwords do not match.', 'danger');
    } else {
        db()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($new, PASSWORD_DEFAULT), $_SESSION['admin_id']]);
        flash('Password changed.');
    }
    header('Location: password.php');
    exit;
}

$pageTitle = 'Change Password';
$base = '../';
require __DIR__ . '/../includes/header.php';
$f = flash();
?>
<div class="container py-4">
    <?php admin_nav('password.php'); ?>
    <?php if ($f): ?><div class="alert alert-<?= e($f[1]) ?>"><?= e($f[0]) ?></div><?php endif; ?>
    <div class="card border-0 shadow-sm" style="max-width: 460px">
        <div class="card-body">
            <h1 class="h5 fw-bold mb-3">Change password</h1>
            <form method="post">
                <?= csrf_field() ?>
                <div class="mb-3"><label class="form-label">Current password</label><input type="password" name="current" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">New password</label><input type="password" name="new" class="form-control" minlength="8" required></div>
                <div class="mb-3"><label class="form-label">Confirm new password</label><input type="password" name="confirm" class="form-control" minlength="8" required></div>
                <button class="btn btn-success">Save password</button>
            </form>
        </div>
    </div>
</div>
<?php require __DIR__ . '/../includes/footer.php'; ?>
