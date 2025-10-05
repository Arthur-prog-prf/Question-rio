export class ModalManager {
    constructor() {
        this.modal = document.getElementById('modal');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('visible')) {
                this.close();
            }
        });
    }

    open(content) {
        this.modal.innerHTML = content;
        this.modal.classList.add('visible');
    }

    close() {
        this.modal.classList.remove('visible');
        this.modal.innerHTML = '';
    }

    isOpen() {
        return this.modal.classList.contains('visible');
    }
}

export const modalManager = new ModalManager();