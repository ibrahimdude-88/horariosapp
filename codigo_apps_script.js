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

    for (let dateStr in events) {
        const eventDate = new Date(dateStr);
        if (eventDate >= semana.startDate && eventDate <= semana.endDate) {
            eventosEncontrados.push({
                fecha: dateStr,
                ...events[dateStr]
            });
        }
    }

    return eventosEncontrados.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function generarEmailHTML(profile, horarioEmpleado, eventos, semana, data) {
    const displayName = profile.displayName || 'Empleado';

    // Generar tabla de horario semanal del empleado
    let tablaHorarioEmpleado = '';
    if (horarioEmpleado.horarioDetallado) {
        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const diasNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const locationNames = {
            'guardia': 'Guardia',
            'valle': 'Valle',
            'mitras': 'Mitras'
        };

        tablaHorarioEmpleado = '<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
        tablaHorarioEmpleado += '<tr style="background: #667eea; color: white;"><th style="padding: 10px; text-align: left;">Día</th><th style="padding: 10px; text-align: left;">Horario</th><th style="padding: 10px; text-align: left;">Ubicación</th></tr>';

        dias.forEach((dia, index) => {
            const dayData = horarioEmpleado.horarioDetallado[dia];
            const bgColor = index % 2 === 0 ? '#f9f9f9' : 'white';

            if (dayData) {
                tablaHorarioEmpleado += `<tr style="background: ${bgColor};"><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>${diasNombres[index]}</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${dayData.time}</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${locationNames[dayData.location] || dayData.location}</td></tr>`;
            } else {
                tablaHorarioEmpleado += `<tr style="background: ${bgColor};"><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>${diasNombres[index]}</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd; color: #999;" colspan="2">Descanso</td></tr>`;
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
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section h2 { color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    .horario-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 20px; border-radius: 8px; text-align: center; font-size: 1.1em; font-weight: bold; margin-bottom: 15px; }
    .evento { padding: 10px; margin: 10px 0; border-left: 4px solid #667eea; background: #f0f0f0; border-radius: 4px; }
    .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Horario Semanal</h1>
      <p>Semana ${semana.weekNumber} | ${semana.dateRange}</p>
    </div>
    
    <div class="content">
      <p>Hola <strong>${displayName}</strong>,</p>
      <p>Este es tu horario para la próxima semana:</p>
      
      <div class="section">
        <h2>Tu Horario</h2>
        <div class="horario-box">
          ${horarioEmpleado.horario}
        </div>
        ${horarioEmpleado.esTemporal ? `<p style="margin-top: 15px; color: #d97706;"><strong>Cambio Temporal:</strong> ${horarioEmpleado.comentario}</p>` : ''}
        ${tablaHorarioEmpleado}
      </div>
      
      ${eventos.length > 0 ? `
        <div class="section">
          <h2>Eventos de la Semana</h2>
          ${eventos.map(e => {
        const fecha = new Date(e.fecha);
        const dia = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        const icono = e.type === 'holiday' ? '[Festivo] ' : e.type === 'alert' ? '[Aviso] ' : e.type === 'payday' ? '[Pago] ' : '';
        return `<div class="evento">${icono}<strong>${dia}:</strong> ${e.text}</div>`;
    }).join('')}
        </div>
      ` : ''}
      
      <div class="section">
        <h2>Horario General del Equipo</h2>
        ${generarTablaHorarioGeneral(data, semana)}
      </div>
      
      <div class="footer">
        <p>Este es un correo automático generado por el Sistema de Horarios.</p>
        <p>Si tienes dudas, contacta a tu supervisor.</p>
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

    let tabla = '<table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">';
    tabla += '<tr style="background: #667eea; color: white;"><th style="padding: 8px; text-align: left;">Horario</th><th style="padding: 8px; text-align: left;">Empleado</th>';

    // Agregar columnas para cada día
    diasNombres.forEach(dia => {
        tabla += `<th style="padding: 8px; text-align: center; font-size: 0.85em;">${dia}</th>`;
    });
    tabla += '</tr>';

    // Generar fila para cada horario
    for (let i = 1; i <= 7; i++) {
        const bgColor = i % 2 === 0 ? '#f9f9f9' : 'white';

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

        tabla += `<tr style="background: ${bgColor};"><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Horario ${i}</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${displayName}</td>`;

        // Agregar información de cada día
        dias.forEach(dia => {
            const dayData = schedule ? schedule[dia] : null;
            if (dayData) {
                tabla += `<td style="padding: 6px; border-bottom: 1px solid #ddd; text-align: center; font-size: 0.75em;"><div style="font-weight: bold;">${dayData.time}</div><div style="color: #666;">${locationNames[dayData.location] || dayData.location}</div></td>`;
            } else {
                tabla += `<td style="padding: 6px; border-bottom: 1px solid #ddd; text-align: center; color: #999; font-size: 0.75em;">-</td>`;
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
