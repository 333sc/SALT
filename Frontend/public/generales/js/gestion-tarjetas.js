// Inicializar módulo de gestión de tarjetas
function initializeGestionTarjetasModule() {
    console.log('Inicializando módulo de Gestión de Tarjetas...');
    
    // Elementos del DOM
    const elementos = {
        form: document.getElementById('reporte-tarjeta-form'),
        tipoReporte: document.getElementById('tipo-reporte'),
        fechaIncidente: document.getElementById('fecha-incidente'),
        horaIncidente: document.getElementById('hora-incidente'),
        ubicacionIncidente: document.getElementById('ubicacion-incidente'),
        descripcionIncidente: document.getElementById('descripcion-incidente'),
        charCounter: document.getElementById('descripcion-char-counter'),
        btnCancelar: document.getElementById('btn-cancelar'),
        btnReportar: document.getElementById('btn-reportar'),
        btnLoading: document.querySelector('.btn-loading'),
        confirmacionModal: document.getElementById('confirmacion-bloqueo'),
        confirmacionTipo: document.getElementById('confirmacion-tipo'),
        btnCancelarBloqueo: document.getElementById('btn-cancelar-bloqueo'),
        btnConfirmarBloqueo: document.getElementById('btn-confirmar-bloqueo'),
        mensajeExito: document.getElementById('mensaje-exito'),
        reporteId: document.getElementById('reporte-id'),
        btnCerrarMensaje: document.getElementById('btn-cerrar-mensaje'),
        listaHistorial: document.getElementById('lista-historial')
    };

    // Estado de la aplicación
    const estado = {
        tarjetaActual: {
            uid: 'RFID-001-5A8B9C3D',
            estado: 'activa',
            fechaAsignacion: '2024-01-15',
            ultimoUso: new Date().toLocaleString('es-ES')
        },
        reportesAnteriores: []
    };

    // Inicializar
    function init() {
        configurarEventos();
        establecerFechaActual();
        actualizarUI();
    }

    function configurarEventos() {
        // Formulario
        elementos.form.addEventListener('submit', manejarEnvioFormulario);
        elementos.btnCancelar.addEventListener('click', cancelarFormulario);
        
        // Contador de caracteres
        elementos.descripcionIncidente.addEventListener('input', actualizarContadorCaracteres);
        
        // Modal de confirmación
        elementos.btnCancelarBloqueo.addEventListener('click', cerrarConfirmacion);
        elementos.btnConfirmarBloqueo.addEventListener('click', confirmarBloqueo);
        
        // Mensaje de éxito
        elementos.btnCerrarMensaje.addEventListener('click', cerrarMensajeExito);
        
        // Establecer fecha actual por defecto
        elementos.fechaIncidente.value = new Date().toISOString().split('T')[0];
    }

    function establecerFechaActual() {
        const hoy = new Date();
        elementos.fechaIncidente.value = hoy.toISOString().split('T')[0];
        elementos.fechaIncidente.max = hoy.toISOString().split('T')[0];
    }

    function actualizarContadorCaracteres() {
        const count = elementos.descripcionIncidente.value.length;
        elementos.charCounter.textContent = count;
        
        if (count > 500) {
            elementos.charCounter.style.color = 'var(--tarjetas-danger-color)';
        } else {
            elementos.charCounter.style.color = 'var(--tarjetas-text-muted)';
        }
    }

    function manejarEnvioFormulario(e) {
        e.preventDefault();
        
        // Validaciones
        if (elementos.descripcionIncidente.value.length > 500) {
            alert('La descripción no puede exceder los 500 caracteres.');
            return;
        }

        if (estado.tarjetaActual.estado === 'bloqueada') {
            alert('Su tarjeta ya se encuentra bloqueada. No puede reportarla nuevamente.');
            return;
        }

        // Mostrar confirmación
        mostrarConfirmacion();
    }

    function mostrarConfirmacion() {
        const tipoReporte = elementos.tipoReporte.options[elementos.tipoReporte.selectedIndex].text;
        elementos.confirmacionTipo.textContent = tipoReporte.toLowerCase();
        elementos.confirmacionModal.style.display = 'flex';
    }

    function cerrarConfirmacion() {
        elementos.confirmacionModal.style.display = 'none';
    }

    function confirmarBloqueo() {
        // Mostrar loading
        elementos.btnReportar.disabled = true;
        elementos.btnLoading.style.display = 'inline';
        elementos.confirmacionModal.style.display = 'none';

        // Simular envío al servidor
        setTimeout(() => {
            // Generar ID de reporte
            const reporteId = 'TRP-' + Date.now().toString().slice(-6);
            elementos.reporteId.textContent = '#' + reporteId;
            
            // Actualizar estado local
            estado.tarjetaActual.estado = 'bloqueada';
            estado.tarjetaActual.ultimoUso = 'Tarjeta bloqueada';
            
            // Agregar al historial
            estado.reportesAnteriores.unshift({
                id: reporteId,
                tipo: elementos.tipoReporte.value,
                fecha: elementos.fechaIncidente.value,
                descripcion: elementos.descripcionIncidente.value,
                fechaReporte: new Date().toISOString(),
                estado: 'bloqueada'
            });
            
            // Mostrar mensaje de éxito
            elementos.mensajeExito.style.display = 'block';
            elementos.form.style.display = 'none';
            
            // Actualizar UI
            actualizarEstadoTarjeta();
            actualizarHistorial();
            
            // Restaurar botón
            elementos.btnReportar.disabled = false;
            elementos.btnLoading.style.display = 'none';
        }, 2000);
    }

    function cancelarFormulario() {
        if (confirm('¿Está seguro de que desea cancelar? Los datos no guardados se perderán.')) {
            resetFormulario();
        }
    }

    function resetFormulario() {
        elementos.form.reset();
        elementos.charCounter.textContent = '0';
        establecerFechaActual();
    }

    function cerrarMensajeExito() {
        elementos.mensajeExito.style.display = 'none';
        resetFormulario();
        elementos.form.style.display = 'block';
    }

    function actualizarEstadoTarjeta() {
        const estadoElement = document.querySelector('.tarjeta-estado');
        const estadoTexto = document.querySelector('.estado-texto');
        const badgeEstado = document.querySelector('.badge-estado');
        
        if (estado.tarjetaActual.estado === 'bloqueada') {
            estadoElement.className = 'tarjeta-estado bloqueada';
            estadoElement.querySelector('.estado-icon').textContent = '❌';
            estadoTexto.textContent = 'Bloqueada';
            estadoTexto.style.color = 'var(--tarjetas-danger-color)';
            estadoElement.querySelector('p').textContent = 'Su tarjeta ha sido bloqueada por seguridad';
            badgeEstado.className = 'badge-estado bloqueada';
            badgeEstado.textContent = 'Bloqueada';
            document.getElementById('tarjeta-ultimo-uso').textContent = 'Tarjeta bloqueada';
        }
    }

    function actualizarHistorial() {
        if (estado.reportesAnteriores.length === 0) {
            elementos.listaHistorial.innerHTML = `
                <div class="historial-item">
                    <div class="historial-icon">✅</div>
                    <div class="historial-content">
                        <h4>No hay reportes anteriores</h4>
                        <p>No ha realizado reportes de tarjetas anteriormente</p>
                    </div>
                </div>
            `;
            return;
        }

        elementos.listaHistorial.innerHTML = '';
        
        estado.reportesAnteriores.forEach(reporte => {
            const historialElement = document.createElement('div');
            historialElement.className = 'historial-item';
            historialElement.innerHTML = `
                <div class="historial-icon">${reporte.estado === 'bloqueada' ? '❌' : '✅'}</div>
                <div class="historial-content">
                    <h4>Reporte ${reporte.id}</h4>
                    <p><strong>Tipo:</strong> ${obtenerTextoTipoReporte(reporte.tipo)} • 
                       <strong>Fecha:</strong> ${formatearFecha(reporte.fechaReporte)}</p>
                    <p>${reporte.descripcion.substring(0, 100)}...</p>
                </div>
            `;
            elementos.listaHistorial.appendChild(historialElement);
        });
    }

    function obtenerTextoTipoReporte(tipo) {
        const tipos = {
            perdida: 'Pérdida',
            extraviada: 'Extraviada',
            robada: 'Robada',
            danada: 'Dañada'
        };
        return tipos[tipo] || tipo;
    }

    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function actualizarUI() {
        actualizarEstadoTarjeta();
        actualizarHistorial();
    }

    // Inicializar la aplicación
    init();
    console.log('Módulo de Gestión de Tarjetas inicializado correctamente');
}