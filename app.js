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

// Inicializar Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    console.log("✅ Firebase inicializado correctamente");
} catch (e) {
    console.error("❌ Error inicializando Firebase:", e);
}

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
    assignNameInput: document.getElementById('assignNameInput'),
    swapPersonSelect: document.getElementById('swapPersonSelect'),
    swapReason: document.getElementById('swapReason'),
    themeToggle: document.getElementById('themeToggle'),
    loginBtn: document.getElementById('loginBtn'),
    doLoginBtn: document.getElementById('doLoginBtn'),
    manageAssignmentsBtn: document.getElementById('manageAssignmentsBtn'),
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

function init() {
    setupEventListeners();
    initTheme();

    // Calcular semana actual
    const weeksFromStart = getWeeksFromStart(new Date());
    state.currentWeekOffset = weeksFromStart < 0 ? 0 : weeksFromStart;

    toggleAdminView(false);
    switchTab('individual');

    // Escuchar cambios en Firebase en tiempo real
    if (db) {
        const dataRef = db.ref('appData');
        dataRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                state.assignments = data.assignments || {};
                state.weeklyOverrides = data.weeklyOverrides || {};
                state.employees = data.employees || [];
                state.customTitles = data.customTitles || {};

                // Renderizar todo cuando lleguen datos nuevos
                applyCustomTitles();
                renderAll();
            } else {
                // Si no hay datos (primera vez), inicializar vacíos
                renderAll();
            }
        });
    } else {
        alert("Firebase no está configurado correctamente.");
    }
}

// Función auxiliar para guardar en Firebase
function saveToFirebase(path, data) {
    if (db) {
        db.ref('appData/' + path).set(data)
            .catch(err => console.error("Error guardando en Firebase:", err));
    }
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
                state.isAdmin = false;
                toggleAdminView(false);
                switchTab('individual');
                alert('Sesión cerrada');
            } else {
                elements.loginModal.classList.add('active');
                document.getElementById('loginUser').value = '';
                document.getElementById('loginPass').value = '';
                document.getElementById('loginError').style.display = 'none';
                document.getElementById('loginUser').focus();
            }
        });
    }

    if (elements.doLoginBtn) {
        elements.doLoginBtn.addEventListener('click', checkLogin);
    }

    if (elements.manageAssignmentsBtn) {
        elements.manageAssignmentsBtn.addEventListener('click', openManageAssignments);
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

function checkLogin() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    if (user === 'admin' && pass === 'admin123') {
        state.isAdmin = true;
        toggleAdminView(true);
        closeModal();
        switchTab('config');
    } else {
        document.getElementById('loginError').style.display = 'block';
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

        // Guardar en Firebase
        saveToFirebase('customTitles', state.customTitles);

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
            </td>
            ${renderDayCells(schedule)}
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

    // Guardar en Firebase
    saveToFirebase('weeklyOverrides', state.weeklyOverrides);

    closeModal();
}

function renderDayCells(schedule) {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    return days.map(day => {
        const data = schedule[day];
        if (!data) return '<td class="descanso"><span class="location-badge descanso">Descanso</span></td>';
        return `
            <td>
                <div class="schedule-cell">
                    <span class="time">${data.time}</span>
                    <span class="location-badge ${data.location}">${data.location}</span>
                </div>
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

    let html = '';

    if (swapInfo) {
        html += `
            <div style="background-color: var(--primary-light); color: var(--primary-dark); padding: 1rem; border-radius: var(--radius); margin-bottom: 1.5rem; border: 1px solid var(--primary);">
                <strong>⚠️ Cambio de Guardia:</strong> Cubriendo a <strong>${swapInfo.originalPerson}</strong>.
                <div style="margin-top: 0.5rem; font-style: italic;">"${swapInfo.comment}"</div>
            </div>
        `;
    }

    html += `<div class="individual-days-list">`;

    days.forEach((day, index) => {
        const data = schedule[day];
        const isToday = index === currentDayIndex && state.currentWeekOffset === getWeeksFromStart(new Date());

        html += `
            <div class="day-card ${isToday ? 'today' : ''}">
                <div class="day-name">
                    <strong>${day.charAt(0).toUpperCase() + day.slice(1)}</strong>
                    ${isToday ? '<span class="badge-today">HOY</span>' : ''}
                </div>
                <div class="day-schedule">
                    ${data ? `
                        <span class="time">${data.time}</span>
                        <span class="location-badge ${data.location}">${data.location}</span>
                    ` : '<span class="text-muted">Descanso</span>'}
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

        const personDisplay = personData ? personData.name : '<span class="text-muted">--</span>';
        const commentDisplay = (personData && personData.isTemp)
            ? `<span class="swap-comment">${personData.comment}</span>`
            : '';

        let secondColumnContent = `Horario ${i}`;
        if (personData && personData.isTemp) {
            let baseId = (i - 1 - state.currentWeekOffset) % 7;
            if (baseId < 0) baseId += 7;
            baseId += 1;
            const originalPerson = state.assignments[baseId] || 'Vacante';

            secondColumnContent = `
                <div style="font-size: 0.85rem; line-height: 1.2;">
                    <span class="text-muted" style="font-size: 0.75rem;">Cubriendo a:</span><br>
                    <strong style="color: var(--primary);">${originalPerson}</strong>
                </div>
            `;
        }

        tr.innerHTML = `
            <td class="person-cell" style="cursor: default; font-weight: normal;">
                ${personDisplay}
                ${commentDisplay}
            </td>
            <td>${secondColumnContent}</td>
            ${renderDayCells(schedule)}
        `;
        tbody.appendChild(tr);

        if (personData) {
            addToLocationTables(personData, schedule);
        }
    }
}

function addToLocationTables(personData, schedule) {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const locations = {};

    days.forEach(day => {
        if (schedule[day]) {
            const loc = schedule[day].location;
            if (!locations[loc]) {
                locations[loc] = { days: [], startTime: '' };
            }
            locations[loc].days.push(day.charAt(0).toUpperCase() + day.slice(1, 3));

            if (!locations[loc].startTime) {
                const timeParts = schedule[day].time.split(' - ');
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
            div.innerHTML = `
                <div>
                    <strong>${personData.name}</strong>
                    <div class="text-xs text-muted">${data.days.join(', ')}</div>
                    ${personData.isTemp ? `<span class="comment-text">${personData.comment}</span>` : ''}
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
                // Guardar en Firebase
                saveToFirebase('employees', state.employees);
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
        saveToFirebase('assignments', state.assignments);
        openManageAssignments();
    } else {
        if (state.assignments[currentEditingScheduleId]) {
            delete state.assignments[currentEditingScheduleId];
            saveToFirebase('assignments', state.assignments);
            openManageAssignments();
        }
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    currentEditingScheduleId = null;
    currentSwapData = null;
    if (elements.swapReason) elements.swapReason.value = '';

    if (document.getElementById('loginUser')) document.getElementById('loginUser').value = '';
    if (document.getElementById('loginPass')) document.getElementById('loginPass').value = '';
    if (document.getElementById('loginError')) document.getElementById('loginError').style.display = 'none';
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
