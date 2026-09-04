// ==========================================
// CONFIGURACIÓN DE FIREBASE
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyAByMa3YyhoHCrXTX_ZsH4TW00mxdly-GY",
    authDomain: "horariosapp-483a1.firebaseapp.com",
    databaseURL: "https://horariosapp-483a1-default-rtdb.firebaseio.com",
    projectId: "horariosapp-483a1",
    storageBucket: "horariosapp-483a1.firebasestorage.app",
    messagingSenderId: "495004744128",
    appId: "1:495004744128:web:9293d6c06419b4d9c5f025"
};

let db; // Referencia a la base de datos

// ==========================================
// DATOS ESTÁTICOS Y ESTADO
// ==========================================

const scheduleData = [
    {
        id: 1,
        name: '1º Guardia',
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
        name: '2º Valle',
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
        name: '3º Mitras',
        lunes: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        martes: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        miercoles: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        jueves: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        viernes: { time: '08:30 AM - 05:30 PM', location: 'mitras' },
        sabado: null,
        domingo: null
    },
    {
        id: 4,
        name: '4º Guardia',
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
        name: '5º Valle',
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
        name: '6º Mitras',
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
        name: 'Fijo Mitras (Fernando Gomez)',
        lunes: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        martes: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        miercoles: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        jueves: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        viernes: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        sabado: null,
        domingo: null
    },
    {
        id: 8,
        name: 'Fijo Mitras (Roberto Lombart)',
        lunes: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        martes: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        miercoles: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        jueves: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        viernes: { time: '10:00 AM - 07:00 PM', location: 'mitras' },
        sabado: null,
        domingo: null
    }
];

// Estado Local (se sincroniza con Firebase)
let state = {
    assignments: {},
    weeklyOverrides: {},
    employees: [],
    employeeProfiles: {}, // { employeeName: { displayName: 'Name', phone: '123', email: 'email@example.com', notes: 'text' } }
    customTitles: {},
    vacations: {}, // { employeeName: [{ startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }] }
    locationChanges: {}, // { weekOffset: { employeeName: { days: [0,1,2], originalLocation: 'valle', newLocation: 'mitras', reason: 'text' } } }
    events: {}, // { dateString: { text: "...", type: "holiday|notice|payday", color: "..." } }
    currentWeekOffset: 0,
    startDate: new Date(2025, 11, 29), // 29 Dic 2025
    isAdmin: false
};

// DOM Elements
const elements = {
    tabs: document.querySelectorAll('.tab-button'),
    contents: document.querySelectorAll('.tab-content'),
    configTableBody: document.getElementById('configTableBody'),
    assignModal: document.getElementById('assignModal'),
    swapModal: document.getElementById('swapModal'),
    loginModal: document.getElementById('loginModal'),
    vacationsModal: document.getElementById('vacationsModal'),
    locationChangeModal: document.getElementById('locationChangeModal'),
    assignNameInput: document.getElementById('assignNameInput'),
    swapPersonSelect: document.getElementById('swapPersonSelect'),
    swapReason: document.getElementById('swapReason'),
    themeToggle: document.getElementById('themeToggle'),
    loginBtn: document.getElementById('loginBtn'),
    doLoginBtn: document.getElementById('doLoginBtn'),
    manageAssignmentsBtn: document.getElementById('manageAssignmentsBtn'),
    manageVacationsBtn: document.getElementById('manageVacationsBtn'),
    manageLocationChangesBtn: document.getElementById('manageLocationChangesBtn'),
    resetDatabaseBtn: document.getElementById('resetDatabaseBtn'),
    configTabBtn: document.getElementById('configTabBtn'),
    // Week Displays
    weekDisplays: {
        config: document.getElementById('weekDisplayConfig'),
        ind: document.getElementById('weekDisplayInd'),
        gen: document.getElementById('weekDisplayGen')
    },
    dateRanges: {
        config: document.getElementById('dateRangeConfig'),
        ind: document.getElementById('dateRangeInd'),
        gen: document.getElementById('dateRangeGen')
    }
};

let currentEditingScheduleId = null;
let currentSwapData = null;

// ==========================================
// INICIALIZACIÓN Y SINCRONIZACIÓN
// ==========================================

// ==========================================
// DATOS ESTÁTICOS Y ESTADO
// ==========================================

/* state definido más abajo */

// ==========================================
// INICIALIZACIÓN Y SINCRONIZACIÓN
// ==========================================

// Datos iniciales LIMPIOS (App como nueva)
const initialData = {
    assignments: {},
    employees: [],
    weeklyOverrides: {},
    customTitles: {},
    vacations: {},
    locationChanges: {},
    events: {}
};

function init() {
    // Inicializar Firebase
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        console.log("✅ Firebase inicializado");
    } catch (e) {
        console.error("Error inicializando Firebase:", e);
        alert("Error de conexión con la base de datos.");
        return;
    }

    setupEventListeners();
    initTheme();

    // Calcular semana actual
    const weeksFromStart = getWeeksFromStart(new Date());
    state.currentWeekOffset = weeksFromStart < 0 ? 0 : weeksFromStart;

    toggleAdminView(false);
    switchTab('individual');

    // Cargar datos desde Firebase (Realtime)
    loadFromFirebase();
}

// Función para cargar/sincronizar datos desde Firebase
function loadFromFirebase() {
    const ref = db.ref('appData');

    // Escuchar cambios en tiempo real
    ref.on('value', (snapshot) => {
        const data = snapshot.val();

        if (data) {
            state.assignments = data.assignments || {};
            state.weeklyOverrides = data.weeklyOverrides || {};
            state.employees = data.employees || [];
            state.employeeProfiles = data.employeeProfiles || {};
            state.customTitles = data.customTitles || {};
            state.vacations = data.vacations || {};
            state.locationChanges = data.locationChanges || {};
            state.events = data.events || {};

            if (!state.assignments[7]) state.assignments[7] = 'Fernando Gomez';
            if (!state.assignments[8]) state.assignments[8] = 'Roberto Lombart';
            if (!state.employees.includes('Fernando Gomez')) state.employees.push('Fernando Gomez');
            if (!state.employees.includes('Roberto Lombart')) state.employees.push('Roberto Lombart');

            console.log("📡 Datos sincronizados desde Firebase");
        } else {
            console.log("⚠️ Base de datos vacía, usando estado limpio.");
            state.assignments[7] = 'Fernando Gomez';
            state.assignments[8] = 'Roberto Lombart';
            state.employees = ['Fernando Gomez', 'Roberto Lombart'];
        }

        // Re-renderizar la interfaz cada vez que llegan datos
        applyCustomTitles();
        renderAll();
        // Si el modal de eventos está abierto, refrescar la lista
        try { renderEventsList(); } catch (e) { }
    }, (error) => {
        console.error("Error leyendo de Firebase:", error);
    });
}

// Función para guardar en Firebase
function saveToLocalStorage() { // Mantengo el nombre para no romper llamadas existentes, pero guarda en Firebase
    const dataToSave = {
        assignments: state.assignments,
        weeklyOverrides: state.weeklyOverrides,
        employees: state.employees,
        employeeProfiles: state.employeeProfiles,
        customTitles: state.customTitles,
        vacations: state.vacations,
        locationChanges: state.locationChanges,
        events: state.events
    };

    db.ref('appData').set(dataToSave)
        .then(() => console.log("☁️ Datos guardados en Firebase"))
        .catch(e => {
            console.error("Error guardando en Firebase:", e);
            alert("⚠️ Error al guardar cambios.\nPosible causa: Permisos de Firebase insuficientes.");
        });
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    ['Config', 'Ind', 'Gen'].forEach(suffix => {
        document.getElementById(`prevWeek${suffix}`).addEventListener('click', () => changeWeek(-1));
        document.getElementById(`nextWeek${suffix}`).addEventListener('click', () => changeWeek(1));
        document.getElementById(`todayBtn${suffix}`).addEventListener('click', goToToday);
    });

    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-mode');
            document.body.classList.toggle('dark-mode', !isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', () => {
            if (state.isAdmin) {
                // Logout
                state.isAdmin = false;
                toggleAdminView(false);
                switchTab('individual');
                alert('Sesión cerrada');
            } else {
                openModal('loginModal');
                document.getElementById('loginPass').value = '';
                document.getElementById('loginError').style.display = 'none';
                document.getElementById('loginPass').focus();
            }
        });
    }

    if (elements.doLoginBtn) {
        elements.doLoginBtn.addEventListener('click', checkLogin);
    }

    // Agregar soporte para Enter en el login
    const loginPassInput = document.getElementById('loginPass');
    if (loginPassInput) {
        loginPassInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkLogin();
            }
        });
    }

    if (elements.manageAssignmentsBtn) {
        elements.manageAssignmentsBtn.addEventListener('click', openManageAssignments);
    }

    const manageEmployeesBtn = document.getElementById('manageEmployeesBtn');
    if (manageEmployeesBtn) {
        manageEmployeesBtn.addEventListener('click', openManageEmployees);
    }

    if (elements.manageVacationsBtn) {
        elements.manageVacationsBtn.addEventListener('click', openManageVacations);
    }

    if (elements.manageLocationChangesBtn) {
        elements.manageLocationChangesBtn.addEventListener('click', openManageLocationChanges);
    }

    if (elements.resetDatabaseBtn) {
        elements.resetDatabaseBtn.addEventListener('click', () => {
            showConfirmDialog('⚠️ ¿ESTÁS SEGURO? Esto borrará TODOS los datos (empleados, horarios, eventos) de la base de datos permanentemente.', () => {
                // Doble confirmación por seguridad
                showConfirmDialog('¿Realmente seguro? No se puede deshacer.', resetDatabase);
            });
        });
    }

    // Botón de gestión de eventos
    const manageEventsBtn = document.getElementById('manageEventsBtn');
    if (manageEventsBtn) {
        manageEventsBtn.addEventListener('click', openManageEvents);
    }

    // Botón de guardar evento
    const saveEventBtn = document.getElementById('saveEventBtn');
    if (saveEventBtn) {
        saveEventBtn.addEventListener('click', saveEvent);
    }

    // Botón de cambiar contraseña
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', openChangePassword);
    }

    // Botón de guardar contraseña
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', saveNewPassword);
    }

    // Botón de gestionar cambios temporales
    const manageTempChangesBtn = document.getElementById('manageTempChangesBtn');
    if (manageTempChangesBtn) {
        manageTempChangesBtn.addEventListener('click', openManageTempChanges);
    }

    const aboutBtn = document.getElementById('aboutBtn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => openModal('aboutModal'));
    }

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    document.getElementById('saveAssignBtn').addEventListener('click', saveAssignment);

    const saveSwapBtn = document.getElementById('saveSwapBtn');
    if (saveSwapBtn) {
        const newBtn = saveSwapBtn.cloneNode(true);
        saveSwapBtn.parentNode.replaceChild(newBtn, saveSwapBtn);
        newBtn.addEventListener('click', saveSwap);
    }
}

function getAdminPassword() {
    return localStorage.getItem('adminPassword') || 'admin123';
}

function setAdminPassword(newPassword) {
    localStorage.setItem('adminPassword', newPassword);
}

function checkLogin() {
    const pass = document.getElementById('loginPass').value;
    const adminPassword = getAdminPassword();

    if (pass === adminPassword) {
        state.isAdmin = true;
        toggleAdminView(true);
        closeModal();
        switchTab('config');

        // Limpiar campos
        document.getElementById('loginPass').value = '';
        document.getElementById('loginError').style.display = 'none';
        document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos';
    } else {
        const errorEl = document.getElementById('loginError');
        errorEl.textContent = 'Contraseña incorrecta';
        errorEl.style.display = 'block';
    }
}

function toggleAdminView(show) {
    if (show) {
        elements.configTabBtn.style.display = 'flex';
        elements.loginBtn.style.color = 'var(--primary)';
        enableEditing(true);
    } else {
        elements.configTabBtn.style.display = 'none';
        elements.loginBtn.style.color = '';
        enableEditing(false);
    }
}

// ==========================================
// LÓGICA DE EDICIÓN DE TÍTULOS (FIREBASE)
// ==========================================

function applyCustomTitles() {
    if (!state.customTitles) state.customTitles = {};
    document.querySelectorAll('[data-editable-id]').forEach(el => {
        const id = el.dataset.editableId;
        if (state.customTitles[id]) {
            el.textContent = state.customTitles[id];
        }
    });
}

let saveTimeout;

function enableEditing(enable) {
    const editables = document.querySelectorAll('[data-editable-id]');
    editables.forEach(el => {
        if (enable) {
            el.contentEditable = 'true';
            el.classList.add('editable-highlight');
            el.addEventListener('input', handleTitleInput);
            el.addEventListener('keydown', handleTitleKeydown);
        } else {
            el.contentEditable = 'false';
            el.classList.remove('editable-highlight');
            el.removeEventListener('input', handleTitleInput);
            el.removeEventListener('keydown', handleTitleKeydown);
        }
    });
}

function handleTitleInput(e) {
    const el = e.target;
    const id = el.dataset.editableId;
    const newText = el.textContent.trim();

    el.style.borderColor = '#fbbf24'; // Editando

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveTitleChange(el, id, newText);
    }, 800);
}

function saveTitleChange(el, id, newText) {
    if (id) {
        state.customTitles[id] = newText;

        // Guardar en localStorage
        saveToLocalStorage();

        // Feedback visual
        el.style.transition = 'border-color 0.3s, background-color 0.3s';
        el.style.borderColor = '#10b981'; // Guardado

        setTimeout(() => {
            if (document.activeElement !== el) {
                el.style.borderColor = '';
            } else {
                el.style.borderColor = 'var(--primary)';
            }
        }, 1000);
    }
}

function handleTitleKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
        const el = e.target;
        saveTitleChange(el, el.dataset.editableId, el.textContent.trim());
    }
}

// ==========================================
// LÓGICA DE NEGOCIO (SEMANAS, ROTACIÓN)
// ==========================================

function getWeeksFromStart(date) {
    const start = new Date(state.startDate);
    start.setHours(0, 0, 0, 0);
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);
    const diffTime = current - start;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
}

function changeWeek(offset) {
    state.currentWeekOffset += offset;
    renderAll();
}

function goToToday() {
    state.currentWeekOffset = getWeeksFromStart(new Date());
    renderAll();
}

function getWeekDateRange(offset) {
    const start = new Date(state.startDate);
    start.setDate(start.getDate() + (offset * 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const options = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('es-ES', options)} - ${end.toLocaleDateString('es-ES', options)}`;
}

function getRotatedScheduleId(baseId, weekOffset) {
    if (baseId >= 7) return baseId;
    let rotated = (baseId - 1 + weekOffset) % 6;
    if (rotated < 0) rotated += 6;
    return rotated + 1;
}

// Helper: ¿El override está activo en este día?
// Si no tiene campo 'days' o está vacío, se trata como semana completa (retrocompatible)
function isOverrideActiveOnDay(overrideData, dayIndex) {
    if (dayIndex === null || dayIndex === undefined) return true;
    if (!overrideData.days || overrideData.days.length === 0) return true;
    return overrideData.days.includes(dayIndex);
}

function getScheduleForPerson(personName, weekOffset, dayIndex) {
    let baseScheduleId = null;
    for (const [id, name] of Object.entries(state.assignments)) {
        if (name === personName) {
            baseScheduleId = parseInt(id);
            break;
        }
    }
    if (!baseScheduleId) return null;

    const weekKey = weekOffset.toString();
    if (state.weeklyOverrides[weekKey]) {
        for (const [schId, data] of Object.entries(state.weeklyOverrides[weekKey])) {
            if (data.person === personName && isOverrideActiveOnDay(data, dayIndex)) {
                return parseInt(schId);
            }
        }
    }

    return getRotatedScheduleId(baseScheduleId, weekOffset);
}

// ==========================================
// FUNCIONES DE VACACIONES
// ==========================================

function getWeekStartDate(weekOffset) {
    const start = new Date(state.startDate);
    start.setDate(start.getDate() + (weekOffset * 7));
    return start;
}

function getWeekEndDate(weekOffset) {
    const start = getWeekStartDate(weekOffset);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
}

function isEmployeeOnVacation(employeeName, weekOffset) {
    if (!state.vacations[employeeName]) return false;

    const weekStart = getWeekStartDate(weekOffset);
    const weekEnd = getWeekEndDate(weekOffset);

    return state.vacations[employeeName].some(vacation => {
        const vacStart = parseLocalDate(vacation.startDate);
        const vacEnd = parseLocalDate(vacation.endDate);

        // Verificar si hay superposición entre la semana y las vacaciones
        return vacStart <= weekEnd && vacEnd >= weekStart;
    });
}

function getVacationDaysInWeek(employeeName, weekOffset) {
    if (!state.vacations[employeeName]) return [];

    const weekStart = getWeekStartDate(weekOffset);
    const weekEnd = getWeekEndDate(weekOffset);
    const vacationDays = [];

    state.vacations[employeeName].forEach(vacation => {
        // Crear fechas locales para evitar problemas de zona horaria
        const vacStart = parseLocalDate(vacation.startDate);
        const vacEnd = parseLocalDate(vacation.endDate);

        // Iterar cada día de la semana
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + i);

            // Normalizar a medianoche para comparación
            const currentDayNormalized = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
            const vacStartNormalized = new Date(vacStart.getFullYear(), vacStart.getMonth(), vacStart.getDate());
            const vacEndNormalized = new Date(vacEnd.getFullYear(), vacEnd.getMonth(), vacEnd.getDate());

            if (currentDayNormalized >= vacStartNormalized && currentDayNormalized <= vacEndNormalized) {
                vacationDays.push(i); // 0=lunes, 1=martes, etc.
            }
        }
    });

    return vacationDays;
}

// Función auxiliar para parsear fechas en formato YYYY-MM-DD como fecha local
function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day); // month - 1 porque los meses en JS son 0-indexed
}

// ==========================================
// FUNCIONES DE CAMBIO DE UBICACIÓN
// ==========================================

function getEmployeeLocationChange(employeeName, weekOffset) {
    const weekKey = weekOffset.toString();
    if (state.locationChanges[weekKey] && state.locationChanges[weekKey][employeeName]) {
        return state.locationChanges[weekKey][employeeName];
    }
    return null;
}

function isLocationChangedOnDay(employeeName, weekOffset, dayIndex) {
    const locationChange = getEmployeeLocationChange(employeeName, weekOffset);
    if (!locationChange || !locationChange.days) return false;
    return locationChange.days.includes(dayIndex);
}

function applyLocationChangeToSchedule(schedule, locationChange) {
    if (!locationChange || !locationChange.days) return schedule;

    const modifiedSchedule = JSON.parse(JSON.stringify(schedule)); // Deep copy
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    days.forEach((day, index) => {
        // Solo cambiar ubicación en los días especificados
        if (locationChange.days.includes(index) &&
            modifiedSchedule[day] &&
            modifiedSchedule[day].location === locationChange.originalLocation) {
            modifiedSchedule[day].location = locationChange.newLocation;
        }
    });

    return modifiedSchedule;
}

function getPersonForSchedule(scheduleId, weekOffset, dayIndex) {
    const weekKey = weekOffset.toString();

    if (state.weeklyOverrides[weekKey] && state.weeklyOverrides[weekKey][scheduleId]) {
        const overrideData = state.weeklyOverrides[weekKey][scheduleId];
        if (isOverrideActiveOnDay(overrideData, dayIndex)) {
            return {
                name: overrideData.person,
                isTemp: true,
                comment: overrideData.comment,
                days: overrideData.days || null
            };
        }
    }

    let baseId;
    if (scheduleId >= 7) {
        baseId = scheduleId;
    } else {
        baseId = (scheduleId - 1 - weekOffset) % 6;
        if (baseId < 0) baseId += 6;
        baseId += 1;
    }

    const personName = state.assignments[baseId];

    if (personName) {
        if (state.weeklyOverrides[weekKey]) {
            for (const [sId, data] of Object.entries(state.weeklyOverrides[weekKey])) {
                // Solo considerar que la persona está "movida" si el override aplica en este día
                if (data.person === personName && isOverrideActiveOnDay(data, dayIndex)) {
                    return null;
                }
            }
        }
        return { name: personName, isTemp: false };
    }
    return null;
}

// ==========================================
// RENDERIZADO
// ==========================================

function renderAll() {
    updateHeaders();
    renderConfigTable();
    renderIndividualView();
    renderGeneralView();
    renderAllEventsView();

    // Renderizar banners de eventos (V3 Diagnóstico)
    renderEventsBannerV3('eventsBannerInd');
    renderEventsBannerV3('eventsBannerGen');
}

function updateHeaders() {
    const weekText = `Semana ${state.currentWeekOffset + 1}`;
    const rangeText = getWeekDateRange(state.currentWeekOffset);
    Object.values(elements.weekDisplays).forEach(el => el.textContent = weekText);
    Object.values(elements.dateRanges).forEach(el => el.textContent = rangeText);
}

function renderConfigTable() {
    const tbody = elements.configTableBody;
    tbody.innerHTML = '';

    scheduleData.forEach(schedule => {
        const tr = document.createElement('tr');

        // Para la columna "Persona Asignada", verificar override a nivel semanal (sin dayIndex)
        const personDataWeek = getPersonForSchedule(schedule.id, state.currentWeekOffset);
        const weekKey = state.currentWeekOffset.toString();
        const overrideData = state.weeklyOverrides[weekKey] && state.weeklyOverrides[weekKey][schedule.id];
        
        // Determinar si es un cambio parcial (solo algunos días)
        const isPartialSwap = overrideData && overrideData.days && overrideData.days.length > 0 && overrideData.days.length < 7;
        const isFullSwap = overrideData && (!overrideData.days || overrideData.days.length === 0 || overrideData.days.length === 7);
        
        let assignedPersonName, isSwap;
        if (isFullSwap) {
            assignedPersonName = overrideData.person;
            isSwap = true;
        } else if (isPartialSwap) {
            // Mostrar la persona normal con indicador de cambio parcial
            const normalPerson = getPersonForSchedule(schedule.id, state.currentWeekOffset, -1); // -1 = un día que no estará en days
            // Intentar obtener persona sin override
            let basePerson = null;
            let baseId;
            if (schedule.id === 7) { baseId = 7; } else {
                baseId = (schedule.id - 1 - state.currentWeekOffset) % 6;
                if (baseId < 0) baseId += 6;
                baseId += 1;
            }
            basePerson = state.assignments[baseId] || 'Vacante';
            assignedPersonName = basePerson;
            isSwap = true;
        } else {
            assignedPersonName = personDataWeek ? personDataWeek.name : 'Vacante';
            isSwap = personDataWeek && personDataWeek.isTemp;
        }
        
        const isOnVacation = assignedPersonName !== 'Vacante' && isEmployeeOnVacation(assignedPersonName, state.currentWeekOffset);

        // Construir info del swap para la columna persona
        let swapLabel = '';
        if (isFullSwap) {
            swapLabel = `<span class="text-xs text-muted" style="display:block; font-size: 0.7rem;">(Cambio Temporal)</span>`;
        } else if (isPartialSwap) {
            const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            const daysText = overrideData.days.map(d => dayNamesShort[d]).join(', ');
            swapLabel = `<span class="text-xs text-muted" style="display:block; font-size: 0.7rem;">🔄 ${overrideData.person} (${daysText})</span>`;
        }

        const actionBtn = `
            <button class="btn-icon" onclick="openSwapModal(${schedule.id})" title="Cambio Temporal (Esta Semana)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
            </button>
        `;

        // Renderizar celdas de día con resolución por día
        const dayCells = renderConfigDayCells(schedule, state.currentWeekOffset);
        const locNameClass = schedule.name.toLowerCase().includes('guardia') ? 'name-loc-guardia' 
                           : schedule.name.toLowerCase().includes('valle') ? 'name-loc-valle' 
                           : 'name-loc-mitras';

        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <strong>${schedule.name}</strong>
                    ${actionBtn}
                </div>
            </td>
            <td class="person-cell">
                <strong class="${locNameClass}">${assignedPersonName}</strong>
                ${swapLabel}
                ${isOnVacation ? `<span class="vacation-badge-small">🏖️ Vacaciones</span>` : ''}
            </td>
            ${dayCells}
        `;
        tbody.appendChild(tr);
    });
    updateDayHeaders();
}

