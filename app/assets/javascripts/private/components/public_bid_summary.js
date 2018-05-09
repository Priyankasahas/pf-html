import React, { Component } from 'react'

class PublicBidSummary extends Component {
    render() {
        const seasonStartYear = this.props.season.substring(2)
        const seasonEndYear = `${(parseInt(seasonStartYear) + 1)}`

        const tooltipText = "Here you can view and compare all the market bids that are made publicly available. This includes indicative bids advertised by buyers and firm cash bids currently available at silos."
        return <div>
          <div className="summary-icon hidden-xs"></div>
          <h2>Public market <span className="glyphicon glyphicon-info-sign blue f4" data-toggle="tooltip" data-placement="top" title={tooltipText} aria-hidden="true"></span>
              <span className="pull-right">{this.props.code}</span>
          </h2>

          <p>Indicative and cash bid prices <span className="pull-right">{seasonStartYear}/{seasonEndYear}</span></p>
        </div>
    }
}

export default PublicBidSummary
