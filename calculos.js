
function realizarCalculo() {
    const salario = parseFloat(document.getElementById('salarioMensual').value) || 0;
    const años = parseInt(document.getElementById('anosLaborados').value) || 0;
    const meses = parseInt(document.getElementById('mesesLaborados').value) || 0;
    
    const tipoCierre = document.querySelector('input[name="tipoCierre"]:checked').value;
    const avisoPrevio = document.querySelector('input[name="avisoPrevio"]:checked').value;

    const hDiurnas = parseFloat(document.getElementById('horasDiurnas').value) || 0;
    const hNocturnas = parseFloat(document.getElementById('horasNocturnas').value) || 0;
    const dAsueto = parseInt(document.getElementById('diasAsueto').value) || 0;
    const dDescanso = parseInt(document.getElementById('diasDescanso').value) || 0;

    const salarioDiario = salario / 30;
    const salarioHora = salarioDiario / 8;
    
    const totalMesesDecimal = (años * 12) + meses;
    const vacacionProporcional = (salario / 12) * (totalMesesDecimal % 12 / 12 || (totalMesesDecimal >= 12 ? 1 : totalMesesDecimal/12)); 
    const aguinaldoProporcional = (salario / 30 * 15) * (totalMesesDecimal > 12 ? 1 : totalMesesDecimal / 12); 

    let indemnizacion = 0;
    if (tipoCierre === 'despido') {
        indemnizacion = salario * (años + (meses / 12));
    } else {
        if (avisoPrevio === 'si') {
            let salarioDiarioIndem = salario / 30;
            indemnizacion = (salarioDiarioIndem * 15) * (años + (meses / 12));
        } else {
            indemnizacion = 0; 
        }
    }

    const subtotalHEsDiurnas = hDiurnas * (salarioHora * 1.5);
    const subtotalHEsNocturnas = hNocturnas * (salarioHora * 1.25 * 1.5);
    const montoAsueto = dAsueto * salarioDiario * 2;
    const montoDescanso = dDescanso * (salarioDiario * 1.5);

    const totalLiquidacion = vacacionProporcional + aguinaldoProporcional + indemnizacion + subtotalHEsDiurnas + subtotalHEsNocturnas + montoAsueto + montoDescanso;

    return {
        vacacionProporcional,
        aguinaldoProporcional,
        indemnizacion,
        tipoCierre,
        subtotalHEsDiurnas,
        subtotalHEsNocturnas,
        montoAsueto,
        montoDescanso,
        totalLiquidacion
    };
}