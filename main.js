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
            const totalBruto = totalHorasExtrasPendientes + totalAsueto + totalDescanso + totalRV + totalPA + totalIndemnización;
            const baseCotizable = SBM + totalHorasExtrasPendientes + totalAsueto + totalDescanso + totalRV;

            const totalISSS = calcularISSS(baseCotizable);
            const totalAFP = calcularAFP(baseCotizable);
            const totalDeducciones = calcularTotalDeducciones(totalISSS, totalAFP);
            const netoPagar = calcularNetoPagar(totalBruto, totalDeducciones);

            // ACTUALIZAR INTERFAZ CON RESULTADOS
            document.getElementById("resVacacion").textContent = `$${formatearMoneda(totalRV)}`;
            document.getElementById("resAguinaldo").textContent = `$${formatearMoneda(totalPA)}`;
            document.getElementById("resIndemnizacion").textContent = `$${formatearMoneda(totalIndemnización)}`;

            document.getElementById("resHEsDiurnas").textContent = `$${formatearMoneda(montoHEDiurnas)}`;
            document.getElementById("resHEsNocturnas").textContent = `$${formatearMoneda(montoHENocturnas)}`;

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
        btnDescargarPDF.addEventListener("click", () => {
            const nombreTrabajador = document.getElementById("nombreTrabajador")?.value || "No especificado";
            const nombrePatrono = document.getElementById("nombrePatrono")?.value || "No especificado";
            const salario = parseFloat(document.getElementById("salarioMensual")?.value) || 0;
            const cargoDesempenado = document.getElementById("tipoCargo")?.value || "No especificado";

            const anos = parseInt(document.getElementById("anosLaborados")?.value) || 0;
            const meses = parseInt(document.getElementById("mesesLaborados")?.value) || 0;

            const radioTipoCierre = document.querySelector('input[name="tipoCierre"]:checked');
            const tipoCierre = radioTipoCierre ? radioTipoCierre.value : "despido";
            const tipoCierreTexto = tipoCierre === "renuncia" ? "Renuncia voluntaria" : "Despido injustificado";

            const ventanaPDF = window.open("", "_blank", "width=900,height=700");

            if (!ventanaPDF) {
                alert("El navegador bloqueó la ventana emergente. Permite ventanas emergentes para generar el reporte.");
                return;
            }

            ventanaPDF.document.write(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reporte de Liquidación Laboral</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    <style>
                        body { font-family: Arial, sans-serif; background: #ffffff; color: #333; padding: 40px; }
                        .reporte { max-width: 900px; margin: auto; }
                        .header-title { font-weight: bold; color: #0d6efd; }
                        .subtitulo { color: #6c757d; }
                        .datos { border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-top: 25px; }
                        .table th { background-color: #f8f9fa !important; }
                        .total-bruto { font-size: 18px; }
                        .deducciones { color: #dc3545; }
                        .neto { background-color: #198754; color: white; font-size: 20px; font-weight: bold; }
                        .nota { font-size: 12px; color: #6c757d; margin-top: 30px; }
                        .botones { margin-top: 30px; }
                        @media print {
                            body { padding: 0; }
                            .botones { display: none !important; }
                            .reporte { max-width: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="reporte">
                        <div class="text-center">
                            <h3 class="header-title mb-1">CÁLCULO DE PRESTACIONES LABORALES</h3>
                            <p class="subtitulo mb-2">El Salvador</p>
                            <p class="text-muted">Reporte de liquidación laboral</p>
                        </div>
                        <hr>
                        <div class="datos">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Trabajador(a):</strong> ${nombreTrabajador}</p>
                                    <p><strong>Salario mensual:</strong> $${formatearMoneda(salario)}</p>
                                    <p><strong>Antigüedad:</strong> ${anos} años, ${meses} meses</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Patrono:</strong> ${nombrePatrono}</p>
                                    <p><strong>Cargo:</strong> ${cargoDesempenado}</p>
                                    <p><strong>Tipo de terminación:</strong> ${tipoCierreTexto}</p>
                                </div>
                            </div>
                        </div>
                        <h5 class="mt-4 mb-3">Desglose de prestaciones</h5>
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <td><strong>Horas extras diurnas</strong></td>
                                    <td class="text-end">${document.getElementById("resHEsDiurnas")?.textContent || "$0.00"}</td>
                                </tr>
                                <tr>
                                    <td><strong>Horas extras nocturnas</strong></td>
                                    <td class="text-end">${document.getElementById("resHEsNocturnas")?.textContent || "$0.00"}</td>
                                </tr>
                                <tr>
                                    <td><strong>Días de asueto</strong></td>
                                    <td class="text-end">${document.getElementById("resAsueto")?.textContent || "$0.00"}</td>
                                </tr>
                                <tr>
                                    <td><strong>Días de descanso</strong></td>
                                    <td class="text-end">${document.getElementById("resDescanso")?.textContent || "$0.00"}</td>
                                </tr>
                                <tr>
                                    <td><strong>Vacación proporcional</strong></td>
                                    <td class="text-end">${document.getElementById("resVacacion")?.textContent || "$0.00"}</td>
                                </tr>
                                <tr>
                                    <td><strong>Aguinaldo proporcional</strong></td>
                                    <td class="text-end">${document.getElementById("resAguinaldo")?.textContent || "$0.00"}</td>
                                </tr>
                                <tr>
                                    <td><strong>Indemnización / compensación</strong></td>
                                    <td class="text-end">${document.getElementById("resIndemnizacion")?.textContent || "$0.00"}</td>
                                </tr>
                                <tr class="table-dark">
                                    <td><strong>TOTAL BRUTO</strong></td>
                                    <td class="text-end total-bruto"><strong>${document.getElementById("resTotal")?.textContent || "$0.00"}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                        <h5 class="mt-4 mb-3">Deducciones</h5>
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>ISSS</td>
                                    <td class="text-end deducciones">${document.getElementById("resISSS")?.textContent || "-$0.00"}</td>
                                </tr>
                                <tr>
                                    <td>AFP</td>
                                    <td class="text-end deducciones">${document.getElementById("resAFP")?.textContent || "-$0.00"}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total de deducciones</strong></td>
                                    <td class="text-end deducciones"><strong>${document.getElementById("resDeducciones")?.textContent || "-$0.00"}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="neto rounded p-3 mt-4">
                            <div class="d-flex justify-content-between">
                                <span>NETO A PAGAR</span>
                                <span>${document.getElementById("resNeto")?.textContent || "$0.00"}</span>
                            </div>
                        </div>
                        <p class="text-end text-muted mt-4">Fecha de emisión: ${new Date().toLocaleDateString("es-SV")}</p>
                        <div class="nota">
                            <strong>Nota:</strong> Este documento presenta una estimación basada en los datos proporcionados por el usuario. No constituye una liquidación laboral oficial.
                        </div>
                        <div class="botones text-center">
                            <button class="btn btn-primary me-2" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
                            <button class="btn btn-secondary" onclick="window.close()">Cerrar</button>
                        </div>
                    </div>
                </body>
                </html>
            `);

            ventanaPDF.document.close();
        });
    }
});