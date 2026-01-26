 // Datos de ejemplo
        let accesosData = [
            {
                id: 1,
                usuario: "María González",
                usuarioId: "U001",
                ambiente: "Laboratorio de Informática 1",
                sensor: "RFID-001",
                fechaHora: "2024-01-20 08:15:30",
                tipo: "entrada",
                resultado: "exitoso",
                detalles: "Acceso autorizado"
            },
            {
                id: 2,
                usuario: "Carlos Rodríguez",
                usuarioId: "U002",
                ambiente: "Aula 201",
                sensor: "RFID-003",
                fechaHora: "2024-01-20 08:20:15",
                tipo: "entrada",
                resultado: "exitoso",
                detalles: "Acceso autorizado"
            },
            {
                id: 3,
                usuario: "Ana Martínez",
                usuarioId: "U003",
                ambiente: "Laboratorio de Informática 1",
                sensor: "RFID-002",
                fechaHora: "2024-01-20 09:05:45",
                tipo: "entrada",
                resultado: "denegado",
                detalles: "Usuario no autorizado para este ambiente"
            },
            {
                id: 4,
                usuario: "Luis Hernández",
                usuarioId: "U004",
                ambiente: "Taller de Electrónica",
                sensor: "RFID-005",
                fechaHora: "2024-01-20 10:30:20",
                tipo: "entrada",
                resultado: "exitoso",
                detalles: "Acceso autorizado"
            },
            {
                id: 5,
                usuario: "María González",
                usuarioId: "U001",
                ambiente: "Laboratorio de Informática 1",
                sensor: "RFID-001",
                fechaHora: "2024-01-20 12:05:10",
                tipo: "salida",
                resultado: "exitoso",
                detalles: "Salida registrada"
            }
        ];

        let ambientesList = [
            "Laboratorio de Informática 1",
            "Aula 201", 
            "Taller de Electrónica",
            "Biblioteca Central",
            "Oficina de Administración"
        ];

        // Variables de paginación
        let currentPage = 1;
        const itemsPerPage = 5;
        let filteredData = [];

        // Función de inicialización del módulo
        function initializeAccesosModule() {
            console.log('✅ Módulo de accesos inicializado (Namespace aplicado)');
            loadAccesosData();
            updateStats();
            setupEventListeners();
            populateAmbientesFilter();
        }

        function setupEventListeners() {
            // Búsqueda en tiempo real
            document.getElementById('searchAccesos').addEventListener('input', function(e) {
                filterAccesos();
            });
            
            // Filtros en tiempo real
            document.getElementById('filterResultado').addEventListener('change', filterAccesos);
            document.getElementById('filterAmbiente').addEventListener('change', filterAccesos);
            document.getElementById('fechaDesde').addEventListener('change', filterAccesos);
            document.getElementById('fechaHasta').addEventListener('change', filterAccesos);
        }

        function populateAmbientesFilter() {
            const filterAmbiente = document.getElementById('filterAmbiente');
            if (!filterAmbiente) return;
            
            ambientesList.forEach(ambiente => {
                const option = document.createElement('option');
                option.value = ambiente;
                option.textContent = ambiente;
                filterAmbiente.appendChild(option);
            });
        }

        function loadAccesosData() {
            const tableBody = document.getElementById('accesosTableBody');
            if (!tableBody) {
                console.error('No se encontró la tabla de accesos');
                return;
            }
            
            tableBody.innerHTML = '';

            // Calcular índices para la paginación
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentData = filteredData.length > 0 ? filteredData : accesosData;
            const paginatedData = currentData.slice(startIndex, endIndex);

            if (paginatedData.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--accesos-text-muted);">
                        No se encontraron registros que coincidan con los filtros
                    </td>
                `;
                tableBody.appendChild(row);
                return;
            }

            paginatedData.forEach(acceso => {
                const row = document.createElement('tr');
                
                // Determinar badge de resultado
                let resultadoBadge = '';
                let resultadoText = '';
                switch(acceso.resultado) {
                    case 'exitoso':
                        resultadoBadge = 'accesos-badge-success';
                        resultadoText = '✅ Exitoso';
                        break;
                    case 'denegado':
                        resultadoBadge = 'accesos-badge-danger';
                        resultadoText = '❌ Denegado';
                        break;
                    case 'intento':
                        resultadoBadge = 'accesos-badge-warning';
                        resultadoText = '⚠️ Intento fallido';
                        break;
                }

                // Determinar ícono de tipo
                let tipoIcon = acceso.tipo === 'entrada' ? '⬆️' : '⬇️';
                let tipoText = acceso.tipo === 'entrada' ? 'Entrada' : 'Salida';

                row.innerHTML = `
                    <td>
                        <strong>${acceso.usuario}</strong>
                        <div style="font-size: 0.8rem; color: var(--accesos-text-muted);">ID: ${acceso.usuarioId}</div>
                    </td>
                    <td>${acceso.ambiente}</td>
                    <td>
                        <span class="accesos-badge accesos-badge-primary">
                            ${acceso.sensor}
                        </span>
                    </td>
                    <td>
                        <strong>${acceso.fechaHora.split(' ')[0]}</strong>
                        <div style="font-size: 0.8rem; color: var(--accesos-text-muted);">${acceso.fechaHora.split(' ')[1]}</div>
                    </td>
                    <td>
                        <span class="accesos-badge accesos-badge-neutral">
                            ${tipoIcon} ${tipoText}
                        </span>
                    </td>
                    <td><span class="accesos-status-badge ${resultadoBadge}">${resultadoText}</span></td>
                    <td>
                        <div style="font-size: 0.8rem; color: var(--accesos-text-muted); max-width: 200px;">
                            ${acceso.detalles}
                        </div>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });

            updatePaginationInfo();
        }

        function updateStats() {
            document.getElementById('totalAccesos').textContent = accesosData.length;
            document.getElementById('accesosExitosos').textContent = accesosData.filter(a => a.resultado === 'exitoso').length;
            document.getElementById('accesosDenegados').textContent = accesosData.filter(a => a.resultado === 'denegado').length;
            
            // Contar ambientes únicos con actividad
            const ambientesUnicos = [...new Set(accesosData.map(a => a.ambiente))];
            document.getElementById('ambientesActivos').textContent = ambientesUnicos.length;
        }

        function filterAccesos() {
            const searchTerm = document.getElementById('searchAccesos')?.value.toLowerCase() || '';
            const resultadoFilter = document.getElementById('filterResultado')?.value || '';
            const ambienteFilter = document.getElementById('filterAmbiente')?.value || '';
            const fechaDesde = document.getElementById('fechaDesde')?.value || '';
            const fechaHasta = document.getElementById('fechaHasta')?.value || '';
            
            filteredData = accesosData.filter(acceso => {
                // Filtro de búsqueda general
                const matchesSearch = 
                    acceso.usuario.toLowerCase().includes(searchTerm) ||
                    acceso.ambiente.toLowerCase().includes(searchTerm) ||
                    acceso.sensor.toLowerCase().includes(searchTerm) ||
                    acceso.detalles.toLowerCase().includes(searchTerm);
                
                // Filtro por resultado
                const matchesResultado = !resultadoFilter || acceso.resultado === resultadoFilter;
                
                // Filtro por ambiente
                const matchesAmbiente = !ambienteFilter || acceso.ambiente === ambienteFilter;
                
                // Filtro por fecha
                const accesoFecha = acceso.fechaHora.split(' ')[0];
                let matchesFecha = true;
                
                if (fechaDesde && accesoFecha < fechaDesde) {
                    matchesFecha = false;
                }
                if (fechaHasta && accesoFecha > fechaHasta) {
                    matchesFecha = false;
                }
                
                return matchesSearch && matchesResultado && matchesAmbiente && matchesFecha;
            });
            
            currentPage = 1;
            loadAccesosData();
        }

        function searchAccesos() {
            filterAccesos();
        }

        function clearFilters() {
            document.getElementById('searchAccesos').value = '';
            document.getElementById('filterResultado').value = '';
            document.getElementById('filterAmbiente').value = '';
            document.getElementById('fechaDesde').value = '';
            document.getElementById('fechaHasta').value = '';
            
            filteredData = [];
            currentPage = 1;
            loadAccesosData();
        }

        function updatePaginationInfo() {
            const totalItems = filteredData.length > 0 ? filteredData.length : accesosData.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startItem = (currentPage - 1) * itemsPerPage + 1;
            const endItem = Math.min(currentPage * itemsPerPage, totalItems);
            
            document.getElementById('paginationInfo').textContent = 
                `Mostrando ${startItem}-${endItem} de ${totalItems} registros`;
            
            document.getElementById('currentPage').textContent = currentPage;
            document.getElementById('prevPage').disabled = currentPage === 1;
            document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
        }

        function changePage(direction) {
            const totalItems = filteredData.length > 0 ? filteredData.length : accesosData.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            
            const newPage = currentPage + direction;
            
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                loadAccesosData();
            }
        }

        function toggleFilters() {
            const filtersContent = document.getElementById('filtersContent');
            const toggleText = document.getElementById('filtersToggleText');
            
            if (filtersContent.style.display === 'none') {
                filtersContent.style.display = 'grid';
                toggleText.textContent = 'Ocultar filtros';
            } else {
                filtersContent.style.display = 'none';
                toggleText.textContent = 'Mostrar filtros';
            }
        }

        function openExportModal() {
            const modalElement = document.getElementById('exportModal');
            if (modalElement) modalElement.classList.add('active');
        }

        function closeExportModal() {
            const modalElement = document.getElementById('exportModal');
            if (modalElement) modalElement.classList.remove('active');
        }

        function exportToCSV() {
            const dataToExport = filteredData.length > 0 ? filteredData : accesosData;
            
            if (dataToExport.length === 0) {
                alert('No hay datos para exportar');
                return;
            }
            
            // Crear contenido CSV
            const headers = ['Usuario', 'ID Usuario', 'Ambiente', 'Sensor', 'Fecha', 'Hora', 'Tipo', 'Resultado', 'Detalles'];
            const csvContent = [
                headers.join(','),
                ...dataToExport.map(acceso => [
                    `"${acceso.usuario}"`,
                    acceso.usuarioId,
                    `"${acceso.ambiente}"`,
                    acceso.sensor,
                    acceso.fechaHora.split(' ')[0],
                    acceso.fechaHora.split(' ')[1],
                    acceso.tipo,
                    acceso.resultado,
                    `"${acceso.detalles}"`
                ].join(','))
            ].join('\n');
            
            // Descargar archivo
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `accesos_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            closeExportModal();
            alert('✅ Datos exportados exitosamente a CSV');
        }

        function exportToPDF() {
            alert('📄 Función de exportación a PDF (próximamente)');
        }

        function refreshAccesos() {
            loadAccesosData();
            updateStats();
            alert('✅ Lista de accesos actualizada');
        }

        // Hacer funciones globales
        window.initializeAccesosModule = initializeAccesosModule;
        window.searchAccesos = searchAccesos;
        window.clearFilters = clearFilters;
        window.changePage = changePage;
        window.toggleFilters = toggleFilters;
        window.openExportModal = openExportModal;
        window.closeExportModal = closeExportModal;
        window.exportToCSV = exportToCSV;
        window.exportToPDF = exportToPDF;
        window.refreshAccesos = refreshAccesos;




