// Datos de ejemplo para el historial del aprendiz
let historialData = [
    {
        id: 1,
        fechaHora: "2024-01-20 08:15:30",
        ambiente: "Laboratorio de Informática 1",
        tipo: "entrada",
        resultado: "exitoso",
        duracion: "2h 15m",
        detalles: "Acceso para práctica de programación"
    },
    {
        id: 2,
        fechaHora: "2024-01-20 10:30:45",
        ambiente: "Laboratorio de Informática 1",
        tipo: "salida",
        resultado: "exitoso",
        duracion: "-",
        detalles: "Salida registrada"
    },
    {
        id: 3,
        fechaHora: "2024-01-20 14:20:15",
        ambiente: "Aula 201",
        tipo: "entrada",
        resultado: "exitoso",
        duracion: "1h 30m",
        detalles: "Clase de matemáticas"
    },
    {
        id: 4,
        fechaHora: "2024-01-19 09:05:20",
        ambiente: "Biblioteca Central",
        tipo: "entrada",
        resultado: "exitoso",
        duracion: "3h 45m",
        detalles: "Estudio individual"
    },
    {
        id: 5,
        fechaHora: "2024-01-18 16:40:10",
        ambiente: "Taller de Electrónica",
        tipo: "entrada",
        resultado: "denegado",
        duracion: "-",
        detalles: "No autorizado para este ambiente"
    }
];

// Variables de paginación
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [];

// Función de inicialización del módulo
function initializeHistorialModule() {
    console.log('✅ Módulo de historial del aprendiz inicializado');
    loadHistorialData();
    updateHistorialStats();
    setupEventListeners();
    updateWeeklySummary();
}

function setupEventListeners() {
    // Búsqueda en tiempo real
    document.getElementById('searchHistorial').addEventListener('input', function(e) {
        filterHistorial();
    });
    
    // Filtros en tiempo real
    document.getElementById('filterTipo').addEventListener('change', filterHistorial);
    document.getElementById('filterResultado').addEventListener('change', filterHistorial);
    document.getElementById('fechaDesde').addEventListener('change', filterHistorial);
    document.getElementById('fechaHasta').addEventListener('change', filterHistorial);
}

