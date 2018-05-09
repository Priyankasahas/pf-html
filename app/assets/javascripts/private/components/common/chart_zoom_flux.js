import ChartZoomActions from './chart_zoom_actions'
import ChartZoomStore from './chart_zoom_store'

class ChartZoomFlux {
    constructor(actions, store) {
        this.fluxActions = actions
        this.fluxStore = store
    }

    get actions() {
        return this.fluxActions
    }

    get state() {
        return this.fluxStore.getState()
    }

    listen(f) {
        this.fluxStore.listen(f)
    }

    unlisten(f) {
        this.fluxStore.unlisten(f)
    }
}

export default new ChartZoomFlux(ChartZoomActions, ChartZoomStore)
