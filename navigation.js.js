import { PAGE_CONFIG } from '../config/constants.js';
import { dataManager } from './data-manager.js';
import { renderHojeView } from './views/hoje-view.js';
import { renderEditalView } from './views/edital-view.js';
import { renderPlanejamentoView } from './views/planejamento-view.js';
import { renderEstatisticasView } from './views/estatisticas-view.js';
import { renderConquistasView } from './views/conquistas-view.js';

export class NavigationManager {
    constructor() {
        this.activeView = 'hoje';
        this.charts = {};
        this.dom = {
            pageTitle: document.getElementById('page-title'),
            pageSubtitle: document.getElementById('page-subtitle'),
            headerActions: document.getElementById('header-actions'),
            views: {
                hoje: document.getElementById('hoje-view'),
                edital: document.getElementById('edital-view'),
                planejamento: document.getElementById('planejamento-view'),
                estatisticas: document.getElementById('estatisticas-view'),
                conquistas: document.getElementById('conquistas-view'),
            },
            nav: {
                hoje: document.getElementById('nav-hoje'),
                edital: document.getElementById('nav-edital'),
                planejamento: document.getElementById('nav-planejamento'),
                estatisticas: document.getElementById('nav-estatisticas'),
                conquistas: document.getElementById('nav-conquistas'),
            }
        };
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        Object.values(this.dom.nav).forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });
    }

    handleNavigation(e, targetView = null) {
        dataManager.appData.settings.editingSubject = null;
        dataManager.appData.settings.plannerFocusedDay = null;

        if (!targetView) {
            targetView = e.currentTarget.id.replace('nav-', '');
        }
        
        this.activeView = targetView;
        this.updateNavigation();
        this.updatePageHeader();
        this.renderHeaderActions();
        this.renderActiveView();
    }

    updateNavigation() {
        Object.values(this.dom.nav).forEach(btn => btn.classList.remove('active'));
        this.dom.nav[this.activeView].classList.add('active');
        
        Object.values(this.dom.views).forEach(view => view.classList.remove('active'));
        this.dom.views[this.activeView].classList.add('active');
    }

    updatePageHeader() {
        const config = PAGE_CONFIG[this.activeView];
        this.dom.pageTitle.innerText = config.title;
        this.dom.pageSubtitle.innerText = config.subtitle;
    }

    renderHeaderActions() {
        this.dom.headerActions.innerHTML = '';
        
        if (this.activeView === 'edital') {
            this.renderEditalHeaderActions();
        } else if (this.activeView === 'planejamento' && dataManager.appData.settings.plannerFocusedDay) {
            this.renderPlannerHeaderActions();
        }
    }

    renderEditalHeaderActions() {
        const view = dataManager.appData.settings.editalView;
        this.dom.headerActions.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="flex items-center p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <button class="edital-view-toggle text-sm font-semibold py-1 px-3 rounded-md ${view === 'lista' ? 'bg-white dark:bg-gray-800 shadow' : ''}" data-view="lista">Lista</button>
                    <button class="edital-view-toggle text-sm font-semibold py-1 px-3 rounded-md ${view === 'vertical' ? 'bg-white dark:bg-gray-800 shadow' : ''}" data-view="vertical">Vertical</button>
                </div>
                <button id="manage-subjects-btn" class="btn-primary font-bold py-2 px-4 rounded-md flex items-center gap-2">Gerenciar Matérias</button>
            </div>`;

        document.getElementById('manage-subjects-btn').addEventListener('click', () => {
            // This will be implemented in edital-view.js
            window.dispatchEvent(new CustomEvent('openManageSubjectsModal'));
        });

        document.querySelectorAll('.edital-view-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                dataManager.appData.settings.editalView = e.currentTarget.dataset.view;
                dataManager.saveData();
                this.renderHeaderActions();
                this.renderActiveView();
            });
        });
    }

    renderPlannerHeaderActions() {
        this.dom.headerActions.innerHTML = `
            <button id="back-to-week-btn" class="font-bold py-2 px-4 rounded-md flex items-center gap-2">
                ← Voltar para a Semana
            </button>`;

        document.getElementById('back-to-week-btn').addEventListener('click', () => {
            dataManager.appData.settings.plannerFocusedDay = null;
            this.handleNavigation(null, 'planejamento');
        });
    }

    renderActiveView() {
        const viewContainer = this.dom.views[this.activeView];
        viewContainer.innerHTML = '';
        
        // Clean up charts
        Object.values(this.charts).forEach(chart => chart?.destroy());
        this.charts = {};

        switch (this.activeView) {
            case 'hoje':
                renderHojeView(viewContainer, this.charts);
                break;
            case 'edital':
                renderEditalView(viewContainer, this.charts);
                break;
            case 'planejamento':
                renderPlanejamentoView(viewContainer, this.charts);
                break;
            case 'estatisticas':
                renderEstatisticasView(viewContainer, this.charts);
                break;
            case 'conquistas':
                renderConquistasView(viewContainer, this.charts);
                break;
        }
    }

    getCharts() {
        return this.charts;
    }

    setActiveView(view) {
        this.handleNavigation(null, view);
    }
}

export const navigationManager = new NavigationManager();