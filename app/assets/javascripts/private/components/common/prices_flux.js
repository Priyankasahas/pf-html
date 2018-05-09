import PricesSnapshotActions from './prices_snapshot_actions'
import PricesSnapshotStore from './prices_snapshot_store'
import CurrentSilo from './current_silo'
import Timer from './timer'
import AbstractFlux from './abstract_flux'

class PricesSnapshotLoader {
    constructor(snapshotActions, currentSilo) {
        this.snapshotActions = snapshotActions
        this.currentSilo = currentSilo
    }

    fetch() {
        const service_url = this.currentSilo.service_url
        const bhc_site_name = this.currentSilo.bhc_site_name
        const bulk_handler_code = this.currentSilo.bulk_handler_code
        const grain_type = this.currentSilo.grain_type

        $.get(`${service_url}/prices?bhc_site_name=${bhc_site_name}&bulk_handler_code=${bulk_handler_code}&grain_type=${grain_type}`)
            .done(this.fetchDataDone.bind(this))
            .fail(this.fetchDataFail.bind(this))
    }

    fetchDataDone(payload) {
        this.snapshotActions.update(payload)
    }

    fetchDataFail() {
        console.log(`Failed to retrieve the prices for ${this.currentSilo.bhc_site_name}, ${this.currentSilo.bulk_handler_code}, ${this.currentSilo.grain_type}.`)
    }
}

class PricesFlux extends AbstractFlux {
    constructor(actions, store) {
        const interval = 1000 * 60 * 5 // 5 minutes
        const loader = new PricesSnapshotLoader(actions, CurrentSilo)
        const timer = new Timer(loader.fetch.bind(loader), interval)

        super(actions, store, loader, timer)
    }
}

export default new PricesFlux(PricesSnapshotActions, PricesSnapshotStore)
