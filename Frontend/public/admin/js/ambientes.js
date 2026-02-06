// Datos de ejemplo
let ambientesData = [
    {
        id: 1,
        nombre: "Laboratorio de Informática 1",
        tipo: "laboratorio",
        ubicacion: "Edificio A - Piso 2",
        capacidad: 25,
        descripcion: "Laboratorio equipado con computadoras para programación",
        sensores: ["RFID-001", "RFID-002"],
        usuariosAutorizados: [1, 2],
        estado: "activo",
        fechaCreacion: "2024-01-15"
    },
    {
        id: 2,
        nombre: "Aula 201",
        tipo: "aula",
        ubicacion: "Edificio B - Piso 1",
        capacidad: 40,
        descripcion: "Aula teórica general",
        sensores: ["RFID-003"],
        usuariosAutorizados: [1, 2, 3],
        estado: "activo",
        fechaCreacion: "2024-01-10"
    },
    {
        id: 3,
        nombre: "Taller de Electrónica",
        tipo: "taller",
        ubicacion: "Edificio C - Piso 1",
        capacidad: 20,
        descripcion: "Taller especializado en electrónica y robótica",
        sensores: [],
        usuariosAutorizados: [2],
        estado: "mantenimiento",
        fechaCreacion: "2024-02-01"
    }
];

let sensoresDisponibles = [
    { id: "RFID-001", nombre: "Lector Principal Lab 1", estado: "activo" },
    { id: "RFID-002", nombre: "Lector Secundario Lab 1", estado: "activo" },
    { id: "RFID-003", nombre: "Lector Aula 201", estado: "activo" },
    { id: "RFID-004", nombre: "Lector Biblioteca", estado: "inactivo" }
];

let editingAmbienteId = null;
let currentAuthAmbiente = null;

// Función de inicialización del módulo
function initializeAmbientesModule() {
    console.log('✅ Módulo de ambientes inicializado (Namespace aplicado)');
    loadAmbientesData();
    updateStats();
    setupEventListeners();
}

function setupEventListeners() {
    // Búsqueda en tiempo real
    document.getElementById('searchAmbientes').addEventListener('input', function(e) {
        filterAmbientes();
    });
    
    // Form submit
    document.getElementById('ambienteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAmbiente();
    });
}

