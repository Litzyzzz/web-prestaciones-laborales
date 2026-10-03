
// SALARIO BÁSICO DIARIO (SBD)
// Fórmula:
// SBD = Salario mensual / 30
function calcularSBD(SBM) {
    return parseFloat((SBM / 30).toFixed(2));
}

// REMUNERACIÓN POR HORA NOCTURNA (HN)
// Fórmula:
// HN = HD * 1.25
function calcularHN(HD) {
    return parseFloat((HD * 1.25).toFixed(2));
}

// REMUNERACIÓN POR HORAS EXTRAS (HE)
// Fórmula:
// HE = Horas * Valor hora * 2
function calcularHE(H, HL) {
    return parseFloat((H * HL * 2).toFixed(2));
}

// SALARIO EXTRAORDINARIO POR DÍA DE ASUETO
// Fórmula:
// SE = SBD * 2
function calcularSE(SBD) {
    return parseFloat((SBD * 2).toFixed(2));
}

// SALARIO POR DÍA DE DESCANSO SEMANAL
// Fórmula:
// SDD = SBD * 1.5
function calcularSDD(SBD) {
    return parseFloat((SBD * 1.5).toFixed(2));
}

// REMUNERACIÓN POR PERÍODO VACACIONAL
function calcularRV(SBD, mesesLaborados = 12) {
    const RVAnual = SBD * 15 * 1.30;
    return parseFloat(((RVAnual * mesesLaborados) / 12).toFixed(2));
}

// PRESTACIÓN POR AGUINALDO (PA)
function calcularPA(
    SBD,
    añosServicio,
    fechaTerminacionStr,
    fechaIngresoStr
) {
    let D = 15;
    // Determinar los días de aguinaldo
    if (añosServicio >= 10) {
        D = 21;
    } else if (añosServicio >= 3) {
        D = 19;
    }

    const fechaIngreso =
        new Date(fechaIngresoStr + "T00:00:00");

    const fechaTerminacion =
        new Date(fechaTerminacionStr + "T00:00:00");

    if (
        isNaN(fechaIngreso.getTime()) ||
        isNaN(fechaTerminacion.getTime())
    ) {
        return 0;
    }

    if (fechaTerminacion < fechaIngreso) {
        return 0;
    }

    const añoTerminacion =
        fechaTerminacion.getFullYear();

    // Fecha de referencia del aguinaldo
    const fechaCorteAguinaldo =
        new Date(añoTerminacion, 11, 12);

    // Inicio del período
    const inicioPeriodoAguinaldo =
        new Date(añoTerminacion - 1, 11, 12);

    // Determinar desde cuándo se debe contar
    const inicioReal =
        fechaIngreso > inicioPeriodoAguinaldo
            ? fechaIngreso
            : inicioPeriodoAguinaldo;

    // Si termina antes del 12 de diciembre,
    // se utiliza la fecha de terminación
    const fechaFinal =
        fechaTerminacion < fechaCorteAguinaldo
            ? fechaTerminacion
            : fechaCorteAguinaldo;

    let diasTrabajados =
        Math.floor(
            (
                fechaFinal.getTime() -
                inicioReal.getTime()
            ) /
            (1000 * 60 * 60 * 24)
        );

    diasTrabajados =
        Math.max(0, diasTrabajados);

    const aguinaldoCompleto =
        SBD * D;

    // Si completó todo el período,
    // corresponde el aguinaldo completo.
    if (
        fechaIngreso <= inicioPeriodoAguinaldo &&
        fechaTerminacion >= fechaCorteAguinaldo
    ) {
        return parseFloat(aguinaldoCompleto.toFixed(2));
    }

    // Aguinaldo proporcional
    const aguinaldoDiario =
        aguinaldoCompleto / 360;

    return parseFloat((aguinaldoDiario * diasTrabajados).toFixed(2));
}

// SALARIO MÍNIMO SEGÚN SECTOR
function obtenerSalarioMinimoSector(sector) {
    switch (sector) {
        case "maquila":
            return 402.26;

        case "agropecuario":
            return 272.72;

        case "comercio":
        default:
            return 408.80;
    }
}

// INDEMNIZACIÓN POR DESPIDO INJUSTIFICADO
function calcularIndemnizacionDespido(
    SBD,
    añosLaborados,
    mesesLaborados,
    salarioMensual,
    sectorEconomico = "comercio"
) {
    // Obtiene el salario mínimo del sector
    const salarioMinimoMensual =
        obtenerSalarioMinimoSector(sectorEconomico);

    // Convierte el salario mínimo mensual a salario mínimo diario
    const salarioMinimoDiario =
        salarioMinimoMensual / 30;
    const topeSalarioDiario =
        salarioMinimoDiario * 4;

    let salarioDiarioCalculable = SBD;

    // Aplicar el tope
    if (
        salarioDiarioCalculable >
        topeSalarioDiario
    ) {
        salarioDiarioCalculable =
            topeSalarioDiario;
    }

    // AÑOS COMPLETOS
    // 30 días por cada año
    const indemnizacionAños =
        añosLaborados *
        salarioDiarioCalculable *
        30;

    // FRACCIÓN DEL AÑO
    const indemnizacionFraccion =
        salarioDiarioCalculable *
        30 *
        (mesesLaborados / 12);

    let indemnizacionTotal =
        indemnizacionAños +
        indemnizacionFraccion;

    // MÍNIMO LEGAL DE 15 DÍAS
    const indemnizacionMinima =
        salarioDiarioCalculable * 15;

    // Solamente aplicamos el mínimo si
    // existe tiempo de servicio.
    if (
        (añosLaborados > 0 || mesesLaborados > 0) &&
        indemnizacionTotal < indemnizacionMinima
    ) {
        indemnizacionTotal =
            indemnizacionMinima;
    }

    return parseFloat(indemnizacionTotal.toFixed(2));
}

