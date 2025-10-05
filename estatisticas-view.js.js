import { dataManager } from '../data-manager.js';

export function renderEstatisticasView(container, charts) {
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card p-6 rounded-xl shadow-sm">
                <h2 class="text-xl font-bold text-primary mb-4">Estudo na Semana (min)</h2>
                <canvas id="weeklyChartCanvas"></canvas>
            </div>
            <div class="card p-6 rounded-xl shadow-sm">
                <h2 class="text-xl font-bold text-primary mb-4">Evolução nos Simulados (%)</h2>
                <canvas id="mockExamsChartCanvas"></canvas>
            </div>
            <div class="lg:col-span-2 card p-6 rounded-xl shadow-sm">
                <h2 class="text-xl font-bold text-primary mb-4">Progresso por Matéria</h2>
                <canvas id="subjectsChartCanvas"></canvas>
            </div>
            <div class="lg:col-span-2 card p-6 rounded-xl shadow-sm">
                <h2 class="text-xl font-bold text-primary mb-4">Tópicos para Focar (Pontos Fracos)</h2>
                <div id="weak-points-list"></div>
            </div>
        </div>`;
    
    // Use setTimeout to ensure DOM is ready for charts
    setTimeout(() => {
        renderWeeklyChart(charts);
        renderMockExamsChart(charts);
        renderSubjectsChart(charts);
        renderWeakPointsList();
    }, 0);
}

function renderWeeklyChart(charts) {
    const ctx = document.getElementById('weeklyChartCanvas');
    if (!ctx) return;
    
    const today = new Date();
    const labels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - i);
        return d.toLocaleDateString('pt-BR', { weekday: 'short' });
    }).reverse();

    const data = Array(7).fill(0);
    dataManager.appData.studyLog.forEach(log => {
        const logDate = new Date(log.date);
        const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
            data[6 - diffDays] += log.duration;
        }
    });

    charts.weekly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Minutos Estudados',
                data,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderMockExamsChart(charts) {
    const ctx = document.getElementById('mockExamsChartCanvas');
    if (!ctx || !dataManager.appData.mockExams || dataManager.appData.mockExams.length === 0) return;
    
    const sortedExams = [...dataManager.appData.mockExams].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    const labels = sortedExams.map(e => e.name);
    const data = sortedExams.map(e => (e.correct / e.total) * 100);

    charts.mock = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: '% de Acerto',
                data,
                borderColor: 'rgba(79, 70, 229, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderSubjectsChart(charts) {
    const ctx = document.getElementById('subjectsChartCanvas');
    if (!ctx) return;
    
    const labels = Object.keys(dataManager.appData.editalData);
    const data = labels.map(subject => {
        const topics = dataManager.appData.editalData[subject].topics;
        if (topics.length === 0) return 0;
        const completed = topics.filter(t => t.status === 'dominado').length;
        return (completed / topics.length) * 100;
    });

    charts.subjects = new Chart(ctx, {
        type: 'radar',
        data: {
            labels,
            datasets: [{
                label: '% Concluído',
                data,
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        backdropColor: 'transparent'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderWeakPointsList() {
    const container = document.getElementById('weak-points-list');
    if (!container) return;
    
    let allTopics = [];
    for (const subject in dataManager.appData.editalData) {
        dataManager.appData.editalData[subject].topics.forEach(topic => {
            if (topic.questions_total >= 10) {
                allTopics.push({
                    ...topic,
                    subject,
                    performance: topic.questions_correct / topic.questions_total
                });
            }
        });
    }
    
    const weakTopics = allTopics
        .filter(t => t.performance < 0.75)
        .sort((a, b) => a.performance - b.performance)
        .slice(0, 5);
    
    if (weakTopics.length === 0) {
        container.innerHTML = `
            <p class="text-center">
                Nenhum ponto fraco detectado (resolva pelo menos 10 questões por tópico).
            </p>`;
        return;
    }
    
    container.innerHTML = weakTopics.map(topic => `
        <div class="flex justify-between items-center p-2 border-b" style="border-color: var(--border-color);">
            <div>
                <p class="font-semibold text-primary">${topic.name}</p>
                <p class="text-sm">${topic.subject}</p>
            </div>
            <span class="font-bold text-red-500">${(topic.performance * 100).toFixed(0)}%</span>
        </div>
    `).join('');
}