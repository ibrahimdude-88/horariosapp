
// ==========================================
// GENERADOR DE HTML DE CORREO LOCAL
// ==========================================

function generateEmailHtmlForEmployee(employeeId) {
    // 1. Obtener la semana actual
    const weekOffset = state.currentWeekOffset;
    const weekStart = getWeekStartDate(weekOffset);
    const weekEnd = getWeekEndDate(weekOffset);
    const dateRange = `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;

    // 2. Obtener el horario calculado para la persona (ya con overrides aplicados)
    const scheduleId = getScheduleForPerson(employeeId, weekOffset);

    // 3. Obtener el objeto de horario detallado
    const schedule = scheduleData.find(s => s.id === scheduleId);

    // 4. Perfil del empleado
    const profile = state.employeeProfiles[employeeId] || {};
    const displayName = profile.displayName || employeeId;

    // 5. Detectar si es un cambio temporal
    const weekKey = weekOffset.toString();
    let esTemporal = false;
    let comentario = '';

    // Verificar override directo
    if (state.weeklyOverrides[weekKey]) {
        // En local es weeklyOverrides[week][scheduleId] = { person: "Nombre", comment: "..." }
        // Hay que buscar si 'employeeId' es el valor 'person' de algún schedule
        for (const [schId, data] of Object.entries(state.weeklyOverrides[weekKey])) {
            if (data.person === employeeId) {
                // Confirmamos que tiene un override
                if (parseInt(schId) === scheduleId) {
                    esTemporal = true;
                    comentario = data.comment;
                }
            }
        }
    }

    // Estilos CSS inline para email
    const styles = {
        box: 'background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;',
        header: 'background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;',
        table: 'width: 100%; border-collapse: collapse; font-size: 14px; font-family: sans-serif;',
        th: 'text-align: left; padding: 8px; border-bottom: 2px solid #ddd; background: #eef2ff;',
        td: 'padding: 8px; border-bottom: 1px solid #eee;',
        change: 'background: #fffbeb; color: #b45309; padding: 10px; border-left: 4px solid #f59e0b; margin: 10px 0;'
    };

    // Generar tabla
    let tableHtml = `<table style="${styles.table}">
        <thead><tr><th style="${styles.th}">Día</th><th style="${styles.th}">Horario</th><th style="${styles.th}">Ubicación</th></tr></thead>
        <tbody>`;

    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const daysLabel = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    if (schedule) {
        days.forEach((d, i) => {
            const diaSchedule = schedule[d];
            if (diaSchedule) {
                tableHtml += `<tr>
                    <td style="${styles.td}"><strong>${daysLabel[i]}</strong></td>
                    <td style="${styles.td}">${diaSchedule.time}</td>
                    <td style="${styles.td}">${diaSchedule.location.toUpperCase()}</td>
                 </tr>`;
            } else {
                tableHtml += `<tr>
                    <td style="${styles.td}"><strong>${daysLabel[i]}</strong></td>
                    <td style="${styles.td}" colspan="2">Descanso</td>
                 </tr>`;
            }
        });
    } else {
        tableHtml += `<tr><td colspan="3" style="${styles.td}">Sin asignación esta semana</td></tr>`;
    }
    tableHtml += '</tbody></table>';

    // Generar bloque de eventos (reutilizando la lógica de visualización local)
    // Convertimos state.events a array filtrado por fecha
    let eventosHtml = '';
    const events = [];
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    if (state.events) {
        Object.values(state.events).forEach(ev => {
            // Compatibilidad fecha
            const d = ev.date;
            if (d && d >= weekStartStr && d <= weekEndStr) {
                events.push(ev);
            }
        });
    }

    if (events.length > 0) {
        eventosHtml = `<div style="${styles.box}">
            <h3 style="margin-top:0;">📅 Eventos y Avisos</h3>
            <ul style="padding-left: 20px;">
                ${events.map(e => `<li><strong>${e.date}:</strong> ${e.text}</li>`).join('')}
            </ul>
        </div>`;
    }

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="${styles.header}">
            <h2 style="margin:0;">Horario Semanal [PRUEBA]</h2>
            <p style="margin:5px 0 0;">Semana ${weekOffset + 1} (${dateRange})</p>
        </div>
        <div style="padding: 20px;">
            <p>Hola <strong>${displayName}</strong>,</p>
            <p>Este es un correo de prueba generado desde la aplicación para verificar los datos.</p>
            
            ${esTemporal ? `<div style="${styles.change}"><strong>⚠️ Cambio Temporal:</strong> ${comentario}</div>` : ''}
            
            ${eventosHtml}

            <h3 style="color: #4f46e5;">Tu Horario Asignado: ${schedule ? 'Horario ' + schedule.id : 'Sin Asignación'}</h3>
            ${tableHtml}

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">Sistema de Horarios Ti_St</p>
        </div>
    </div>
    `;
}
