class GeneralesPanel {
    constructor() {
        this.currentView = 'inicio';
        this.views = {};
        this.basePath = '/generales/views/'; // RUTA ABSOLUTA IGUAL AL ADMIN
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialView();
    }

    bindEvents() {
        // Navegación del sidebar
        document.querySelectorAll('.generales-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.closest('.generales-nav-link').getAttribute('data-view');
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
        document.querySelectorAll('.generales-nav-link').forEach(link => {
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
                <div style="text-align: center; padding: 2rem; color: var(--generales-text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Error al cargar</h3>
                    <p>${message}</p>
                    <button onclick="generalesPanel.navigateTo('${view}')" 
                            style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--generales-primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
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

// Inicializar el panel de servicios generales
const generalesPanel = new GeneralesPanel();

// Escuchar eventos de vistas cargadas
document.addEventListener('viewLoaded', (event) => {
    console.log(`Vista cargada: ${event.detail.view} a las ${event.detail.timestamp}`);
    
    // Inicializar módulos específicos según la vista
    switch(event.detail.view) {
        // Manejar ambos nombres por si hay variantes en los archivos
        case 'reporte-fallas':
        case 'reportar-fallas':
            if (typeof initializeReportarFallasModule === 'function') {
                initializeReportarFallasModule();
            }
            break;
        case 'registro-mantenimiento':
            if (typeof initializeMantenimientoLimpiezaModule === 'function') {
                initializeMantenimientoLimpiezaModule();
            }
            break;
        case 'historial-servicios':
            if (typeof initializeHistorialModule === 'function') {
                initializeHistorialModule();
            }
            break;
        case 'gestion-tarjetas':
            if (typeof initializeGestionTarjetasModule === 'function') {
                initializeGestionTarjetasModule();
            }
            break;
    }
});




const menuButton = document.getElementById("btnSidebar");
const sideMenu = document.getElementById("generales-sidebar");

menuButton.addEventListener("click",()=>{
    sideMenu.classList.add("active");
});

arrayItemsNav = document.querySelectorAll(".generales-nav-link");

arrayItemsNav.forEach(element => {
    element.addEventListener("click", ()=>{
        sideMenu.classList.remove("active");
    });
});