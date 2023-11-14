let jwtToken = '';

function solicitarToken() {
    return fetch('http://localhost:50586/api/Autenticacion/Token', {
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
        return Promise.resolve();
    })
    .catch(error => {
        console.error('Error al solicitar el token:', error);
        return Promise.reject(error);
    });
}


async function cargarAlumnos() {
    await solicitarToken();

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
            const colorFila = alumno.estado === 'Activo' ? 'table-success' : 'table-danger';
            const row = `<tr class="${colorFila}">
                        <td>${alumno.idAlumno}</td>
                        <td>${alumno.nombre}</td>
                        <td>${alumno.apPaterno}</td>
                        <td>${alumno.apMaterno}</td>
                        <td>${alumno.curp}</td>
                        <td>${alumno.fechaNacimiento}</td>
                        <td>${alumno.estado}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="modificarEstado(${alumno.idAlumno})">Modificar Estado</button>
                            <button class="btn btn-secondary btn-sm" onclick="editarAlumno(${alumno.idAlumno})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarAlumno(${alumno.idAlumno})">Eliminar</button>
                        </td>
                     </tr>`;
            tableBody.innerHTML += row;
        });
    } else {
        console.log('La respuesta no es un arreglo:', alumnos);
    }
}




function editarAlumno(idAlumno) {
    // Lógica para editar el alumno
}

function eliminarAlumno(idAlumno) {
    // Lógica para eliminar el alumno
}

// Solicitar token y cargar alumnos al iniciar la página
window.onload = async function() {
    await cargarAlumnos();
};


async function guardarAlumno() {

    await solicitarToken();

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


async function modificarEstado(idAlumno) {
    await solicitarToken();

    const datos = {
        idAlumno: idAlumno,
        curp: "" // Parece que este campo no es necesario para este endpoint
    };

    fetch('http://localhost:50586/api/Alumnos/CambiaEstadoAlumno', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.codigo && data.codigo === "00") {
            // Si la respuesta es exitosa, recargar la lista de alumnos
            cargarAlumnos();
        } else {
            // Manejar otras respuestas o errores
            alert("Error al modificar el estado del alumno.");
        }
    })
    .catch(error => console.error('Error:', error));
}


