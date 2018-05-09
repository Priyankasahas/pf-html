import alt from './alt'

class PricesSnapshotActions {
    constructor() {
        this.generateActions('update', 'updateBinGrade', 'updateSeason')
    }
}

export default alt.createActions(PricesSnapshotActions)
