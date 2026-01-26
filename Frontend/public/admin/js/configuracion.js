// =============================================
        // MÓDULO DE CONFIGURACIÓN - VERSIÓN SPA COMPATIBLE
        // =============================================

        // Objeto principal del módulo
        const ConfigModule = {
            // Datos de configuración
            data: {
                horarios: {
                    lunesViernes: { inicio: '06:00', fin: '22:00' },
                    sabados: { inicio: '08:00', fin: '18:00' },
                    domingos: { inicio: '09:00', fin: '14:00' }
                },
                hardware: {
                    puerto: 'COM3',
                    baudios: 19200,
                    modoPrueba: true
                },
                backup: {
                    frecuencia: 'semanalmente',
                    ultimoBackup: '2024-01-26 02:00'
                },
                general: {
                    nombreSistema: 'SALT - Sistema de Acceso con Lectores Tecnológicos',
                    zonaHoraria: 'America/Bogota',
                    notificacionesEmail: true,
                    logsDetallados: true,
                    modoMantenimiento: false
                }
            },

            // Inicializar el módulo
            init() {
                console.log('🔧 Inicializando módulo de configuración...');
                this.setupEventListeners();
                this.cargarConfiguracion();
                this.navegarSeccion('horarios');
                
                // Marcar como inicializado
                this.initialized = true;
                console.log('✅ Módulo de configuración listo');
            },

            // Configurar event listeners de forma segura
            setupEventListeners() {
                // Usar event delegation para manejar clicks en el menú
                document.addEventListener('click', (e) => {
                    const navLink = e.target.closest('.config-nav-link');
                    if (navLink) {
                        e.preventDefault();
                        const sectionId = navLink.getAttribute('data-section');
                        this.navegarSeccion(sectionId, navLink);
                    }
                });

                // También asignar listeners directos como respaldo
                setTimeout(() => {
                    const navLinks = document.querySelectorAll('.config-nav-link');
                    navLinks.forEach(link => {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            const sectionId = link.getAttribute('data-section');
                            this.navegarSeccion(sectionId, link);
                        });
                    });
                }, 100);
            },

            // Navegar entre secciones
            navegarSeccion(seccionId, linkElement = null) {
                console.log('📍 Navegando a sección:', seccionId);
                
                // Actualizar navegación activa
                document.querySelectorAll('.config-nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                document.querySelectorAll('.config-section').forEach(section => {
                    section.classList.remove('active');
                });

                // Activar sección actual
                if (linkElement) {
                    linkElement.classList.add('active');
                } else {
                    // Encontrar el link correspondiente
                    const correspondingLink = document.querySelector(`[data-section="${seccionId}"]`);
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                }

                const targetSection = document.getElementById(seccionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }

                // Actualizar título
                const titulos = {
                    'horarios': '<i data-lucide="users" class="config-sub-icons"></i> Horarios de Acceso',
                    'hardware': '<i data-lucide="cpu" class="config-sub-icons"></i> Configuración Hardware',
                    'backup': '<i data-lucide="save" class="config-sub-icons"></i> Copias de Seguridad',
                    'roles': '<i data-lucide="users" class="config-sub-icons"></i> Roles y Permisos',
                    'general': '<i data-lucide="settings" class="config-sub-icons"></i> Configuración General',
                    'logs': '<i data-lucide="file-text" class="config-sub-icons"></i> Logs del Sistema'
                };

                if (titulos[seccionId]) {
                    const titleElement = document.getElementById('configSectionTitle');
                    if (titleElement) {
                        titleElement.innerHTML = titulos[seccionId];
                        lucide.createIcons();
                    }
                }
            },

            // Cargar configuración
            cargarConfiguracion() {
                console.log('📥 Cargando configuración del sistema...');
                // En producción, aquí se cargaría desde la base de datos
            },

            // Guardar cambios
            guardarCambios() {
                console.log('💾 Guardando configuración...');
                alert('✅ Configuración guardada exitosamente');
            },

            // Probar conexiones
            probarConexiones() {
                alert('🔍 Probando conexiones con hardware...');
                setTimeout(() => {
                    alert('✅ Todas las conexiones funcionan correctamente');
                }, 2000);
            },

            // Backup
            realizarBackup() {
                if (confirm('¿Estás seguro de que deseas realizar un backup completo del sistema?')) {
                    alert('💾 Iniciando backup completo...');
                    setTimeout(() => {
                        alert('✅ Backup completado exitosamente');
                    }, 3000);
                }
            },

            restaurarBackup() {
                alert('🔄 Esta funcionalidad abriría un diálogo para seleccionar archivo de backup');
            },

            exportarDatos() {
                alert('📤 Exportando datos de accesos...');
                setTimeout(() => {
                    alert('✅ Datos exportados exitosamente');
                }, 2000);
            },

            descargarLogs() {
                alert('📥 Descargando archivo de logs...');
            },

            limpiarLogs() {
                if (confirm('¿Estás seguro de que deseas limpiar todos los logs del sistema?')) {
                    alert('🗑️ Logs del sistema limpiados');
                    const logsContainer = document.querySelector('.config-logs-container');
                    if (logsContainer) {
                        logsContainer.innerHTML = '<div class="config-log-entry">[2024-01-26 16:00:00] Logs limpiados por administrador</div>';
                    }
                }
            }
        };

        // =============================================
        // INICIALIZACIÓN COMPATIBLE CON SPA
        // =============================================

        // Función de inicialización global
        function initializeConfigModule() {
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    ConfigModule.init();
                });
            } else {
                // DOM ya está listo
                ConfigModule.init();
            }
        }

        // Exportar funciones globales de forma segura
        window.configGuardarCambios = () => ConfigModule.guardarCambios();
        window.configProbarConexiones = () => ConfigModule.probarConexiones();
        window.configRealizarBackup = () => ConfigModule.realizarBackup();
        window.configRestaurarBackup = () => ConfigModule.restaurarBackup();
        window.configExportarDatos = () => ConfigModule.exportarDatos();
        window.configDescargarLogs = () => ConfigModule.descargarLogs();
        window.configLimpiarLogs = () => ConfigModule.limpiarLogs();
        window.initializeConfigModule = initializeConfigModule;

        // Inicialización automática cuando se carga como página independiente
        if (!window.isSpaEnvironment) {
            initializeConfigModule();
        }

        // También inicializar si se detecta que está en un entorno SPA
        if (window.isSpaEnvironment || window.initializeConfigModule) {
            // El SPA llamará a initializeConfigModule manualmente
            console.log('🚀 Módulo de configuración listo para SPA');
        }
