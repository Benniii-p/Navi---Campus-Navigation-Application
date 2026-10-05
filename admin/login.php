<?php
require_once __DIR__ . '/auth.php';
if (is_logged_in()) { header('Location: index.php'); exit; }

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    try {
        $stmt = db()->prepare('SELECT id, username, password_hash FROM admins WHERE username = ?');
        $stmt->execute([trim($_POST['username'] ?? '')]);
        $admin = $stmt->fetch();
        if ($admin && password_verify($_POST['password'] ?? '', $admin['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin_id']   = (int) $admin['id'];
            $_SESSION['admin_user'] = $admin['username'];
            header('Location: index.php');
            exit;
        }
        $error = 'Wrong username or password.';
    } catch (PDOException $ex) {
        $error = 'Database error – is MySQL running and navi_db imported?';
    }
}

$pageTitle = 'Admin Login';
$base = '../';
require __DIR__ . '/../includes/header.php';
?>
<div class="container py-5" style="max-width: 420px">
    <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
            <div class="text-center mb-3">
                <img src="../assets/img/navi-logo.svg" width="56" height="56" alt="">
                <h1 class="h4 fw-bold mt-2 mb-0">Navi Admin</h1>
                <small class="text-body-secondary">Update campus destinations</small>
            </div>
            <?php if ($error): ?><div class="alert alert-danger py-2"><?= e($error) ?></div><?php endif; ?>
            <form method="post" autocomplete="off">
                <?= csrf_field() ?>
                <div class="mb-3">
                    <label class="form-label" for="username">Username</label>
                    <input class="form-control" id="username" name="username" required autofocus>
                </div>
                <div class="mb-3">
                    <label class="form-label" for="password">Password</label>
                    <input class="form-control" id="password" name="password" type="password" required>
                </div>
                <button class="btn btn-success w-100"><i class="bi bi-box-arrow-in-right"></i> Log in</button>
            </form>
        </div>
    </div>
</div>
<?php require __DIR__ . '/../includes/footer.php'; ?>
