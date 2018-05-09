import React, { Component } from 'react'
import ReactIntl, { FormattedDate } from 'react-intl'
import Ago from 'react-ago-component'

class MarketSnapshot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: props.snapshot.content,
            last_updated_at: props.snapshot.updated_at
        }
    }
    
    render() {
        const ago = <Ago date={this.state.last_updated_at} autoUpdate={true} tooltipFormat="long"/>

        return <div className="analyst-desk panel panel-default">
            <div className="panel-heading">
                <div className="insights-icon analyst-desk-icon"></div>
                <h3 className="panel-title">The analyst desk</h3>
                <p>Updated {ago}</p>
            </div>
            <div className="panel-body">{_.unescape(this.state.content)}</div>
        </div>
    }
}

export default MarketSnapshot
