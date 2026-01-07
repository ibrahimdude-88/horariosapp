// ==========================================
// CONFIGURACIÓN DE ALMACENAMIENTO LOCAL
// ==========================================

// Firebase desconectado - Usando localStorage para pruebas
console.log("✅ Usando localStorage para almacenamiento de datos");

// ==========================================
// DATOS ESTÁTICOS Y ESTADO
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

// Estado Local (se sincroniza con Firebase)
let state = {
    assignments: {},
    weeklyOverrides: {},
    employees: [],
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
// ... scheduleData se mantiene igual, no lo toco aquí si está fuera del reemplazo
// (pero mi startline/endline debe cubrir el inicio del archivo o solo la parte de storage)
// Voy a asumir que el usuario quiere mantener scheduleData, así que ajustaré StartLine.

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
            state.customTitles = data.customTitles || {};
            state.vacations = data.vacations || {};
            state.locationChanges = data.locationChanges || {};
            state.events = data.events || {};

            console.log("📡 Datos sincronizados desde Firebase");
        } else {
            console.log("⚠️ Base de datos vacía, usando estado limpio.");
            // Si está vacía, no hacemos nada (el state ya está limpio por defecto)
        }

        // Re-renderizar la interfaz cada vez que llegan datos
        applyCustomTitles();
        renderAll();
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
        customTitles: state.customTitles,
        vacations: state.vacations,
        locationChanges: state.locationChanges,
        events: state.events
    };

    db.ref('appData').set(dataToSave)
        .then(() => console.log("☁️ Datos guardados en Firebase"))
        .catch(e => console.error("Error guardando en Firebase:", e));
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme'); // Tema se queda local
    if (savedTheme === 'dark') {
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
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
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

    if (elements.manageVacationsBtn) {
        elements.manageVacationsBtn.addEventListener('click', openManageVacations);
    }

    if (elements.manageLocationChangesBtn) {
        elements.manageLocationChangesBtn.addEventListener('click', openManageLocationChanges);
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
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
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
    let rotated = (baseId - 1 + weekOffset) % 7;
    if (rotated < 0) rotated += 7;
    return rotated + 1;
}

function getScheduleForPerson(personName, weekOffset) {
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
            if (data.person === personName) {
                return parseInt(schId);
            }
        }
    }

    const rotatedId = getRotatedScheduleId(baseScheduleId, weekOffset);

    if (state.weeklyOverrides[weekKey] && state.weeklyOverrides[weekKey][rotatedId]) {
        const intruderName = state.weeklyOverrides[weekKey][rotatedId].person;
        let intruderBaseId = null;
        for (const [id, name] of Object.entries(state.assignments)) {
            if (name === intruderName) {
                intruderBaseId = parseInt(id);
                break;
            }
        }
        if (intruderBaseId) {
            return getRotatedScheduleId(intruderBaseId, weekOffset);
        }
    }
    return rotatedId;
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

