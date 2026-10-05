// ==========================================
// MÓDULO DE INTERFAZ Y EVENTOS VISUALES
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // TIPO DE TERMINACIÓN
    // ==========================================

    const despido = document.getElementById("despido");
    const renuncia = document.getElementById("renuncia");
    const seccionRenuncia = document.getElementById("seccionRenuncia");
    const tipoCargo = document.getElementById("tipoCargo");
    const labelAviso = document.getElementById("labelAviso");
    const avisoSi = document.getElementById("avisoSi");
    const avisoNo = document.getElementById("avisoNo");
    const btnLimpiar = document.getElementById("btnLimpiar");

    function actualizarRenuncia() {
        if (!seccionRenuncia) return;

        if (renuncia && renuncia.checked) {
            seccionRenuncia.classList.remove("d-none");
        } else {
            seccionRenuncia.classList.add("d-none");

            if (avisoSi) avisoSi.checked = true;

            const mensaje = document.getElementById("mensajeSinAviso");
            if (mensaje) mensaje.remove();
        }

        actualizarAviso();
    }

    function actualizarAviso() {
        if (!tipoCargo || !labelAviso) return;

        if (tipoCargo.value === "jefatura") {
            labelAviso.textContent = "¿Avisó con al menos 30 días de anticipación?";
        } else {
            labelAviso.textContent = "¿Avisó con al menos 15 días de anticipación?";
        }

        mostrarMensajeAviso();
    }

    function mostrarMensajeAviso() {
        if (!seccionRenuncia || !renuncia || !renuncia.checked) return;

        let mensaje = document.getElementById("mensajeSinAviso");

        if (avisoNo && avisoNo.checked) {

            if (!mensaje) {
                mensaje = document.createElement("div");
                mensaje.id = "mensajeSinAviso";
                seccionRenuncia.appendChild(mensaje);
            }

            mensaje.className = "alert alert-warning mt-3 mb-0";
            mensaje.innerHTML = `
                <div class="d-flex align-items-start gap-2">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <div>
                        <strong>No se dio el aviso previo.</strong>
                        <div class="small mt-1">
                            La calculadora tomará esta información en cuenta al realizar
                            el cálculo correspondiente a la renuncia.
                        </div>
                    </div>
                </div>
            `;

        } else if (mensaje) {
            mensaje.remove();
        }
    }

    if (despido && renuncia) {
        despido.addEventListener("change", actualizarRenuncia);
        renuncia.addEventListener("change", actualizarRenuncia);
    }

    if (tipoCargo) {
        tipoCargo.addEventListener("change", actualizarAviso);
    }

    if (avisoSi) {
        avisoSi.addEventListener("change", mostrarMensajeAviso);
    }

    if (avisoNo) {
        avisoNo.addEventListener("change", mostrarMensajeAviso);
    }

    actualizarRenuncia();
    actualizarAviso();


    // ==========================================
    // DÍAS DE ASUETO
    // ==========================================

    const diasAsuetoLista = [
        { id: "asueto_1enero", nombre: "1 de enero (Año Nuevo)" },
        { id: "asueto_jueves_santo", nombre: "Jueves Santo" },
        { id: "asueto_viernes_santo", nombre: "Viernes Santo" },
        { id: "asueto_sabado_santo", nombre: "Sábado Santo" },
        { id: "asueto_1mayo", nombre: "1 de mayo (Día del Trabajo)" },
        { id: "asueto_10mayo", nombre: "10 de mayo (Día de las Madres)" },
        { id: "asueto_17junio", nombre: "17 de junio (Día del Padre)" },
        { id: "asueto_3agosto_ss", nombre: "3 de agosto (San Salvador)" },
        { id: "asueto_5agosto_ss", nombre: "5 de agosto (San Salvador)" },
        { id: "asueto_6agosto", nombre: "6 de agosto (Divino Salvador del Mundo)" },
        { id: "asueto_patronales_municipio", nombre: "Fiestas patronales del municipio" },
        { id: "asueto_15sep", nombre: "15 de septiembre (Independencia)" },
        { id: "asueto_2nov", nombre: "2 de noviembre (Día de los Difuntos)" },
        { id: "asueto_21nov", nombre: "21 de noviembre (Fiestas de San Miguel)" },
        { id: "asueto_25dic", nombre: "25 de diciembre (Navidad)" }
    ];

    const contenedorAsuetos = document.getElementById("listaAsuetosCheck");
    const seccionAsuetos = document.getElementById("seccionAsuetos");
    const radioAsuetoSi = document.getElementById("asuetoSi");
    const radioAsuetoNo = document.getElementById("asuetoNo");
    const inputTotalDiasAsueto = document.getElementById("inputTotalDiasAsueto");

    function crearListaAsuetos() {
        if (!contenedorAsuetos) return;

        contenedorAsuetos.innerHTML = "";

        diasAsuetoLista.forEach(function (dia) {

            const col = document.createElement("div");
            col.className = "col-md-6";

            const formCheck = document.createElement("div");
            formCheck.className = "form-check";

            const checkbox = document.createElement("input");
            checkbox.className = "form-check-input asueto-check";
            checkbox.type = "checkbox";
            checkbox.id = dia.id;
            checkbox.value = dia.nombre;

            const label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = dia.id;
            label.textContent = dia.nombre;

            if (dia.id === "asueto_21nov") {
                label.classList.add("fw-bold", "text-primary");
            }

            formCheck.appendChild(checkbox);
            formCheck.appendChild(label);
            col.appendChild(formCheck);
            contenedorAsuetos.appendChild(col);

            checkbox.addEventListener("change", actualizarContadorAsuetos);
        });
    }

    function actualizarContadorAsuetos() {
        const marcados = document.querySelectorAll(".asueto-check:checked").length;

        if (inputTotalDiasAsueto) {
            inputTotalDiasAsueto.value = marcados;
        }

        actualizarMensajeAsuetos(marcados);
    }

    function actualizarMensajeAsuetos(cantidad) {

        const mensajeAnterior = document.getElementById("mensajeCantidadAsuetos");

        if (mensajeAnterior) {
            mensajeAnterior.remove();
        }

        if (!seccionAsuetos || cantidad === 0) return;

        const mensaje = document.createElement("div");
        mensaje.id = "mensajeCantidadAsuetos";
        mensaje.className = "alert alert-success py-2 mt-3 mb-0";
        mensaje.innerHTML = `
            <small>
                <i class="bi bi-check-circle-fill me-1"></i>
                Has seleccionado <strong>${cantidad}</strong> día(s) de asueto.
            </small>
        `;

        seccionAsuetos.appendChild(mensaje);
    }

    if (radioAsuetoSi && radioAsuetoNo) {

        radioAsuetoSi.addEventListener("change", function () {
            if (radioAsuetoSi.checked && seccionAsuetos) {
                seccionAsuetos.classList.remove("d-none");
            }
        });

        radioAsuetoNo.addEventListener("change", function () {

            if (radioAsuetoNo.checked && seccionAsuetos) {

                seccionAsuetos.classList.add("d-none");

                document.querySelectorAll(".asueto-check").forEach(function (checkbox) {
                    checkbox.checked = false;
                });

                if (inputTotalDiasAsueto) {
                    inputTotalDiasAsueto.value = 0;
                }

                actualizarMensajeAsuetos(0);
            }
        });
    }

    crearListaAsuetos();


    // ==========================================
    // HORAS EXTRAS PENDIENTES
    // ==========================================

    const radioSiHP = document.getElementById("horasNoPagadasSi");
    const radioNoHP = document.getElementById("horasNoPagadasNo");
    const seccionFechaHP = document.getElementById("seccionFechaHoraExtra");
    const seccionCantidadHP = document.getElementById("seccionCantidadExtra");

    function toggleHorasPendientes() {

        const mostrar = radioSiHP && radioSiHP.checked;

        if (seccionFechaHP) {
            seccionFechaHP.classList.toggle("d-none", !mostrar);
        }

        if (seccionCantidadHP) {
            seccionCantidadHP.classList.toggle("d-none", !mostrar);
        }
    }

    if (radioSiHP) {
        radioSiHP.addEventListener("change", toggleHorasPendientes);
    }

    if (radioNoHP) {
        radioNoHP.addEventListener("change", toggleHorasPendientes);
    }

    toggleHorasPendientes();


    // ==========================================
    // VACACIONES
    // ==========================================

    const noGozadas = document.getElementById("noGozadas");
    const yaGozadas = document.getElementById("yaGozadas");
    const seccionFechaVacacion = document.getElementById("seccionFechaVacacion");

    function toggleVacaciones() {

        if (!seccionFechaVacacion) return;

        if (yaGozadas && yaGozadas.checked) {
            seccionFechaVacacion.classList.remove("d-none");
        } else {
            seccionFechaVacacion.classList.add("d-none");
        }
    }

    if (noGozadas) {
        noGozadas.addEventListener("change", toggleVacaciones);
    }

    if (yaGozadas) {
        yaGozadas.addEventListener("change", toggleVacaciones);
    }

    toggleVacaciones();

    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            const form = document.getElementById("calcForm");
            if (form) form.reset();
            const panel = document.getElementById("panelResultados");
            if (panel) panel.classList.add("d-none");
            actualizarRenuncia();
        });
    }

});