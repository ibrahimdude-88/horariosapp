// ==========================================
// CONFIGURACIÓN
// ==========================================

const CONFIG = {
    // URL de tu Firebase Realtime Database
    FIREBASE_URL: 'https://horariosapp-483a1-default-rtdb.firebaseio.com/appData.json',

    // Hora de envío (formato 24h)
    HORA_ENVIO: 12, // Mediodía

    // Remitente (tu email de Gmail)
    REMITENTE_NOMBRE: 'Sistema de Horarios',
    REMITENTE_EMAIL: 'tu-email@gmail.com', // CAMBIAR POR TU EMAIL

    // Asunto del correo
    ASUNTO: 'Tu Horario para la Próxima Semana'
};

// ==========================================
// DATOS DE HORARIOS
// ==========================================

const scheduleData = [
    {
        id: 1,
        lunes: { time: '05:30 PM - 09:00 PM', location: 'guardia' },
        martes: { time: '05:30 PM - 09:00 PM', location: 'guardia' },
        miercoles: { time: '05:30 PM - 09:00 PM', location: 'guardia' },
        jueves: { time: '05:30 PM - 09:00 PM', location: 'guardia' },
        viernes: { time: '05:00 PM - 09:00 PM', location: 'guardia' },
        sabado: { time: '10:00 AM - 09:00 PM', location: 'guardia' },
        domingo: { time: '10:00 AM - 09:00 PM', location: 'guardia' }
    },
    {
        id: 2,
        lunes: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        martes: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        miercoles: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        jueves: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        viernes: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        sabado: null,
        domingo: null
    },
    {
        id: 3,
        lunes: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        martes: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        miercoles: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        jueves: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        viernes: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        sabado: null,
        domingo: null
    },
    {
        id: 4,
        lunes: { time: '05:30 PM - 09:00 PM', location: 'guardia' },
        martes: { time: '05:30 PM - 09:00 PM', location: 'guardia' },
        miercoles: { time: '05:30 PM - 09:00 PM', location: 'guardia' },
        jueves: { time: '05:30 PM - 09:00 PM', location: 'guardia' },
        viernes: { time: '05:00 PM - 09:00 PM', location: 'guardia' },
        sabado: { time: '10:00 AM - 09:00 PM', location: 'guardia' },
        domingo: { time: '10:00 AM - 09:00 PM', location: 'guardia' }
    },
    {
        id: 5,
        lunes: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        martes: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        miercoles: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        jueves: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        viernes: { time: '10:00 AM - 07:00 PM', location: 'valle' },
        sabado: null,
        domingo: null
    },
    {
        id: 6,
        lunes: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        martes: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        miercoles: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        jueves: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        viernes: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        sabado: null,
        domingo: null
    },
    {
        id: 7,
        lunes: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        martes: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        miercoles: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        jueves: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        viernes: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        sabado: null,
        domingo: null
    }
];

// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================

