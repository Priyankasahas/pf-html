import alt from './alt'

class ClearSnapshotActions {
    constructor() {
        this.generateActions('update', 'updateClearSnapshot')
    }
}

export default alt.createActions(ClearSnapshotActions)
