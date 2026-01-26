// SALT-PROJECT/public/instructor/js/main.js
class InstructorPanel {
    constructor() {
        this.currentView = 'mis-ambientes';
        this.views = {};
        this.basePath = 'views/';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialView();
    }

    bindEvents() {
        document.querySelectorAll('.instructor-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.closest('.instructor-nav-link').getAttribute('data-view');
                this.navigateTo(view);
            });
        });

        window.addEventListener('hashchange', () => {
            const view = window.location.hash.substring(1) || 'mis-ambientes';
            this.navigateTo(view);
        });
    }

    navigateTo(view) {
        if (this.currentView === view) return;

        console.log(`Navegando a vista: ${view}`);

        // Actualizar navegación activa
        document.querySelectorAll('.instructor-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`.instructor-nav-link[data-view="${view}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Ocultar vista actual, mostrar nueva vista
        const currentViewElement = document.getElementById(this.currentView);
        if (currentViewElement) currentViewElement.classList.remove('active');

        this.currentView = view;
        const newViewElement = document.getElementById(this.currentView);
        
        if (newViewElement) {
            newViewElement.classList.add('active');
            
            if (!this.views[view]) {
                this.loadViewContent(view);
            } else {
                this.initializeViewModule(view);
            }
        }
    }

    loadViewContent(view) {
        const filePath = `${this.basePath}${view}.html`;
        
        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                const viewElement = document.getElementById(view);
                if (viewElement) {
                    viewElement.innerHTML = html;
                    this.views[view] = true;
                    
                    // Cargar CSS específico ANTES de inicializar el módulo
                    this.loadViewCSS(view).then(() => {
                        this.initializeViewModule(view);
                    });
                    
                    console.log(`✅ Vista ${view} cargada correctamente.`);
                }
            })
            .catch(error => {
                console.error(`❌ Error cargando ${view}:`, error);
                const viewElement = document.getElementById(view);
                if (viewElement) {
                    viewElement.innerHTML = this.getErrorHTML(view, error);
                }
            });
    }

    loadViewCSS(view) {
        return new Promise((resolve) => {
            const cssPath = `css/${view}.css`;
            const existingLink = document.querySelector(`link[data-view="${view}"]`);
            
            if (existingLink) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            link.setAttribute('data-view', view);
            link.onload = resolve;
            link.onerror = () => {
                console.warn(`⚠️ No se pudo cargar CSS para ${view}`);
                resolve();
            };
            
            document.head.appendChild(link);
        });
    }

    initializeViewModule(view) {
        console.log(`🔄 Inicializando módulo: ${view}`);
        
        // Dar tiempo para que el DOM se actualice
        setTimeout(() => {
            switch(view) {
                case 'mis-ambientes':
                    if (typeof initializeMisambientesModule === 'function') {
                        initializeMisambientesModule();
                    }
                    break;
                case 'irregularidades':
                    if (typeof initializeIrregularidadesModule === 'function') {
                        initializeIrregularidadesModule();
                    }
                    break;
                case 'reportes':
                    if (typeof initializeReportesModule === 'function') {
                        initializeReportesModule();
                    }
                    break;
            }
        }, 100);
    }

    getErrorHTML(view, error) {
        return `
            <div style="text-align: center; padding: 3rem; color: var(--instructor-danger-color);">
                <h2>⚠️ Error al cargar la vista</h2>
                <p>No se pudo cargar: ${view}.html</p>
                <p><small>Error: ${error.message}</small></p>
                <button class="btn-primary" onclick="location.reload()" style="margin-top: 1rem;">
                    🔄 Reintentar
                </button>
            </div>
        `;
    }

    loadInitialView() {
        const initialView = window.location.hash.substring(1) || 'mis-ambientes';
        this.navigateTo(initialView);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new InstructorPanel();
    });
} else {
    new InstructorPanel();
}



const menuButtom = document.getElementById("btnSidebar");
const sideMenu = document.getElementById("instructor-sidebar");

menuButtom.addEventListener("click",()=>{
    sideMenu.classList.add("active");
});

const arrayItemsNav = document.querySelectorAll(".instructor-nav-link");

arrayItemsNav.forEach(element => {
    element.addEventListener("click",()=>{
        sideMenu.classList.remove("active");
    });
});