function enviarHorariosSemanales() {
    try {
        Logger.log('🚀 Iniciando envío de horarios...');

        // 1. Obtener datos de Firebase
        const data = obtenerDatosFirebase();
        if (!data) {
            Logger.log('❌ No se pudieron obtener datos de Firebase');
            return;
        }

        // 2. Calcular la semana siguiente
        const proximaSemana = calcularProximaSemana();
        Logger.log(`📅 Procesando semana: ${proximaSemana.weekNumber} (${proximaSemana.dateRange})`);

        // 3. Obtener eventos de la semana
        const eventosSemanales = obtenerEventosSemana(data.events || {}, proximaSemana);

        // 4. Procesar cada empleado
        const employees = data.employees || [];
        const employeeProfiles = data.employeeProfiles || {};
        let enviados = 0;
        let errores = 0;

        employees.forEach(employeeId => {
            try {
                const profile = employeeProfiles[employeeId];

                if (!profile || !profile.email) {
                    Logger.log(`⚠️ ${employeeId}: No tiene email registrado`);
                    errores++;
                    return;
                }

                // Obtener horario del empleado para la próxima semana
                const horarioEmpleado = obtenerHorarioEmpleado(employeeId, proximaSemana, data);

                // Generar y enviar email
                const htmlBody = generarEmailHTML(profile, horarioEmpleado, eventosSemanales, proximaSemana, data);

                GmailApp.sendEmail(
                    profile.email,
                    CONFIG.ASUNTO,
                    'Por favor habilita HTML para ver este correo.',
                    {
                        htmlBody: htmlBody,
                        name: CONFIG.REMITENTE_NOMBRE
                    }
                );

                Logger.log(`✅ Email enviado a: ${profile.displayName || employeeId} (${profile.email})`);
                enviados++;

            } catch (error) {
                Logger.log(`❌ Error enviando a ${employeeId}: ${error.message}`);
                errores++;
            }
        });

        Logger.log(`\n📊 Resumen:`);
        Logger.log(`   ✅ Enviados: ${enviados}`);
        Logger.log(`   ❌ Errores: ${errores}`);
        Logger.log(`   📧 Total empleados: ${employees.length}`);

    } catch (error) {
        Logger.log(`❌ Error general: ${error.message}`);
        Logger.log(error.stack);
    }
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function obtenerDatosFirebase() {
    try {
        const response = UrlFetchApp.fetch(CONFIG.FIREBASE_URL);
        return JSON.parse(response.getContentText());
    } catch (error) {
        Logger.log(`Error obteniendo datos de Firebase: ${error.message}`);
        return null;
    }
}

function calcularProximaSemana() {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    // Calcular el próximo lunes
    let diasHastaProximoLunes;
    if (diaSemana === 0) { // Si hoy es domingo
        diasHastaProximoLunes = 1; // El próximo lunes es mañana
    } else if (diaSemana === 1) { // Si hoy es lunes
        diasHastaProximoLunes = 7; // El próximo lunes es en 7 días
    } else { // Martes a sábado
        diasHastaProximoLunes = 8 - diaSemana; // Días hasta el próximo lunes
    }

    const proximoLunes = new Date(hoy);
    proximoLunes.setDate(hoy.getDate() + diasHastaProximoLunes);
    proximoLunes.setHours(0, 0, 0, 0); // Normalizar a medianoche

    // Calcular el domingo de esa semana
    const proximoDomingo = new Date(proximoLunes);
    proximoDomingo.setDate(proximoLunes.getDate() + 6);

    // Calcular el offset de semanas desde la fecha de inicio (29 Dic 2025 = Lunes de Semana 1)
    const startDate = new Date(2025, 11, 29); // 29 Dic 2025 (Lunes)
    startDate.setHours(0, 0, 0, 0);

    // Calcular diferencia en semanas desde el inicio hasta el próximo lunes
    const diffTime = proximoLunes.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    const diffWeeks = Math.floor(diffDays / 7);

    return {
        weekNumber: diffWeeks + 1, // +1 porque la primera semana es la semana 1, no 0
        weekOffset: diffWeeks,
        startDate: proximoLunes,
        endDate: proximoDomingo,
        dateRange: formatearRango(proximoLunes, proximoDomingo)
    };
}

function formatearRango(start, end) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${start.getDate()} ${meses[start.getMonth()]} - ${end.getDate()} ${meses[end.getMonth()]}`;
}

function obtenerHorarioEmpleado(employeeId, semana, data) {
    const weekKey = semana.weekOffset.toString();
    const assignments = data.assignments || {};
    const weeklyOverrides = data.weeklyOverrides || {};

    // Determinar qué horario tiene el empleado
    let scheduleId = null;
    let esTemporal = false;
    let comentario = '';

    // Verificar si hay cambio temporal
    if (weeklyOverrides[weekKey] && weeklyOverrides[weekKey][employeeId]) {
        scheduleId = parseInt(weeklyOverrides[weekKey][employeeId].person); // Use the schedule ID from the override
        esTemporal = true;
        comentario = weeklyOverrides[weekKey][employeeId].comment;
    } else {
        // Buscar horario asignado y calcular rotación
        let baseScheduleId = null;
        for (let sid in assignments) {
            if (assignments[sid] === employeeId) {
                baseScheduleId = parseInt(sid);
                break;
            }
        }

        if (baseScheduleId) {
            // Calcular horario rotado
            let rotated = (baseScheduleId - 1 + semana.weekOffset) % 7;
            if (rotated < 0) rotated += 7;
            scheduleId = rotated + 1;
        }
    }

    if (!scheduleId) {
        return {
            horario: 'Sin asignación',
            horarioDetallado: null,
            esTemporal: false
        };
    }

    // Obtener el horario detallado de scheduleData
    const schedule = scheduleData.find(s => s.id === scheduleId);

    return {
        horario: `Horario ${scheduleId}`,
        horarioDetallado: schedule,
        scheduleId: scheduleId,
        esTemporal: esTemporal,
        comentario: comentario
    };
}

function obtenerEventosSemana(events, semana) {
    const eventosEncontrados = [];

    Logger.log(`🔍 Buscando eventos entre ${semana.startDate.toISOString().split('T')[0]} y ${semana.endDate.toISOString().split('T')[0]}`);
    Logger.log(`📋 Total de eventos en base de datos: ${Object.keys(events).length}`);

    // Normalizar las fechas de inicio y fin de la semana (solo fecha, sin hora)
    const weekStart = new Date(semana.startDate);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(semana.endDate);
    weekEnd.setHours(23, 59, 59, 999);

    for (let eventId in events) {
        const evento = events[eventId];

        // Los eventos tienen una propiedad 'date' que contiene la fecha
        if (!evento.date) {
            Logger.log(`  ⚠️ Evento ${eventId} no tiene fecha`);
            continue;
        }

        // Parsear la fecha del evento como fecha local (YYYY-MM-DD)
        const dateStr = evento.date;
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
        const eventDate = new Date(year, month - 1, day); // month - 1 porque los meses son 0-indexed
        eventDate.setHours(12, 0, 0, 0); // Normalizar a mediodía para evitar problemas de zona horaria

        const enRango = eventDate >= weekStart && eventDate <= weekEnd;
        Logger.log(`  Evento: ${dateStr} (${evento.text}) - En rango: ${enRango}`);

        // Comparar solo las fechas
        if (enRango) {
            eventosEncontrados.push({
                fecha: dateStr,
                text: evento.text,
                type: evento.type || 'notice',
                color: evento.color
            });
        }
    }

    return eventosEncontrados.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function generarEmailHTML(profile, horarioEmpleado, eventos, semana, data) {
    const displayName = profile.displayName || 'Empleado';

    // Definir colores para ubicaciones
    const locationColors = {
        'guardia': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
        'valle': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
        'mitras': { bg: '#dcfce7', text: '#166534', border: '#22c55e' }
    };

    const locationNames = {
        'guardia': 'Guardia',
        'valle': 'Valle',
        'mitras': 'Mitras'
    };

    // Generar tabla de horario semanal del empleado
    let tablaHorarioEmpleado = '';
    if (horarioEmpleado.horarioDetallado) {
        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const diasNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        tablaHorarioEmpleado = '<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
        tablaHorarioEmpleado += '<tr style="background: #667eea; color: white;"><th style="padding: 12px; text-align: left; border-radius: 8px 0 0 0;">Día</th><th style="padding: 12px; text-align: left;">Horario</th><th style="padding: 12px; text-align: left; border-radius: 0 8px 0 0;">Ubicación</th></tr>';

        dias.forEach((dia, index) => {
            const dayData = horarioEmpleado.horarioDetallado[dia];
            const bgColor = index % 2 === 0 ? '#f9fafb' : 'white';

            if (dayData) {
                const locationColor = locationColors[dayData.location] || { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
                tablaHorarioEmpleado += `<tr style="background: ${bgColor};"><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>${diasNombres[index]}</strong></td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${dayData.time}</td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><span style="background: ${locationColor.bg}; color: ${locationColor.text}; padding: 4px 12px; border-radius: 12px; font-size: 0.9em; font-weight: 600; border: 1px solid ${locationColor.border};">${locationNames[dayData.location] || dayData.location}</span></td></tr>`;
            } else {
                tablaHorarioEmpleado += `<tr style="background: ${bgColor};"><td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>${diasNombres[index]}</strong></td><td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #9ca3af;" colspan="2">Descanso</td></tr>`;
            }
        });

        tablaHorarioEmpleado += '</table>';
    }

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
    .container { max-width: 650px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 35px 30px; border-radius: 12px 12px 0 0; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 700; }
    .header p { margin: 0; font-size: 16px; opacity: 0.95; }
    .content { background: white; padding: 35px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .section { background: #f9fafb; padding: 25px; margin-bottom: 25px; border-radius: 10px; border: 1px solid #e5e7eb; }
    .section h2 { color: #667eea; margin: 0 0 18px 0; font-size: 20px; font-weight: 700; padding-bottom: 12px; border-bottom: 3px solid #667eea; }
    .horario-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px 24px; border-radius: 10px; text-align: center; font-size: 1.2em; font-weight: 700; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3); }
    .evento { padding: 15px 18px; margin: 12px 0; border-left: 5px solid #667eea; background: white; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .evento strong { color: #667eea; }
    .evento-badge { display: inline-block; background: #667eea; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.75em; font-weight: 700; margin-right: 8px; text-transform: uppercase; }
    .evento-badge.pago { background: #10b981; }
    .evento-badge.festivo { background: #f59e0b; }
    .evento-badge.aviso { background: #ef4444; }
    .footer { text-align: center; color: #6b7280; font-size: 0.85em; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Horario Semanal</h1>
      <p>Semana ${semana.weekNumber} | ${semana.dateRange}</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 8px;">Hola <strong style="color: #667eea;">${displayName}</strong>,</p>
      <p style="color: #6b7280; margin-bottom: 25px;">Este es tu horario para la próxima semana:</p>
      
      <div class="section">
        <h2>Tu Horario</h2>
        <div class="horario-box">
          ${horarioEmpleado.horario}
        </div>
        ${horarioEmpleado.esTemporal ? `<p style="margin: 15px 0 20px 0; padding: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; color: #92400e;"><strong>Cambio Temporal:</strong> ${horarioEmpleado.comentario}</p>` : ''}
        ${tablaHorarioEmpleado}
      </div>
      
      ${eventos.length > 0 ? `
        <div class="section">
          <h2>Eventos de la Semana</h2>
          ${eventos.map(e => {
        // Parsear la fecha correctamente como fecha local
        const [year, month, day] = e.fecha.split('-').map(num => parseInt(num, 10));
        const fecha = new Date(year, month - 1, day);
        const dia = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

        let badgeClass = '';
        let badgeText = '';
        if (e.type === 'holiday') {
            badgeClass = 'festivo';
            badgeText = 'Festivo';
        } else if (e.type === 'alert') {
            badgeClass = 'aviso';
            badgeText = 'Aviso';
        } else if (e.type === 'payday') {
            badgeClass = 'pago';
            badgeText = 'Pago';
        }

        return `<div class="evento">${badgeText ? `<span class="evento-badge ${badgeClass}">${badgeText}</span>` : ''}<strong>${dia}:</strong> ${e.text}</div>`;
    }).join('')}
        </div>
      ` : ''}
      
      <div class="section">
        <h2>Horario General del Equipo</h2>
        ${generarTablaHorarioGeneral(data, semana)}
      </div>
      
      <div class="footer">
        <p style="margin: 5px 0;">Este es un correo automático generado por el Sistema de Horarios.</p>
        <p style="margin: 5px 0;">Si tienes dudas, contacta a tu supervisor.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

    return html;
}

function generarTablaHorarioGeneral(data, semana) {
    const assignments = data.assignments || {};
    const employeeProfiles = data.employeeProfiles || {};
    const weeklyOverrides = data.weeklyOverrides || {};
    const weekKey = semana.weekOffset.toString();

    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const diasNombres = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const locationNames = {
        'guardia': 'Guardia',
        'valle': 'Valle',
        'mitras': 'Mitras'
    };

    const locationColors = {
        'guardia': { bg: '#fef3c7', text: '#92400e' },
        'valle': { bg: '#dbeafe', text: '#1e40af' },
        'mitras': { bg: '#dcfce7', text: '#166534' }
    };

    let tabla = '<table style="width: 100%; border-collapse: collapse; font-size: 0.85em;">';
    tabla += '<tr style="background: #667eea; color: white;"><th style="padding: 10px; text-align: left; border-radius: 8px 0 0 0;">Empleado</th>';

    // Agregar columnas para cada día
    diasNombres.forEach((dia, index) => {
        const isLast = index === diasNombres.length - 1;
        tabla += `<th style="padding: 10px; text-align: center; font-size: 0.85em; ${isLast ? 'border-radius: 0 8px 0 0;' : ''}">${dia}</th>`;
    });
    tabla += '</tr>';

    // Generar fila para cada horario
    for (let i = 1; i <= 7; i++) {
        const bgColor = i % 2 === 0 ? '#f9fafb' : 'white';

        // Determinar quién tiene este horario (considerando rotación y cambios temporales)
        let employeeId = null;
        let displayName = 'Sin asignar';

        // Verificar si hay un cambio temporal para este horario
        if (weeklyOverrides[weekKey] && weeklyOverrides[weekKey][i]) {
            employeeId = weeklyOverrides[weekKey][i].person;
        } else {
            // Calcular rotación inversa para encontrar el empleado base
            let baseId = (i - 1 - semana.weekOffset) % 7;
            if (baseId < 0) baseId += 7;
            baseId += 1;
            employeeId = assignments[baseId];
        }

        if (employeeId && employeeProfiles[employeeId]) {
            displayName = employeeProfiles[employeeId].displayName || employeeId;
        } else if (employeeId) {
            displayName = employeeId;
        }

        // Obtener el horario detallado
        const schedule = scheduleData.find(s => s.id === i);

        tabla += `<tr style="background: ${bgColor};"><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong style="color: #667eea;">${displayName}</strong></td>`;

        // Agregar información de cada día
        dias.forEach(dia => {
            const dayData = schedule ? schedule[dia] : null;
            if (dayData) {
                const locationColor = locationColors[dayData.location] || { bg: '#f3f4f6', text: '#374151' };
                tabla += `<td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 0.7em;"><div style="font-weight: 600; color: #374151; margin-bottom: 2px;">${dayData.time}</div><div style="background: ${locationColor.bg}; color: ${locationColor.text}; padding: 2px 6px; border-radius: 8px; font-weight: 600; display: inline-block;">${locationNames[dayData.location] || dayData.location}</div></td>`;
            } else {
                tabla += `<td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 0.7em;">-</td>`;
            }
        });

        tabla += '</tr>';
    }

    tabla += '</table>';
    return tabla;
}

// ==========================================
// FUNCIÓN DE PRUEBA (Ejecutar manualmente)
// ==========================================

function probarEnvio() {
    Logger.log('🧪 Modo de prueba - Enviando solo al primer empleado con email');

    const data = obtenerDatosFirebase();
    if (!data) {
        Logger.log('❌ No se pudieron obtener datos');
        return;
    }

    const employeeProfiles = data.employeeProfiles || {};
    const employees = data.employees || [];

    // Buscar el primer empleado con email
    for (let employeeId of employees) {
        const profile = employeeProfiles[employeeId];
        if (profile && profile.email) {
            Logger.log(`📧 Enviando email de prueba a: ${profile.displayName} (${profile.email})`);

            const proximaSemana = calcularProximaSemana();
            const eventosSemanales = obtenerEventosSemana(data.events || {}, proximaSemana);
            const horarioEmpleado = obtenerHorarioEmpleado(employeeId, proximaSemana, data);
            const htmlBody = generarEmailHTML(profile, horarioEmpleado, eventosSemanales, proximaSemana, data);

            GmailApp.sendEmail(
                profile.email,
                CONFIG.ASUNTO + ' [PRUEBA]',
                'Por favor habilita HTML para ver este correo.',
                {
                    htmlBody: htmlBody,
                    name: CONFIG.REMITENTE_NOMBRE
                }
            );

            Logger.log('✅ Email de prueba enviado exitosamente');
            return;
        }
    }

    Logger.log('❌ No se encontró ningún empleado con email registrado');
}
