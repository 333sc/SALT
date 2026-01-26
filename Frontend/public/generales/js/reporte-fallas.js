// Inicializar módulo de reportar fallas
function initializeReportarFallasModule() {
    console.log('Inicializando módulo de Reportar Fallas...');
    
    const form = document.getElementById('reportar-fallas-form');
    const descripcionTextarea = document.getElementById('reportar-fallas-descripcion');
    const charCounter = document.getElementById('reportar-fallas-char-counter');
    const fileInput = document.getElementById('reportar-fallas-foto');
    const fileName = document.getElementById('reportar-fallas-file-name');
    const btnCancelar = document.getElementById('reportar-fallas-btn-cancelar');
    const btnEnviar = document.getElementById('reportar-fallas-btn-enviar');
    const btnLoading = btnEnviar.querySelector('.reportar-fallas-btn-loading');
    const mensajeExito = document.getElementById('reportar-fallas-mensaje-exito');
    const btnNuevoReporte = document.getElementById('reportar-fallas-btn-nuevo-reporte');

    // Contador de caracteres para la descripción
    descripcionTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCounter.textContent = count;
        
        if (count > 500) {
            charCounter.style.color = '#dc3545';
        } else {
            charCounter.style.color = 'var(--reportar-fallas-text-muted)';
        }
    });

    // Mostrar nombre del archivo seleccionado
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
            fileName.style.color = 'var(--reportar-fallas-text-light)';
        } else {
            fileName.textContent = 'No se ha seleccionado ningún archivo';
            fileName.style.color = 'var(--reportar-fallas-text-muted)';
        }
    });

    // Validar tamaño del archivo
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (file.size > maxSize) {
                alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
                this.value = '';
                fileName.textContent = 'No se ha seleccionado ningún archivo';
                fileName.style.color = 'var(--reportar-fallas-text-muted)';
            }
        }
    });

    // Cancelar formulario
    btnCancelar.addEventListener('click', function() {
        if (confirm('¿Está seguro de que desea cancelar? Los datos no guardados se perderán.')) {
            form.reset();
            fileName.textContent = 'No se ha seleccionado ningún archivo';
            fileName.style.color = 'var(--reportar-fallas-text-muted)';
            charCounter.textContent = '0';
        }
    });

    // Enviar formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validaciones adicionales
        if (descripcionTextarea.value.length > 500) {
            alert('La descripción no puede exceder los 500 caracteres.');
            return;
        }

        // Mostrar loading
        btnEnviar.disabled = true;
        btnLoading.style.display = 'inline';

        // Simular envío al servidor
        setTimeout(() => {
            // Generar ID de reporte aleatorio
            const reporteId = 'RF' + Date.now().toString().slice(-6);
            document.getElementById('reportar-fallas-reporte-id').textContent = '#' + reporteId;
            
            // Mostrar mensaje de éxito
            form.style.display = 'none';
            mensajeExito.style.display = 'block';
            
            // Restaurar botón
            btnEnviar.disabled = false;
            btnLoading.style.display = 'none';
        }, 2000);
    });

    // Nuevo reporte
    btnNuevoReporte.addEventListener('click', function() {
        form.reset();
        form.style.display = 'block';
        mensajeExito.style.display = 'none';
        fileName.textContent = 'No se ha seleccionado ningún archivo';
        fileName.style.color = 'var(--reportar-fallas-text-muted)';
        charCounter.textContent = '0';
    });

    console.log('Módulo de Reportar Fallas inicializado correctamente');
}