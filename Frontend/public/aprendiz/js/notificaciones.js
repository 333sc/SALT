// js/modules/notificaciones.js - Lógica de Notificaciones para el Aprendiz

// DATOS DE EJEMPLO - SIN BASE DE DATOS
let notificacionesData = [
    {
        id: 1,
        asunto: "🔔 Olvido de Salida Detectado",
        mensaje: "Se detectó que olvidaste registrar tu **salida** del 'Laboratorio de Informática 1' el 2024-10-12 a las 18:00. Se registró una salida automática.",
        fecha: "2024-10-12 18:05:00",
        tipo: "alerta",
        leida: false
    },
    {
        id: 2,
        asunto: "✅ Nueva Autorización de Ambiente",
        mensaje: "Tu solicitud de acceso al 'Taller de Electrónica' ha sido **aprobada**. Ahora tienes acceso hasta el 2025-06-30.",
        fecha: "2024-10-10 10:30:00",
        tipo: "informativa",
        leida: false
    },
    {
        id: 3,
        asunto: "🚫 Acceso Denegado",
        mensaje: "Tu intento de acceso al 'Laboratorio de Química' fue **denegado**. No tienes autorización para este ambiente.",
        fecha: "2024-10-05 09:00:00",
        tipo: "urgente",
        leida: true
    },
    {
        id: 4,
        asunto: "🚧 Mantenimiento Programado",
        mensaje: "El 'Laboratorio de Informática 1' estará fuera de servicio por mantenimiento el próximo lunes.",
        fecha: "2024-10-01 15:00:00",
        tipo: "informativa",
        leida: true
    }
];