// Renderizar celdas de día para config table con resolución por día
function renderConfigDayCells(schedule, weekOffset) {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const results = [];
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const personData = getPersonForSchedule(schedule.id, weekOffset, dayIndex);
        const personName = personData ? personData.name : null;
        const isTemp = personData ? personData.isTemp : false;
        
        const vacationDays = personName ? getVacationDaysInWeek(personName, weekOffset) : [];
        const isOnVacation = vacationDays.includes(dayIndex);
        const locationChange = personName ? getEmployeeLocationChange(personName, weekOffset) : null;
        
        // Usar siempre el schedule de la fila (no el de la persona temporal)
        const displaySchedule = locationChange ? applyLocationChangeToSchedule(schedule, locationChange) : schedule;
        const data = displaySchedule[days[dayIndex]];
        
        // Calcular si es hoy
        const todayDate = new Date();
        const todayIndex = (todayDate.getDay() + 6) % 7;
        const isCurrentWeek = weekOffset === getWeeksFromStart(todayDate);
        const isToday = isCurrentWeek && dayIndex === todayIndex;
        const todayStyle = isToday ? 'box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5);' : '';
        
        // Verificar festivos
        let isHoliday = false;
        let holidayEvent = null;
        if (state.events) {
            const weekStart = getWeekStartDate(weekOffset);
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + dayIndex);
            const year = currentDay.getFullYear();
            const month = String(currentDay.getMonth() + 1).padStart(2, '0');
            const isoDay = String(currentDay.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${isoDay}`;
            const eventsOnDate = getEventsForDate(dateKey);
            holidayEvent = eventsOnDate.find(e => e.type === 'holiday');
            isHoliday = !!holidayEvent;
        }
        
        const isGuardia = data && data.location === 'guardia';
        const applyHolidayEffect = isHoliday && !isGuardia;
        
        if (isOnVacation) {
            results.push(`<td class="vacation-cell" style="${todayStyle}"><span class="location-badge vacation">VACACIONES</span></td>`);
            continue;
        }
        
        if (!data) {
            results.push(`<td class="descanso" style="${todayStyle}"><span class="location-badge descanso">Descanso</span></td>`);
            continue;
        }
        
        let displayTime = data.time;
        let isSpecialSchedule = false;
        if (isHoliday && isGuardia && holidayEvent.guardiaStart && holidayEvent.guardiaEnd) {
            displayTime = `${holidayEvent.guardiaStart} - ${holidayEvent.guardiaEnd}`;
            isSpecialSchedule = true;
        }
        
        const hasLocationChange = locationChange && data.location === locationChange.newLocation;
        let classes = hasLocationChange ? 'location-change-cell' : '';
        
        // Estilo para cambio temporal: solo mostramos el indicador, sin fondo/borde extra en la celda
        let tempStyle = '';
        let tempDayIndicator = '';
        if (isTemp) {
            tempDayIndicator = `<span style="display:block; font-size: 0.65rem; color: var(--primary); font-weight: 700; margin-top: 3px; background: rgba(59, 130, 246, 0.15); padding: 1px 4px; border-radius: 3px; text-align: center;">🔄 ${personName}</span>`;
        }
        
        if (applyHolidayEffect) {
            let styles = todayStyle + tempStyle + 'background-color: rgba(16, 185, 129, 0.15); position: relative;';
            results.push(`<td class="${classes}" style="${styles}">
                <div class="schedule-cell" style="opacity: 0.25; filter: blur(1.5px);">
                    <span class="time">${displayTime}</span>
                    <span class="location-badge ${data.location}">${data.location}</span>
                </div>
                <div style="position: absolute; top: ${isTemp ? '35%' : '50%'}; left: 50%; transform: translate(-50%, -50%); color: var(--success); font-weight: bold; font-size: 0.85rem; text-shadow: 0 1px 2px rgba(255,255,255,0.9); pointer-events: none; width: 100%; text-align: center;">
                    FESTIVO
                </div>
                ${isTemp ? `<div style="position: relative; z-index: 2; margin-top: -0.5rem;">${tempDayIndicator}</div>` : ''}
            </td>`);
        } else {
            results.push(`<td class="${classes}" style="${todayStyle} ${tempStyle}">
                <div class="schedule-cell">
                    <span class="time" ${isSpecialSchedule ? 'style="color: var(--success); font-weight: bold;"' : ''}>${displayTime}</span>
                    <span class="location-badge ${data.location}">${data.location}</span>
                    ${hasLocationChange ? '<span class="location-change-indicator">📍 Cambio</span>' : ''}
                    ${isSpecialSchedule ? '<span class="location-change-indicator" style="background: var(--success); color: white;">🕒 Especial</span>' : ''}
                    ${tempDayIndicator}
                </div>
            </td>`);
        }
    }
    
    return results.join('');
}

window.openSwapModal = function (scheduleId) {
    currentEditingScheduleId = scheduleId;
    const personData = getPersonForSchedule(scheduleId, state.currentWeekOffset);
    const currentName = personData ? personData.name : 'Vacante';

    const modalBody = document.querySelector('#swapModal .modal-body');

    const allEmployees = new Set([...state.employees, ...Object.values(state.assignments)]);
    const sortedEmployees = Array.from(allEmployees).sort();

    if (sortedEmployees.length === 0) {
        modalBody.innerHTML = `
            <h3>Cambio de Guardia Temporal</h3>
            <p class="text-muted">No hay empleados registrados para realizar cambios.</p>
            <p>Por favor, ve a "Gestionar Asignaciones" para agregar empleados primero.</p>
        `;
    } else {
        modalBody.innerHTML = `
            <h3>Cambio de Guardia Temporal</h3>
            <p class="text-muted">Semana ${state.currentWeekOffset + 1} (${getWeekDateRange(state.currentWeekOffset)})</p>
            <div class="form-group" style="margin-top: 1rem;">
                <label>Horario ${scheduleId} actualmente tiene a: <strong>${currentName}</strong></label>
                <label style="margin-top: 1rem; display: block;">Cambiar por:</label>
                <select id="swapPersonSelect" style="width: 100%; margin-bottom: 1rem;">
                    <option value="">-- Seleccionar Persona --</option>
                    ${sortedEmployees.filter(e => e !== currentName).map(emp => `<option value="${emp}">${emp}</option>`).join('')}
                </select>
                
                <label style="margin-top: 1rem; display: block;">Duración del Cambio</label>
                <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; margin-top: 0.5rem;">
                    <button type="button" id="swapFullWeekBtn" class="btn-primary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;" onclick="setSwapMode('full')">📅 Semana Completa</button>
                    <button type="button" id="swapSpecificDaysBtn" class="btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;" onclick="setSwapMode('specific')">📌 Días Específicos</button>
                </div>
                <input type="hidden" id="swapMode" value="full">
                
                <div id="swapDaysContainer" style="display: none; margin-bottom: 1rem; padding: 1rem; background: var(--bg-body); border-radius: 8px; border: 1px solid var(--border);">
                    <label style="font-size: 0.85rem; margin-bottom: 0.5rem; display: block; color: var(--text-muted);">Selecciona los días del cambio:</label>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" class="swap-day-checkbox" value="0"> Lunes
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" class="swap-day-checkbox" value="1"> Martes
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" class="swap-day-checkbox" value="2"> Miércoles
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" class="swap-day-checkbox" value="3"> Jueves
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" class="swap-day-checkbox" value="4"> Viernes
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" class="swap-day-checkbox" value="5"> Sábado
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem;">
                            <input type="checkbox" class="swap-day-checkbox" value="6"> Domingo
                        </label>
                    </div>
                    <button type="button" onclick="selectAllSwapDays()" style="margin-top: 0.5rem; padding: 0.4rem 0.75rem; background: var(--bg-input); border: 1px solid var(--border); border-radius: 4px; cursor: pointer; font-size: 0.8rem; color: var(--text-muted);">Seleccionar / Deseleccionar Todos</button>
                </div>

                <label>Comentario (Obligatorio)</label>
                <textarea id="swapReason" rows="2" placeholder="Motivo del cambio..." style="width: 100%;"></textarea>
            </div>
        `;
    }

    elements.swapModal.classList.add('active');
}

function saveSwap() {
    const targetPerson = document.getElementById('swapPersonSelect').value;
    const reason = document.getElementById('swapReason').value.trim();
    const swapMode = document.getElementById('swapMode') ? document.getElementById('swapMode').value : 'full';

    if (!targetPerson || !reason) {
        alert('Por favor selecciona una persona y escribe un comentario.');
        return;
    }

    // Obtener días seleccionados
    let selectedDays = [];
    if (swapMode === 'specific') {
        selectedDays = Array.from(document.querySelectorAll('.swap-day-checkbox:checked'))
            .map(cb => parseInt(cb.value));
        if (selectedDays.length === 0) {
            alert('Por favor selecciona al menos un día.');
            return;
        }
    } else {
        selectedDays = [0, 1, 2, 3, 4, 5, 6]; // Semana completa
    }

    const weekKey = state.currentWeekOffset.toString();
    if (!state.weeklyOverrides[weekKey]) {
        state.weeklyOverrides[weekKey] = {};
    }

    state.weeklyOverrides[weekKey][currentEditingScheduleId] = {
        person: targetPerson,
        comment: reason,
        days: selectedDays
    };

    let targetPersonOriginalScheduleId = null;
    for (const [id, name] of Object.entries(state.assignments)) {
        if (name === targetPerson) {
            targetPersonOriginalScheduleId = parseInt(id);
            break;
        }
    }

    if (targetPersonOriginalScheduleId) {
        delete state.weeklyOverrides[weekKey][currentEditingScheduleId];
        const personAtOrigin = getPersonForSchedule(currentEditingScheduleId, state.currentWeekOffset);
        const originName = personAtOrigin ? personAtOrigin.name : null;

        state.weeklyOverrides[weekKey][currentEditingScheduleId] = {
            person: targetPerson,
            comment: reason,
            days: selectedDays
        };

        if (originName) {
            const targetPhysicalSchedule = getRotatedScheduleId(targetPersonOriginalScheduleId, state.currentWeekOffset);
            state.weeklyOverrides[weekKey][targetPhysicalSchedule] = {
                person: originName,
                comment: `Intercambio con H${currentEditingScheduleId}: ${reason}`,
                days: selectedDays
            };
        }
    }

    // Guardar en localStorage
    saveToLocalStorage();

    closeModal();
}

// Funciones globales para el modal de swap
window.setSwapMode = function(mode) {
    const modeInput = document.getElementById('swapMode');
    const daysContainer = document.getElementById('swapDaysContainer');
    const fullWeekBtn = document.getElementById('swapFullWeekBtn');
    const specificDaysBtn = document.getElementById('swapSpecificDaysBtn');
    
    if (modeInput) modeInput.value = mode;
    
    if (mode === 'specific') {
        if (daysContainer) daysContainer.style.display = 'block';
        if (fullWeekBtn) { fullWeekBtn.className = 'btn-secondary'; }
        if (specificDaysBtn) { specificDaysBtn.className = 'btn-primary'; }
    } else {
        if (daysContainer) daysContainer.style.display = 'none';
        if (fullWeekBtn) { fullWeekBtn.className = 'btn-primary'; }
        if (specificDaysBtn) { specificDaysBtn.className = 'btn-secondary'; }
        // Deseleccionar todos los checkboxes
        document.querySelectorAll('.swap-day-checkbox').forEach(cb => cb.checked = false);
    }
};

window.selectAllSwapDays = function() {
    const checkboxes = document.querySelectorAll('.swap-day-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
};

function renderDayCells_Legacy(schedule, personName = null, weekOffset = null) {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const vacationDays = personName && weekOffset !== null ? getVacationDaysInWeek(personName, weekOffset) : [];
    const locationChange = personName && weekOffset !== null ? getEmployeeLocationChange(personName, weekOffset) : null;

    // Obtener eventos de la semana (mapa índice -> evento principal)
    const weekEvents = {};
    const holidayEvents = {}; // Mantener compatibilidad con lógica de guardias especial

    if (weekOffset !== null && state.events) {
        const weekStart = getWeekStartDate(weekOffset);

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + i);

            const year = currentDay.getFullYear();
            const month = String(currentDay.getMonth() + 1).padStart(2, '0');
            const isoDay = String(currentDay.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${isoDay}`;

            const eventsOnDate = getEventsForDate(dateKey);
            if (eventsOnDate.length > 0) {
                // Prioridad: holiday > alert > payday > notice
                // Ordenar para tomar el de mayor prioridad
                const typePriority = { 'holiday': 4, 'alert': 3, 'payday': 2, 'notice': 1 };
                eventsOnDate.sort((a, b) => (typePriority[b.type] || 0) - (typePriority[a.type] || 0));

                weekEvents[i] = eventsOnDate[0]; // Tomar el más importante

                // Si hay holiday, guardarlo también para lógica específica de guardias
                const holiday = eventsOnDate.find(e => e.type === 'holiday');
                if (holiday) holidayEvents[i] = holiday;
            }
        }
    }

    // Aplicar cambio de ubicación si existe
    const displaySchedule = locationChange ? applyLocationChangeToSchedule(schedule, locationChange) : schedule;

    // Calcular índice del día actual (0=Lunes...6=Domingo)
    const todayDate = new Date();
    const todayIndex = (todayDate.getDay() + 6) % 7;
    const currentWeeksFromStart = getWeeksFromStart(todayDate);
    const isCurrentWeek = (weekOffset !== null ? weekOffset : state.currentWeekOffset) === currentWeeksFromStart;

    return days.map((day, index) => {
        const data = displaySchedule[day];
        const isOnVacation = vacationDays.includes(index);

        // Verificar si es el día de hoy
        const isToday = isCurrentWeek && index === todayIndex;
        let todayStyle = isToday ? 'box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5);' : '';

        // Verificar eventos
        const event = weekEvents[index];
        const holidayEvent = holidayEvents[index]; // Específico para lógica antigua
        const isHoliday = !!holidayEvent;
        const isGuardia = data && data.location === 'guardia';

        // Lógica antigua: en festivo NO guardia se "tapa" el horario
        const applyHolidayEffect = isHoliday && !isGuardia;

        // Determinar color de fondo según evento
        let eventBgColor = '';
        if (event) {
            switch (event.type) {
                case 'holiday': eventBgColor = 'rgba(16, 185, 129, 0.15)'; break; // Verde
                case 'alert': eventBgColor = 'rgba(239, 68, 68, 0.15)'; break; // Rojo
                case 'payday': eventBgColor = 'rgba(245, 158, 11, 0.15)'; break; // Naranja
                default: eventBgColor = 'rgba(59, 130, 246, 0.15)'; break; // Azul
            }
        }

        // Si es hoy, combinar azul tenue con color del evento si existe
        if (isToday && !eventBgColor) {
            eventBgColor = 'rgba(59, 130, 246, 0.1)';
        }

        let cellStyles = todayStyle;
        if (eventBgColor) {
            cellStyles += `background-color: ${eventBgColor};`;
        }

        // Si hay evento, poner posición relativa para marcador si quisiéramos (opcional)
        cellStyles += 'position: relative;';

        if (isOnVacation) {
            return `<td class="vacation-cell" style="${cellStyles}"><span class="location-badge vacation">VACACIONES</span></td>`;
        }

        if (!data) return `<td class="descanso" style="${cellStyles}"><span class="location-badge descanso">Descanso</span></td>`;

        // Lógica de horario especial para guardia
        let displayTime = data.time;
        let isSpecialSchedule = false;

        if (isHoliday && isGuardia && holidayEvent.guardiaStart && holidayEvent.guardiaEnd) {
            displayTime = `${holidayEvent.guardiaStart} - ${holidayEvent.guardiaEnd}`;
            isSpecialSchedule = true;
        }

        const hasLocationChange = locationChange && data.location === locationChange.newLocation;
        let classes = hasLocationChange ? 'location-change-cell' : '';
        let cellContent = '';

        if (applyHolidayEffect) {
            // Mantener efecto visual de festivo (blur)
            cellContent = `
                <div class="schedule-cell" style="opacity: 0.25; filter: blur(1.5px);">
                    <span class="time">${displayTime}</span>
                    <span class="location-badge ${data.location}">${data.location}</span>
                    ${hasLocationChange ? '<span class="location-change-indicator">📍 Cambio</span>' : ''}
                </div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--success); font-weight: bold; font-size: 0.85rem; text-shadow: 0 1px 2px rgba(255,255,255,0.9); pointer-events: none; width: 100%; text-align: center;">
                    FESTIVO
                </div>
            `;
        } else {
            // Celda normal (con fondo de evento si aplica)
            cellContent = `
                <div class="schedule-cell">
                    <span class="time" ${isSpecialSchedule ? 'style="color: var(--success); font-weight: bold;"' : ''}>${displayTime}</span>
                    <span class="location-badge ${data.location}">${data.location}</span>
                    ${hasLocationChange ? '<span class="location-change-indicator">📍 Cambio</span>' : ''}
                    ${isSpecialSchedule ? '<span class="location-change-indicator" style="background: var(--success); color: white;">🕒 Especial</span>' : ''}
                </div>
            `;
        }

        return `
            <td class="${classes}" style="${cellStyles}">
                ${cellContent}
            </td>
        `;
    }).join('');
}

function renderIndividualView() {
    const container = document.getElementById('individualScheduleContainer');
    const people = Object.values(state.assignments).sort();

    let selectorHTML = `
        <div class="person-selector-container">
            <label>Ver horario de: </label>
            <select id="individualPersonSelect" onchange="renderSelectedIndividual(this.value)">
                <option value="">-- Seleccionar Persona --</option>
                ${people.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
        </div>
        <div id="individualScheduleResult"></div>
    `;
    container.innerHTML = selectorHTML;

    const savedSelection = sessionStorage.getItem('lastViewedPerson');
    if (savedSelection && people.includes(savedSelection)) {
        document.getElementById('individualPersonSelect').value = savedSelection;
        renderSelectedIndividual(savedSelection);
    }
}

window.renderSelectedIndividual = function (personName) {
    if (!personName) {
        document.getElementById('individualScheduleResult').innerHTML = '';
        return;
    }
    sessionStorage.setItem('lastViewedPerson', personName);

    const weekKey = state.currentWeekOffset.toString();
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const today = new Date().getDay();
    const jsDayToIndex = [6, 0, 1, 2, 3, 4, 5];
    const currentDayIndex = jsDayToIndex[today];
    const vacationDays = getVacationDaysInWeek(personName, state.currentWeekOffset);
    const locationChange = getEmployeeLocationChange(personName, state.currentWeekOffset);

    // Verificar si esta persona tiene un override activo
    let swapInfo = null;
    if (state.weeklyOverrides[weekKey]) {
        for (const [schId, data] of Object.entries(state.weeklyOverrides[weekKey])) {
            if (data.person === personName) {
                // Encontrar la persona original que normalmente estaría en este horario
                const sid = parseInt(schId);
                let originalPerson = 'Vacante';
                for (const [baseIdStr, assignedName] of Object.entries(state.assignments)) {
                    const rotated = getRotatedScheduleId(parseInt(baseIdStr), state.currentWeekOffset);
                    if (rotated === sid) {
                        originalPerson = assignedName;
                        break;
                    }
                }
                
                const dayNamesLong = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                const isPartial = data.days && data.days.length > 0 && data.days.length < 7;
                const daysText = isPartial ? data.days.map(d => dayNamesLong[d]).join(', ') : 'Toda la semana';
                
                swapInfo = {
                    comment: data.comment,
                    originalPerson: originalPerson,
                    daysText: daysText
                };
                break;
            }
        }
    }

    let html = '';

    if (swapInfo) {
        html += `
            <div style="background-color: var(--primary-light); color: var(--primary-dark); padding: 1rem; border-radius: var(--radius); margin-bottom: 1.5rem; border: 1px solid var(--primary);">
                <strong>⚠️ Cambio de Guardia:</strong> Cubriendo a <strong>${swapInfo.originalPerson}</strong>.
                <div style="margin-top: 0.5rem;">📅 <strong>${swapInfo.daysText}</strong></div>
                <div style="margin-top: 0.5rem; font-style: italic;">"${swapInfo.comment}"</div>
            </div>
        `;
    }

    if (vacationDays.length > 0) {
        html += `
            <div style="background-color: #fef3c7; color: #92400e; padding: 1rem; border-radius: var(--radius); margin-bottom: 1.5rem; border: 1px solid #f59e0b;">
                <strong>🏖️ Vacaciones:</strong> Tienes días de vacaciones esta semana.
            </div>
        `;
    }

    if (locationChange) {
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const daysText = locationChange.days && locationChange.days.length > 0
            ? locationChange.days.map(d => dayNames[d]).join(', ')
            : 'toda la semana';

        html += `
            <div style="background-color: #dbeafe; color: #1e40af; padding: 1rem; border-radius: var(--radius); margin-bottom: 1.5rem; border: 1px solid #3b82f6;">
                <strong>📍 Cambio de Ubicación:</strong> De <strong>${locationChange.originalLocation.toUpperCase()}</strong> a <strong>${locationChange.newLocation.toUpperCase()}</strong>
                <div style="margin-top: 0.5rem;">📅 Días: <strong>${daysText}</strong></div>
                <div style="margin-top: 0.5rem; font-style: italic;">"${locationChange.reason}"</div>
            </div>
        `;
    }

    // Obtener eventos de la semana
    const weekEvents = {};
    if (state.events) {
        const weekStart = getWeekStartDate(state.currentWeekOffset);
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + i);
            const year = currentDay.getFullYear();
            const month = String(currentDay.getMonth() + 1).padStart(2, '0');
            const isoDay = String(currentDay.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${isoDay}`;

            const eventsOnDate = getEventsForDate(dateKey);
            let priorityEvent = eventsOnDate.find(e => e.type === 'holiday');
            if (!priorityEvent) priorityEvent = eventsOnDate.find(e => e.type === 'alert');
            if (!priorityEvent) priorityEvent = eventsOnDate.find(e => e.type === 'payday');
            if (!priorityEvent) priorityEvent = eventsOnDate.find(e => e.type === 'notice');

            if (priorityEvent) {
                weekEvents[i] = priorityEvent;
            }
        }
    }

    html += `<div class="individual-days-list">`;

    days.forEach((day, index) => {
        // Resolver el horario de esta persona para ESTE DÍA específico
        const scheduleIdForDay = getScheduleForPerson(personName, state.currentWeekOffset, index);
        const scheduleForDay = scheduleData.find(s => s.id === scheduleIdForDay);
        
        if (!scheduleForDay) {
            html += `<div class="day-card"><div class="day-name"><strong>${day.charAt(0).toUpperCase() + day.slice(1)}</strong></div><div class="day-schedule"><span class="text-muted">Sin horario</span></div></div>`;
            return;
        }
        
        const displaySchedule = locationChange ? applyLocationChangeToSchedule(scheduleForDay, locationChange) : scheduleForDay;
        const data = displaySchedule[day];
        
        const isToday = index === currentDayIndex && state.currentWeekOffset === getWeeksFromStart(new Date());
        const isOnVacation = vacationDays.includes(index);
        const hasLocationChange = locationChange && data && data.location === locationChange.newLocation;
        
        // Verificar si este día específico es un cambio temporal
        let isDaySwapped = false;
        if (state.weeklyOverrides[weekKey]) {
            for (const [schId, ovData] of Object.entries(state.weeklyOverrides[weekKey])) {
                if (ovData.person === personName && isOverrideActiveOnDay(ovData, index)) {
                    isDaySwapped = true;
                    break;
                }
            }
        }

        const event = weekEvents[index];
        const isHoliday = event && event.type === 'holiday';
        const isPayday = event && event.type === 'payday';
        const isAlert = event && event.type === 'alert';

        const isGuardia = data && data.location === 'guardia';
        const applyHolidayEffect = isHoliday && !isGuardia;

        let displayTime = data ? data.time : '';
        let isSpecialSchedule = false;

        if (isHoliday && isGuardia && event.guardiaStart && event.guardiaEnd) {
            displayTime = `${event.guardiaStart} - ${event.guardiaEnd}`;
            isSpecialSchedule = true;
        }

        let cardStyle = '';
        let contentStyle = '';
        let overlayHTML = '';
        let eventBadge = '';

        if (applyHolidayEffect) {
            cardStyle = 'background-color: rgba(16, 185, 129, 0.15); border: 1px solid var(--success); position: relative; overflow: hidden;';
            contentStyle = 'opacity: 0.25; filter: blur(1.5px);';
            overlayHTML = `
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--success); font-weight: bold; font-size: 1.2rem; text-shadow: 0 1px 2px rgba(255,255,255,0.9); pointer-events: none; width: 100%; text-align: center; z-index: 5;">
                    ${event.text || 'FESTIVO'}
                </div>
            `;
        } else if (isPayday) {
            cardStyle = 'border: 1px solid #F59E0B; background: linear-gradient(to bottom right, var(--bg-card), rgba(245, 158, 11, 0.1));';
            eventBadge = `<span class="badge-event" style="background: rgba(245, 158, 11, 0.15); color: #D97706; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; vertical-align: middle; margin-left: 0.5rem; border: 1px solid rgba(245, 158, 11, 0.3);">💰 ${event.text || 'QUINCENA'}</span>`;
        } else if (isAlert) {
            cardStyle = 'border: 1px solid var(--danger); background: linear-gradient(to bottom right, var(--bg-card), rgba(239, 68, 68, 0.1));';
            eventBadge = `<span class="badge-event" style="background: rgba(239, 68, 68, 0.15); color: var(--danger); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; vertical-align: middle; margin-left: 0.5rem; border: 1px solid rgba(239, 68, 68, 0.3);">🚨 ${event.text || 'ALERTA'}</span>`;
        } else if (event && event.type === 'notice') {
            cardStyle = 'border: 1px solid var(--primary);';
            eventBadge = `<span class="badge-event" style="background: rgba(59, 130, 246, 0.15); color: var(--primary); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; vertical-align: middle; margin-left: 0.5rem; border: 1px solid rgba(59, 130, 246, 0.3);">ℹ️ ${event.text || 'AVISO'}</span>`;
        }

        const swapDayBadge = isDaySwapped ? '<span class="badge-location-change" style="background: var(--primary);">🔄 CAMBIO TEMPORAL</span>' : '';

        html += `
            <div class="day-card ${isToday ? 'today' : ''} ${isOnVacation ? 'vacation' : ''} ${hasLocationChange ? 'location-change' : ''}" style="${cardStyle}">
                ${overlayHTML}
                <div style="${contentStyle}">
                    <div class="day-name">
                        <strong style="color: ${getDayHeaderColor(state.currentWeekOffset, index)}">${day.charAt(0).toUpperCase() + day.slice(1)}</strong>
                        ${isToday ? '<span class="badge-today">HOY</span>' : ''}
                        ${isOnVacation ? '<span class="badge-vacation">VACACIONES</span>' : ''}
                        ${hasLocationChange ? '<span class="badge-location-change">CAMBIO UBICACIÓN</span>' : ''}
                        ${isSpecialSchedule ? '<span class="badge-location-change" style="background: var(--success);">🕒 HORARIO ESPECIAL</span>' : ''}
                        ${swapDayBadge}
                        ${eventBadge}
                    </div>
                    <div class="day-schedule">
                        ${isOnVacation ? '<span class="vacation-text">🏖️ Día de vacaciones</span>' :
                data ? `
                            <span class="time" ${isSpecialSchedule ? 'style="color: var(--success); font-weight: bold;"' : ''}>${displayTime}</span>
                            <span class="location-badge ${data.location}">${data.location}</span>
                            ${hasLocationChange ? '<span class="location-change-text">📍 Nueva ubicación</span>' : ''}
                        ` : '<span class="text-muted">Descanso</span>'}
                    </div>
                </div>
            </div>
        `;
    });
    html += `</div>`;

    document.getElementById('individualScheduleResult').innerHTML = html;
}

function renderGeneralView() {
    const tbody = document.getElementById('generalTableBody');
    tbody.innerHTML = '';

    document.getElementById('guardiaList').innerHTML = '';
    document.getElementById('valleList').innerHTML = '';
    document.getElementById('mitrasList').innerHTML = '';

    for (let i = 1; i <= scheduleData.length; i++) {
        const personData = getPersonForSchedule(i, state.currentWeekOffset);
        const schedule = scheduleData.find(s => s.id === i);

        const tr = document.createElement('tr');

        // Verificar override para esta semana
        const weekKey = state.currentWeekOffset.toString();
        const overrideData = state.weeklyOverrides[weekKey] && state.weeklyOverrides[weekKey][i];
        const isPartialSwap = overrideData && overrideData.days && overrideData.days.length > 0 && overrideData.days.length < 7;
        const isFullSwap = overrideData && (!overrideData.days || overrideData.days.length === 0 || overrideData.days.length === 7);

        if (isFullSwap || (personData && personData.isTemp && !isPartialSwap)) {
            tr.classList.add('row-swap');
        }

        let personDisplay, commentDisplay, vacationDisplay;

        if (isFullSwap) {
            const isOnVacation = isEmployeeOnVacation(overrideData.person, state.currentWeekOffset);
            personDisplay = overrideData.person;
            commentDisplay = `<span class="swap-comment">${overrideData.comment}</span>`;
            vacationDisplay = isOnVacation ? `<span class="vacation-badge-small">🏖️ Vacaciones</span>` : '';
        } else if (isPartialSwap) {
            // Obtener persona base (sin override)
            let baseId;
            if (i >= 7) { baseId = i; } else {
                baseId = (i - 1 - state.currentWeekOffset) % 6;
                if (baseId < 0) baseId += 6;
                baseId += 1;
            }
            const basePerson = state.assignments[baseId] || '--';
            const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            const daysText = overrideData.days.map(d => dayNamesShort[d]).join(', ');
            
            personDisplay = basePerson;
            commentDisplay = `<span class="swap-comment" style="font-size: 0.75rem;">🔄 ${overrideData.person} (${daysText})</span>`;
            vacationDisplay = '';
        } else {
            const isOnVacation = personData && isEmployeeOnVacation(personData.name, state.currentWeekOffset);
            personDisplay = personData ? personData.name : '<span class="text-muted">--</span>';
            commentDisplay = (personData && personData.isTemp)
                ? `<span class="swap-comment">${personData.comment}</span>`
                : '';
            vacationDisplay = isOnVacation ? `<span class="vacation-badge-small">🏖️ Vacaciones</span>` : '';
        }

        // Usar celdas de día con resolución por día
        const dayCells = renderGeneralDayCells(schedule, i, state.currentWeekOffset);
        const locNameClass = schedule.name.toLowerCase().includes('guardia') ? 'name-loc-guardia' 
                           : schedule.name.toLowerCase().includes('valle') ? 'name-loc-valle' 
                           : 'name-loc-mitras';

        tr.innerHTML = `
            <td class="person-cell">
                <strong class="${locNameClass}" style="font-size: 1rem;">${personDisplay}</strong>
                ${commentDisplay}
                ${vacationDisplay}
            </td>
            ${dayCells}
        `;
        tbody.appendChild(tr);

        // Agregar a tablas de ubicación (resolver por día)
        addToLocationTablesWithDays(i, schedule, state.currentWeekOffset);
    }
    updateDayHeaders();
}

// Renderizar celdas de día para general view con resolución por día
function renderGeneralDayCells(schedule, scheduleId, weekOffset) {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const results = [];
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const personData = getPersonForSchedule(scheduleId, weekOffset, dayIndex);
        const personName = personData ? personData.name : null;
        const isTemp = personData ? personData.isTemp : false;
        
        const vacationDays = personName ? getVacationDaysInWeek(personName, weekOffset) : [];
        const isOnVacation = vacationDays.includes(dayIndex);
        const locationChange = personName ? getEmployeeLocationChange(personName, weekOffset) : null;
        
        const displaySchedule = locationChange ? applyLocationChangeToSchedule(schedule, locationChange) : schedule;
        const data = displaySchedule[days[dayIndex]];
        
        // Calcular si es hoy
        const todayDate = new Date();
        const todayIndex = (todayDate.getDay() + 6) % 7;
        const isCurrentWeek = weekOffset === getWeeksFromStart(todayDate);
        const isToday = isCurrentWeek && dayIndex === todayIndex;
        const todayStyle = isToday ? 'box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5);' : '';
        
        // Verificar festivos
        let isHoliday = false;
        let holidayEvent = null;
        if (state.events) {
            const weekStart = getWeekStartDate(weekOffset);
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + dayIndex);
            const year = currentDay.getFullYear();
            const month = String(currentDay.getMonth() + 1).padStart(2, '0');
            const isoDay = String(currentDay.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${isoDay}`;
            const eventsOnDate = getEventsForDate(dateKey);
            holidayEvent = eventsOnDate.find(e => e.type === 'holiday');
            isHoliday = !!holidayEvent;
        }
        
        const isGuardia = data && data.location === 'guardia';
        const applyHolidayEffect = isHoliday && !isGuardia;
        
        if (isOnVacation) {
            results.push(`<td class="vacation-cell" style="${todayStyle}"><span class="location-badge vacation">VACACIONES</span></td>`);
            continue;
        }
        
        if (!data) {
            results.push(`<td class="descanso" style="${todayStyle}"><span class="location-badge descanso">Descanso</span></td>`);
            continue;
        }
        
        let displayTime = data.time;
        let isSpecialSchedule = false;
        if (isHoliday && isGuardia && holidayEvent.guardiaStart && holidayEvent.guardiaEnd) {
            displayTime = `${holidayEvent.guardiaStart} - ${holidayEvent.guardiaEnd}`;
            isSpecialSchedule = true;
        }
        
        const hasLocationChange = locationChange && data.location === locationChange.newLocation;
        let classes = hasLocationChange ? 'location-change-cell' : '';
        
        // Estilo para cambio temporal: solo mostramos el indicador, sin fondo/borde extra en la celda
        let tempStyle = '';
        let tempDayIndicator = '';
        if (isTemp) {
            tempDayIndicator = `<span style="display:block; font-size: 0.65rem; color: var(--primary); font-weight: 700; margin-top: 3px; background: rgba(59, 130, 246, 0.15); padding: 1px 4px; border-radius: 3px; text-align: center;">🔄 ${personName}</span>`;
        }
        
        if (applyHolidayEffect) {
            let styles = todayStyle + tempStyle + 'background-color: rgba(16, 185, 129, 0.15); position: relative;';
            results.push(`<td class="${classes}" style="${styles}">
                <div class="schedule-cell" style="opacity: 0.25; filter: blur(1.5px);">
                    <span class="time">${displayTime}</span>
                    <span class="location-badge ${data.location}">${data.location}</span>
                </div>
                <div style="position: absolute; top: ${isTemp ? '35%' : '50%'}; left: 50%; transform: translate(-50%, -50%); color: var(--success); font-weight: bold; font-size: 0.85rem; text-shadow: 0 1px 2px rgba(255,255,255,0.9); pointer-events: none; width: 100%; text-align: center;">
                    FESTIVO
                </div>
                ${isTemp ? `<div style="position: relative; z-index: 2; margin-top: -0.5rem;">${tempDayIndicator}</div>` : ''}
            </td>`);
        } else {
            results.push(`<td class="${classes}" style="${todayStyle} ${tempStyle}">
                <div class="schedule-cell">
                    <span class="time" ${isSpecialSchedule ? 'style="color: var(--success); font-weight: bold;"' : ''}>${displayTime}</span>
                    <span class="location-badge ${data.location}">${data.location}</span>
                    ${hasLocationChange ? '<span class="location-change-indicator">📍 Cambio</span>' : ''}
                    ${isSpecialSchedule ? '<span class="location-change-indicator" style="background: var(--success); color: white;">🕒 Especial</span>' : ''}
                    ${tempDayIndicator}
                </div>
            </td>`);
        }
    }
    
    return results.join('');
}

