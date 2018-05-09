import React, { Component } from 'react'
import FormattedCurrency from './common/formatted_currency'
import ReactIntl, { FormattedNumber } from 'react-intl'

class MarketOverview extends Component {
    render() {
        const sign = this.props.marketPrices.price_high_movement >= 0 ? '+' : ''
        var klass = ''

        if (this.props.marketPrices.price_high_movement > 0) {
            klass = "price-movement-up"

        } else if (this.props.marketPrices.price_high_movement < 0) {
            klass = "price-movement-down"
        }

        const portPrice = this.props.portEquivalent ? <td className="text-right"><h4>Port Equivalent</h4>
                  <h2 className={klass}><FormattedCurrency value={this.props.marketPrices.port_price}/></h2>
                  </td> : null

        return <tr>
            <td></td>
            <td className="text-right"><h4>Change</h4>
              <h2 className={klass}>{sign}<FormattedNumber value={this.props.marketPrices.price_high_movement}/></h2>
            </td>
            <td className="text-right"><h4>{this.props.pricingLabel}</h4>
              <h2 className={klass}><FormattedCurrency value={this.props.marketPrices.price}/></h2>
            </td>
            {portPrice}
        </tr>
    }
}

export default MarketOverview
