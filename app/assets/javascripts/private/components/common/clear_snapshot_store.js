import alt from './alt'
import ClearSnapshotActions from './clear_snapshot_actions'
import CurrentSilo from './current_silo'

class ClearSnapshotStore {
    constructor() {
        this.bindActions(ClearSnapshotActions)
    }

    onUpdate(content) {
        this.clearSiteMetadata = content.site_metadata
        this.clearSnapshot = content.site_snapshot
        this.clearPortZoneSnapshot = content.port_zone_snapshot
        this.clearOffersSnapshot = content.offers_snapshot
        this.clearBidsSnapshot = content.bids_snapshot
    }

    onUpdateClearSnapshot() {
      this.clearSnapshot = []
    }
}

export default alt.createStore(ClearSnapshotStore, 'clearSnapshotStore')
