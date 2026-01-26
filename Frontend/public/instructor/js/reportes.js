// reportes.js - Módulo de la vista Reportes (Instructor)

function generarReporte() {
    const tipo = document.getElementById('tipoReporte')?.value;
    const aprendiz = document.querySelector('.mis-ambientes-search-input[type="text"]')?.value || 'TODOS';
    const fechaInicio = document.querySelectorAll('.mis-ambientes-search-input[type="date"]')[0].value;
    const fechaFinal = document.querySelectorAll('.mis-ambientes-search-input[type="date"]')[1].value;
    
    if (!fechaInicio || !fechaFinal) {
        alert("Por favor, selecciona las fechas de inicio y fin.");
        return;
    }

    let titulo, contenido;
    const periodo = `Período: ${fechaInicio} al ${fechaFinal}`;

    switch (tipo) {
        case 'asistencia':
            titulo = "INFORME DE ASISTENCIA Y PERMANENCIA";
            contenido = `
                --- ${titulo} ---
                ${periodo}
                Aprendiz/Grupo: ${aprendiz}

                Resumen:
                - Total Horas Registradas: 245.5h
                - Promedio Diario: 4.9h
                - Faltas/Retrasos: 3

                Detalles de Permanencia (Ambientes):
                - Laboratorio de Química: 65h
                - Aula 301 - TICs: 180.5h
            `;
            break;
        case 'incidencias':
            titulo = "INFORME DE INCIDENCIAS Y ANOMALÍAS";
            contenido = `
                --- ${titulo} ---
                ${periodo}
                Aprendiz/Grupo: ${aprendiz}

                Resumen:
                - Olvidos de Salida (Pendientes): 1
                - Accesos Denegados (Totales): 5
                - Anomalías Reportadas: 2

                Detalle de Incidencia ID 2: Acceso Denegado (Ana G.) - Detalle: Permiso no vigente.
            `;
            break;
        case 'accesos':
            titulo = "INFORME DETALLADO DE ACCESOS POR AMBIENTE";
            contenido = `
                --- ${titulo} ---
                ${periodo}
                
                Ambiente: Aula 301 - TICs
                - Accesos Exitosos: 55
                - Hora Pico de Entrada: 10:00 AM

                Ambiente: Laboratorio de Química
                - Accesos Exitosos: 12
                - Accesos Denegados: 3
            `;
            break;
        default:
            titulo = 'Selecciona un Tipo de Reporte';
            contenido = 'Por favor, elige un tipo de reporte válido en el menú desplegable.';
    }

    const reporteOutput = document.getElementById('reporteOutput');
    reporteOutput.innerHTML = `
        <h4 style="color: var(--primary-color); margin-bottom: 1rem;">${titulo}</h4>
        <pre style="white-space: pre-wrap; color: var(--text-light); font-size: 0.9rem;">${contenido}</pre>
    `;

    console.log('Reporte generado.');
}

function descargarReporte() {
    const reporteOutput = document.getElementById('reporteOutput');
    const content = reporteOutput.textContent;

    if (content.includes('El resumen del reporte aparecerá aquí')) {
        alert('❌ Primero debes generar el reporte para poder descargarlo.');
        return;
    }

    const tipo = document.getElementById('tipoReporte')?.value;
    const filename = `Reporte_Instructor_${tipo || 'general'}_${new Date().toISOString().split('T')[0]}.txt`;

    // Crea un Blob y un enlace de descarga (simulando la descarga)
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`📥 Descargando ${filename}...`);
}

// Función de inicialización del módulo
function initializeReportesModule() {
    console.log('Módulo Reportes inicializado.');
    
    // Inicializar la fecha final con el día actual por defecto
    const fechaFinalInput = document.querySelectorAll('.mis-ambientes-search-input[type="date"]')[1];
    if (fechaFinalInput) {
        fechaFinalInput.valueAsDate = new Date();
    }
    
    // Asegurar que las funciones estén en el scope global
    window.generarReporte = generarReporte;
    window.descargarReporte = descargarReporte;
}