function addToLocationTables(personData, schedule) {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const locations = {};

    // Obtener días de vacaciones
    const vacationDays = getVacationDaysInWeek(personData.name, state.currentWeekOffset);

    // Obtener días festivos
    const holidayIndices = [];
    if (state.events) {
        const weekStart = getWeekStartDate(state.currentWeekOffset);
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + i);
            const year = currentDay.getFullYear();
            const month = String(currentDay.getMonth() + 1).padStart(2, '0');
            const isoDay = String(currentDay.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${isoDay}`;

            if (state.events[dateKey] && state.events[dateKey].type === 'holiday') {
                holidayIndices.push(i);
            }
        }
    }

    // Obtener cambio de ubicación si existe
    const locationChange = getEmployeeLocationChange(personData.name, state.currentWeekOffset);

    // Aplicar cambio de ubicación al horario si existe
    const displaySchedule = locationChange ? applyLocationChangeToSchedule(schedule, locationChange) : schedule;

    days.forEach((day, dayIndex) => {
        // Saltar días de vacaciones
        if (vacationDays.includes(dayIndex)) {
            return;
        }

        if (displaySchedule[day]) {
            const loc = displaySchedule[day].location;

            // Saltar días festivos para NO guardias
            const isHoliday = holidayIndices.includes(dayIndex);
            if (isHoliday && loc !== 'guardia') return;

            if (!locations[loc]) {
                locations[loc] = { days: [], dayIndices: [], startTime: '' };
            }
            locations[loc].days.push(dayNamesShort[dayIndex]);
            locations[loc].dayIndices.push(dayIndex);

            if (!locations[loc].startTime) {
                const timeParts = displaySchedule[day].time.split(' - ');
                locations[loc].startTime = timeParts[0];
            }
        }
    });

    Object.entries(locations).forEach(([loc, data]) => {
        const listId = `${loc}List`;
        const container = document.getElementById(listId);
        if (container) {
            const div = document.createElement('div');
            div.className = 'location-item';

            // Determinar si hay cambio de ubicación en esta ubicación
            const hasLocationChange = locationChange &&
                locationChange.newLocation === loc &&
                data.dayIndices.some(d => locationChange.days.includes(d));

            div.innerHTML = `
                <div>
                    <strong>${personData.name}</strong>
                    <div class="text-xs text-muted">${data.days.join(', ')}</div>
                    ${personData.isTemp ? `<span class="comment-text">${personData.comment}</span>` : ''}
                    ${hasLocationChange ? `<span class="location-change-indicator" style="font-size: 0.7rem;">📍 Cambio temporal</span>` : ''}
                </div>
                <span class="text-sm font-bold" style="color: var(--primary);">${data.startTime}</span>
            `;
            container.appendChild(div);
        }
    });
}

// Versión con resolución por día para las tablas de ubicación
function addToLocationTablesWithDays(scheduleId, schedule, weekOffset) {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    // Obtener festivos
    const holidayIndices = [];
    if (state.events) {
        const weekStart = getWeekStartDate(weekOffset);
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + i);
            const year = currentDay.getFullYear();
            const month = String(currentDay.getMonth() + 1).padStart(2, '0');
            const isoDay = String(currentDay.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${isoDay}`;
            const eventsOnDate = getEventsForDate(dateKey);
            if (eventsOnDate.find(e => e.type === 'holiday')) {
                holidayIndices.push(i);
            }
        }
    }
    
    // Agrupar por persona+ubicación
    const personLocations = {}; // { personName: { loc: { days: [], startTime: '' } } }
    
    days.forEach((day, dayIndex) => {
        const personData = getPersonForSchedule(scheduleId, weekOffset, dayIndex);
        if (!personData) return;
        
        const personName = personData.name;
        const vacationDays = getVacationDaysInWeek(personName, weekOffset);
        if (vacationDays.includes(dayIndex)) return;
        
        const locationChange = getEmployeeLocationChange(personName, weekOffset);
        const displaySchedule = locationChange ? applyLocationChangeToSchedule(schedule, locationChange) : schedule;
        
        if (!displaySchedule[day]) return;
        
        const loc = displaySchedule[day].location;
        const isHoliday = holidayIndices.includes(dayIndex);
        if (isHoliday && loc !== 'guardia') return;
        
        if (!personLocations[personName]) personLocations[personName] = {};
        if (!personLocations[personName][loc]) {
            personLocations[personName][loc] = { days: [], dayIndices: [], startTime: '', isTemp: personData.isTemp, comment: personData.comment || '' };
        }
        personLocations[personName][loc].days.push(dayNamesShort[dayIndex]);
        personLocations[personName][loc].dayIndices.push(dayIndex);
        
        if (!personLocations[personName][loc].startTime) {
            const timeParts = displaySchedule[day].time.split(' - ');
            personLocations[personName][loc].startTime = timeParts[0];
        }
    });
    
    // Renderizar en las tablas de ubicación
    Object.entries(personLocations).forEach(([personName, locs]) => {
        Object.entries(locs).forEach(([loc, data]) => {
            const listId = `${loc}List`;
            const container = document.getElementById(listId);
            if (container) {
                // Verificar si ya existe este persona en esta ubicación
                const existingItems = container.querySelectorAll('.location-item');
                let alreadyExists = false;
                existingItems.forEach(item => {
                    if (item.querySelector('strong') && item.querySelector('strong').textContent === personName) {
                        alreadyExists = true;
                    }
                });
                if (alreadyExists) return;
                
                const div = document.createElement('div');
                div.className = 'location-item';
                
                const locationChange = getEmployeeLocationChange(personName, state.currentWeekOffset);
                const hasLocationChange = locationChange && locationChange.newLocation === loc &&
                    data.dayIndices.some(d => locationChange.days.includes(d));
                
                div.innerHTML = `
                    <div>
                        <strong class="name-loc-${loc}">${personName}</strong>
                        <div class="text-xs text-muted">${data.days.join(', ')}</div>
                        ${data.isTemp ? `<span class="comment-text">${data.comment}</span>` : ''}
                        ${hasLocationChange ? `<span class="location-change-indicator" style="font-size: 0.7rem;">📍 Cambio temporal</span>` : ''}
                    </div>
                    <span class="text-sm font-bold" style="color: var(--primary);">${data.startTime}</span>
                `;
                container.appendChild(div);
            }
        });
    });
}

function openManageAssignments() {
    const modalBody = document.querySelector('#assignModal .modal-body');
    const weekDisplay = `Semana ${state.currentWeekOffset + 1}`;
    modalBody.innerHTML = `
        <h3>Gestionar Asignaciones (${weekDisplay})</h3>
        <p class="text-muted" style="margin-bottom: 1rem;">Asigna quién trabajará cada turno durante esta semana. La rotación continuará desde este punto.</p>
        <div class="assignments-list" style="max-height: 300px; overflow-y: auto;">
            ${scheduleData.map(s => {
                let baseId;
                if (s.id >= 7) {
                    baseId = s.id;
                } else {
                    baseId = (s.id - 1 - state.currentWeekOffset) % 6;
                    if (baseId < 0) baseId += 6;
                    baseId += 1;
                }
                const currentAssignee = state.assignments[baseId] || 'Asignar';
                return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid var(--border);">
                    <span>${s.name}</span>
                    <button class="btn-secondary btn-sm" onclick="editBaseAssignment(${s.id}, ${baseId})">
                        ${currentAssignee}
                    </button>
                </div>
                `;
            }).join('')}
        </div>
    `;
    document.querySelector('#assignModal .modal-footer').style.display = 'none';
    elements.assignModal.classList.add('active');
}

window.editBaseAssignment = function (scheduleId, baseId) {
    currentEditingScheduleId = baseId;
    document.getElementById('modalScheduleId').textContent = scheduleId;

    const modalBody = document.querySelector('#assignModal .modal-body');
    const scheduleName = scheduleData.find(s => s.id === scheduleId).name;
    modalBody.innerHTML = `
        <p>Asignar persona al <strong>${scheduleName}</strong> (Semana actual)</p>
        <div class="form-group">
            <label>Seleccionar Empleado</label>
            <div class="employee-select-group">
                <select id="assignPersonSelect" style="width: 100%; padding: 0.75rem; margin-bottom: 0.5rem;">
                    <option value="">-- Seleccionar --</option>
                    ${state.employees.map(emp => `<option value="${emp}">${emp}</option>`).join('')}
                </select>
                <button id="addNewEmployeeBtn" class="btn-secondary" style="width: 100%;">+ Nuevo Empleado</button>
            </div>
            <div id="newEmployeeForm" style="display: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                <label>Nombre del Nuevo Empleado</label>
                <input type="text" id="newEmployeeInput" placeholder="Nombre completo" style="width: 100%; margin-bottom: 0.5rem;">
                <button id="saveNewEmployeeBtn" class="btn-primary" style="width: 100%;">Guardar Empleado</button>
            </div>
        </div>
    `;
    document.querySelector('#assignModal .modal-footer').style.display = 'flex';
    setupNewEmployeeListeners();
    const currentName = state.assignments[baseId];
    if (currentName) {
        setTimeout(() => {
            const select = document.getElementById('assignPersonSelect');
            if (select) select.value = currentName;
        }, 0);
    }
}

function setupNewEmployeeListeners() {
    document.getElementById('addNewEmployeeBtn').addEventListener('click', () => {
        document.getElementById('newEmployeeForm').style.display = 'block';
        document.getElementById('addNewEmployeeBtn').style.display = 'none';
        document.getElementById('newEmployeeInput').focus();
    });

    document.getElementById('saveNewEmployeeBtn').addEventListener('click', () => {
        const name = document.getElementById('newEmployeeInput').value.trim();
        if (name) {
            if (!state.employees.includes(name)) {
                state.employees.push(name);
                // Guardar en localStorage
                saveToLocalStorage();
                editBaseAssignment(currentEditingScheduleId);
            }
        }
    });
}

function saveAssignment() {
    const select = document.getElementById('assignPersonSelect');
    const name = select ? select.value : '';
    if (name) {
        state.assignments[currentEditingScheduleId] = name;
        saveToLocalStorage();
        openManageAssignments();
    } else {
        if (state.assignments[currentEditingScheduleId]) {
            delete state.assignments[currentEditingScheduleId];
            saveToLocalStorage();
            openManageAssignments();
        }
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    currentEditingScheduleId = null;
    currentSwapData = null;
    if (elements.swapReason) elements.swapReason.value = '';

    if (document.getElementById('loginPass')) document.getElementById('loginPass').value = '';
    if (document.getElementById('loginError')) document.getElementById('loginError').style.display = 'none';
}

// ==========================================
// GESTIÓN DE VACACIONES
// ==========================================

function openManageVacations() {
    const modalBody = document.querySelector('#vacationsModal .modal-body');

    const allEmployees = new Set([...state.employees, ...Object.values(state.assignments)]);
    const sortedEmployees = Array.from(allEmployees).sort();

    if (sortedEmployees.length === 0) {
        modalBody.innerHTML = `
            <p class="text-muted">No hay empleados registrados.</p>
            <p>Por favor, ve a "Gestionar Asignaciones" para agregar empleados primero.</p>
        `;
        elements.vacationsModal.classList.add('active');
        return;
    }

    let html = `
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Asignar Vacaciones</h3>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label>Empleado</label>
                <select id="vacationEmployeeSelect" style="width: 100%; padding: 0.75rem; margin-bottom: 0.5rem;">
                    <option value="">-- Seleccionar Empleado --</option>
                    ${sortedEmployees.map(emp => `<option value="${emp}">${emp}</option>`).join('')}
                </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div class="form-group">
                    <label>Fecha Inicio</label>
                    <input type="date" id="vacationStartDate" style="width: 100%; padding: 0.75rem;">
                </div>
                <div class="form-group">
                    <label>Fecha Fin</label>
                    <input type="date" id="vacationEndDate" style="width: 100%; padding: 0.75rem;">
                </div>
            </div>
            <button id="addVacationBtn" class="btn-primary" style="width: 100%;">Agregar Vacaciones</button>
        </div>
        
        <div style="border-top: 2px solid var(--border); padding-top: 1.5rem;">
            <h3 style="margin-bottom: 1rem;">Vacaciones Programadas</h3>
            <div id="vacationsList" style="max-height: 300px; overflow-y: auto;">
                <!-- Se llenará dinámicamente -->
            </div>
        </div>
    `;

    modalBody.innerHTML = html;

    // Event listener para agregar vacaciones
    document.getElementById('addVacationBtn').addEventListener('click', addVacation);

    // Renderizar lista de vacaciones
    renderVacationsList();

    elements.vacationsModal.classList.add('active');
}

function addVacation() {
    const employeeSelect = document.getElementById('vacationEmployeeSelect');
    const startDateInput = document.getElementById('vacationStartDate');
    const endDateInput = document.getElementById('vacationEndDate');

    const employee = employeeSelect.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!employee) {
        alert('Por favor selecciona un empleado.');
        return;
    }

    if (!startDate || !endDate) {
        alert('Por favor selecciona las fechas de inicio y fin.');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return;
    }

    // Inicializar array si no existe
    if (!state.vacations[employee]) {
        state.vacations[employee] = [];
    }

    // Agregar vacaciones
    state.vacations[employee].push({
        startDate: startDate,
        endDate: endDate
    });

    // Guardar en localStorage
    saveToLocalStorage();

    // Limpiar formulario
    employeeSelect.value = '';
    startDateInput.value = '';
    endDateInput.value = '';

    // Actualizar lista
    renderVacationsList();
}

function renderVacationsList() {
    const container = document.getElementById('vacationsList');

    if (!container) return;

    let html = '';
    let hasVacations = false;

    // Ordenar empleados alfabéticamente
    const sortedEmployees = Object.keys(state.vacations).sort();

    sortedEmployees.forEach(employee => {
        const vacations = state.vacations[employee];
        if (vacations && vacations.length > 0) {
            hasVacations = true;
            html += `
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-body); border-radius: var(--radius-sm); border: 1px solid var(--border);">
                    <strong style="display: block; margin-bottom: 0.75rem; color: var(--primary);">${employee}</strong>
                    ${vacations.map((vac, index) => {
                const start = parseLocalDate(vac.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                const end = parseLocalDate(vac.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                return `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-input); border-radius: var(--radius-sm); margin-bottom: 0.5rem; border: 1px solid var(--border);">
                                <span style="color: var(--text-primary); font-weight: 500; font-size: 0.95rem;">🏖️ ${start} - ${end}</span>
                                <button class="btn-remove-vacation btn-icon" data-employee="${employee}" data-index="${index}" style="background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2);" title="Eliminar">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        `;
            }).join('')}
                </div>
            `;
        }
    });

    if (!hasVacations) {
        html = '<p class="text-muted" style="text-align: center; padding: 2rem;">No hay vacaciones programadas.</p>';
    }

    container.innerHTML = html;

    // Agregar event listeners después de renderizar
    document.querySelectorAll('.btn-remove-vacation').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const employee = this.dataset.employee;
            const index = parseInt(this.dataset.index);

            // Usar modal de confirmación personalizado
            showConfirmDialog(
                `¿Estás seguro de eliminar estas vacaciones de ${employee}?`,
                () => {
                    state.vacations[employee].splice(index, 1);

                    if (state.vacations[employee].length === 0) {
                        delete state.vacations[employee];
                    }

                    saveToLocalStorage();
                    renderVacationsList();
                    renderAll();

                    console.log('✅ Vacaciones eliminadas correctamente');
                }
            );
        });
    });
}

window.removeVacation = function (employee, index) {
    if (confirm(`¿Estás seguro de eliminar estas vacaciones de ${employee}?`)) {
        state.vacations[employee].splice(index, 1);

        // Si no quedan vacaciones, eliminar el empleado del objeto
        if (state.vacations[employee].length === 0) {
            delete state.vacations[employee];
        }

        // Guardar en localStorage
        saveToLocalStorage();

        // Actualizar lista y re-renderizar todas las vistas
        renderVacationsList();
        renderAll();

        console.log('✅ Vacaciones eliminadas correctamente');
    }
}

// ==========================================
// GESTIÓN DE CAMBIOS DE UBICACIÓN
// ==========================================

function openManageLocationChanges() {
    const modalBody = document.querySelector('#locationChangeModal .modal-body');

    const allEmployees = new Set([...state.employees, ...Object.values(state.assignments)]);
    const sortedEmployees = Array.from(allEmployees).sort();

    if (sortedEmployees.length === 0) {
        modalBody.innerHTML = `
            <p class="text-muted">No hay empleados registrados.</p>
            <p>Por favor, ve a "Gestionar Asignaciones" para agregar empleados primero.</p>
        `;
        elements.locationChangeModal.classList.add('active');
        return;
    }

    let html = `
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Cambio de Ubicación Temporal</h3>
            <p class="text-muted" style="margin-bottom: 1rem;">
                Cambia temporalmente la ubicación de un empleado para la semana actual.
            </p>
            
            <div class="form-group" style="margin-bottom: 1rem;">
                <label>Empleado</label>
                <select id="locationChangeEmployeeSelect" style="width: 100%; padding: 0.75rem; margin-bottom: 0.5rem;">
                    <option value="">-- Seleccionar Empleado --</option>
                    ${sortedEmployees.map(emp => `<option value="${emp}">${emp}</option>`).join('')}
                </select>
            </div>
            
            <div id="locationChangeOptions" style="display: none;">
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label>Ubicación Actual</label>
                    <input type="text" id="currentLocationDisplay" readonly style="width: 100%; padding: 0.75rem; background: #f3f4f6;">
                </div>
                
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label>Nueva Ubicación</label>
                    <select id="newLocationSelect" style="width: 100%; padding: 0.75rem;">
                        <option value="">-- Seleccionar Nueva Ubicación --</option>
                        <option value="guardia">GUARDIA</option>
                        <option value="valle">VALLE</option>
                        <option value="mitras">MITRAS</option>
                    </select>
                </div>
                
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label>Días del Cambio</label>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" class="day-checkbox" value="0"> Lunes
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" class="day-checkbox" value="1"> Martes
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" class="day-checkbox" value="2"> Miércoles
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" class="day-checkbox" value="3"> Jueves
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" class="day-checkbox" value="4"> Viernes
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" class="day-checkbox" value="5"> Sábado
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" class="day-checkbox" value="6"> Domingo
                        </label>
                    </div>
                    <button type="button" onclick="selectAllDays()" style="margin-top: 0.5rem; padding: 0.5rem; background: #e5e7eb; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                        Seleccionar Toda la Semana
                    </button>
                </div>
                
                <div class="form-group" style="margin-bottom: 1rem;">
                    <label>Motivo del Cambio (Obligatorio)</label>
                    <textarea id="locationChangeReason" rows="2" placeholder="Ej: Cobertura temporal en sucursal..." style="width: 100%; padding: 0.75rem;"></textarea>
                </div>
                
                <button id="saveLocationChangeBtn" class="btn-primary" style="width: 100%;">Aplicar Cambio de Ubicación</button>
            </div>
        </div>
        
        <div style="border-top: 2px solid var(--border); padding-top: 1.5rem;">
            <h3 style="margin-bottom: 1rem;">Cambios Activos (Semana ${state.currentWeekOffset + 1})</h3>
            <div id="locationChangesList" style="max-height: 200px; overflow-y: auto;">
                <!-- Se llenará dinámicamente -->
            </div>
        </div>
    `;

    modalBody.innerHTML = html;

    // Event listeners
    document.getElementById('locationChangeEmployeeSelect').addEventListener('change', function () {
        const employee = this.value;
        if (employee) {
            showLocationChangeOptions(employee);
        } else {
            document.getElementById('locationChangeOptions').style.display = 'none';
        }
    });

    document.getElementById('saveLocationChangeBtn').addEventListener('click', saveLocationChange);

    // Renderizar lista de cambios activos
    renderLocationChangesList();

    elements.locationChangeModal.classList.add('active');
}

function showLocationChangeOptions(employeeName) {
    // Obtener el horario actual del empleado
    const scheduleId = getScheduleForPerson(employeeName, state.currentWeekOffset);
    const schedule = scheduleData.find(s => s.id === scheduleId);

    if (!schedule) {
        alert('No se pudo determinar el horario del empleado');
        return;
    }

    // Encontrar la ubicación más común en su horario
    const locations = [];
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    days.forEach(day => {
        if (schedule[day] && schedule[day].location) {
            locations.push(schedule[day].location);
        }
    });

    const currentLocation = locations.length > 0 ? locations[0] : 'N/A';

    document.getElementById('currentLocationDisplay').value = currentLocation.toUpperCase();
    document.getElementById('locationChangeOptions').style.display = 'block';

    // Filtrar opciones para no mostrar la ubicación actual
    const newLocationSelect = document.getElementById('newLocationSelect');
    Array.from(newLocationSelect.options).forEach(option => {
        if (option.value === currentLocation) {
            option.disabled = true;
            option.text = option.text + ' (Actual)';
        } else {
            option.disabled = false;
            option.text = option.value.toUpperCase();
        }
    });
}

window.selectAllDays = function () {
    const checkboxes = document.querySelectorAll('.day-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
}

function saveLocationChange() {
    const employee = document.getElementById('locationChangeEmployeeSelect').value;
    const currentLocation = document.getElementById('currentLocationDisplay').value.toLowerCase();
    const newLocation = document.getElementById('newLocationSelect').value;
    const reason = document.getElementById('locationChangeReason').value.trim();

    // Obtener días seleccionados
    const selectedDays = Array.from(document.querySelectorAll('.day-checkbox:checked'))
        .map(cb => parseInt(cb.value));

    if (!employee || !newLocation || !reason) {
        alert('Por favor completa todos los campos.');
        return;
    }

    if (selectedDays.length === 0) {
        alert('Por favor selecciona al menos un día.');
        return;
    }

    if (currentLocation === newLocation) {
        alert('La nueva ubicación debe ser diferente a la actual.');
        return;
    }

    const weekKey = state.currentWeekOffset.toString();

    if (!state.locationChanges[weekKey]) {
        state.locationChanges[weekKey] = {};
    }

    state.locationChanges[weekKey][employee] = {
        days: selectedDays,
        originalLocation: currentLocation,
        newLocation: newLocation,
        reason: reason
    };

    // Guardar en localStorage
    saveToLocalStorage();

    // Limpiar formulario
    document.getElementById('locationChangeEmployeeSelect').value = '';
    document.getElementById('newLocationSelect').value = '';
    document.getElementById('locationChangeReason').value = '';
    document.querySelectorAll('.day-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('locationChangeOptions').style.display = 'none';

    // Actualizar lista y renderizar vistas
    renderLocationChangesList();
    renderAll();

    alert('✅ Cambio de ubicación aplicado correctamente!');
}

function renderLocationChangesList() {
    const container = document.getElementById('locationChangesList');

    if (!container) return;

    const weekKey = state.currentWeekOffset.toString();
    const changes = state.locationChanges[weekKey] || {};

    if (Object.keys(changes).length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align: center; padding: 1rem;">No hay cambios de ubicación para esta semana.</p>';
        return;
    }

    let html = '';
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    Object.entries(changes).forEach(([employee, change]) => {
        const daysText = change.days && change.days.length > 0
            ? change.days.map(d => dayNames[d]).join(', ')
            : 'Toda la semana';

        html += `
            <div style="margin-bottom: 1rem; padding: 1rem; background: var(--bg-body); border-radius: var(--radius-sm); border: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <strong style="color: var(--primary);">${employee}</strong>
                    <button class="btn-remove-location-change btn-icon" data-employee="${employee}" style="background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2);" title="Eliminar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                    </button>
                </div>
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                    📍 De <strong>${change.originalLocation.toUpperCase()}</strong> → <strong>${change.newLocation.toUpperCase()}</strong>
                </div>
                <div style="font-size: 0.85rem; color: var(--primary); margin-bottom: 0.5rem;">
                    📅 Días: <strong>${daysText}</strong>
                </div>
                <div style="font-size: 0.85rem; font-style: italic; color: var(--text-muted);">
                    "${change.reason}"
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Agregar event listeners después de renderizar
    document.querySelectorAll('.btn-remove-location-change').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const employee = this.dataset.employee;

            // Usar modal de confirmación personalizado
            showConfirmDialog(
                `¿Estás seguro de eliminar el cambio de ubicación de ${employee}?`,
                () => {
                    const weekKey = state.currentWeekOffset.toString();
                    delete state.locationChanges[weekKey][employee];

                    if (Object.keys(state.locationChanges[weekKey]).length === 0) {
                        delete state.locationChanges[weekKey];
                    }

                    saveToLocalStorage();
                    renderLocationChangesList();
                    renderAll();

                    console.log('✅ Cambio de ubicación eliminado correctamente');
                }
            );
        });
    });
}

