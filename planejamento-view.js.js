import { dataManager } from '../data-manager.js';
import { modalManager } from '../modals.js';
import { ICONS } from '../../config/icons.js';
import { Utils } from '../utils.js';

export function renderPlanejamentoView(container, charts) {
    const focusedDay = dataManager.appData.settings.plannerFocusedDay;
    
    if (focusedDay) {
        renderDayFocusView(container, focusedDay);
    } else {
        renderWeeklyPlannerView(container);
    }
}

function renderWeeklyPlannerView(container) {
    container.innerHTML = `
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div class="xl:col-span-2 card rounded-xl shadow-sm p-6">
                <h2 class="text-2xl font-bold text-primary mb-4">Planejador Semanal</h2>
                <div id="weekly-planner" class="grid grid-cols-7 gap-2"></div>
            </div>
            <div class="space-y-6">
                <div class="card rounded-xl shadow-sm p-6">
                    <h3 class="text-xl font-bold text-primary mb-4">Caixa de Tarefas</h3>
                    <div id="planner-tasks-pool" class="min-h-[150px] space-y-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md"></div>
                    <form id="add-planner-task-form" class="flex gap-2 mt-4">
                        <input type="text" id="new-planner-task-name" placeholder="Nova tarefa" 
                            class="flex-grow p-2 border rounded-md" 
                            style="background-color: var(--card-bg); border-color: var(--border-color);">
                        <button type="submit" class="btn-primary font-bold py-2 px-3 rounded-md">
                            Add
                        </button>
                    </form>
                </div>
                <div class="card rounded-xl shadow-sm p-6">
                   <h3 class="text-xl font-bold text-primary mb-4">Ciclo de Estudos</h3>
                   <div id="cycle-list-planner" class="space-y-2 mb-4"></div>
                   <button id="add-cycle-subject-btn-planner" class="w-full btn-primary font-bold py-2 px-4 rounded-md">
                        Adicionar Matéria
                   </button>
                </div>
            </div>
        </div>`;

    renderWeeklyPlanner();
    bindWeeklyPlannerEvents();
    renderCycleList();
}

function renderDayFocusView(container, dayKey) {
    const days = { 
        seg: "Segunda-feira", 
        ter: "Terça-feira", 
        qua: "Quarta-feira", 
        qui: "Quinta-feira", 
        sex: "Sexta-feira", 
        sab: "Sábado", 
        dom: "Domingo" 
    };
    
    container.innerHTML = `
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div class="xl:col-span-3 card rounded-xl shadow-sm p-6">
                <h2 class="text-2xl font-bold text-primary mb-4">Horários - ${days[dayKey]}</h2>
                <div id="day-focus-planner" class="relative"></div>
            </div>
            <div class="card rounded-xl shadow-sm p-6">
                <h3 class="text-xl font-bold text-primary mb-4">Caixa de Tarefas</h3>
                <div id="planner-tasks-pool-day" class="min-h-[150px] space-y-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md"></div>
                <form id="add-planner-task-form-day" class="flex gap-2 mt-4">
                    <input type="text" id="new-planner-task-name-day" placeholder="Nova tarefa" 
                        class="flex-grow p-2 border rounded-md" 
                        style="background-color: var(--card-bg); border-color: var(--border-color);">
                    <button type="submit" class="btn-primary font-bold py-2 px-3 rounded-md">
                        Add
                    </button>
                </form>
            </div>
        </div>`;
    
    renderDaySchedule(dayKey);
    bindDayFocusEvents(dayKey);
}

