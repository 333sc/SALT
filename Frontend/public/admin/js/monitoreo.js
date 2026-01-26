// Datos de ejemplo - En producción vendrían de Socket.io
        const monitoreoData = {
            users: [
                { id: 1, name: "Juan Pérez", role: "aprendiz" },
                { id: 2, name: "María Gómez", role: "instructor" },
                { id: 3, name: "Carlos Ruiz", role: "admin" },
                { id: 4, name: "Ana López", role: "servicios" },
                { id: 5, name: "Pedro Martínez", role: "aprendiz" }
            ],
            environments: [
                { id: 1, name: "Laboratorio de Informática 1", location: "Edificio A - Piso 2" },
                { id: 2, name: "Aula 201", location: "Edificio B - Piso 1" },
                { id: 3, name: "Taller de Electrónica", location: "Edificio C - Piso 1" },
                { id: 4, name: "Biblioteca Central", location: "Edificio Central" }
            ],
            sensors: [
                { id: "RFID-001", name: "Lector Principal Lab 1", location: "Edificio A - Entrada", status: "online" },
                { id: "RFID-002", name: "Lector Secundario Lab 1", location: "Edificio A - Salida", status: "online" },
                { id: "RFID-003", name: "Lector Aula 201", location: "Edificio B - Entrada", status: "online" },
                { id: "RFID-004", name: "Lector Biblioteca", location: "Edificio Central", status: "offline" },
                { id: "RFID-005", name: "Lector Taller", location: "Edificio C", status: "online" }
            ]
        };

        let monitoreoActivity = [];
        let monitoreoSimulationInterval = null;
        let monitoreoSoundEnabled = true;

        // Inicializar el módulo de monitoreo
        function initializeMonitoreoModule() {
            console.log('✅ Módulo de monitoreo inicializado (Namespace aplicado)');
            loadSensorsStatus();
            updateStats();
            startRealTimeUpdates();
            
            // Simular actividad inicial
            setTimeout(() => {
                simulateRFIDReading();
            }, 1000);
        }

        function loadSensorsStatus() {
            const sensorsList = document.getElementById('sensorsList');
            if (!sensorsList) return;
            
            sensorsList.innerHTML = '';

            monitoreoData.sensors.forEach(sensor => {
                const sensorItem = document.createElement('div');
                sensorItem.className = 'monitoreo-sensor-item';
                
                sensorItem.innerHTML = `
                    <div class="monitoreo-sensor-status ${sensor.status}"></div>
                    <div class="monitoreo-sensor-info">
                        <div class="monitoreo-sensor-name">${sensor.name}</div>
                        <div class="monitoreo-sensor-location">${sensor.location}</div>
                    </div>
                    <div class="monitoreo-sensor-id">${sensor.id}</div>
                `;
                
                sensorsList.appendChild(sensorItem);
            });
        }

        function updateStats() {
            const activeUsers = document.getElementById('activeUsers');
            const onlineSensors = document.getElementById('onlineSensors');
            const activeEnvironments = document.getElementById('activeEnvironments');
            const todayAccess = document.getElementById('todayAccess');
            const activityCount = document.getElementById('activityCount');
            
            if (activeUsers) activeUsers.textContent = monitoreoData.users.length;
            if (onlineSensors) onlineSensors.textContent = monitoreoData.sensors.filter(s => s.status === 'online').length;
            if (activeEnvironments) activeEnvironments.textContent = monitoreoData.environments.length;
            if (todayAccess) todayAccess.textContent = monitoreoActivity.filter(a => a.type === 'access').length;
            if (activityCount) activityCount.textContent = `${monitoreoActivity.length} eventos`;
        }

        function addActivity(activity) {
            const activityList = document.getElementById('activityList');
            if (!activityList) return;
            
            const activityItem = document.createElement('div');
            activityItem.className = 'monitoreo-activity-item new';
            
            // Determinar icono según el tipo de actividad
            let iconName = 'message-circle';
            if (activity.type === 'access') iconName = 'lock';
            else if (activity.type === 'exit') iconName = 'door-open';
            else if (activity.type === 'error') iconName = 'alert-triangle';
            else if (activity.type === 'sensor') iconName = 'plug';

            activityItem.innerHTML = `
                <div class="monitoreo-activity-icon"><i data-lucide="${iconName}" class="monitoreo-icons"></i></div>
                <div class="monitoreo-activity-content">
                    <div class="monitoreo-activity-user">${activity.user}</div>
                    <div class="monitoreo-activity-description">${activity.description}</div>
                    <div class="monitoreo-activity-environment">${activity.environment}</div>
                </div>
                <div class="monitoreo-activity-time">${activity.time}</div>
            `;
            
            // Agregar al principio de la lista
            activityList.insertBefore(activityItem, activityList.firstChild);
            
            // Limitar a 50 actividades
            if (activityList.children.length > 50) {
                activityList.removeChild(activityList.lastChild);
            }
            
            // Agregar al array de actividades
            monitoreoActivity.unshift(activity);
            
            // Actualizar estadísticas
            updateStats();
            
            // Remover la clase 'new' después de la animación
            setTimeout(() => {
                activityItem.classList.remove('new');
            }, 2000);
        }

        function showNotification(title, message, type = 'info') {
            const notificationsContainer = document.getElementById('notificationsContainer');
            if (!notificationsContainer) return;
            
            const notification = document.createElement('div');
            notification.className = 'monitoreo-notification';
            
            let iconName = 'message-circle';
            if (type === 'warning') iconName = 'alert-triangle';
            else if (type === 'error') iconName = 'alert-circle';
            else if (type === 'success') iconName = 'check-circle';
            
            notification.innerHTML = `
                <div class="monitoreo-notification-icon"><i data-lucide="${iconName}" class="monitoreo-icons"></i></div>
                <div class="monitoreo-notification-content">
                    <div class="monitoreo-notification-title">${title}</div>
                    <div class="monitoreo-notification-message">${message}</div>
                </div>
                <button class="monitoreo-notification-close" onclick="this.parentElement.remove()">×</button>
            `;
            
            notificationsContainer.appendChild(notification);
            lucide.createIcons();
            
            // Auto-remover después de 5 segundos
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
            
            // Reproducir sonido si está habilitado
            if (monitoreoSoundEnabled) {
                playNotificationSound();
            }
        }

        function playNotificationSound() {
            // En producción, usar un sonido real
            console.log('🔊 Reproduciendo sonido de notificación');
        }

        function simulateRFIDReading() {
            const randomUser = monitoreoData.users[Math.floor(Math.random() * monitoreoData.users.length)];
            const randomEnvironment = monitoreoData.environments[Math.floor(Math.random() * monitoreoData.environments.length)];
            const randomSensor = monitoreoData.sensors[Math.floor(Math.random() * monitoreoData.sensors.length)];
            
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            
            const activity = {
                type: 'access',
                user: randomUser.name,
                environment: randomEnvironment.name,
                description: `Acceso registrado con tarjeta RFID`,
                time: timeString,
                sensor: randomSensor.id
            };
            
            addActivity(activity);
            
            // Mostrar notificación
            showNotification(
                'Nuevo Acceso',
                `${randomUser.name} accedió a ${randomEnvironment.name}`,
                'success'
            );
        }

        function simulateSensorStatusChange() {
            // Cambiar estado aleatorio de un sensor
            const randomSensorIndex = Math.floor(Math.random() * monitoreoData.sensors.length);
            const sensor = monitoreoData.sensors[randomSensorIndex];
            
            const newStatus = sensor.status === 'online' ? 'offline' : 'online';
            sensor.status = newStatus;
            
            // Recargar estado de sensores
            loadSensorsStatus();
            
            // Mostrar notificación
            const statusText = newStatus === 'online' ? 'conectado' : 'desconectado';
            showNotification(
                ' Estado del Sensor',
                `${sensor.name} se ha ${statusText}`,
                newStatus === 'online' ? 'success' : 'warning'
            );
            
            // Actualizar estadísticas
            updateStats();
        }

        function startRealTimeUpdates() {
            // Simular actualizaciones en tiempo real
            setInterval(() => {
                // Simular lectura RFID cada 5-15 segundos
                if (Math.random() > 0.7) {
                    simulateRFIDReading();
                }
                
                // Simular cambio de estado de sensor cada 10-30 segundos
                if (Math.random() > 0.8) {
                    simulateSensorStatusChange();
                }
            }, 5000);
        }

        // Funciones de control
        function monitoreoStartSimulation() {
            if (monitoreoSimulationInterval) {
                clearInterval(monitoreoSimulationInterval);
                monitoreoSimulationInterval = null;
                showNotification('Simulación', 'Simulación de actividad pausada', 'info');
            } else {
                monitoreoSimulationInterval = setInterval(() => {
                    simulateRFIDReading();
                    if (Math.random() > 0.7) {
                        simulateSensorStatusChange();
                    }
                }, 2000);
                showNotification('<i data-lucide="play" class="monitoreo-icons"></i> Simulación', 'Simulación de actividad iniciada', 'success');
            }
        }

        function monitoreoClearActivity() {
            const activityList = document.getElementById('activityList');
            if (activityList) {
                activityList.innerHTML = '';
                monitoreoActivity = [];
                updateStats();
                showNotification('🗑️ Actividad', 'Historial de actividad limpiado', 'info');
            }
        }

        function monitoreoToggleSound() {
            monitoreoSoundEnabled = !monitoreoSoundEnabled;
            const soundStatus = document.getElementById('soundStatus');
            if (soundStatus) {
                soundStatus.textContent = `Sonido: ${monitoreoSoundEnabled ? 'ON' : 'OFF'}`;
            }
            showNotification(
                'Sonido', 
                `Notificaciones de sonido ${monitoreoSoundEnabled ? 'activadas' : 'desactivadas'}`,
                'info'
            );
        }

        // Simulación de Socket.io (en producción se conectaría al servidor real)
        function simulateSocketIO() {
            console.log('🔌 Simulando conexión Socket.io...');
            
            // Simular eventos de conexión
            setTimeout(() => {
                showNotification('🔌 Conexión', 'Conectado al servidor en tiempo real', 'success');
            }, 1000);
        }

        // Hacer funciones globales para acceso desde otros módulos
        window.initializeMonitoreoModule = initializeMonitoreoModule;
        window.monitoreoStartSimulation = monitoreoStartSimulation;
        window.monitoreoClearActivity = monitoreoClearActivity;
        window.monitoreoToggleSound = monitoreoToggleSound;

        // Inicializar cuando se cargue la página
        document.addEventListener('DOMContentLoaded', function() {
            initializeMonitoreoModule();
            simulateSocketIO();
        });
