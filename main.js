document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.getElementById('btnCalcular');
    const btnExportarPDF = document.getElementById('btnExportarPDF');
    const btnComprobante = document.getElementById('btnComprobante');

    // Botón Calcular
    btnCalcular.addEventListener('click', () => {
        const salario = parseFloat(document.getElementById('salarioMensual').value) || 0;
        if (salario <= 0) {
            alert('Por favor ingrese un salario mensual válido.');
            return;
        }

        const resultados = realizarCalculo();

        // Mostrar resultados en la interfaz
        document.getElementById('resVacacion').textContent = `$${resultados.vacacionProporcional.toFixed(2)}`;
        document.getElementById('resAguinaldo').textContent = `$${resultados.aguinaldoProporcional.toFixed(2)}`;
        document.getElementById('resIndemnizacion').textContent = `$${resultados.indemnizacion.toFixed(2)}`;
        document.getElementById('labelIndemTitle').textContent = resultados.tipoCierre === 'despido' ? 'INDEMNIZACIÓN ART. 58' : 'COMPENSACIÓN POR RENUNCIA';
        
        document.getElementById('resHEsDiurnas').textContent = `$${resultados.subtotalHEsDiurnas.toFixed(2)}`;
        document.getElementById('resHEsNocturnas').textContent = `$${resultados.subtotalHEsNocturnas.toFixed(2)}`;
        document.getElementById('resAsueto').textContent = `$${resultados.montoAsueto.toFixed(2)}`;
        document.getElementById('resDescanso').textContent = `$${resultados.montoDescanso.toFixed(2)}`;
        document.getElementById('resTotal').textContent = `$${resultados.totalLiquidacion.toFixed(2)}`;

        const panelResultados = document.getElementById('panelResultados');
        panelResultados.classList.remove('d-none');
        panelResultados.scrollIntoView({ behavior: 'smooth' });
    });

    // Función para abrir reporte en nueva pestaña para imprimir / guardar como PDF
    function abrirVentanaPDF(esComprobante = false) {
        const nombreTrabajador = document.getElementById('nombreTrabajador').value || 'No especificado';
        const salario = document.getElementById('salarioMensual').value || '0.00';
        const anos = document.getElementById('anosLaborados').value || '0';
        const meses = document.getElementById('mesesLaborados').value || '0';
        const nombrePatrono = document.getElementById('nombrePatrono').value || 'No especificado';
        const cargoDesempenado = document.getElementById('cargoDesempenado').value || 'No especificado';

        const resultados = realizarCalculo();

        // Crear una nueva ventana en el navegador
        const ventanaPDF = window.open('', '_blank');
        
        ventanaPDF.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Reporte de Liquidación Laboral</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
                    .header-title { font-weight: bold; color: #0d6efd; }
                    .table th { background-color: #f8f9fa !important; }
                </style>
            </head>
            <body onload="window.print()">
                <div class="container">
                    <h3 class="text-center header-title mb-1">CÁLCULO DE PRESTACIONES LABORALES</h3>
                    <p class="text-center text-muted mb-4">Conforme al Código de Trabajo de El Salvador</p>
                    
                    <hr>
                    <div class="row mb-3">
                        <div class="col-6">
                            <p><strong>Trabajador(a):</strong> ${nombreTrabajador}</p>
                            <p><strong>Salario Mensual:</strong> $${salario}</p>
                            <p><strong>Antigüedad:</strong> ${anos} años, ${meses} meses</p>
                        </div>
                        <div class="col-6">
                            <p><strong>Patrono:</strong> ${nombrePatrono}</p>
                            <p><strong>Cargo:</strong> ${cargoDesempenado}</p>
                            <p><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <h5 class="mt-4 text-secondary">Desglose de Montos</h5>
                    <table class="table table-bordered">
                        <tr>
                            <td><strong>Vacación Proporcional:</strong></td>
                            <td>$${resultados.vacacionProporcional.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><strong>Aguinaldo Proporcional:</strong></td>
                            <td>$${resultados.aguinaldoProporcional.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><strong>Indemnización / Compensación:</strong></td>
                            <td>$${resultados.indemnizacion.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><strong>Horas Extras y Jornadas Especiales:</strong></td>
                            <td>$${(resultados.subtotalHEsDiurnas + resultados.subtotalHEsNocturnas + resultados.montoAsueto + resultados.montoDescanso).toFixed(2)}</td>
                        </tr>
                        <tr class="table-dark">
                            <td><strong>TOTAL LIQUIDACIÓN (BRUTO):</strong></td>
                            <td><strong>$${resultados.totalLiquidacion.toFixed(2)}</strong></td>
                        </tr>
                    </table>

                    ${esComprobante ? `
                        <div class="mt-5 pt-5 row text-center">
                            <div class="col-6">
                                <p>_________________________________________</p>
                                <p>Firma del Patrono o Representante</p>
                            </div>
                            <div class="col-6">
                                <p>_________________________________________</p>
                                <p>Firma de la Persona Trabajadora</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </body>
            </html>
        `);
        ventanaPDF.document.close();
    }

    // Botones Exportar PDF y Comprobante para firma
    btnExportarPDF.addEventListener('click', () => abrirVentanaPDF(false));
    btnComprobante.addEventListener('click', () => abrirVentanaPDF(true));
});