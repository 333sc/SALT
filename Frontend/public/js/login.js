const modal = document.getElementById("modal");

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('cedula').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.ok) {
      switch (data.user.role) {
        case 'admin':
          window.location.href = '/admin/Admin.html';
          break;
        case 'instructor':
          window.location.href = '/instructor/Instructor.html';
          break;
        case 'aprendiz':
          window.location.href = '/aprendiz/Aprendiz.html';
          break;
        case 'generales':
          window.location.href = '/generales/Generales.html';
          break;
        default:
          showModal();
      }
    } else {
      showModal();
    }
  } catch (error) {
    console.error(error);
    alert('Error al iniciar sesión');
  }
});

function showModal() {
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
  lucide.createIcons();
});
