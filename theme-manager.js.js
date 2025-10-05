import { ICONS } from '../config/icons.js';

export class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.setupTheme();
        this.bindEvents();
    }

    setupTheme() {
        const isDarkMode = localStorage.getItem('theme_v4') === 'dark';
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
        this.updateThemeIcon(isDarkMode);
    }

    updateThemeIcon(isDarkMode) {
        this.themeToggle.innerHTML = isDarkMode ? ICONS.theme_sun : ICONS.theme_moon;
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDarkMode = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme_v4', isDarkMode ? 'dark' : 'light');
        this.updateThemeIcon(isDarkMode);
    }

    isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }
}