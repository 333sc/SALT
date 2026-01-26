// SALT-PROJECT/public/instructor/js/irregularidades.js

let irregularidadesData = [
    {
        id: 1,
        tipo: "ALERTA: Olvido de Salida",
        aprendiz: "Juan Pérez",
        aprendizId: "101567890",
        ambiente: "Aula 301 - TICs",
        detalle: "Entrada: 10:30 AM (Lleva 5h dentro)",
        estado: "PENDIENTE",
        gravedad: "warning"
    },
    {
        id: 2,
        tipo: "INCIDENCIA: Acceso Denegado por Autorización",
        aprendiz: "Ana Gómez",
        aprendizId: "101567892",
        ambiente: "Laboratorio de Química",
        detalle: "Permiso no vigente para este ambiente",
        estado: "PENDIENTE",
        gravedad: "danger"
    },
    {
        id: 3,
        tipo: "ALERTA: Acceso con Documento Vencido",
        aprendiz: "Marta Ríos",
        aprendizId: "101567893",
        ambiente: "Sala de Audiovisuales",
        detalle: "Cédula o carné vencido",
        estado: "RESUELTO",
        gravedad: "warning"
    }
];

function loadIrregularidadesData() {
    console.log('📋 Cargando datos de Irregularidades...');
    
    // Asignar el evento de cambio al selector de filtro
    const select = document.getElementById('filtroEstadoIrregularidades');
    if (select) {
        select.addEventListener('change', renderIrregularidadesList);
        console.log('✅ Event listener asignado al select');
    } else {
        console.error('❌ No se encontró filtroEstadoIrregularidades');
    }
    
    renderIrregularidadesList();
}

function renderIrregularidadesList() {
    const list = document.getElementById('irregularidadesList');
    if (!list) {
        console.error('❌ No se encontró irregularidadesList');
        return;
    }
    
    list.innerHTML = '';

    const filtro = document.getElementById('filtroEstadoIrregularidades')?.value || 'pendiente';
    
    const irregularidadesFiltradas = irregularidadesData.filter(item => {
        if (filtro === 'pendiente') return item.estado === 'PENDIENTE';
        if (filtro === 'resuelto') return item.estado === 'RESUELTO';
        return true; // 'todos'
    });

    if (irregularidadesFiltradas.length === 0) {
        list.innerHTML = `
            <div class="no-data-message">
                <p>No hay irregularidades que mostrar con el filtro seleccionado.</p>
            </div>
        `;
        return;
    }

    irregularidadesFiltradas.forEach(item => {
        const listItem = document.createElement('li');
        const statusClass = item.gravedad === 'danger' ? 'status-danger' : 'status-warning';
        const buttonText = item.estado === 'PENDIENTE' ? 'Resolver / Comentar' : 'Ver Detalle';
        const buttonAction = item.estado === 'PENDIENTE' ? `resolver(${item.id})` : `verDetalle(${item.id})`;
        const itemClass = item.gravedad === 'danger' ? 'irregularidad-item danger' : 'irregularidad-item';

        listItem.className = itemClass;
        
        listItem.innerHTML = `
            <div>
                <strong class="${statusClass}">${item.tipo}</strong>
                <p>Aprendiz: <strong>${item.aprendiz}</strong> (${item.aprendizId})</p>
                <p>Ambiente: ${item.ambiente} | ${item.detalle}</p>
            </div>
            <div>
                <span class="${statusClass}" style="display: block; margin-bottom: 0.5rem;">${item.estado}</span>
                <button class="btn-primary" onclick="${buttonAction}">${buttonText}</button>
            </div>
        `;
        list.appendChild(listItem);
    });
}

// Funciones de Acción
window.resolver = function(id) {
    const item = irregularidadesData.find(i => i.id === id);
    if (item && confirm(`¿Deseas marcar como RESUELTO la irregularidad ID ${id} (${item.tipo})?`)) {
        item.estado = 'RESUELTO';
        renderIrregularidadesList();
        alert(`✅ Irregularidad ID ${id} resuelta.`);
    }
}

window.verDetalle = function(id) {
    const item = irregularidadesData.find(i => i.id === id);
    if (item) {
        alert(`📋 Detalle de Irregularidad ID ${id}:\n\nTipo: ${item.tipo}\nAprendiz: ${item.aprendiz}\nAmbiente: ${item.ambiente}\nEstado: ${item.estado}\nDetalle: ${item.detalle}`);
    }
}

window.actualizarIrregularidadesList = function() {
    console.log('🔄 Actualizando lista de irregularidades...');
    renderIrregularidadesList();
    alert('✅ Lista de irregularidades actualizada.');
}

// Función de inicialización del módulo
function initializeIrregularidadesModule() {
    console.log('✅ Módulo Irregularidades inicializado.');
    loadIrregularidadesData();
}

// Hacer las funciones disponibles globalmente
window.initializeIrregularidadesModule = initializeIrregularidadesModule;
window.loadIrregularidadesData = loadIrregularidadesData;
window.renderIrregularidadesList = renderIrregularidadesList;

// Auto-inicializar si el módulo se carga directamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIrregularidadesModule);
} else {
    initializeIrregularidadesModule();
}