// Inicializar módulo de justificación de accesos
function initializeJustificacionAccesosModule() {
    console.log('Inicializando módulo de Justificación de Accesos...');
    
    // Elementos del DOM
    const elementos = {
        form: document.getElementById('justificacion-form'),
        selectAcceso: document.getElementById('justificacion-acceso'),
        selectTipo: document.getElementById('justificacion-tipo'),
        descripcion: document.getElementById('justificacion-descripcion'),
        charCounter: document.getElementById('justificacion-char-counter'),
        fileInput: document.getElementById('justificacion-documento'),
        fileName: document.getElementById('justificacion-file-name'),
        btnCancelar: document.getElementById('justificacion-btn-cancelar'),
        btnEnviar: document.getElementById('justificacion-btn-enviar'),
        btnLoading: document.querySelector('.justificacion-btn-loading'),
        mensajeExito: document.getElementById('justificacion-mensaje-exito'),
        btnNueva: document.getElementById('justificacion-btn-nueva'),
        listaPendientes: document.getElementById('lista-accesos-pendientes'),
        listaHistorial: document.getElementById('lista-historial'),
        filtroEstado: document.getElementById('filtro-estado'),
        btnAplicarFiltros: document.getElementById('btn-aplicar-filtros'),
        modal: {
            contenedor: document.getElementById('modal-detalles'),
            body: document.getElementById('modal-body'),
            close: document.getElementById('modal-close')
        }
    };

    // Estado de la aplicación
    const estado = {
        accesosPendientes: [],
        justificaciones: [],
        filtroEstado: ''
    };

    // Inicializar
    function init() {
        cargarDatos();
        configurarEventos();
        actualizarUI();
    }

    function cargarDatos() {
        // Simular carga de datos
        estado.accesosPendientes = generarAccesosPendientes();
        estado.justificaciones = generarJustificaciones();
        
        actualizarSelectAccesos();
        actualizarListaPendientes();
        actualizarHistorial();
    }

    function configurarEventos() {
        // Formulario
        elementos.form.addEventListener('submit', enviarJustificacion);
        elementos.btnCancelar.addEventListener('click', cancelarFormulario);
        elementos.btnNueva.addEventListener('click', nuevaJustificacion);
        
        // Contador de caracteres
        elementos.descripcion.addEventListener('input', actualizarContadorCaracteres);
        
        // File input
        elementos.fileInput.addEventListener('change', actualizarNombreArchivo);
        
        // Filtros del historial
        elementos.filtroEstado.addEventListener('change', aplicarFiltrosHistorial);
        elementos.btnAplicarFiltros.addEventListener('click', aplicarFiltrosHistorial);
        
        // Modal
        elementos.modal.close.addEventListener('click', cerrarModal);
        elementos.modal.contenedor.addEventListener('click', (e) => {
            if (e.target === elementos.modal.contenedor) cerrarModal();
        });
    }

    function actualizarContadorCaracteres() {
        const count = elementos.descripcion.value.length;
        elementos.charCounter.textContent = count;
        
        if (count > 500) {
            elementos.charCounter.style.color = 'var(--justificacion-danger-color)';
        } else {
            elementos.charCounter.style.color = 'var(--justificacion-text-muted)';
        }
    }

    function actualizarNombreArchivo() {
        if (elementos.fileInput.files.length > 0) {
            const file = elementos.fileInput.files[0];
            elementos.fileName.textContent = file.name;
            elementos.fileName.style.color = 'var(--justificacion-text-light)';
            
            // Validar tipo de archivo
            const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!tiposPermitidos.includes(file.type)) {
                alert('Formato de archivo no permitido. Solo se aceptan PDF, JPG y PNG.');
                elementos.fileInput.value = '';
                elementos.fileName.textContent = 'No se ha seleccionado ningún archivo';
                elementos.fileName.style.color = 'var(--justificacion-text-muted)';
                return;
            }
            
            // Validar tamaño (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
                elementos.fileInput.value = '';
                elementos.fileName.textContent = 'No se ha seleccionado ningún archivo';
                elementos.fileName.style.color = 'var(--justificacion-text-muted)';
            }
        } else {
            elementos.fileName.textContent = 'No se ha seleccionado ningún archivo';
            elementos.fileName.style.color = 'var(--justificacion-text-muted)';
        }
    }

    function actualizarSelectAccesos() {
        elementos.selectAcceso.innerHTML = '<option value="">Seleccione un acceso irregular...</option>';
        
        estado.accesosPendientes.forEach(acceso => {
            const option = document.createElement('option');
            option.value = acceso.id;
            option.textContent = `${acceso.id} - ${acceso.fecha} ${acceso.hora} - ${acceso.ubicacion}`;
            elementos.selectAcceso.appendChild(option);
        });
    }

    function actualizarListaPendientes() {
        if (estado.accesosPendientes.length === 0) {
            elementos.listaPendientes.innerHTML = `
                <div class="acceso-vacio">
                    <p>No tiene accesos irregulares pendientes de justificación</p>
                </div>
            `;
            return;
        }

        elementos.listaPendientes.innerHTML = '';
        
        estado.accesosPendientes.forEach(acceso => {
            const accesoElement = document.createElement('div');
            accesoElement.className = 'acceso-item';
            accesoElement.innerHTML = `
                <div class="acceso-info">
                    <h4>Acceso ${acceso.id}</h4>
                    <div class="acceso-detalles">
                        <span class="acceso-fecha">${acceso.fecha} ${acceso.hora}</span> • 
                        ${acceso.ubicacion} • 
                        ${acceso.tipo}
                    </div>
                </div>
                <div class="acceso-actions">
                    <button class="justificacion-btn justificacion-btn-primary btn-small" 
                            onclick="seleccionarAcceso('${acceso.id}')">
                        📝 Justificar
                    </button>
                </div>
            `;
            elementos.listaPendientes.appendChild(accesoElement);
        });
    }

    function aplicarFiltrosHistorial() {
        const estadoFiltro = elementos.filtroEstado.value;
        estado.filtroEstado = estadoFiltro;
        actualizarHistorial();
    }

    function actualizarHistorial() {
        let justificacionesFiltradas = [...estado.justificaciones];
        
        if (estado.filtroEstado) {
            justificacionesFiltradas = justificacionesFiltradas.filter(j => j.estado === estado.filtroEstado);
        }

        if (justificacionesFiltradas.length === 0) {
            elementos.listaHistorial.innerHTML = `
                <div class="historial-vacio">
                    <p>No hay justificaciones registradas</p>
                </div>
            `;
            return;
        }

        elementos.listaHistorial.innerHTML = '';
        
        justificacionesFiltradas.forEach(justificacion => {
            const historialElement = document.createElement('div');
            historialElement.className = `historial-item ${justificacion.estado}`;
            historialElement.innerHTML = `
                <div class="historial-info">
                    <h4>Justificación ${justificacion.id}</h4>
                    <div class="historial-detalles">
                        <span>Acceso: ${justificacion.accesoId}</span>
                        <span>Fecha: ${justificacion.fechaJustificacion}</span>
                        <span class="historial-estado estado-${justificacion.estado}">
                            ${obtenerTextoEstado(justificacion.estado)}
                        </span>
                        ${justificacion.estado !== 'pendiente' ? 
                          `<span>Resolución: ${justificacion.fechaResolucion}</span>` : ''}
                    </div>
                </div>
                <div class="historial-actions">
                    <button class="justificacion-btn justificacion-btn-outline btn-small" 
                            onclick="verDetallesJustificacion('${justificacion.id}')">
                        👁️ Ver
                    </button>
                </div>
            `;
            elementos.listaHistorial.appendChild(historialElement);
        });
    }

    function obtenerTextoEstado(estado) {
        const estados = {
            pendiente: 'Pendiente de revisión',
            aprobado: 'Aprobado',
            rechazado: 'Rechazado'
        };
        return estados[estado] || estado;
    }

    function enviarJustificacion(e) {
        e.preventDefault();
        
        // Validaciones
        if (elementos.descripcion.value.length > 500) {
            alert('La descripción no puede exceder los 500 caracteres.');
            return;
        }

        if (!elementos.fileInput.files.length) {
            alert('Debe adjuntar un documento de justificación.');
            return;
        }

        // Mostrar loading
        elementos.btnEnviar.disabled = true;
        elementos.btnLoading.style.display = 'inline';

        // Simular envío al servidor
        setTimeout(() => {
            // Generar ID de justificación
            const justificacionId = 'JST' + Date.now().toString().slice(-6);
            document.getElementById('justificacion-id').textContent = '#' + justificacionId;
            
            // Mostrar mensaje de éxito
            elementos.form.style.display = 'none';
            elementos.mensajeExito.style.display = 'block';
            
            // Actualizar datos locales
            const accesoId = elementos.selectAcceso.value;
            estado.accesosPendientes = estado.accesosPendientes.filter(a => a.id !== accesoId);
            
            // Agregar al historial
            estado.justificaciones.unshift({
                id: justificacionId,
                accesoId: accesoId,
                tipo: elementos.selectTipo.value,
                descripcion: elementos.descripcion.value,
                fechaJustificacion: new Date().toISOString().split('T')[0],
                estado: 'pendiente',
                documento: elementos.fileInput.files[0].name
            });
            
            // Actualizar UI
            actualizarSelectAccesos();
            actualizarListaPendientes();
            actualizarHistorial();
            
            // Restaurar botón
            elementos.btnEnviar.disabled = false;
            elementos.btnLoading.style.display = 'none';
        }, 2000);
    }

    function cancelarFormulario() {
        if (confirm('¿Está seguro de que desea cancelar? Los datos no guardados se perderán.')) {
            resetFormulario();
        }
    }

    function nuevaJustificacion() {
        resetFormulario();
        elementos.form.style.display = 'block';
        elementos.mensajeExito.style.display = 'none';
    }

    function resetFormulario() {
        elementos.form.reset();
        elementos.fileName.textContent = 'No se ha seleccionado ningún archivo';
        elementos.fileName.style.color = 'var(--justificacion-text-muted)';
        elementos.charCounter.textContent = '0';
    }

    function actualizarUI() {
        // Actualizar estadísticas si es necesario
    }

    // Funciones globales para los botones
    window.seleccionarAcceso = function(accesoId) {
        elementos.selectAcceso.value = accesoId;
        elementos.form.scrollIntoView({ behavior: 'smooth' });
    };

    window.verDetallesJustificacion = function(justificacionId) {
        const justificacion = estado.justificaciones.find(j => j.id === justificacionId);
        if (justificacion) {
            elementos.modal.body.innerHTML = generarContenidoModal(justificacion);
            elementos.modal.contenedor.style.display = 'flex';
        }
    };

    function generarContenidoModal(justificacion) {
        const acceso = estado.accesosPendientes.find(a => a.id === justificacion.accesoId) || 
                      { fecha: 'N/A', hora: 'N/A', ubicacion: 'N/A', tipo: 'N/A' };

        return `
            <div class="detalle-justificacion">
                <div class="info-item">
                    <strong>ID de Justificación:</strong>
                    <span>${justificacion.id}</span>
                </div>
                <div class="info-item">
                    <strong>Acceso Justificado:</strong>
                    <span>${justificacion.accesoId}</span>
                </div>
                <div class="info-item">
                    <strong>Fecha del Acceso:</strong>
                    <span>${acceso.fecha} ${acceso.hora}</span>
                </div>
                <div class="info-item">
                    <strong>Ubicación:</strong>
                    <span>${acceso.ubicacion}</span>
                </div>
                <div class="info-item">
                    <strong>Tipo de Justificación:</strong>
                    <span>${justificacion.tipo}</span>
                </div>
                <div class="info-item">
                    <strong>Estado:</strong>
                    <span class="estado-${justificacion.estado}">${obtenerTextoEstado(justificacion.estado)}</span>
                </div>
                <div class="info-item">
                    <strong>Descripción:</strong>
                    <span>${justificacion.descripcion}</span>
                </div>
                <div class="info-item">
                    <strong>Documento Adjunto:</strong>
                    <span>${justificacion.documento}</span>
                </div>
                <div class="info-item">
                    <strong>Fecha de Justificación:</strong>
                    <span>${justificacion.fechaJustificacion}</span>
                </div>
                ${justificacion.estado !== 'pendiente' ? `
                <div class="info-item">
                    <strong>Fecha de Resolución:</strong>
                    <span>${justificacion.fechaResolucion}</span>
                </div>
                ${justificacion.comentarioAdmin ? `
                <div class="info-item">
                    <strong>Comentario del Administrador:</strong>
                    <span>${justificacion.comentarioAdmin}</span>
                </div>
                ` : ''}
                ` : ''}
            </div>
        `;
    }

    function cerrarModal() {
        elementos.modal.contenedor.style.display = 'none';
    }

    // Datos de ejemplo
    function generarAccesosPendientes() {
        return [
            {
                id: 'ACC001',
                fecha: '2024-01-15',
                hora: '08:15',
                ubicacion: 'Laboratorio 1',
                tipo: 'Acceso fuera de horario'
            },
            {
                id: 'ACC002',
                fecha: '2024-01-16',
                hora: '22:30',
                ubicacion: 'Aula 201',
                tipo: 'Acceso sin autorización'
            },
            {
                id: 'ACC003', 
                fecha: '2024-01-14',
                hora: '12:45',
                ubicacion: 'Oficina Administrativa',
                tipo: 'Acceso en área restringida'
            }
        ];
    }

    function generarJustificaciones() {
        return [
            {
                id: 'JST001',
                accesoId: 'ACC004',
                tipo: 'emergencia_medica',
                descripcion: 'Tuve una emergencia médica familiar que requirió mi atención inmediata.',
                fechaJustificacion: '2024-01-10',
                estado: 'aprobado',
                fechaResolucion: '2024-01-12',
                documento: 'justificacion_medica.pdf',
                comentarioAdmin: 'Justificación aprobada. Documentación válida.'
            },
            {
                id: 'JST002',
                accesoId: 'ACC005', 
                tipo: 'error_sistema',
                descripcion: 'El sistema de acceso no reconoció mi tarjeta RFID válida.',
                fechaJustificacion: '2024-01-08',
                estado: 'pendiente',
                documento: 'reporte_error.pdf'
            }
        ];
    }

    // Inicializar la aplicación
    init();
    console.log('Módulo de Justificación de Accesos inicializado correctamente');
}


