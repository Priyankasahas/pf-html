import CommentaryActions from './commentary_actions'
import CommentaryStore from './commentary_store'
import CurrentSilo from './current_silo'
import Timer from './timer'
import AbstractFlux from './abstract_flux'

class CommentaryLoader {
    constructor(commentaryActions, currentSilo) {
        this.commentaryActions = commentaryActions
        this.currentSilo = currentSilo
    }

    fetch() {
        var service_url = this.currentSilo.service_url
        var grain_type = this.currentSilo.grain_type

        $.get(`${service_url}/market_commentaries/${grain_type}`)
            .done(this.fetchDataDone.bind(this))
            .fail(this.fetchDataFail.bind(this))
    }

    fetchDataDone(payload) {
        this.commentaryActions.update(payload)
    }

    fetchDataFail() {
        console.log(`Failed to retrieve the market commentaries for ${this.currentSilo.grain_type}.`)
    }
}

class CommentariesFlux extends AbstractFlux {
    constructor(actions, store) {
        const interval = 1000 * 60 * 60 * 2 // 2 hours
        const loader = new CommentaryLoader(actions, CurrentSilo)
        const timer = new Timer(loader.fetch.bind(loader), interval)

        super(actions, store, loader, timer)
    }
}


export default new CommentariesFlux(CommentaryActions, CommentaryStore)
