import { dataManager } from '../data-manager.js';
import { modalManager } from '../modals.js';
import { ICONS } from '../../config/icons.js';
import { REVIEW_INTERVALS } from '../../config/constants.js';
import { Utils } from '../utils.js';

export function renderEditalView(container, charts) {
    const viewType = dataManager.appData.settings.editalView;
    
    if (viewType === 'lista') {
        renderListView(container);
    } else {
        renderVerticalView(container);
    }
}

function renderListView(container) {
    container.innerHTML = `<div class="space-y-4" id="edital-container"></div>`;
    const editalContainer = document.getElementById('edital-container');
    const editingSubject = dataManager.appData.settings.editingSubject;

    for (const subject in dataManager.appData.editalData) {
        const subjectId = subject.replace(/[^a-zA-Z0-9]/g, '');
        const isEditing = editingSubject === subject;

        const accordion = document.createElement('div');
        accordion.className = 'card rounded-xl shadow-sm overflow-hidden';
        accordion.innerHTML = `
            <div class="w-full text-left p-4 flex justify-between items-center">
                <h2 class="text-xl font-bold text-primary">${subject}</h2>
                <div class="flex items-center gap-2">
                   ${isEditing ? 
                       `<button class="done-editing-btn text-sm font-semibold py-1 px-3 rounded-md" 
                           style="color: var(--accent-color);" data-subject="${subject}">
                            Concluir
                        </button>` :
                       `<button class="edit-subject-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" 
                           data-subject="${subject}">
                            ${ICONS.edit}
                        </button>`
                   }
                    <button class="topic-accordion-trigger p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" 
                        data-target="${subjectId}">
                        ${ICONS.chevron}
                    </button>
                </div>
            </div>
            <div id="${subjectId}" class="topic-accordion-content">
                <div class="py-2" id="topic-list-${subjectId}">
                    ${renderTopicList(subject, isEditing)}
                </div>
                ${isEditing ? `
                    <div class="p-4 border-t" style="border-color: var(--border-color);">
                        <form class="add-topic-form flex gap-2" data-subject="${subject}">
                            <input type="text" placeholder="Nome do novo tópico" 
                                class="new-topic-name flex-grow p-2 border rounded-md" 
                                style="background-color: var(--card-bg); border-color: var(--border-color);">
                            <button type="submit" class="btn-primary font-bold py-2 px-4 rounded-md">
                                Adicionar
                            </button>
                        </form>
                    </div>
                ` : ''}
            </div>`;
        editalContainer.appendChild(accordion);
    }

    bindListViewEvents(editalContainer);
}