function renderWeeklyPlanner() {
    const plannerContainer = document.getElementById('weekly-planner');
    const tasksPoolContainer = document.getElementById('planner-tasks-pool');
    
    if (!plannerContainer || !tasksPoolContainer) return;
    
    const days = { 
        seg: "Seg", 
        ter: "Ter", 
        qua: "Qua", 
        qui: "Qui", 
        sex: "Sex", 
        sab: "Sáb", 
        dom: "Dom" 
    };

    plannerContainer.innerHTML = Object.keys(days).map(dayKey => `
        <div class="flex flex-col">
            <h4 class="font-bold text-center text-primary mb-2 cursor-pointer day-header" data-day="${dayKey}">
                ${days[dayKey]}
            </h4>
            <div class="day-column min-h-[300px] bg-gray-100 dark:bg-gray-800 p-2 rounded-md space-y-2" data-day="${dayKey}"></div>
        </div>
    `).join('');
    
    const renderTask = (task) => `
        <div class="planner-task flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded-lg shadow" data-id="${task.id}">
            <span class="task-text flex-grow cursor-pointer">${task.text}</span>
            <button class="delete-task-btn p-1 text-gray-400 hover:text-red-500 ml-2">
                ${ICONS.trash}
            </button>
        </div>
    `;

    const allScheduledTaskIds = Object.values(dataManager.appData.weeklyPlanner.schedule).flat();
    tasksPoolContainer.innerHTML = dataManager.appData.weeklyPlanner.tasks
        .filter(task => !allScheduledTaskIds.includes(task.id))
        .map(renderTask).join('');

    Object.keys(days).forEach(dayKey => {
        const dayColumn = plannerContainer.querySelector(`[data-day="${dayKey}"]`);
        const scheduledTasks = dataManager.appData.weeklyPlanner.schedule[dayKey] || [];
        dayColumn.innerHTML = scheduledTasks.map(taskId => {
            const task = dataManager.appData.weeklyPlanner.tasks.find(t => t.id === taskId);
            return task ? renderTask(task) : '';
        }).join('');
    });
    
    initializeSortable();
    bindTaskEvents();
}

function renderDaySchedule(dayKey) {
    const container = document.getElementById('day-focus-planner');
    const tasksPoolContainer = document.getElementById('planner-tasks-pool-day');
    
    if (!container || !tasksPoolContainer) return;

    let hoursHTML = '';
    for (let i = 6; i <= 22; i++) {
        hoursHTML += `
            <div class="h-12 border-t relative" style="border-color: var(--border-color);">
                <span class="absolute -top-2 -left-8 text-xs">
                    ${String(i).padStart(2, '0')}:00
                </span>
            </div>`;
    }
    container.innerHTML = `<div class="pl-8 pt-2">${hoursHTML}</div>`;
    
    const renderTask = (task) => `
        <div class="planner-task flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded-lg shadow" data-id="${task.id}">
            <span class="task-text flex-grow cursor-pointer">${task.text}</span>
            <button class="delete-task-btn p-1 text-gray-400 hover:text-red-500 ml-2">
                ${ICONS.trash}
            </button>
        </div>
    `;
    
    const scheduledTasksOnOtherDays = Object.entries(dataManager.appData.weeklyPlanner.schedule)
        .filter(([day]) => day !== dayKey)
        .flatMap(([, taskIds]) => taskIds);

    tasksPoolContainer.innerHTML = dataManager.appData.weeklyPlanner.tasks
        .filter(task => !scheduledTasksOnOtherDays.includes(task.id))
        .map(renderTask).join('');

    bindTaskEvents();
}

function initializeSortable() {
    const tasksPoolContainer = document.getElementById('planner-tasks-pool');
    const dayColumns = document.querySelectorAll('.day-column');
    
    if (tasksPoolContainer && window.Sortable) {
        new Sortable(tasksPoolContainer, {
            group: 'planner',
            animation: 150,
            onEnd: updatePlannerData
        });
    }

    dayColumns.forEach(col => {
        if (window.Sortable) {
            new Sortable(col, {
                group: 'planner',
                animation: 150,
                onEnd: updatePlannerData
            });
        }
    });
}

function bindWeeklyPlannerEvents() {
    document.getElementById('add-planner-task-form').addEventListener('submit', handleAddPlannerTask);
    document.getElementById('add-cycle-subject-btn-planner').addEventListener('click', showAddCycleSubjectModal);
    
    document.querySelectorAll('.day-header').forEach(header => {
        header.addEventListener('click', (e) => {
            dataManager.appData.settings.plannerFocusedDay = e.currentTarget.dataset.day;
            dataManager.saveData();
            
            // Re-render the view
            const planejamentoView = document.getElementById('planejamento-view');
            if (planejamentoView) {
                renderPlanejamentoView(planejamentoView, {});
            }
        });
    });
}

function bindDayFocusEvents(dayKey) {
    document.getElementById('add-planner-task-form-day').addEventListener('submit', handleAddPlannerTask);
}

function bindTaskEvents() {
    document.querySelectorAll('.delete-task-btn').forEach(btn => {
        btn.addEventListener('click', handleDeletePlannerTask);
    });
    
    document.querySelectorAll('.task-text').forEach(span => {
        span.addEventListener('click', handleEditPlannerTask);
    });
}

function updatePlannerData() {
    const newSchedule = {};
    document.querySelectorAll('.day-column').forEach(col => {
        const day = col.dataset.day;
        const taskIds = Array.from(col.children).map(taskEl => parseInt(taskEl.dataset.id));
        newSchedule[day] = taskIds;
    });
    
    dataManager.appData.weeklyPlanner.schedule = newSchedule;
    dataManager.saveData();
}

