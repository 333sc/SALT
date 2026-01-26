 // Datos de ejemplo - En producción vendrían de la base de datos
        const reportesData = {
            asistencia: [
                { fecha: '2024-01-22', accesos: 45, exitosos: 44, fallidos: 1 },
                { fecha: '2024-01-23', accesos: 52, exitosos: 51, fallidos: 1 },
                { fecha: '2024-01-24', accesos: 38, exitosos: 37, fallidos: 1 },
                { fecha: '2024-01-25', accesos: 61, exitosos: 60, fallidos: 1 },
                { fecha: '2024-01-26', accesos: 29, exitosos: 28, fallidos: 1 }
            ],
            ambientes: [
                { nombre: 'Laboratorio 1', accesos: 125, porcentaje: 35 },
                { nombre: 'Aula 201', accesos: 89, porcentaje: 25 },
                { nombre: 'Biblioteca', accesos: 67, porcentaje: 19 },
                { nombre: 'Laboratorio 2', accesos: 45, porcentaje: 13 },
                { nombre: 'Oficina Admin', accesos: 25, porcentaje: 7 }
            ],
            fallidos: [
                { fecha: '2024-01-22', tarjeta: 'A1B2C3D4', ambiente: 'Laboratorio 1', motivo: 'Tarjeta no registrada' },
                { fecha: '2024-01-23', tarjeta: 'X5Y6Z7W8', ambiente: 'Aula 201', motivo: 'Usuario inactivo' },
                { fecha: '2024-01-24', tarjeta: 'E9F0G1H2', ambiente: 'Biblioteca', motivo: 'Sin permisos' },
                { fecha: '2024-01-25', tarjeta: 'A1B2C3D4', ambiente: 'Laboratorio 1', motivo: 'Tarjeta no registrada' },
                { fecha: '2024-01-26', tarjeta: 'I3J4K5L6', ambiente: 'Laboratorio 2', motivo: 'Horario no permitido' }
            ],
            topUsuarios: [
                { usuario: 'Juan Pérez', accesos: 28, rol: 'Aprendiz', ultimoAcceso: '2024-01-26 15:30' },
                { usuario: 'María Gómez', accesos: 25, rol: 'Instructor', ultimoAcceso: '2024-01-26 14:15' },
                { usuario: 'Carlos Ruiz', accesos: 22, rol: 'Aprendiz', ultimoAcceso: '2024-01-25 16:45' },
                { usuario: 'Ana López', accesos: 18, rol: 'Servicios', ultimoAcceso: '2024-01-26 11:20' },
                { usuario: 'Pedro Martínez', accesos: 16, rol: 'Aprendiz', ultimoAcceso: '2024-01-24 13:10' }
            ],
            horarios: [
                { hora: '07:00', accesos: 5 },
                { hora: '08:00', accesos: 15 },
                { hora: '09:00', accesos: 25 },
                { hora: '10:00', accesos: 32 },
                { hora: '11:00', accesos: 28 },
                { hora: '12:00', accesos: 18 },
                { hora: '13:00', accesos: 12 },
                { hora: '14:00', accesos: 22 },
                { hora: '15:00', accesos: 35 },
                { hora: '16:00', accesos: 30 },
                { hora: '17:00', accesos: 20 },
                { hora: '18:00', accesos: 8 }
            ]
        };

        let reporteActual = null;

        // Inicializar el módulo de reportes
        function initializeReportesModule() {
            console.log('✅ Módulo de reportes inicializado (Namespace aplicado)');
            setupEventListeners();
            actualizarResumen();
        }

        function setupEventListeners() {
            // Mostrar/ocultar fechas personalizadas
            document.getElementById('periodo').addEventListener('change', function() {
                const personalizadoGroup = document.getElementById('fechaPersonalizadaGroup');
                personalizadoGroup.style.display = this.value === 'personalizado' ? 'flex' : 'none';
            });

            // Establecer fechas por defecto
            const hoy = new Date();
            const hace7Dias = new Date(hoy);
            hace7Dias.setDate(hoy.getDate() - 7);

            document.getElementById('fechaDesde').value = hace7Dias.toISOString().split('T')[0];
            document.getElementById('fechaHasta').value = hoy.toISOString().split('T')[0];
        }

        function reportesCambiarTipo() {
            const tipo = document.getElementById('reportType').value;
            const chartTitle = document.getElementById('chartTitle');
            const tableTitle = document.getElementById('tableTitle');

            const titulos = {
                'asistencia': { chart: '📊 Asistencia por Día', table: '📋 Detalle de Asistencia' },
                'accesos-ambiente': { chart: '🏢 Accesos por Ambiente', table: '📋 Accesos por Ambiente' },
                'accesos-fallidos': { chart: '🚨 Accesos Fallidos', table: '📋 Registro de Accesos Fallidos' },
                'usuarios-top': { chart: '👥 Top Usuarios', table: '📋 Ranking de Usuarios' },
                'horarios': { chart: '🕓 Distribución por Horarios', table: '📋 Accesos por Hora' }
            };

            if (titulos[tipo]) {
                chartTitle.textContent = titulos[tipo].chart;
                tableTitle.textContent = titulos[tipo].table;
            }
        }

        function reportesGenerarReporte() {
            const loading = document.getElementById('reportesLoading');
            const tipo = document.getElementById('reportType').value;
            
            loading.classList.add('active');
            
            // Simular tiempo de carga
            setTimeout(() => {
                generarReporte(tipo);
                loading.classList.remove('active');
            }, 1500);
        }

        function generarReporte(tipo) {
            reporteActual = tipo;
            const mainChart = document.getElementById('mainChart');
            const tableBody = document.getElementById('tableBody');
            const tableHeaders = document.getElementById('tableHeaders');

            // Limpiar contenido anterior
            mainChart.innerHTML = '';
            tableBody.innerHTML = '';

            switch(tipo) {
                case 'asistencia':
                    generarReporteAsistencia(mainChart, tableBody, tableHeaders);
                    break;
                case 'accesos-ambiente':
                    generarReporteAmbientes(mainChart, tableBody, tableHeaders);
                    break;
                case 'accesos-fallidos':
                    generarReporteFallidos(mainChart, tableBody, tableHeaders);
                    break;
                case 'usuarios-top':
                    generarReporteTopUsuarios(mainChart, tableBody, tableHeaders);
                    break;
                case 'horarios':
                    generarReporteHorarios(mainChart, tableBody, tableHeaders);
                    break;
            }

            actualizarResumen();
        }

        function generarReporteAsistencia(chartContainer, tableBody, tableHeaders) {
            // Configurar encabezados de tabla
            tableHeaders.innerHTML = `
                <th>Fecha</th>
                <th>Total Accesos</th>
                <th>Exitosos</th>
                <th>Fallidos</th>
                <th>Tasa Éxito</th>
            `;

            // Generar tabla
            reportesData.asistencia.forEach(item => {
                const tasaExito = ((item.exitosos / item.accesos) * 100).toFixed(1);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatearFecha(item.fecha)}</td>
                    <td>${item.accesos}</td>
                    <td>${item.exitosos}</td>
                    <td><span class="reportes-badge reportes-badge-danger">${item.fallidos}</span></td>
                    <td><span class="reportes-badge reportes-badge-success">${tasaExito}%</span></td>
                `;
                tableBody.appendChild(row);
            });

            // Generar gráfico simple (en producción usarías Chart.js o similar)
            chartContainer.innerHTML = `
                <div style="display: flex; align-items: end; justify-content: center; height: 100%; gap: 20px; padding: 20px;">
                    ${reportesData.asistencia.map(item => `
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 30px; background: var(--reportes-chart-color-1); height: ${item.accesos * 4}px; border-radius: 3px;"></div>
                            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--reportes-text-muted);">${item.fecha.split('-')[2]}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center; color: var(--reportes-text-muted); margin-top: 10px;">
                    Gráfico de barras - Accesos por día
                </div>
            `;
        }

        function generarReporteAmbientes(chartContainer, tableBody, tableHeaders) {
            tableHeaders.innerHTML = `
                <th>Ambiente</th>
                <th>Accesos</th>
                <th>Porcentaje</th>
                <th>Distribución</th>
            `;

            reportesData.ambientes.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.nombre}</td>
                    <td>${item.accesos}</td>
                    <td>${item.porcentaje}%</td>
                    <td>
                        <div style="background: var(--reportes-border-color); height: 10px; border-radius: 5px; width: 100%;">
                            <div style="background: var(--reportes-chart-color-2); height: 100%; border-radius: 5px; width: ${item.porcentaje}%;"></div>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            chartContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 10px; padding: 20px;">
                    ${reportesData.ambientes.map(item => `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="min-width: 150px; color: var(--reportes-text-light);">${item.nombre}</div>
                            <div style="flex: 1; background: var(--reportes-border-color); height: 20px; border-radius: 10px;">
                                <div style="background: var(--reportes-chart-color-2); height: 100%; border-radius: 10px; width: ${item.porcentaje}%;"></div>
                            </div>
                            <div style="min-width: 50px; text-align: right; color: var(--reportes-text-muted);">${item.porcentaje}%</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function generarReporteFallidos(chartContainer, tableBody, tableHeaders) {
            tableHeaders.innerHTML = `
                <th>Fecha</th>
                <th>Tarjeta</th>
                <th>Ambiente</th>
                <th>Motivo</th>
            `;

            reportesData.fallidos.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatearFecha(item.fecha)}</td>
                    <td><code>${item.tarjeta}</code></td>
                    <td>${item.ambiente}</td>
                    <td><span class="reportes-badge reportes-badge-warning">${item.motivo}</span></td>
                `;
                tableBody.appendChild(row);
            });

            chartContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--reportes-text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🚨</div>
                    <h3>${reportesData.fallidos.length} Accesos Fallidos</h3>
                    <p>En el período seleccionado</p>
                </div>
            `;
        }

        function generarReporteTopUsuarios(chartContainer, tableBody, tableHeaders) {
            tableHeaders.innerHTML = `
                <th>Usuario</th>
                <th>Accesos</th>
                <th>Rol</th>
                <th>Último Acceso</th>
            `;

            reportesData.topUsuarios.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 24px; height: 24px; background: var(--reportes-primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: white; font-weight: bold;">${index + 1}</div>
                            ${item.usuario}
                        </div>
                    </td>
                    <td>${item.accesos}</td>
                    <td><span class="reportes-badge reportes-badge-success">${item.rol}</span></td>
                    <td>${item.ultimoAcceso}</td>
                `;
                tableBody.appendChild(row);
            });

            chartContainer.innerHTML = `
                <div style="display: flex; align-items: end; justify-content: center; height: 100%; gap: 15px; padding: 20px;">
                    ${reportesData.topUsuarios.map((item, index) => `
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 25px; background: var(--reportes-chart-color-${index + 1}); height: ${item.accesos * 10}px; border-radius: 3px;"></div>
                            <div style="margin-top: 10px; font-size: 0.7rem; color: var(--reportes-text-muted); text-align: center;">${item.usuario.split(' ')[0]}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function generarReporteHorarios(chartContainer, tableBody, tableHeaders) {
            tableHeaders.innerHTML = `
                <th>Hora</th>
                <th>Accesos</th>
                <th>Intensidad</th>
            `;

            reportesData.horarios.forEach(item => {
                const intensidad = item.accesos > 30 ? 'Alta' : item.accesos > 15 ? 'Media' : 'Baja';
                const badgeClass = intensidad === 'Alta' ? 'reportes-badge-danger' : intensidad === 'Media' ? 'reportes-badge-warning' : 'reportes-badge-success';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.hora}</td>
                    <td>${item.accesos}</td>
                    <td><span class="reportes-badge ${badgeClass}">${intensidad}</span></td>
                `;
                tableBody.appendChild(row);
            });

            chartContainer.innerHTML = `
                <div style="display: flex; align-items: end; justify-content: center; height: 100%; gap: 8px; padding: 20px;">
                    ${reportesData.horarios.map(item => `
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 15px; background: var(--reportes-chart-color-1); height: ${item.accesos * 8}px; border-radius: 2px;"></div>
                            <div style="margin-top: 10px; font-size: 0.6rem; color: var(--reportes-text-muted); transform: rotate(-45deg);">${item.hora}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function actualizarResumen() {
            const totalAccesos = reportesData.asistencia.reduce((sum, item) => sum + item.accesos, 0);
            const accesosExitosos = reportesData.asistencia.reduce((sum, item) => sum + item.exitosos, 0);
            const accesosFallidos = reportesData.asistencia.reduce((sum, item) => sum + item.fallidos, 0);
            const ambientesActivos = reportesData.ambientes.length;

            document.getElementById('totalAccesos').textContent = totalAccesos;
            document.getElementById('ambientesActivos').textContent = ambientesActivos;
            document.getElementById('accesosExitosos').textContent = accesosExitosos;
            document.getElementById('accesosFallidos').textContent = accesosFallidos;

            const tasaExito = ((accesosExitosos / totalAccesos) * 100).toFixed(1);
            document.getElementById('tasaExito').textContent = `${tasaExito}% de éxito`;
        }

        function formatearFecha(fecha) {
            return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        // Funciones de exportación
        function reportesExportarPDF() {
            alert('📄 Exportando reporte actual como PDF...');
            // En producción, aquí se generaría el PDF
        }

        function reportesExportarExcel() {
            alert('📊 Exportando reporte actual como Excel...');
            // En producción, aquí se generaría el Excel
        }

        function reportesExportarCSV() {
            alert('📝 Exportando reporte actual como CSV...');
            // En producción, aquí se generaría el CSV
        }

        function reportesExportarJSON() {
            alert('🔧 Exportando reporte actual como JSON...');
            // En producción, aquí se generaría el JSON
        }

        function reportesExportarTodo() {
            alert('📦 Exportando todos los reportes disponibles...');
            // En producción, aquí se exportarían todos los reportes
        }

        function reportesExportarGrafico() {
            alert('💾 Exportando gráfico actual...');
        }

        function reportesExportarTabla() {
            alert('📊 Exportando tabla actual como CSV...');
        }

        // Hacer funciones globales para acceso desde otros módulos
        window.initializeReportesModule = initializeReportesModule;
        window.reportesGenerarReporte = reportesGenerarReporte;
        window.reportesCambiarTipo = reportesCambiarTipo;
        window.reportesExportarTodo = reportesExportarTodo;

        // Inicializar cuando se cargue la página
        document.addEventListener('DOMContentLoaded', function() {
            initializeReportesModule();
        });