// Función para formatear fechas
function formatFecha(fechaString) {
    const fecha = new Date(fechaString);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    
    // Si es hoy
    if (fecha.toDateString() === hoy.toDateString()) {
        return `Hoy ${fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Si es ayer
    if (fecha.toDateString() === ayer.toDateString()) {
        return `Ayer ${fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para obtener datos de notificaciones (usa el array local)
function getNotificacionesData() {
    return notificacionesData;
}

// Función principal para cargar las notificaciones en la vista
function loadNotificaciones() {
    const listElement = document.getElementById('notificacionesList');
    if (!listElement) {
        console.error('Elemento notificacionesList no encontrado');
        return;
    }

    // Obtener datos
    const notificacionesData = getNotificacionesData();
    
    // Limpiar lista
    listElement.innerHTML = '';

    // Ordenar: No leídas primero, luego por fecha (más reciente primero)
    const sortedData = [...notificacionesData].sort((a, b) => {
        if (a.leida !== b.leida) {
            return a.leida ? 1 : -1; // No leídas (false) primero
        }
        return new Date(b.fecha) - new Date(a.fecha);
    });

    // Si no hay notificaciones
    if (sortedData.length === 0) {
        listElement.innerHTML = `
            <li class="notificacion-item" style="text-align: center; padding: 3rem; background: var(--card-bg); border-radius: 10px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1rem;">
                    No tienes notificaciones pendientes
                </p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">
                    ¡Todo está al día! Te notificaremos cuando tengas nuevas actualizaciones.
                </p>
            </li>
        `;
        
        // Actualizar contador después de cargar
        updateNotificationCount();
        return;
    }

    // Crear elementos de notificación
    sortedData.forEach(notif => {
        const item = document.createElement('li');
        item.className = `notificacion-item ${notif.leida ? 'read' : 'unread'}`;
        item.setAttribute('data-id', notif.id);
        
        const icono = notif.leida ? '✉️' : '📧';
        const fechaFormateada = formatFecha(notif.fecha);
        
        // Determinar color del borde según el tipo
        let borderColor = 'var(--primary-color)';
        if (notif.tipo === 'urgente') {
            borderColor = 'var(--danger-color)';
        } else if (notif.tipo === 'alerta') {
            borderColor = 'var(--warning-color)';
        }

        item.innerHTML = `
            <div class="notificacion-header">
                <span class="notificacion-subject">${icono} ${notif.asunto}</span>
                <span class="notificacion-time">${fechaFormateada}</span>
            </div>
            <p>${notif.mensaje}</p>
            <div class="notificacion-actions">
                ${!notif.leida ? `
                    <button class="notificacion-btn mark-read-btn" onclick="marcarLeida(${notif.id})">
                        <span>👁️</span> Marcar como Leída
                    </button>
                ` : ''}
                <button class="notificacion-btn delete-btn" onclick="eliminarNotificacion(${notif.id})">
                    <span>🗑️</span> Eliminar
                </button>
            </div>
        `;
        
        // Aplicar color de borde
        item.style.borderLeft = `5px solid ${borderColor}`;
        
        listElement.appendChild(item);
    });
    
    console.log(`Cargadas ${sortedData.length} notificaciones`);
    
    // Actualizar contador después de cargar
    updateNotificationCount();
}

// Función para actualizar el contador (sincronizada con la bandeja)
function updateNotificationCount() {
    const notificacionesData = getNotificacionesData();
    const unreadCount = notificacionesData.filter(n => !n.leida).length;
    
    console.log(`Calculando contador: ${unreadCount} notificaciones sin leer de ${notificacionesData.length} totales`);
    
    // Actualizar contador en la barra lateral
    const counterElement = document.getElementById('notificationCount');
    if (counterElement) {
        counterElement.textContent = unreadCount;
        if (unreadCount > 0) {
            counterElement.style.display = 'flex';
        } else {
            counterElement.style.display = 'none';
        }
        console.log(`Contador actualizado en barra lateral: ${unreadCount}`);
    } else {
        console.warn('Elemento notificationCount no encontrado en la barra lateral');
    }
    
    // Actualizar contador en el dashboard
    const dashboardCounter = document.getElementById('notificacionesPendientes');
    if (dashboardCounter) {
        dashboardCounter.textContent = unreadCount;
        console.log(`Contador actualizado en dashboard: ${unreadCount}`);
    }
    
    return unreadCount;
}

// Función para marcar una notificación como leída
function marcarLeida(id) {
    console.log(`Marcando como leída la notificación ${id}`);
    
    // Encontrar la notificación en el array
    const notificacionIndex = notificacionesData.findIndex(n => n.id === id);
    if (notificacionIndex !== -1) {
        notificacionesData[notificacionIndex].leida = true;
        console.log(`Notificación ${id} marcada como leída`);
        
        // Recargar notificaciones y actualizar contador
        loadNotificaciones();
        
        // Mostrar confirmación visual
        showNotification('✅ Notificación marcada como leída', 'success');
    } else {
        console.error(`Notificación ${id} no encontrada`);
        showNotification('❌ Error al marcar la notificación', 'error');
    }
}

// Función para eliminar una notificación
function eliminarNotificacion(id) {
    console.log(`Eliminando la notificación ${id}`);
    
    // Confirmar eliminación
    if (!confirm(`¿Estás seguro de que deseas eliminar esta notificación? Esta acción no se puede deshacer.`)) {
        return;
    }
    
    // Filtrar el array para eliminar la notificación
    const initialLength = notificacionesData.length;
    notificacionesData = notificacionesData.filter(n => n.id !== id);
    
    if (notificacionesData.length < initialLength) {
        console.log(`Notificación ${id} eliminada`);
        
        // Recargar notificaciones y actualizar contador
        loadNotificaciones();
        
        // Mostrar confirmación visual
        showNotification('🗑️ Notificación eliminada correctamente', 'success');
    } else {
        console.error(`Notificación ${id} no encontrada`);
        showNotification('❌ Error al eliminar la notificación', 'error');
    }
}

// Función para marcar todas las notificaciones como leídas
function marcarTodasLeidas() {
    console.log('Marcando todas las notificaciones como leídas');
    
    // Confirmar acción
    if (notificacionesData.length === 0) {
        alert('No hay notificaciones para marcar como leídas');
        return;
    }
    
    const unreadCount = notificacionesData.filter(n => !n.leida).length;
    if (unreadCount === 0) {
        alert('Todas las notificaciones ya están marcadas como leídas');
        return;
    }
    
    if (!confirm(`¿Estás seguro de que deseas marcar ${unreadCount} notificación(es) como leídas?`)) {
        return;
    }
    
    // Marcar todas como leídas
    notificacionesData.forEach(notif => {
        notif.leida = true;
    });
    
    console.log('Todas las notificaciones marcadas como leídas');
    
    // Recargar notificaciones y actualizar contador
    loadNotificaciones();
    
    // Mostrar confirmación visual
    showNotification(`✅ ${unreadCount} notificaciones marcadas como leídas`, 'success');
}

// Función para eliminar todas las notificaciones
function eliminarTodasNotificaciones() {
    console.log('Eliminando todas las notificaciones');
    
    if (notificacionesData.length === 0) {
        alert('No hay notificaciones para eliminar');
        return;
    }
    
    if (!confirm(`¿Estás seguro de que deseas eliminar TODAS las notificaciones (${notificacionesData.length})? Esta acción no se puede deshacer.`)) {
        return;
    }
    
    // Vaciar el array
    const cantidadEliminada = notificacionesData.length;
    notificacionesData = [];
    
    console.log(`Todas las notificaciones eliminadas (${cantidadEliminada})`);
    
    // Recargar notificaciones y actualizar contador
    loadNotificaciones();
    
    // Mostrar confirmación visual
    showNotification(`🗑️ ${cantidadEliminada} notificaciones eliminadas`, 'success');
}

// Función para mostrar notificaciones temporales
function showNotification(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${tipo === 'success' ? '#20c997' : '#dc3545'};
        color: white;
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Añadir estilos CSS para la animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    notification.textContent = mensaje;
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// Función para inicializar el módulo de notificaciones
// Función para inicializar el módulo de notificaciones
function initializeNotificacionesModule() {
    console.log('🔔 Inicializando módulo de notificaciones...');
    console.log(`Datos iniciales: ${notificacionesData.length} notificaciones cargadas`);
    
    // SIMPLIFICAR: Siempre cargar notificaciones si estamos en esta página
    console.log('Cargando notificaciones en la bandeja...');
    
    // Esperar un momento para asegurar que el DOM esté listo
    setTimeout(() => {
        loadNotificaciones();
        
        // Configurar los botones de la cabecera
        setupHeaderButtons();
        
        console.log('✅ Módulo de notificaciones inicializado correctamente');
    }, 300);
}

// Configurar botones de la cabecera
function setupHeaderButtons() {
    const marcarTodasBtn = document.querySelector('.notificacion-action-btn.primary');
    const eliminarTodasBtn = document.querySelector('.notificacion-action-btn.danger');
    
    if (marcarTodasBtn) {
        marcarTodasBtn.onclick = marcarTodasLeidas;
    }
    
    if (eliminarTodasBtn) {
        eliminarTodasBtn.onclick = eliminarTodasNotificaciones;
    }
}

// Función para agregar notificación de prueba (para desarrollo)
function agregarNotificacionDePrueba() {
    const nuevaNotificacion = {
        id: notificacionesData.length > 0 ? Math.max(...notificacionesData.map(n => n.id)) + 1 : 1,
        asunto: "🧪 Notificación de Prueba",
        mensaje: "Esta es una notificación de prueba generada para verificar el funcionamiento del sistema.",
        fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
        tipo: "informativa",
        leida: false
    };
    
    notificacionesData.unshift(nuevaNotificacion); // Agregar al principio
    console.log(`Notificación de prueba agregada (ID: ${nuevaNotificacion.id})`);
    
    // Actualizar vista si estamos en notificaciones
    if (document.getElementById('notificaciones')?.classList.contains('active')) {
        loadNotificaciones();
    } else {
        updateNotificationCount();
    }
    
    showNotification('🧪 Notificación de prueba agregada', 'success');
    
    return nuevaNotificacion.id;
}

// Hacer funciones globales
window.loadNotificaciones = loadNotificaciones;
window.marcarLeida = marcarLeida;
window.eliminarNotificacion = eliminarNotificacion;
window.marcarTodasLeidas = marcarTodasLeidas;
window.eliminarTodasNotificaciones = eliminarTodasNotificaciones;
window.initializeNotificacionesModule = initializeNotificacionesModule;
window.updateNotificationCount = updateNotificationCount;
window.agregarNotificacionDePrueba = agregarNotificacionDePrueba; // Para pruebas
window.getNotificacionesData = getNotificacionesData; // Para depuración

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando módulo de notificaciones...');
    
    // Pequeño delay para asegurar que todo esté cargado
    setTimeout(() => {
        initializeNotificacionesModule();
    }, 500);
});

// También inicializar cuando se cargue la vista (para SPA)
document.addEventListener('viewLoaded', function(event) {
    if (event.detail.view === 'notificaciones') {
        console.log('Vista de notificaciones cargada, inicializando módulo...');
        setTimeout(() => {
            initializeNotificacionesModule();
        }, 300);
    }
});

// Escuchar cambios en el hash (navigación)
window.addEventListener('hashchange', function() {
    if (window.location.hash === '#notificaciones') {
        console.log('Navegación a notificaciones detectada');
        setTimeout(() => {
            initializeNotificacionesModule();
        }, 400);
    }
});

// Para depuración: imprimir estado actual
console.log('📋 Estado inicial de notificaciones:');
console.log(`- Total: ${notificacionesData.length}`);
console.log(`- No leídas: ${notificacionesData.filter(n => !n.leida).length}`);
console.log(`- Leídas: ${notificacionesData.filter(n => n.leida).length}`);