import alt from './alt'
import PricesSnapshotActions from './prices_snapshot_actions'
import CurrentSilo from './current_silo'

class PricesSnapshotStore {
    constructor() {
        this.bindActions(PricesSnapshotActions)
    }

    onUpdate(content) {
        this.snapshot = content.snapshot
    }

    onUpdateBinGrade(updates) {
        CurrentSilo.grain_season = updates.currentSeason
        CurrentSilo.binGradeSelector.updateBinGradesSelection(updates.currentBinGrade)
    }

    onUpdateSeason(season) {
        CurrentSilo.grain_season = season
        CurrentSilo.binGradeSelector.reconcileBinGradesSelection(season)
    }
}

export default alt.createStore(PricesSnapshotStore, 'pricesSnapshotStore')
