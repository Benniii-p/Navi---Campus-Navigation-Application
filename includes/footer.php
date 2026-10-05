</main>

<!-- Bottom navigation (phones) -->
<nav class="navi-bottom-nav d-md-none">
    <?php foreach ($navItems as $key => [$href, $icon, $label]): ?>
        <a href="<?= $base . $href ?>" class="<?= $activePage === $key ? 'active' : '' ?>">
            <i class="bi <?= $icon ?>"></i>
            <span><?= $label ?></span>
        </a>
    <?php endforeach; ?>
</nav>

<?php if (empty($hideFooter)): ?>
<footer class="navi-footer text-center small text-body-secondary py-4">
    <div><?= e(APP_NAME) ?>: <?= e(APP_TAGLINE) ?> · <?= e(CAMPUS_NAME) ?></div>
    <div>Group 3 · BS Information Technology · <a href="<?= $base ?>admin/login.php" class="link-secondary">Admin</a></div>
</footer>
<?php endif; ?>

<script src="<?= $base ?>assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>
<script src="<?= $base ?>assets/js/common.js"></script>
<?= $extraScripts ?? '' ?>
</body>
</html>
