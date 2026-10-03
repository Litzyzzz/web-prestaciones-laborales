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
    const btnCalcular = document.getElementById("btnCalcular");


    // Función auxiliar simple para dar formato con comas y 2 decimales
    const formatearMoneda = (num) => {
            return Number(num || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };
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


    // ==========================================
    // CÁLCULO AUTOMÁTico DE AÑOS TRABAJADOS
    // ==========================================

    const fechaIngreso = document.getElementById("fechaIngreso");
    const fechaTerminacion = document.getElementById("fechaTerminacion");
    const anosLaborados = document.getElementById("anosLaborados");
    const mesesLaborados = document.getElementById("mesesLaborados");

    function calcularAntiguedad() {

        if (!fechaIngreso || !fechaTerminacion) return;
        if (!fechaIngreso.value || !fechaTerminacion.value) return;

        const inicio = new Date(fechaIngreso.value + "T00:00:00");
        const fin = new Date(fechaTerminacion.value + "T00:00:00");

        if (fin < inicio) {
            if (anosLaborados) anosLaborados.value = 0;
            if (mesesLaborados) mesesLaborados.value = 0;
            return;
        }

        let anos = fin.getFullYear() - inicio.getFullYear();
        let meses = fin.getMonth() - inicio.getMonth();

        if (fin.getDate() < inicio.getDate()) {
            meses--;
        }

        if (meses < 0) {
            anos--;
            meses += 12;
        }

        if (anosLaborados) {
            anosLaborados.value = Math.max(0, anos);
        }

        if (mesesLaborados) {
            mesesLaborados.value = Math.max(0, meses);
        }
    }

    if (fechaIngreso) {
        fechaIngreso.addEventListener("change", calcularAntiguedad);
    }

    if (fechaTerminacion) {
        fechaTerminacion.addEventListener("change", calcularAntiguedad);
    }

    // BOTÓN CALCULAR
    if (btnCalcular) {
        btnCalcular.addEventListener("click", () => {
            const SBM = parseFloat(document.getElementById("salarioMensual")?.value) || 0;
            const años = parseInt(anosLaborados?.value) || 0;
            const meses = parseInt(mesesLaborados?.value) || 0;
            const horasDiurnas = parseFloat(document.getElementById("horasDiurnas")?.value) || 0;
            const horasNocturnas = parseFloat(document.getElementById("horasNocturnas")?.value) || 0;
            const díasAsuetoTrabajados = parseInt(inputTotalDiasAsueto?.value) || 0;
            const díasDescansoTrabajados = parseInt(document.getElementById("diasDescanso")?.value) || 0;

            const radioTipoCierre = document.querySelector('input[name="tipoCierre"]:checked');
            const tipoCierre = radioTipoCierre ? radioTipoCierre.value : "despido";

            const fechaTerminacionStr = fechaTerminacion?.value || new Date().toISOString().split("T")[0];
            const fechaIngresoStr = fechaIngreso?.value || fechaTerminacionStr;
            const sectorEconomico = document.getElementById("sectorEconomico")?.value || "comercio";

            const SBD = calcularSBD(SBM);
            const HD = SBD / 8;
            const HD_Nocturna = calcularHN(HD);

            const totalHEsDiurnas = calcularHE(horasDiurnas, HD);
            const totalHEsNocturnas = calcularHE(horasNocturnas, HD_Nocturna);
            const totalAsueto = calcularSE(SBD) * díasAsuetoTrabajados;
            const totalDescanso = calcularSDD(SBD) * díasDescansoTrabajados;
            const totalRV = calcularRV(SBD, meses);
            const totalPA = calcularPA(SBD, años, fechaTerminacionStr, fechaIngresoStr);

            let totalIndemnización = 0;
            if (tipoCierre === "despido") {
                totalIndemnización = calcularIndemnizacionDespido(SBD, años, meses, SBM, sectorEconomico);
            } else if (tipoCierre === "renuncia") {
                const tipoCargoVal = tipoCargo?.value || "empleado";
                const radioAviso = document.querySelector('input[name="avisoPrevio"]:checked');
                const avisoPrevio = radioAviso ? radioAviso.value : "no";
                totalIndemnización = calcularIndemnizacionRenuncia(SBD, años, meses, sectorEconomico, tipoCargoVal, avisoPrevio);
            }

            const totalHorasExtras = totalHEsDiurnas + totalHEsNocturnas;
            const totalBruto = totalHorasExtras + totalAsueto + totalDescanso + totalRV + totalPA + totalIndemnización;
            const baseCotizable = SBM + totalHorasExtras + totalAsueto + totalDescanso + totalRV;

            const totalISSS = calcularISSS(baseCotizable);
            const totalAFP = calcularAFP(baseCotizable);
            const totalDeducciones = calcularTotalDeducciones(totalISSS, totalAFP);
            const netoPagar = calcularNetoPagar(totalBruto, totalDeducciones);

            // Mostrar resultados en pantalla con formato de comas y dos decimales
            document.getElementById("resVacacion").textContent = `$${formatearMoneda(totalRV)}`;
            document.getElementById("resAguinaldo").textContent = `$${formatearMoneda(totalPA)}`;
            document.getElementById("resIndemnizacion").textContent = `$${formatearMoneda(totalIndemnización)}`;
            document.getElementById("resHEsDiurnas").textContent = `$${formatearMoneda(totalHEsDiurnas)}`;
            document.getElementById("resHEsNocturnas").textContent = `$${formatearMoneda(totalHEsNocturnas)}`;
            document.getElementById("resAsueto").textContent = `$${formatearMoneda(totalAsueto)}`;
            document.getElementById("resDescanso").textContent = `$${formatearMoneda(totalDescanso)}`;
            document.getElementById("resTotal").textContent = `$${formatearMoneda(totalBruto)}`;
            document.getElementById("resISSS").textContent = `-$${formatearMoneda(totalISSS)}`;
            document.getElementById("resAFP").textContent = `-$${formatearMoneda(totalAFP)}`;
            
            const elResDeducciones = document.getElementById("resDeducciones");
            if (elResDeducciones) elResDeducciones.textContent = `-$${formatearMoneda(totalDeducciones)}`;

            document.getElementById("resNeto").textContent = `$${formatearMoneda(netoPagar)}`;

            document.getElementById("panelResultados").classList.remove("d-none");
        });
    }

    // BOTÓN DESCARGAR PDF OFICIAL

    const btnDescargarPDF = document.getElementById("btnDescargarPDF");

    if (btnDescargarPDF) {
        btnDescargarPDF.addEventListener("click", async () => {
            const nombreTrabajador = document.getElementById("nombreTrabajador")?.value || "No especificado";
            const salario = parseFloat(document.getElementById("salarioMensual")?.value) || 0;
            const cargoDesempenado = document.getElementById("cargoEspecifico")?.value || "No especificado";
            const nombrePatrono = document.getElementById("nombrePatrono")?.value || "No especificado";
            
            const anos = parseInt(document.getElementById("anosLaborados")?.value) || 0;
            const meses = parseInt(document.getElementById("mesesLaborados")?.value) || 0;
            
            const radioTipoCierre = document.querySelector('input[name="tipoCierre"]:checked');
            const tipoCierre = radioTipoCierre ? radioTipoCierre.value : "despido";
            const tipoCierreTexto = tipoCierre === "renuncia" ? "Renuncia voluntaria" : "Despido sin causa justificada";

            const fechaTerminacionVal = fechaTerminacion?.value || new Date().toLocaleDateString("es-SV");
            const fechaEmision = new Date().toLocaleDateString("es-SV");

            const limpiarMonto = (id) => {
                const texto = document.getElementById(id)?.textContent || "$0.00";
                return parseFloat(texto.replace(/[^0-9.-]+/g, "")) || 0;
            };

            const totalRV = limpiarMonto("resVacacion");
            const totalPA = limpiarMonto("resAguinaldo");
            const totalIndemnizacion = limpiarMonto("resIndemnizacion");
            const totalDiurnasMostrar = limpiarMonto("resHEsDiurnas");
            const totalNocturnasMostrar = limpiarMonto("resHEsNocturnas");
            const totalAsueto = limpiarMonto("resAsueto");
            const totalDescanso = limpiarMonto("resDescanso");
            const totalBruto = limpiarMonto("resTotal");
            const totalISSS = Math.abs(limpiarMonto("resISSS"));
            const totalAFP = Math.abs(limpiarMonto("resAFP"));
            const netoPagar = limpiarMonto("resNeto");

            // Crear contenedor temporal invisible con el formato de 2 páginas
            const contenedor = document.createElement("div");
            contenedor.style.position = "absolute";
            contenedor.style.left = "-9999px";
            contenedor.style.top = "0";
            contenedor.style.width = "800px";
            contenedor.style.background = "#ffffff";
            contenedor.style.padding = "40px";
            contenedor.style.fontFamily = "Arial, sans-serif";
            contenedor.style.fontSize = "12px";
            contenedor.style.color = "#000000";

            contenedor.innerHTML = `
                <!-- PÁGINA 1 -->
                <div style="width: 720px; height: 1050px; padding-bottom: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="font-weight: bold; text-transform: uppercase; font-size: 16px; margin-bottom: 5px;">COMPROBANTE DE LIQUIDACION DE PRESTACIONES LABORALES</h3>
                            <p style="color: #6c757d; margin: 0; font-size: 12px;">Republica de El Salvador</p>
                        </div>

                        <div style="background-color: #f8f9fa; font-weight: bold; padding: 6px 10px; border-left: 4px solid #0d6efd; margin-top: 15px; margin-bottom: 10px; font-size: 13px;">I. Datos de las partes</div>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px;">
                            <tr>
                                <td style="width: 25%; padding: 5px;"><strong>Persona trabajadora:</strong></td>
                                <td style="width: 25%; padding: 5px;">${nombreTrabajador}</td>
                                <td style="width: 25%; padding: 5px;"><strong>Patrono:</strong></td>
                                <td style="width: 25%; padding: 5px;">${nombrePatrono}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><strong>Cargo desempeñado:</strong></td>
                                <td style="padding: 5px;">${cargoDesempenado}</td>
                                <td style="padding: 5px;"><strong>Salario mensual:</strong></td>
                                <td style="padding: 5px;">$${formatearMoneda(salario)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><strong>Antigüedad reconocida:</strong></td>
                                <td style="padding: 5px;">${anos} años, ${meses} meses</td>
                                <td style="padding: 5px;"><strong>Fecha de terminación:</strong></td>
                                <td style="padding: 5px;">${fechaTerminacionVal}</td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td style="padding: 5px;"><strong>Causa de terminación:</strong></td>
                                <td style="padding: 5px;">${tipoCierreTexto}</td>
                            </tr>
                        </table>

                        <div style="background-color: #f8f9fa; font-weight: bold; padding: 6px 10px; border-left: 4px solid #0d6efd; margin-top: 15px; margin-bottom: 10px; font-size: 13px;">II. Desglose de prestaciones liquidadas</div>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px;" border="1" cellpadding="6" cellspacing="0">
                            <thead>
                                <tr style="background-color: #f8f9fa;">
                                    <th style="text-align: left;">Concepto</th>
                                    <th style="text-align: left;">Base legal</th>
                                    <th style="text-align: right;">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Vacación proporcional</td><td>Arts. 177 y 187 CT</td><td style="text-align: right;">$${formatearMoneda(totalRV)}</td></tr>
                                <tr><td>Aguinaldo proporcional</td><td>Arts. 196-198 CT</td><td style="text-align: right;">$${formatearMoneda(totalPA)}</td></tr>
                                <tr><td>Indemnización / compensación</td><td>Art. 58 CT</td><td style="text-align: right;">$${formatearMoneda(totalIndemnizacion)}</td></tr>
                                <tr><td>Horas extras diurnas</td><td>Art. 169 CT</td><td style="text-align: right;">$${formatearMoneda(totalDiurnasMostrar)}</td></tr>
                                <tr><td>Horas extras nocturnas</td><td>Arts. 168 y 169 CT</td><td style="text-align: right;">$${formatearMoneda(totalNocturnasMostrar)}</td></tr>
                                <tr><td>Días de asueto laborados</td><td>Art. 192 CT</td><td style="text-align: right;">$${formatearMoneda(totalAsueto)}</td></tr>
                                <tr><td>Días de descanso semanal laborados</td><td>Arts. 175 y 176 CT</td><td style="text-align: right;">$${formatearMoneda(totalDescanso)}</td></tr>
                                <tr style="background-color: #343a40; color: #fff;">
                                    <td colspan="2"><strong>TOTAL DEVENGADO (BRUTO)</strong></td>
                                    <td style="text-align: right;"><strong>$${formatearMoneda(totalBruto)}</strong></td>
                                </tr>
                            </tbody>
                        </table>

                        <div style="background-color: #f8f9fa; font-weight: bold; padding: 6px 10px; border-left: 4px solid #0d6efd; margin-top: 15px; margin-bottom: 10px; font-size: 13px;">III. Deducciones de ley y neto a pagar</div>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 12px;" border="1" cellpadding="6" cellspacing="0">
                            <tbody>
                                <tr><td>Cotización ISSS (trabajador)</td><td>Reglamento del ISSS, Art. 29</td><td style="text-align: right; color: #dc3545;">-$${formatearMoneda(totalISSS)}</td></tr>
                                <tr><td>Cotización AFP (trabajador)</td><td>Ley del Sistema de Ahorro para Pensiones</td><td style="text-align: right; color: #dc3545;">-$${formatearMoneda(totalAFP)}</td></tr>
                                <tr style="background-color: #d1e7dd;">
                                    <td colspan="2"><strong>MONTO NETO A PAGAR</strong></td>
                                    <td style="text-align: right;"><strong>$${formatearMoneda(netoPagar)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="text-align: right; color: #6c757d; font-size: 11px;">Generado el ${fechaEmision} — 1/2</div>
                </div>

                <!-- PÁGINA 2 -->
                <div style="width: 720px; height: 1050px; padding-top: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; page-break-before: always;">
                    <div>
                        <div style="text-align: center; margin-bottom: 25px;">
                            <h3 style="font-weight: bold; text-transform: uppercase; font-size: 16px; margin-bottom: 5px;">COMPROBANTE DE LIQUIDACION DE PRESTACIONES LABORALES</h3>
                            <p style="color: #6c757d; margin: 0; font-size: 12px;">Republica de El Salvador</p>
                        </div>

                        <div style="background-color: #f8f9fa; font-weight: bold; padding: 6px 10px; border-left: 4px solid #0d6efd; margin-top: 15px; margin-bottom: 15px; font-size: 13px;">IV. Declaración</div>
                        <p style="text-align: justify; line-height: 1.6; margin-bottom: 40px; font-size: 12px;">
                            La persona trabajadora <strong>${nombreTrabajador}</strong> declara haber recibido el detalle de las prestaciones económicas que anteceden, calculadas conforme al Código de Trabajo de El Salvador, así como el desglose de las retenciones de ley aplicadas y el monto neto resultante. Este comprobante se suscribe en la fecha que se indica al pie de las firmas.
                        </p>

                        <div style="display: flex; justify-content: space-between; margin-top: 60px; margin-bottom: 40px; font-size: 12px;">
                            <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 8px;">
                                <strong>Persona trabajadora</strong><br>
                                Nombre: __________________<br>
                                DUI: _____________________<br>
                                Fecha: ___________________
                            </div>
                            <div style="width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 8px;">
                                <strong>Patrono o representante legal</strong><br>
                                Nombre: __________________<br>
                                DUI: _____________________<br>
                                Fecha: ___________________
                            </div>
                        </div>

                        <div style="font-size: 11px; color: #333; text-align: justify; border-top: 1px solid #ccc; padding-top: 12px; margin-top: 40px; line-height: 1.4;">
                            <strong>Advertencia legal:</strong> Este documento es un comprobante informativo del cálculo de prestaciones y NO constituye el finiquito laboral. Conforme al Art. 402 inciso 2 del Código de Trabajo, la renuncia, la terminación por mutuo consentimiento o el recibo de pago de prestaciones por despido sin causa legal solo tienen valor probatorio si constan en hojas extendidas por la Dirección General de Inspección de Trabajo o por los jueces con competencia en materia laboral, utilizadas dentro de los diez días siguientes a su expedición, o bien en documento privado autenticado ante notario. Se recomienda asesoría legal profesional antes de suscribir cualquier finiquito.
                        </div>
                    </div>
                    <div style="text-align: right; color: #6c757d; font-size: 11px;">Generado el ${fechaEmision} — 2/2</div>
                </div>
            `;

            document.body.appendChild(contenedor);

            try {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');

                const canvas = await html2canvas(contenedor, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/jpeg', 0.98);

                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('Comprobante_Liquidacion_Laboral.pdf');
            } catch (error) {
                console.error("Error al generar el PDF:", error);
                alert("Ocurrió un error al generar el archivo PDF.");
            } finally {
                document.body.removeChild(contenedor);
            }
        });
    }

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