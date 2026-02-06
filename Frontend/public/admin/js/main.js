// main.js - Control de Navegación del Panel Admin (VERSIÓN CORREGIDA)
class AdminPanel {
    constructor() {
        this.currentView = 'inicio';
        this.views = {};
        this.basePath = '/admin/views/'; // Ruta donde están las vistas
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialView();
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
        // Ejecutar scripts dentro del contenido cargado
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

    showError(view, message) {
        const viewElement = document.getElementById(view);
        if (viewElement) {
            viewElement.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Error al cargar</h3>
                    <p>${message}</p>
                    <button onclick="adminPanel.navigateTo('${view}')" 
                            style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // Método para actualizar datos en tiempo real
    updateRealTimeData(data) {
        if (this.currentView === 'inicio') {
            this.updateDashboardStats(data);
        }
    }

    updateDashboardStats(data) {
        // Actualizar estadísticas del dashboard
        const statCards = document.querySelectorAll('.stat-card');
        
        if (data.usuarios && statCards[0]) {
            statCards[0].querySelector('.stat-number').textContent = data.usuarios;
        }
        if (data.ambientes && statCards[1]) {
            statCards[1].querySelector('.stat-number').textContent = data.ambientes;
        }
        if (data.sensores && statCards[2]) {
            statCards[2].querySelector('.stat-number').textContent = data.sensores;
        }
        if (data.accesos && statCards[3]) {
            statCards[3].querySelector('.stat-number').textContent = data.accesos;
        }
    }

    // Método para recargar una vista específica
    reloadView(view) {
        delete this.views[view];
        this.loadViewContent(view);
    }
}

// Inicializar el panel administrativo
const adminPanel = new AdminPanel();

// Escuchar eventos de vistas cargadas
document.addEventListener('viewLoaded', (event) => {
    console.log(`Vista cargada: ${event.detail.view} a las ${event.detail.timestamp}`);
    
    // Inicializar módulos específicos según la vista
    switch(event.detail.view) {
        case 'usuarios':
            if (typeof initializeUsersModule === 'function') {
                initializeUsersModule();
            }
            break;
        case 'ambientes':
            if (typeof initializeAmbientesModule === 'function') {
                initializeAmbientesModule();
            }
            break;
        case 'sensores':
            if (typeof initializeSensoresModule === 'function') {
                initializeSensoresModule();
            }
            break;
        // Agregar más casos según necesites
    }
});

// Ejemplo de actualización en tiempo real (simulada)
setInterval(() => {
    const fakeData = {
        usuarios: Math.floor(1248 + Math.random() * 10),
        ambientes: 18,
        sensores: 24,
        accesos: Math.floor(327 + Math.random() * 5)
    };
    adminPanel.updateRealTimeData(fakeData);
}, 10000);



// hamburger menu toggle 
const menuButton = document.getElementById("btnSidebar");
const sideMenu = document.getElementById("side-menu");
menuButton.addEventListener("click",()=>{
    sideMenu.classList.add("active");
})

document.querySelectorAll(".nav-link").forEach(a=> a.addEventListener("click",()=>{
    sideMenu.classList.remove("active");
}))



// Lucide Icons rendering, so... Juancho is happy now

document.addEventListener("DOMContentLoaded", function() {
    lucide.createIcons();
});