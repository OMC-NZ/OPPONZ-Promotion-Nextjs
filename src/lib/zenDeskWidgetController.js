// lib/zenDeskWidgetController.js

class zenDeskWidgetController {
    constructor() {
        if (!zenDeskWidgetController.instance) {
            this.isOpen = false;
            this.currentSource = null;
            this.listeners = [];
            zenDeskWidgetController.instance = this;
        }

        return zenDeskWidgetController.instance;
    }

    open(sourceId) {
        if (this.currentSource === sourceId) return;

        if (this.isOpen && this.currentSource !== null) {
            zE('messenger', 'close');
            this.notifyListeners(false, this.currentSource);
        }

        zE('messenger', 'open');
        this.isOpen = true;
        this.currentSource = sourceId;
        this.notifyListeners(true, sourceId);
    }

    close(sourceId) {
        if (this.currentSource === sourceId) {
            zE('messenger', 'close');
            this.isOpen = false;
            this.currentSource = null;
            this.notifyListeners(false, sourceId);
        }
    }

    toggle(sourceId) {
        if (this.isOpen && this.currentSource === sourceId) {
            this.close(sourceId);
        } else {
            this.open(sourceId);
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    notifyListeners(isOpen, sourceId) {
        this.listeners.forEach((listener) => listener(isOpen, sourceId));
    }
}

const instance = new zenDeskWidgetController();

export default instance;
