 // Datos de ejemplo - En producción vendrían de una API
        const usersData = [
            {
                id: 1,
                name: "Juan Pérez",
                document: "CC 1023456789",
                role: "aprendiz",
                rfid: "A1B2C3D4",
                status: "active",
                email: "juan.perez@email.com"
            },
            {
                id: 2,
                name: "María Gómez",
                document: "CC 5234567890",
                role: "admin",
                rfid: "E5F6G7H8",
                status: "active",
                email: "maria.gomez@email.com"
            },
            {
                id: 3,
                name: "Carlos Ruiz",
                document: "TI 1023456789",
                role: "instructor",
                rfid: "",
                status: "active",
                email: "carlos.ruiz@email.com"
            },
            {
                id: 4,
                name: "Ana López",
                document: "CC 3456789012",
                role: "servicios",
                rfid: "I9J0K1L2",
                status: "inactive",
                email: "ana.lopez@email.com"
            }
        ];

        // Inicializar la tabla de usuarios
        function initializeUsersTable() {
            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = '';

            usersData.forEach(user => {
                const row = document.createElement('tr');
                
                // Determinar clase del badge según el rol
                let badgeClass = '';
                let roleText = '';
                switch(user.role) {
                    case 'admin':
                        badgeClass = 'users-badge-admin';
                        roleText = 'Administrador';
                        break;
                    case 'instructor':
                        badgeClass = 'users-badge-instructor';
                        roleText = 'Instructor';
                        break;
                    case 'aprendiz':
                        badgeClass = 'users-badge-aprendiz';
                        roleText = 'Aprendiz';
                        break;
                    case 'servicios':
                        badgeClass = 'users-badge-servicios';
                        roleText = 'Servicios';
                        break;
                }

                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div class="users-avatar">${user.name.split(' ').map(n => n[0]).join('')}</div>
                            <div>
                                <div style="font-weight: 500;">${user.name}</div>
                                <div style="font-size: 0.8rem; color: var(--users-text-muted);">${user.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${user.document}</td>
                    <td><span class="users-badge ${badgeClass}">${roleText}</span></td>
                    <td>${user.rfid || '<span style="color: var(--users-danger-color);">No asignada</span>'}</td>
                    <td>
                        <span style="color: ${user.status === 'active' ? 'var(--users-success-color)' : 'var(--users-danger-color)'}">
                            ${user.status === 'active' ? '✅ Activo' : '❌ Inactivo'}
                        </span>
                    </td>
                    <td>
                        <div class="users-actions-small">
                            <button class="users-btn-sm users-btn-edit" onclick="editUser(${user.id})">✏️ Editar</button>
                            <button class="users-btn-sm users-btn-assign" onclick="assignCardToUser(${user.id})">🪪 Asignar</button>
                            <button class="users-btn-sm users-btn-delete" onclick="deleteUser(${user.id})">🗑️ Eliminar</button>
                        </div>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        }

        // Modal de RFID
        let currentRFID = '';
        let selectedUser = '';

        function openRFIDModal() {
            document.getElementById('rfidModal').classList.add('active');
            startRFIDReading();
            populateUserSelect();
        }

        function closeRFIDModal() {
            document.getElementById('rfidModal').classList.remove('active');
            currentRFID = '';
            selectedUser = '';
        }

        function startRFIDReading() {
            // Simular lectura de RFID - En producción se conectaría con el hardware
            const statusElement = document.getElementById('rfidStatus');
            statusElement.textContent = 'Esperando tarjeta...';
            statusElement.style.color = 'var(--users-text-muted)';

            // Simulación: después de 3 segundos, detectar una tarjeta
            setTimeout(() => {
                // En producción, esto vendría del lector RFID real
                const simulatedRFID = 'RFID_' + Math.random().toString(36).substr(2, 8).toUpperCase();
                currentRFID = simulatedRFID;
                
                statusElement.textContent = `Tarjeta detectada: ${simulatedRFID}`;
                statusElement.style.color = 'var(--users-success-color)';
                
                // Habilitar botón de asignación si hay usuario seleccionado
                updateAssignButton();
            }, 3000);
        }

        function populateUserSelect() {
            const select = document.getElementById('userSelect');
            select.innerHTML = '<option value="">Seleccionar usuario...</option>';
            
            usersData.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.name} - ${user.document}`;
                select.appendChild(option);
            });

            select.onchange = updateAssignButton;
        }

        function updateAssignButton() {
            const assignBtn = document.getElementById('assignBtn');
            const userSelect = document.getElementById('userSelect');
            
            assignBtn.disabled = !(currentRFID && userSelect.value);
        }

        function assignRFID() {
            const userId = document.getElementById('userSelect').value;
            const user = usersData.find(u => u.id == userId);
            
            if (user && currentRFID) {
                // En producción, aquí se haría una petición a la API
                user.rfid = currentRFID;
                
                alert(`✅ Tarjeta ${currentRFID} asignada exitosamente a ${user.name}`);
                closeRFIDModal();
                initializeUsersTable(); // Refrescar tabla
            }
        }

        function assignCardToUser(userId) {
            const user = usersData.find(u => u.id == userId);
            if (user) {
                openRFIDModal();
                document.getElementById('userSelect').value = userId;
                updateAssignButton();
            }
        }

        function editUser(userId) {
            const user = usersData.find(u => u.id == userId);
            alert(`📝 Editando usuario: ${user.name}\n\nEsta funcionalidad abriría un formulario de edición.`);
        }

        function deleteUser(userId) {
            const user = usersData.find(u => u.id == userId);
            if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.name}?`)) {
                // En producción, aquí se haría una petición DELETE a la API
                alert(`Usuario ${user.name} eliminado (simulación)`);
            }
        }

        function openUserModal() {
            alert('👤 Esta funcionalidad abriría un formulario para registrar nuevo usuario.');
        }

        // Búsqueda en tiempo real
        document.getElementById('searchUsers').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Implementar búsqueda filtrada
            console.log('Buscando:', searchTerm);
        });

        // Inicializar cuando se cargue la página
        document.addEventListener('DOMContentLoaded', initializeUsersTable);

        // Hacer funciones globales para acceso desde otros módulos
        window.initializeUsersModule = initializeUsersTable;
        window.openRFIDModal = openRFIDModal;
        window.closeRFIDModal = closeRFIDModal;
        window.assignRFID = assignRFID;
        window.assignCardToUser = assignCardToUser;
        window.editUser = editUser;
        window.deleteUser = deleteUser;
        window.openUserModal = openUserModal;


