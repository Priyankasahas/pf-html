class ClearSnapshotLoader {
    constructor(snapshotActions, currentSilo) {
        this.snapshotActions = snapshotActions
        this.currentSilo = currentSilo
    }

    fetch() {
        const service_url = this.currentSilo.clear_service_url
        const bhc_site_name = this.currentSilo.bhc_site_type == 'PortTerminal' ? this.currentSilo.port_name : this.currentSilo.bhc_site_name
        const port_name = this.currentSilo.port_name
        const bulk_handler_code = this.currentSilo.bulk_handler_code
        const bin_grade = this.currentSilo.bin_grade
        const grain_season = this.currentSilo.grain_season

        const url = `${service_url}/api/1.0/market_snapshots/${grain_season}/${bhc_site_name}/${bulk_handler_code}/${port_name}/${bin_grade}/snapshot.json`

        $.ajax({ url: url, timeout: 10000 })
            .done(this.fetchDataDone.bind(this))
            .fail(this.fetchDataFail.bind(this))
    }

    fetchDataDone(payload) {
        this.snapshotActions.update(payload)
    }

    fetchDataFail(jqXHR, textStatus) {
        this.snapshotActions.update({ site_snapshot: {} })
        console.log(`Failed to retrieve the market snapshots for ${this.currentSilo.bhc_site_name}, ${this.currentSilo.bulk_handler_code}, ${this.currentSilo.grain_type}.`)
    }
}

export default ClearSnapshotLoader