function getPersonForSchedule(scheduleId, weekOffset) {
    const weekKey = weekOffset.toString();

    if (state.weeklyOverrides[weekKey] && state.weeklyOverrides[weekKey][scheduleId]) {
        return {
            name: state.weeklyOverrides[weekKey][scheduleId].person,
            isTemp: true,
            comment: state.weeklyOverrides[weekKey][scheduleId].comment
        };
    }

    let baseId = (scheduleId - 1 - weekOffset) % 7;
    if (baseId < 0) baseId += 7;
    baseId += 1;

    const personName = state.assignments[baseId];

    if (personName) {
        if (state.weeklyOverrides[weekKey]) {
            for (const [sId, data] of Object.entries(state.weeklyOverrides[weekKey])) {
                if (data.person === personName) {
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

    // Renderizar banners de eventos
    renderEventsBanner('eventsBannerInd');
    renderEventsBanner('eventsBannerGen');
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

        const personData = getPersonForSchedule(schedule.id, state.currentWeekOffset);
        const assignedPersonName = personData ? personData.name : 'Vacante';
        const isSwap = personData && personData.isTemp;
        const isOnVacation = personData && isEmployeeOnVacation(personData.name, state.currentWeekOffset);

        const actionBtn = `
            <button class="btn-icon" onclick="openSwapModal(${schedule.id})" title="Cambio Temporal (Esta Semana)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
            </button>
        `;

        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <strong>Horario ${schedule.id}</strong>
                    ${actionBtn}
                </div>
            </td>
            <td class="person-cell" style="cursor: default; font-weight: normal;">
                ${assignedPersonName}
                ${isSwap ? `<span class="text-xs text-muted" style="display:block; font-size: 0.7rem;">(Cambio Temporal)</span>` : ''}
                ${isOnVacation ? `<span class="vacation-badge-small">🏖️ Vacaciones</span>` : ''}
            </td>
            ${renderDayCells(schedule, personData ? personData.name : null, state.currentWeekOffset)}
        `;
        tbody.appendChild(tr);
    });
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

    if (!targetPerson || !reason) {
        alert('Por favor selecciona una persona y escribe un comentario.');
        return;
    }

    const weekKey = state.currentWeekOffset.toString();
    if (!state.weeklyOverrides[weekKey]) {
        state.weeklyOverrides[weekKey] = {};
    }

    state.weeklyOverrides[weekKey][currentEditingScheduleId] = {
        person: targetPerson,
        comment: reason
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
            comment: reason
        };

        if (originName) {
            const targetPhysicalSchedule = getRotatedScheduleId(targetPersonOriginalScheduleId, state.currentWeekOffset);
            state.weeklyOverrides[weekKey][targetPhysicalSchedule] = {
                person: originName,
                comment: `Intercambio con H${currentEditingScheduleId}: ${reason}`
            };
        }
    }

    // Guardar en localStorage
    saveToLocalStorage();

    closeModal();
}

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

            if (state.events[dateKey] && state.events[dateKey].type === 'holiday') {
                holidayEvents[i] = state.events[dateKey];
            }
        }
    }

    // Aplicar cambio de ubicación si existe
    const displaySchedule = locationChange ? applyLocationChangeToSchedule(schedule, locationChange) : schedule;

    return days.map((day, index) => {
        const data = displaySchedule[day];
        const isOnVacation = vacationDays.includes(index);

        // Verificar si es asueto y NO es guardia
        const holidayEvent = holidayEvents[index];
        const isHoliday = !!holidayEvent;
        const isGuardia = data && data.location === 'guardia';
        const applyHolidayEffect = isHoliday && !isGuardia;

        if (isOnVacation) {
            return '<td class="vacation-cell"><span class="location-badge vacation">VACACIONES</span></td>';
        }

        if (!data) return '<td class="descanso"><span class="location-badge descanso">Descanso</span></td>';

        // Lógica de horario especial para guardia
        let displayTime = data.time;
        let isSpecialSchedule = false;

        if (isHoliday && isGuardia && holidayEvent.guardiaStart && holidayEvent.guardiaEnd) {
            displayTime = `${holidayEvent.guardiaStart} - ${holidayEvent.guardiaEnd}`;
            isSpecialSchedule = true;
        }

        const hasLocationChange = locationChange && data.location === locationChange.newLocation;
        let classes = hasLocationChange ? 'location-change-cell' : '';
        let styles = '';
        let cellContent = '';

        if (applyHolidayEffect) {
            styles = 'background-color: rgba(16, 185, 129, 0.15); position: relative;';
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
            <td class="${classes}" style="${styles}">
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

    const scheduleId = getScheduleForPerson(personName, state.currentWeekOffset);
    const schedule = scheduleData.find(s => s.id === scheduleId);

    let swapInfo = null;
    const weekKey = state.currentWeekOffset.toString();

    if (state.weeklyOverrides[weekKey] && state.weeklyOverrides[weekKey][scheduleId]) {
        const override = state.weeklyOverrides[weekKey][scheduleId];
        if (override.person === personName) {
            let baseId = (scheduleId - 1 - state.currentWeekOffset) % 7;
            if (baseId < 0) baseId += 7;
            baseId += 1;
            const originalPerson = state.assignments[baseId] || 'Vacante';

            swapInfo = {
                comment: override.comment,
                originalPerson: originalPerson
            };
        }
    }

    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const today = new Date().getDay();
    const jsDayToIndex = [6, 0, 1, 2, 3, 4, 5];
    const currentDayIndex = jsDayToIndex[today];
    const vacationDays = getVacationDaysInWeek(personName, state.currentWeekOffset);
    const locationChange = getEmployeeLocationChange(personName, state.currentWeekOffset);

    // Aplicar cambio de ubicación si existe
    const displaySchedule = locationChange ? applyLocationChangeToSchedule(schedule, locationChange) : schedule;

    let html = '';

    if (swapInfo) {
        html += `
            <div style="background-color: var(--primary-light); color: var(--primary-dark); padding: 1rem; border-radius: var(--radius); margin-bottom: 1.5rem; border: 1px solid var(--primary);">
                <strong>⚠️ Cambio de Guardia:</strong> Cubriendo a <strong>${swapInfo.originalPerson}</strong>.
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

    // Obtener días festivos de la semana (mapa índice -> evento) para esta vista
    const holidayEvents = {};
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
                holidayEvents[i] = state.events[dateKey];
            }
        }
    }

    html += `<div class="individual-days-list">`;

    days.forEach((day, index) => {
        const data = displaySchedule[day];
        const isToday = index === currentDayIndex && state.currentWeekOffset === getWeeksFromStart(new Date());
        const isOnVacation = vacationDays.includes(index);
        const hasLocationChange = locationChange && data && data.location === locationChange.newLocation;

        // Lógica de Asueto / Guardia
        const holidayEvent = holidayEvents[index];
        const isHoliday = !!holidayEvent;
        const isGuardia = data && data.location === 'guardia';
        const applyHolidayEffect = isHoliday && !isGuardia;

        let displayTime = data ? data.time : '';
        let isSpecialSchedule = false;

        if (isHoliday && isGuardia && holidayEvent.guardiaStart && holidayEvent.guardiaEnd) {
            displayTime = `${holidayEvent.guardiaStart} - ${holidayEvent.guardiaEnd}`;
            isSpecialSchedule = true;
        }

        let cardStyle = '';
        let contentStyle = '';
        let overlayHTML = '';

        if (applyHolidayEffect) {
            cardStyle = 'background-color: rgba(16, 185, 129, 0.15); border: 1px solid var(--success); position: relative; overflow: hidden;';
            contentStyle = 'opacity: 0.25; filter: blur(1.5px);';
            overlayHTML = `
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--success); font-weight: bold; font-size: 1.2rem; text-shadow: 0 1px 2px rgba(255,255,255,0.9); pointer-events: none; width: 100%; text-align: center; z-index: 5;">
                    FESTIVO
                </div>
            `;
        }

        html += `
            <div class="day-card ${isToday ? 'today' : ''} ${isOnVacation ? 'vacation' : ''} ${hasLocationChange ? 'location-change' : ''}" style="${cardStyle}">
                ${overlayHTML}
                <div style="${contentStyle}">
                    <div class="day-name">
                        <strong>${day.charAt(0).toUpperCase() + day.slice(1)}</strong>
                        ${isToday ? '<span class="badge-today">HOY</span>' : ''}
                        ${isOnVacation ? '<span class="badge-vacation">VACACIONES</span>' : ''}
                        ${hasLocationChange ? '<span class="badge-location-change">CAMBIO UBICACIÓN</span>' : ''}
                        ${isSpecialSchedule ? '<span class="badge-location-change" style="background: var(--success);">🕒 HORARIO ESPECIAL</span>' : ''}
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

    for (let i = 1; i <= 7; i++) {
        const personData = getPersonForSchedule(i, state.currentWeekOffset);
        const schedule = scheduleData.find(s => s.id === i);

        const tr = document.createElement('tr');

        if (personData && personData.isTemp) {
            tr.classList.add('row-swap');
        }

        const isOnVacation = personData && isEmployeeOnVacation(personData.name, state.currentWeekOffset);

        if (isOnVacation) {
            tr.classList.add('row-vacation');
        }

        const personDisplay = personData ? personData.name : '<span class="text-muted">--</span>';
        const commentDisplay = (personData && personData.isTemp)
            ? `<span class="swap-comment">${personData.comment}</span>`
            : '';
        const vacationDisplay = isOnVacation ? `<span class="vacation-badge-small">🏖️ Vacaciones</span>` : '';

        tr.innerHTML = `
            <td class="person-cell" style="cursor: default; font-weight: normal;">
                ${personDisplay}
                ${commentDisplay}
                ${vacationDisplay}
            </td>
            ${renderDayCells(schedule, personData ? personData.name : null, state.currentWeekOffset)}
        `;
        tbody.appendChild(tr);

        if (personData) {
            addToLocationTables(personData, schedule);
        }
    }
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

function openManageAssignments() {
    const modalBody = document.querySelector('#assignModal .modal-body');
    modalBody.innerHTML = `
        <h3>Gestionar Asignaciones Base</h3>
        <p class="text-muted" style="margin-bottom: 1rem;">Asigna las personas a los horarios iniciales (Semana 1).</p>
        <div class="assignments-list" style="max-height: 300px; overflow-y: auto;">
            ${scheduleData.map(s => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid var(--border);">
                    <span>Horario ${s.id}</span>
                    <button class="btn-secondary btn-sm" onclick="editBaseAssignment(${s.id})">
                        ${state.assignments[s.id] || 'Asignar'}
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    document.querySelector('#assignModal .modal-footer').style.display = 'none';
    elements.assignModal.classList.add('active');
}

window.editBaseAssignment = function (scheduleId) {
    currentEditingScheduleId = scheduleId;
    document.getElementById('modalScheduleId').textContent = scheduleId;

    const modalBody = document.querySelector('#assignModal .modal-body');
    modalBody.innerHTML = `
        <p>Asignar persona al <strong>Horario ${scheduleId}</strong> (Base)</p>
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
    const currentName = state.assignments[scheduleId];
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
                const start = new Date(vac.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                const end = new Date(vac.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                return `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: white; border-radius: 4px; margin-bottom: 0.5rem;">
                                <span>🏖️ ${start} - ${end}</span>
                                <button class="btn-remove-vacation btn-icon" data-employee="${employee}" data-index="${index}" style="background: #fee2e2; color: #dc2626; border-color: #fca5a5;" title="Eliminar">
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
                    <button class="btn-remove-location-change btn-icon" data-employee="${employee}" style="background: #fee2e2; color: #dc2626; border-color: #fca5a5;" title="Eliminar">
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

    Object.keys(state.events).forEach(dateStr => {
        const eventDate = parseLocalDate(dateStr);

        if (eventDate >= weekStart && eventDate <= weekEnd) {
            eventsToShow.push({
                date: eventDate,
                ...state.events[dateStr]
            });
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

    renderEventsList();
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

    // Objeto evento base
    const eventData = {
        text: text,
        type: type
    };

    // Agregar horario especial si es holiday
    if (type === 'holiday') {
        const gStart = document.getElementById('guardiaStart').value;
        const gEnd = document.getElementById('guardiaEnd').value;
        if (gStart && gEnd) {
            // Formatear a AM/PM para consistencia
            eventData.guardiaStart = convertToAMPM(gStart);
            eventData.guardiaEnd = convertToAMPM(gEnd);
        }
    }

    // Guardar evento
    state.events[date] = eventData;

    saveToLocalStorage();
    renderEventsList();
    renderAll(); // Para actualizar banners

    // Limpiar texto
    document.getElementById('eventText').value = '';

    // Feedback visual
    const btn = document.getElementById('saveEventBtn');
    const originalText = btn.textContent;
    btn.textContent = '✅ Guardado';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 1500);
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

    // Ordenar fechas
    const sortedDates = Object.keys(state.events).sort();

    let html = '';
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    sortedDates.forEach(date => {
        // No mostrar eventos pasados (opcional, pero ayuda a limpiar la lista)
        // if (date < yesterdayStr) return;

        const event = state.events[date];
        const dateObj = parseLocalDate(date); // Usamos nuestra función segura
        const dateFormatted = dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

        let typeLabel = '';
        let typeColor = '';

        switch (event.type) {
            case 'holiday': typeLabel = 'Festivo'; typeColor = 'var(--success)'; break;
            case 'alert': typeLabel = 'Alerta'; typeColor = 'var(--danger)'; break;
            case 'payday': typeLabel = 'Quincena'; typeColor = '#d97706'; break;
            default: typeLabel = 'Aviso'; typeColor = 'var(--primary)';
        }

        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-body); border-radius: var(--radius-sm); margin-bottom: 0.5rem; border-left: 4px solid ${typeColor};">
                <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${dateFormatted} <span style="background: ${typeColor}20; color: ${typeColor}; padding: 2px 6px; border-radius: 4px; margin-left: 0.5rem; font-weight: bold;">${typeLabel}</span></div>
                    <div style="font-weight: 500;">${event.text}</div>
                </div>
                <button class="btn-remove-event btn-icon" data-date="${date}" style="color: var(--danger); opacity: 0.7;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                </button>
            </div>
        `;
    });

    container.innerHTML = html || '<p class="text-muted" style="text-align: center;">Solo hay eventos pasados.</p>';

    // Agregar listeners
    container.querySelectorAll('.btn-remove-event').forEach(btn => {
        btn.addEventListener('click', function () {
            const date = this.dataset.date;
            showConfirmDialog('¿Eliminar este evento?', () => {
                delete state.events[date];
                saveToLocalStorage();
                renderEventsList();
                renderAll();
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

// Start
init();
