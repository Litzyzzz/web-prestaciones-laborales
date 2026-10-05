
// SALARIO BÁSICO DIARIO (SBD)
// Fórmula:
// SBD = Salario mensual / 30
function calcularSBD(SBM) {
    return parseFloat((SBM / 30).toFixed(2));
}

// VALOR DE HORA DIURNA (HD)
// Fórmula:
// HD = SBD / 8
function calcularHD(SBD) {
    return parseFloat((SBD / 8).toFixed(2));
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

// CALCULAR HORAS DIURNAS Y NOCTURNAS POR RANGO
function calcularHorasExtrasPorRango(inicio, fin) {
    if (!inicio || !fin) {
        return {
            valida: false,
            horasDiurnas: 0,
            horasNocturnas: 0,
            clasificacion: "Inválida",
            duracionTotal: 0
        };
    }

    const horaInicio = inicio.split(":").map(Number);
    const horaFin = fin.split(":").map(Number);

    if (
        horaInicio.length !== 2 ||
        horaFin.length !== 2 ||
        Number.isNaN(horaInicio[0]) ||
        Number.isNaN(horaInicio[1]) ||
        Number.isNaN(horaFin[0]) ||
        Number.isNaN(horaFin[1]) ||
        horaInicio[0] < 0 ||
        horaInicio[0] > 23 ||
        horaFin[0] < 0 ||
        horaFin[0] > 23 ||
        horaInicio[1] < 0 ||
        horaInicio[1] > 59 ||
        horaFin[1] < 0 ||
        horaFin[1] > 59
    ) {
        return {
            valida: false,
            horasDiurnas: 0,
            horasNocturnas: 0,
            clasificacion: "Inválida",
            duracionTotal: 0
        };
    }

    const inicioMinutos = horaInicio[0] * 60 + horaInicio[1];
    const finMinutos = horaFin[0] * 60 + horaFin[1];

    if (inicioMinutos === finMinutos) {
        return {
            valida: false,
            horasDiurnas: 0,
            horasNocturnas: 0,
            clasificacion: "Inválida",
            duracionTotal: 0
        };
    }

    let duracionTotal = finMinutos > inicioMinutos
        ? finMinutos - inicioMinutos
        : (24 * 60 - inicioMinutos) + finMinutos;

    if (duracionTotal <= 0 || duracionTotal > 24 * 60) {
        return {
            valida: false,
            horasDiurnas: 0,
            horasNocturnas: 0,
            clasificacion: "Inválida",
            duracionTotal: 0
        };
    }

    const segmentos = finMinutos > inicioMinutos
        ? [[inicioMinutos, finMinutos]]
        : [[inicioMinutos, 24 * 60], [0, finMinutos]];

    const overlap = (segmentInicio, segmentFin, ventanaInicio, ventanaFin) => {
        const inicio = Math.max(segmentInicio, ventanaInicio);
        const fin = Math.min(segmentFin, ventanaFin);
        return fin > inicio ? fin - inicio : 0;
    };

    let horasDiurnas = 0;
    let horasNocturnas = 0;

    segmentos.forEach(([segmentInicio, segmentFin]) => {
        horasDiurnas += overlap(segmentInicio, segmentFin, 6 * 60, 19 * 60);
        horasNocturnas += overlap(segmentInicio, segmentFin, 19 * 60, 24 * 60);
        horasNocturnas += overlap(segmentInicio, segmentFin, 0, 6 * 60);
    });

    horasDiurnas = Number((horasDiurnas / 60).toFixed(2));
    horasNocturnas = Number((horasNocturnas / 60).toFixed(2));

    let clasificacion = "Diurna";
    if (horasDiurnas > 0 && horasNocturnas > 0) {
        clasificacion = "Mixta";
    } else if (horasNocturnas > 0) {
        clasificacion = "Nocturna";
    }

    return {
        valida: true,
        horasDiurnas,
        horasNocturnas,
        clasificacion,
        duracionTotal: Number((duracionTotal / 60).toFixed(2))
    };
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

// PRESTACIÓN POR AGUINALDO (PA) - Art. 198 y 202 C.T.
function calcularPA(
    SBD,
    añosServicio,
    fechaTerminacionStr,
    fechaIngresoStr
) {
    // Determinar los días de aguinaldo según antigüedad (Art. 198)
    let D = 15; // De 1 a menos de 3 años
    if (añosServicio >= 10) {
        D = 21; // De 10 años en adelante
    } else if (añosServicio >= 3) {
        D = 19; // De 3 a menos de 10 años
    }

    const fechaIngreso = new Date(fechaIngresoStr + "T00:00:00");
    const fechaTerminacion = new Date(fechaTerminacionStr + "T00:00:00");

    if (isNaN(fechaIngreso.getTime()) || isNaN(fechaTerminacion.getTime()) || fechaTerminacion < fechaIngreso) {
        return 0;
    }

    const añoTerminacion = fechaTerminacion.getFullYear();

    // Período legal del aguinaldo: del 12 de diciembre del año anterior al 11 de diciembre del año en curso
    const fechaCorteAguinaldo = new Date(añoTerminacion, 11, 12);
    const inicioPeriodoAguinaldo = new Date(añoTerminacion - 1, 11, 12);

    const inicioReal = fechaIngreso > inicioPeriodoAguinaldo ? fechaIngreso : inicioPeriodoAguinaldo;
    const fechaFinal = fechaTerminacion < fechaCorteAguinaldo ? fechaTerminacion : fechaCorteAguinaldo;

    let diasTrabajados = Math.floor((fechaFinal.getTime() - inicioReal.getTime()) / (1000 * 60 * 60 * 24));
    diasTrabajados = Math.max(0, diasTrabajados);

    const aguinaldoCompleto = SBD * D;

    // Si laboró todo el período del año
    if (fechaIngreso <= inicioPeriodoAguinaldo && fechaTerminacion >= fechaCorteAguinaldo) {
        return parseFloat(aguinaldoCompleto.toFixed(2));
    }

    // Aguinaldo proporcional usando el año natural (365 días - criterio MTPS)
    const aguinaldoDiario = aguinaldoCompleto / 365;

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

// INDEMNIZACIÓN POR DESPIDO INJUSTIFICADO (Art. 58 C.T.)
function calcularIndemnizacionDespido(
    SBD,
    añosLaborados,
    mesesLaborados,
    sectorEconomico = "comercio"
) {
    // Salario mínimo del sector y tope legal de 4 salarios mínimos diarios
    const salarioMinimoMensual = obtenerSalarioMinimoSector(sectorEconomico);
    const salarioMinimoDiario = salarioMinimoMensual / 30;
    const topeSalarioDiario = salarioMinimoDiario * 4;

    // Aplicar tope de 4 salarios mínimos diarios (Art. 58 inc. 3°)
    const salarioDiarioCalculable = Math.min(SBD, topeSalarioDiario);

    // 30 días de salario por cada año laborado y proporcional por meses (Art. 58 inc. 1°)
    const indemnizacionAños = añosLaborados * salarioDiarioCalculable * 30;
    const indemnizacionFraccion = salarioDiarioCalculable * 30 * (mesesLaborados / 12);

    let indemnizacionTotal = indemnizacionAños + indemnizacionFraccion;

    // Mínimo legal irrenunciable equivalente a 15 días de salario (Art. 58 inc. 2°)
    const indemnizacionMinima = salarioDiarioCalculable * 15;

    if ((añosLaborados > 0 || mesesLaborados > 0) && indemnizacionTotal < indemnizacionMinima) {
        indemnizacionTotal = indemnizacionMinima;
    }

    return parseFloat(indemnizacionTotal.toFixed(2));
}
// PRESTACIÓN ECONÓMICA POR RENUNCIA VOLUNTARIA (Decreto 592)
function calcularIndemnizacionRenuncia(
    SBD,
    añosLaborados,
    mesesLaborados,
    sectorEconomico = "comercio",
    tipoCargo = "operativo", // "jefatura" u "operativo"
    dioAvisoPrevio = "si"    // Recibe "si" o "no" desde la interfaz
) {
    // REQUISITO 1: Mínimo 2 años continuos de servicio (Art. 2)
    if (añosLaborados < 2) {
        return 0;
    }

    // REQUISITO 2: Preaviso obligatorio (Art. 2)
    if (dioAvisoPrevio !== "si") {
        return 0;
    }

    // SALARIO MÍNIMO DEL SECTOR Y TOPE LEGAL (Máximo 2 salarios mínimos diarios del sector - Art. 4)
    const salarioMinimoMensual = obtenerSalarioMinimoSector(sectorEconomico);
    const salarioMinimoDiario = salarioMinimoMensual / 30;
    const topeSalarioDiario = salarioMinimoDiario * 2;

    // Aplicar el tope al salario diario computable
    let salarioDiarioCalculable = Math.min(SBD, topeSalarioDiario);

    // CÁLCULO DE LA PRESTACIÓN: 15 días de salario por cada año de servicio y fracción (Art. 4)
    const indemnizacionAños = añosLaborados * salarioDiarioCalculable * 15;
    const indemnizacionFraccion = salarioDiarioCalculable * 15 * (mesesLaborados / 12);

    return parseFloat((indemnizacionAños + indemnizacionFraccion).toFixed(2));
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