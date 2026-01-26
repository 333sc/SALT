// main.js - Control de Navegación del Panel Aprendiz
class AprendizPanel {
    constructor() {
        this.currentView = 'inicio';
        this.views = {};
        this.basePath = '/aprendiz/views/';
        this.aprendizData = {
            nombre: 'Juan Pérez',
            id: 'APR-001',
            email: 'juan.perez@instituto.edu'
        };
        
        // Inicializar datos de notificaciones globales
        this.notificacionesData = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialView();
        this.updateUserInfo();
        this.loadDashboardData();
        this.initializeNotificationSystem();
    }

    bindEvents() {
        // Navegación del sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.closest('.nav-link').getAttribute('data-view');
                this.navigateTo(view);
            });
        });

        // Manejo de URLs con hash
        window.addEventListener('hashchange', () => {
            const view = window.location.hash.substring(1) || 'inicio';
            this.navigateTo(view);
        });
    }

    navigateTo(view) {
        if (this.currentView === view) return;

        console.log(`Navegando a: ${view}`);

        // Actualizar navegación activa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-view="${view}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Ocultar vista actual, mostrar nueva vista
        const currentViewElement = document.getElementById(this.currentView);
        const newViewElement = document.getElementById(view);

        if (currentViewElement) {
            currentViewElement.classList.remove('active');
        }

        if (newViewElement) {
            newViewElement.classList.add('active');
            this.currentView = view;
            window.location.hash = view;

            // Cargar contenido dinámico
            this.loadViewContent(view);
        } else {
            console.error(`No se encontró el elemento para la vista: ${view}`);
            this.showError(view, 'Vista no encontrada');
        }
    }

    loadInitialView() {
        const initialView = window.location.hash.substring(1) || 'inicio';
        console.log(`Vista inicial: ${initialView}`);
        this.navigateTo(initialView);
    }

    async loadViewContent(view) {
        // Si la vista ya fue cargada, no hacer nada
        if (this.views[view] && view !== 'inicio') {
            console.log(`Vista ${view} ya cargada, omitiendo...`);
            return;
        }

        try {
            console.log(`Cargando contenido para: ${view}`);
            
            // Para vistas que no son "inicio", cargar contenido externo
            if (view !== 'inicio') {
                const response = await fetch(`${this.basePath}${view}.html`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const html = await response.text();
                const viewElement = document.getElementById(view);
                
                if (viewElement) {
                    viewElement.innerHTML = html;
                    this.views[view] = true;
                    
                    // Ejecutar scripts dentro del HTML cargado
                    this.executeScripts(viewElement);
                    
                    // Disparar evento personalizado
                    this.dispatchViewLoadedEvent(view);
                    
                    // Actualizar contador de notificaciones después de cargar
                    if (view === 'notificaciones') {
                        setTimeout(() => {
                            this.syncNotificationCount();
                        }, 100);
                    }
                }
            } else {
                // La vista de inicio ya está en el HTML principal
                this.views[view] = true;
                this.dispatchViewLoadedEvent(view);
            }
            
        } catch (error) {
            console.error(`Error cargando la vista ${view}:`, error);
            this.showError(view, `Error al cargar el contenido: ${error.message}`);
        }
    }

    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            
            // Copiar atributos
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // Copiar contenido
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            
            // Reemplazar el script viejo con el nuevo
            script.parentNode.replaceChild(newScript, script);
        });
    }

    dispatchViewLoadedEvent(view) {
        const event = new CustomEvent('viewLoaded', {
            detail: { 
                view: view,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
        console.log(`Evento viewLoaded disparado para: ${view}`);
    }

    updateUserInfo() {
        document.getElementById('aprendizNombre').textContent = this.aprendizData.nombre;
        document.getElementById('headerUserName').textContent = this.aprendizData.nombre;
    }

    // NUEVO: Sistema de notificaciones integrado
    initializeNotificationSystem() {
        // Datos iniciales de notificaciones (simulados)
        this.notificacionesData = [
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
        
        // Inicializar contador
        this.syncNotificationCount();
        
        // Hacer las funciones accesibles globalmente
        window.aprendizPanel = this;
        window.marcarTodasLeidas = this.marcarTodasLeidas.bind(this);
        window.eliminarTodasNotificaciones = this.eliminarTodasNotificaciones.bind(this);
        window.marcarLeida = this.marcarLeida.bind(this);
        window.eliminarNotificacion = this.eliminarNotificacion.bind(this);
    }

    // NUEVO: Sincronizar contador de notificaciones
    syncNotificationCount() {
        const unreadCount = this.notificacionesData.filter(n => !n.leida).length;
        const counterElement = document.getElementById('notificationCount');
        const dashboardCounter = document.getElementById('notificacionesPendientes');
        
        if (counterElement) {
            counterElement.textContent = unreadCount;
            // Mostrar u ocultar el badge según haya notificaciones
            if (unreadCount > 0) {
                counterElement.style.display = 'flex';
            } else {
                counterElement.style.display = 'none';
            }
        }
        
        if (dashboardCounter) {
            dashboardCounter.textContent = unreadCount;
        }
        
        // Actualizar título de la página
        document.title = unreadCount > 0 ? `(${unreadCount}) Panel Aprendiz - SALT` : 'Panel Aprendiz - SALT';
        
        return unreadCount;
    }

    // NUEVO: Función para marcar una notificación como leída
    marcarLeida(id) {
        const notif = this.notificacionesData.find(n => n.id === id);
        if (notif) {
            notif.leida = true;
            console.log(`Notificación ${id} marcada como leída`);
            this.syncNotificationCount();
            
            // Si estamos en la vista de notificaciones, recargarla
            if (this.currentView === 'notificaciones' && typeof window.loadNotificaciones === 'function') {
                setTimeout(() => {
                    window.loadNotificaciones();
                }, 100);
            }
        }
    }

    // NUEVO: Función para marcar todas como leídas
    marcarTodasLeidas() {
        this.notificacionesData.forEach(n => n.leida = true);
        console.log('Todas las notificaciones marcadas como leídas');
        this.syncNotificationCount();
        
        // Si estamos en la vista de notificaciones, recargarla
        if (this.currentView === 'notificaciones' && typeof window.loadNotificaciones === 'function') {
            setTimeout(() => {
                window.loadNotificaciones();
            }, 100);
        }
    }

    // NUEVO: Función para eliminar una notificación
    eliminarNotificacion(id) {
        this.notificacionesData = this.notificacionesData.filter(n => n.id !== id);
        console.log(`Notificación ${id} eliminada`);
        this.syncNotificationCount();
        
        // Si estamos en la vista de notificaciones, recargarla
        if (this.currentView === 'notificaciones' && typeof window.loadNotificaciones === 'function') {
            setTimeout(() => {
                window.loadNotificaciones();
            }, 100);
        }
    }

    // NUEVO: Función para eliminar todas las notificaciones
    eliminarTodasNotificaciones() {
        if (this.notificacionesData.length === 0) {
            alert('No hay notificaciones para eliminar');
            return;
        }
        
        if (confirm(`¿Estás seguro de que deseas eliminar todas las notificaciones (${this.notificacionesData.length})? Esta acción no se puede deshacer.`)) {
            this.notificacionesData = [];
            console.log('Todas las notificaciones eliminadas');
            this.syncNotificationCount();
            
            // Si estamos en la vista de notificaciones, recargarla
            if (this.currentView === 'notificaciones' && typeof window.loadNotificaciones === 'function') {
                setTimeout(() => {
                    window.loadNotificaciones();
                }, 100);
            }
        }
    }

    // NUEVO: Función para obtener datos de notificaciones (para la vista)
    getNotificacionesData() {
        return this.notificacionesData;
    }

    // NUEVO: Función para inicializar módulo de notificaciones
    initializeNotificacionesModule() {
        if (typeof window.loadNotificaciones === 'function') {
            window.loadNotificaciones();
        }
    }

    loadDashboardData() {
        // Datos de ejemplo para el dashboard
        const dashboardData = {
            accesosHoy: 3,
            ambientesAutorizados: 5,
            tiempoPromedio: '2.5h',
            notificacionesPendientes: this.syncNotificationCount(), // Usar contador real
            estadoActual: {
                enAmbiente: false,
                ambiente: null,
                horaEntrada: null
            },
            actividadReciente: [
                {
                    icon: 'arrow_up',
                    titulo: 'Acceso a Laboratorio de Informática',
                    descripcion: 'Entrada registrada correctamente',
                    tiempo: 'Hace 2 horas'
                },
                {
                    icon: 'arrow_down',
                    titulo: 'Salida de Aula 201',
                    descripcion: 'Salida registrada',
                    tiempo: 'Hace 4 horas'
                },
                {
                    icon: 'bell',
                    titulo: 'Nueva notificación',
                    descripcion: 'Recordatorio: Revisar horarios',
                    tiempo: 'Hace 1 día'
                }
            ]
        };

        this.updateDashboardStats(dashboardData);
        this.updateRecentActivity(dashboardData.actividadReciente);
        this.updateCurrentStatus(dashboardData.estadoActual);
    }

    updateDashboardStats(data) {
        document.getElementById('accesosHoy').textContent = data.accesosHoy;
        document.getElementById('ambientesAutorizados').textContent = data.ambientesAutorizados;
        document.getElementById('tiempoPromedio').textContent = data.tiempoPromedio;
        document.getElementById('notificacionesPendientes').textContent = data.notificacionesPendientes;
    }

    updateRecentActivity(actividades) {
        const container = document.getElementById('recentActivityList');
        if (!container) return;

        container.innerHTML = actividades.map(actividad => `
            <div class="activity-item">
                <span class="activity-icon">${actividad.icon}</span>
                <div class="activity-content">
                    <strong>${actividad.titulo}</strong>
                    <p>${actividad.descripcion}</p>
                </div>
                <span class="activity-time">${actividad.tiempo}</span>
            </div>
        `).join('');
    }

    updateCurrentStatus(estado) {
        const indicator = document.getElementById('statusIndicator');
        const text = document.getElementById('statusText');
        const time = document.getElementById('statusTime');

        if (estado.enAmbiente) {
            indicator.textContent = '🟢';
            indicator.style.color = '#20c997';
            text.textContent = `Actualmente en ${estado.ambiente}`;
            time.textContent = `Entrada: ${estado.horaEntrada}`;
        } else {
            indicator.textContent = '🔴';
            indicator.style.color = '#dc3545';
            text.textContent = 'No estás en ningún ambiente';
            time.textContent = '-';
        }
    }

    showError(view, message) {
        const viewElement = document.getElementById(view);
        if (viewElement) {
            viewElement.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Error al cargar</h3>
                    <p>${message}</p>
                    <button onclick="aprendizPanel.navigateTo('${view}')" 
                            style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // Método para recargar una vista específica
    reloadView(view) {
        delete this.views[view];
        this.loadViewContent(view);
    }
}

// Inicializar el panel del aprendiz
const aprendizPanel = new AprendizPanel();

// Escuchar eventos de vistas cargadas
document.addEventListener('viewLoaded', (event) => {
    console.log(`Vista cargada: ${event.detail.view} a las ${event.detail.timestamp}`);
    
    // Inicializar módulos específicos según la vista
    switch(event.detail.view) {
        case 'historial':
            if (typeof initializeHistorialModule === 'function') {
                initializeHistorialModule();
            }
            break;
        case 'ambientes':
            if (typeof initializeAmbientesModule === 'function') {
                initializeAmbientesModule();
            }
            break;
        case 'notificaciones':
            if (typeof window.loadNotificaciones === 'function') {
                // Pasar los datos de notificaciones a la función
                window.loadNotificaciones();
            } else if (typeof aprendizPanel.initializeNotificacionesModule === 'function') {
                aprendizPanel.initializeNotificacionesModule();
            }
            break;
    }
});

// Simular actualizaciones en tiempo real
setInterval(() => {
    // Simular cambio de estado
    const enAmbiente = Math.random() > 0.7;
    if (enAmbiente) {
        const ambientes = ['Laboratorio de Informática', 'Aula 201', 'Biblioteca'];
        const estado = {
            enAmbiente: true,
            ambiente: ambientes[Math.floor(Math.random() * ambientes.length)],
            horaEntrada: new Date().toLocaleTimeString()
        };
        aprendizPanel.updateCurrentStatus(estado);
    } else {
        aprendizPanel.updateCurrentStatus({
            enAmbiente: false,
            ambiente: null,
            horaEntrada: null
        });
    }
}, 30000);




const menuButton = document.getElementById("btnSidebar");
const sideMenu = document.getElementById("side-menu");

menuButton.addEventListener("click",()=>{
    sideMenu.classList.add("active");
});

document.querySelectorAll(".nav-link").forEach(element => element.addEventListener("click",()=> {
    sideMenu.classList.remove("active");
}));































































