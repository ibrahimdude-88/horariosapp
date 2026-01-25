# 📧 Configuración de Envío Automático de Horarios por Email

## 🎯 Objetivo
Enviar automáticamente cada domingo a mediodía un correo a cada empleado con:
- Su horario de la semana siguiente
- El horario general del equipo
- Los eventos programados para esa semana

---

## 📋 Requisitos Previos
1. Cuenta de Gmail/Google Workspace
2. Acceso a Google Apps Script
3. Información de empleados completada en la aplicación (especialmente emails)

---

## 🚀 PASO 1: Crear el Proyecto en Google Apps Script

### 1.1 Acceder a Google Apps Script
1. Ve a [script.google.com](https://script.google.com/)
2. Haz clic en **"Nuevo proyecto"**
3. Renombra el proyecto a: **"Sistema de Horarios - Envío Automático"**

### 1.2 Copiar el Código
Copia y pega el siguiente código en el editor:

```javascript
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
  ASUNTO: '📅 Tu Horario para la Próxima Semana'
};

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
  const proximoDomingo = new Date(hoy);
  proximoDomingo.setDate(hoy.getDate() + (7 - hoy.getDay()));
  
  const startDate = new Date(2025, 11, 29); // 29 Dic 2025
  const diffTime = proximoDomingo.getTime() - startDate.getTime();
  const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
  
  const lunes = new Date(proximoDomingo);
  lunes.setDate(proximoDomingo.getDate() + 1);
  
  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);
  
  return {
    weekNumber: diffWeeks + 1,
    weekOffset: diffWeeks,
    startDate: lunes,
    endDate: domingo,
    dateRange: formatearRango(lunes, domingo)
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
  
  // Verificar si hay cambio temporal
  if (weeklyOverrides[weekKey] && weeklyOverrides[weekKey][employeeId]) {
    return {
      horario: weeklyOverrides[weekKey][employeeId].person,
      esTemporal: true,
      comentario: weeklyOverrides[weekKey][employeeId].comment
    };
  }
  
  // Buscar horario asignado
  for (let scheduleId in assignments) {
    if (assignments[scheduleId] === employeeId) {
      return {
        horario: `Horario ${scheduleId}`,
        esTemporal: false
      };
    }
  }
  
  return {
    horario: 'Sin asignación',
    esTemporal: false
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
    .horario-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 1.2em; font-weight: bold; }
    .evento { padding: 10px; margin: 10px 0; border-left: 4px solid #667eea; background: #f0f0f0; border-radius: 4px; }
    .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 Horario Semanal</h1>
      <p>Semana ${semana.weekNumber} | ${semana.dateRange}</p>
    </div>
    
    <div class="content">
      <p>Hola <strong>${displayName}</strong>,</p>
      <p>Este es tu horario para la próxima semana:</p>
      
      <div class="section">
        <h2>🎯 Tu Horario</h2>
        <div class="horario-box">
          ${horarioEmpleado.horario}
        </div>
        ${horarioEmpleado.esTemporal ? `<p style="margin-top: 15px; color: #d97706;"><strong>⚠️ Cambio Temporal:</strong> ${horarioEmpleado.comentario}</p>` : ''}
      </div>
      
      ${eventos.length > 0 ? `
        <div class="section">
          <h2>📌 Eventos de la Semana</h2>
          ${eventos.map(e => {
            const fecha = new Date(e.fecha);
            const dia = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
            const icono = e.type === 'holiday' ? '🎉' : e.type === 'alert' ? '⚠️' : e.type === 'payday' ? '💰' : 'ℹ️';
            return `<div class="evento">${icono} <strong>${dia}:</strong> ${e.text}</div>`;
          }).join('')}
        </div>
      ` : ''}
      
      <div class="section">
        <h2>👥 Horario General del Equipo</h2>
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
  
  let tabla = '<table style="width: 100%; border-collapse: collapse;">';
  tabla += '<tr style="background: #667eea; color: white;"><th style="padding: 10px; text-align: left;">Horario</th><th style="padding: 10px; text-align: left;">Empleado</th></tr>';
  
  for (let i = 1; i <= 7; i++) {
    const employeeId = assignments[i];
    const displayName = employeeId && employeeProfiles[employeeId] ? employeeProfiles[employeeId].displayName : employeeId || 'Sin asignar';
    const bgColor = i % 2 === 0 ? '#f9f9f9' : 'white';
    tabla += `<tr style="background: ${bgColor};"><td style="padding: 10px; border-bottom: 1px solid #ddd;">Horario ${i}</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${displayName}</td></tr>`;
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
```

---

## 🚀 PASO 2: Configurar el Script

### 2.1 Actualizar Configuración
En la sección `CONFIG` del código, actualiza:

```javascript
REMITENTE_EMAIL: 'tu-email@gmail.com', // CAMBIAR POR TU EMAIL DE GMAIL
```

### 2.2 Guardar el Proyecto
- Haz clic en el ícono del **disco** (💾) o presiona `Ctrl+S`

---

## 🧪 PASO 3: Probar el Envío

### 3.1 Autorizar el Script
1. En el menú superior, selecciona la función: **`probarEnvio`**
2. Haz clic en **"Ejecutar"** (▶️)
3. Aparecerá un mensaje de autorización:
   - Haz clic en **"Revisar permisos"**
   - Selecciona tu cuenta de Google
   - Haz clic en **"Avanzado"**
   - Haz clic en **"Ir a Sistema de Horarios (no seguro)"**
   - Haz clic en **"Permitir"**

### 3.2 Verificar el Envío
1. Ve a la pestaña **"Ejecución"** (ícono de reloj)
2. Verifica que aparezca "✅ Email de prueba enviado exitosamente"
3. Revisa tu bandeja de entrada (o la del empleado de prueba)

---

## ⏰ PASO 4: Programar Envío Automático

### 4.1 Crear Activador (Trigger)
1. En el editor, haz clic en el ícono del **reloj** ⏰ (Activadores)
2. Haz clic en **"+ Agregar activador"** (abajo a la derecha)
3. Configura:
   - **Función a ejecutar:** `enviarHorariosSemanales`
   - **Origen del evento:** `Controlado por tiempo`
   - **Tipo de activador:** `Activador semanal`
   - **Día de la semana:** `Domingo`
   - **Hora del día:** `12 p.m. a 1 p.m.`
4. Haz clic en **"Guardar"**

### 4.2 Verificar Activador
- Deberías ver el activador en la lista
- Estado: Activo ✅

---

## 📊 PASO 5: Monitorear Envíos

### Ver Registros
1. Ve a **"Ejecución"** en el menú lateral
2. Verás un historial de todas las ejecuciones
3. Haz clic en cualquier ejecución para ver los detalles

### Ver Errores
- Si hay errores, aparecerán en rojo
- Haz clic para ver el mensaje de error detallado

---

## ✅ Checklist Final

Antes del primer envío automático, asegúrate de:

- [ ] Todos los empleados tienen email registrado en la app
- [ ] Has probado el envío con `probarEnvio()`
- [ ] El activador está configurado para domingos a mediodía
- [ ] Has verificado que los correos se ven bien en HTML
- [ ] La URL de Firebase es correcta en CONFIG

---

## 🔧 Solución de Problemas

### Problema: "No se pudieron obtener datos de Firebase"
**Solución:** Verifica que la URL de Firebase sea correcta y que las reglas de Firebase permitan lectura pública.

### Problema: "Email no enviado"
**Solución:** 
1. Verifica que el email del empleado sea válido
2. Revisa la carpeta de spam
3. Verifica los límites de Gmail (500 emails/día)

### Problema: "Error de autorización"
**Solución:** Vuelve a ejecutar el script y autoriza nuevamente los permisos.

---

## 📧 Límites de Gmail

- **Cuentas Gmail gratuitas:** 500 destinatarios/día
- **Google Workspace:** 2000 destinatarios/día

Si tienes más empleados, considera usar SendGrid o similar.

---

## 🎉 ¡Listo!

Tu sistema ahora enviará automáticamente los horarios cada domingo a mediodía. Los empleados recibirán un correo profesional con:
- Su horario específico
- Eventos de la semana
- Horario general del equipo

¿Necesitas ayuda? Revisa los logs en Google Apps Script o contacta al administrador del sistema.
