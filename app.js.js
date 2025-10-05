import { ThemeManager } from './modules/theme-manager.js';
import { NavigationManager } from './modules/navigation.js';

class App {
    constructor() {
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.init();
    }

    init() {
        console.log('Painel de Aprovação v4 inicializado');
        // App is ready, navigation manager handles the rest
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Export for potential debugging
window.App = App;