function renderTopicList(subject, isEditing) {
    return dataManager.appData.editalData[subject].topics.map((topic, index) => {
        const topicId = `${subject.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
        const performance = topic.questions_total > 0 ? 
            `${((topic.questions_correct / topic.questions_total) * 100).toFixed(0)}%` : 'N/A';
        
        return `
        <div class="border-b" style="border-color: var(--border-color);">
            <div class="topic-item flex items-center justify-between py-3 px-4">
                <span class="flex-grow pr-4 cursor-pointer topic-details-trigger" 
                    data-target="${topicId}-details">
                    ${topic.name}
                </span>
                <div class="flex items-center gap-2 ml-4 flex-shrink-0">
                    ${isEditing ? 
                        `<button class="delete-topic-btn p-1 text-red-500 hover:text-red-700" 
                            data-subject="${subject}" data-index="${index}">
                            ${ICONS.trash}
                        </button>` :
                        `<div class="flex items-center gap-2">
                            <button class="status-btn p-1 rounded-full ${topic.status === 'nao_estudado' ? 'ring-2' : ''}" 
                                style="ring-color: var(--accent-color);" title="Não Estudado" 
                                data-subject="${subject}" data-index="${index}" data-status="nao_estudado">
                                ${ICONS.nao_estudado}
                            </button>
                            <button class="status-btn p-1 rounded-full ${topic.status === 'estudando' ? 'ring-2' : ''}" 
                                style="ring-color: var(--accent-color);" title="Estudando" 
                                data-subject="${subject}" data-index="${index}" data-status="estudando">
                                ${ICONS.estudando}
                            </button>
                            <button class="status-btn p-1 rounded-full ${topic.status === 'revisar' ? 'ring-2' : ''}" 
                                style="ring-color: var(--accent-color);" title="Revisar" 
                                data-subject="${subject}" data-index="${index}" data-status="revisar">
                                ${ICONS.revisar}
                            </button>
                            <button class="status-btn p-1 rounded-full ${topic.status === 'dominado' ? 'ring-2' : ''}" 
                                style="ring-color: var(--accent-color);" title="Dominado" 
                                data-subject="${subject}" data-index="${index}" data-status="dominado">
                                ${ICONS.dominado}
                            </button>
                        </div>`
                    }
                </div>
            </div>
            <div id="${topicId}-details" class="topic-details-content px-4 pb-4">
                <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 class="font-bold text-primary mb-2">Desempenho & Anotações</h4>
                    <form class="questions-form space-y-2 mb-4" data-subject="${subject}" data-index="${index}">
                        <div class="flex gap-4">
                            <div class="flex-1">
                                <label class="text-xs">Questões</label>
                                <input type="number" value="${topic.questions_total}" 
                                    class="questions-total-input w-full p-1 border rounded-md" 
                                    style="background-color: var(--card-bg); border-color: var(--border-color);">
                            </div>
                            <div class="flex-1">
                                <label class="text-xs">Acertos</label>
                                <input type="number" value="${topic.questions_correct}" 
                                    class="questions-correct-input w-full p-1 border rounded-md" 
                                    style="background-color: var(--card-bg); border-color: var(--border-color);">
                            </div>
                            <div class="flex-1">
                                <label class="text-xs">Aproveitamento</label>
                                <div class="w-full p-1 font-bold text-primary">${performance}</div>
                            </div>
                        </div>
                    </form>
                    <div>
                        <label class="text-xs">Caderno de Erros / Anotações</label>
                        <textarea class="topic-notes-area w-full p-2 border rounded-md" 
                            style="background-color: var(--card-bg); border-color: var(--border-color);" 
                            rows="3" data-subject="${subject}" data-index="${index}">${topic.notes}</textarea>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function bindListViewEvents(container) {
    container.querySelectorAll('.topic-accordion-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            Utils.toggleAccordion(e, `#${e.currentTarget.dataset.target}`);
        });
    });

    container.querySelectorAll('.edit-subject-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            dataManager.appData.settings.editingSubject = e.currentTarget.dataset.subject;
            renderListView(container.parentElement);
        });
    });

    container.querySelectorAll('.done-editing-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            dataManager.appData.settings.editingSubject = null;
            renderListView(container.parentElement);
        });
    });

    container.querySelectorAll('.add-topic-form').forEach(form => {
        form.addEventListener('submit', handleAddTopic);
    });

    container.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', handleStatusChange);
    });

    container.querySelectorAll('.delete-topic-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteTopic);
    });

    container.querySelectorAll('.topic-details-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            Utils.toggleAccordion(e, `#${e.currentTarget.dataset.target}`);
        });
    });

    container.querySelectorAll('.questions-form input').forEach(input => {
        input.addEventListener('change', handleQuestionsChange);
    });

    container.querySelectorAll('.topic-notes-area').forEach(textarea => {
        textarea.addEventListener('input', Utils.debounce(handleNotesChange, 500));
    });
}

