import React, { Component } from 'react'
import Ago from 'react-ago-component'

class OvernightMove extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: props.move.content,
            last_updated_at: props.move.updated_at
        }
    }

    render() {
        const ago = <Ago date={this.state.last_updated_at} autoUpdate={true} tooltipFormat="long"/>

        return <div className="overnight-markets panel-default bn mb0 bl b--light-grey br0 bn-s bt-s minh14">
                 <div className="panel-body">
                  <h4 className="f3 fw5">Overnight markets</h4>
                  <p>Updated {ago}</p>
                    <div>
                    {_.unescape(this.state.content)}
                    </div>
                 </div>
               </div>
    }
}

export default OvernightMove
