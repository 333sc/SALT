// Inicializar módulo de historial de servicios
function initializeHistorialModule() {
    console.log('Inicializando módulo de Historial de Servicios...');
    
    // Elementos del DOM
    const elementos = {
        tabla: document.getElementById('tabla-registros'),
        tbody: document.getElementById('tbody-registros'),
        filtros: {
            tipo: document.getElementById('filtro-tipo'),
            ubicacion: document.getElementById('filtro-ubicacion'),
            estado: document.getElementById('filtro-estado'),
            prioridad: document.getElementById('filtro-prioridad'),
            fechaDesde: document.getElementById('filtro-fecha-desde'),
            fechaHasta: document.getElementById('filtro-fecha-hasta'),
            busqueda: document.getElementById('filtro-busqueda')
        },
        botones: {
            aplicarFiltros: document.getElementById('btn-aplicar-filtros'),
            limpiarFiltros: document.getElementById('btn-limpiar-filtros'),
            exportar: document.getElementById('btn-exportar'),
            actualizar: document.getElementById('btn-actualizar'),
            prev: document.getElementById('btn-prev'),
            next: document.getElementById('btn-next')
        },
        stats: {
            total: document.getElementById('total-registros'),
            completados: document.getElementById('completados'),
            enProceso: document.getElementById('en-proceso'),
            pendientes: document.getElementById('pendientes')
        },
        paginacion: {
            mostrados: document.getElementById('registros-mostrados'),
            totales: document.getElementById('registros-totales'),
            pagina: document.getElementById('pagina-actual')
        },
        modal: {
            contenedor: document.getElementById('modal-detalles'),
            body: document.getElementById('modal-body'),
            close: document.getElementById('modal-close')
        }
    };

    // Estado de la aplicación
    const estado = {
        registros: [],
        registrosFiltrados: [],
        filtrosActivos: {},
        ordenamiento: { campo: 'fecha', direccion: 'desc' },
        paginacion: { pagina: 1, porPagina: 10 }
    };

    // Datos de ejemplo (simulados)
    const datosEjemplo = generarDatosEjemplo();

    // Inicializar
    function init() {
        cargarRegistros();
        configurarEventos();
        configurarOrdenamiento();
        actualizarUI();
    }

    function cargarRegistros() {
        // Simular carga de datos
        estado.registros = datosEjemplo;
        aplicarFiltros();
    }

    function configurarEventos() {
        // Filtros
        elementos.botones.aplicarFiltros.addEventListener('click', aplicarFiltros);
        elementos.botones.limpiarFiltros.addEventListener('click', limpiarFiltros);
        
        // Botones de acción
        elementos.botones.exportar.addEventListener('click', exportarExcel);
        elementos.botones.actualizar.addEventListener('click', recargarDatos);
        elementos.botones.prev.addEventListener('click', paginaAnterior);
        elementos.botones.next.addEventListener('click', paginaSiguiente);
        
        // Búsqueda en tiempo real
        elementos.filtros.busqueda.addEventListener('input', debounce(aplicarFiltros, 300));
        
        // Modal
        elementos.modal.close.addEventListener('click', cerrarModal);
        elementos.modal.contenedor.addEventListener('click', (e) => {
            if (e.target === elementos.modal.contenedor) cerrarModal();
        });
    }

    function configurarOrdenamiento() {
        const headers = elementos.tabla.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const campo = header.getAttribute('data-sort');
                ordenarPor(campo);
            });
        });
    }

    function aplicarFiltros() {
        const filtros = {
            tipo: elementos.filtros.tipo.value,
            ubicacion: elementos.filtros.ubicacion.value,
            estado: elementos.filtros.estado.value,
            prioridad: elementos.filtros.prioridad.value,
            fechaDesde: elementos.filtros.fechaDesde.value,
            fechaHasta: elementos.filtros.fechaHasta.value,
            busqueda: elementos.filtros.busqueda.value.toLowerCase()
        };

        estado.filtrosActivos = filtros;
        estado.paginacion.pagina = 1;

        filtrarRegistros();
        actualizarUI();
    }

    function filtrarRegistros() {
        let filtrados = [...estado.registros];

        // Aplicar filtros
        if (estado.filtrosActivos.tipo) {
            filtrados = filtrados.filter(r => r.tipo === estado.filtrosActivos.tipo);
        }

        if (estado.filtrosActivos.ubicacion) {
            filtrados = filtrados.filter(r => r.ubicacion === estado.filtrosActivos.ubicacion);
        }

        if (estado.filtrosActivos.estado) {
            filtrados = filtrados.filter(r => r.estado === estado.filtrosActivos.estado);
        }

        if (estado.filtrosActivos.prioridad) {
            filtrados = filtrados.filter(r => r.prioridad === estado.filtrosActivos.prioridad);
        }

        if (estado.filtrosActivos.fechaDesde) {
            filtrados = filtrados.filter(r => r.fecha >= estado.filtrosActivos.fechaDesde);
        }

        if (estado.filtrosActivos.fechaHasta) {
            filtrados = filtrados.filter(r => r.fecha <= estado.filtrosActivos.fechaHasta);
        }

        if (estado.filtrosActivos.busqueda) {
            const busqueda = estado.filtrosActivos.busqueda;
            filtrados = filtrados.filter(r => 
                r.id.toLowerCase().includes(busqueda) ||
                r.descripcion.toLowerCase().includes(busqueda) ||
                r.responsable.toLowerCase().includes(busqueda) ||
                r.ubicacion.toLowerCase().includes(busqueda)
            );
        }

        // Ordenar
        filtrados.sort((a, b) => {
            const campo = estado.ordenamiento.campo;
            const direccion = estado.ordenamiento.direccion === 'asc' ? 1 : -1;
            
            if (a[campo] < b[campo]) return -1 * direccion;
            if (a[campo] > b[campo]) return 1 * direccion;
            return 0;
        });

        estado.registrosFiltrados = filtrados;
    }

    function ordenarPor(campo) {
        if (estado.ordenamiento.campo === campo) {
            estado.ordenamiento.direccion = estado.ordenamiento.direccion === 'asc' ? 'desc' : 'asc';
        } else {
            estado.ordenamiento.campo = campo;
            estado.ordenamiento.direccion = 'asc';
        }

        // Actualizar indicadores visuales
        const headers = elementos.tabla.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
            if (header.getAttribute('data-sort') === campo) {
                header.classList.add(estado.ordenamiento.direccion === 'asc' ? 'sorted-asc' : 'sorted-desc');
            }
        });

        aplicarFiltros();
    }

    function actualizarUI() {
        actualizarTabla();
        actualizarEstadisticas();
        actualizarPaginacion();
    }

    function actualizarTabla() {
        const inicio = (estado.paginacion.pagina - 1) * estado.paginacion.porPagina;
        const fin = inicio + estado.paginacion.porPagina;
        const registrosPagina = estado.registrosFiltrados.slice(inicio, fin);

        elementos.tbody.innerHTML = '';

        registrosPagina.forEach(registro => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${registro.id}</td>
                <td>${formatearFecha(registro.fecha)}</td>
                <td>${obtenerIconoTipo(registro.tipo)} ${registro.tipo}</td>
                <td>${registro.ubicacion}</td>
                <td class="descripcion-corta">${registro.descripcion.substring(0, 50)}...</td>
                <td>${registro.responsable}</td>
                <td><span class="badge badge-${registro.estado}">${registro.estado}</span></td>
                <td>${registro.prioridad ? `<span class="badge badge-${registro.prioridad}">${registro.prioridad}</span>` : '-'}</td>
                <td>
                    <button class="btn-action" onclick="verDetalles('${registro.id}')">👁️ Ver</button>
                </td>
            `;
            elementos.tbody.appendChild(fila);
        });
    }

    function actualizarEstadisticas() {
        elementos.stats.total.textContent = estado.registrosFiltrados.length;
        elementos.stats.completados.textContent = estado.registrosFiltrados.filter(r => r.estado === 'completado').length;
        elementos.stats.enProceso.textContent = estado.registrosFiltrados.filter(r => r.estado === 'en_proceso').length;
        elementos.stats.pendientes.textContent = estado.registrosFiltrados.filter(r => r.estado === 'pendiente' || r.estado === 'reportado').length;
    }

    function actualizarPaginacion() {
        const totalPaginas = Math.ceil(estado.registrosFiltrados.length / estado.paginacion.porPagina);
        const inicio = (estado.paginacion.pagina - 1) * estado.paginacion.porPagina + 1;
        const fin = Math.min(inicio + estado.paginacion.porPagina - 1, estado.registrosFiltrados.length);

        elementos.paginacion.mostrados.textContent = `${inicio}-${fin}`;
        elementos.paginacion.totales.textContent = estado.registrosFiltrados.length;
        elementos.paginacion.pagina.textContent = estado.paginacion.pagina;

        elementos.botones.prev.disabled = estado.paginacion.pagina === 1;
        elementos.botones.next.disabled = estado.paginacion.pagina === totalPaginas;
    }

    function paginaAnterior() {
        if (estado.paginacion.pagina > 1) {
            estado.paginacion.pagina--;
            actualizarUI();
        }
    }

    function paginaSiguiente() {
        const totalPaginas = Math.ceil(estado.registrosFiltrados.length / estado.paginacion.porPagina);
        if (estado.paginacion.pagina < totalPaginas) {
            estado.paginacion.pagina++;
            actualizarUI();
        }
    }

    function limpiarFiltros() {
        Object.values(elementos.filtros).forEach(filtro => {
            if (filtro.type === 'text' || filtro.tagName === 'SELECT') {
                filtro.value = '';
            } else if (filtro.type === 'date') {
                filtro.value = '';
            }
        });
        aplicarFiltros();
    }

    function recargarDatos() {
        cargarRegistros();
        mostrarMensaje('Datos actualizados correctamente', 'success');
    }

    function exportarExcel() {
        // Simular exportación
        mostrarMensaje('Exportando datos a Excel...', 'info');
        setTimeout(() => {
            mostrarMensaje('Archivo Excel generado correctamente', 'success');
        }, 1500);
    }

    // Funciones auxiliares
    function obtenerIconoTipo(tipo) {
        const iconos = {
            falla: '⚠️',
            mantenimiento: '🔧',
            limpieza: '🧹'
        };
        return iconos[tipo] || '📄';
    }

    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES');
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function mostrarMensaje(mensaje, tipo = 'info') {
        // Implementar sistema de notificaciones si es necesario
        console.log(`${tipo.toUpperCase()}: ${mensaje}`);
    }

    // Hacer función global para el modal
    window.verDetalles = function(id) {
        const registro = estado.registros.find(r => r.id === id);
        if (registro) {
            elementos.modal.body.innerHTML = generarContenidoModal(registro);
            elementos.modal.contenedor.style.display = 'flex';
        }
    };

    function generarContenidoModal(registro) {
        return `
            <div class="detalle-registro">
                <div class="detalle-header">
                    <h4>${registro.id} - ${registro.tipo.toUpperCase()}</h4>
                    <div class="detalle-badges">
                        <span class="badge badge-${registro.estado}">${registro.estado}</span>
                        ${registro.prioridad ? `<span class="badge badge-${registro.prioridad}">${registro.prioridad}</span>` : ''}
                    </div>
                </div>
                
                <div class="detalle-info">
                    <div class="info-item">
                        <strong>📅 Fecha:</strong> ${formatearFecha(registro.fecha)}
                    </div>
                    <div class="info-item">
                        <strong>📍 Ubicación:</strong> ${registro.ubicacion}
                    </div>
                    <div class="info-item">
                        <strong>👤 Responsable:</strong> ${registro.responsable}
                    </div>
                    ${registro.equipo ? `<div class="info-item"><strong>⚙️ Equipo:</strong> ${registro.equipo}</div>` : ''}
                </div>

                <div class="detalle-descripcion">
                    <strong>📝 Descripción:</strong>
                    <p>${registro.descripcion}</p>
                </div>

                ${registro.materiales && registro.materiales.length > 0 ? `
                <div class="detalle-materiales">
                    <strong>🧰 Materiales utilizados:</strong>
                    <ul>
                        ${registro.materiales.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${registro.observaciones ? `
                <div class="detalle-observaciones">
                    <strong>💡 Observaciones:</strong>
                    <p>${registro.observaciones}</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    function cerrarModal() {
        elementos.modal.contenedor.style.display = 'none';
    }

    // Datos de ejemplo
    function generarDatosEjemplo() {
        const tipos = ['falla', 'mantenimiento', 'limpieza'];
        const ubicaciones = ['lab1', 'lab2', 'lab3', 'aula101', 'aula102', 'oficina1', 'baños', 'pasillos', 'almacen'];
        const estados = ['completado', 'en_proceso', 'pendiente', 'reportado', 'parcial'];
        const prioridades = ['urgente', 'alta', 'media', 'baja'];
        const responsables = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Pedro Rodríguez'];
        const materiales = ['detergente', 'desinfectante', 'guantes', 'herramientas', 'repuestos'];

        const datos = [];
        const hoy = new Date();

        for (let i = 1; i <= 50; i++) {
            const tipo = tipos[Math.floor(Math.random() * tipos.length)];
            const fecha = new Date(hoy);
            fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30));
            
            datos.push({
                id: `${tipo === 'falla' ? 'RF' : 'ML'}${String(i).padStart(4, '0')}`,
                tipo: tipo,
                fecha: fecha.toISOString().split('T')[0],
                ubicacion: ubicaciones[Math.floor(Math.random() * ubicaciones.length)],
                descripcion: `Descripción detallada del ${tipo} realizado en la ubicación especificada. Incluye todas las actividades realizadas y observaciones relevantes.`,
                responsable: responsables[Math.floor(Math.random() * responsables.length)],
                estado: estados[Math.floor(Math.random() * estados.length)],
                prioridad: tipo === 'falla' ? prioridades[Math.floor(Math.random() * prioridades.length)] : null,
                equipo: Math.random() > 0.5 ? `Equipo ${Math.floor(Math.random() * 10) + 1}` : null,
                materiales: Math.random() > 0.3 ? materiales.slice(0, Math.floor(Math.random() * 3) + 1) : [],
                observaciones: Math.random() > 0.7 ? 'Observaciones adicionales sobre el trabajo realizado.' : null
            });
        }

        return datos;
    }

    // Inicializar la aplicación
    init();
    console.log('Módulo de Historial de Servicios inicializado correctamente');
}