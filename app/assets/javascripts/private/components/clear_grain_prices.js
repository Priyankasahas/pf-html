import React, { Component } from 'react'
import PricesFlux from './common/prices_flux'
import ClearPricesFlux from './common/clear_prices_flux'
import CurrentSilo from './common/current_silo'
import FormattedCurrency from './common/formatted_currency'
import ReactIntl from 'react-intl'
import ClearLoadingAnimation from './clear_loading_animation'

class ClearGrainOverview extends Component {
  render() {
    const seasonStartYear = this.props.season.substring(2)
    const seasonEndYear = `${(parseInt(seasonStartYear) + 1)}`


    return <div>
    <div className="summary-icon hidden-xs"></div>
    <h2>Exchange market
    <span className="pull-right">{this.props.code}</span>
    </h2>

    <p>Nearby trades for {this.props.bhcSite} <span className="pull-right">{seasonStartYear}/{seasonEndYear}</span></p>
    </div>
  }
}

class ClearGrainPortZoneSnapshotTable extends Component {
  render() {
    return <table className="table">
      {this._header}
      {this._rows}
    </table>
  }

  get _header() {
    if (this.props.portEquivalent) {
      return <thead>
      <tr>
          <td><h4>Nearby Trades</h4></td>
          <td></td>
          <td className="text-right"><h4>Port Equivalent</h4></td>
      </tr>
      </thead>
    } else {
      // check explicitly for delivered sites, and use Delivered Site as the CGX pricing label
      const pricingLabel = this.props.pricingLabel == 'Delivered' ? 'Delivered Site' : this.props.pricingLabel

      return <thead>
      <tr>
          <td><h4>Nearby Trades</h4></td>
          <td></td>
          <td className="text-right"><h4>{pricingLabel}</h4></td>
      </tr>
      </thead>
    }
  }

  get _rows() {
    var prices = []

    if (!_.isEmpty(this.props.clearPortZonePrices)) {
        prices = this.props.clearPortZonePrices.map(price => {
            const key = `${price.bulk_handler_name}.${price.recent_trade_delivered}.${price.bhc_site_name}`

            return <tr key={key}>
                <td>{price.bhc_site_name} ({price.bulk_handler_name})</td>
                <td></td>
                <td className="text-right"><FormattedCurrency value={price.recent_trade_delivered_port_equivalent}/>
                </td>
            </tr>
        })
    }

    const maxPadding = 3 // up to 3 trades or rows of dashes in case of less
    const paddingLength = prices.length > maxPadding ? 0 : (maxPadding - prices.length)
    const padding = []

    _.times(paddingLength, i => {
        padding.push(<tr key={`padding.${i}`}>
            <td></td>
            <td></td>
            <td className="text-right">-</td>
        </tr>)
    })

    return <tbody>
    {prices}
    {padding}
    </tbody>
  }
}

class ClearOffer extends Component {
    render() {
      return <div>
        <a target="_blank" href={this.props.clearServiceUrl} className="btn btn-primary retail-button-background-colour fr" role="button">Learn about CGX</a>
        <p>Nearby trade activity at bulk handlers participating</p><p className="mb0"> on the Clear Grain Exchange.</p>
      </div>
    }
}

class ClearGrainPrices extends Component {
  constructor(props) {
    super(props)
    this.clearPricesFlux = ClearPricesFlux
    this.indicativePriceFlux = PricesFlux
    this.state = {
      indicativePrices: this.props.indicative_snapshot.market_prices
    }
    this.binGradeChangeFlux = PricesFlux
  }

  componentDidMount() {
    this.binGradeChangeFlux.listen(this.onChangeBinGrade.bind(this))
    this.indicativePriceFlux.listen(this.onChangeIndicative.bind(this))
    this.clearPricesFlux.listen(this.onChangeCGX.bind(this))
    this.clearPricesFlux.fetch()
  }

  componentWillUnmount() {
    this.binGradeChangeFlux.unlisten(this.onChangeBinGrade.bind(this))
    this.clearPricesFlux.unlisten(this.onChangeCGX.bind(this))
    this.indicativePriceFlux.unlisten(this.onChangeIndicative.bind(this))
  }

  onChangeBinGrade() {
    this.setState({clearSnapshot: null})
    this.setState({clearPortZoneSnapshot: null})
  }

  onChangeIndicative() {
    var indicativePrices = this.state.indicativePrices
    var currentIndicativePricesState = this.indicativePriceFlux.state

    if (!_.isEmpty(currentIndicativePricesState)) {
      indicativePrices = currentIndicativePricesState.snapshot.market_prices
    }

    this.setState({indicativePrices: indicativePrices})
  }

  onChangeCGX() {
    var clearSnapshot = this.state.clearSnapshot
    var clearPortZoneSnapshot = this.state.clearPortZoneSnapshot
    var currentCGXState = this.clearPricesFlux.state

    if (!_.isEmpty(currentCGXState) && currentCGXState.clearSnapshot !== null) {
      clearSnapshot = currentCGXState.clearSnapshot
    }

    if (!_.isEmpty(currentCGXState) && currentCGXState.clearPortZoneSnapshot !== null) {
      clearPortZoneSnapshot = currentCGXState.clearPortZoneSnapshot
    }

    this.setState({clearSnapshot: clearSnapshot, clearPortZoneSnapshot: clearPortZoneSnapshot, indicativePrices: this.state.indicativePrices})
  }

  renderContent(content) {
      return <div className="trade-summary zone-trade-summary panel panel-default">

        <div className="panel-heading">
          <ClearGrainOverview last_updated_at={this.props.last_updated_at}
                              code={this.props.silo.bin_grade}
                              season={this.props.silo.grain_season}
                              bhcSite={this.props.silo.bhc_site_name} />
        </div>
        {content}
        <div className="panel-footer">
          <ClearOffer clearServiceUrl={this.props.silo.clear_service_url} />
        </div>
      </div>
  }

  render() {
    const prices = this.state.clearPortZoneSnapshot

    if (prices) {
        return this.renderContent(<div>
          <ClearGrainPortZoneSnapshotTable clearPortZonePrices={this.state.clearPortZoneSnapshot}
                                           portEquivalent={this.props.silo.port_equivalent}
                                           pricingLabel={this.props.silo.pricing_label}
                                           freightRate={this.props.silo.freight_rate} />
        </div>)
    }

    return this.renderContent(<div className="exchange-market-animation-wrapper loading-animation-wrapper-zone">
        <ClearLoadingAnimation />
    </div>)
  }
}

export default ClearGrainPrices