// PRESTACIÓN ECONÓMICA POR RENUNCIA VOLUNTARIA
function calcularIndemnizacionRenuncia(
    SBD,
    añosLaborados,
    mesesLaborados,
    sectorEconomico,
    tipoCargo,
    avisoPrevio
) {
    // REQUISITO 1: MÍNIMO 2 AÑOS DE SERVICIO
    if (añosLaborados < 2) {
        return 0;
    }

    // Trabajador normal: 15 días.
    // Jefatura / Gerencia: 30 días (si cumplió el preaviso).
    if (avisoPrevio !== "si") {
        return 0;
    }

    // ======================================
    // SALARIO MÍNIMO DEL SECTOR
    // ======================================
    const salarioMinimoMensual =
        obtenerSalarioMinimoSector(
            sectorEconomico
        );

    const salarioMinimoDiario =
        salarioMinimoMensual / 30;

    // ======================================
    // TOPE DEL DECRETO 592 (2 salarios mínimos diarios)
    // ======================================
    const topeSalarioDiario =
        salarioMinimoDiario * 2;

    let salarioDiarioCalculable = SBD;

    if (
        salarioDiarioCalculable >
        topeSalarioDiario
    ) {
        salarioDiarioCalculable =
            topeSalarioDiario;
    }

    // ======================================
    // 15 DÍAS POR CADA AÑO
    // ======================================
    const indemnizacionAños =
        añosLaborados *
        salarioDiarioCalculable *
        15;

    // ======================================
    // FRACCIÓN DEL AÑO
    // ======================================
    const indemnizacionFraccion =
        salarioDiarioCalculable *
        15 *
        (mesesLaborados / 12);

    return parseFloat((
        indemnizacionAños +
        indemnizacionFraccion
    ).toFixed(2));
}

// CALCULAR ANTIGÜEDAD
function calcularAntigüedadFechas(
    fechaInicioStr,
    fechaFinStr
) {
    const inicio =
        new Date(fechaInicioStr);

    const fin =
        new Date(fechaFinStr);

    if (
        isNaN(inicio.getTime()) ||
        isNaN(fin.getTime()) ||
        inicio > fin
    ) {
        return {
            años: 0,
            meses: 0,
            diasTotales: 0
        };
    }

    let años =
        fin.getFullYear() -
        inicio.getFullYear();

    let meses =
        fin.getMonth() -
        inicio.getMonth();

    let dias =
        fin.getDate() -
        inicio.getDate();

    // Si los días son negativos, tomar días del mes anterior.
    if (dias < 0) {
        meses--;

        const mesAnterior =
            new Date(
                fin.getFullYear(),
                fin.getMonth(),
                0
            );

        dias +=
            mesAnterior.getDate();
    }

    // Si los meses son negativos, tomar un año.
    if (meses < 0) {
        años--;
        meses += 12;
    }

    const diferenciaTiempo =
        fin.getTime() -
        inicio.getTime();

    const diasTotales =
        Math.floor(
            diferenciaTiempo /
            (1000 * 3600 * 24)
        );

    return {
        años,
        meses,
        diasTotales
    };
}

// DETERMINA SI UNA HORA ES NOCTURNA
function esHoraNocturna(fechaHoraStr) {
    if (!fechaHoraStr) {
        return false;
    }

    const fecha =
        new Date(fechaHoraStr);

    const hora =
        fecha.getHours();

    return (
        hora >= 19 ||
        hora < 6
    );
}

// DEDUCCIÓN ISSS
function calcularISSS(baseCotizable) {
    const techoISSS = 1000;

    const baseISSS =
        Math.min(baseCotizable, techoISSS);

    return parseFloat((baseISSS * 0.03).toFixed(2));
}

// DEDUCCIÓN AFP
function calcularAFP(baseCotizable) {
    return parseFloat((baseCotizable * 0.0725).toFixed(2));
}

// TOTAL DE DEDUCCIONES
function calcularTotalDeducciones(ISSS, AFP) {
    return parseFloat((ISSS + AFP).toFixed(2));
}

// NETO A PAGAR
function calcularNetoPagar(
    totalBruto,
    totalDeducciones
) {
    return parseFloat((totalBruto - totalDeducciones).toFixed(2));
}