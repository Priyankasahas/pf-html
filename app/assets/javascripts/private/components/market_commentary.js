import React, { Component } from 'react'
import Showdown from 'showdown'
import CommentariesFlux from './common/commentaries_flux'
import Ago from 'react-ago-component'

const converter = new Showdown.Converter();

class MarketCommentary extends Component {
    constructor(props) {
        super(props)
        this.commentariesFlux = CommentariesFlux
        this.state = {
            market_commentary: props.market_commentary
        }
    }

    componentDidMount() {
        this.commentariesFlux.listen(this.onChange.bind(this))
    }

    componentWillUnmount() {
        this.commentariesFlux.unlisten(this.onChange.bind(this))
    }

    onChange() {
        var commentary = this.state.market_commentary
        var currentState = this.commentariesFlux.state

        if (!_.isEmpty(currentState)) {
            commentary = currentState.market_commentary
        }

        this.setState({commentary: commentary})
    }

    render() {
        var ago = <Ago date={this.state.market_commentary.last_updated_at} autoUpdate={true} tooltipFormat="long" />

        return <div className="market-insight panel panel-default">
            <div className="panel-heading">
                <div>
                    <div className="summary-icon market-insight-icon hidden-xs"></div>
                    <h2>The analyst desk</h2>
                    <p>Daily indicies and commodity analysis</p>
                </div>
            </div>
            <div className="panel-body">
              <div className="overnight-move pb1">
                {this.props.overnight_move.content}
              </div>
              <div className="market-commentary" dangerouslySetInnerHTML={{
                __html: converter.makeHtml(this.state.market_commentary.content)
              }}/>
            </div>
        </div>

    }
}

export default MarketCommentary
