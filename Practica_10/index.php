<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Practica 9</title>
</head>
<body>
  <script>
    // Función para que después de 3 segundos mande a login 
    setTimeout(function() {
        console.log("Redirigiendo a inicio...");
        window.location.href = "pages/index.php";
    }, 3000);
  </script>
</body>
</html>