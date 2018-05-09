class AbstractFlux {
    constructor(actions, store, loader, timer) {
        this.fluxActions = actions
        this.fluxStore = store
        this.loader = loader
        this.timer = timer
        this.listeners = 0
    }

    get actions() {
        return this.fluxActions
    }

    get state() {
        return this.fluxStore.getState()
    }

    listen(f) {
        this.fluxStore.listen(f)
        this.listeners += 1
        if (this.listeners > 0) {
            this.timer.start()
        }
    }

    unlisten(f) {
        this.fluxStore.unlisten(f)
        this.listeners -= 1
        if (this.listeners < 1) {
            this.timer.stop()
        }
    }
}

export default AbstractFlux
