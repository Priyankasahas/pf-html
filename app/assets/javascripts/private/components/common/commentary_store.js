import alt from './alt'
import CommentaryActions from './commentary_actions'

class CommentaryStore {
    constructor() {
        this.bindActions(CommentaryActions)
    }

    onUpdate(content) {
        this.market_commentary = content.market_commentary
    }
}

export default alt.createStore(CommentaryStore, 'commentaryStore')
