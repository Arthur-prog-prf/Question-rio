import { dataManager } from '../data-manager.js';
import { modalManager } from '../modals.js';
import { ICONS } from '../../config/icons.js';
import { REVIEW_INTERVALS } from '../../config/constants.js';
import { Utils } from '../utils.js';

export function renderHojeView(container, charts) {
    const { studyCycle, currentCycleIndex } = dataManager.appData.settings;
    const nextSubject = studyCycle.length > 0 ? studyCycle[currentCycleIndex] : "Nenhuma matéria no ciclo";
    const today = new Date().toLocaleDateString('pt-BR');

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="card p-6 rounded-xl shadow-sm flex flex-col">
                        <h2 class="text-xl font-bold text-primary mb-4">Próxima Matéria</h2>
                        <div class="flex-grow flex flex-col items-center justify-center text-center">
                            <p class="text-3xl font-bold text-primary">${nextSubject}</p>
                            ${studyCycle.length > 0 ? 
                                `<button id="next-cycle-btn" class="mt-4 text-sm font-semibold" style="color: var(--accent-color);">
                                    Marcar como estudada e avançar
                                </button>` : 
                                '<p class="mt-2">Adicione matérias no Planejamento</p>'
                            }
                        </div>
                    </div>
                    <div class="card p-6 rounded-xl shadow-sm">
                        <h2 class="text-xl font-bold text-primary mb-4">Cronômetro</h2>
                        <div id="timer-idle">
                            <select id="timer-subject-select" class="w-full p-2 border rounded-md mb-4" 
                                style="background-color: var(--card-bg); border-color: var(--border-color);">
                            </select>
                            <button id="start-timer-btn" class="w-full btn-primary font-bold py-2 px-4 rounded-md">
                                Iniciar Sessão
                            </button>
                        </div>
                        <div id="timer-running" class="hidden text-center">
                            <p id="timer-subject-display" class="font-bold text-xl text-primary"></p>
                            <p id="timer-display" class="text-6xl font-bold my-4 text-primary">00:00:00</p>
                            <button id="stop-timer-btn" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md">
                                Parar e Registrar
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card p-6 rounded-xl shadow-sm">
                    <h2 class="text-xl font-bold text-primary mb-4">Foco do Dia (Revisões)</h2>
                    <div id="review-items" class="space-y-3 max-h-60 overflow-y-auto pr-2"></div>
                </div>
            </div>
            <div class="card p-6 rounded-xl shadow-sm flex flex-col">
                <h2 class="text-xl font-bold text-primary mb-4">Diário de Bordo - ${today}</h2>
                <form id="study-log-form" class="space-y-4 mb-4">
                    <input type="hidden" id="subject-input-log" value="">
                    <div>
                        <label for="time-input" class="block text-sm font-medium mb-1">Tempo (min)</label>
                        <input type="number" id="time-input" class="w-full p-2 border rounded-md" 
                            style="background-color: var(--card-bg); border-color: var(--border-color);" required>
                    </div>
                    <div>
                        <label for="notes-input" class="block text-sm font-medium mb-1">Anotações</label>
                        <textarea id="notes-input-log" rows="2" class="w-full p-2 border rounded-md" 
                            style="background-color: var(--card-bg); border-color: var(--border-color);"></textarea>
                    </div>
                    <button type="submit" class="w-full btn-primary font-bold py-2 px-4 rounded-md">
                        Registrar Manual
                    </button>
                </form>
                <div id="log-history" class="space-y-3 overflow-y-auto flex-grow pr-2"></div>
            </div>
        </div>`;

    bindHojeViewEvents();
    populateTimerSelect();
    renderReviewItems();
    renderLogHistory();
}

function bindHojeViewEvents() {
    const nextCycleBtn = document.getElementById('next-cycle-btn');
    if (nextCycleBtn) {
        nextCycleBtn.addEventListener('click', advanceCycle);
    }

    document.getElementById('start-timer-btn').addEventListener('click', startTimer);
    document.getElementById('stop-timer-btn').addEventListener('click', stopTimer);
    document.getElementById('study-log-form').addEventListener('submit', handleLogFormSubmit);
}

function populateTimerSelect() {
    const select = document.getElementById('timer-subject-select');
    const logSubjectInput = document.getElementById('subject-input-log');
    
    if (!select) return;

    const subjects = Object.keys(dataManager.appData.editalData);
    select.innerHTML = subjects.map(subject => 
        `<option value="${subject}">${subject}</option>`
    ).join('');

    if (logSubjectInput) {
        logSubjectInput.value = select.value;
    }

    select.addEventListener('change', (e) => {
        if (logSubjectInput) {
            logSubjectInput.value = e.target.value;
        }
    });
}

let timerInterval;
let timerStartTime;

function startTimer() {
    const subject = document.getElementById('timer-subject-select').value;
    if (!subject) return;

    document.getElementById('timer-idle').classList.add('hidden');
    document.getElementById('timer-running').classList.remove('hidden');
    document.getElementById('timer-subject-display').innerText = subject;

    timerStartTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
    const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
    document.getElementById('timer-display').innerText = Utils.formatTime(elapsed);
}

function stopTimer() {
    clearInterval(timerInterval);
    const subject = document.getElementById('timer-subject-display').innerText;
    const timeString = document.getElementById('timer-display').innerText.split(':');
    const duration = parseInt(timeString[0]) * 60 + parseInt(timeString[1]);

    if (duration > 0) {
        dataManager.addStudyLog({
            subject,
            duration,
            notes: 'Sessão do cronômetro'
        });
    }

    document.getElementById('timer-idle').classList.remove('hidden');
    document.getElementById('timer-running').classList.add('hidden');
    renderLogHistory();
}

function advanceCycle() {
    const { studyCycle, currentCycleIndex } = dataManager.appData.settings;
    if (studyCycle.length > 0) {
        const newIndex = (currentCycleIndex + 1) % studyCycle.length;
        dataManager.appData.settings.currentCycleIndex = newIndex;
        dataManager.saveData();
        
        // Re-render the view
        const hojeView = document.getElementById('hoje-view');
        if (hojeView) {
            renderHojeView(hojeView, {});
        }
    }
}

function handleLogFormSubmit(e) {
    e.preventDefault();
    const subject = document.getElementById('timer-subject-select').value;
    const duration = parseInt(document.getElementById('time-input').value);
    const notes = document.getElementById('notes-input-log').value;

    if (subject && duration > 0) {
        dataManager.addStudyLog({ subject, duration, notes });
        e.target.reset();
        renderLogHistory();
    }
}

function renderReviewItems() {
    const container = document.getElementById('review-items');
    if (!container) return;

    const topics = dataManager.getReviewTopics();
    if (topics.length === 0) {
        container.innerHTML = '<p class="text-center">Nenhuma revisão para hoje. Bom trabalho!</p>';
        return;
    }

    container.innerHTML = topics.map(item => `
        <div class="flex justify-between items-center p-2 rounded-md bg-gray-100 dark:bg-gray-800">
            <div>
                <p class="font-semibold text-primary">${item.topic.name}</p>
                <p class="text-sm">${item.subject}</p>
            </div>
            <button class="review-done-btn text-sm font-semibold p-2" 
                style="color: var(--accent-color);" 
                data-subject="${item.subject}" 
                data-index="${item.index}">
                Revisado
            </button>
        </div>
    `).join('');

    document.querySelectorAll('.review-done-btn').forEach(btn => {
        btn.addEventListener('click', handleReviewDone);
    });
}

function handleReviewDone(e) {
    const { subject, index } = e.currentTarget.dataset;
    const topic = dataManager.appData.editalData[subject].topics[index];
    
    topic.status = 'dominado';
    topic.reviewLevel++;
    
    if (topic.reviewLevel < REVIEW_INTERVALS.length) {
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + REVIEW_INTERVALS[topic.reviewLevel]);
        topic.nextReviewDate = nextReviewDate.toISOString();
    } else {
        topic.nextReviewDate = null;
    }
    
    dataManager.saveData();
    renderReviewItems();
}

function renderLogHistory() {
    const container = document.getElementById('log-history');
    if (!container) return;

    const todaysLogs = dataManager.getTodaysStudyLog();
    if (todaysLogs.length === 0) {
        container.innerHTML = `<p class="text-center">Nenhum estudo registrado hoje.</p>`;
        return;
    }

    container.innerHTML = todaysLogs.map(log => `
        <div class="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
            <div class="flex justify-between items-center">
                <p class="font-bold text-primary">${log.subject}</p>
                <span class="text-sm font-semibold">${log.duration} min</span>
            </div>
            <p class="text-xs mt-1">${log.notes}</p>
        </div>
    `).join('');
}