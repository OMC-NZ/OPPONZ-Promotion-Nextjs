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

    getWidget() {
        if (typeof window === "undefined" || typeof window.zE !== "function") {
            return null;
        }

        return window.zE;
    }

    open(sourceId) {
        if (this.currentSource === sourceId) return;

        const widget = this.getWidget();
        if (!widget) return;


        if (this.isOpen && this.currentSource !== null) {
            widget('messenger', 'close');
            this.notifyListeners(false, this.currentSource);
        }

        widget('messenger', 'open');
        this.isOpen = true;
        this.currentSource = sourceId;
        this.notifyListeners(true, sourceId);
    }

    close(sourceId) {
        if (this.currentSource === sourceId) {
            const widget = this.getWidget();
            if (widget) {
                widget('messenger', 'close');
            }

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