// Helper para buscar eventos por fecha (compatible ID/Fecha)
function getEventsForDate(dateStr) {
    if (!state.events) return [];
    const events = [];
    Object.entries(state.events).forEach(([key, value]) => {
        // Si tiene .date (nuevo) o la clave es fecha (viejo)
        const d = value.date || (key.match(/^\d{4}-\d{2}-\d{2}$/) ? key : null);
        if (d === dateStr) events.push(value);
    });
    return events;
}

// Función para renderizar el banner de eventos en las vistas principales
function renderEventsBanner(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Limpiar

    if (!state.events || Object.keys(state.events).length === 0) return;

    const weekStart = getWeekStartDate(state.currentWeekOffset);
    const weekEnd = getWeekEndDate(state.currentWeekOffset);

    // Convertir a medianoche para comparación exacta
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);

    const eventsToShow = [];

    Object.entries(state.events).forEach(([key, value]) => {
        if (!value) return;

        // Compatibilidad: value.date (nuevo) o key (viejo)
        const dateStr = value.date || (typeof key === 'string' && key.match(/^\d{4}-\d{2}-\d{2}$/) ? key : null);

        if (!dateStr) return;

        try {
            const eventDate = parseLocalDate(dateStr);
            if (eventDate >= weekStart && eventDate <= weekEnd) {
                eventsToShow.push({
                    date: eventDate,
                    ...value
                });
            }
        } catch (e) {
            console.error(e);
        }
    });

    if (eventsToShow.length === 0) return;

    // Ordenar por fecha
    eventsToShow.sort((a, b) => a.date - b.date);

    // Usar Grid para segmentar múltiples eventos
    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">';

    eventsToShow.forEach(event => {
        const dateFormatted = event.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

        let bgColor = '';
        let icon = '';
        let animationClass = 'animate-pulse';

        switch (event.type) {
            case 'holiday':
                bgColor = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
                icon = '🎉';
                break;
            case 'alert':
                bgColor = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
                icon = '⚠️';
                break;
            case 'payday':
                bgColor = 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)';
                icon = '💰';
                break;
            default:
                bgColor = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
                icon = 'ℹ️';
        }

        html += `
            <div style="background: ${bgColor}; color: white; padding: 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-md); display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; min-height: 80px;">
                <div style="display: flex; align-items: center; gap: 1rem; position: relative; z-index: 2; width: 100%;">
                    <span style="font-size: 2rem;">${icon}</span>
                    <div style="flex: 1;">
                        <h3 style="margin: 0; font-size: 0.9rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">${dateFormatted}</h3>
                        <p class="${animationClass}" style="margin: 0; font-size: 1.1rem; font-weight: bold; line-height: 1.2;">${event.text}</p>
                    </div>
                </div>
                <!-- Decoración de fondo -->
                <div style="position: absolute; top: -10px; right: -10px; opacity: 0.15; font-size: 6rem; transform: rotate(15deg); pointer-events: none;">${icon}</div>
            </div>
        `;
    });

    html += '</div>';

    container.innerHTML = html;
}

// ==========================================
// GESTIÓN DE EVENTOS Y AVISOS
// ==========================================

function openManageEvents() {
    // Listener para borrar todos los eventos (Configurado al principio por seguridad)
    const deleteBtn = document.getElementById('deleteAllEventsBtn');
    if (deleteBtn) {
        const newDeleteBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
        newDeleteBtn.addEventListener('click', deleteAllEvents);
    }

    const modal = document.getElementById('eventsModal');
    modal.classList.add('active');

    // Establecer fecha de hoy como default
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('eventDate').value = dateStr;

    // Limpiar otros campos
    document.getElementById('eventText').value = '';
    document.getElementById('eventType').value = 'notice';
    document.getElementById('guardiaStart').value = '';
    document.getElementById('guardiaEnd').value = '';

    // Resetear visibilidad
    toggleGuardiaFields();

    // Renderizar lista (protegido con try-catch para no detener la ejecución si falla)
    try {
        renderEventsList();
    } catch (e) {
        console.error("Error renderizando lista de eventos:", e);
        document.getElementById('eventsList').innerHTML = '<p class="text-danger">Error mostrando eventos. Usa "Borrar Todo" para limpiar.</p>';
    }
}

// Función auxiliar para mostrar/ocultar campos de guardia
function toggleGuardiaFields() {
    const type = document.getElementById('eventType').value;
    const container = document.getElementById('guardiaTimeContainer');
    if (container) {
        container.style.display = (type === 'holiday') ? 'block' : 'none';
    }
}

// Agregar listener al select de tipo (si no existe ya)
const eventTypeSelect = document.getElementById('eventType');
if (eventTypeSelect) {
    eventTypeSelect.addEventListener('change', toggleGuardiaFields);
}

function saveEvent() {
    const date = document.getElementById('eventDate').value;
    const type = document.getElementById('eventType').value;
    const text = document.getElementById('eventText').value;

    if (!date || !text) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Inicializar objeto de eventos si no existe
    if (!state.events) state.events = {};

    // Objeto evento completo con fecha
    const eventData = {
        date: date,
        text: text,
        type: type
    };

    // Agregar horario especial si es holiday
    if (type === 'holiday') {
        const gStart = document.getElementById('guardiaStart').value;
        const gEnd = document.getElementById('guardiaEnd').value;
        if (gStart && gEnd) {
            eventData.guardiaStart = convertToAMPM(gStart);
            eventData.guardiaEnd = convertToAMPM(gEnd);
        }
    }

    // Guardar evento usando push para generar ID único
    const newRef = db.ref('appData/events').push();
    console.log("Intentando guardar evento:", eventData);

    newRef.set(eventData)
        .then(() => {
            console.log('✅ Evento creado en Firebase con ID:', newRef.key);

            // Actualización visual local (protegida)
            try {
                if (!state.events) state.events = {};
                state.events[newRef.key] = eventData;
                renderEventsList();
                renderAll();
            } catch (e) {
                console.warn("Error visual actualizando interfaz (no crítico):", e);
            }

            // Limpiar texto
            document.getElementById('eventText').value = '';

            // Feedback visual
            const btn = document.getElementById('saveEventBtn');
            const originalText = btn.textContent;
            btn.textContent = '✅ Guardado';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1500);
        })
        .catch(error => {
            console.error('Error creando evento:', error);
            alert('Error al crear evento:\n' + error.message + '\n\nVerifica tu conexión y permisos.');
        });
}

