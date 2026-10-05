// ==========================================
// MÓDULO DE INTERFAZ Y EVENTOS VISUALES
// ==========================================
//cometario random de prueba
document.addEventListener("DOMContentLoaded", function () {

    function obtenerFechaActual() {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");

        return `${año}-${mes}-${dia}`;
    }

    function limitarFechaHastaHoy(input) {
        input.max = obtenerFechaActual();
        input.addEventListener("focus", function () {
            input.max = obtenerFechaActual();
        });
    }

    document.querySelectorAll('input[type="date"]').forEach(limitarFechaHastaHoy);

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
    const tablaHorasPendientes = document.getElementById("tablaHorasPendientes");
    const btnAgregarJornada = document.getElementById("btnAgregarJornada");

    function actualizarTotalesHorasPendientes() {
        const filas = document.querySelectorAll(".hora-extra-row");
        let totalDiurnas = 0;
        let totalNocturnas = 0;

        filas.forEach((fila) => {
            const fecha = fila.querySelector(".hora-extra-fecha")?.value;
            const inicio = fila.querySelector(".hora-extra-inicio")?.value;
            const fin = fila.querySelector(".hora-extra-fin")?.value;

            if (!fecha || !inicio || !fin) return;

            const resultado = calcularHorasExtrasPorRango(inicio, fin);
            const etiqueta = fila.querySelector(".hora-extra-clasificacion");
            const diurnasCell = fila.querySelector(".hora-extra-diurnas");
            const nocturnasCell = fila.querySelector(".hora-extra-nocturnas");

            if (!resultado.valida) {
                if (etiqueta) etiqueta.textContent = "Inválida";
                if (diurnasCell) diurnasCell.textContent = "0.00 h";
                if (nocturnasCell) nocturnasCell.textContent = "0.00 h";
                return;
            }

            if (etiqueta) etiqueta.textContent = resultado.clasificacion;
            if (diurnasCell) diurnasCell.textContent = `${resultado.horasDiurnas.toFixed(2)} h`;
            if (nocturnasCell) nocturnasCell.textContent = `${resultado.horasNocturnas.toFixed(2)} h`;

            totalDiurnas += resultado.horasDiurnas;
            totalNocturnas += resultado.horasNocturnas;
        });

        const totalGeneral = totalDiurnas + totalNocturnas;

        const diurnasEl = document.getElementById("totalHorasDiurnasPendientes");
        const nocturnasEl = document.getElementById("totalHorasNocturnasPendientes");
        const generalEl = document.getElementById("totalHorasPendientesGenerales");

        if (diurnasEl) diurnasEl.textContent = `${(radioSiHP && radioSiHP.checked ? totalDiurnas : 0).toFixed(2)} h`;
        if (nocturnasEl) nocturnasEl.textContent = `${(radioSiHP && radioSiHP.checked ? totalNocturnas : 0).toFixed(2)} h`;
        if (generalEl) generalEl.textContent = `${(radioSiHP && radioSiHP.checked ? totalGeneral : 0).toFixed(2)} h`;
    }

    function crearRegistroHoraExtra() {
        if (!tablaHorasPendientes) return;

        const fila = document.createElement("tr");
        fila.className = "hora-extra-row";
        fila.innerHTML = `
            <td><input type="date" class="form-control form-control-sm hora-extra-fecha" value="" max="${obtenerFechaActual()}"></td>
            <td><input type="time" class="form-control form-control-sm hora-extra-inicio" value=""></td>
            <td><input type="time" class="form-control form-control-sm hora-extra-fin" value=""></td>
            <td><span class="badge text-bg-light hora-extra-clasificacion">Pendiente</span></td>
            <td class="hora-extra-diurnas">0.00 h</td>
            <td class="hora-extra-nocturnas">0.00 h</td>
            <td><button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-jornada" aria-label="Eliminar jornada"><i class="bi bi-trash"></i></button></td>
        `;

        limitarFechaHastaHoy(fila.querySelector(".hora-extra-fecha"));

        const inputs = fila.querySelectorAll("input");
        inputs.forEach((input) => {
            input.addEventListener("input", actualizarTotalesHorasPendientes);
            input.addEventListener("change", actualizarTotalesHorasPendientes);
        });

        const btnEliminar = fila.querySelector(".btn-eliminar-jornada");
        if (btnEliminar) {
            btnEliminar.addEventListener("click", () => {
                fila.remove();
                actualizarTotalesHorasPendientes();
            });
        }

        tablaHorasPendientes.appendChild(fila);
        actualizarTotalesHorasPendientes();
    }

    function toggleHorasPendientes() {
        const mostrar = radioSiHP && radioSiHP.checked;

        if (seccionFechaHP) {
            seccionFechaHP.classList.toggle("d-none", !mostrar);
        }

        if (!mostrar) {
            const diurnasEl = document.getElementById("totalHorasDiurnasPendientes");
            const nocturnasEl = document.getElementById("totalHorasNocturnasPendientes");
            const generalEl = document.getElementById("totalHorasPendientesGenerales");

            if (diurnasEl) diurnasEl.textContent = "0.00 h";
            if (nocturnasEl) nocturnasEl.textContent = "0.00 h";
            if (generalEl) generalEl.textContent = "0.00 h";
        } else {
            actualizarTotalesHorasPendientes();
        }
    }

    if (radioSiHP) {
        radioSiHP.addEventListener("change", toggleHorasPendientes);
    }

    if (radioNoHP) {
        radioNoHP.addEventListener("change", toggleHorasPendientes);
    }

    if (btnAgregarJornada) {
        btnAgregarJornada.addEventListener("click", crearRegistroHoraExtra);
    }

    crearRegistroHoraExtra();
    toggleHorasPendientes();


    // ==========================================
    // VACACIONES
    // ==========================================

    const fechaUltimaVacacion =
        document.getElementById("fechaUltimaVacacion");

    // La fecha es obligatoria independientemente
    // de si existen vacaciones pendientes.
    if (fechaUltimaVacacion) {
        fechaUltimaVacacion.required = true;
    };

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