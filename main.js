document.addEventListener("DOMContentLoaded", () => {

    const fechaIngreso = document.getElementById("fechaIngreso");
    const fechaTerminacion = document.getElementById("fechaTerminacion");
    const anosLaboradosInput = document.getElementById("anosLaborados");
    const mesesLaboradosInput = document.getElementById("mesesLaborados");
    const btnCalcular = document.getElementById("btnCalcular");

    // Función auxiliar para dar formato de moneda
    const formatearMoneda = (num) => {
        return Number(num || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    function actualizarAntigüedadAutomatica() {
        if (
            fechaIngreso &&
            fechaTerminacion &&
            fechaIngreso.value &&
            fechaTerminacion.value
        ) {
            const resultado = calcularAntigüedadFechas(
                fechaIngreso.value,
                fechaTerminacion.value
            );

            if (anosLaboradosInput) {
                anosLaboradosInput.value = resultado.años;
            }

            if (mesesLaboradosInput) {
                mesesLaboradosInput.value = resultado.meses;
            }
        }
    }

    if (fechaIngreso && fechaTerminacion) {
        fechaIngreso.addEventListener("change", actualizarAntigüedadAutomatica);
        fechaTerminacion.addEventListener("change", actualizarAntigüedadAutomatica);
    }

    if (btnCalcular) {
        btnCalcular.addEventListener("click", () => {

            // DATOS DEL FORMULARIO
            const SBM = parseFloat(document.getElementById("salarioMensual")?.value) || 0;
            const añosLaborados = parseInt(anosLaboradosInput?.value) || 0;
            const mesesLaborados = parseInt(mesesLaboradosInput?.value) || 0;
            const díasAsuetoTrabajados = parseInt(document.getElementById("inputTotalDiasAsueto")?.value) || 0;
            const díasDescansoTrabajados = parseInt(document.getElementById("diasDescanso")?.value) || 0;

            // TIPO DE CIERRE
            const radioTipoCierre = document.querySelector('input[name="tipoCierre"]:checked');
            const tipoCierre = radioTipoCierre ? radioTipoCierre.value : "despido";

            // FECHAS
            const fechaTerminacionStr = fechaTerminacion?.value || new Date().toISOString().split("T")[0];
            const fechaIngresoStr = fechaIngreso?.value || fechaTerminacionStr;

            // SECTOR ECONÓMICO
            const sectorEconomico = document.getElementById("sectorEconomico")?.value || "comercio";

            // SALARIO BÁSICO DIARIO
            const SBD = calcularSBD(SBM);

            // VALOR DE HORA DIURNA Y NOCTURNA
            const HD = calcularHD(SBD);
            const HN = calcularHN(HD);

            // HORAS EXTRAS PENDIENTES POR JORNADA
            let totalHorasDiurnasPendientes = 0;
            let totalHorasNocturnasPendientes = 0;
            const radioHorasNoPagadasSi = document.getElementById("horasNoPagadasSi");

            if (radioHorasNoPagadasSi && radioHorasNoPagadasSi.checked) {
                document.querySelectorAll(".hora-extra-row").forEach((fila) => {
                    const fecha = fila.querySelector(".hora-extra-fecha")?.value;
                    const inicio = fila.querySelector(".hora-extra-inicio")?.value;
                    const fin = fila.querySelector(".hora-extra-fin")?.value;

                    if (!fecha || !inicio || !fin) return;

                    const resultado = calcularHorasExtrasPorRango(inicio, fin);
                    if (!resultado.valida) return;

                    totalHorasDiurnasPendientes += resultado.horasDiurnas;
                    totalHorasNocturnasPendientes += resultado.horasNocturnas;
                });
            }

            const montoHEDiurnas = calcularHE(totalHorasDiurnasPendientes, HD);
            const montoHENocturnas = calcularHE(totalHorasNocturnasPendientes, HN);
            const totalHorasExtrasPendientes = montoHEDiurnas + montoHENocturnas;

            // DÍAS DE ASUETO Y DESCANSO
            const totalAsueto = calcularSE(SBD) * díasAsuetoTrabajados;
            const totalDescanso = calcularSDD(SBD) * díasDescansoTrabajados;

            // VACACIONES Y AGUINALDO
            const totalRV = calcularRV(SBD, mesesLaborados);
            const totalPA = calcularPA(SBD, añosLaborados, fechaTerminacionStr, fechaIngresoStr);

            // INDEMNIZACIÓN
            let totalIndemnización = 0;

            if (tipoCierre === "despido") {
                totalIndemnización = calcularIndemnizacionDespido(
                    SBD,
                    añosLaborados,
                    mesesLaborados,
                    sectorEconomico
                );
            } else if (tipoCierre === "renuncia") {
                const tipoCargo = document.getElementById("tipoCargo")?.value || "operativo";
                const radioAviso = document.querySelector('input[name="avisoPrevio"]:checked');
                const dioAvisoPrevio = radioAviso ? radioAviso.value : "no";

                totalIndemnización = calcularIndemnizacionRenuncia(
                    SBD,
                    añosLaborados,
                    mesesLaborados,
                    sectorEconomico,
                    tipoCargo,
                    dioAvisoPrevio
                );
            }

            // TOTALES Y DEDUCCIONES
            const totalHorasExtras =  totalHEsPendientesDiurnas + totalHEsPendientesNocturnas;
            const totalBruto = totalHorasExtras + totalAsueto + totalDescanso + totalRV + totalPA + totalIndemnización;
            const baseCotizable = SBM + totalHorasExtras + totalAsueto + totalDescanso + totalRV;

            const totalISSS = calcularISSS(baseCotizable);
            const totalAFP = calcularAFP(baseCotizable);
            const totalDeducciones = calcularTotalDeducciones(totalISSS, totalAFP);
            const netoPagar = calcularNetoPagar(totalBruto, totalDeducciones);

            // ACTUALIZAR INTERFAZ CON RESULTADOS
            document.getElementById("resVacacion").textContent = `$${formatearMoneda(totalRV)}`;
            document.getElementById("resAguinaldo").textContent = `$${formatearMoneda(totalPA)}`;
            document.getElementById("resIndemnizacion").textContent = `$${formatearMoneda(totalIndemnización)}`;

            const totalDiurnasMostrar =  totalHEsPendientesDiurnas;
            document.getElementById("resHEsDiurnas").textContent = `$${formatearMoneda(totalDiurnasMostrar)}`;

            const totalNocturnasMostrar =  totalHEsPendientesNocturnas;
            document.getElementById("resHEsNocturnas").textContent = `$${formatearMoneda(totalNocturnasMostrar)}`;

            document.getElementById("resAsueto").textContent = `$${formatearMoneda(totalAsueto)}`;
            document.getElementById("resDescanso").textContent = `$${formatearMoneda(totalDescanso)}`;
            document.getElementById("resTotal").textContent = `$${formatearMoneda(totalBruto)}`;
            document.getElementById("resISSS").textContent = `-$${formatearMoneda(totalISSS)}`;
            document.getElementById("resAFP").textContent = `-$${formatearMoneda(totalAFP)}`;

            const elResDeducciones = document.getElementById("resDeducciones");
            if (elResDeducciones) elResDeducciones.textContent = `-$${formatearMoneda(totalDeducciones)}`;

            document.getElementById("resNeto").textContent = `$${formatearMoneda(netoPagar)}`;

            // MOSTRAR PANEL
            document.getElementById("panelResultados").classList.remove("d-none");
        });
    }

    // ACTIVAR TOOLTIPS
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(elemento => {
        new bootstrap.Tooltip(elemento);
    });

    // ==========================================
    // GENERACIÓN DE REPORTE PDF
    // ==========================================
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

            const fechaTerminacionVal = document.getElementById("fechaTerminacion")?.value || new Date().toLocaleDateString("es-SV");
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
                <div style="width: 720px; height: 1050px; padding-bottom: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="font-weight: bold; text-transform: uppercase; font-size: 16px; margin-bottom: 5px;">COMPROBANTE DE LIQUIDACION DE PRESTACIONES LABORALES</h3>
                            <p style="color: #6c757d; margin: 0; font-size: 12px;">República de El Salvador</p>
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

                <div style="width: 720px; height: 1050px; padding-top: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; page-break-before: always;">
                    <div>
                        <div style="text-align: center; margin-bottom: 25px;">
                            <h3 style="font-weight: bold; text-transform: uppercase; font-size: 16px; margin-bottom: 5px;">COMPROBANTE DE LIQUIDACION DE PRESTACIONES LABORALES</h3>
                            <p style="color: #6c757d; margin: 0; font-size: 12px;">República de El Salvador</p>
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
});