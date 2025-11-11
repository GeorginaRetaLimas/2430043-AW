<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../assets/img/logo_icon_transparent.png" type="image/x-icon">
    <title><?php echo isset($page_title) ? $page_title : 'GinasClinic'; ?></title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <!-- Estilos globales de la web -->
    <link rel="stylesheet" href="../assets/css/style.css" type="text/css">
    
    <?php if(isset($extra_css)): ?>
        <link rel="stylesheet" href="<?php echo $extra_css; ?>" type="text/css">
    <?php endif; ?>
</head>
<body>