// Helper para convertir HH:mm (24h) a hh:mm AM/PM
function convertToAMPM(time24) {
    let [hours, minutes] = time24.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // el 0 es 12
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

function renderEventsList() {
    const container = document.getElementById('eventsList');
    if (!container) return;

    if (!state.events || Object.keys(state.events).length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align: center; padding: 1rem;">No hay eventos programados.</p>';
        return;
    }

    // Convertir a array manejando compatibilidad
    // Datos nuevos: ID -> { date: '...', ... }
    // Datos viejos: DATE -> { ... }
    const eventsArray = Object.entries(state.events).map(([key, value]) => {
        const date = value.date || (key.match(/^\d{4}-\d{2}-\d{2}$/) ? key : null);
        return {
            id: key,
            ...value,
            date: date
        };
    }).filter(e => e.date);

    // Ordenar por fecha
    eventsArray.sort((a, b) => a.date.localeCompare(b.date));

    // Obtener fecha actual (solo fecha, sin hora)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let html = '';

    eventsArray.forEach(event => {
        const dateObj = parseLocalDate(event.date);
        const dateFormatted = dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

        // Verificar si el evento ya pasó
        const eventoPasado = dateObj < hoy;

        let typeLabel = '';
        let typeColor = '';

        switch (event.type) {
            case 'holiday': typeLabel = 'Festivo'; typeColor = 'var(--success)'; break;
            case 'alert': typeLabel = 'Alerta'; typeColor = 'var(--danger)'; break;
            case 'payday': typeLabel = 'Quincena'; typeColor = '#d97706'; break;
            default: typeLabel = 'Aviso'; typeColor = 'var(--primary)';
        }

        // Si el evento pasó, usar colores grises
        const containerStyle = eventoPasado
            ? `opacity: 0.5; filter: grayscale(100%);`
            : '';

        const borderColor = eventoPasado ? '#9ca3af' : typeColor;

        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-body); border-radius: var(--radius-sm); margin-bottom: 0.5rem; border-left: 4px solid ${borderColor}; ${containerStyle}">
                <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${dateFormatted} <span style="background: ${typeColor}20; color: ${typeColor}; padding: 2px 6px; border-radius: 4px; margin-left: 0.5rem; font-weight: bold;">${typeLabel}</span>${eventoPasado ? ' <span style="background: #e5e7eb; color: #6b7280; padding: 2px 6px; border-radius: 4px; margin-left: 0.5rem; font-size: 0.7em;">PASADO</span>' : ''}</div>
                    <div style="font-weight: 500;">${event.text}</div>
                    ${event.guardiaStart ? `<div style="font-size: 0.75rem; color: #059669; margin-top: 2px;">🕒 Guardia: ${event.guardiaStart} - ${event.guardiaEnd}</div>` : ''}
                </div>
                <button class="btn-remove-event btn-icon" onclick="forceDeleteOneEvent('${event.id}')" style="color: var(--danger); opacity: 0.7;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
            </div>
        `;
    });

    container.innerHTML = html || '<p class="text-muted" style="text-align: center;">No hay eventos visibles.</p>';

    // Listener de borrado por ID
    container.querySelectorAll('.btn-remove-event').forEach(btn => {
        btn.addEventListener('click', function () {
            const eventId = this.dataset.id;
            console.log("Intentando borrar evento con ID:", eventId);
            showConfirmDialog('¿Eliminar este evento?', () => {
                const eventRef = db.ref('appData/events/' + eventId);

                eventRef.remove()
                    .then(() => {
                        console.log('✅ Evento eliminado');
                        if (state.events[eventId]) delete state.events[eventId];
                        renderEventsList();
                        renderAll();
                    })
                    .catch(error => {
                        console.error('Error al eliminar:', error);
                        alert('❌ Error al eliminar.\\nPosible causa: Permisos denegados en Firebase.');
                    });
            });
        });
    });
}



// ==========================================
// MODAL DE CONFIRMACIÓN PERSONALIZADO
// ==========================================

function showConfirmDialog(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const messageEl = document.getElementById('confirmMessage');
    const okBtn = document.getElementById('confirmOkBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');

    messageEl.textContent = message;
    modal.classList.add('active');

    // Remover listeners anteriores clonando los botones
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Agregar nuevos listeners
    newOkBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (onConfirm) onConfirm();
    });

    newCancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // También cerrar con el botón X
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });
}

// ==========================================
// CAMBIO DE CONTRASEÑA
// ==========================================

function openChangePassword() {
    const modal = document.getElementById('changePasswordModal');
    modal.classList.add('active');

    // Limpiar campos
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('passwordSuccess').style.display = 'none';
}

function saveNewPassword() {
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('passwordError');
    const successDiv = document.getElementById('passwordSuccess');

    // Ocultar mensajes previos
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Validaciones
    if (!currentPass || !newPass || !confirmPass) {
        errorDiv.textContent = '❌ Por favor completa todos los campos';
        errorDiv.style.display = 'block';
        return;
    }

    const adminPassword = getAdminPassword();
    if (currentPass !== adminPassword) {
        errorDiv.textContent = '❌ La contraseña actual es incorrecta';
        errorDiv.style.display = 'block';
        return;
    }

    if (newPass.length < 6) {
        errorDiv.textContent = '❌ La nueva contraseña debe tener al menos 6 caracteres';
        errorDiv.style.display = 'block';
        return;
    }

    if (newPass !== confirmPass) {
        errorDiv.textContent = '❌ Las contraseñas no coinciden';
        errorDiv.style.display = 'block';
        return;
    }

    // Guardar nueva contraseña
    setAdminPassword(newPass);

    // Mostrar éxito
    successDiv.style.display = 'block';

    // Limpiar campos
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';

    // Cerrar modal después de 2 segundos
    setTimeout(() => {
        closeModal();
    }, 2000);

    console.log('✅ Contraseña de administrador cambiada correctamente');
}

function switchTab(tabName) {
    elements.tabs.forEach(t => t.classList.remove('active'));
    elements.contents.forEach(c => c.classList.remove('active'));

    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(`${tabName}-tab`);

    if (tabBtn) tabBtn.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
}

function resetDatabase() {
    const emptyState = {
        assignments: {},
        employees: [],
        weeklyOverrides: {},
        customTitles: {},
        vacations: {},
        locationChanges: {},
        events: {}
    };

    db.ref('appData').set(emptyState)
        .then(() => {
            alert('✅ Base de datos reseteada correctamente.');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error borrando base de datos:', error);
            alert('Error borrando datos. Revisa la consola.');
        });
}

function deleteAllEvents() {
    showConfirmDialog('⚠️ ¿ESTÁS SEGURO?\nEsto borrará TODOS los eventos registrados.\nEsta acción no se puede deshacer.', () => {
        const eventsRef = db.ref('appData/events');
        eventsRef.remove()
            .then(() => {
                console.log('✅ Todos los eventos eliminados');
                state.events = {};
                renderEventsList();
                renderAll();
            })
            .catch(error => {
                console.error('Error al eliminar eventos:', error);
                alert('❌ Error al eliminar eventos.\nRevisa permisos.');
            });
    });
}

// Función de emergencia para borrar eventos
function forceDeleteEvents() {
    if (confirm('ATENCIÓN: Se borrarán TODOS los eventos y avisos.\n¿Estás seguro de continuar?')) {
        db.ref('appData/events').remove()
            .then(() => {
                alert('✅ Eventos eliminados correctamente.\nLa página se recargará.');
                window.location.reload();
            })
            .catch(e => alert('Error al borrar: ' + e.message));
    }
}
window.forceDeleteEvents = forceDeleteEvents;

// Versión robusta de renderEventsBanner usando strings YYYY-MM-DD
function renderEventsBannerV2(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (!state.events || Object.keys(state.events).length === 0) return;

    const weekStart = getWeekStartDate(state.currentWeekOffset);
    const weekEnd = getWeekEndDate(state.currentWeekOffset);

    const toISODate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const weekStartStr = toISODate(weekStart);
    const weekEndStr = toISODate(weekEnd);

    const eventsToShow = [];

    Object.entries(state.events).forEach(([key, value]) => {
        if (!value) return;
        const dateStr = value.date || (typeof key === 'string' && key.match(/^\d{4}-\d{2}-\d{2}$/) ? key : null);

        if (dateStr && dateStr >= weekStartStr && dateStr <= weekEndStr) {
            eventsToShow.push({
                date: parseLocalDate(dateStr),
                ...value
            });
        }
    });

    if (eventsToShow.length === 0) {
        // Mostrar mensaje si no hay eventos para confirmar que la lógica funciona
        // Esto ayuda al usuario a saber que no hay eventos en ese rango específico
        container.innerHTML = `<div style="padding: 0.5rem; margin-bottom: 1rem; border: 1px dashed var(--border); color: var(--text-muted); text-align: center; font-size: 0.8rem; border-radius: var(--radius-sm);">
            No hay avisos programados para la semana del ${weekStartStr} al ${weekEndStr}
        </div>`;
        return;
    }

    // Ordenar por fecha
    eventsToShow.sort((a, b) => a.date - b.date);

    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">';

    eventsToShow.forEach(event => {
        const dateFormatted = event.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        let bgColor = '', icon = '', animationClass = 'animate-pulse';

        switch (event.type) {
            case 'holiday': bgColor = 'linear-gradient(135deg, #059669 0%, #10b981 100%)'; icon = '🎉'; break;
            case 'alert': bgColor = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'; icon = '⚠️'; break;
            case 'payday': bgColor = 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'; icon = '💰'; break;
            default: bgColor = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'; icon = 'ℹ️';
        }

        html += `
            <div style="background: ${bgColor}; color: white; padding: 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-md); display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; min-height: 80px;">
                <div style="display: flex; align-items: center; gap: 1rem; position: relative; z-index: 2; width: 100%;">
                    <span style="font-size: 2rem;">${icon}</span>
                    <div style="flex: 1;">
                        <h3 style="margin: 0; font-size: 0.9rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">${dateFormatted}</h3>
                        <p class="${animationClass}" style="margin: 0; font-size: 1.1rem; font-weight: bold; line-height: 1.2;">${event.text}</p>
                    </div>
                </div>
                <div style="position: absolute; top: -10px; right: -10px; opacity: 0.15; font-size: 6rem; transform: rotate(15deg); pointer-events: none;">${icon}</div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// Función de borrado individual robusta
function forceDeleteOneEvent(eventId) {
    if (confirm('¿Eliminar este evento?')) {
        db.ref('appData/events/' + eventId).remove()
            .then(() => {
                // Eliminación exitosa
                console.log("Evento eliminado:", eventId);
                // Si la actualización en tiempo real falla, forzamos update local
                if (state.events && state.events[eventId]) {
                    delete state.events[eventId];
                }
                // Forzar renderizado siempre para feedback inmediato
                try {
                    renderEventsList();
                    renderAll();
                } catch (e) { }
            })
            .catch(e => alert('Error al borrar: ' + e.message));
    }
}
window.forceDeleteOneEvent = forceDeleteOneEvent;

// Diagnóstico
function showDebugInfo() {
    const info = {
        weekOffset: state.currentWeekOffset,
        eventsCount: state.events ? Object.keys(state.events).length : 0,
        eventsKeys: state.events ? Object.keys(state.events) : [],
        dataSample: state.events
    };
    alert(JSON.stringify(info, null, 2));
    console.log("DEBUG INFO:", info);
}
window.showDebugInfo = showDebugInfo;

// Versión V3: Diagnóstico Visual Extremo
function renderEventsBannerV3(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Contenedor Banner no encontrado:", containerId);
        return;
    }

    // Asegurar visibilidad básica
    container.style.display = 'block';
    container.style.marginBottom = '1.5rem';

    // Obtener eventos
    const events = state.events || {};
    const eventsCount = Object.keys(events).length;

    // Fechas actuales
    const weekStart = getWeekStartDate(state.currentWeekOffset);
    const weekEnd = getWeekEndDate(state.currentWeekOffset);

    let weekStartStr, weekEndStr;
    try {
        const toISODate = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        weekStartStr = toISODate(weekStart);
        weekEndStr = toISODate(weekEnd);
    } catch (e) {
        container.innerHTML = '<div style="color:red; padding:10px; border:1px solid red">Error fechas banner: ' + e.message + '</div>';
        return;
    }

    // Si no hay eventos en todo el sistema
    if (eventsCount === 0) {
        // container.innerHTML = ''; // Opción silenciosa
        // Opción diagnóstica:
        container.innerHTML = `<div style="padding: 10px; background: #f9f9f9; border: 1px dashed #ccc; color: #aaa; text-align: center; font-size: 0.8em;">
            Sistema de avisos activo. Sin eventos registrados.
        </div>`;
        return;
    }

    const eventsToShow = [];
    Object.entries(events).forEach(([key, value]) => {
        if (!value) return;
        const dateStr = value.date || (typeof key === 'string' && key.match(/^\d{4}-\d{2}-\d{2}$/) ? key : null);

        // Comparación de Strings ISO
        if (dateStr && dateStr >= weekStartStr && dateStr <= weekEndStr) {
            eventsToShow.push({
                dateStr: dateStr,
                dateObj: parseLocalDate(dateStr),
                ...value
            });
        }
    });

    // Añadir vacaciones a la lista de eventos del banner (solo si caen en esta semana)
    if (state.vacations) {
        Object.entries(state.vacations).forEach(([employeeName, vacations]) => {
            vacations.forEach(vac => {
                if (vac.startDate && vac.endDate) {
                    // Verificar si hay superposición entre las vacaciones y esta semana
                    if (vac.startDate <= weekEndStr && vac.endDate >= weekStartStr) {
                        // Usar la fecha de inicio o el inicio de la semana, lo que sea mayor, para mostrar el evento
                        const displayDate = vac.startDate >= weekStartStr ? vac.startDate : weekStartStr;
                        let endText = `(hasta el ${parseLocalDate(vac.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })})`;
                        eventsToShow.push({
                            dateStr: displayDate,
                            dateObj: parseLocalDate(displayDate),
                            type: 'vacation',
                            text: `Vacaciones de ${employeeName} ${endText}`,
                            employee: employeeName,
                            endDate: vac.endDate
                        });
                    }
                }
            });
        });
    }

    // Si no hay en esta semana
    if (eventsToShow.length === 0) {
        container.innerHTML = `<div style="padding: 10px; background: #f9f9f9; border: 1px dashed #ccc; color: #aaa; text-align: center; font-size: 0.8em;">
            No hay avisos para esta semana (${weekStartStr} al ${weekEndStr})<br>
            <small>Total eventos en sistema: ${eventsCount}</small>
        </div>`;
        return;
    }

    // Renderizar eventos encontrados
    eventsToShow.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

    let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">';

    eventsToShow.forEach(event => {
        let dateFormatted = event.dateStr;
        try {
            dateFormatted = event.dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        } catch (e) { }

        let bgColor = '', icon = '', animationClass = 'animate-pulse';

        switch (event.type) {
            case 'holiday': bgColor = 'linear-gradient(135deg, #059669 0%, #10b981 100%)'; icon = '🎉'; break;
            case 'alert': bgColor = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'; icon = '⚠️'; break;
            case 'payday': bgColor = 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'; icon = '💰'; break;
            case 'vacation': bgColor = 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'; icon = '🌴'; break;
            default: bgColor = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'; icon = 'ℹ️';
        }

        html += `
            <div style="background: ${bgColor}; color: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; min-height: 80px;">
                <div style="display: flex; align-items: center; gap: 1rem; position: relative; z-index: 2; width: 100%;">
                    <span style="font-size: 2rem;">${icon}</span>
                    <div style="flex: 1;">
                        <h3 style="margin: 0; font-size: 0.9rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">${dateFormatted}</h3>
                        <p class="${animationClass}" style="margin: 0; font-size: 1.1rem; font-weight: bold; line-height: 1.2;">${event.text}</p>
                    </div>
                </div>
                <div style="position: absolute; top: -10px; right: -10px; opacity: 0.15; font-size: 6rem; transform: rotate(15deg); pointer-events: none;">${icon}</div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

// ==========================================
// GESTIÓN DE CAMBIOS TEMPORALES
// ==========================================

function openManageTempChanges() {
    const modal = document.getElementById('tempChangesModal');
    const modalBody = modal.querySelector('.modal-body');

    // Recopilar todos los cambios temporales activos
    const tempChanges = [];

    Object.entries(state.weeklyOverrides).forEach(([weekKey, schedules]) => {
        const weekOffset = parseInt(weekKey);
        const weekRange = getWeekDateRange(weekOffset);

        Object.entries(schedules).forEach(([scheduleId, data]) => {
            const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            const isPartial = data.days && data.days.length > 0 && data.days.length < 7;
            const daysText = isPartial ? data.days.map(d => dayNamesShort[d]).join(', ') : 'Semana Completa';
            
            tempChanges.push({
                weekOffset,
                weekRange,
                scheduleId: parseInt(scheduleId),
                person: data.person,
                comment: data.comment,
                daysText: daysText,
                isPartial: isPartial
            });
        });
    });

    if (tempChanges.length === 0) {
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="64" height="64" style="margin: 0 auto 1rem; opacity: 0.3;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 style="margin-bottom: 0.5rem;">No hay cambios temporales activos</h3>
                <p>Los cambios temporales aparecerán aquí cuando se realicen.</p>
            </div>
        `;
    } else {
        // Ordenar por semana
        tempChanges.sort((a, b) => a.weekOffset - b.weekOffset);

        let html = `
            <div style="margin-bottom: 1rem;">
                <p style="color: var(--text-muted); font-size: 0.9rem;">
                    Se encontraron <strong>${tempChanges.length}</strong> cambio(s) temporal(es) activo(s).
                </p>
            </div>
            <div style="max-height: 400px; overflow-y: auto;">
        `;

        tempChanges.forEach((change, index) => {
            html += `
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: var(--primary); margin-bottom: 0.25rem;">
                                Semana ${change.weekOffset + 1} - ${change.weekRange}
                            </div>
                            <div style="font-size: 0.9rem; margin-bottom: 0.25rem;">
                                <strong>Horario ${change.scheduleId}</strong> → <strong>${change.person}</strong>
                            </div>
                            <div style="font-size: 0.85rem; margin-bottom: 0.25rem;">
                                📅 <span style="color: ${change.isPartial ? 'var(--primary)' : 'var(--text-muted)'}; font-weight: ${change.isPartial ? '600' : 'normal'};">${change.daysText}</span>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
                                "${change.comment}"
                            </div>
                        </div>
                        <button 
                            onclick="revokeTempChange(${change.weekOffset}, ${change.scheduleId})"
                            class="btn-icon"
                            style="background: var(--danger); color: white; padding: 0.5rem; border-radius: 6px;"
                            title="Revocar cambio">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        modalBody.innerHTML = html;
    }

    modal.classList.add('active');
}

window.revokeTempChange = function (weekOffset, scheduleId) {
    const weekKey = weekOffset.toString();
    const weekRange = getWeekDateRange(weekOffset);

    showConfirmDialog(
        `¿Revocar el cambio temporal del Horario ${scheduleId} en la Semana ${weekOffset + 1} (${weekRange})?`,
        () => {
            if (state.weeklyOverrides[weekKey] && state.weeklyOverrides[weekKey][scheduleId]) {
                delete state.weeklyOverrides[weekKey][scheduleId];

                // Limpiar la semana si no hay más cambios
                if (Object.keys(state.weeklyOverrides[weekKey]).length === 0) {
                    delete state.weeklyOverrides[weekKey];
                }

                saveToLocalStorage();
                openManageTempChanges(); // Refrescar el modal
                renderAll(); // Refrescar las vistas

                alert('✅ Cambio temporal revocado exitosamente');
            }
        }
    );
};

// ==========================================
// VISTA DE TODOS LOS EVENTOS
// ==========================================

function renderAllEventsView() {
    const container = document.getElementById('allEventsContainer');
    if (!container) return;

    const events = state.events || {};
    const eventsList = [];

    // Convertir eventos a array
    Object.entries(events).forEach(([key, value]) => {
        if (!value) return;
        const dateStr = value.date || (typeof key === 'string' && key.match(/^\d{4}-\d{2}-\d{2}$/) ? key : null);

        if (dateStr) {
            eventsList.push({
                dateStr: dateStr,
                dateObj: parseLocalDate(dateStr),
                ...value
            });
        }
    });

    // Añadir vacaciones a la lista de eventos
    if (state.vacations) {
        Object.entries(state.vacations).forEach(([employeeName, vacations]) => {
            vacations.forEach(vac => {
                if (vac.startDate) {
                    let endText = vac.endDate ? ` (hasta el ${parseLocalDate(vac.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })})` : '';
                    eventsList.push({
                        dateStr: vac.startDate,
                        dateObj: parseLocalDate(vac.startDate),
                        type: 'vacation',
                        text: `Vacaciones de ${employeeName}${endText}`,
                        employee: employeeName,
                        endDate: vac.endDate
                    });
                }
            });
        });
    }

    if (eventsList.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="80" height="80" style="margin: 0 auto 1.5rem; opacity: 0.3;">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">No hay eventos registrados</h3>
                <p style="font-size: 1rem;">Los eventos y avisos aparecerán aquí cuando se agreguen.</p>
                ${state.isAdmin ? '<p style="margin-top: 1rem;"><em>Ve a Configuración → Eventos y Avisos para agregar eventos.</em></p>' : ''}
            </div>
        `;
        return;
    }

    // Ordenar por fecha
    eventsList.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

    // Crear filtro de búsqueda
    let html = `
        <div style="margin-bottom: 2rem; background: var(--glass-bg); backdrop-filter: blur(20px); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); border: 1px solid var(--glass-border);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end;">
                <div style="flex: 1; min-width: 250px;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary); font-size: 0.85rem;">
                        🔍 Buscar Evento
                    </label>
                    <input 
                        type="text" 
                        id="eventSearchInput" 
                        placeholder="Buscar por texto, fecha o tipo..."
                        style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 0.95rem; transition: all 0.3s; background: var(--bg-primary); color: var(--text-primary);"
                        onkeyup="filterEvents()"
                        onfocus="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 0 0 3px rgba(0, 122, 255, 0.1)'"
                        onblur="this.style.borderColor='var(--border)'; this.style.boxShadow='none'"
                    >
                </div>
                <div style="min-width: 200px;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary); font-size: 0.85rem;">
                        🏷️ Filtrar por Tipo
                    </label>
                    <select 
                        id="eventTypeFilter" 
                        onchange="filterEvents()"
                        style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 0.95rem; background: var(--bg-primary); color: var(--text-primary); cursor: pointer; transition: all 0.3s;"
                        onfocus="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 0 0 3px rgba(0, 122, 255, 0.1)'"
                        onblur="this.style.borderColor='var(--border)'; this.style.boxShadow='none'">
                        <option value="all">Todos los tipos</option>
                        <option value="notice">ℹ️ Avisos</option>
                        <option value="holiday">🎉 Días Festivos</option>
                        <option value="alert">⚠️ Alertas</option>
                        <option value="payday">💰 Quincenas</option>
                        <option value="vacation">🌴 Vacaciones</option>
                    </select>
                </div>
                <div style="display: flex; align-items: flex-end;">
                    <button 
                        onclick="clearEventFilters()" 
                        class="btn-secondary"
                        style="padding: 0.75rem 1.5rem; white-space: nowrap; height: 48px;">

                        ✖️ Limpiar
                    </button>
                </div>
            </div>
            <div id="eventFilterStats" style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted);"></div>
        </div>
        <div id="eventsListContainer">
    `;

    // Agrupar por mes
    const eventsByMonth = {};
    eventsList.forEach(event => {
        const monthKey = event.dateStr.substring(0, 7); // YYYY-MM
        if (!eventsByMonth[monthKey]) {
            eventsByMonth[monthKey] = [];
        }
        eventsByMonth[monthKey].push(event);
    });

    // Helper para colapsar meses (inyectado aquí para asegurar alcance)
    if (!window.toggleMonthEvents) {
        window.toggleMonthEvents = function (monthKey) {
            const container = document.getElementById(`events-grid-${monthKey}`);
            const icon = document.getElementById(`icon-${monthKey}`);
            if (container) {
                const isHidden = container.style.display === 'none';
                container.style.display = isHidden ? 'grid' : 'none';
                if (icon) {
                    icon.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
                }
            }
        };
    }

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    Object.entries(eventsByMonth).forEach(([monthKey, monthEvents]) => {
        const [year, month] = monthKey.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

        // Lógica de colapsado: Si el mes es anterior al actual, ocultar por defecto
        const isPastMonth = monthKey < currentMonthKey;
        const isExpanded = !isPastMonth;
        const displayStyle = isExpanded ? 'grid' : 'none';
        const iconRotation = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
        const headerColor = isPastMonth ? 'var(--text-muted)' : 'var(--primary)';
        const headerClass = isPastMonth ? 'text-muted' : 'text-primary';

        html += `
            <div class="month-section" data-month="${monthKey}" style="margin-bottom: 2rem;">
                <div 
                    onclick="toggleMonthEvents('${monthKey}')"
                    style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid ${isPastMonth ? 'var(--border)' : 'var(--primary)'}; transition: all 0.2s;">
                    
                    <svg id="icon-${monthKey}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20" 
                        style="transform: ${iconRotation}; transition: transform 0.3s ease; color: ${headerColor};">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>

                    <h3 style="margin: 0; text-transform: capitalize; color: ${headerColor}; font-size: 1.3rem; flex: 1;">
                        ${monthName}
                    </h3>
                    
                    ${isPastMonth ? '<span style="font-size: 0.8rem; color: var(--text-muted); background: var(--bg-secondary); padding: 2px 8px; border-radius: 12px;">Historial</span>' : ''}
                </div>

                <div id="events-grid-${monthKey}" style="display: ${displayStyle}; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; transition: all 0.3s ease;">
        `;

        monthEvents.forEach(event => {
            let dateFormatted = event.dateStr;
            let dayOfWeek = '';
            try {
                dateFormatted = event.dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
                dayOfWeek = event.dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
            } catch (e) { }

            // Verificar si el evento ya pasó (día específico dentro del mes)
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const eventoPasado = event.dateObj < hoy;

            let bgColor = '', icon = '', typeName = '', typeClass = '';

            switch (event.type) {
                case 'holiday':
                    bgColor = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
                    icon = '🎉';
                    typeName = 'Festivo';
                    typeClass = 'holiday';
                    break;
                case 'alert':
                    bgColor = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
                    icon = '⚠️';
                    typeName = 'Alerta';
                    typeClass = 'alert';
                    break;
                case 'payday':
                    bgColor = 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)';
                    icon = '💰';
                    typeName = 'Quincena';
                    typeClass = 'payday';
                    break;
                case 'vacation':
                    bgColor = 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)';
                    icon = '🌴';
                    typeName = 'Vacaciones';
                    typeClass = 'vacation';
                    break;
                default:
                    bgColor = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
                    icon = 'ℹ️';
                    typeName = 'Aviso';
                    typeClass = 'notice';
            }

            // Si el evento pasó, usar colores grises (manteniendo la lógica visual existente)
            if (eventoPasado) {
                bgColor = 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
            }

            const cardStyle = eventoPasado
                ? 'opacity: 0.6; filter: grayscale(80%);'
                : '';

            html += `
                <div class="event-card" data-type="${typeClass}" data-text="${event.text.toLowerCase()}" data-date="${event.dateStr}" style="background: ${bgColor}; color: white; padding: 0.75rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; overflow: hidden; min-height: 85px; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; cursor: default; ${cardStyle}">
                    <div style="position: absolute; top: -8px; right: -8px; opacity: 0.1; font-size: 3rem; transform: rotate(15deg); pointer-events: none;">
                        ${icon}
                    </div>
                    <div style="position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.4rem;">
                            <div style="display: flex; align-items: center; gap: 0.4rem;">
                                <span style="font-size: 1.3rem;">${icon}</span>
                                <div>
                                    <div style="font-size: 0.65rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.3px; font-weight: 600;">
                                        ${typeName}
                                    </div>
                                    <div style="font-size: 0.7rem; opacity: 0.8; text-transform: capitalize;">
                                        ${dayOfWeek}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem; text-transform: capitalize;">
                            ${dateFormatted}
                        </div>
                        <div style="font-size: 0.8rem; line-height: 1.25; flex: 1;">
                            ${event.text}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += '</div>'; // Close eventsListContainer
    container.innerHTML = html;

    // Agregar estilos de hover
    const style = document.createElement('style');
    style.textContent = `
        .event-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
        }
    `;
    if (!document.getElementById('event-card-styles')) {
        style.id = 'event-card-styles';
        document.head.appendChild(style);
    }

    updateEventFilterStats();
}

// Función para filtrar eventos
window.filterEvents = function () {
    const searchInput = document.getElementById('eventSearchInput');
    const typeFilter = document.getElementById('eventTypeFilter');

    if (!searchInput || !typeFilter) return;

    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;

    const eventCards = document.querySelectorAll('.event-card');
    let visibleCount = 0;

    eventCards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        const cardText = card.getAttribute('data-text');
        const cardDate = card.getAttribute('data-date');

        const matchesSearch = searchTerm === '' ||
            cardText.includes(searchTerm) ||
            cardDate.includes(searchTerm);
        const matchesType = selectedType === 'all' || cardType === selectedType;

        if (matchesSearch && matchesType) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Ocultar secciones de mes vacías
    const monthSections = document.querySelectorAll('.month-section');
    monthSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.event-card[style*="display: flex"]');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });

    updateEventFilterStats(visibleCount);
};

// Función para limpiar filtros
window.clearEventFilters = function () {
    const searchInput = document.getElementById('eventSearchInput');
    const typeFilter = document.getElementById('eventTypeFilter');

    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = 'all';

    filterEvents();
};

// Función para actualizar estadísticas de filtro
function updateEventFilterStats(visibleCount) {
    const statsDiv = document.getElementById('eventFilterStats');
    if (!statsDiv) return;

    const totalEvents = document.querySelectorAll('.event-card').length;

    if (visibleCount === undefined) {
        visibleCount = totalEvents;
    }

    if (visibleCount === totalEvents) {
        statsDiv.innerHTML = `Mostrando <strong>${totalEvents}</strong> evento(s) en total`;
    } else {
        statsDiv.innerHTML = `Mostrando <strong>${visibleCount}</strong> de <strong>${totalEvents}</strong> evento(s)`;
    }
}

// ==========================================
// GESTIÓN DE EMPLEADOS
// ==========================================

// ==========================================
// SERVICIO DE CORREO (GOOGLE APPS SCRIPT)
// ==========================================

// ¡IMPORTANTE! Reemplaza este valor con la URL de tu Web App de Apps Script publicada:
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzYCoUUKkv59W_RUS6F1Y5NFAiuHrC8Et1mtGcbIO4EUVFD-eejxAUXARzBJd_9qjOkbg/exec";

// ==========================================
// GENERADOR DE HTML DE CORREO LOCAL (Agregado para prueba precisa)
// ==========================================

// ==========================================
// GENERADOR DE HTML DE CORREO LOCAL (Agregado para prueba precisa)
// ==========================================

function generateGeneralScheduleHtml(weekOffset) {
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

    for (let i = 1; i <= 7; i++) {
        let employeeId = null;
        let displayName = 'Vacante';

        if (state.weeklyOverrides[weekKey] && state.weeklyOverrides[weekKey][i]) {
            employeeId = state.weeklyOverrides[weekKey][i].person;
        } else {
            let baseId;
            if (i === 7) {
                baseId = 7;
            } else {
                baseId = (i - 1 - weekOffset) % 6;
                if (baseId < 0) baseId += 6;
                baseId += 1;
            }
            employeeId = state.assignments[baseId];
        }

        if (employeeId) {
            const profile = state.employeeProfiles[employeeId];
            displayName = profile ? (profile.displayName || employeeId) : employeeId;
            displayName = displayName.split(' ')[0];
        }

        const schedule = scheduleData.find(s => s.id === i);
        const borderStyle = i === 7 ? '' : 'border-bottom: 1px solid #3A3A3C;';
        const rowStyle = i === 7 ? 'background: rgba(48, 209, 88, 0.05);' : '';

        html += `<tr style="${rowStyle}">
            <td style="padding: 8px 4px; ${borderStyle} font-weight: 500; color: #FFFFFF;">${displayName}</td>`;

        days.forEach((d, dayIndex) => {
            let dayData = schedule ? schedule[d] : null;
            
            // Apply location changes if present
            if (dayData && state.locationChanges && state.locationChanges[weekKey] && state.locationChanges[weekKey][employeeId]) {
                const locChange = state.locationChanges[weekKey][employeeId];
                if (locChange.days && locChange.days.includes(dayIndex) && locChange.originalLocation === dayData.location) {
                    dayData = { ...dayData, location: locChange.newLocation };
                }
            }
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

function generateEmailHtmlForEmployee(employeeId, weekOffset) {
    const weekStart = getWeekStartDate(weekOffset);
    const weekEnd = getWeekEndDate(weekOffset);
    const dateRange = `${weekStart.getDate()} ${weekStart.toLocaleString('es-ES', { month: 'short' })} - ${weekEnd.getDate()} ${weekEnd.toLocaleString('es-ES', { month: 'short' })}`;
    const capitalizedDateRange = dateRange.replace(/\b\w/g, c => c.toUpperCase());

    const scheduleId = getScheduleForPerson(employeeId, weekOffset);
    const schedule = scheduleData.find(s => s.id === scheduleId);

    const profile = state.employeeProfiles[employeeId] || {};
    const displayName = profile.displayName || employeeId;

    const weekKey = weekOffset.toString();
    let esTemporal = false;
    let comentario = '';
    if (state.weeklyOverrides[weekKey]) {
        for (const [schId, data] of Object.entries(state.weeklyOverrides[weekKey])) {
            if (data.person === employeeId && parseInt(schId) === scheduleId) {
                esTemporal = true;
                comentario = data.comment;
            }
        }
    }

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
        accent: esTemporal ? '#FF9F0A' : '#0A84FF', // Accent color changes too
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

    if (schedule) {
        days.forEach((d, i) => {
            const diaSchedule = schedule[d];
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
    const events = [];
    const toISODate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const ws = toISODate(weekStart);
    const we = toISODate(weekEnd);

    if (state.events) {
        Object.values(state.events).forEach(ev => {
            const d = ev.date;
            if (d && d >= ws && d <= we) events.push(ev);
        });
    }
    if (events.length > 0) {
        events.sort((a, b) => a.date.localeCompare(b.date));
        eventosHtml = `
        <div style="margin-top: 30px; background: ${colors.card}; border-radius: 16px; padding: 20px; border: 1px solid ${colors.border};">
            <h3 style="color: ${colors.accent}; font-size: 16px; margin: 0 0 15px 0; border-bottom: 2px solid ${colors.accent}; display: inline-block; padding-bottom: 5px;">Eventos de la Semana</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${events.map(e => `
                    <li style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        <span style="background: #FF9F0A; color: #000; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">FESTIVO</span>
                        <span style="color: ${colors.textSecondary}; font-size: 13px;">${e.date}: ${e.text}</span>
                    </li>
                `).join('')}
            </ul>
        </div>`;
    }

    const generalTableHtml = generateGeneralScheduleHtml(weekOffset);

    return `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background-color: ${colors.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: ${colors.bg}; text-align: left;">
            <!-- HEADER -->
            <div style="background: ${colors.headerGradient}; padding: 40px 20px; text-align: center; border-radius: 0 0 24px 24px;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Horario Semanal</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Semana ${weekOffset + 1} | ${capitalizedDateRange}</p>
                ${esTemporal ? `
                    <div style="margin-top: 15px; display: inline-block; background: rgba(0,0,0,0.3); padding: 5px 12px; border-radius: 20px;">
                        <span style="color: #FFF; font-weight: bold; font-size: 12px;">⚠️ HORARIO MODIFICADO</span>
                    </div>`
            : ''}
            </div>

            <!-- CONTENT -->
            <div style="padding: 30px 20px;">
                <p style="color: ${colors.textSecondary}; font-size: 16px; margin-bottom: 30px;">
                    Hola <strong style="color: ${colors.text};">${displayName}</strong>,<br>
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

                <!-- MAIN CARD -->
                <div style="background: ${colors.card}; border-radius: 20px; padding: 25px; border: 1px solid ${esTemporal ? '#FF9F0A' : colors.border}; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; overflow: hidden;">
                    ${esTemporal ? `<div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #FF9F0A;"></div>` : ''}
                    
                    <h3 style="color: ${colors.accent}; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center; justify-content: space-between;">
                        Tu Horario
                        ${esTemporal ? `<span style="font-size: 10px; color: #000; background: #FF9F0A; padding: 2px 8px; border-radius: 10px; font-weight: 800; text-transform: uppercase;">Modificado</span>` : ''}
                    </h3>
                    
                    <div style="background: ${esTemporal ? 'linear-gradient(90deg, #FF9F0A 0%, #FF375F 100%)' : 'linear-gradient(90deg, #5e5ce6 0%, #bf5af2 100%)'}; border-radius: 12px; padding: 15px; text-align: center; margin-bottom: 25px; box-shadow: 0 4px 15px ${esTemporal ? 'rgba(255, 159, 10, 0.3)' : 'rgba(94, 92, 230, 0.3)'};">
                        <span style="color: white; font-weight: 700; font-size: 18px; letter-spacing: 0.5px;">
                            ${schedule ? schedule.name : 'Sin Asignación'}
                        </span>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>

                ${eventosHtml}

                ${generalTableHtml}

                <div style="text-align: center; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
                    <p style="color: #8E8E93; font-size: 12px;">HorariosApp 2.0 — Sistema de Horarios Rotativos</p>
                </div>
            </div>
        </div>
    </body>
    </html>`;
}

/*
function generateEmailHtmlForEmployee_OLD(employeeId, weekOffset) {
    const weekStart = getWeekStartDate(weekOffset);
    const weekEnd = getWeekEndDate(weekOffset);
    const dateRange = `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;

    // 2. Obtener el horario calculado para la persona (ya con overrides aplicados)
    const scheduleId = getScheduleForPerson(employeeId, weekOffset);
    const schedule = scheduleData.find(s => s.id === scheduleId);

    // 3. Perfil
    const profile = state.employeeProfiles[employeeId] || {};
    const displayName = profile.displayName || employeeId;

    // 4. Detectar si es un cambio temporal (reutilizando lógica local)
    const weekKey = weekOffset.toString();
    let esTemporal = false;
    let comentario = '';
    if (state.weeklyOverrides[weekKey]) {
        for (const [schId, data] of Object.entries(state.weeklyOverrides[weekKey])) {
            if (data.person === employeeId && parseInt(schId) === scheduleId) {
                esTemporal = true;
                comentario = data.comment;
            }
        }
    }

    // Estilos
    const styles = {
        box: 'background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;',
        header: 'background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;',
        table: 'width: 100%; border-collapse: collapse; font-size: 14px; font-family: sans-serif;',
        th: 'text-align: left; padding: 8px; border-bottom: 2px solid #ddd; background: #eef2ff;',
        td: 'padding: 8px; border-bottom: 1px solid #eee;',
        change: 'background: #fffbeb; color: #b45309; padding: 10px; border-left: 4px solid #f59e0b; margin: 10px 0;'
    };

    let tableHtml = `<table style="${styles.table}"><thead><tr><th style="${styles.th}">Día</th><th style="${styles.th}">Horario</th><th style="${styles.th}">Ubicación</th></tr></thead><tbody>`;
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const daysLabel = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    if (schedule) {
        days.forEach((d, i) => {
            const diaSchedule = schedule[d];
            if (diaSchedule) {
                tableHtml += `<tr><td style="${styles.td}"><strong>${daysLabel[i]}</strong></td><td style="${styles.td}">${diaSchedule.time}</td><td style="${styles.td}">${diaSchedule.location.toUpperCase()}</td></tr>`;
            } else {
                tableHtml += `<tr><td style="${styles.td}"><strong>${daysLabel[i]}</strong></td><td style="${styles.td}" colspan="2">Descanso</td></tr>`;
            }
        });
    } else {
        tableHtml += `<tr><td colspan="3" style="${styles.td}">Sin asignación esta semana</td></tr>`;
    }
    tableHtml += '</tbody></table>';

    // Eventos
    let eventosHtml = '';
    const events = [];
    // Recopilar eventos de esta semana
    const toISODate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const ws = toISODate(weekStart);
    const we = toISODate(weekEnd);

    if (state.events) {
        Object.values(state.events).forEach(ev => {
            const d = ev.date;
            if (d && d >= ws && d <= we) events.push(ev);
        });
    }
    if (events.length > 0) {
        eventosHtml = `<div style="${styles.box}"><h3 style="margin-top:0;">📅 Eventos</h3><ul style="padding-left: 20px;">${events.map(e => `<li><strong>${e.date}:</strong> ${e.text}</li>`).join('')}</ul></div>`;
    }

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="${styles.header}">
            <h2 style="margin:0;">Horario Semanal [PRUEBA]</h2>
            <p style="margin:5px 0 0;">Semana ${weekOffset + 1} (${dateRange})</p>
        </div>
        <div style="padding: 20px;">
            <p>Hola <strong>${displayName}</strong>,</p>
            <p>Este es un correo de prueba generado desde la App para validar los datos que el usuario ve.</p>
            ${esTemporal ? `<div style="${styles.change}"><strong>⚠️ Cambio Temporal Activo:</strong> ${comentario}</div>` : ''}
            ${eventosHtml}
            <h3 style="color: #4f46e5;">Tu Horario Asignado: ${schedule ? 'Horario ' + schedule.id : 'Ninguno'}</h3>
            ${tableHtml}
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">HorariosApp 2.0</p>
        </div>
    </div>`;
}
*/

window.sendTestEmail = function () {
    const emailInput = document.getElementById('testEmailInput');
    const employeeSelect = document.getElementById('testEmployeeSelect');
    const email = emailInput ? emailInput.value.trim() : '';
    const employeeId = employeeSelect ? employeeSelect.value : '';
    const weekSelect = document.getElementById('testWeekSelect');
    const selectedOffset = weekSelect ? parseInt(weekSelect.value) : state.currentWeekOffset;

    if (!email) {
        alert('❌ Por favor ingresa un correo de destino.');
        if (emailInput) emailInput.focus();
        return;
    }

    if (!employeeId) {
        alert('❌ Por favor selecciona qué empleado quieres simular.');
        if (employeeSelect) employeeSelect.focus();
        return;
    }

    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_APPS_SCRIPT_URL_HERE")) {
        alert('⚠️ Error de Configuración: URL de Apps Script no válida.');
        return;
    }

    const btn = document.querySelector('button[onclick="sendTestEmail()"]');
    let originalText = 'Enviar Prueba';
    if (btn) {
        originalText = btn.innerHTML;
        btn.innerHTML = 'Generando... ⏳';
        btn.disabled = true;
    }

    // Generar HTML LOCALMENTE usando los datos reales de la App y la semana seleccionada
    const htmlBodyCountent = generateEmailHtmlForEmployee(employeeId, selectedOffset);

    const testPayload = {
        action: "send_test",
        recipient: email,
        subject: `[PRUEBA] Horario de ${employeeId} - Semana ${selectedOffset + 1}`,
        bodyHtml: htmlBodyCountent
    };

    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(testPayload)
    })
        .then(() => {
            alert(`✅ Correo de prueba enviado a ${email}.\n\nSe envió una copia exacta del horario que ${employeeId} tendría en la Semana ${selectedOffset + 1}.`);
        })
        .catch(error => {
            console.error("Error enviando correo:", error);
            alert('❌ Error de red: ' + error.message);
        })
        .finally(() => {
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
};

function openManageEmployees() {
    const modal = document.getElementById('employeesModal');
    const modalBody = modal.querySelector('.modal-body');

    const employees = state.employees || [];

    // Generar opciones para el select
    const employeeOptions = employees.map(emp => `<option value="${emp}">${emp}</option>`).join('');

    // Generar opciones de semana
    const currentOffset = state.currentWeekOffset;
    const weekOptions = [
        { offset: currentOffset - 1, label: `Semana Pasada (${currentOffset})` },
        { offset: currentOffset, label: `Semana Actual (${currentOffset + 1})` },
        { offset: currentOffset + 1, label: `Próxima Semana (${currentOffset + 2})` },
        { offset: currentOffset + 2, label: `Semana Subsiguiente (${currentOffset + 3})` }
    ].map(opt => `<option value="${opt.offset}" ${opt.offset === currentOffset ? 'selected' : ''}>${opt.label}</option>`).join('');

    let html = `
        <div style="margin-bottom: 1.5rem;">
            <p style="color: var(--text-muted); margin-bottom: 1rem;">
                Gestiona la información de contacto de cada empleado.
            </p>
        </div>

        <!-- SECCIÓN DE PRUEBA DE CORREO MEJORADA -->
        <div style="margin-bottom: 2rem; padding: 1.25rem; background: rgba(120, 120, 128, 0.05); border-radius: 12px; border: 1px dashed var(--primary);">
            <h3 style="margin-top: 0; margin-bottom: 1rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; font-size: 1rem;">
                📧 Simulador de Envío de Horario
            </h3>
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem;">
                <!-- Week Selector -->
                <div>
                     <label style="display: block; margin-bottom: 0.4rem; font-size: 0.85rem; font-weight: 600;">Semana a Simular:</label>
                     <select id="testWeekSelect" style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem;">
                        ${weekOptions}
                     </select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.4rem; font-size: 0.85rem; font-weight: 600;">Simular Horario de:</label>
                        <select id="testEmployeeSelect" style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem;">
                            <option value="">-- Seleccionar Empleado --</option>
                            ${employeeOptions}
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.4rem; font-size: 0.85rem; font-weight: 600;">Enviar Copia A:</label>
                        <input type="email" id="testEmailInput" placeholder="tucorreo@ejemplo.com" style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem;">
                    </div>
                </div>
            </div>
            <button onclick="sendTestEmail()" class="btn-primary" style="width: 100%; padding: 0.6rem 1rem; font-size: 0.9rem;">
                Enviar Prueba de Horario Real
            </button>
             <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.75rem; margin-bottom: 0; text-align: center;">
                Genera el correo usando los datos EXACTOS que existen para la semana seleccionada.
            </p>
        </div>
    `;



    if (employees.length === 0) {
        html += `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <p>No hay empleados registrados. Agrega empleados desde "Gestionar Asignaciones".</p>
            </div>
        `;
    } else {
        html += '<div style="display: grid; gap: 1rem;">';

        employees.forEach((emp, index) => {
            const profile = state.employeeProfiles[emp] || {};
            const displayName = profile.displayName || emp;
            const phone = profile.phone || '';
            const email = profile.email || '';
            const notes = profile.notes || '';

            html += `
                <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 10px; border-left: 4px solid var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.5rem 0; color: var(--primary);">
                                ${displayName}
                                ${displayName !== emp ? `<span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">(ID: ${emp})</span>` : ''}
                            </h3>
                        </div>
                        <button 
                            onclick="editEmployee('${emp}')"
                            class="btn-icon"
                            style="background: var(--primary); color: white; padding: 0.5rem; border-radius: 6px; margin-left: 1rem;"
                            title="Editar empleado">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        <div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">
                                📞 Teléfono
                            </div>
                            <div style="font-size: 0.95rem;">
                                ${phone || '<span style="color: var(--text-muted); font-style: italic;">No registrado</span>'}
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">
                                📧 Email
                            </div>
                            <div style="font-size: 0.95rem; word-break: break-all;">
                                ${email || '<span style="color: var(--text-muted); font-style: italic;">No registrado</span>'}
                            </div>
                        </div>
                    </div>
                    
                    ${notes ? `
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">
                                📝 Notas
                            </div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                ${notes}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += '</div>';
    }

    modalBody.innerHTML = html;
    modal.classList.add('active');
}

window.editEmployee = function (employeeId) {
    const profile = state.employeeProfiles[employeeId] || {};
    const displayName = profile.displayName || employeeId;
    const phone = profile.phone || '';
    const email = profile.email || '';
    const notes = profile.notes || '';

    const modal = document.getElementById('employeesModal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <h3 style="margin-bottom: 1.5rem; color: var(--primary);">
                ✏️ Editar Información de ${employeeId}
            </h3>
            
            <div style="display: grid; gap: 1.5rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        Nombre para Mostrar en Horarios
                        <span style="color: var(--danger); margin-left: 0.25rem;">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="editDisplayName" 
                        value="${displayName}"
                        placeholder="Ej: Juan Pérez"
                        style="width: 100%; padding: 0.75rem; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem;"
                        required
                    >
                    <small style="color: var(--text-muted); font-size: 0.85rem;">
                        Este es el nombre que aparecerá en los horarios y reportes
                    </small>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        📞 Teléfono
                    </label>
                    <input 
                        type="tel" 
                        id="editPhone" 
                        value="${phone}"
                        placeholder="Ej: +52 81 1234 5678"
                        style="width: 100%; padding: 0.75rem; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem;"
                    >
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        📧 Email
                        <span style="color: var(--danger); margin-left: 0.25rem;">*</span>
                    </label>
                    <input 
                        type="email" 
                        id="editEmail" 
                        value="${email}"
                        placeholder="Ej: empleado@empresa.com"
                        style="width: 100%; padding: 0.75rem; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem;"
                        required
                    >
                    <small style="color: var(--text-muted); font-size: 0.85rem;">
                        Requerido para envío automático de horarios
                    </small>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        📝 Notas
                    </label>
                    <textarea 
                        id="editNotes" 
                        rows="4"
                        placeholder="Información adicional, observaciones, etc."
                        style="width: 100%; padding: 0.75rem; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem; resize: vertical; font-family: inherit;"
                    >${notes}</textarea>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button 
                    onclick="saveEmployeeProfile('${employeeId}')"
                    class="btn-primary"
                    style="flex: 1; padding: 0.75rem; font-size: 1rem;">
                    💾 Guardar Cambios
                </button>
                <button 
                    onclick="openManageEmployees()"
                    class="btn-secondary"
                    style="padding: 0.75rem 1.5rem; font-size: 1rem;">
                    ← Volver
                </button>
            </div>
        </div>
    `;
};

window.saveEmployeeProfile = function (employeeId) {
    const displayName = document.getElementById('editDisplayName').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const notes = document.getElementById('editNotes').value.trim();

    if (!displayName) {
        alert('⚠️ El nombre para mostrar es obligatorio');
        return;
    }

    // Validar formato de email SOLO si se escribió algo
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('⚠️ Por favor ingresa un email válido');
            return;
        }
    }

    // Guardar perfil
    if (!state.employeeProfiles) {
        state.employeeProfiles = {};
    }

    state.employeeProfiles[employeeId] = {
        displayName: displayName,
        phone: phone,
        email: email, // Si está vacío, se guardará como cadena vacía
        notes: notes
    };

    saveToLocalStorage();
    alert('✅ Información del empleado guardada exitosamente');
    openManageEmployees();
};

// Función auxiliar para obtener el nombre para mostrar de un empleado
function getEmployeeDisplayName(employeeId) {
    if (state.employeeProfiles && state.employeeProfiles[employeeId]) {
        return state.employeeProfiles[employeeId].displayName || employeeId;
    }
    return employeeId;
}

// Start
init();


/* =========================================
   WIDGET DE CLIMA
   ========================================= */

const weatherCities = [
    { name: 'Monterrey', lat: 25.6667, lon: -100.3167 },
    { name: 'Guadalupe', lat: 25.6768, lon: -100.2564 },
    { name: 'García', lat: 25.8117, lon: -100.5922 },
    { name: 'San Pedro', lat: 25.6573, lon: -100.4013 }
];

let currentCityIndex = 0;
let weatherCache = {};

function initWeatherWidget() {
    fetchWeatherData();
    // Actualizar datos cada 15 minutos
    setInterval(fetchWeatherData, 15 * 60 * 1000);
    // Rotar ciudad cada 5 segundos
    setInterval(rotateWeatherCity, 5000);
}

function fetchWeatherData() {
    weatherCities.forEach(city => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,precipitation,weather_code,is_day&hourly=precipitation_probability&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.current) {
                    // Obtener probabilidad de lluvia de la hora actual
                    const currentHour = new Date().getHours();
                    const precipitationProb = data.hourly && data.hourly.precipitation_probability ? data.hourly.precipitation_probability[currentHour] : 0;

                    weatherCache[city.name] = {
                        temp: Math.round(data.current.temperature_2m),
                        max: data.daily && data.daily.temperature_2m_max ? Math.round(data.daily.temperature_2m_max[0]) : '--',
                        min: data.daily && data.daily.temperature_2m_min ? Math.round(data.daily.temperature_2m_min[0]) : '--',
                        condition: getWeatherDescription(data.current.weather_code),
                        icon: getWeatherIcon(data.current.weather_code, data.current.is_day),
                        rain: Math.max(precipitationProb, data.current.precipitation > 0 ? 100 : 0) // Si llueve ahora es 100%, sino la probabilidad
                    };

                    // Si es la primera carga y estamos en esta ciudad, mostrarla
                    if (city.name === weatherCities[currentCityIndex].name) {
                        updateWeatherUI();
                    }
                }
            })
            .catch(error => console.error('Error fetching weather:', error));
    });
}

function rotateWeatherCity() {
    currentCityIndex = (currentCityIndex + 1) % weatherCities.length;
    updateWeatherUI();
}

function updateWeatherUI() {
    const city = weatherCities[currentCityIndex];
    const data = weatherCache[city.name];
    const widget = document.getElementById('weather-widget');

    if (data && widget) {
        document.getElementById('weather-city').textContent = city.name;
        document.getElementById('weather-temp').textContent = `${data.temp}°`;

        // Actualizar Max/Min si existen los elementos
        const maxEl = document.getElementById('weather-max');
        const minEl = document.getElementById('weather-min');
        if (maxEl) maxEl.textContent = data.max;
        if (minEl) minEl.textContent = data.min;

        document.getElementById('weather-desc').textContent = data.condition;
        document.getElementById('weather-icon').textContent = data.icon;
        document.getElementById('weather-rain').textContent = `☔ ${data.rain}%`;

        widget.style.display = 'inline-flex';
    }
}

function getWeatherDescription(code) {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return 'Despejado';
    if (code === 1) return 'Mayormente Despejado';
    if (code === 2) return 'Parcialmente Nublado';
    if (code === 3) return 'Nublado';
    if (code >= 45 && code <= 48) return 'Niebla';
    if (code >= 51 && code <= 55) return 'Llovizna'; // Drizzle
    if (code === 56 || code === 57) return 'Llovizna Helada';
    if (code === 61) return 'Lluvia Ligera';
    if (code === 63) return 'Lluvia Moderada';
    if (code === 65) return 'Lluvia Intensa';
    if (code === 66 || code === 67) return 'Lluvia Helada';
    if (code === 71) return 'Nieve Ligera';
    if (code === 73) return 'Nieve Moderada';
    if (code === 75) return 'Nieve Intensa';
    if (code === 77) return 'Granizo';
    if (code >= 80 && code <= 82) return 'Chubascos';
    if (code === 85 || code === 86) return 'Chubascos de Nieve';
    if (code === 95) return 'Tormenta Eléctrica';
    if (code === 96 || code === 99) return 'Tormenta con Granizo';
    return 'Variable';
}

function getWeatherIcon_Legacy(code, isDay = 1) {
    if (code === 0) return isDay ? '☀️' : '🌙';
    if (code === 1 || code === 2) return isDay ? '⛅' : '☁️';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '��️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '🌡️';
}

// Iniciar widget cuando cargue el DOM
document.addEventListener('DOMContentLoaded', function () {
    // Esperar un poco para no bloquear la carga inicial
    setTimeout(initWeatherWidget, 1000);
});

/* =========================================
   ABOUT MODAL LOGIC
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');

    if (aboutBtn && aboutModal) {
        aboutBtn.addEventListener('click', () => {
            aboutModal.classList.add('active');
        });
    }
});

// Versión V2 con iconos completos y corregidos
function getWeatherIcon(code, isDay = 1) {
    // 0: Cielo limpio
    if (code === 0) return isDay ? '☀️' : '🌙';

    // 1-3: Nublado
    if (code === 1) return isDay ? '🌤️' : '🌙';
    if (code === 2) return isDay ? '⛅' : '☁️';
    if (code === 3) return '☁️';

    // 45-48: Niebla
    if (code >= 45 && code <= 48) return '🌫️';

    // 51-55: Llovizna
    if (code >= 51 && code <= 55) return '🌦️';

    // 56-57: Llovizna helada
    if (code === 56 || code === 57) return '🌨️';

    // 61-65: Lluvia
    if (code === 61) return '🌧️';
    if (code === 63) return '🌧️';
    if (code === 65) return '🌧️💦'; // Lluvia fuerte

    // 66-67: Lluvia helada
    if (code === 66 || code === 67) return '🌨️❄️';

    // 71-77: Nieve y Granizo
    if (code === 71) return '🌨️';
    if (code === 73) return '❄️';
    if (code === 75) return '❄️☃️'; // Nieve fuerte
    if (code === 77) return '🧊'; // Granizo

    // 80-82: Chubascos
    if (code === 80 || code === 81) return '☔';
    if (code === 82) return '☔⛈️';

    // 85-86: Chubascos de nieve
    if (code === 85 || code === 86) return '❄️☔';

    // 95-99: Tormenta
    if (code === 95) return '⚡';
    if (code === 96 || code === 99) return '⛈️🧊'; // Tormenta con granizo

    return isDay ? '🌡️' : '🌙';
}

// Versión V2 de renderDayCells (Limpia, sin colores de fondo por evento)
function renderDayCells(schedule, personName = null, weekOffset = null) {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const vacationDays = personName && weekOffset !== null ? getVacationDaysInWeek(personName, weekOffset) : [];
    const locationChange = personName && weekOffset !== null ? getEmployeeLocationChange(personName, weekOffset) : null;

    // Obtener días festivos de la semana (mapa índice -> evento)
    const holidayEvents = {};
    if (weekOffset !== null && state.events) {
        const weekStart = getWeekStartDate(weekOffset);

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + i);

            const year = currentDay.getFullYear();
            const month = String(currentDay.getMonth() + 1).padStart(2, '0');
            const isoDay = String(currentDay.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${isoDay}`;

            const eventsOnDate = getEventsForDate(dateKey);
            const holiday = eventsOnDate.find(e => e.type === 'holiday');
            if (holiday) {
                holidayEvents[i] = holiday;
            }
        }
    }

    // Aplicar cambio de ubicación si existe
    const displaySchedule = locationChange ? applyLocationChangeToSchedule(schedule, locationChange) : locationChange ? applyLocationChangeToSchedule(schedule, locationChange) : schedule;

    // Calcular índice del día actual
    const todayDate = new Date();
    const todayIndex = (todayDate.getDay() + 6) % 7;
    const currentWeeksFromStart = getWeeksFromStart(todayDate);
    const isCurrentWeek = (weekOffset !== null ? weekOffset : state.currentWeekOffset) === currentWeeksFromStart;

    return days.map((day, index) => {
        const data = displaySchedule[day];
        const isOnVacation = vacationDays.includes(index);

        // Verificar si es el día de hoy
        const isToday = isCurrentWeek && index === todayIndex;
        // Solo borde sutil para HOY, sin fondo invasivo
        const todayStyle = isToday ? 'box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5);' : '';

        // Verificar si es asueto y NO es guardia
        const holidayEvent = holidayEvents[index];
        const isHoliday = !!holidayEvent;
        const isGuardia = data && data.location === 'guardia';
        const applyHolidayEffect = isHoliday && !isGuardia;

        if (isOnVacation) {
            return `<td class="vacation-cell" style="${todayStyle}"><span class="location-badge vacation">VACACIONES</span></td>`;
        }

        if (!data) return `<td class="descanso" style="${todayStyle}"><span class="location-badge descanso">Descanso</span></td>`;

        // Lógica de horario especial para guardia
        let displayTime = data.time;
        let isSpecialSchedule = false;

        if (isHoliday && isGuardia && holidayEvent.guardiaStart && holidayEvent.guardiaEnd) {
            displayTime = `${holidayEvent.guardiaStart} - ${holidayEvent.guardiaEnd}`;
            isSpecialSchedule = true;
        }

        const hasLocationChange = locationChange && data.location === locationChange.newLocation;
        let classes = hasLocationChange ? 'location-change-cell' : '';
        let cellContent = '';

        if (applyHolidayEffect) {
            // Efecto Blur Festivo (Original)
            let styles = todayStyle + 'background-color: rgba(16, 185, 129, 0.15); position: relative;';
            cellContent = `
                <div class="schedule-cell" style="opacity: 0.25; filter: blur(1.5px);">
                    <span class="time">${displayTime}</span>
                    <span class="location-badge ${data.location}">${data.location}</span>
                    ${hasLocationChange ? '<span class="location-change-indicator">📍 Cambio</span>' : ''}
                </div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--success); font-weight: bold; font-size: 0.85rem; text-shadow: 0 1px 2px rgba(255,255,255,0.9); pointer-events: none; width: 100%; text-align: center;">
                    FESTIVO
                </div>
            `;
            return `<td class="${classes}" style="${styles}">${cellContent}</td>`;
        } else {
            // Celda Normal (Sin colores de fondo extraños)
            cellContent = `
                <div class="schedule-cell">
                    <span class="time" ${isSpecialSchedule ? 'style="color: var(--success); font-weight: bold;"' : ''}>${displayTime}</span>
                    <span class="location-badge ${data.location}">${data.location}</span>
                    ${hasLocationChange ? '<span class="location-change-indicator">📍 Cambio</span>' : ''}
                    ${isSpecialSchedule ? '<span class="location-change-indicator" style="background: var(--success); color: white;">🕒 Especial</span>' : ''}
                </div>
            `;
            return `<td class="${classes}" style="${todayStyle}">${cellContent}</td>`;
        }
    });
}

// Función para colorear los encabezados de los días en la tabla general
function updateDayHeaders(weekOffset = state.currentWeekOffset) {
    if (!state.events) return;

    const weekStart = getWeekStartDate(weekOffset);
    const dayColors = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const isoDay = String(d.getDate()).padStart(2, '0');
        const key = `${year}-${month}-${isoDay}`;

        const events = getEventsForDate(key);
        let color = '';
        if (events.length > 0) {
            const typePriority = { 'holiday': 4, 'alert': 3, 'payday': 2, 'notice': 1 };
            events.sort((a, b) => (typePriority[b.type] || 0) - (typePriority[a.type] || 0));
            const evt = events[0];

            switch (evt.type) {
                case 'holiday': color = '#10b981'; break; // Verde
                case 'alert': color = '#ef4444'; break; // Rojo
                case 'payday': color = '#f59e0b'; break; // Naranja
                default: color = '#3b82f6'; break; // Azul
            }
        }
        dayColors.push(color);
    }

    // Aplicar a los encabezados (tabla general y configuracion)
    const tables = document.querySelectorAll('.schedule-table');
    tables.forEach(table => {
        const ths = table.querySelectorAll('thead th');
        let startIndex = -1;

        if (ths.length >= 9) {
            startIndex = 2; // Config Table: [Hr, Per, L, M, ...]
        } else if (ths.length >= 8) {
            startIndex = 1; // General Table: [Per, L, M, ...]
        }

        if (startIndex !== -1) {
            for (let i = 0; i < 7; i++) {
                const th = ths[startIndex + i];
                // Asegurar que existe el elemento (por si acaso length es raro)
                if (th) {
                    if (dayColors[i]) {
                        th.style.color = dayColors[i];
                        th.style.borderBottom = `2px solid ${dayColors[i]}`;
                    } else {
                        th.style.color = '';
                        th.style.borderBottom = '';
                    }
                }
            }
        }
    });
}

function getDayHeaderColor(weekOffset, dayIndex) {
    if (!state.events) return '';
    const weekStart = getWeekStartDate(weekOffset);
    const d = new Date(weekStart);
    d.setDate(d.getDate() + dayIndex);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const isoDay = String(d.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${isoDay}`;

    const events = getEventsForDate(key);
    if (events.length > 0) {
        const typePriority = { 'holiday': 4, 'alert': 3, 'payday': 2, 'notice': 1 };
        events.sort((a, b) => (typePriority[b.type] || 0) - (typePriority[a.type] || 0));
        const evt = events[0];
        switch (evt.type) {
            case 'holiday': return '#10b981';
            case 'alert': return '#ef4444';
            case 'payday': return '#f59e0b';
            default: return '#3b82f6';
        }
    }
    return '';
}

/* ==========================================================================
   AGENTE INTELIGENTE DE HORARIOS (SCHEDULE ASSISTANT ENGINE)
   ========================================================================== */

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

let agentChatHistory = [];

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgentWidget);
} else {
    setTimeout(initAgentWidget, 100);
}