function renderVerticalView(container) {
    container.innerHTML = `
        <div class="card rounded-xl shadow-sm p-4 overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="border-b" style="border-color: var(--border-color);">
                    <tr>
                        <th class="p-2 min-w-[200px]">Matéria</th>
                        <th class="p-2 min-w-[300px]">Tópico</th>
                        <th class="p-2 text-center">Status</th>
                        <th class="p-2 text-center">% Acerto</th>
                        <th class="p-2 text-center">Próx. Revisão</th>
                        <th class="p-2 text-center">Anotações</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`;
    
    const tbody = container.querySelector('tbody');
    
    for (const subject in dataManager.appData.editalData) {
        dataManager.appData.editalData[subject].topics.forEach((topic, index) => {
            const performance = topic.questions_total > 0 ? 
                `${((topic.questions_correct / topic.questions_total) * 100).toFixed(0)}%` : '-';
            const nextReview = topic.nextReviewDate ? 
                new Date(topic.nextReviewDate).toLocaleDateString('pt-BR') : '-';
            
            const tr = document.createElement('tr');
            tr.className = "border-b";
            tr.style.borderColor = 'var(--border-color)';
            tr.innerHTML = `
                <td class="p-2 font-semibold text-primary">${subject}</td>
                <td class="p-2">${topic.name}</td>
                <td class="p-2">
                    <div class="flex justify-center items-center status-btn-group" 
                        data-subject="${subject}" data-index="${index}">
                        ${renderStatusIcons(topic.status)}
                    </div>
                </td>
                <td class="p-2 text-center font-semibold text-primary">${performance}</td>
                <td class="p-2 text-center">${nextReview}</td>
                <td class="p-2 text-center">
                    <button class="notes-btn p-1 text-2xl" data-subject="${subject}" data-index="${index}">
                        ${topic.notes ? '🗒️' : '📝'}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    bindVerticalViewEvents(tbody);
}

function renderStatusIcons(currentStatus) {
    const statuses = ['nao_estudado', 'estudando', 'revisar', 'dominado'];
    return statuses.map(status => `
        <button class="status-icon-btn p-1 rounded-full ${status === currentStatus ? 'ring-2' : ''}" 
            style="ring-color: var(--accent-color);" title="${status.replace('_', ' ')}" 
            data-status="${status}">
            ${ICONS[status]}
        </button>
    `).join('');
}

function bindVerticalViewEvents(container) {
    container.querySelectorAll('.status-btn-group').forEach(group => {
        group.addEventListener('click', handleVerticalStatusChange);
    });

    container.querySelectorAll('.notes-btn').forEach(btn => {
        btn.addEventListener('click', handleNotesModal);
    });
}

function handleVerticalStatusChange(e) {
    const btn = e.target.closest('.status-icon-btn');
    if (!btn) return;
    
    const group = e.currentTarget;
    const { subject, index } = group.dataset;
    const { status } = btn.dataset;
    
    handleStatusChange({ currentTarget: { dataset: { subject, index, status } } });
    group.innerHTML = renderStatusIcons(status);
}

function handleStatusChange(e) {
    const { subject, index, status } = e.currentTarget.dataset;
    const topic = dataManager.appData.editalData[subject].topics[index];
    
    topic.status = status;
    
    if (status === 'dominado') {
        if (topic.reviewLevel < REVIEW_INTERVALS.length) {
            const nextReviewDate = new Date();
            nextReviewDate.setDate(nextReviewDate.getDate() + REVIEW_INTERVALS[topic.reviewLevel]);
            topic.nextReviewDate = nextReviewDate.toISOString();
        }
    } else {
        topic.reviewLevel = 0;
        topic.nextReviewDate = null;
    }
    
    dataManager.saveData();
    
    const subjectId = subject.replace(/[^a-zA-Z0-9]/g, '');
    const topicListContainer = document.getElementById(`topic-list-${subjectId}`);
    if (topicListContainer) {
        const isEditing = dataManager.appData.settings.editingSubject === subject;
        topicListContainer.innerHTML = renderTopicList(subject, isEditing);
        bindListViewEvents(topicListContainer.parentElement);
    }
}

function handleAddTopic(e) {
    e.preventDefault();
    const subject = e.currentTarget.dataset.subject;
    const input = e.currentTarget.querySelector('.new-topic-name');
    const newTopicName = input.value.trim();
    
    if (newTopicName && subject) {
        dataManager.appData.editalData[subject].topics.push({
            name: newTopicName,
            status: 'nao_estudado',
            reviewLevel: 0,
            nextReviewDate: null,
            notes: '',
            questions_total: 0,
            questions_correct: 0
        });
        
        dataManager.saveData();
        renderListView(document.getElementById('edital-view'));
    }
}

function handleDeleteTopic(e) {
    const { subject, index } = e.currentTarget.dataset;
    const topicName = dataManager.appData.editalData[subject].topics[index].name;
    
    if (confirm(`Tem certeza que deseja deletar este tópico?\n\n"${topicName}"`)) {
        dataManager.appData.editalData[subject].topics.splice(index, 1);
        dataManager.saveData();
        renderListView(document.getElementById('edital-view'));
    }
}

function handleQuestionsChange(e) {
    const form = e.currentTarget.closest('form');
    const { subject, index } = form.dataset;
    const total = form.querySelector('.questions-total-input').value;
    const correct = form.querySelector('.questions-correct-input').value;
    
    dataManager.appData.editalData[subject].topics[index].questions_total = parseInt(total) || 0;
    dataManager.appData.editalData[subject].topics[index].questions_correct = parseInt(correct) || 0;
    dataManager.saveData();
    
    const performanceEl = form.querySelector('.font-bold.text-primary');
    const topic = dataManager.appData.editalData[subject].topics[index];
    performanceEl.textContent = topic.questions_total > 0 ? 
        `${((topic.questions_correct / topic.questions_total) * 100).toFixed(0)}%` : 'N/A';
}

function handleNotesChange(e) {
    const { subject, index } = e.currentTarget.dataset;
    dataManager.appData.editalData[subject].topics[index].notes = e.currentTarget.value;
    dataManager.saveData();
}

function handleNotesModal(e) {
    const { subject, index } = e.currentTarget.dataset;
    const topic = dataManager.appData.editalData[subject].topics[index];
    
    const content = `
        <div class="card rounded-xl p-6 w-11/12 max-w-2xl">
            <h2 class="text-xl font-bold text-primary mb-2">${topic.name}</h2>
            <p class="text-sm mb-4">${subject}</p>
            <textarea id="modal-notes-area" class="w-full p-2 border rounded-md" 
                style="background-color: var(--card-bg); border-color: var(--border-color);" 
                rows="10">${topic.notes}</textarea>
            <div class="flex justify-end gap-2 mt-4">
                <button id="save-notes-btn" class="btn-primary font-bold py-2 px-4 rounded-md">
                    Salvar e Fechar
                </button>
            </div>
        </div>`;
    
    modalManager.open(content);
    
    document.getElementById('save-notes-btn').addEventListener('click', () => {
        topic.notes = document.getElementById('modal-notes-area').value;
        dataManager.saveData();
        modalManager.close();
        renderVerticalView(document.getElementById('edital-view'));
    });
}

// Event listener for manage subjects modal
window.addEventListener('openManageSubjectsModal', renderManageSubjectsModal);

function renderManageSubjectsModal() {
    let subjectListHTML = Object.keys(dataManager.appData.editalData).map(subject => `
        <div class="flex items-center justify-between p-2 border-b" style="border-color: var(--border-color);">
            <input type="text" value="${subject}" class="edit-subject-input flex-grow bg-transparent text-primary" 
                data-original="${subject}">
            <button class="delete-subject-btn p-1 text-red-500 hover:text-red-700" data-subject="${subject}">
                ${ICONS.trash}
            </button>
        </div>
    `).join('');

    const content = `
        <div class="card rounded-xl p-6 w-11/12 max-w-lg relative">
            <h2 class="text-xl font-bold text-primary mb-4">Gerenciar Matérias</h2>
            <div class="space-y-2 mb-4 max-h-60 overflow-y-auto">${subjectListHTML}</div>
            <form id="add-subject-form" class="flex gap-2 mb-4">
                <input type="text" id="new-subject-name" placeholder="Nova matéria" 
                    class="flex-grow p-2 border rounded-md" 
                    style="background-color: var(--card-bg); border-color: var(--border-color);">
                <button type="submit" class="btn-primary font-bold py-2 px-4 rounded-md">
                    Adicionar
                </button>
            </form>
            <div class="flex justify-end gap-2">
                <button id="cancel-manage-subjects" class="font-bold py-2 px-4 rounded-md">
                    Cancelar
                </button>
                <button id="save-manage-subjects" class="btn-primary font-bold py-2 px-4 rounded-md">
                    Salvar e Fechar
                </button>
            </div>
        </div>`;
    
    modalManager.open(content);
    
    document.getElementById('cancel-manage-subjects').addEventListener('click', () => modalManager.close());
    document.getElementById('save-manage-subjects').addEventListener('click', handleSaveSubjects);
    document.getElementById('add-subject-form').addEventListener('submit', handleAddSubject);
    
    document.querySelectorAll('.delete-subject-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.currentTarget.parentElement.remove();
        });
    });
}

function handleAddSubject(e) {
    e.preventDefault();
    const input = e.currentTarget.querySelector('#new-subject-name');
    const newName = input.value.trim();
    const list = e.currentTarget.previousElementSibling;
    const existingNames = Array.from(list.querySelectorAll('.edit-subject-input')).map(i => i.value);
    
    if (newName && !existingNames.includes(newName)) {
        list.innerHTML += `
            <div class="flex items-center justify-between p-2 border-b" style="border-color: var(--border-color);">
                <input type="text" value="${newName}" class="edit-subject-input flex-grow bg-transparent text-primary" 
                    data-original="${newName}">
                <button class="delete-subject-btn p-1 text-red-500 hover:text-red-700" data-subject="${newName}">
                    ${ICONS.trash}
                </button>
            </div>`;
        
        list.querySelector('.delete-subject-btn:last-of-type').addEventListener('click', (ev) => {
            ev.currentTarget.parentElement.remove();
        });
        
        input.value = '';
    } else if (existingNames.includes(newName)) {
        alert('Matéria já existe.');
    }
}

function handleSaveSubjects() {
    const newEditalData = {};
    let hasError = false;
    
    document.querySelectorAll('.edit-subject-input').forEach(input => {
        const originalName = input.dataset.original;
        const newName = input.value.trim();
        
        if (newName && !newEditalData[newName]) {
            newEditalData[newName] = dataManager.appData.editalData[originalName] || { topics: [] };
        } else {
            alert(`Nome de matéria inválido ou duplicado: "${newName}"`);
            hasError = true;
        }
    });

    if (!hasError) {
        dataManager.appData.editalData = newEditalData;
        dataManager.saveData();
        modalManager.close();
        
        // Re-render the edital view
        const editalView = document.getElementById('edital-view');
        if (editalView) {
            renderEditalView(editalView, {});
        }
    }
}