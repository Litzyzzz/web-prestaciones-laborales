
document.addEventListener("DOMContentLoaded", () => {


    const fechaIngreso =
        document.getElementById("fechaIngreso");

    const fechaTerminacion =
        document.getElementById("fechaTerminacion");

    const anosLaboradosInput =
        document.getElementById("anosLaborados");

    const mesesLaboradosInput =
        document.getElementById("mesesLaborados");

    const btnCalcular =
        document.getElementById("btnCalcular");
        

    function actualizarAntigüedadAutomatica() {

        if (
            fechaIngreso &&
            fechaTerminacion &&
            fechaIngreso.value &&
            fechaTerminacion.value
        ) {

            const resultado =
                calcularAntigüedadFechas(
                    fechaIngreso.value,
                    fechaTerminacion.value
                );

            if (anosLaboradosInput) {
                anosLaboradosInput.value =
                    resultado.años;
            }

            if (mesesLaboradosInput) {
                mesesLaboradosInput.value =
                    resultado.meses;
            }
        }
    }


    if (fechaIngreso && fechaTerminacion) {

        fechaIngreso.addEventListener(
            "change",
            actualizarAntigüedadAutomatica
        );

        fechaTerminacion.addEventListener(
            "change",
            actualizarAntigüedadAutomatica
        );
    }

    if (btnCalcular) {

        btnCalcular.addEventListener("click", () => {

        
            // DATOS DEL FORMULARIO
            const SBM =
                parseFloat(
                    document.getElementById(
                        "salarioMensual"
                    ).value
                ) || 0;


            const añosLaborados =
                parseInt(
                    anosLaboradosInput?.value
                ) || 0;


            const mesesLaborados =
                parseInt(
                    mesesLaboradosInput?.value
                ) || 0;


            const horasDiurnas =
                parseFloat(
                    document.getElementById(
                        "horasDiurnas"
                    ).value
                ) || 0;


            const horasNocturnas =
                parseFloat(
                    document.getElementById(
                        "horasNocturnas"
                    ).value
                ) || 0;


            const díasAsuetoTrabajados =
                parseInt(
                    document.getElementById(
                        "inputTotalDiasAsueto"
                    ).value
                ) || 0;


            const díasDescansoTrabajados =
                parseInt(
                    document.getElementById(
                        "diasDescanso"
                    ).value
                ) || 0;

            // TIPO DE CIERRE
            const radioTipoCierre =
                document.querySelector(
                    'input[name="tipoCierre"]:checked'
                );

            const tipoCierre =
                radioTipoCierre
                    ? radioTipoCierre.value
                    : "despido";

            // FECHAS
            const fechaTerminacionStr =
                fechaTerminacion?.value ||
                new Date()
                    .toISOString()
                    .split("T")[0];


            const fechaIngresoStr =
                fechaIngreso?.value ||
                fechaTerminacionStr;

            // SECTOR ECONÓMICO

            const sectorEconomico =
                document.getElementById(
                    "sectorEconomico"
                )?.value || "comercio";



            // SALARIO BÁSICO DIARIO
            const SBD =
                calcularSBD(SBM);

            // VALOR DE HORA DIURNA
            const HD =
                SBD / 8;

            // VALOR DE HORA NOCTURNA
            const HD_Nocturna =
                calcularHN(HD);

            // HORAS EXTRAS DIURNAS
            const totalHEsDiurnas =
                calcularHE(
                    horasDiurnas,
                    HD
                );

            // HORAS EXTRAS NOCTURNAS
            const totalHEsNocturnas =
                calcularHE(
                    horasNocturnas,
                    HD_Nocturna
                );


            // HORAS EXTRAS PENDIENTES
            let totalHEsPendientesDiurnas = 0;
            let totalHEsPendientesNocturnas = 0;

            const radioHorasNoPagadasSi =
                document.getElementById(
                    "horasNoPagadasSi"
                );


            if (
                radioHorasNoPagadasSi &&
                radioHorasNoPagadasSi.checked
            ) {

                const fechaHoraExtraInput =
                    document.getElementById(
                        "fechaHoraExtra"
                    );


                const cantidadHorasInput =
                    document.getElementById(
                        "cantidadHorasPendientes"
                    );


                const fechaHoraExtraStr =
                    fechaHoraExtraInput
                        ? fechaHoraExtraInput.value
                        : "";


                const cantidadHorasPendientes =
                    cantidadHorasInput
                        ? parseFloat(
                            cantidadHorasInput.value
                        ) || 0
                        : 0;

                // DETERMINAR SI ES HORARIO NOCTURNO
                const esNoct =
                    esHoraNocturna(
                        fechaHoraExtraStr
                    );

                // HORAS PENDIENTES NOCTURNAS
                if (esNoct) {

                    totalHEsPendientesNocturnas =
                        calcularHE(
                            cantidadHorasPendientes,
                            HD_Nocturna
                        );

                }

                // HORAS PENDIENTES DIURNAS
                else {

                    totalHEsPendientesDiurnas =
                        calcularHE(
                            cantidadHorasPendientes,
                            HD
                        );
                }
            }

            // DÍAS DE ASUETO
            
            const totalAsueto =
                calcularSE(SBD) *
                díasAsuetoTrabajados;

            // 12. DÍAS DE DESCANSO
            const totalDescanso =
                calcularSDD(SBD) *
                díasDescansoTrabajados;


            // 13. VACACIONES
            const totalRV =
                calcularRV(
                    SBD,
                    mesesLaborados
                );

            // 14. AGUINALDO
            const totalPA =
                calcularPA(
                    SBD,
                    añosLaborados,
                    fechaTerminacionStr,
                    fechaIngresoStr
                );


            // 15. INDEMNIZACIÓN

            let totalIndemnización = 0;
            // DESPIDO
            if (
                tipoCierre === "despido"
            ) {

                totalIndemnización =
                    calcularIndemnizacionDespido(
                        SBD,
                        añosLaborados,
                        mesesLaborados,
                        SBM,
                        sectorEconomico
                    );
            }
            // RENUNCIA
            else if (
                tipoCierre === "renuncia"
            ) {

                const tipoCargo =
                    document.getElementById(
                        "tipoCargo"
                    )?.value || "empleado";


                const radioAviso =
                    document.querySelector(
                        'input[name="avisoPrevio"]:checked'
                    );


                const avisoPrevio =
                    radioAviso
                        ? radioAviso.value
                        : "no";


                totalIndemnización =
                    calcularIndemnizacionRenuncia(
                        SBD,
                        añosLaborados,
                        mesesLaborados,
                        sectorEconomico,
                        tipoCargo,
                        avisoPrevio
                    );
            }

            // TOTAL DE HORAS EXTRAS
            const totalHorasExtras =
                totalHEsDiurnas +
                totalHEsNocturnas +
                totalHEsPendientesDiurnas +
                totalHEsPendientesNocturnas;

            // TOTAL BRUTO
            const totalBruto =
                totalHorasExtras +
                totalAsueto +
                totalDescanso +
                totalRV +
                totalPA +
                totalIndemnización;

            // BASE COTIZABLE
            const baseCotizable =
                SBM +
                totalHorasExtras +
                totalAsueto +
                totalDescanso +
                totalRV;

            // ISSS
            const totalISSS =
                calcularISSS(
                    baseCotizable
                );
            // AFP
            const totalAFP =
                calcularAFP(
                    baseCotizable
                );

            // TOTAL DEDUCCIONES
            const totalDeducciones =
                calcularTotalDeducciones(
                    totalISSS,
                    totalAFP
                );
            // NETO A PAGAR
            const netoPagar =
                calcularNetoPagar(
                    totalBruto,
                    totalDeducciones
                );

            // MOSTRAR VACACIONES
            document.getElementById(
                "resVacacion"
            ).textContent =
                `$${formatearMoneda(totalRV)}`;

            // MOSTRAR AGUINALDO
            document.getElementById(
                "resAguinaldo"
            ).textContent =
                `$${formatearMoneda(totalPA)}`;

            //MOSTRAR INDEMNIZACIÓN
            document.getElementById(
                "resIndemnizacion"
            ).textContent =
                `$${formatearMoneda(totalIndemnización)}`;

            // MOSTRAR HORAS EXTRAS DIURNAS
            const totalDiurnasMostrar =
                totalHEsDiurnas +
                totalHEsPendientesDiurnas;

            document.getElementById(
                "resHEsDiurnas"
            ).textContent =
                `$${formatearMoneda(totalDiurnasMostrar)}`;

            // MOSTRAR HORAS EXTRAS NOCTURNAS
            const totalNocturnasMostrar =
                totalHEsNocturnas +
                totalHEsPendientesNocturnas;

            document.getElementById(
                "resHEsNocturnas"
            ).textContent =
                `$${formatearMoneda(totalNocturnasMostrar)}`;

            //  MOSTRAR ASUETOS
            document.getElementById(
                "resAsueto"
            ).textContent =
                `$${formatearMoneda(totalAsueto)}`;

            // MOSTRAR DESCANSO SEMANAL
            document.getElementById(
                "resDescanso"
            ).textContent =
                `$${formatearMoneda(totalDescanso)}`;

            // MOSTRAR TOTAL BRUTO
            document.getElementById(
                "resTotal"
            ).textContent =
                `$${formatearMoneda(totalBruto)}`;

            // MOSTRAR ISSS
            document.getElementById(
                "resISSS"
            ).textContent =
                `-$${formatearMoneda(totalISSS)}`;

            // MOSTRAR AFP
            document.getElementById(
                "resAFP"
            ).textContent =
                `-$${formatearMoneda(totalAFP)}`;

            // MOSTRAR TOTAL DEDUCCIONES
            document.getElementById(
                "resDeducciones"
            ).textContent =
                `-$${formatearMoneda(totalDeducciones)}`;

            // MOSTRAR NETO
            document.getElementById(
                "resNeto"
            ).textContent =
                `$${formatearMoneda(netoPagar)}`;

            //MOSTRAR PANEL DE RESULTADOS
            document.getElementById(
                "panelResultados"
            ).classList.remove("d-none");

        });
    }
    const tooltips =
        document.querySelectorAll(
            '[data-bs-toggle="tooltip"]'
        );

    tooltips.forEach(elemento => {

        new bootstrap.Tooltip(elemento);

    });
        // ==========================================
    // VENTANA DE REPORTE PDF
    // ==========================================

    const btnDescargarPDF =
        document.getElementById(
            "btnDescargarPDF"
        );

    if (btnDescargarPDF) {

        btnDescargarPDF.addEventListener(
            "click",
            () => {


                const nombreTrabajador =
                    document.getElementById(
                        "nombreTrabajador"
                    )?.value || "No especificado";

                const nombrePatrono =
                    document.getElementById(
                        "nombrePatrono"
                    )?.value || "No especificado";

                const salario =
                    parseFloat(
                        document.getElementById(
                            "salarioMensual"
                        )?.value
                    ) || 0;

                const cargoDesempenado =
                    document.getElementById(
                        "tipoCargo"
                    )?.value || "No especificado";


                const anos =
                    parseInt(
                        document.getElementById(
                            "anosLaborados"
                        )?.value
                    ) || 0;

                const meses =
                    parseInt(
                        document.getElementById(
                            "mesesLaborados"
                        )?.value
                    ) || 0;


                const radioTipoCierre =
                    document.querySelector(
                        'input[name="tipoCierre"]:checked'
                    );

                const tipoCierre =
                    radioTipoCierre
                        ? radioTipoCierre.value
                        : "despido";

                const tipoCierreTexto =
                    tipoCierre === "renuncia"
                        ? "Renuncia voluntaria"
                        : "Despido injustificado";


                const ventanaPDF =
                    window.open(
                        "",
                        "_blank",
                        "width=900,height=700"
                    );

                if (!ventanaPDF) {

                    alert(
                        "El navegador bloqueó la ventana emergente. " +
                        "Permite ventanas emergentes para generar el reporte."
                    );

                    return;
                }

                ventanaPDF.document.write(`

                    <!DOCTYPE html>

                    <html lang="es">

                    <head>

                        <meta charset="UTF-8">

                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        >

                        <title>
                            Reporte de Liquidación Laboral
                        </title>

                        <link
                            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                            rel="stylesheet"
                        >

                        <style>

                            body {
                                font-family: Arial, sans-serif;
                                background: #ffffff;
                                color: #333;
                                padding: 40px;
                            }

                            .reporte {
                                max-width: 900px;
                                margin: auto;
                            }

                            .header-title {
                                font-weight: bold;
                                color: #0d6efd;
                            }

                            .subtitulo {
                                color: #6c757d;
                            }

                            .datos {
                                border: 1px solid #dee2e6;
                                border-radius: 8px;
                                padding: 20px;
                                margin-top: 25px;
                            }

                            .table th {
                                background-color: #f8f9fa !important;
                            }

                            .total-bruto {
                                font-size: 18px;
                            }

                            .deducciones {
                                color: #dc3545;
                            }

                            .neto {
                                background-color: #198754;
                                color: white;
                                font-size: 20px;
                                font-weight: bold;
                            }

                            .nota {
                                font-size: 12px;
                                color: #6c757d;
                                margin-top: 30px;
                            }

                            .botones {
                                margin-top: 30px;
                            }

                            @media print {

                                body {
                                    padding: 0;
                                }

                                .botones {
                                    display: none !important;
                                }

                                .reporte {
                                    max-width: 100%;
                                }
                            }

                        </style>

                    </head>

                    <body>

                        <div class="reporte">

                            <!-- ENCABEZADO -->

                            <div class="text-center">

                                <h3 class="header-title mb-1">
                                    CÁLCULO DE PRESTACIONES LABORALES
                                </h3>

                                <p class="subtitulo mb-2">
                                    El Salvador
                                </p>

                                <p class="text-muted">
                                    Reporte de liquidación laboral
                                </p>

                            </div>


                            <hr>


                            <!-- DATOS DEL TRABAJADOR -->

                            <div class="datos">

                                <div class="row">

                                    <div class="col-md-6">

                                        <p>
                                            <strong>
                                                Trabajador(a):
                                            </strong>

                                            ${nombreTrabajador}
                                        </p>

                                        <p>
                                            <strong>
                                                Salario mensual:
                                            </strong>

                                            $${salario.toFixed(2)}
                                        </p>

                                        <p>
                                            <strong>
                                                Antigüedad:
                                            </strong>

                                            ${anos} años,
                                            ${meses} meses
                                        </p>

                                    </div>


                                    <div class="col-md-6">

                                        <p>
                                            <strong>
                                                Patrono:
                                            </strong>

                                            ${nombrePatrono}
                                        </p>

                                        <p>
                                            <strong>
                                                Cargo:
                                            </strong>

                                            ${cargoDesempenado}
                                        </p>

                                        <p>
                                            <strong>
                                                Tipo de terminación:
                                            </strong>

                                            ${tipoCierreTexto}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <!-- DESGLOSE DE PRESTACIONES -->

                            <h5 class="mt-4 mb-3">
                                Desglose de prestaciones
                            </h5>


                            <table class="table table-bordered">

                                <tbody>

                                    <tr>

                                        <td>
                                            <strong>
                                                Horas extras diurnas
                                            </strong>
                                        </td>

                                        <td class="text-end">
                                            $${totalDiurnasMostrar.toFixed(2)}
                                        </td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <strong>
                                                Horas extras nocturnas
                                            </strong>
                                        </td>

                                        <td class="text-end">
                                            $${totalNocturnasMostrar.toFixed(2)}
                                        </td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <strong>
                                                Días de asueto
                                            </strong>
                                        </td>

                                        <td class="text-end">
                                            $${totalAsueto.toFixed(2)}
                                        </td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <strong>
                                                Días de descanso
                                            </strong>
                                        </td>

                                        <td class="text-end">
                                            $${totalDescanso.toFixed(2)}
                                        </td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <strong>
                                                Vacación proporcional
                                            </strong>
                                        </td>

                                        <td class="text-end">
                                            $${totalRV.toFixed(2)}
                                        </td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <strong>
                                                Aguinaldo proporcional
                                            </strong>
                                        </td>

                                        <td class="text-end">
                                            $${totalPA.toFixed(2)}
                                        </td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <strong>
                                                Indemnización /
                                                compensación
                                            </strong>
                                        </td>

                                        <td class="text-end">
                                            $${totalIndemnización.toFixed(2)}
                                        </td>

                                    </tr>


                                    <tr class="table-dark">

                                        <td>
                                            <strong>
                                                TOTAL BRUTO
                                            </strong>
                                        </td>

                                        <td class="text-end total-bruto">

                                            <strong>
                                                $${totalBruto.toFixed(2)}
                                            </strong>

                                        </td>

                                    </tr>

                                </tbody>

                            </table>


                            <!-- DEDUCCIONES -->

                            <h5 class="mt-4 mb-3">
                                Deducciones
                            </h5>


                            <table class="table table-bordered">

                                <tbody>

                                    <tr>

                                        <td>
                                            ISSS
                                        </td>

                                        <td class="text-end deducciones">
                                            -$${totalISSS.toFixed(2)}
                                        </td>

                                    </tr>


                                    <tr>

                                        <td>
                                            AFP
                                        </td>

                                        <td class="text-end deducciones">
                                            -$${totalAFP.toFixed(2)}
                                        </td>

                                    </tr>


                                    <tr>

                                        <td>
                                            <strong>
                                                Total de deducciones
                                            </strong>
                                        </td>

                                        <td class="text-end deducciones">

                                            <strong>
                                                -$${totalDeducciones.toFixed(2)}
                                            </strong>

                                        </td>

                                    </tr>

                                </tbody>

                            </table>


                            <!-- NETO A PAGAR -->

                            <div class="neto rounded p-3 mt-4">

                                <div
                                    class="d-flex justify-content-between"
                                >

                                    <span>
                                        NETO A PAGAR
                                    </span>

                                    <span>
                                        $${netoPagar.toFixed(2)}
                                    </span>

                                </div>

                            </div>


                            <!-- FECHA DE EMISIÓN -->

                            <p class="text-end text-muted mt-4">

                                Fecha de emisión:
                                ${new Date().toLocaleDateString("es-SV")}

                            </p>


                            <!-- NOTA -->

                            <div class="nota">

                                <strong>Nota:</strong>

                                Este documento presenta una estimación
                                basada en los datos proporcionados por
                                el usuario. No constituye una liquidación
                                laboral oficial.

                            </div>


                            <!-- BOTONES -->

                            <div class="botones text-center">

                                <button
                                    class="btn btn-primary me-2"
                                    onclick="window.print()"
                                >
                                    🖨️ Imprimir / Guardar PDF
                                </button>

                                <button
                                    class="btn btn-secondary"
                                    onclick="window.close()"
                                >
                                    Cerrar
                                </button>

                            </div>

                        </div>

                    </body>

                    </html>

                `);


                // ==========================================
                // FINALIZAR DOCUMENTO
                // ==========================================

                ventanaPDF.document.close();

            }
        );
    }



}
);



