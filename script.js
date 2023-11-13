let jwtToken = '';

function solicitarToken() {
    fetch('http://localhost:50586/api/Autenticacion/Token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: "Interfaz01",
            contra: "Charizard123",
            uGuid: "3B5C6D4D-F190-458C-83DF-768F8F35A838"
        })
    })
    .then(response => response.json())
    .then(data => {
        jwtToken = data.access_token;
    })
    .catch(error => console.error('Error al solicitar el token:', error));
}

function cargarAlumnos() {
    fetch('http://localhost:50586/api/Alumnos/GetAll', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(data => llenarTabla(data.respuesta))
    .catch(error => console.error('Error:', error));

    
}

function llenarTabla(alumnos) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    if (Array.isArray(alumnos)) {
        alumnos.forEach(alumno => {
            const row = `<tr>
                        <td>${alumno.idAlumno}</td>
                        <td>${alumno.nombre}</td>
                        <td>${alumno.apPaterno}</td>
                        <td>${alumno.apMaterno}</td>
                        <td>${alumno.curp}</td>
                        <td>${alumno.fechaNacimiento}</td>
                        <td>${alumno.estado}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="modificarEstado(${alumno.IdAlumno})">Modificar Estado</button>
                            <button class="btn btn-secondary btn-sm" onclick="editarAlumno(${alumno.IdAlumno})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarAlumno(${alumno.IdAlumno})">Eliminar</button>
                        </td>
                     </tr>`;
            tableBody.innerHTML += row;
        });
    } else {
        console.log('La respuesta no es un arreglo:', alumnos);
    }
}

function modificarEstado(idAlumno) {
    // Lógica para modificar el estado del alumno
}

function editarAlumno(idAlumno) {
    // Lógica para editar el alumno
}

function eliminarAlumno(idAlumno) {
    // Lógica para eliminar el alumno
}

// Solicitar token y cargar alumnos al iniciar la página
window.onload = function() {
    solicitarToken();
    setTimeout(cargarAlumnos, 1000); // Esperar a que el token esté listo
};


function guardarAlumno() {
    const alumno = {
        idAlumno: 0, // Asumiendo que es un nuevo alumno y la API asigna el ID
        nombre: document.getElementById('nombre').value,
        apPaterno: document.getElementById('apPaterno').value,
        apMaterno: document.getElementById('apMaterno').value,
        curp: document.getElementById('curp').value,
        fechNac: document.getElementById('fechNac').value
    };

    fetch('http://localhost:50586/api/Alumnos/GuardarAlumno', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(alumno)
    })
    .then(response => response.json())
    .then(data => {
        if (data.code && data.code === 14) {
            // Manejar errores de validación
            let errores = data.respuesta.join('\n');
            alert('Errores de validación:\n' + errores);
        } else {
            // Procesar respuesta exitosa
            $('#modalNuevoAlumno').modal('hide');
            limpiarModalNuevoAlumno();
            cargarAlumnos();
        }
    })
    .catch(error => console.error('Error:', error));
}



function limpiarModalNuevoAlumno() {
    document.getElementById('nombre').value = '';
    document.getElementById('apPaterno').value = '';
    document.getElementById('apMaterno').value = '';
    document.getElementById('curp').value = '';
    document.getElementById('fechNac').value = '';
}

