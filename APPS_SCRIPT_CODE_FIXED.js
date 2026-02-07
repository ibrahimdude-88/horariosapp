// ==========================================
// CONFIGURACIÓN
// ==========================================
const CONFIG = {
    FIREBASE_URL: 'https://horariosapp-483a1-default-rtdb.firebaseio.com/appData.json',
    REMITENTE_NOMBRE: 'Sistema de Horarios',
    ASUNTO: 'Tu Horario para la Próxima Semana'
};

// ==========================================
// DATOS DE HORARIOS (Estáticos)
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
// MANEJO DE PETICIONES WEB (DOPOST)
// ==========================================
// Esta función permite que el script reciba datos desde la página web (app.js)
function doPost(e) {
    try {
        // Apps Script a veces recibe los datos en e.postData.contents
        const requestData = JSON.parse(e.postData.contents);

        // Acción: Enviar correo de prueba (desde el botón "Enviar Prueba")
        if (requestData.action === "send_test") {
            GmailApp.sendEmail(
                requestData.recipient,
                requestData.subject,
                "Tu cliente de correo no soporta HTML.",
                {
                    htmlBody: requestData.bodyHtml,
                    name: CONFIG.REMITENTE_NOMBRE
                }
            );

            return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Email enviado" }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Acción desconocida" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ==========================================
// FUNCIÓN PRINCIPAL (Envío Semanal Automatizado)
// ==========================================
function enviarHorariosSemanales() {
    try {
        Logger.log('🚀 Iniciando envío de horarios...');
        const data = obtenerDatosFirebase();
        if (!data) return;

        const proximaSemana = calcularProximaSemana();
        Logger.log(`📅 Procesando semana: ${proximaSemana.weekNumber} (${proximaSemana.dateRange})`);

        const eventosSemanales = obtenerEventosSemana(data.events || {}, proximaSemana);
        const employeeProfiles = data.employeeProfiles || {};
        const employees = data.employees || [];

        let enviados = 0;

        employees.forEach(employeeId => {
            try {
                const profile = employeeProfiles[employeeId];
                if (!profile || !profile.email) {
                    Logger.log(`⚠️ ${employeeId}: Sin email configurado.`);
                    return;
                }

                // Lógica de obtención de horario CORREGIDA
                const horarioInfo = obtenerHorarioEmpleado(employeeId, proximaSemana, data);

                const htmlBody = generarEmailHTML(profile, horarioInfo, eventosSemanales, proximaSemana, data);

                GmailApp.sendEmail(
                    profile.email,
                    CONFIG.ASUNTO,
                    'Habilita HTML para ver este correo.',
                    {
                        htmlBody: htmlBody,
                        name: CONFIG.REMITENTE_NOMBRE
                    }
                );

                Logger.log(`✅ Enviado a: ${employeeId}`);
                enviados++;
            } catch (err) {
                Logger.log(`❌ Error con ${employeeId}: ${err.message}`);
            }
        });

        Logger.log(`RESUMEN: ${enviados} correos enviados.`);

    } catch (e) {
        Logger.log(`EXTREME ERROR: ${e.message}`);
    }
}

// ==========================================
// LÓGICA DE HORARIOS (Corregida)
// ==========================================
function obtenerHorarioEmpleado(personName, semana, data) {
    const weekKey = semana.weekOffset.toString();
    const assignments = data.assignments || {};
    const weeklyOverrides = data.weeklyOverrides || {};

    let finalScheduleId = null;
    let esTemporal = false;
    let comentario = '';

    // 1. REVISAR OVERRIDES DIRECTOS (¿Alguien me movió a mi?)
    if (weeklyOverrides[weekKey]) {
        for (let schId in weeklyOverrides[weekKey]) {
            const override = weeklyOverrides[weekKey][schId];
            if (override.person === personName) {
                finalScheduleId = parseInt(schId);
                esTemporal = true;
                comentario = override.comment;
                break; // Encontrado
            }
        }
    }

    // 2. SI NO HAY OVERRIDE DIRECTO, CALCULAR ROTACIÓN NORMAL
    if (!finalScheduleId) {
        // Buscar cuál es mi horario base (assignments)
        let baseScheduleId = null;
        for (let sid in assignments) {
            if (assignments[sid] === personName) {
                baseScheduleId = parseInt(sid);
                break;
            }
        }

        if (baseScheduleId) {
            // Calcular rotación
            let rotated = (baseScheduleId - 1 + semana.weekOffset) % 7;
            if (rotated < 0) rotated += 7;
            const potentialScheduleId = rotated + 1;

            // 3. VERIFICAR SI ALGUIEN ME QUITÓ ESE LUGAR (Intruso)
            let isDisplaced = false;
            if (weeklyOverrides[weekKey] && weeklyOverrides[weekKey][potentialScheduleId]) {
                const intruder = weeklyOverrides[weekKey][potentialScheduleId].person;
                if (intruder !== personName) {
                    isDisplaced = true;
                }
            }

            if (!isDisplaced) {
                finalScheduleId = potentialScheduleId;
            }
        }
    }

    if (!finalScheduleId) {
        return {
            horario: 'Sin asignación / Libre',
            horarioDetallado: null,
            esTemporal: false
        };
    }

    const schedule = scheduleData.find(s => s.id === finalScheduleId);
    return {
        horario: `Horario ${finalScheduleId}`,
        horarioDetallado: schedule,
        scheduleId: finalScheduleId,
        esTemporal: esTemporal,
        comentario: comentario
    };
}

// ==========================================
// FUNCIONES DE SOPORTE
// ==========================================
function obtenerDatosFirebase() {
    try {
        const res = UrlFetchApp.fetch(CONFIG.FIREBASE_URL);
        return JSON.parse(res.getContentText());
    } catch (e) {
        Logger.log("Error Firebase: " + e);
        return null;
    }
}

function calcularProximaSemana() {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    let diasHastaLunes = (diaSemana === 0) ? 1 : (8 - diaSemana);
    if (diaSemana === 1) diasHastaLunes = 7;

    const proximoLunes = new Date(hoy);
    proximoLunes.setDate(hoy.getDate() + diasHastaLunes);
    proximoLunes.setHours(0, 0, 0, 0);

    const proximoDomingo = new Date(proximoLunes);
    proximoDomingo.setDate(proximoLunes.getDate() + 6);

    // Calcular offset desde fecha base: 29 Dic 2025
    const startDate = new Date(2025, 11, 29);
    const diffTime = proximoLunes.getTime() - startDate.getTime();
    const diffWeeks = Math.floor(diffTime / (24 * 3600 * 1000) / 7);
    const dateRange = `${proximoLunes.getDate()}/${proximoLunes.getMonth() + 1} - ${proximoDomingo.getDate()}/${proximoDomingo.getMonth() + 1}`;

    return {
        weekNumber: diffWeeks + 1,
        weekOffset: diffWeeks,
        startDate: proximoLunes,
        endDate: proximoDomingo,
        dateRange: dateRange
    };
}

function obtenerEventosSemana(events, semana) {
    const encontrados = [];
    const inicio = new Date(semana.startDate);
    const fin = new Date(semana.endDate);
    fin.setHours(23, 59, 59);

    for (let key in events) {
        const ev = events[key];
        const fechaStr = ev.date || (key.match(/^\d{4}-\d{2}-\d{2}$/) ? key : null);

        if (fechaStr) {
            const [y, m, d] = fechaStr.split('-').map(Number);
            const fechaEv = new Date(y, m - 1, d); // Mes 0-index
            if (fechaEv >= inicio && fechaEv <= fin) {
                encontrados.push({
                    fecha: fechaStr,
                    text: ev.text,
                    type: ev.type || 'notice'
                });
            }
        }
    }
    return encontrados.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

// ==========================================
// GENERADORES HTML (Ultra Premium Dark Mode)
// ==========================================

function generateGeneralScheduleHtml(weekOffset, data) {
    const weekKey = weekOffset.toString();
    const daysLabel = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const locationColors = {
        'guardia': { bg: 'rgba(255, 214, 10, 0.2)', text: '#FFD60A' },
        'valle': { bg: 'rgba(10, 132, 255, 0.2)', text: '#0A84FF' },
        'mitras': { bg: 'rgba(48, 209, 88, 0.2)', text: '#30D158' }
    };
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    let html = `
    <div style="margin-top: 30px; background: #2C2C2E; border-radius: 16px; padding: 20px; border: 1px solid #3A3A3C;">
        <h3 style="color: #FFFFFF; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Horario General del Equipo</h3>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: separate; border-spacing: 0; font-size: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <thead>
                    <tr>
                        <th style="padding: 10px; text-align: left; color: #8E8E93; border-bottom: 1px solid #3A3A3C;">Emp</th>
                        ${daysLabel.map(d => `<th style="padding: 10px; text-align: center; color: #8E8E93; border-bottom: 1px solid #3A3A3C;">${d}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>`;

    const assignments = data.assignments || {};
    const weeklyOverrides = data.weeklyOverrides || {};
    const employeeProfiles = data.employeeProfiles || {};

    for (let i = 1; i <= 7; i++) {
        let employeeId = null;
        let displayName = 'Vacante';

        if (weeklyOverrides[weekKey] && weeklyOverrides[weekKey][i]) {
            employeeId = weeklyOverrides[weekKey][i].person;
        } else {
            let baseId = (i - 1 - weekOffset) % 7;
            if (baseId < 0) baseId += 7;
            baseId += 1;
            employeeId = assignments[baseId];
        }

        if (employeeId) {
            const profile = employeeProfiles[employeeId];
            displayName = profile ? (profile.displayName || employeeId) : employeeId;
            displayName = displayName.split(' ')[0];
        }

        const schedule = scheduleData.find(s => s.id === i);
        const borderStyle = i === 7 ? '' : 'border-bottom: 1px solid #3A3A3C;';

        html += `<tr>
            <td style="padding: 8px 4px; ${borderStyle} font-weight: 500; color: #FFFFFF;">${displayName}</td>`;

        days.forEach(d => {
            const dayData = schedule ? schedule[d] : null;
            if (dayData) {
                const loc = dayData.location;
                const colors = locationColors[loc] || { bg: '#3A3A3C', text: '#FFFFFF' };
                html += `
                <td style="padding: 4px; ${borderStyle} text-align: center;">
                    <div style="font-size: 8px; font-weight: 700; color: ${colors.text}; background: ${colors.bg}; border-radius: 4px; padding: 2px 4px; display: inline-block;">
                        ${loc.substring(0, 1).toUpperCase()}
                    </div>
                </td>`;
            } else {
                html += `<td style="padding: 4px; ${borderStyle} text-align: center; color: #48484A;">-</td>`;
            }
        });

        html += `</tr>`;
    }

    html += `</tbody></table></div></div>`;
    return html;
}

function generarEmailHTML(profile, horario, eventos, semana, data) {
    const esTemporal = horario.esTemporal;
    const comentario = horario.comentario;

    // DARK THEME PALETTE
    const colors = {
        bg: '#000000',
        card: '#1C1C1E',
        // Change header gradient if modified
        headerGradient: esTemporal
            ? 'linear-gradient(135deg, #FF9F0A 0%, #FF375F 100%)' // Orange to Red for changes
            : 'linear-gradient(135deg, #5e5ce6 0%, #bf5af2 100%)', // Original Indigo/Purple
        text: '#FFFFFF',
        textSecondary: '#8E8E93',
        border: '#2C2C2E',
        accent: esTemporal ? '#FF9F0A' : '#0A84FF',
        locMitras: { text: '#30D158', bg: 'rgba(48, 209, 88, 0.15)', border: 'rgba(48, 209, 88, 0.3)' },
        locValle: { text: '#0A84FF', bg: 'rgba(10, 132, 255, 0.15)', border: 'rgba(10, 132, 255, 0.3)' },
        locGuardia: { text: '#FFD60A', bg: 'rgba(255, 214, 10, 0.15)', border: 'rgba(255, 214, 10, 0.3)' }
    };

    const getLocStyle = (loc) => {
        if (loc === 'mitras') return colors.locMitras;
        if (loc === 'valle') return colors.locValle;
        if (loc === 'guardia') return colors.locGuardia;
        return { text: '#fff', bg: '#333', border: '#444' };
    };

    let tableRows = '';
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const daysLabel = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    if (horario.horarioDetallado) {
        days.forEach((d, i) => {
            const diaSchedule = horario.horarioDetallado[d];
            const isLast = i === days.length - 1;
            const borderStyle = isLast ? '' : `border-bottom: 1px solid ${colors.border};`;

            if (diaSchedule) {
                const style = getLocStyle(diaSchedule.location);
                tableRows += `
                 <tr>
                    <td style="padding: 12px 0; ${borderStyle} color: ${colors.text}; font-weight: 500;">${daysLabel[i]}</td>
                    <td style="padding: 12px 0; ${borderStyle} color: ${colors.textSecondary}; text-align: center;">${diaSchedule.time}</td>
                    <td style="padding: 12px 0; ${borderStyle} text-align: right;">
                        <span style="background: ${style.bg}; color: ${style.text}; border: 1px solid ${style.border}; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 600; text-transform: capitalize;">
                            ${diaSchedule.location}
                        </span>
                    </td>
                 </tr>`;
            } else {
                tableRows += `
                 <tr>
                    <td style="padding: 12px 0; ${borderStyle} color: ${colors.text}; font-weight: 500;">${daysLabel[i]}</td>
                    <td colspan="2" style="padding: 12px 0; ${borderStyle} color: ${colors.textSecondary}; text-align: right; font-style: italic;">Descanso</td>
                 </tr>`;
            }
        });
    }

    let eventosHtml = '';
    if (eventos.length > 0) {
        eventosHtml = `
        <div style="margin-top: 30px; background: ${colors.card}; border-radius: 16px; padding: 20px; border: 1px solid ${colors.border};">
            <h3 style="color: ${colors.accent}; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid ${colors.accent}; display: inline-block; padding-bottom: 5px;">Eventos de la Semana</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${eventos.map(e => `
                    <li style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        <span style="background: #FF9F0A; color: #000; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">FESTIVO</span>
                        <span style="color: ${colors.textSecondary}; font-size: 13px;">${e.fecha}: ${e.text}</span>
                    </li>
                `).join('')}
            </ul>
        </div>`;
    }

    const generalScheduleHtml = generateGeneralScheduleHtml(semana.weekOffset, data);

    return `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background-color: ${colors.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.bg}; text-align: left;">
            <div style="background: ${colors.headerGradient}; padding: 40px 20px; text-align: center; border-radius: 0 0 24px 24px;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Horario Semanal</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Semana ${semana.weekNumber} | ${semana.dateRange}</p>
                ${esTemporal ? `
                    <div style="margin-top: 15px; display: inline-block; background: rgba(0,0,0,0.3); padding: 5px 12px; border-radius: 20px;">
                        <span style="color: #FFF; font-weight: bold; font-size: 12px;">⚠️ HORARIO MODIFICADO</span>
                    </div>`
            : ''}
            </div>

            <div style="padding: 30px 20px;">
                <p style="color: ${colors.textSecondary}; font-size: 16px; margin-bottom: 30px;">
                    Hola <strong style="color: ${colors.text};">${profile.displayName || 'Equipo'}</strong>,<br>
                    Este es tu horario para la próxima semana:
                </p>

                ${esTemporal ? `
                <div style="background: rgba(255, 159, 10, 0.15); border: 1px solid rgba(255, 159, 10, 0.5); padding: 20px; border-radius: 16px; margin-bottom: 25px; display: flex; align-items: start; gap: 15px;">
                    <span style="font-size: 24px;">📝</span>
                    <div>
                        <strong style="color: #FF9F0A; font-size: 15px; display: block; margin-bottom: 5px;">Nota de Cambio:</strong>
                        <p style="color: #FFFFFF; margin: 0; font-size: 14px; line-height: 1.4;">"${comentario}"</p>
                    </div>
                </div>` : ''}

                <div style="background: ${colors.card}; border-radius: 20px; padding: 25px; border: 1px solid ${esTemporal ? '#FF9F0A' : colors.border}; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; overflow: hidden;">
                    ${esTemporal ? `<div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #FF9F0A;"></div>` : ''}

                    <h3 style="color: ${colors.accent}; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center; justify-content: space-between;">
                        Tu Horario
                        ${esTemporal ? `<span style="font-size: 10px; color: #000; background: #FF9F0A; padding: 2px 8px; border-radius: 10px; font-weight: 800; text-transform: uppercase;">Modificado</span>` : ''}
                    </h3>
                    
                    <div style="background: ${esTemporal ? 'linear-gradient(90deg, #FF9F0A 0%, #FF375F 100%)' : 'linear-gradient(90deg, #5e5ce6 0%, #bf5af2 100%)'}; border-radius: 12px; padding: 15px; text-align: center; margin-bottom: 25px; box-shadow: 0 4px 15px ${esTemporal ? 'rgba(255, 159, 10, 0.3)' : 'rgba(94, 92, 230, 0.3)'};">
                        <span style="color: white; font-weight: 700; font-size: 18px; letter-spacing: 0.5px;">
                            ${horario.horario}
                        </span>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>

                ${eventosHtml}
                
                ${generalScheduleHtml}

                <div style="text-align: center; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
                    <p style="color: #48484A; font-size: 12px;">Sistema de Horarios | Ti_St</p>
                </div>
            </div>
        </div>
    </body>
    </html>`;
}
