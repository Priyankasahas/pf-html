import React, { Component } from 'react'

class ClearLoadingAnimation extends Component {
    render() {
        return <div className="inner-height">
                <div className="exchange-market-loading-animation-circle exchange-market-loading-animation-background-colour animated infinite slideInUp"></div>
                <div className="exchange-market-loading-animation-circle exchange-market-loading-animation-background-colour animated infinite slideInUp"></div>
                <div className="exchange-market-loading-animation-circle exchange-market-loading-animation-background-colour animated infinite slideInUp"></div>
                <p className="loading-label">Loading market data...</p>
            </div>
    }
}

export default ClearLoadingAnimation
