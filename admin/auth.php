<?php
/** Admin helpers: login check and CSRF protection. */
require_once __DIR__ . '/../includes/db.php';

function is_logged_in(): bool
{
    return !empty($_SESSION['admin_id']);
}

function require_login(): void
{
    if (!is_logged_in()) {
        header('Location: login.php');
        exit;
    }
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . csrf_token() . '">';
}

function check_csrf(): void
{
    if (!hash_equals(csrf_token(), $_POST['csrf'] ?? '')) {
        http_response_code(400);
        exit('Invalid form token. Go back and try again.');
    }
}

function flash(?string $message = null, string $type = 'success'): ?array
{
    if ($message !== null) {
        $_SESSION['flash'] = [$message, $type];
        return null;
    }
    $f = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $f;
}

/** Admin sub-navigation shown on every admin page. */
function admin_nav(string $active): void
{
    $items = ['index.php' => ['bi-list-ul', 'Destinations'], 'form.php' => ['bi-plus-circle', 'Add'],
              'qr.php' => ['bi-qr-code', 'QR Posters'], 'password.php' => ['bi-key', 'Password']];
    echo '<div class="d-flex flex-wrap align-items-center gap-2 mb-4 admin-nav">';
    echo '<span class="fw-bold me-2"><i class="bi bi-shield-lock text-success"></i> Admin</span>';
    foreach ($items as $href => [$icon, $label]) {
        $cls = $active === $href ? 'btn-success' : 'btn-outline-success';
        echo "<a class=\"btn btn-sm $cls\" href=\"$href\"><i class=\"bi $icon\"></i> $label</a>";
    }
    echo '<a class="btn btn-sm btn-outline-secondary ms-auto" href="logout.php"><i class="bi bi-box-arrow-right"></i> Log out ('
        . e($_SESSION['admin_user'] ?? '') . ')</a></div>';
}
