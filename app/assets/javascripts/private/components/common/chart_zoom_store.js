import alt from './alt'
import ChartZoomActions from './chart_zoom_actions.js'

class ChartZoomStore {
    constructor() {
        this.bindActions(ChartZoomActions)
    }

    onUpdate(level) {
        this.zoomLevel = level
    }
}

export default alt.createStore(ChartZoomStore, 'chartZoomStore')
