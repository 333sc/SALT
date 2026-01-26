// Inicializar módulo de registro de mantenimiento
function initializeMantenimientoLimpiezaModule() {
    console.log('Inicializando módulo de Registro de Mantenimiento...');
    
    const form = document.getElementById('mantenimiento-form');
    const descripcionTextarea = document.getElementById('mantenimiento-descripcion');
    const charCounter = document.getElementById('mantenimiento-char-counter');
    const fileInput = document.getElementById('mantenimiento-foto');
    const fileNames = document.getElementById('mantenimiento-file-names');
    const btnCancelar = document.getElementById('mantenimiento-btn-cancelar');
    const btnEnviar = document.getElementById('mantenimiento-btn-enviar');
    const btnLoading = btnEnviar.querySelector('.mantenimiento-btn-loading');
    const mensajeExito = document.getElementById('mantenimiento-mensaje-exito');
    const btnNuevoRegistro = document.getElementById('mantenimiento-btn-nuevo-registro');
    const btnVerHistorial = document.getElementById('mantenimiento-btn-ver-historial');
    const observacionesGroup = document.getElementById('observaciones-group');
    const estadoRadios = document.querySelectorAll('input[name="estado"]');

    // Establecer fecha y hora actual por defecto
    const now = new Date();
    document.getElementById('mantenimiento-fecha').value = now.toISOString().split('T')[0];
    document.getElementById('mantenimiento-hora').value = now.toTimeString().slice(0, 5);

    // Contador de caracteres para la descripción
    descripcionTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCounter.textContent = count;
        
        if (count > 1000) {
            charCounter.style.color = 'var(--mantenimiento-danger-color)';
        } else {
            charCounter.style.color = 'var(--mantenimiento-text-muted)';
        }
    });

    // Mostrar/ocultar observaciones según el estado
    estadoRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'parcial' || this.value === 'pendiente') {
                observacionesGroup.style.display = 'block';
            } else {
                observacionesGroup.style.display = 'none';
            }
        });
    });

    // Mostrar nombres de archivos seleccionados
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const names = Array.from(this.files).map(file => file.name).join(', ');
            fileNames.textContent = `${this.files.length} archivo(s) seleccionado(s): ${names}`;
            fileNames.style.color = 'var(--mantenimiento-text-light)';
        } else {
            fileNames.textContent = 'No se han seleccionado archivos';
            fileNames.style.color = 'var(--mantenimiento-text-muted)';
        }
    });

    // Validar tamaño de archivos
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            const invalidFiles = Array.from(this.files).filter(file => file.size > maxSize);
            
            if (invalidFiles.length > 0) {
                alert(`Los siguientes archivos son demasiado grandes (máx. 5MB): ${invalidFiles.map(f => f.name).join(', ')}`);
                this.value = '';
                fileNames.textContent = 'No se han seleccionado archivos';
                fileNames.style.color = 'var(--mantenimiento-text-muted)';
            }
        }
    });

    // Cancelar formulario
    btnCancelar.addEventListener('click', function() {
        if (confirm('¿Está seguro de que desea cancelar? Los datos no guardados se perderán.')) {
            resetForm();
        }
    });

    // Enviar formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validaciones
        if (descripcionTextarea.value.length > 1000) {
            alert('La descripción no puede exceder los 1000 caracteres.');
            return;
        }

        // Mostrar loading
        btnEnviar.disabled = true;
        btnLoading.style.display = 'inline';

        // Simular envío al servidor
        setTimeout(() => {
            // Generar ID de registro aleatorio
            const registroId = 'ML' + Date.now().toString().slice(-6);
            document.getElementById('mantenimiento-registro-id').textContent = '#' + registroId;
            
            // Mostrar mensaje de éxito
            form.style.display = 'none';
            mensajeExito.style.display = 'block';
            
            // Restaurar botón
            btnEnviar.disabled = false;
            btnLoading.style.display = 'none';
        }, 2000);
    });

    // Nuevo registro
    btnNuevoRegistro.addEventListener('click', function() {
        resetForm();
        form.style.display = 'block';
        mensajeExito.style.display = 'none';
    });

    // Ver historial
    btnVerHistorial.addEventListener('click', function() {
        // Navegar a la vista de historial (si existe)
        if (window.generalesPanel) {
            window.generalesPanel.navigateTo('historial-servicios');
        } else {
            alert('Funcionalidad de historial en desarrollo');
        }
    });

    // Función para resetear el formulario
    function resetForm() {
        form.reset();
        fileNames.textContent = 'No se han seleccionado archivos';
        fileNames.style.color = 'var(--mantenimiento-text-muted)';
        charCounter.textContent = '0';
        observacionesGroup.style.display = 'none';
        
        // Restablecer fecha y hora actual
        const now = new Date();
        document.getElementById('mantenimiento-fecha').value = now.toISOString().split('T')[0];
        document.getElementById('mantenimiento-hora').value = now.toTimeString().slice(0, 5);
    }

    console.log('Módulo de Registro de Mantenimiento inicializado correctamente');
}