function initAgentWidget() {
    const toggleBtn = document.getElementById('agent-toggle-btn');
    const closeBtn = document.getElementById('agent-close-btn');
    const drawer = document.getElementById('agent-chat-drawer');
    const sendBtn = document.getElementById('agent-send-btn');
    const inputField = document.getElementById('agent-input-field');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        drawer.classList.toggle('active');
        if (drawer.classList.contains('active')) {
            if (inputField) inputField.focus();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            drawer.classList.remove('active');
        });
    }

    if (sendBtn && inputField) {
        sendBtn.onclick = (e) => {
            e.preventDefault();
            submitAgentQuery();
        };
        inputField.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitAgentQuery();
            }
        };
    }

    const clearBtn = document.getElementById('agent-clear-btn');
    if (clearBtn) {
        clearBtn.onclick = (e) => {
            e.preventDefault();
            clearAgentChat();
        };
    }

    // Attach click handlers to suggestion chips
    document.querySelectorAll('.agent-chip').forEach(chip => {
        chip.onclick = (e) => {
            e.preventDefault();
            const query = chip.dataset.query;
            if (query) {
                if (inputField) inputField.value = query;
                submitAgentQuery();
            }
        };
    });
}

function clearAgentChat() {
    agentChatHistory = [];
    agentContext = {
        lastPerson: null,
        lastLocation: null,
        lastDate: null,
        lastMonth: null,
        lastIntent: null
    };
    const container = document.getElementById('agent-messages-container');
    if (container) {
        container.innerHTML = `
            <div class="agent-msg bot">
                <div class="msg-bubble">
                    👋 ¡Hola! Soy tu <strong>Agente de Horarios</strong>. Estoy listo para ayudarte con cualquier consulta sobre los horarios, guardias, ubicaciones y eventos de todo el año.
                </div>
            </div>
        `;
    }
}

async function submitAgentQuery() {
    const inputField = document.getElementById('agent-input-field');
    if (!inputField) return;

    const query = inputField.value.trim();
    if (!query) return;

    // Append user message safely
    appendAgentMessage('user', escapeHTML(query));
    inputField.value = '';

    const apiKey = localStorage.getItem('gemini_api_key') || window.GEMINI_API_KEY || '';

    if (apiKey && apiKey.trim().length > 10) {
        const typingId = appendTypingIndicator();
        try {
            const aiResponse = await callGeminiAPI(query, apiKey.trim());
            removeTypingIndicator(typingId);
            appendAgentMessage('bot', aiResponse);
        } catch (err) {
            console.warn('Gemini API call warning, using intelligent local engine:', err);
            removeTypingIndicator(typingId);
            const fallbackResp = processAgentQuery(query);
            appendAgentMessage('bot', fallbackResp);
        }
    } else {
        const typingId = appendTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator(typingId);
            const response = processAgentQuery(query);
            appendAgentMessage('bot', response);
        }, 350);
    }
}