function loadHistorialData() {
    const tableBody = document.getElementById('historialTableBody');
    if (!tableBody) {
        console.error('No se encontró la tabla de historial');
        return;
    }
    
    tableBody.innerHTML = '';

    // Calcular índices para la paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.length > 0 ? filteredData : historialData;
    const paginatedData = currentData.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 2rem; color: var(--historial-text-muted);">
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
                resultadoBadge = 'historial-badge-success';
                resultadoText = '✅ Exitoso';
                break;
            case 'denegado':
                resultadoBadge = 'historial-badge-danger';
                resultadoText = '❌ Denegado';
                break;
        }

        // Determinar ícono de tipo
        let tipoIcon = acceso.tipo === 'entrada' ? '⬆️' : '⬇️';
        let tipoText = acceso.tipo === 'entrada' ? 'Entrada' : 'Salida';

        row.innerHTML = `
            <td>
                <strong>${acceso.fechaHora.split(' ')[0]}</strong>
                <div style="font-size: 0.8rem; color: var(--historial-text-muted);">${acceso.fechaHora.split(' ')[1]}</div>
            </td>
            <td>
                <strong>${acceso.ambiente}</strong>
            </td>
            <td>
                <span class="historial-badge historial-badge-neutral">
                    ${tipoIcon} ${tipoText}
                </span>
            </td>
            <td><span class="historial-badge ${resultadoBadge}">${resultadoText}</span></td>
            <td>
                <span style="color: ${acceso.duracion !== '-' ? 'var(--historial-primary-color)' : 'var(--historial-text-muted)'}">
                    ${acceso.duracion}
                </span>
            </td>
            <td>
                <div style="font-size: 0.8rem; color: var(--historial-text-muted); max-width: 200px;">
                    ${acceso.detalles}
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    updatePaginationInfo();
}

function updateHistorialStats() {
    document.getElementById('totalAccesos').textContent = historialData.length;
    document.getElementById('accesosExitosos').textContent = historialData.filter(a => a.resultado === 'exitoso').length;
    
    // Calcular tiempo total (sumar todas las duraciones)
    const tiempoTotal = historialData
        .filter(a => a.duracion !== '-')
        .reduce((total, acceso) => {
            const [horas, minutos] = acceso.duracion.split('h ');
            return total + parseInt(horas) + (parseInt(minutos) / 60);
        }, 0);
    
    document.getElementById('tiempoTotal').textContent = `${Math.round(tiempoTotal)}h`;
    
    // Contar ambientes únicos visitados
    const ambientesUnicos = [...new Set(historialData
        .filter(a => a.resultado === 'exitoso' && a.tipo === 'entrada')
        .map(a => a.ambiente))];
    document.getElementById('ambientesVisitados').textContent = ambientesUnicos.length;
}

function updateWeeklySummary() {
    // Datos de ejemplo para el resumen semanal
    document.getElementById('accesosSemana').textContent = '8';
    document.getElementById('tiempoSemana').textContent = '2.5h';
    document.getElementById('ambienteFrecuente').textContent = 'Laboratorio Informática';
}

function filterHistorial() {
    const searchTerm = document.getElementById('searchHistorial')?.value.toLowerCase() || '';
    const tipoFilter = document.getElementById('filterTipo')?.value || '';
    const resultadoFilter = document.getElementById('filterResultado')?.value || '';
    const fechaDesde = document.getElementById('fechaDesde')?.value || '';
    const fechaHasta = document.getElementById('fechaHasta')?.value || '';
    
    filteredData = historialData.filter(acceso => {
        // Filtro de búsqueda
        const matchesSearch = 
            acceso.ambiente.toLowerCase().includes(searchTerm) ||
            acceso.detalles.toLowerCase().includes(searchTerm);
        
        // Filtro por tipo
        const matchesTipo = !tipoFilter || acceso.tipo === tipoFilter;
        
        // Filtro por resultado
        const matchesResultado = !resultadoFilter || acceso.resultado === resultadoFilter;
        
        // Filtro por fecha
        const accesoFecha = acceso.fechaHora.split(' ')[0];
        let matchesFecha = true;
        
        if (fechaDesde && accesoFecha < fechaDesde) {
            matchesFecha = false;
        }
        if (fechaHasta && accesoFecha > fechaHasta) {
            matchesFecha = false;
        }
        
        return matchesSearch && matchesTipo && matchesResultado && matchesFecha;
    });
    
    currentPage = 1;
    loadHistorialData();
}

function searchHistorial() {
    filterHistorial();
}

function clearFilters() {
    document.getElementById('searchHistorial').value = '';
    document.getElementById('filterTipo').value = '';
    document.getElementById('filterResultado').value = '';
    document.getElementById('fechaDesde').value = '';
    document.getElementById('fechaHasta').value = '';
    
    filteredData = [];
    currentPage = 1;
    loadHistorialData();
}

function updatePaginationInfo() {
    const totalItems = filteredData.length > 0 ? filteredData.length : historialData.length;
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
    const totalItems = filteredData.length > 0 ? filteredData.length : historialData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        loadHistorialData();
    }
}

function exportarMiHistorial() {
    const dataToExport = filteredData.length > 0 ? filteredData : historialData;
    
    if (dataToExport.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    // Crear contenido CSV
    const headers = ['Fecha', 'Hora', 'Ambiente', 'Tipo', 'Resultado', 'Duración', 'Detalles'];
    const csvContent = [
        headers.join(','),
        ...dataToExport.map(acceso => {
            const [fecha, hora] = acceso.fechaHora.split(' ');
            return [
                fecha,
                hora,
                `"${acceso.ambiente}"`,
                acceso.tipo,
                acceso.resultado,
                acceso.duracion,
                `"${acceso.detalles}"`
            ].join(',');
        })
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mi_historial_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('✅ Historial exportado exitosamente a CSV');
}

function refreshHistorial() {
    loadHistorialData();
    updateHistorialStats();
    alert('✅ Historial actualizado');
}

// Hacer funciones globales
window.initializeHistorialModule = initializeHistorialModule;
window.searchHistorial = searchHistorial;
window.clearFilters = clearFilters;
window.changePage = changePage;
window.exportarMiHistorial = exportarMiHistorial;
window.refreshHistorial = refreshHistorial;
window.filterHistorial = filterHistorial;