function handleAddPlannerTask(e) {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    const text = input.value.trim();
    
    if (text) {
        const newId = Date.now();
        dataManager.appData.weeklyPlanner.tasks.push({ id: newId, text, duration: 60 });
        dataManager.saveData();
        
        if (dataManager.appData.settings.plannerFocusedDay) {
            renderDaySchedule(dataManager.appData.settings.plannerFocusedDay);
        } else {
            renderWeeklyPlanner();
        }
        
        input.value = '';
    }
}

function handleDeletePlannerTask(e) {
    const taskEl = e.currentTarget.closest('.planner-task');
    const taskId = parseInt(taskEl.dataset.id);
    
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
        dataManager.appData.weeklyPlanner.tasks = dataManager.appData.weeklyPlanner.tasks.filter(t => t.id !== taskId);
        
        for (const day in dataManager.appData.weeklyPlanner.schedule) {
            dataManager.appData.weeklyPlanner.schedule[day] = 
                dataManager.appData.weeklyPlanner.schedule[day].filter(id => id !== taskId);
        }
        
        dataManager.saveData();
        
        if (dataManager.appData.settings.plannerFocusedDay) {
            renderDaySchedule(dataManager.appData.settings.plannerFocusedDay);
        } else {
            renderWeeklyPlanner();
        }
    }
}

function handleEditPlannerTask(e) {
    const span = e.currentTarget;
    const taskEl = span.closest('.planner-task');
    const taskId = parseInt(taskEl.dataset.id);
    const currentText = span.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'w-full bg-transparent text-primary';
    
    span.replaceWith(input);
    input.focus();

    const saveEdit = () => {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
            const task = dataManager.appData.weeklyPlanner.tasks.find(t => t.id === taskId);
            if (task) {
                task.text = newText;
                dataManager.saveData();
            }
        }
        
        if (dataManager.appData.settings.plannerFocusedDay) {
            renderDaySchedule(dataManager.appData.settings.plannerFocusedDay);
        } else {
            renderWeeklyPlanner();
        }
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
        }
    });
}

function renderCycleList() {
    const container = document.getElementById('cycle-list-planner');
    if (!container) return;
    
    if (dataManager.appData.settings.studyCycle.length === 0) {
        container.innerHTML = `<p class="text-center">Seu ciclo está vazio.</p>`;
        return;
    }
    
    container.innerHTML = dataManager.appData.settings.studyCycle.map((subject, index) => `
        <div class="flex justify-between items-center p-2 rounded-md 
            ${index === dataManager.appData.settings.currentCycleIndex ? 
                'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-gray-100 dark:bg-gray-800'}">
            <span class="font-semibold text-primary">${index + 1}. ${subject}</span>
            <button class="remove-cycle-btn p-1 text-red-500" data-index="${index}">
                ${ICONS.trash}
            </button>
        </div>
    `).join('');
    
    document.querySelectorAll('.remove-cycle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            dataManager.appData.settings.studyCycle.splice(e.currentTarget.dataset.index, 1);
            dataManager.saveData();
            renderCycleList();
        });
    });
}

function showAddCycleSubjectModal() {
    const options = Object.keys(dataManager.appData.editalData)
        .filter(s => !dataManager.appData.settings.studyCycle.includes(s));
    
    if (options.length === 0) {
        return;
    }
    
    const content = `
        <div class="card rounded-xl p-6 w-11/12 max-w-lg">
            <h2 class="text-xl font-bold text-primary mb-4">Adicionar Matéria ao Ciclo</h2>
            <select id="cycle-subject-select" class="w-full p-2 border rounded-md mb-4" 
                style="background-color: var(--card-bg); border-color: var(--border-color);">
                ${options.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
            <div class="flex justify-end gap-2">
                <button id="cancel-add-cycle" class="font-bold py-2 px-4 rounded-md">
                    Cancelar
                </button>
                <button id="confirm-add-cycle" class="btn-primary font-bold py-2 px-4 rounded-md">
                    Adicionar
                </button>
            </div>
        </div>`;
    
    modalManager.open(content);
    
    document.getElementById('cancel-add-cycle').addEventListener('click', () => modalManager.close());
    document.getElementById('confirm-add-cycle').addEventListener('click', () => {
        const subject = document.getElementById('cycle-subject-select').value;
        dataManager.appData.settings.studyCycle.push(subject);
        dataManager.saveData();
        renderCycleList();
        modalManager.close();
    });
}