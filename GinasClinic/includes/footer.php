<footer>
        <h4 class="text-center">Georgina Reta Limas</h4>
    </footer>

    <!-- Script para el slide Bar -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="<?php echo $base_path; ?>js/slideBar.js"></script>
    
    <?php if(isset($extra_js)): ?>
        <script src="<?php echo $base_path . $extra_js; ?>"></script>
    <?php endif; ?>
</body>
</html>