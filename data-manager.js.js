import { DEFAULT_EDITAL, ACHIEVEMENTS } from '../config/constants.js';

export class DataManager {
    constructor() {
        this.appData = null;
        this.loadData();
    }

    loadData() {
        const savedData = localStorage.getItem('approvalPanelData_v4');
        if (savedData) {
            this.appData = JSON.parse(savedData);
            this.migrateData();
        } else {
            this.initializeDefaultData();
        }
        return this.appData;
    }

    migrateData() {
        if (!this.appData.weeklyPlanner) {
            this.appData.weeklyPlanner = {
                tasks: [
                    {id: 1, text: 'Ex: Estudar Direito Const.', duration: 60}, 
                    {id: 2, text: 'Ex: 50 Questões Português', duration: 60}
                ],
                schedule: { 'seg': [], 'ter': [], 'qua': [], 'qui': [], 'sex': [], 'sab': [], 'dom': [] },
                daySchedule: {}
            };
        }

        if (!this.appData.settings.editalView) {
            this.appData.settings.editalView = 'lista';
        }

        if (!this.appData.settings.plannerFocusedDay) {
            this.appData.settings.plannerFocusedDay = null;
        }

        if (!this.appData.achievements) {
            this.appData.achievements = {};
        }

        // Migrate topic data
        for (const subject in this.appData.editalData) {
            if (this.appData.editalData[subject].topics) {
                this.appData.editalData[subject].topics.forEach(topic => {
                    if (topic.notes === undefined) topic.notes = '';
                    if (topic.questions_total === undefined) topic.questions_total = 0;
                    if (topic.questions_correct === undefined) topic.questions_correct = 0;
                });
            }
        }
    }

    initializeDefaultData() {
        this.appData = {
            editalData: JSON.parse(JSON.stringify(DEFAULT_EDITAL)),
            studyLog: [],
            settings: { 
                studyCycle: [], 
                currentCycleIndex: 0, 
                goals: { weeklyHours: 25, monthlyQuestions: 500 }, 
                editingSubject: null,
                editalView: 'lista',
                plannerFocusedDay: null
            },
            mockExams: [],
            achievements: {},
            weeklyPlanner: {
                tasks: [
                    {id: 1, text: 'Ex: Estudar Direito Const.', duration: 60}, 
                    {id: 2, text: 'Ex: 50 Questões Português', duration: 60}
                ],
                schedule: { 'seg': [], 'ter': [], 'qua': [], 'qui': [], 'sex': [], 'sab': [], 'dom': [] },
                daySchedule: {}
            }
        };

        // Initialize topics with default status
        for (const subject in this.appData.editalData) {
            this.appData.editalData[subject].topics = this.appData.editalData[subject].topics.map(topic => ({
                ...topic,
                status: 'nao_estudado',
                reviewLevel: 0,
                nextReviewDate: null,
                notes: '',
                questions_total: 0,
                questions_correct: 0
            }));
        }
    }

    saveData() {
        this.updateAchievements();
        localStorage.setItem('approvalPanelData_v4', JSON.stringify(this.appData));
    }

    updateAchievements() {
        if (this.appData.studyLog.length > 0) {
            this.appData.achievements['first_log'] = true;
        }

        const totalMinutes = this.appData.studyLog.reduce((sum, log) => sum + log.duration, 0);
        if (totalMinutes >= 3000) {
            this.appData.achievements['marathoner'] = true;
        }

        if (this.appData.mockExams && this.appData.mockExams.some(e => (e.correct / e.total) >= 0.9)) {
            this.appData.achievements['specialist'] = true;
        }

        for (const subject in this.appData.editalData) {
            if (this.appData.editalData[subject].topics.length > 0 && 
                this.appData.editalData[subject].topics.every(t => t.status === 'dominado')) {
                this.appData.achievements['subject_master'] = true;
                break;
            }
        }

        const studyDays = new Set(this.appData.studyLog.map(log => new Date(log.date).toDateString()));
        let streak = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            if (studyDays.has(d.toDateString())) streak++; 
            else break;
        }
        if (streak >= 7) {
            this.appData.achievements['week_streak'] = true;
        }
    }

    getReviewTopics() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let topicsToReview = [];
        
        for (const subject in this.appData.editalData) {
            this.appData.editalData[subject].topics.forEach((topic, index) => {
                if (topic.status === 'revisar' || 
                    (topic.nextReviewDate && new Date(topic.nextReviewDate) <= today)) {
                    topicsToReview.push({ subject, topic, index });
                }
            });
        }
        return topicsToReview;
    }

    addStudyLog(entry) {
        this.appData.studyLog.push({
            date: new Date().toISOString(),
            ...entry
        });
        this.saveData();
    }

    getTodaysStudyLog() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.appData.studyLog
            .filter(log => new Date(log.date) >= today)
            .reverse();
    }
}

export const dataManager = new DataManager();