function loadAmbientesData() {
    const tableBody = document.getElementById('ambientesTableBody');
    if (!tableBody) {
        console.error('No se encontró la tabla de ambientes');
        return;
    }
    
    tableBody.innerHTML = '';

    ambientesData.forEach(ambiente => {
        const row = document.createElement('tr');
        
        // Determinar badge de estado
        let estadoBadge = '';
        let estadoText = '';
        switch(ambiente.estado) {
            case 'activo':
                estadoBadge = 'ambientes-badge-active';
                estadoText = '✅ Activo';
                break;
            case 'inactivo':
                estadoBadge = 'ambientes-badge-inactive';
                estadoText = '❌ Inactivo';
                break;
            case 'mantenimiento':
                estadoBadge = 'ambientes-badge-maintenance';
                estadoText = '🔧 Mantenimiento';
                break;
        }

        row.innerHTML = `
            <td>
                <strong>${ambiente.nombre}</strong>
                <div style="font-size: 0.8rem; color: var(--ambientes-text-muted);">${ambiente.descripcion}</div>
            </td>
            <td>
                <span class="ambientes-badge" style="background: #6c757d; color: white;">
                    ${ambiente.tipo.charAt(0).toUpperCase() + ambiente.tipo.slice(1)}
                </span>
            </td>
            <td>${ambiente.ubicacion}</td>
            <td>
                ${ambiente.sensores.length > 0 ? 
                    ambiente.sensores.map(s => `<span class="ambientes-badge" style="background: var(--ambientes-primary-color); color: white; margin: 2px;">${s}</span>`).join('') : 
                    '<span style="color: var(--ambientes-text-muted);">Sin sensores</span>'
                }
            </td>
            <td>
                <span style="color: ${ambiente.usuariosAutorizados.length > 0 ? 'var(--ambientes-success-color)' : 'var(--ambientes-text-muted)'}">
                    ${ambiente.usuariosAutorizados.length} usuarios
                </span>
            </td>
            <td><span class="ambientes-status-badge ${estadoBadge}">${estadoText}</span></td>
            <td>
                <div class="ambientes-actions-small">
                    <button class="ambientes-btn-sm ambientes-btn-edit" onclick="editAmbiente(${ambiente.id})">✏️ Editar</button>
                    <button class="ambientes-btn-sm ambientes-btn-assign" onclick="manageUsuariosAuth(${ambiente.id})">👥 Usuarios</button>
                    <button class="ambientes-btn-sm ambientes-btn-delete" onclick="deleteAmbiente(${ambiente.id})">🗑️ Eliminar</button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function updateStats() {
    const totalElement = document.getElementById('totalAmbientes');
    const activosElement = document.getElementById('ambientesActivos');
    const sensoresElement = document.getElementById('sensoresAsociados');
    const usuariosElement = document.getElementById('usuariosAutorizados');
    
    if (totalElement) totalElement.textContent = ambientesData.length;
    if (activosElement) activosElement.textContent = ambientesData.filter(a => a.estado === 'activo').length;
    if (sensoresElement) sensoresElement.textContent = ambientesData.reduce((total, a) => total + a.sensores.length, 0);
    if (usuariosElement) usuariosElement.textContent = ambientesData.reduce((total, a) => total + a.usuariosAutorizados.length, 0);
}

function openAmbienteModal() {
    editingAmbienteId = null;
    const titleElement = document.getElementById('ambienteModalTitle');
    if (titleElement) titleElement.textContent = 'Nuevo Ambiente';
    
    const formElement = document.getElementById('ambienteForm');
    if (formElement) formElement.reset();
    
    loadSensoresList();
    
    const modalElement = document.getElementById('ambienteModal');
    if (modalElement) modalElement.classList.add('active');
}

function closeAmbienteModal() {
    const modalElement = document.getElementById('ambienteModal');
    if (modalElement) modalElement.classList.remove('active');
}

function loadSensoresList() {
    const sensorsList = document.getElementById('sensorsList');
    if (!sensorsList) return;
    
    sensorsList.innerHTML = '';

    sensoresDisponibles.forEach(sensor => {
        const sensorItem = document.createElement('div');
        sensorItem.className = 'ambientes-sensor-item';
        sensorItem.innerHTML = `
            <input type="checkbox" id="sensor-${sensor.id}" value="${sensor.id}">
            <label for="sensor-${sensor.id}">
                ${sensor.nombre} <span style="color: var(--ambientes-text-muted);">(${sensor.id})</span>
            </label>
        `;
        sensorsList.appendChild(sensorItem);
    });
}

function saveAmbiente() {
    const nombre = document.getElementById('ambienteNombre');
    const tipo = document.getElementById('ambienteTipo');
    const ubicacion = document.getElementById('ambienteUbicacion');
    const capacidad = document.getElementById('ambienteCapacidad');
    const descripcion = document.getElementById('ambienteDescripcion');
    
    if (!nombre || !tipo || !ubicacion) {
        alert('Error: No se pudieron obtener los datos del formulario');
        return;
    }

    const formData = {
        nombre: nombre.value,
        tipo: tipo.value,
        ubicacion: ubicacion.value,
        capacidad: capacidad ? parseInt(capacidad.value) || 0 : 0,
        descripcion: descripcion ? descripcion.value : '',
        estado: document.querySelector('input[name="estado"]:checked')?.value || 'activo',
        sensores: Array.from(document.querySelectorAll('#sensorsList input:checked')).map(cb => cb.value)
    };

    if (editingAmbienteId) {
        // Editar ambiente existente
        const index = ambientesData.findIndex(a => a.id === editingAmbienteId);
        ambientesData[index] = { ...ambientesData[index], ...formData };
    } else {
        // Nuevo ambiente
        const newId = Math.max(...ambientesData.map(a => a.id), 0) + 1;
        ambientesData.push({
            id: newId,
            ...formData,
            usuariosAutorizados: [],
            fechaCreacion: new Date().toISOString().split('T')[0]
        });
    }

    closeAmbienteModal();
    loadAmbientesData();
    updateStats();
    alert('✅ Ambiente guardado exitosamente');
}

function editAmbiente(id) {
    const ambiente = ambientesData.find(a => a.id === id);
    if (!ambiente) return;

    editingAmbienteId = id;
    const titleElement = document.getElementById('ambienteModalTitle');
    if (titleElement) titleElement.textContent = 'Editar Ambiente';
    
    // Llenar formulario
    const nombre = document.getElementById('ambienteNombre');
    const tipo = document.getElementById('ambienteTipo');
    const ubicacion = document.getElementById('ambienteUbicacion');
    const capacidad = document.getElementById('ambienteCapacidad');
    const descripcion = document.getElementById('ambienteDescripcion');
    
    if (nombre) nombre.value = ambiente.nombre;
    if (tipo) tipo.value = ambiente.tipo;
    if (ubicacion) ubicacion.value = ambiente.ubicacion;
    if (capacidad) capacidad.value = ambiente.capacidad;
    if (descripcion) descripcion.value = ambiente.descripcion;
    
    // Estado
    const estadoRadio = document.querySelector(`input[name="estado"][value="${ambiente.estado}"]`);
    if (estadoRadio) estadoRadio.checked = true;
    
    // Sensores
    loadSensoresList();
    setTimeout(() => {
        ambiente.sensores.forEach(sensorId => {
            const checkbox = document.getElementById(`sensor-${sensorId}`);
            if (checkbox) checkbox.checked = true;
        });
    }, 100);
    
    const modalElement = document.getElementById('ambienteModal');
    if (modalElement) modalElement.classList.add('active');
}

function deleteAmbiente(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este ambiente?')) {
        ambientesData = ambientesData.filter(a => a.id !== id);
        loadAmbientesData();
        updateStats();
        alert('✅ Ambiente eliminado');
    }
}

function manageUsuariosAuth(ambienteId) {
    currentAuthAmbiente = ambienteId;
    const ambiente = ambientesData.find(a => a.id === ambienteId);
    const titleElement = document.getElementById('ambienteUsuariosTitle');
    if (titleElement && ambiente) titleElement.textContent = ambiente.nombre;
    
    loadUsuariosForAuth();
    
    const modalElement = document.getElementById('usuariosModal');
    if (modalElement) modalElement.classList.add('active');
}

function closeUsuariosModal() {
    const modalElement = document.getElementById('usuariosModal');
    if (modalElement) modalElement.classList.remove('active');
}

function loadUsuariosForAuth() {
    // En una implementación real, esto cargaría usuarios de una API
    console.log('Cargando usuarios para autorización...');
}

function filterAmbientes() {
    const searchTerm = document.getElementById('searchAmbientes')?.value.toLowerCase() || '';
    const estadoFilter = document.getElementById('filterEstado')?.value || '';
    const tipoFilter = document.getElementById('filterTipo')?.value || '';
    
    console.log('Filtrando ambientes:', { searchTerm, estadoFilter, tipoFilter });
    // Implementar lógica de filtrado aquí
}

function refreshAmbientes() {
    loadAmbientesData();
    updateStats();
    alert('✅ Lista de ambientes actualizada');
}

// Hacer funciones globales
window.initializeAmbientesModule = initializeAmbientesModule;
window.openAmbienteModal = openAmbienteModal;
window.closeAmbienteModal = closeAmbienteModal;
window.editAmbiente = editAmbiente;
window.deleteAmbiente = deleteAmbiente;
window.manageUsuariosAuth = manageUsuariosAuth;
window.closeUsuariosModal = closeUsuariosModal;
window.refreshAmbientes = refreshAmbientes;
window.filterAmbientes = filterAmbientes;

