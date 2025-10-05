import { dataManager } from '../data-manager.js';
import { ACHIEVEMENTS } from '../../config/constants.js';

export function renderConquistasView(container, charts) {
    container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            ${Object.keys(ACHIEVEMENTS).map(key => renderAchievementCard(key)).join('')}
        </div>`;
}

function renderAchievementCard(key) {
    const ach = ACHIEVEMENTS[key];
    const unlocked = dataManager.appData.achievements[key];
    
    return `
        <div class="card p-6 rounded-xl text-center flex flex-col items-center justify-center 
            ${unlocked ? '' : 'achievement-locked'}">
            <div class="text-6xl mb-4">${ach.icon}</div>
            <h3 class="text-xl font-bold text-primary">${ach.name}</h3>
            <p class="text-sm mt-2">${ach.description}</p>
            ${unlocked ? 
                `<p class="text-xs font-bold mt-4" style="color: var(--accent-color);">
                    DESBLOQUEADO
                </p>` : 
                ''
            }
        </div>
    `;
}