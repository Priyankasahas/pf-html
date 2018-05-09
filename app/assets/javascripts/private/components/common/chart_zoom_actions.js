import alt from './alt'

class ChartZoomActions {
    constructor() {
        this.generateActions('update')
    }
}

export default alt.createActions(ChartZoomActions)
