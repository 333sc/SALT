// Lógica para la vista de consulta
function refreshAmbientesList() {
  const refreshBtn = document.querySelector(".ambientes-btn-success");

  // Deshabilitar temporalmente el botón
  refreshBtn.disabled = true;
  refreshBtn.style.opacity = "0.7";
  refreshBtn.innerHTML = "<span>⏳</span> Actualizando...";

  // Simular una llamada a la API
  setTimeout(() => {
    console.log("Lista de ambientes actualizada");

    // Restaurar el botón
    refreshBtn.disabled = false;
    refreshBtn.style.opacity = "1";
    refreshBtn.innerHTML = "<span>🔄</span> Actualizar";

    // Recargar la tabla (en un caso real, aquí se actualizarían los datos)
    location.reload();
  }, 800);
}

function filterAmbientesList() {
  const searchInput = document.getElementById("searchAmbientes");
  const tipoSelect = document.getElementById("filterTipo");
  const tableRows = document.querySelectorAll("#ambientesTableBody tr");

  const searchTerm = searchInput.value.toLowerCase();
  const filterValue = tipoSelect.value;

  tableRows.forEach((row) => {
    const nombre = row.cells[0].textContent.toLowerCase();
    const tipo = row.cells[1].textContent.toLowerCase();
    const ubicacion = row.cells[2].textContent.toLowerCase();
    const descripcion = row.cells[3].textContent.toLowerCase();

    const matchesSearch =
      nombre.includes(searchTerm) ||
      ubicacion.includes(searchTerm) ||
      descripcion.includes(searchTerm);
    const matchesFilter = filterValue === "" || tipo === filterValue;

    if (matchesSearch && matchesFilter) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });

  console.log("Filtrando lista de ambientes...");
}

// Event listeners para búsqueda en tiempo real
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchAmbientes");
  const tipoSelect = document.getElementById("filterTipo");

  if (searchInput) {
    searchInput.addEventListener("input", filterAmbientesList);
  }

  if (tipoSelect) {
    tipoSelect.addEventListener("change", filterAmbientesList);
  }
});

window.refreshAmbientesList = refreshAmbientesList;
window.filterAmbientesList = filterAmbientesList;
