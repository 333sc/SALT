// SALT-PROJECT/public/instructor/js/mis-ambientes.js

// Datos de ejemplo
let ambientesSupervisados = [
    {
        id: 1,
        nombre: "Laboratorio de Química",
        ubicacion: "Edificio D, Piso 1",
        capacidad: 15,
        ocupacion: 0,
        estado: "Libre",
        aprendices: []
    },
    {
        id: 2,
        nombre: "Aula 301 - TICs",
        ubicacion: "Edificio C, Piso 3",
        capacidad: 30,
        ocupacion: 5,
        estado: "Ocupado",
        aprendices: [
            { nombre: "Juan Pérez", id: "101567890" }, 
            { nombre: "Marta López", id: "101567891" }, 
            { nombre: "Luis García", id: "101567892" }, 
            { nombre: "Ana Díaz", id: "101567893" }, 
            { nombre: "David Soto", id: "101567894" }
        ]
    },
    {
        id: 3,
        nombre: "Taller de Máquinas",
        ubicacion: "Edificio C, Sótano",
        capacidad: 20,
        ocupacion: 1,
        estado: "Ocupado",
        aprendices: [{ nombre: "Carlos Nieto", id: "101567895" }]
    }
];

let aprendicesAsignados = [
    { id: 101567890, nombre: "Juan Pérez García", ultimoAcceso: "10:30 AM", ambienteActual: "Aula 301 - TICs", enAmbiente: true, anomalia: false },
    { id: 101567891, nombre: "María López Díaz", ultimoAcceso: "9:00 AM", ambienteActual: "Fuera de ambiente / Olvido salida", enAmbiente: false, anomalia: true },
    { id: 101567896, nombre: "Sofía Martínez", ultimoAcceso: "Ayer", ambienteActual: "-", enAmbiente: false, anomalia: false }
];

function loadMisAmbientesData() {
    console.log('📊 Cargando datos de Mis Ambientes...');
    renderAmbientesTable();
    renderAprendicesTable();
}

function renderAmbientesTable() {
    const tbody = document.getElementById('instructorAmbientesTableBody');
    if (!tbody) {
        console.error('❌ No se encontró instructorAmbientesTableBody');
        return;
    }
    
    tbody.innerHTML = '';

    ambientesSupervisados.forEach(ambiente => {
        const row = tbody.insertRow();
        const statusClass = ambiente.estado === 'Libre' ? 'status-success' : 'status-warning status-ocupado';
        const aprendicesDisplay = ambiente.aprendices.length > 0
            ? ambiente.aprendices.slice(0, 2).map(a => `**${a.nombre.split(' ')[0]}**`).join(', ') + (ambiente.aprendices.length > 2 ? ', ...' : '')
            : '-';

        row.innerHTML = `
            <td>${ambiente.nombre}</td>
            <td>${ambiente.ubicacion}</td>
            <td class="${statusClass}">${ambiente.estado}</td>
            <td>${ambiente.ocupacion} / ${ambiente.capacidad}</td>
            <td>${aprendicesDisplay}</td>
            <td>
                <button class="btn-primary" ${ambiente.ocupacion === 0 ? 'disabled' : ''} onclick="verListaAprendices(${ambiente.id})">Ver Lista</button>
                <button class="btn-primary btn-danger" onclick="reportarAnomalia(${ambiente.id})">Reportar Anomalía 🚨</button>
            </td>
        `;
    });
}

function renderAprendicesTable() {
    const tbody = document.getElementById('aprendicesTableBody');
    if (!tbody) {
        console.error('❌ No se encontró aprendicesTableBody');
        return;
    }
    
    tbody.innerHTML = '';

    aprendicesAsignados.forEach(aprendiz => {
        const row = tbody.insertRow();
        const ambienteClass = aprendiz.anomalia ? 'status-danger' : '';
        
        row.innerHTML = `
            <td>${aprendiz.nombre}</td>
            <td>${aprendiz.id}</td>
            <td>${aprendiz.ultimoAcceso}</td>
            <td class="${ambienteClass}">${aprendiz.ambienteActual}</td>
            <td>
                ${aprendiz.enAmbiente ?
                    `<button class="btn-primary btn-success" onclick="validarAcceso(${aprendiz.id})">Validar OK</button>` :
                    `<button class="btn-primary btn-warning" onclick="navegarAIrregularidades()">Ver Incidencia</button>`
                }
            </td>
        `;
    });
}

// Funciones de Acción
window.verListaAprendices = function(id) {
    const ambiente = ambientesSupervisados.find(a => a.id === id);
    if (ambiente) {
        alert(`Aprendices en ${ambiente.nombre}:\n${ambiente.aprendices.map(a => a.nombre).join('\n')}`);
    }
}

window.reportarAnomalia = function(id) {
    alert(`Iniciando reporte de anomalía para Ambiente ID: ${id}.`);
    window.location.hash = '#irregularidades';
}

window.validarAcceso = function(id) {
    alert(`Acceso de Aprendiz ID: ${id} validado correctamente. Se registra OK.`);
}

window.navegarAIrregularidades = function() {
    window.location.hash = '#irregularidades';
}

// Función de inicialización del módulo
function initializeMisambientesModule() {
    console.log('✅ Módulo Mis Ambientes inicializado.');
    loadMisAmbientesData();
}

// Hacer las funciones disponibles globalmente
window.initializeMisambientesModule = initializeMisambientesModule;
window.loadMisAmbientesData = loadMisAmbientesData;
window.renderAmbientesTable = renderAmbientesTable;
window.renderAprendicesTable = renderAprendicesTable;

// Auto-inicializar si el módulo se carga directamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMisambientesModule);
} else {
    initializeMisambientesModule();
}