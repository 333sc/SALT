// =============================================
// MÓDULO DE IRREGULARIDADES - VERSIÓN SPA COMPATIBLE
// =============================================

const IrregularidadesModule = {
  // Datos de ejemplo
  data: {
    reportes: [
      {
        id: 1,
        titulo: "Sensor RFID no responde",
        tipo: "hardware",
        ambiente: "lab1",
        descripcion:
          "El sensor RFID ubicado en la entrada del laboratorio 1 no está detectando tarjetas. Los usuarios reportan que el LED no enciende.",
        estado: "pendiente",
        criticidad: "alta",
        fechaReporte: "2024-01-26 14:30",
        fechaActualizacion: "2024-01-26 14:30",
        reportadoPor: "Juan Pérez",
        evidencias: [],
      },
      {
        id: 2,
        titulo: "Acceso no autorizado detectado",
        tipo: "seguridad",
        ambiente: "aula201",
        descripcion:
          "Se detectó un intento de acceso con tarjeta no registrada en el aula 201 durante la noche.",
        estado: "en-proceso",
        criticidad: "alta",
        fechaReporte: "2024-01-25 22:15",
        fechaActualizacion: "2024-01-26 09:00",
        reportadoPor: "Sistema Automático",
        evidencias: ["intento_acceso.jpg"],
      },
      {
        id: 3,
        titulo: "Puerta no cierra correctamente",
        tipo: "infraestructura",
        ambiente: "biblioteca",
        descripcion:
          "La puerta principal de la biblioteca no cierra herméticamente, permitiendo entrada de aire frío.",
        estado: "resuelto",
        criticidad: "media",
        fechaReporte: "2024-01-24 10:00",
        fechaActualizacion: "2024-01-25 16:45",
        reportadoPor: "Ana López",
        evidencias: ["puerta_danada.jpg", "cierre_roto.jpg"],
      },
      {
        id: 4,
        titulo: "Software de monitoreo lento",
        tipo: "software",
        ambiente: "oficina",
        descripcion:
          "El sistema de monitoreo en tiempo real presenta lentitud al cargar los reportes de actividad.",
        estado: "pendiente",
        criticidad: "media",
        fechaReporte: "2024-01-26 11:20",
        fechaActualizacion: "2024-01-26 11:20",
        reportadoPor: "Carlos Ruiz",
        evidencias: [],
      },
    ],
    archivosSubidos: [],
    archivosSubidosEdicion: [], // Nueva propiedad
    archivosParaEliminar: [], // Nueva propiedad
  },

  // Inicializar el módulo
  init() {
    console.log("🚨 Inicializando módulo de irregularidades...");
    this.setupEventListeners();
    this.cargarReportes();
    this.actualizarEstadisticas();

    this.initialized = true;
    console.log("✅ Módulo de irregularidades listo");
  },

  // Configurar event listeners
  setupEventListeners() {
    // Búsqueda en tiempo real
    const searchInput = document.getElementById("searchIrregularidades");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filtrarReportes();
      });
    }

    // Event delegation para acciones de reportes
    document.addEventListener("click", (e) => {
      const target = e.target;

      // Previsualizar archivo
      if (target.closest(".irregularidades-file-preview-btn")) {
        const item = target.closest(".irregularidades-file-item-existing");
        const filename = item?.getAttribute("data-filename");
        if (filename) this.previsualizarArchivo(filename);
      }

      // Editar reporte
      if (target.closest(".irregularidades-btn-edit")) {
        const item = target.closest(".irregularidades-item");
        const reporteId = item?.getAttribute("data-id");
        if (reporteId) this.editarReporte(parseInt(reporteId));
      }

      // Resolver reporte
      if (target.closest(".irregularidades-btn-resolve")) {
        const item = target.closest(".irregularidades-item");
        const reporteId = item?.getAttribute("data-id");
        if (reporteId) this.resolverReporte(parseInt(reporteId));
      }

      // Eliminar reporte
      if (target.closest(".irregularidades-btn-delete")) {
        const item = target.closest(".irregularidades-item");
        const reporteId = item?.getAttribute("data-id");
        if (reporteId) this.eliminarReporte(parseInt(reporteId));
      }
    });
  },

  // Cargar y mostrar reportes
  cargarReportes(filtros = {}) {
    const contenedor = document.getElementById("irregularidadesList");
    if (!contenedor) return;

    let reportesFiltrados = [...this.data.reportes];

    // Aplicar filtros
    if (filtros.estado) {
      reportesFiltrados = reportesFiltrados.filter(
        (r) => r.estado === filtros.estado
      );
    }
    if (filtros.tipo) {
      reportesFiltrados = reportesFiltrados.filter(
        (r) => r.tipo === filtros.tipo
      );
    }
    if (filtros.ambiente) {
      reportesFiltrados = reportesFiltrados.filter(
        (r) => r.ambiente === filtros.ambiente
      );
    }
    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      reportesFiltrados = reportesFiltrados.filter(
        (r) =>
          r.titulo.toLowerCase().includes(termino) ||
          r.descripcion.toLowerCase().includes(termino)
      );
    }

    // Ordenar por fecha (más recientes primero)
    reportesFiltrados.sort(
      (a, b) => new Date(b.fechaReporte) - new Date(a.fechaReporte)
    );

    // Generar HTML
    contenedor.innerHTML = reportesFiltrados
      .map((reporte) => this.generarHTMLReporte(reporte))
      .join("");

    this.actualizarEstadisticas();
  },

  // Generar HTML para un reporte
  generarHTMLReporte(reporte) {
    const badgeEstado = this.obtenerBadgeEstado(reporte.estado);
    const badgeCriticidad = this.obtenerBadgeCriticidad(reporte.criticidad);
    const nombreAmbiente = this.obtenerNombreAmbiente(reporte.ambiente);
    const tieneEvidencias = reporte.evidencias.length > 0;

    return `
                    <div class="irregularidades-item" data-id="${reporte.id}">
                        <div class="irregularidades-item-header">
                            <div>
                                <div class="irregularidades-item-title">${
                                  reporte.titulo
                                }</div>
                                <div class="irregularidades-item-meta">
                                    <div class="irregularidades-item-info">
                                        <span>🏷️ ${this.obtenerNombreTipo(
                                          reporte.tipo
                                        )}</span>
                                    </div>
                                    <div class="irregularidades-item-info">
                                        <span>🏢 ${nombreAmbiente}</span>
                                    </div>
                                    <div class="irregularidades-item-info">
                                        <span>👤 ${reporte.reportadoPor}</span>
                                    </div>
                                    <div class="irregularidades-item-info">
                                        <span>📅 ${this.formatearFecha(
                                          reporte.fechaReporte
                                        )}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.5rem; align-items: start;">
                                ${badgeCriticidad}
                                ${badgeEstado}
                            </div>
                        </div>
                        
                        <div class="irregularidades-item-description">
                            ${reporte.descripcion}
                        </div>

                        ${
                          tieneEvidencias
                            ? `
                        <div class="irregularidades-item-info">
                            <span>📎 ${reporte.evidencias.length} archivo(s) adjunto(s)</span>
                        </div>
                        `
                            : ""
                        }

                        <div class="irregularidades-item-footer">
                            <div class="irregularidades-item-info">
                                <span>🕓 Actualizado: ${this.formatearFecha(
                                  reporte.fechaActualizacion
                                )}</span>
                            </div>
                            <div class="irregularidades-item-actions">
                                <button class="irregularidades-btn-sm irregularidades-btn-edit" title="Editar reporte">
                                    ✏️ Editar
                                </button>
                                ${
                                  reporte.estado !== "resuelto"
                                    ? `
                                <button class="irregularidades-btn-sm irregularidades-btn-resolve" title="Marcar como resuelto">
                                    ✅ Resolver
                                </button>
                                `
                                    : ""
                                }
                                <button class="irregularidades-btn-sm irregularidades-btn-delete" title="Eliminar reporte">
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
  },

  // Obtener badge de estado
  obtenerBadgeEstado(estado) {
    const clases = {
      pendiente: "irregularidades-badge-pendiente",
      "en-proceso": "irregularidades-badge-en-proceso",
      resuelto: "irregularidades-badge-resuelto",
    };
    const textos = {
      pendiente: "⏳ Pendiente",
      "en-proceso": "🔧 En Proceso",
      resuelto: "✅ Resuelto",
    };
    return `<span class="irregularidades-badge ${clases[estado]}">${textos[estado]}</span>`;
  },

  // Obtener badge de criticidad
  obtenerBadgeCriticidad(criticidad) {
    const clases = {
      baja: "irregularidades-badge-criticidad-baja",
      media: "irregularidades-badge-criticidad-media",
      alta: "irregularidades-badge-criticidad-alta",
    };
    const textos = {
      baja: "🟢 Baja",
      media: "🟡 Media",
      alta: "🔴 Alta",
    };
    return `<span class="irregularidades-badge ${clases[criticidad]}">${textos[criticidad]}</span>`;
  },

  // Obtener nombre del ambiente
  obtenerNombreAmbiente(codigo) {
    const ambientes = {
      lab1: "Laboratorio 1",
      lab2: "Laboratorio 2",
      aula201: "Aula 201",
      biblioteca: "Biblioteca",
      oficina: "Oficina",
    };
    return ambientes[codigo] || codigo;
  },

  // Obtener nombre del tipo
  obtenerNombreTipo(tipo) {
    const tipos = {
      hardware: "Hardware",
      software: "Software",
      acceso: "Acceso",
      seguridad: "Seguridad",
      infraestructura: "Infraestructura",
      otros: "Otros",
    };
    return tipos[tipo] || tipo;
  },

  // Formatear fecha
  formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Actualizar estadísticas
  actualizarEstadisticas() {
    const total = this.data.reportes.length;
    const pendientes = this.data.reportes.filter(
      (r) => r.estado === "pendiente"
    ).length;
    const enProceso = this.data.reportes.filter(
      (r) => r.estado === "en-proceso"
    ).length;
    const resueltos = this.data.reportes.filter(
      (r) => r.estado === "resuelto"
    ).length;

    document.getElementById("totalReportes").textContent = total;
    document.getElementById("reportesPendientes").textContent = pendientes;
    document.getElementById("reportesProceso").textContent = enProceso;
    document.getElementById("reportesResueltos").textContent = resueltos;
  },

  // Filtrar reportes
  filtrarReportes() {
    const estado = document.getElementById("filterEstado")?.value || "";
    const tipo = document.getElementById("filterTipo")?.value || "";
    const ambiente = document.getElementById("filterAmbiente")?.value || "";
    const busqueda =
      document.getElementById("searchIrregularidades")?.value || "";

    this.cargarReportes({ estado, tipo, ambiente, busqueda });
  },

  // Buscar reportes
  buscarReportes() {
    this.filtrarReportes();
  },

  // Limpiar filtros
  limpiarFiltros() {
    document.getElementById("filterEstado").value = "";
    document.getElementById("filterTipo").value = "";
    document.getElementById("filterAmbiente").value = "";
    document.getElementById("searchIrregularidades").value = "";
    this.cargarReportes();
  },

  // Abrir modal para nuevo reporte
  abrirModalNuevo() {
    document.getElementById("nuevoReporteModal").classList.add("active");
    document.getElementById("nuevoReporteForm").reset();
    this.data.archivosSubidos = [];
    this.actualizarVistaArchivos();
  },

  // Cerrar modal
  cerrarModalNuevo() {
    document.getElementById("nuevoReporteModal").classList.remove("active");
  },

  // Manejar subida de archivos
  manejarSubidaArchivos(input) {
    const files = Array.from(input.files);

    // Validar número de archivos
    if (this.data.archivosSubidos.length + files.length > 5) {
      alert("❌ Máximo 5 archivos permitidos");
      return;
    }

    // Validar tamaño (10MB máximo por archivo)
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`❌ El archivo "${file.name}" excede el tamaño máximo de 10MB`);
        return;
      }
    }

    // Agregar archivos
    this.data.archivosSubidos.push(...files);
    this.actualizarVistaArchivos();
  },

  // Actualizar vista de archivos
  actualizarVistaArchivos() {
    const preview = document.getElementById("filePreview");
    if (!preview) return;

    if (this.data.archivosSubidos.length === 0) {
      preview.style.display = "none";
      return;
    }

    preview.style.display = "block";
    preview.innerHTML = this.data.archivosSubidos
      .map(
        (file, index) => `
                    <div class="irregularidades-file-item">
                        <div class="irregularidades-file-name">${file.name}</div>
                        <button type="button" class="irregularidades-file-remove" onclick="IrregularidadesModule.eliminarArchivo(${index})">
                            ×
                        </button>
                    </div>
                `
      )
      .join("");
  },

  // Eliminar archivo
  eliminarArchivo(index) {
    this.data.archivosSubidos.splice(index, 1);
    this.actualizarVistaArchivos();
  },

  // Guardar nuevo reporte
  guardarReporte() {
    const form = document.getElementById("nuevoReporteForm");
    if (!form.checkValidity()) {
      alert("❌ Por favor completa todos los campos obligatorios");
      return;
    }

    const nuevoReporte = {
      id: Math.max(...this.data.reportes.map((r) => r.id), 0) + 1,
      titulo: document.getElementById("reporteTitulo").value,
      tipo: document.getElementById("reporteTipo").value,
      ambiente: document.getElementById("reporteAmbiente").value,
      descripcion: document.getElementById("reporteDescripcion").value,
      criticidad: document.getElementById("reporteCriticidad").value,
      estado: "pendiente",
      fechaReporte: new Date().toISOString().replace("T", " ").substring(0, 16),
      fechaActualizacion: new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 16),
      reportadoPor: "Administrador",
      evidencias: this.data.archivosSubidos.map((file) => file.name),
    };

    this.data.reportes.unshift(nuevoReporte);
    this.cargarReportes();
    this.cerrarModalNuevo();

    alert("✅ Reporte guardado exitosamente");
  },

  // Editar reporte
  // Editar reporte - NUEVA VERSIÓN
  editarReporte(id) {
    const reporte = this.data.reportes.find((r) => r.id === id);

    if (reporte) {
      console.log(`✏️ Editando reporte ID: ${id} - "${reporte.titulo}"`);

      // 1. Cargar datos del reporte en el formulario
      document.getElementById("editarReporteId").value = reporte.id;
      document.getElementById("editarReporteTitulo").value = reporte.titulo;
      document.getElementById("editarReporteTipo").value = reporte.tipo;
      document.getElementById("editarReporteAmbiente").value = reporte.ambiente;
      document.getElementById("editarReporteCriticidad").value =
        reporte.criticidad;
      document.getElementById("editarReporteEstado").value = reporte.estado;
      document.getElementById("editarReporteDescripcion").value =
        reporte.descripcion;
      document.getElementById("editarReporteReportadoPor").value =
        reporte.reportadoPor;
      document.getElementById("editarReporteFechaReporte").value =
        this.formatearFecha(reporte.fechaReporte);
      document.getElementById("editarReporteFechaActualizacion").value =
        this.formatearFecha(reporte.fechaActualizacion);

      // 2. Resetear arrays de archivos temporales
      this.data.archivosSubidosEdicion = [];
      this.data.archivosParaEliminar = [];

      // 3. Mostrar archivos actuales del reporte
      this.mostrarArchivosActuales(reporte.evidencias);

      // 4. Limpiar y ocultar previsualización de nuevos archivos
      const preview = document.getElementById("editarFilePreview");
      if (preview) {
        preview.innerHTML = "";
        preview.style.display = "none";
      }

      // 5. Resetear input de archivos
      const fileInput = document.getElementById("editarReporteEvidencia");
      if (fileInput) {
        fileInput.value = "";
      }

      // 6. Mostrar el modal
      const modal = document.getElementById("editarReporteModal");
      if (modal) {
        modal.classList.add("active");
        // Hacer scroll al inicio del modal
        modal.querySelector(".irregularidades-modal-content").scrollTop = 0;
      } else {
        console.error("❌ No se encontró el modal de edición");
        alert("Error: No se puede cargar el formulario de edición");
      }
    } else {
      console.error(`❌ No se encontró el reporte con ID: ${id}`);
      alert("Error: No se encontró el reporte a editar");
    }
  },

  // Función auxiliar para mostrar archivos actuales
  mostrarArchivosActuales(archivos) {
    const container = document.getElementById("archivosActualesContainer");
    if (!container) {
      console.error("❌ No se encontró el contenedor de archivos actuales");
      return;
    }

    if (!archivos || archivos.length === 0) {
      container.innerHTML = `
            <div class="irregularidades-no-files">
                📭 No hay archivos adjuntos en este reporte
            </div>
        `;
      return;
    }

    // Crear HTML para cada archivo
    const archivosHTML = archivos
      .map((archivo, index) => {
        // Determinar tipo de archivo para ícono
        const extension = archivo.split(".").pop().toLowerCase();
        let icono = "📎"; // Ícono por defecto
        if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
          icono = "🖼️";
        } else if (["pdf"].includes(extension)) {
          icono = "📄";
        } else if (["doc", "docx"].includes(extension)) {
          icono = "📝";
        }

        return `
            <div class="irregularidades-file-item-existing">
                <input type="checkbox" 
                       id="archivo-${index}" 
                       class="irregularidades-file-checkbox" 
                       data-filename="${archivo}"
                       onchange="IrregularidadesModule.toggleArchivoEliminar('${archivo}', this.checked)">
                
                <label for="archivo-${index}" class="irregularidades-file-label">
                    <div class="irregularidades-file-icon-existing">${icono}</div>
                    <div class="irregularidades-file-info">
                        <div class="irregularidades-file-name-existing">${archivo}</div>
                        <div class="irregularidades-file-size">Marcar para eliminar</div>
                    </div>
                </label>
                
                <div class="irregularidades-file-actions">
                    <button type="button" class="irregularidades-file-preview-btn" 
                            onclick="IrregularidadesModule.previsualizarArchivo(${JSON.stringify(
                              archivo
                            )})" 
                            title="Previsualizar">
                        👁️
                    </button>
                </div>
            </div>
        `;
      })
      .join("");

    container.innerHTML = archivosHTML;
  },

  // Toggle para marcar archivos para eliminar
  toggleArchivoEliminar(nombreArchivo, isChecked) {
    if (isChecked) {
      if (!this.data.archivosParaEliminar.includes(nombreArchivo)) {
        this.data.archivosParaEliminar.push(nombreArchivo);
        console.log(`📁 Archivo marcado para eliminar: ${nombreArchivo}`);
      }
    } else {
      this.data.archivosParaEliminar = this.data.archivosParaEliminar.filter(
        (archivo) => archivo !== nombreArchivo
      );
      console.log(`📁 Archivo desmarcado: ${nombreArchivo}`);
    }

    // Actualizar contador
    this.actualizarContadorArchivos();
  },

  // Función auxiliar para previsualizar archivos (puedes implementarla después)
  previsualizarArchivo(nombreArchivo) {
    alert(
      `👁️ Previsualizar archivo: ${nombreArchivo}\n\nEsta funcionalidad mostraría una vista previa del archivo.`
    );
  },

  // Actualizar contador de archivos
  actualizarContadorArchivos() {
    const eliminarBtn = document.querySelector(".irregularidades-btn-danger");
    if (eliminarBtn && this.data.archivosParaEliminar.length > 0) {
      eliminarBtn.innerHTML = `🗑️ Eliminar (${this.data.archivosParaEliminar.length})`;
    } else if (eliminarBtn) {
      eliminarBtn.innerHTML = "🗑️ Eliminar Seleccionados";
    }
  },

  // Manejar subida de archivos en edición
  manejarSubidaArchivosEdicion(input) {
    if (!input || !input.files) return;

    const files = Array.from(input.files);

    // Obtener reporte actual
    const reporteId = parseInt(
      document.getElementById("editarReporteId").value
    );
    const reporte = this.data.reportes.find((r) => r.id === reporteId);

    if (!reporte) {
      alert("❌ Error: No se encontró el reporte");
      return;
    }

    // Calcular archivos actuales (excluyendo los marcados para eliminar)
    const archivosActuales =
      reporte.evidencias.length - this.data.archivosParaEliminar.length;
    const archivosNuevos = files.length;
    const archivosExistentes = this.data.archivosSubidosEdicion.length;
    const totalFinal = archivosActuales + archivosExistentes + archivosNuevos;

    // Validar número total de archivos
    if (totalFinal > 5) {
      alert(
        `❌ Máximo 5 archivos permitidos. Actual: ${archivosActuales} + nuevos: ${archivosNuevos}`
      );
      return;
    }

    // Validar tamaño de cada archivo
    const archivosGrandes = files.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (archivosGrandes.length > 0) {
      alert(
        `❌ Los siguientes archivos exceden 10MB:\n${archivosGrandes
          .map((f) => f.name)
          .join("\n")}`
      );
      return;
    }

    // Validar tipos de archivo (opcional)
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const archivosInvalidos = files.filter(
      (file) =>
        !tiposPermitidos.includes(file.type) && !file.type.startsWith("image/")
    );

    if (archivosInvalidos.length > 0) {
      if (
        !confirm(
          `⚠️ Algunos archivos pueden no ser compatibles:\n${archivosInvalidos
            .map((f) => f.name)
            .join("\n")}\n\n¿Continuar de todos modos?`
        )
      ) {
        return;
      }
    }

    // Agregar archivos al array temporal
    this.data.archivosSubidosEdicion.push(...files);
    this.actualizarVistaArchivosEdicion();

    // Mostrar mensaje de éxito
    console.log(`✅ ${files.length} archivo(s) añadido(s) para la edición`);
  },

  // Actualizar vista de archivos en edición
  actualizarVistaArchivosEdicion() {
    const preview = document.getElementById("editarFilePreview");
    if (!preview) return;

    const archivos = this.data.archivosSubidosEdicion;

    if (archivos.length === 0) {
      preview.style.display = "none";
      preview.innerHTML = "";
      return;
    }

    preview.style.display = "block";

    const archivosHTML = archivos
      .map((file, index) => {
        // Determinar ícono según tipo de archivo
        let icono = "📎";
        if (file.type.startsWith("image/")) {
          icono = "🖼️";
        } else if (file.type === "application/pdf") {
          icono = "📄";
        } else if (
          file.type.includes("document") ||
          file.type.includes("word")
        ) {
          icono = "📝";
        }

        // Formatear tamaño del archivo
        const size =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            : `${(file.size / 1024).toFixed(2)} KB`;

        return `
            <div class="irregularidades-file-item nuevo-archivo">
                <div class="irregularidades-file-icon-nuevo">${icono}</div>
                <div class="irregularidades-file-info">
                    <div class="irregularidades-file-name">${file.name}</div>
                    <div class="irregularidades-file-details">
                        <span class="irregularidades-file-size">${size}</span>
                        <span class="irregularidades-file-new">(nuevo)</span>
                    </div>
                </div>
                <button type="button" 
                        class="irregularidades-file-remove" 
                        onclick="IrregularidadesModule.eliminarArchivoEdicion(${index})"
                        title="Quitar archivo">
                    ×
                </button>
            </div>
        `;
      })
      .join("");

    preview.innerHTML = archivosHTML;
  },

  // Eliminar archivo en edición
  eliminarArchivoEdicion(index) {
    if (index >= 0 && index < this.data.archivosSubidosEdicion.length) {
      const archivo = this.data.archivosSubidosEdicion[index];
      console.log(`🗑️ Eliminando archivo de edición: ${archivo.name}`);

      this.data.archivosSubidosEdicion.splice(index, 1);
      this.actualizarVistaArchivosEdicion();
    }
  },

  // Eliminar archivos seleccionados
  eliminarArchivosSeleccionados() {
    if (this.data.archivosParaEliminar.length === 0) {
      alert("❌ No hay archivos seleccionados para eliminar");
      return;
    }

    const confirmacion = confirm(
      `¿Estás seguro de eliminar ${
        this.data.archivosParaEliminar.length
      } archivo(s) seleccionado(s)?\n\n${this.data.archivosParaEliminar.join(
        "\n"
      )}`
    );

    if (confirmacion) {
      // Solo marcamos para eliminar, la eliminación real se hará al guardar
      alert(
        `✅ ${this.data.archivosParaEliminar.length} archivo(s) marcado(s) para eliminación.\nSe eliminarán al guardar los cambios.`
      );

      // Actualizar vista de checkboxes (marcarlos como deshabilitados)
      this.data.archivosParaEliminar.forEach((nombreArchivo) => {
        const checkbox = document.querySelector(
          `input[data-filename="${nombreArchivo}"]`
        );
        if (checkbox) {
          checkbox.disabled = true;
          checkbox.parentElement.classList.add("archivo-para-eliminar");
        }
      });
    }
  },

  // Cerrar modal de edición
  cerrarModalEditar() {
    const modal = document.getElementById("editarReporteModal");
    if (modal) {
      modal.classList.remove("active");

      // Confirmar si hay cambios sin guardar
      const form = document.getElementById("editarReporteForm");
      const formData = new FormData(form);
      let hasChanges = false;

      // Verificar si hay cambios en campos de texto/selección
      const campos = [
        "titulo",
        "tipo",
        "ambiente",
        "criticidad",
        "estado",
        "descripcion",
      ];
      campos.forEach((campo) => {
        const input = document.getElementById(
          `editarReporte${campo.charAt(0).toUpperCase() + campo.slice(1)}`
        );
        if (input && input.defaultValue !== input.value) {
          hasChanges = true;
        }
      });

      // Verificar si hay archivos nuevos o marcados para eliminar
      if (
        this.data.archivosSubidosEdicion.length > 0 ||
        this.data.archivosParaEliminar.length > 0
      ) {
        hasChanges = true;
      }

      if (
        hasChanges &&
        !confirm("⚠️ Tienes cambios sin guardar. ¿Seguro que quieres cerrar?")
      ) {
        modal.classList.add("active");
        return;
      }

      // Resetear arrays temporales
      this.data.archivosSubidosEdicion = [];
      this.data.archivosParaEliminar = [];

      console.log("📂 Modal de edición cerrado");
    }
  },

  // Guardar cambios del reporte editado
  guardarCambiosReporte() {
    const form = document.getElementById("editarReporteForm");
    if (!form.checkValidity()) {
      alert("❌ Por favor completa todos los campos obligatorios");
      form.reportValidity();
      return;
    }

    const reporteId = parseInt(
      document.getElementById("editarReporteId").value
    );
    const reporte = this.data.reportes.find((r) => r.id === reporteId);

    if (!reporte) {
      alert("❌ Error: No se encontró el reporte");
      return;
    }

    // Validar que no se exceda el límite de archivos
    const totalArchivos =
      reporte.evidencias.length -
      this.data.archivosParaEliminar.length +
      this.data.archivosSubidosEdicion.length;
    if (totalArchivos > 5) {
      alert(
        `❌ Error: Máximo 5 archivos permitidos. Total actual: ${totalArchivos}`
      );
      return;
    }

    // Confirmar guardado
    if (!confirm("¿Guardar los cambios realizados en este reporte?")) {
      return;
    }

    // Guardar los valores anteriores (para posible rollback)
    const valoresAnteriores = {
      titulo: reporte.titulo,
      tipo: reporte.tipo,
      ambiente: reporte.ambiente,
      criticidad: reporte.criticidad,
      estado: reporte.estado,
      descripcion: reporte.descripcion,
      evidencias: [...reporte.evidencias],
    };

    try {
      // 1. Actualizar datos básicos del reporte
      reporte.titulo = document.getElementById("editarReporteTitulo").value;
      reporte.tipo = document.getElementById("editarReporteTipo").value;
      reporte.ambiente = document.getElementById("editarReporteAmbiente").value;
      reporte.criticidad = document.getElementById(
        "editarReporteCriticidad"
      ).value;
      reporte.estado = document.getElementById("editarReporteEstado").value;
      reporte.descripcion = document.getElementById(
        "editarReporteDescripcion"
      ).value;

      // 2. Actualizar archivos: eliminar los seleccionados
      if (this.data.archivosParaEliminar.length > 0) {
        reporte.evidencias = reporte.evidencias.filter(
          (archivo) => !this.data.archivosParaEliminar.includes(archivo)
        );
        console.log(
          `🗑️ Eliminados ${this.data.archivosParaEliminar.length} archivo(s)`
        );
      }

      // 3. Agregar nuevos archivos
      if (this.data.archivosSubidosEdicion.length > 0) {
        const nuevosNombres = this.data.archivosSubidosEdicion.map((file) => {
          // Generar nombre único para evitar colisiones
          const timestamp = new Date().getTime();
          const extension = file.name.split(".").pop();
          const nombreBase = file.name.replace(/\.[^/.]+$/, "");
          return `${nombreBase}_${timestamp}.${extension}`;
        });

        reporte.evidencias.push(...nuevosNombres);
        console.log(`📁 Agregados ${nuevosNombres.length} archivo(s) nuevo(s)`);
      }

      // 4. Actualizar fecha de modificación
      reporte.fechaActualizacion = new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 16);

      // 5. Recargar la lista de reportes
      this.cargarReportes();

      // 6. Cerrar el modal
      this.cerrarModalEditar();

      // 7. Mostrar mensaje de éxito
      alert(`✅ Reporte "${reporte.titulo}" actualizado exitosamente`);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);

      // Rollback en caso de error
      Object.assign(reporte, valoresAnteriores);

      alert("❌ Error al guardar los cambios. Por favor, intenta nuevamente.");
    }
  },

  // Resolver reporte
  resolverReporte(id) {
    const reporte = this.data.reportes.find((r) => r.id === id);
    if (
      reporte &&
      confirm(`¿Marcar el reporte "${reporte.titulo}" como resuelto?`)
    ) {
      reporte.estado = "resuelto";
      reporte.fechaActualizacion = new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 16);
      this.cargarReportes();
      alert("✅ Reporte marcado como resuelto");
    }
  },

  // Eliminar reporte
  eliminarReporte(id) {
    const reporte = this.data.reportes.find((r) => r.id === id);
    if (
      reporte &&
      confirm(`¿Estás seguro de eliminar el reporte "${reporte.titulo}"?`)
    ) {
      this.data.reportes = this.data.reportes.filter((r) => r.id !== id);
      this.cargarReportes();
      alert("🗑️ Reporte eliminado");
    }
  },

  // Exportar reportes
  exportarReportes() {
    alert("📤 Exportando reportes de irregularidades...");
    // En producción, aquí se generaría el archivo de exportación
  },
};

// =============================================
// INICIALIZACIÓN COMPATIBLE CON SPA
// =============================================

// Función de inicialización global
function initializeIrregularidadesModule() {
  // Esperar a que el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      IrregularidadesModule.init();
    });
  } else {
    // DOM ya está listo
    IrregularidadesModule.init();
  }
}

// Exportar funciones globales de forma segura
window.initializeIrregularidadesModule = initializeIrregularidadesModule;
window.IrregularidadesModule = IrregularidadesModule;

// Inicialización automática cuando se carga como página independiente
if (!window.isSpaEnvironment) {
  initializeIrregularidadesModule();
}

// También inicializar si se detecta que está en un entorno SPA
if (window.isSpaEnvironment || window.initializeIrregularidadesModule) {
  console.log("🚀 Módulo de irregularidades listo para SPA");
}


lucid.createIcons()