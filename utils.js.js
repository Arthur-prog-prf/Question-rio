export class Utils {
    static toggleAccordion(event, selector) {
        const content = document.querySelector(selector);
        const chevron = event.currentTarget.querySelector('svg');
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            if(chevron) chevron.style.transform = 'rotate(0deg)';
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            if(chevron) chevron.style.transform = 'rotate(180deg)';
        }
    }

    static formatTime(seconds) {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static validateNumber(input, min = 0, max = Infinity) {
        const num = parseInt(input);
        return !isNaN(num) && num >= min && num <= max;
    }

    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}