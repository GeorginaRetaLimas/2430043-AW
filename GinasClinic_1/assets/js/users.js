document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("inicio_form");
    
    if(form) {
        form.addEventListener('submit', function(e) {
            const password = document.querySelector('input[name="password"]').value;
            const confirmPassword = document.querySelector('input[name="confirm_password"]').value;
            
            if(password !== confirmPassword) {
                e.preventDefault();
                alert('Las contraseñas no coinciden');
            }
        });
    }
    
    // Mostrar/ocultar ID médico basado en rol
    const roleSelect = document.querySelector('select[name="role"]');
    if(roleSelect) {
        roleSelect.addEventListener('change', function() {
            // Aquí puedes agregar lógica para mostrar campos adicionales
        });
    }
});