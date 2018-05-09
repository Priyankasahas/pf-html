import ClearSnapshotActions from './clear_snapshot_actions'
import ClearSnapshotStore from './clear_snapshot_store'
import CurrentSilo from './current_silo'
import Timer from './timer'
import AbstractFlux from './abstract_flux'
import ClearSnapshotLoader from './clear_snapshot_loader'
import PricesFlux from './prices_flux'

class ClearPricesFlux extends AbstractFlux {
    constructor(actions, store) {
        const interval = 1000 * 60 * 10 // 10 minutes
        const loader = new ClearSnapshotLoader(actions, CurrentSilo)
        const timer = new Timer(loader.fetch.bind(loader), interval)

        super(actions, store, loader, timer)

        this.binGradeChangeFlux = PricesFlux
    }

    listen(f) {
        super.listen(f)
        if (this.listeners > 0) {
            this.binGradeChangeFlux.listen(this.onChangeBinGrade.bind(this))
        }
    }

    unlisten(f) {
        super.unlisten(f)
        if (this.listeners > 0) {
            this.binGradeChangeFlux.unlisten(this.onChangeBinGrade.bind(this))
        }
    }

    fetch() {
        this.loader.fetch()
    }

    onChangeBinGrade() {
        this.fetch()
    }
}

export default new ClearPricesFlux(ClearSnapshotActions, ClearSnapshotStore)
