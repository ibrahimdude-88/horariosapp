# Sistema de Horarios Rotativos 2026

## 🎉 Versión con localStorage (Sin Firebase)

Esta versión de la aplicación funciona completamente **offline** usando `localStorage` del navegador.

---

## 📋 Datos de Prueba Precargados

La aplicación viene con los siguientes datos de ejemplo:

### **Empleados Registrados:**
1. Juan Pérez
2. María García
3. Carlos López
4. Ana Martínez
5. Luis Rodríguez
6. Sofia Torres
7. Miguel Sánchez
8. Laura Fernández
9. Pedro Ramírez

### **Asignaciones Base (Horarios 1-7):**
- Horario 1: Juan Pérez
- Horario 2: María García
- Horario 3: Carlos López
- Horario 4: Ana Martínez
- Horario 5: Luis Rodríguez
- Horario 6: Sofia Torres
- Horario 7: Miguel Sánchez

### **Vacaciones Precargadas:**
- **María García**: 13-17 de Enero 2026
- **Carlos López**: 20-24 de Enero 2026

---

## 🚀 Cómo Usar

### **1. Abrir la Aplicación**
Simplemente abre el archivo `index.html` en tu navegador favorito.

### **2. Acceso de Administrador**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### **3. Funcionalidades Disponibles**

#### **Para Todos los Usuarios:**
- ✅ Ver "Mi Horario" individual
- ✅ Ver "Horario General" de todos
- ✅ Navegar entre semanas
- ✅ Ver días de vacaciones marcados

#### **Para Administradores:**
- ✅ Gestionar asignaciones de empleados
- ✅ Hacer cambios temporales de guardia
- ✅ **Gestionar vacaciones** (NUEVO)
- ✅ Editar títulos y etiquetas
- ✅ Agregar nuevos empleados

---

## 🏖️ Gestión de Vacaciones

### **Cómo Asignar Vacaciones:**
1. Iniciar sesión como administrador
2. Ir a "Configuración de Horarios"
3. Clic en **"Gestionar Vacaciones"**
4. Seleccionar empleado
5. Elegir fecha de inicio y fin
6. Clic en "Agregar Vacaciones"

### **Visualización de Vacaciones:**

#### **En "Mi Horario":**
- 🏖️ Alerta amarilla indicando vacaciones
- Badge "VACACIONES" en cada día
- Tarjetas resaltadas con borde amarillo
- Texto "🏖️ Día de vacaciones"

#### **En "Horario General":**
- 🏖️ Badge pequeño junto al nombre
- Fila resaltada en amarillo claro
- Celdas marcadas como "VACACIONES"

#### **En "Configuración":**
- 🏖️ Indicador de vacaciones
- Días marcados en las celdas

---

## 💾 Almacenamiento de Datos

### **localStorage**
Todos los datos se guardan automáticamente en el navegador:
- ✅ Asignaciones de empleados
- ✅ Cambios temporales
- ✅ Vacaciones programadas
- ✅ Títulos personalizados
- ✅ Lista de empleados

### **Persistencia**
Los datos permanecen guardados incluso después de:
- Cerrar el navegador
- Recargar la página
- Apagar la computadora

### **Limpiar Datos**
Para resetear la aplicación a los datos iniciales:
1. Abre la consola del navegador (F12)
2. Escribe: `localStorage.removeItem('horariosAppData')`
3. Recarga la página

---

## 🎨 Características Visuales

### **Indicadores de Color:**
- 🔵 **Azul** - Ubicación Guardia
- 🟢 **Verde** - Ubicación Valle
- 🟡 **Amarillo** - Ubicación Mitras
- ⚪ **Gris** - Día de descanso
- 🟠 **Naranja** - Vacaciones

### **Modo Oscuro:**
- Toggle en la esquina superior derecha
- Todos los elementos compatibles
- Preferencia guardada en localStorage

---

## 📱 Compatibilidad

- ✅ Chrome / Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Responsive (móvil y escritorio)

---

## 🔧 Tecnologías

- **HTML5** - Estructura
- **CSS3** - Estilos modernos con variables
- **JavaScript Vanilla** - Lógica sin frameworks
- **localStorage** - Persistencia de datos

---

## 📝 Notas Importantes

1. **Sin conexión a internet:** La aplicación funciona completamente offline
2. **Datos locales:** Los datos solo existen en tu navegador
3. **No hay sincronización:** Cada navegador tiene sus propios datos
4. **Privacidad:** Ningún dato se envía a servidores externos

---

## 🆘 Solución de Problemas

### **No veo los datos de prueba:**
- Abre la consola (F12) y busca errores
- Verifica que JavaScript esté habilitado
- Intenta limpiar localStorage y recargar

### **Los cambios no se guardan:**
- Verifica que localStorage esté habilitado
- Algunos navegadores en modo incógnito no guardan datos
- Revisa la consola por errores

### **Las vacaciones no aparecen:**
- Asegúrate de estar en la semana correcta
- Verifica que las fechas estén bien configuradas
- Recarga la página

---

## 📞 Soporte

Para reportar problemas o sugerencias, revisa la consola del navegador (F12) para ver mensajes de depuración.

---

**Versión:** 2.0 (localStorage)  
**Última actualización:** Enero 2026  
**Estado:** ✅ Completamente funcional