function appendTypingIndicator() {
    const container = document.getElementById('agent-messages-container');
    if (!container) return null;

    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'agent-msg bot';
    div.innerHTML = `<div class="msg-bubble" style="display:flex; align-items:center; gap:8px; padding: 0.6rem 0.9rem;">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <em style="opacity:0.75; font-size:0.82rem; margin-left:4px;">Gemini 2.5 Flash pensando...</em>
    </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
}

async function callGeminiAPI(userQuery, apiKey) {
    const contextText = buildGeminiScheduleContext();

    // Maintain conversation history
    agentChatHistory.push({ role: 'user', parts: [{ text: userQuery }] });
    if (agentChatHistory.length > 10) {
        agentChatHistory = agentChatHistory.slice(-10);
    }

    const payload = {
        system_instruction: {
            parts: [{ text: contextText }]
        },
        contents: agentChatHistory,
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 900
        }
    };

    const url25 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const url15 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    let res = await fetch(url25, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        res = await fetch(url15, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!botText) {
        throw new Error('Gemini API no devolvió contenido.');
    }

    agentChatHistory.push({ role: 'model', parts: [{ text: botText }] });
    return formatGeminiMarkdownToHTML(botText);
}

function buildGeminiScheduleContext() {
    const currentOffset = state.currentWeekOffset || 0;
    const todayStr = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const peopleList = Array.from(new Set([...(state.employees || []), ...Object.values(state.assignments || {})])).sort();

    // Generate 52-week summary of guardias and assignments for every employee
    let fullYearAssignments = '';
    peopleList.forEach(personName => {
        const guardiaWeeks = [];
        for (let w = 0; w < 52; w++) {
            const schId = getScheduleForPerson(personName, w);
            const sch = scheduleData.find(s => s.id === schId);
            const dateRange = getWeekDateRange(w);
            const locChange = getEmployeeLocationChange(personName, w);
            const displaySch = locChange ? applyLocationChangeToSchedule(sch, locChange) : sch;

            if (displaySch && displaySch.lunes) {
                const loc = displaySch.lunes.location;
                if (loc === 'guardia') {
                    guardiaWeeks.push(`Semana ${w + 1} (${dateRange})`);
                }
            }
        }

        fullYearAssignments += `- ${personName}:\n`;
        fullYearAssignments += `  Guardias en todo el año (52 semanas): ${guardiaWeeks.length > 0 ? guardiaWeeks.join(', ') : 'Sin guardias rotativas (Horario Fijo)'}\n`;
    });

    // Format all registered Events / Holidays
    let eventsFormatted = 'No hay festivos o eventos especiales registrados.';
    if (state.events && Object.keys(state.events).length > 0) {
        const evList = [];
        Object.entries(state.events).forEach(([k, v]) => {
            if (v && v.text) {
                evList.push(`• Fecha: ${v.date || k} - Evento: "${v.text}" (Tipo: ${v.type || 'festivo'}${v.guardiaStart ? ', Horario Especial: ' + v.guardiaStart + ' - ' + v.guardiaEnd : ''})`);
            }
        });
        if (evList.length > 0) eventsFormatted = evList.join('\n');
    }

    // Format all Vacations
    let vacationsFormatted = 'No hay vacaciones registradas.';
    if (state.vacations && Object.keys(state.vacations).length > 0) {
        const vacList = [];
        Object.entries(state.vacations).forEach(([person, vacData]) => {
            if (vacData) {
                vacList.push(`• ${person}: ${JSON.stringify(vacData)}`);
            }
        });
        if (vacList.length > 0) vacationsFormatted = vacList.join('\n');
    }

    let ctx = `Eres el Asistente Oficial de Inteligencia Artificial para "HorariosApp 2.0", una plataforma de gestión de turnos y guardias de oficina.
Fecha de hoy: ${todayStr}.
Offset de semana actual en el sistema: Semana ${currentOffset + 1}.
Base de fecha de inicio del sistema: ${state.startDate.toISOString().split('T')[0]}.

DIRECTRICES:
1. Responde SIEMPRE en español de forma profesional, atenta, concisa y usando emojis apropiados (🛡️, 📍, 🏖️, 📅, 🔄).
2. Usa etiquetas HTML simples para formato como <strong>, <em>, <br>, <ul>, <li>. NO uses bloques markdown \`\`\`html.
3. Responde con PRECISIÓN ABSOLUTA a cualquier consulta sobre todo el año (52 semanas), turnos, guardias, ubicaciones, vacaciones y eventos festivos usando la información completa del sistema a continuación.
4. SI LA PREGUNTA DEL USUARIO SE REFIERE A EVENTOS, AVISOS, ASUETOS, FESTIVOS, QUINCENAS, PAGOS O ANUNCIOS (COMO BONAICE/BONO, PAGO DE QUINCENA, REUNIONES):
   - SI PREGUNTA POR 'LA PRÓXIMA QUINCENA', 'PRÓXIMO FESTIVO', 'CUÁNDO ES LA QUINCENA' O SIN ESPECIFICAR CANTIDAD, MUESTRA ÚNICAMENTE LA PRÓXIMA FECHA MÁS CERCANA A HOY (SOLO 1 EVENTO), NO MUESTRES TODAS LAS DEL AÑO.
   - SI SOLICITA UNA CANTIDAD ESPECÍFICA (EJEMPLO: 'LAS PRÓXIMAS 3 QUINCENAS' O 'PRÓXIMOS 2 FESTIVOS'), MUESTRA ÚNICAMENTE ESA CANTIDAD SOLICITADA EN ORDEN CRONOLÓGICO.
   - SI PIDE 'TODAS LAS QUINCENAS' O 'TODO EL AÑO', MUESTRA LA LISTA COMPLETA DE TODO EL AÑO.
   - SI EL EVENTO NO ESTÁ REGISTRADO, ACLARA QUE NO SE ENCUENTRA EN EL CALENDARIO Y MUESTRA LOS EVENTOS PRÓXIMOS QUE SÍ ESTÁN PROGRAMADOS.
   - SOLO RECHAZA TEMAS COMPLETAMENTE AJENOS (CLIMA EXTERIOR, DEPORTES, COCINA). NO MUESTRES TABLAS DE HORARIOS SI LA PREGUNTA ES SOLO DE EVENTOS.
5. REGLA DE EQUIVALENCIA: "Bonaice" y "Bono" (o "Bonos") son términos idénticos y equivalentes. Si la consulta menciona cualquiera de ellos, busca eventos registrados con las palabras "Bonaice" o "Bono".
6. CONSULTAS DE PERSONA Y SUCURSAL ESPECÍFICA (Ejemplo: '¿Cuándo le toca en Valle a Conrado?', '¿Cuándo estará Roberto en Mitras?'):
   - REVISA TODA LA PROGRAMACIÓN DE 52 SEMANAS DE ESA PERSONA EN EL SISTEMA.
   - RESPONDE ÚNICAMENTE CON LAS FECHAS Y SEMANAS EN QUE ESA PERSONA ESPECÍFICA ESTARÁ TRABAJANDO EN ESA SUCURSAL/UBICACIÓN.
   - NUNCA MUESTRES LA LISTA GENERAL DE QUIÉNES TRABAJAN EN ESA SUCURSAL SI LA PREGUNTA ES SOBRE UNA PERSONA EN ESPECÍFICO. SI NO TIENE TURNO REGISTRADO EN ESA SUCURSAL (EJ. FIJO EN OTRA O SIN ROTACIÓN), EXPLICÁLO CLARAMENTE.

PERSONAL REGISTRADO (${peopleList.length} colaboradores):
${peopleList.join(', ')}

HORARIOS DEFINIDOS Y REGLAS DE ROTACIÓN:
- Horario 1 (General Guardia): Lun-Vie Guardia (8:30-17:30), Sáb Valle (8:30-13:30), Dom Descanso. Rotativo semanalmente.
- Horario 2 (General Valle): Lun-Vie Valle (8:30-17:30), Sáb Descanso, Dom Descanso. Rotativo semanalmente.
- Horario 3 (General Mitras): Lun-Vie Mitras (8:30-17:30), Sáb Descanso, Dom Descanso. Rotativo semanalmente.
- Horario 4 (Tarde Valle): Lun-Vie Valle (11:00-20:00), Sáb Descanso, Dom Descanso. Rotativo semanalmente.
- Horario 5 (Tarde Mitras): Lun-Vie Mitras (11:00-20:00), Sáb Descanso, Dom Descanso. Rotativo semanalmente.
- Horario 6 (Tarde Guardia): Lun-Vie Guardia (11:00-20:00), Sáb Descanso, Dom Descanso. Rotativo semanalmente.
- Horario 7 (Fijo Mitras): Fernando Gómez -> Asignado FIJO a Mitras (8:30-17:30) en todo momento. No rota.
- Horario 8 (Fijo Mitras): Roberto Lombart -> Asignado FIJO a Mitras (8:30-17:30) en todo momento. No rota.

PROGRAMACIÓN DE GUARDIAS Y TURNOS DE TODO EL AÑO (52 SEMANAS):
${fullYearAssignments}

EVENTOS Y DÍAS FESTIVOS REGISTRADOS EN EL AÑO:
${eventsFormatted}

VACACIONES REGISTRADAS EN EL AÑO:
${vacationsFormatted}

CAMBIOS TEMPORALES DE UBICACIÓN REGISTRADOS:
${JSON.stringify(state.locationChanges || {})}`;

    return ctx;
}

function formatGeminiMarkdownToHTML(text) {
    if (!text) return '';
    let html = text
        .replace(/```html?/gi, '')
        .replace(/```/g, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*$)/gim, '<h4 style="margin:6px 0; color:var(--accent-cyan);">$1</h4>')
        .replace(/^## (.*$)/gim, '<h3 style="margin:8px 0; color:var(--accent-violet);">$1</h3>')
        .replace(/^\* (.*$)/gim, '• $1')
        .replace(/^- (.*$)/gim, '• $1')
        .replace(/\n/g, '<br>');
    return html;
}

