class Timer {
    constructor(tock, duration) {
        this.tock = tock
        this.duration = duration
        this.active = false
    }

    start() {
        if (!this.active) {
            this.timoutID = setTimeout(this.tick.bind(this), this.duration)
            this.active = true
        }
    }

    stop() {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID)
        }
        this.active = false
    }

    tick() {
        this.tock()

        if (this.active) {
            this.timeoutID = setTimeout(this.tick.bind(this), this.duration)
        }
    }
}

export default Timer