document.addEventListener('DOMContentLoaded', () => {
    const radiosCierre = document.querySelectorAll('input[name="tipoCierre"]');
    const seccionRenuncia = document.getElementById('seccionRenuncia');
    const tipoCargo = document.getElementById('tipoCargo');
    const labelAviso = document.getElementById('labelAviso');
    const radiosVacacion = document.querySelectorAll('input[name="estadoVacacion"]');
    const seccionFechaVacacion = document.getElementById('seccionFechaVacacion');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const calcForm = document.getElementById('calcForm');
    const panelResultados = document.getElementById('panelResultados');

    // Cambios según tipo de cierre (Despido vs Renuncia)
    radiosCierre.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'renuncia') {
                seccionRenuncia.classList.remove('d-none');
            } else {
                seccionRenuncia.classList.add('d-none');
            }
        });
    });

    // Ajuste del texto de aviso previo según el cargo
    tipoCargo.addEventListener('change', (e) => {
        if (e.target.value === 'jefatura') {
            labelAviso.textContent = '¿Dio aviso con al menos 30 días de anticipación?';
        } else {
            labelAviso.textContent = '¿Dio aviso con al menos 15 días de anticipación?';
        }
    });

    // Cambios según estado de vacaciones
    radiosVacacion.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'ya_gozadas') {
                seccionFechaVacacion.classList.remove('d-none');
            } else {
                seccionFechaVacacion.classList.add('d-none');
            }
        });
    });

    // Botón Limpiar formulario
    btnLimpiar.addEventListener('click', () => {
        calcForm.reset();
        panelResultados.classList.add('d-none');
        seccionRenuncia.classList.add('d-none');
        seccionFechaVacacion.classList.add('d-none');
    });
});