function appendAgentMessage(sender, htmlContent) {
    const container = document.getElementById('agent-messages-container');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `agent-msg ${sender}`;
    div.innerHTML = `<div class="msg-bubble">${htmlContent}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// --- SCHEDULE ASSISTANT INTELLIGENT AGENT ENGINE (WITH CONVERSATIONAL CONTEXT) ---

let agentContext = {
    lastPerson: null,
    lastLocation: null,
    lastDate: null,
    lastMonth: null,
    lastIntent: null
};

function processAgentQuery(query) {
    const text = query.toLowerCase().trim();
    if (!text) return "Por favor, escribe una pregunta para ayudarte con los horarios.";

    // 1. Identify all known people in system
    const allKnownPeople = Array.from(new Set([...(state.employees || []), ...Object.values(state.assignments || {})]));
    
    // Explicit person search (match full name or first name)
    let targetPerson = null;
    for (const person of allKnownPeople) {
        const fullLower = person.toLowerCase();
        const firstName = fullLower.split(' ')[0].toLowerCase();
        if (text.includes(fullLower) || (firstName.length >= 3 && text.includes(firstName))) {
            targetPerson = person;
            break;
        }
    }

    // Explicit self-reference ("me", "mi", "mis", "yo")
    const isSelfRef = /\b(me|mi|mis|yo)\b/i.test(text);
    if (!targetPerson && isSelfRef) {
        const select = document.getElementById('individualPersonSelect');
        if (select && select.value) {
            targetPerson = select.value;
        } else if (allKnownPeople.length > 0) {
            targetPerson = allKnownPeople[0];
        }
    }

    // Pronoun / Anaphora detection
    const hasPronoun = /\b(él|ella|ellos|ellas|su|sus|lo|la|los|las|de él|de ella|con él|con ella|su lugar|su guardia|su turno)\b/i.test(text);
    if (!targetPerson && (hasPronoun || isFollowUpQuery(text)) && agentContext.lastPerson) {
        targetPerson = agentContext.lastPerson;
    }

    // 2. Identify Locations & Statuses
    let targetLoc = null;
    if (text.includes('valle')) targetLoc = 'valle';
    else if (text.includes('mitras')) targetLoc = 'mitras';
    else if (text.includes('guardia') || text.includes('guardias')) targetLoc = 'guardia';
    else if (text.includes('descanso') || text.includes('descansan') || text.includes('libre') || text.includes('libres') || text.includes('franco')) targetLoc = 'descanso';

    if (!targetLoc && isFollowUpQuery(text) && agentContext.lastLocation) {
        targetLoc = agentContext.lastLocation;
    }

    // 3. Identify Dates, Days, Weeks, and Months
    let targetDate = agentParseDateFromText(text);
    let targetMonth = agentParseMonthFromText(text);
    let targetWeekOffset = agentParseWeekOffsetFromText(text);

    if (!targetDate && !targetMonth && targetWeekOffset === null && isFollowUpQuery(text)) {
        if (agentContext.lastDate) targetDate = agentContext.lastDate;
        if (agentContext.lastMonth) targetMonth = agentContext.lastMonth;
    }

    // 4. Check query relevance & Intent Classification
    const isScheduleKeyword = /\b(horario|horarios|turno|turnos|guardia|guardias|valle|mitras|descanso|descansan|libre|libres|vacacion|vacaciones|asueto|asuetos|festivo|festivos|feriado|puente|cubre|cubrir|reemplaza|suple|oficina|sucursal|trabaja|trabajan|está|esta|estarán|estara|quién|quien|quiénes|quienes|personal|empleado|empleados|equipo|todos|evento|eventos|aviso|avisos|anuncio|anuncios|quincena|quincenas|pago|pagos|bono|bonos|bonaice|cumpleaños)\b/i.test(text);

    const isAllStatusIntent = text.includes('todos') || text.includes('cada quien') || text.includes('resumen general') || text.includes('programacion general') || text.includes('dónde están') || text.includes('donde estan') || text.includes('oficina');
    const isReplacementIntent = text.includes('cubre') || text.includes('cubrir') || text.includes('reemplaza') || text.includes('reemplazo') || text.includes('suple') || text.includes('su lugar') || text.includes('en vez de') || text.includes('sustituye');
    const isVacationIntent = text.includes('vacacion') || text.includes('vacaciones') || text.includes('ausente') || text.includes('ausencias') || text.includes('días libres') || text.includes('dias libres') || text.includes('libre') || text.includes('libres');
    const isEventIntent = text.includes('asueto') || text.includes('festivo') || text.includes('feriado') || text.includes('asuetos') || text.includes('festivos') || text.includes('puente') || text.includes('evento') || text.includes('eventos') || text.includes('aviso') || text.includes('avisos') || text.includes('quincena') || text.includes('pago') || text.includes('pagos') || text.includes('bono') || text.includes('bonaice') || text.includes('anuncio') || text.includes('anuncios');
    const isGuardiaIntent = text.includes('guardia') || text.includes('guardias') || text.includes('semanas') || text.includes('proximas') || text.includes('próximas') || text.includes('cuándo le toca') || text.includes('toca guardia');
    const isPersonLocationQuery = targetPerson && (text.includes('dónde') || text.includes('donde') || text.includes('trabaja') || text.includes('estará') || text.includes('estara') || text.includes('horario') || text.includes('turno') || text.includes('ubicacion') || text.includes('ubicación'));

    // If query matches no person, no location, no date, no follow-up context and has no schedule keywords -> Off-topic query!
    if (!targetPerson && !targetLoc && !targetDate && !targetMonth && targetWeekOffset === null && !isScheduleKeyword && !isFollowUpQuery(text)) {
        return `🤖 No encontré información sobre <strong>"${escapeHTML(query)}"</strong> en los registros de la aplicación.<br><br>Solo cuento con datos sobre <strong>horarios, guardias, ubicaciones de sucursales (Valle / Mitras), vacaciones y eventos / quincenas / avisos</strong> del personal.`;
    }

    // RESOLVE INTENT
    let intent = null;
    if (targetPerson && targetLoc && targetLoc !== 'guardia') intent = 'PERSON_SPECIFIC_LOCATION_TIMELINE';
    else if (isReplacementIntent) intent = 'REPLACEMENT';
    else if (isVacationIntent) intent = 'VACATIONS';
    else if (isEventIntent) intent = 'EVENTS';
    else if (isPersonLocationQuery) intent = 'PERSON_LOCATION';
    else if (targetLoc || (text.includes('quien') || text.includes('quién') || text.includes('quienes') || text.includes('quiénes') || text.includes('personal') || text.includes('gente'))) intent = 'LOCATION_DATE';
    else if (isGuardiaIntent) intent = 'GUARDIA';
    else if (isAllStatusIntent) intent = 'ALL_STATUS';
    else if (targetPerson) intent = 'PERSON_SUMMARY';
    else if (isFollowUpQuery(text) && agentContext.lastIntent) intent = agentContext.lastIntent;

    if (!intent) {
        if (targetPerson) intent = 'PERSON_SUMMARY';
        else if (targetLoc) intent = 'LOCATION_DATE';
        else if (isScheduleKeyword) intent = 'ALL_STATUS';
        else {
            return `🤖 No encontré información sobre <strong>"${escapeHTML(query)}"</strong> en los registros de la aplicación.<br><br>Solo cuento con datos sobre <strong>horarios, guardias, ubicaciones de sucursales (Valle / Mitras), vacaciones y eventos / quincenas / avisos</strong> del personal.`;
        }
    }

    // ROUTING TO INTENT HANDLERS
    let response = '';

    switch (intent) {
        case 'PERSON_SPECIFIC_LOCATION_TIMELINE':
            response = agentHandlePersonSpecificLocationTimeline(targetPerson || agentContext.lastPerson, targetLoc, text);
            break;
        case 'PERSON_LOCATION':
            response = agentHandlePersonLocationQuery(targetPerson || agentContext.lastPerson, text, targetDate, targetWeekOffset);
            break;
        case 'REPLACEMENT':
            response = agentHandleReplacementQuery(targetPerson || agentContext.lastPerson, text, targetDate || agentContext.lastDate);
            break;
        case 'VACATIONS':
            response = agentHandleVacationsQuery(targetPerson || agentContext.lastPerson, text);
            break;
        case 'EVENTS':
            response = agentHandleEventsQuery(text);
            break;
        case 'LOCATION_DATE':
            response = agentHandleLocationDateQuery(text, targetLoc || agentContext.lastLocation || 'valle', targetDate || agentContext.lastDate, targetMonth || agentContext.lastMonth, targetWeekOffset);
            break;
        case 'GUARDIA':
            response = agentHandleGuardiaQuery(targetPerson, text, targetMonth);
            break;
        case 'ALL_STATUS':
            response = agentHandleAllStatus(targetWeekOffset !== null ? targetWeekOffset : (state.currentWeekOffset || 0));
            break;
        case 'PERSON_SUMMARY':
            response = agentHandlePersonSummary(targetPerson || agentContext.lastPerson);
            break;
        default:
            response = `🤖 No encontré información sobre <strong>"${escapeHTML(query)}"</strong> en la aplicación.`;
            break;
    }

    // UPDATE CONTEXT MEMORY
    if (targetPerson) agentContext.lastPerson = targetPerson;
    if (targetLoc) agentContext.lastLocation = targetLoc;
    if (targetDate) agentContext.lastDate = targetDate;
    if (targetMonth) agentContext.lastMonth = targetMonth;
    if (intent) agentContext.lastIntent = intent;

    return response;
}

function isFollowUpQuery(text) {
    return text.startsWith('y ') || text.startsWith('¿y ') || text.startsWith('pero ') || text.startsWith('¿quién ') || text.startsWith('quien ') || text.includes('el resto') || text.includes('los demás') || text.includes('diciembre') || text.includes('noviembre') || text.includes('octubre') || text.includes('proxima semana') || text.includes('próxima semana');
}

function agentParseMonthFromText(text) {
    const months = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    for (const [mName, mIdx] of Object.entries(months)) {
        if (text.includes(mName)) {
            return { monthIndex: mIdx, monthName: mName };
        }
    }
    return null;
}

function agentHandlePersonSpecificLocationTimeline(personName, targetLoc, text) {
    if (!personName) return agentHandleAllStatus(state.currentWeekOffset || 0);

    const locUpper = (targetLoc || 'VALLE').toUpperCase();
    const currentOffset = state.currentWeekOffset || 0;
    const maxWeeks = agentParseTimeframeMaxWeeks(text);

    let periodLabel = 'Todo el Año (52 Semanas)';
    if (text.includes('2 meses')) periodLabel = 'Próximos 2 Meses';
    else if (text.includes('3 meses')) periodLabel = 'Próximos 3 Meses';
    else if (text.includes('4 meses')) periodLabel = 'Próximos 4 Meses';
    else if (text.includes('1 mes') || text.includes('un mes')) periodLabel = 'Próximo Mes';
    else if (maxWeeks < 50) periodLabel = `Próximas ${maxWeeks} Semanas`;

    const matchingWeeks = [];

    for (let w = currentOffset; w < Math.min(52, currentOffset + maxWeeks); w++) {
        const schId = getScheduleForPerson(personName, w);
        const sch = scheduleData.find(s => s.id === schId);
        if (!sch) continue;

        const locChange = getEmployeeLocationChange(personName, w);
        const displaySch = locChange ? applyLocationChangeToSchedule(sch, locChange) : sch;

        const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const matchedDays = [];

        days.forEach((dayKey, dayIdx) => {
            const dayInfo = displaySch[dayKey];
            if (dayInfo && dayInfo.location === targetLoc) {
                const vDays = getVacationDaysInWeek(personName, w);
                if (!vDays.includes(dayIdx)) {
                    const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                    matchedDays.push(dayNamesShort[dayIdx]);
                }
            }
        });

        if (matchedDays.length > 0) {
            const dateRange = getWeekDateRange(w);
            matchingWeeks.push({
                weekNumber: w + 1,
                dateRange: dateRange,
                days: matchedDays,
                locChange: locChange,
                schName: sch.name
            });
        }
    }

    let html = `📍 <strong>Fechas y Semanas asignadas a ${locUpper} para ${personName} (${periodLabel})</strong>:<br><br>`;

    if (matchingWeeks.length > 0) {
        matchingWeeks.forEach(item => {
            const dayText = item.days.length === 7 || item.days.length === 5 ? 'Toda la semana (Lun-Vie)' : `Días ${item.days.join(', ')}`;
            const tempBadge = item.locChange ? ` 🔄 <em>(Cambio temporal: ${item.locChange.reason})</em>` : '';
            html += `• 📅 <strong>Semana ${item.weekNumber}</strong> (${item.dateRange}): ${dayText}${tempBadge}<br>`;
        });
    } else {
        const currentSchId = getScheduleForPerson(personName, currentOffset);
        if (currentSchId >= 7) {
            const currentSch = scheduleData.find(s => s.id === currentSchId);
            const fixedLoc = currentSch && currentSch.lunes ? currentSch.lunes.location.toUpperCase() : 'OTRA SUCURSAL';
            html += `<strong>${personName}</strong> tiene asignación FIJA en <strong>${fixedLoc}</strong> (${currentSch ? currentSch.name : 'Fijo'}), por lo que no tiene turnos programados en <strong>${locUpper}</strong> ${periodLabel}.`;
        } else {
            html += `No se encontraron fechas o semanas asignadas a <strong>${locUpper}</strong> para <strong>${personName}</strong> en el periodo de ${periodLabel}.`;
        }
    }

    html += `<br><br><small style="opacity:0.8;">💡 Puedes preguntar por todo el año: <em>"¿qué fechas le toca ${locUpper} a ${personName} en todo el año?"</em></small>`;
    return html;
}

function agentParseWeekOffsetFromText(text) {
    const current = state.currentWeekOffset || 0;
    if (text.includes('esta semana')) return current;
    if (text.includes('proxima semana') || text.includes('próxima semana') || text.includes('siguiente semana')) return current + 1;
    if (text.includes('la otra semana') || text.includes('en 2 semanas')) return current + 2;
    
    const match = text.match(/semana (\d+)/i);
    if (match) {
        const num = parseInt(match[1], 10);
        return Math.max(0, num - 1);
    }
    return null;
}

function agentHandlePersonLocationQuery(personName, text, targetDate, targetWeekOffset) {
    if (!personName) return agentHandleAllStatus(state.currentWeekOffset || 0);

    const weekOffset = targetWeekOffset !== null ? targetWeekOffset : (state.currentWeekOffset || 0);
    const dateRange = getWeekDateRange(weekOffset);
    const schId = getScheduleForPerson(personName, weekOffset);
    const sch = scheduleData.find(s => s.id === schId);

    let html = `📍 <strong>Ubicación y Horario de ${personName} (Semana ${weekOffset + 1} - ${dateRange})</strong>:<br><br>`;

    if (sch) {
        const locChange = getEmployeeLocationChange(personName, weekOffset);
        const displaySch = locChange ? applyLocationChangeToSchedule(sch, locChange) : sch;

        if (displaySch.lunes) {
            const locName = displaySch.lunes.location.toUpperCase();
            html += `• 🏢 <strong>Sucursal Asignada</strong>: <strong>${locName}</strong> (${displaySch.lunes.time})<br>`;
            html += `• 📋 <strong>Nombre del Horario</strong>: ${sch.name}${sch.id >= 7 ? ' <em>(Fijo)</em>' : ' <em>(Rotativo)</em>'}<br>`;
        }

        const vDays = getVacationDaysInWeek(personName, weekOffset);
        if (vDays.length > 0) {
            const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            html += `• 🏖️ <strong>Vacaciones esta semana</strong>: Días ${vDays.map(d => dayNames[d]).join(', ')}<br>`;
        }

        if (locChange) {
            html += `• 🔄 <strong>Cambio Temporal</strong>: Asignado a ${locChange.newLocation.toUpperCase()} (${locChange.reason})<br>`;
        }
    } else {
        html += `No se encontró un turno activo asignado a <strong>${personName}</strong> para ese periodo.`;
    }

    html += `<br><small style="opacity:0.8;">💡 Puedes preguntar: <em>"¿cuándo le toca guardia?"</em> o <em>"¿quién lo cubre?"</em></small>`;
    return html;
}

function agentHandleAllStatus(weekOffset) {
    const dateRange = getWeekDateRange(weekOffset);
    const peopleList = Array.from(new Set([...(state.employees || []), ...Object.values(state.assignments || {})])).sort();

    let html = `📊 <strong>Resumen de Asignaciones (Semana ${weekOffset + 1} - ${dateRange})</strong>:<br><br>`;

    peopleList.forEach(p => {
        const schId = getScheduleForPerson(p, weekOffset);
        const sch = scheduleData.find(s => s.id === schId);
        if (sch) {
            const locChange = getEmployeeLocationChange(p, weekOffset);
            const displaySch = locChange ? applyLocationChangeToSchedule(sch, locChange) : sch;
            const locName = displaySch.lunes ? displaySch.lunes.location.toUpperCase() : 'NO ASIGNADO';
            const vDays = getVacationDaysInWeek(p, weekOffset);
            const vacBadge = vDays.length > 0 ? ' 🏖️ <em>(Vacaciones)</em>' : '';
            const tempBadge = locChange ? ' 🔄 <em>(Cambio)</em>' : '';

            html += `• <strong>${p}</strong>: 📍 ${locName} (${sch.name})${vacBadge}${tempBadge}<br>`;
        }
    });

    html += `<br><small style="opacity:0.8;">💡 Puedes preguntar por alguien en específico: <em>"¿dónde está Roberto?"</em> o <em>"¿quién va a Valle?"</em></small>`;
    return html;
}

function isFollowUpQuery(text) {
    return text.startsWith('y ') || text.startsWith('¿y ') || text.startsWith('pero ') || text.startsWith('¿quién ') || text.startsWith('quien ') || text.includes('el resto') || text.includes('los demás') || text.includes('diciembre') || text.includes('noviembre') || text.includes('octubre') || text.includes('proxima semana') || text.includes('próxima semana');
}

function agentParseMonthFromText(text) {
    const months = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    for (const [mName, mIdx] of Object.entries(months)) {
        if (text.includes(mName)) {
            return { monthIndex: mIdx, monthName: mName };
        }
    }
    return null;
}

function agentParseTimeframeMaxWeeks(text) {
    if (text.includes('todo el año') || text.includes('todo el anio') || text.includes('del año') || text.includes('del anio') || text.includes('año completo') || text.includes('anio completo') || text.includes('12 meses') || text.includes('1 año') || text.includes('un año') || text.includes('anual') || text.includes('el año') || text.includes('el anio')) {
        return 52;
    }
    if (text.includes('6 meses') || text.includes('medio año') || text.includes('semestre')) {
        return 26;
    }
    if (text.includes('4 meses')) return 17;
    if (text.includes('3 meses')) return 13;
    if (text.includes('2 meses')) return 8;
    if (text.includes('1 mes') || text.includes('un mes') || text.includes('4 semanas')) return 4;

    const monthMatch = text.match(/(\d+)\s*meses?/i);
    if (monthMatch) {
        const months = parseInt(monthMatch[1], 10);
        return Math.min(52, Math.max(1, Math.round(months * 4.33)));
    }

    const weekMatch = text.match(/(\d+)\s*semanas?/i);
    if (weekMatch) {
        return Math.min(52, Math.max(1, parseInt(weekMatch[1], 10)));
    }

    return 8;
}

function agentHandleGuardiaQuery(personName, text, monthTarget) {
    let maxWeeks = agentParseTimeframeMaxWeeks(text);

    const currentOffset = state.currentWeekOffset || 0;
    const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    if (!personName) {
        let periodLabel = maxWeeks >= 50 ? 'Todo el Año (52 Semanas)' : `Próximas ${maxWeeks} Semanas`;
        let html = `🛡️ <strong>Programación General de Guardias (${periodLabel})</strong>:<br><br>`;
        const peopleList = Array.from(new Set([...(state.employees || []), ...Object.values(state.assignments || {})])).sort();

        peopleList.forEach(p => {
            const guardiaWeeks = [];
            for (let w = currentOffset; w <= currentOffset + maxWeeks; w++) {
                const weekDate = new Date(state.startDate);
                weekDate.setDate(weekDate.getDate() + (w * 7));
                if (monthTarget && weekDate.getMonth() !== monthTarget.monthIndex) continue;

                const guardiaDays = [];
                for (let d = 0; d < 7; d++) {
                    const schId = getScheduleForPerson(p, w, d);
                    const sch = scheduleData.find(s => s.id === schId);
                    if (sch) {
                        const locChange = getEmployeeLocationChange(p, w);
                        const displaySch = locChange ? applyLocationChangeToSchedule(sch, locChange) : sch;
                        const daysArr = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
                        if (displaySch[daysArr[d]] && displaySch[daysArr[d]].location === 'guardia') {
                            guardiaDays.push(dayNamesShort[d]);
                        }
                    }
                }
                if (guardiaDays.length > 0) {
                    const dateRange = getWeekDateRange(w);
                    guardiaWeeks.push(`Semana ${w + 1} (${dateRange})`);
                }
            }
            if (guardiaWeeks.length > 0) {
                html += `• <strong>${p}</strong> (${guardiaWeeks.length} semanas):<br>&nbsp;&nbsp;&nbsp;` + guardiaWeeks.join('<br>&nbsp;&nbsp;&nbsp;') + '<br><br>';
            }
        });

        html += `<small style="opacity:0.8;">💡 Puedes preguntar: <em>"¿quién cubre a [Nombre]?"</em> o <em>"¿quién estará en Valle?"</em></small>`;
        return html || 'No se encontraron turnos de guardia registrados en el periodo consultado.';
    }

    let titleText = monthTarget ? `en ${monthTarget.monthName.toUpperCase()}` : (maxWeeks >= 50 ? `(Todo el Año - 52 Semanas)` : `(Próximas ${maxWeeks} Semanas)`);
    let html = `🛡️ <strong>Guardias para ${personName} ${titleText}</strong>:<br><br>`;
    const matchWeeks = [];

    for (let w = currentOffset; w <= currentOffset + maxWeeks; w++) {
        const weekDate = new Date(state.startDate);
        weekDate.setDate(weekDate.getDate() + (w * 7));
        if (monthTarget && weekDate.getMonth() !== monthTarget.monthIndex) continue;

        const guardiaDays = [];
        for (let d = 0; d < 7; d++) {
            const schId = getScheduleForPerson(personName, w, d);
            const sch = scheduleData.find(s => s.id === schId);
            if (sch) {
                const locChange = getEmployeeLocationChange(personName, w);
                const displaySch = locChange ? applyLocationChangeToSchedule(sch, locChange) : sch;
                const daysArr = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
                if (displaySch[daysArr[d]] && displaySch[daysArr[d]].location === 'guardia') {
                    guardiaDays.push(dayNamesShort[d]);
                }
            }
        }
        if (guardiaDays.length > 0) {
            const dateRange = getWeekDateRange(w);
            matchWeeks.push(`• <strong>Semana ${w + 1}</strong> (${dateRange}): Días ${guardiaDays.join(', ')}`);
        }
    }

    if (matchWeeks.length > 0) {
        html += matchWeeks.join('<br>');
    } else {
        html += `No se encontraron turnos de guardia asignados a <strong>${personName}</strong> ${monthTarget ? 'en ' + monthTarget.monthName : 'en el periodo de ' + maxWeeks + ' semanas'}.`;
    }

    html += `<br><br><small style="opacity:0.8;">💡 Puedes preguntar: <em>"¿quién lo va a cubrir?"</em> o <em>"¿cuándo sale de vacaciones?"</em></small>`;

    return html;
}

function agentHandleLocationDateQuery(text, targetLoc, targetDate, targetMonth) {
    const locUpper = (targetLoc || 'VALLE').toUpperCase();

    if (targetDate) {
        const dateCopy = new Date(targetDate);
        dateCopy.setHours(0,0,0,0);
        const diffDays = Math.floor((dateCopy - state.startDate) / (1000 * 60 * 60 * 24));
        const targetOffset = Math.floor(diffDays / 7);
        const dayIndex = (dateCopy.getDay() + 6) % 7;
        const formattedDateStr = dateCopy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        const matchedPeople = [];

        scheduleData.forEach(sch => {
            const pData = getPersonForSchedule(sch.id, targetOffset, dayIndex);
            if (pData && pData.name) {
                const personName = pData.name;
                const vacationDays = getVacationDaysInWeek(personName, targetOffset);
                if (vacationDays.includes(dayIndex)) return;

                const locChange = getEmployeeLocationChange(personName, targetOffset);
                const displaySch = locChange ? applyLocationChangeToSchedule(sch, locChange) : sch;
                const daysArr = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
                const dayInfo = displaySch[daysArr[dayIndex]];

                if (dayInfo && dayInfo.location === targetLoc) {
                    matchedPeople.push({
                        name: personName,
                        time: dayInfo.time,
                        isTemp: pData.isTemp
                    });
                }
            }
        });

        let html = `📍 <strong>Personal en ${locUpper} para el ${formattedDateStr}</strong>:<br><br>`;
        if (matchedPeople.length > 0) {
            matchedPeople.forEach(p => {
                html += `• <strong>${p.name}</strong> (${p.time})${p.isTemp ? ' 🔄 <em>(Temporal)</em>' : ''}<br>`;
            });
        } else {
            html += `No hay personal asignado a <strong>${locUpper}</strong> para esa fecha.`;
        }
        html += `<br><small style="opacity:0.8;">💡 Puedes preguntar: <em>"¿quién estará en Mitras ese día?"</em> o <em>"¿quién lo cubre?"</em></small>`;
        return html;
    }

    if (targetMonth) {
        let html = `📍 <strong>Personal asignado a ${locUpper} en ${targetMonth.monthName.toUpperCase()}</strong>:<br><br>`;
        const currentOffset = state.currentWeekOffset || 0;
        let foundAny = false;

        for (let w = currentOffset; w <= currentOffset + 12; w++) {
            const weekDate = new Date(state.startDate);
            weekDate.setDate(weekDate.getDate() + (w * 7));
            if (weekDate.getMonth() !== targetMonth.monthIndex) continue;

            foundAny = true;
            const dateRange = getWeekDateRange(w);
            html += `📅 <strong>Semana ${w + 1} (${dateRange})</strong>:<br>`;

            scheduleData.forEach(sch => {
                const pData = getPersonForSchedule(sch.id, w, 0);
                if (pData && pData.name) {
                    const personName = pData.name;
                    const locChange = getEmployeeLocationChange(personName, w);
                    const displaySch = locChange ? applyLocationChangeToSchedule(sch, locChange) : sch;
                    if (displaySch.lunes && displaySch.lunes.location === targetLoc) {
                        html += `&nbsp;&nbsp;&nbsp;• <strong>${personName}</strong> (${displaySch.lunes.time})<br>`;
                    }
                }
            });
            html += `<br>`;
        }

        if (!foundAny) {
            html += `No se encontraron registros para ${locUpper} en el mes de ${targetMonth.monthName}.`;
        }
        html += `<small style="opacity:0.8;">💡 Puedes preguntar: <em>"¿quién estará en Mitras?"</em> o <em>"¿y las guardias?"</em></small>`;
        return html;
    }

    // Default current week
    const currentOffset = state.currentWeekOffset || 0;
    const dateRange = getWeekDateRange(currentOffset);
    let html = `📍 <strong>Personal en ${locUpper} esta semana (${dateRange})</strong>:<br><br>`;

    scheduleData.forEach(sch => {
        const pData = getPersonForSchedule(sch.id, currentOffset, 0);
        if (pData && pData.name) {
            const personName = pData.name;
            const locChange = getEmployeeLocationChange(personName, currentOffset);
            const displaySch = locChange ? applyLocationChangeToSchedule(sch, locChange) : sch;
            if (displaySch.lunes && displaySch.lunes.location === targetLoc) {
                html += `• <strong>${personName}</strong> (${displaySch.lunes.time})<br>`;
            }
        }
    });

    html += `<br><small style="opacity:0.8;">💡 Puedes especificar una fecha como: <em>"¿quiénes estarán en ${locUpper} el 20 de noviembre?"</em></small>`;
    return html;
}

function agentHandleReplacementQuery(personName, text, targetDate) {
    if (!personName) {
        return `🔄 Por favor especifica a qué persona te refieres o pregúntame primero por alguien (ej. <em>"¿qué semanas le toca guardia a Roberto Lombart?"</em>).`;
    }

    const currentOffset = state.currentWeekOffset || 0;
    let html = `🔄 <strong>Cobertura y Suplencias para ${personName}</strong>:<br><br>`;

    // Check vacations
    const vDays = getVacationDaysInWeek(personName, currentOffset);
    const locChange = getEmployeeLocationChange(personName, currentOffset);

    if (vDays.length > 0) {
        html += `🏖️ <strong>${personName}</strong> tiene días de vacaciones esta semana.<br>`;
    }

    if (locChange) {
        html += `📍 Tiene un cambio de ubicación asignado a: <strong>${locChange.newLocation.toUpperCase()}</strong> (${locChange.reason})<br><br>`;
    }

    // Find who covers Guardia or primary schedule
    const schId = getScheduleForPerson(personName, currentOffset);
    const dateRange = getWeekDateRange(currentOffset);

    html += `📅 <strong>Asignación actual (Semana ${currentOffset + 1} - ${dateRange})</strong>:<br>`;

    const peopleList = Array.from(new Set([...(state.employees || []), ...Object.values(state.assignments || {})]));
    const othersInGuardia = [];

    peopleList.forEach(p => {
        if (p === personName) return;
        const pSchId = getScheduleForPerson(p, currentOffset);
        const pLocChange = getEmployeeLocationChange(p, currentOffset);
        const pSch = scheduleData.find(s => s.id === pSchId);
        const displaySch = pLocChange ? applyLocationChangeToSchedule(pSch, pLocChange) : pSch;

        if (displaySch && displaySch.lunes && displaySch.lunes.location === 'guardia') {
            othersInGuardia.push(p);
        }
    });

    if (othersInGuardia.length > 0) {
        html += `• El personal asignado a <strong>GUARDIA</strong> esta semana para apoyar/cubrir es: <strong>${othersInGuardia.join(', ')}</strong>.<br>`;
    } else {
        html += `• Todo el personal restante se encuentra operando en sus ubicaciones fijas (Valle / Mitras).<br>`;
    }

    html += `<br><small style="opacity:0.8;">💡 Puedes preguntar: <em>"¿dónde estará ${personName} en diciembre?"</em></small>`;
    return html;
}

function agentHandleVacationsQuery(personName, text) {
    let maxWeeks = agentParseTimeframeMaxWeeks(text);
    const currentOffset = state.currentWeekOffset || 0;
    let periodText = maxWeeks >= 50 ? 'en Todo el Año (52 Semanas)' : `en las Próximas ${maxWeeks} Semanas`;

    if (!personName) {
        let html = `🏖️ <strong>Resumen de Vacaciones Próximas (${periodText})</strong>:<br><br>`;
        let foundAny = false;

        const peopleList = Array.from(new Set([...(state.employees || []), ...Object.values(state.assignments || {})])).sort();

        peopleList.forEach(p => {
            const vacWeeks = [];
            for (let w = currentOffset; w <= currentOffset + maxWeeks; w++) {
                const days = getVacationDaysInWeek(p, w);
                if (days.length > 0) {
                    const dateRange = getWeekDateRange(w);
                    vacWeeks.push(`Semana ${w + 1} (${dateRange})`);
                }
            }
            if (vacWeeks.length > 0) {
                foundAny = true;
                html += `• <strong>${p}</strong>:<br>&nbsp;&nbsp;&nbsp;` + vacWeeks.join('<br>&nbsp;&nbsp;&nbsp;') + '<br>';
            }
        });

        if (!foundAny) {
            html += `No hay días de vacaciones programados ${periodText}.`;
        }
        html += `<br><small style="opacity:0.8;">💡 Puedes preguntar: <em>"¿quién cubre a [Nombre]?"</em></small>`;
        return html;
    }

    let html = `🏖️ <strong>Vacaciones Programadas para ${personName} (${periodText})</strong>:<br><br>`;
    const vacWeeks = [];

    for (let w = currentOffset; w <= currentOffset + maxWeeks; w++) {
        const days = getVacationDaysInWeek(personName, w);
        if (days.length > 0) {
            const dateRange = getWeekDateRange(w);
            const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            const names = days.map(d => dayNamesShort[d]).join(', ');
            vacWeeks.push(`• <strong>Semana ${w + 1}</strong> (${dateRange}): Días ${names}`);
        }
    }

    if (vacWeeks.length > 0) {
        html += vacWeeks.join('<br>');
    } else {
        html += `No se encontraron días de vacaciones registrados para <strong>${personName}</strong> ${periodText}.`;
    }

    html += `<br><br><small style="opacity:0.8;">💡 Puedes preguntar: <em>"¿quién lo va a cubrir?"</em> o <em>"¿cuándo le toca guardia?"</em></small>`;

    return html;
}

function agentHandleEventsQuery(queryText) {
    if (!state.events || Object.keys(state.events).length === 0) {
        return `📅 <strong>Eventos y Avisos de la Empresa</strong>:<br><br>No hay eventos, días festivos, quincenas o avisos registrados actualmente en la aplicación. Puedes agregar o consultar eventos en el menú <strong>"Eventos y Avisos"</strong>.`;
    }

    const queryLower = (queryText || '').toLowerCase().trim();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allEvents = [];

    Object.entries(state.events).forEach(([key, value]) => {
        if (!value) return;
        const text = value.text || '';
        const type = value.type || 'notice';
        const dateStr = value.date || (key.match(/^\d{4}-\d{2}-\d{2}$/) ? key : null);

        let dateObj = null;
        if (dateStr) {
            try { dateObj = parseLocalDate(dateStr); } catch (e) { }
        }

        allEvents.push({
            dateStr: dateStr,
            dateObj: dateObj,
            text: text,
            type: type,
            guardiaStart: value.guardiaStart,
            guardiaEnd: value.guardiaEnd,
            raw: value
        });
    });

    if (allEvents.length === 0) {
        return `📅 No hay eventos o avisos registrados actualmente en la aplicación.`;
    }

    // Sort events chronologically
    allEvents.sort((a, b) => {
        if (!a.dateObj) return 1;
        if (!b.dateObj) return -1;
        return a.dateObj - b.dateObj;
    });

    // Identify matching category/terms
    const searchTerms = ['quincena', 'bonaice', 'bono', 'pago', 'asueto', 'festivo', 'reunion', 'anuncio', 'cumpleaños', 'evento', 'aviso'];
    let matchedTerm = searchTerms.find(term => queryLower.includes(term));

    let filteredEvents = allEvents;
    if (matchedTerm && matchedTerm !== 'evento' && matchedTerm !== 'aviso') {
        const synonyms = (matchedTerm === 'bonaice' || matchedTerm === 'bono') ? ['bonaice', 'bono'] : [matchedTerm];
        filteredEvents = allEvents.filter(e => {
            const textLower = e.text.toLowerCase();
            const typeLower = e.type.toLowerCase();
            return synonyms.some(syn => textLower.includes(syn) || typeLower.includes(syn));
        });
    }

    // Filter upcoming events (today or future)
    const isPastAllowed = queryLower.includes('pasad') || queryLower.includes('anterior') || queryLower.includes('historial');
    let upcomingEvents = filteredEvents;
    if (!isPastAllowed) {
        const futureOnly = filteredEvents.filter(e => e.dateObj && e.dateObj >= today);
        if (futureOnly.length > 0) {
            upcomingEvents = futureOnly;
        }
    }

    // Detect quantity requested
    let requestedCount = null;
    if (queryLower.includes('todas') || queryLower.includes('todos') || queryLower.includes('año') || queryLower.includes('anio') || queryLower.includes('completo')) {
        requestedCount = 999;
    } else {
        const wordToNum = { 'un': 1, 'una': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5, 'seis': 6 };
        const numMatch = queryLower.match(/\b(\d+|un|una|dos|tres|cuatro|cinco|seis)\s*(quincena|quincenas|evento|eventos|festivo|festivos|aviso|avisos|pago|pagos)\b/i);
        if (numMatch) {
            const rawVal = numMatch[1].toLowerCase();
            requestedCount = wordToNum[rawVal] || parseInt(rawVal, 10) || 1;
        } else if (queryLower.includes('proxima') || queryLower.includes('próxima') || queryLower.includes('siguiente') || queryLower.includes('cuando es') || queryLower.includes('cuándo es') || queryLower.includes('que dia es') || queryLower.includes('qué día es')) {
            requestedCount = 1;
        }
    }

    // Default to 1 (only the next upcoming one) if searching a specific term like quincena without specifying quantity
    if (requestedCount === null && matchedTerm) {
        requestedCount = 1;
    }

    const limit = requestedCount !== null ? requestedCount : 999;
    const finalEvents = upcomingEvents.slice(0, limit);

    const typeIcons = {
        'holiday': '🎉',
        'payday': '💰',
        'alert': '🚨',
        'notice': '📢'
    };

    const typeNames = {
        'holiday': 'Día Festivo / Asueto',
        'payday': 'Quincena / Pago',
        'alert': 'Alerta Especial',
        'notice': 'Aviso / Evento'
    };

    if (finalEvents.length > 0) {
        let categoryTitle = matchedTerm && matchedTerm !== 'evento' && matchedTerm !== 'aviso' ? matchedTerm.toUpperCase() : 'EVENTOS / AVISOS';
        let countTitle = finalEvents.length === 1 ? 'Próxima' : (limit < 900 ? `Próximas ${finalEvents.length}` : 'Programados');

        let html = `📅 <strong>${countTitle} ${categoryTitle}</strong>:<br><br>`;
        finalEvents.forEach(evt => {
            const icon = typeIcons[evt.type] || '📌';
            const typeLabel = typeNames[evt.type] || evt.type;
            const dateFormatted = evt.dateObj ? evt.dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : (evt.dateStr || 'Sin fecha');

            html += `${icon} <strong>${evt.text}</strong><br>`;
            html += `&nbsp;&nbsp;&nbsp;• 📅 <strong>Fecha</strong>: ${dateFormatted}<br>`;
            html += `&nbsp;&nbsp;&nbsp;• 🏷️ <strong>Categoría</strong>: ${typeLabel}<br>`;
            if (evt.guardiaStart && evt.guardiaEnd) {
                html += `&nbsp;&nbsp;&nbsp;• 🕒 <strong>Horario Especial de Guardia</strong>: ${evt.guardiaStart} - ${evt.guardiaEnd}<br>`;
            }
            html += `<br>`;
        });

        if (upcomingEvents.length > finalEvents.length) {
            html += `<small style="opacity:0.8;">💡 Hay ${upcomingEvents.length - finalEvents.length} eventos más este año. Puedes preguntar por: <em>"próximas ${upcomingEvents.length} quincenas"</em> o <em>"todas las quincenas"</em>.</small>`;
        }
        return html;
    } else {
        let html = `🤖 No encontré una próxima fecha registrada para <strong>"${escapeHTML(matchedTerm || queryText)}"</strong> a partir de hoy.<br><br>`;
        html += `📌 <strong>Eventos actualmente registrados en el sistema:</strong><br><br>`;
        allEvents.forEach(evt => {
            const icon = typeIcons[evt.type] || '📌';
            html += `${icon} <strong>${evt.text}</strong> (${evt.dateStr || 'Fecha general'})<br>`;
        });
        return html;
    }
}

function agentHandlePersonSummary(personName) {
    if (!personName) {
        return `👤 Por favor indica el nombre de la persona para mostrarte su resumen.`;
    }

    const currentOffset = state.currentWeekOffset || 0;
    const schId = getScheduleForPerson(personName, currentOffset);
    const dateRange = getWeekDateRange(currentOffset);

    let html = `👤 <strong>Estado Completo de ${personName} (Semana Actual - ${dateRange})</strong>:<br><br>`;

    if (schId) {
        const sch = scheduleData.find(s => s.id === schId);
        html += `• 📋 <strong>Horario Asignado</strong>: ${sch ? sch.name : 'Horario ' + schId}<br>`;

        const vacationDays = getVacationDaysInWeek(personName, currentOffset);
        if (vacationDays.length > 0) {
            html += `• 🏖️ <strong>Vacaciones</strong>: Días de vacaciones esta semana.<br>`;
        }

        const locChange = getEmployeeLocationChange(personName, currentOffset);
        if (locChange) {
            html += `• 📍 <strong>Cambio de Ubicación</strong>: A ${locChange.newLocation.toUpperCase()} (${locChange.reason})<br>`;
        }

        // Show next week preview
        const nextSchId = getScheduleForPerson(personName, currentOffset + 1);
        const nextSch = scheduleData.find(s => s.id === nextSchId);
        const nextDateRange = getWeekDateRange(currentOffset + 1);
        if (nextSch) {
            html += `• 🔮 <strong>Próxima Semana (${nextDateRange})</strong>: ${nextSch.name}<br>`;
        }
    } else {
        html += `No se encontró un horario activo para <strong>${personName}</strong> en la semana actual.`;
    }

    html += `<br><small style="opacity:0.8;">💡 Puedes preguntar: <em>"¿qué semanas le toca guardia?"</em> o <em>"¿cuándo sale de vacaciones?"</em></small>`;

    return html;
}

function agentGetFallbackResponse(targetPerson, text) {
    let personMention = targetPerson ? ` (relacionado con <strong>${targetPerson}</strong>)` : '';
    return `🤖 Entendí tu consulta${personMention}, pero necesito un poco más de detalle.<br><br>
    Intenta con alguna de estas preguntas:<br>
    • <strong>"¿Qué semanas le toca guardia en los próximos 2 meses?"</strong><br>
    • <strong>"¿Y en diciembre?"</strong><br>
    • <strong>"¿Quién lo va a cubrir?"</strong><br>
    • <strong>"¿Quiénes estarán en Valle el 20 de noviembre?"</strong><br>
    • <strong>"En los asuetos siguientes ¿a quiénes les toca la guardia?"</strong>`;
}

function agentParseDateFromText(text) {
    const today = new Date();
    today.setHours(0,0,0,0);

    if (text.includes('hoy')) return today;
    if (text.includes('mañana') || text.includes('manana')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }

    const months = {
        'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
        'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
        'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };

    for (const [mName, mIdx] of Object.entries(months)) {
        if (text.includes(mName)) {
            const dayMatch = text.match(/\b(\d{1,2})\b/);
            if (dayMatch) {
                const dayNum = parseInt(dayMatch[1], 10);
                const year = today.getFullYear();
                let d = new Date(year, mIdx, dayNum);
                if (d < today && (today.getMonth() - mIdx > 6)) {
                    d = new Date(year + 1, mIdx, dayNum);
                }
                return d;
            }
        }
    }

    const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (isoMatch) {
        return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
    }

    return null;
}
