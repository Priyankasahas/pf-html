import React, { Component } from 'react'
import reactMixin from 'react-mixin'
import PricesFlux from './common/prices_flux'
import FormattedCurrency from './common/formatted_currency'
import ReactIntl, { FormattedNumber } from 'react-intl'
import MarketOverview from './market_overview'
import PublicBidSummary from './public_bid_summary'
import Moment from 'moment'

class MerchantPricesTable extends Component {
    render() {
        const prices = this.props.merchantPrices || []
        const rows = prices.map(p => {
            const key = `${p.merchant}.${p.price}.${p.movement}`
            return <MerchantPriceRow key={key} merchant={p.merchant} price={p.price} port_price={p.port_price}
                                     movement={p.movement} portEquivalent={this.props.portEquivalent} created_at={p.created_at}/>
        })

        return <table className="table db nowrap overflow-y-auto">
            <thead>
                 <MarketOverview marketPrices={this.props.marketPrices}
                                 pricingLabel={this.props.pricingLabel}
                                 portEquivalent={this.props.portEquivalent} />
            </thead>
            <tbody>{rows}</tbody>
        </table>
    }
}

class MerchantPriceRow extends Component {
    render() {
        var klass = "text-right"

        if (this.props.movement > 0) {
            klass = "price-movement-up text-right"
        } else if (this.props.movement < 0) {
            klass = "price-movement-down text-right"
        }

        const portPrice = this.props.portEquivalent ? <td className="text-right"><FormattedCurrency value={this.props.port_price}/></td> : null

        const sign = this.props.movement > 0 ? '+' : ''

        return <tr>
            <td className="text-left">{this.props.merchant}<span className="price-updated-at">{this._createdAtTimestamp()}</span></td>
            <td className={klass}>{sign + this.props.movement}</td>
            <td className="text-right"><FormattedCurrency value={this.props.price}/></td>
            {portPrice}
        </tr>
    }

    _createdAtTimestamp() {
        var createdAt = Moment(this.props.created_at).local();
        var isToday = createdAt.isSame(Moment().startOf('day'), 'd');
        return isToday ? createdAt.format('h:mma') : createdAt.format('DD MMM YYYY h:mma');
    }
}

class MerchantPrices extends Component {
    constructor(props) {
        super(props)
        this.pricesFlux = PricesFlux
        this.state = {
            snapshot: props.snapshot
        }
    }

    componentDidMount() {
        this.pricesFlux.listen(this.onChange.bind(this))
    }

    componentWillUnmount() {
        this.pricesFlux.unlisten(this.onChange.bind(this))
    }

    onChange() {
        var snapshot = this.state.snapshot
        const currentState = this.pricesFlux.state

        if (!_.isEmpty(currentState)) {
            snapshot = currentState.snapshot
        }

        this.setState({snapshot: snapshot})
    }

    render() {
        const code = this.props.silo.bin_grade
        const season = this.props.silo.grain_season
        const pricingLabel = this.props.silo.pricing_label
        const portEquivalent = this.props.silo.port_equivalent
        const grainSeason = this.props.silo.grain_season
        const merchantPricesByGrade = this.state.snapshot.merchant_prices ? this.state.snapshot.merchant_prices[code] : null
        const merchantPrices = merchantPricesByGrade ? merchantPricesByGrade[grainSeason] : []
        const marketPrices = this.state.snapshot.market_prices[code][grainSeason]

        return <div className="public-bid-summary panel panel-default">
            <div className="fw6 ttu f4 bg-darkgrey">
              <p className="powered-by white pt1 pb1 pl2 ma0">Powered by Profarmer Australia</p>
            </div>
            <div className="panel-heading">
                <PublicBidSummary last_updated_at={marketPrices.prices_last_updated_at} code={code} season={season}/>
            </div>
            <MerchantPricesTable marketPrices={marketPrices}
                                 merchantPrices={merchantPrices}
                                 pricingLabel={pricingLabel}
                                 portEquivalent={portEquivalent} />
        </div>
    }
}

export default MerchantPrices
