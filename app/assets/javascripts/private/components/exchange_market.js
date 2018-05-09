import React, { Component } from 'react'
import PricesFlux from './common/prices_flux'
import ClearPricesFlux from './common/clear_prices_flux'
import CurrentSilo from './common/current_silo'
import FormattedCurrency from './common/formatted_currency'
import ReactIntl from 'react-intl'
import Ago from 'react-ago-component'
import ClearLoadingAnimation from './clear_loading_animation'
import MappingContactForm from './mapping_contact_form'

class ClearGrainOverview extends Component {
  render() {
    const seasonStartYear = this.props.season.substring(2)
    const seasonEndYear = `${(parseInt(seasonStartYear) + 1)}`

    const tooltipText = "Don't want to sell at current market bids? The exchange enables you to put a price on your grain and expose it to all buyers. If your grain trades, a secure settlement process ensures you don't lose title until you're paid, within 7 days."
    return <div>
      <div className="summary-icon hidden-xs"></div>
      <h2>Exchange market <span className="glyphicon glyphicon-info-sign blue f4" data-toggle="tooltip" data-placement="top" title={tooltipText} aria-hidden="true"></span>
      <span className="pull-right">{this.props.code}</span>
      </h2>

      <p>Firm bid and offer prices
        <span className="pull-right">{seasonStartYear}/{seasonEndYear}</span>
      </p>
    </div>
  }
}

class MoreInformationModal extends Component {
  render() {
    const termsAndConditionsUrl = "/pdfs/CGX_T&Cs_15_December_2016.pdf"
    return <div className="modal fade" id="more-information-modal" tabindex="-1" role="dialog" aria-labelledby="tradesModalLabel">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header bb-0">
                     <div className="trading-user-icon center mt1"></div>
                    <h2 className="modal-title tc pt2">What is Clear Grain Exchange?</h2>
                  </div>
                  <div className="modal-body center mw50">
                    <h4>A quick rundown on the market</h4>
                    <p>Clear Grain Exchange is an independent online trading platform enabling the seamless execution of physical grain in Australia between sellers and buyers.</p>
                    <p>Growers are able to offer their grain at their price in an open market to all buyers. Trades are automated providing an efficient way for new buyers to buy grain direct off growers. This helps to drive more competition at the farm gate!</p>
                    <p>Importantly all trades are secured by a unique settlement facility whereby sellers do not release title of their grain to buyers until funds are received in full.</p>
                    <a href={termsAndConditionsUrl} target="_blank" className="blue-link">Click here to see Clear Grain Exchange Terms and Conditions.</a>
                  </div>
                  <div className="modal-footer tc bt-0">
                    <button type="button" className="btn btn-primary retail-button-background-colour tc mb1" data-dismiss="modal">Close</button>
                     <div className="cgx-icon center mt1"></div>
                  </div>
                </div>
              </div>
            </div>
  }
}

class ClearGrainPortZoneSnapshotTable extends Component {
  render() {
    return <div className="modal fade" id="tradesModal" tabindex="-1" role="dialog" aria-labelledby="tradesModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bb-0">
                  <h2 className="modal-title tc pt2">Nearby trades on CGX</h2>
                  <p className="tc">{this.props.binGrade} trades in {this.props.portName}</p>
                </div>
                <div className="modal-body center mw50">
                  <table className="table">
                  {this._header}
                  {this._rows}
                  </table>
                </div>
                <div className="modal-footer tc bt-0">
                  <button type="button" className="btn btn-primary retail-button-background-colour tc mb1" data-dismiss="modal">Close</button>
                </div>
                <div className="cgx-icon center mt1"></div>
              </div>
            </div>
          </div>
  }

  get _header() {
    if (this.props.portEquivalent) {
      return <thead>
      <tr>
          <td><h4 className="ttu darkgrey">Nearby Trades</h4></td>
          <td className="tr ttu darkgrey"><h4>Port Equivalent</h4></td>
      </tr>
      </thead>
    } else {
      // check explicitly for delivered sites, and use Delivered Site as the CGX pricing label
      const pricingLabel = this.props.pricingLabel == 'Delivered' ? 'Delivered Site' : this.props.pricingLabel

      return <thead>
      <tr>
          <td><h4 className="ttu darkgrey">Nearby Trades</h4></td>
          <td className="tr ttu darkgrey"><h4>{pricingLabel}</h4></td>
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
                <td className="bt-0">{price.bhc_site_name} ({price.bulk_handler_name})
                  <small> <Ago date={price.last_updated_at} autoUpdate={true} tooltipFormat="long"/></small>
                </td>
                <td className="tr bt-0"><FormattedCurrency value={price.recent_trade_delivered_port_equivalent}/>
                </td>
            </tr>
        })
    }

    return <tbody>
    {prices}
    </tbody>
  }
}

class NoOffers extends Component {
  checkCreatability(e,status) {
    e.preventDefault();
    const silo = this.props.silo
    const url = `/offers/new?bhc_site_name=${silo.bhc_site_name}&bulk_handler_code=${silo.bulk_handler_code}&grain_type_name=${silo.grain_type}&bin_grade_code=${silo.bin_grade}&grain_season=${silo.grain_season}`

    $.ajax({
        url: `${this.props.silo.orders_service_url}/tradable_grades/${silo.bin_grade}?bhc_site_name=${silo.bhc_site_name}&bulk_handler_code=${silo.bulk_handler_code}`,
        type: 'GET',
        success: () => {
          location.href = url
        },
        error: (request, errorThrown) => {
          if (request.status == 409) {
            $('#nonTradableGradeModal').modal('show')
          } else {
            $('#exchangeUnavailableModal').modal('show')
            console.log(errorThrown);
          }
        }
    })

  }

  render() {
    const offerButton = this.props.exchange_mapped ? <button type="button" className="btn btn-primary retail-button-background-colour mb2" onClick={this.checkCreatability.bind(this)}>Create offer</button> : <div>
                                                                                                                                                                                                                 <button type="button" className="btn btn-primary retail-button-background-colour mb2" data-toggle="modal" data-target="#mappingContactForm">
                                                                                                                                                                                                                   Create offer
                                                                                                                                                                                                                 </button>
                                                                                                                                                                                                                 <MappingContactForm></MappingContactForm>
                                                                                                                                                                                                               </div>
    return <table className="table dib w-50 w-100s mb0">
      <thead>
        <tr>
          <td className="tc">
            <h4>Firm offers</h4>
            {offerButton}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="tc bb b--light-grey bt-0-s pa3">
            <span className="glyphicon glyphicon-file pt1" aria-hidden="true"></span>
            <p>There are no firm offers on the market at this time.</p>
          </td>
        </tr>
      </tbody>
  </table>
  }
}

class NoBids extends Component {
  render() {
    return <table className="table dib w-50 w-100s mb0 bl b--light-grey bl-0s">
      <thead>
        <tr>
          <td className="tc">
            <h4>Firm bids</h4>
            <a className="btn btn-primary darkgrey bg-lightgrey cursor-na mb2" role="button">No firm bids available</a>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="tc bb b--light-grey bt-0-s pa3">
            <span className="glyphicon glyphicon-file pt1" aria-hidden="true"></span>
            <p>There are no firm bids on the market at this time.</p>
          </td>
        </tr>
      </tbody>
  </table>
  }
}

class OffersTable extends Component {
    checkCreatability(e,status) {
      e.preventDefault();
      const silo = this.props.silo
      const url = `/offers/new?bhc_site_name=${silo.bhc_site_name}&bulk_handler_code=${silo.bulk_handler_code}&grain_type_name=${silo.grain_type}&bin_grade_code=${silo.bin_grade}&grain_season=${silo.grain_season}`

      $.ajax({
          url: `${this.props.silo.orders_service_url}/tradable_grades/${silo.bin_grade}?bhc_site_name=${silo.bhc_site_name}&bulk_handler_code=${silo.bulk_handler_code}`,
          type: 'GET',
          success: () => {
            location.href = url
          },
          error: (request, errorThrown) => {
            if (request.status == 409) {
              $('#nonTradableGradeModal').modal('show')
            } else {
              $('#exchangeUnavailableModal').modal('show')
                console.log(errorThrown);
            }
          }
      })
    }

    render() {
      const silo = this.props.silo
      const setPriceButton = this.props.exchange_mapped ? <button type="button" className="btn btn-primary retail-button-background-colour" onClick={this.checkCreatability.bind(this)}>Create offer</button> : <div>
                                                                                                                                                                                                                      <button type="button" className="btn btn-primary retail-button-background-colour" data-toggle="modal" data-target="#mappingContactForm">
                                                                                                                                                                                                                        Create offer
                                                                                                                                                                                                                      </button>
                                                                                                                                                                                                                      <MappingContactForm></MappingContactForm>
                                                                                                                                                                                                                    </div>

      var offers = []

      if (!_.isEmpty(this.props.clearOffersSnapshot)) {
        offers = this.props.clearOffersSnapshot.map(offer => {
            const key = `${offer.offer_price}.${offer.offer_quantity}`

            return <tr key={key}>
                <td><FormattedCurrency value={offer.offer_price}/></td>
                <td className="text-right">{offer.offer_quantity}mt</td>
            </tr>
        })
      }

      const maxPadding = 3 // up to 3 trades or rows of dashes in case of less
      const paddingLength = offers.length > maxPadding ? 0 : (maxPadding - offers.length)
      const padding = []

      _.times(paddingLength, i => {
          padding.push(<tr key={`padding.${i}`}>
              <td>-</td>
              <td className="text-right">-</td>
          </tr>)
      })

      const tableContent = offers.length == 0 ? <NoOffers silo={silo} exchange_mapped={this.props.exchange_mapped}></NoOffers> : <table className="table dib overflow-y-auto nowrap w-50 w-100s mb0 bb b--light-grey">
                                                                                                                      <thead>
                                                                                                                        <tr>
                                                                                                                          <td colSpan="2" className="w-100 tc">
                                                                                                                            <h4>Firm offers</h4>
                                                                                                                            {setPriceButton}
                                                                                                                          </td>
                                                                                                                        </tr>
                                                                                                                        <tr>
                                                                                                                          <td className="bt-0"><h4 className="mb0">Offer price</h4></td>
                                                                                                                          <td className="text-right bt-0"><h4 className="mb0">Offer quantity</h4></td>
                                                                                                                        </tr>
                                                                                                                      </thead>
                                                                                                                      <tbody>
                                                                                                                        {offers}
                                                                                                                        {padding}
                                                                                                                      </tbody>
                                                                                                                   </table>

      return tableContent
    }
}

class BidsTable extends Component {
  checkCreatability(e,status) {
    e.preventDefault();
    const silo = this.props.silo
    const url = `/offers/new?bhc_site_name=${silo.bhc_site_name}&bulk_handler_code=${silo.bulk_handler_code}&grain_type_name=${silo.grain_type}&bin_grade_code=${silo.bin_grade}&grain_season=${silo.grain_season}&price=${this.maxBidPrice}`

    $.ajax({
        url: `${this.props.silo.orders_service_url}/tradable_grades/${silo.bin_grade}?bhc_site_name=${silo.bhc_site_name}&bulk_handler_code=${silo.bulk_handler_code}`,
        type: 'GET',
        success: () => {
          location.href = url
        },
        error: (request, errorThrown) => {
          if (request.status == 409) {
            $('#nonTradableGradeModal').modal('show')
          } else {
            $('#exchangeUnavailableModal').modal('show')
            console.log(errorThrown);
          }
        }
    })
  }

  render() {
    var bids = []

    if (!_.isEmpty(this.props.clearBidsSnapshot)) {
      bids = this.props.clearBidsSnapshot.map(bid => {
          const key = `${bid.bid_price}.${bid.bid_quantity}`

          return <tr key={key}>
              <td><FormattedCurrency value={bid.bid_price}/></td>
              <td className="text-right">{bid.bid_quantity}mt</td>
          </tr>
      })
      this.maxBidPrice = Math.max.apply(Math,this.props.clearBidsSnapshot.map(b => { return b.bid_price }))
    }

    const silo = this.props.silo

    const sellButton = this.props.exchange_mapped ? <button type="button" className="btn btn-primary retail-button-background-colour" onClick={this.checkCreatability.bind(this)}>Sell at <FormattedCurrency value={this.maxBidPrice}/></button> : <div>
                                                                                                                                                                                                                                                <button type="button" className="btn btn-primary retail-button-background-colour" data-toggle="modal" data-target="#mappingContactForm">
                                                                                                                                                                                                                                                  Sell at <FormattedCurrency value={this.maxBidPrice} />
                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                <MappingContactForm></MappingContactForm>
                                                                                                                                                                                                                                              </div>

    const maxPadding = 3 // up to 3 trades or rows of dashes in case of less
    const paddingLength = bids.length > maxPadding ? 0 : (maxPadding - bids.length)
    const padding = []

    _.times(paddingLength, i => {
        padding.push(<tr key={`padding.${i}`}>
            <td>-</td>
            <td className="text-right">-</td>
        </tr>)
    })

    const tableContent = bids.length == 0 ? <NoBids exchange_mapped={this.props.exchange_mapped}></NoBids> : <table className="table dib overflow-y-auto nowrap w-50 w-100s mb0 bb bl bl-0s b--light-grey">
                                                                                                              <thead>
                                                                                                                <tr>
                                                                                                                  <td colSpan="2" className="w-100 tc">
                                                                                                                    <h4>Firm bids</h4>
                                                                                                                    {sellButton}
                                                                                                                  </td>
                                                                                                                </tr>
                                                                                                                <tr>
                                                                                                                  <td className="bt-0"><h4 className="mb0">Bid price</h4></td>
                                                                                                                  <td className="text-right bt-0"><h4 className="mb0">Bid quantity</h4></td>
                                                                                                                </tr>
                                                                                                              </thead>
                                                                                                              <tbody>
                                                                                                                {bids}
                                                                                                                {padding}
                                                                                                              </tbody>
                                                                                                           </table>

    return tableContent
  }
}



class ExchangeMarket extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.clearPricesFlux = ClearPricesFlux
    this.binGradeChangeFlux = PricesFlux
  }

  componentDidMount() {
    this.binGradeChangeFlux.listen(this.onChangeBinGrade.bind(this))
    this.clearPricesFlux.listen(this.onChangeCGX.bind(this))
    this.clearPricesFlux.fetch()
  }

  componentWillUnmount() {
    this.binGradeChangeFlux.unlisten(this.onChangeBinGrade.bind(this))
    this.clearPricesFlux.unlisten(this.onChangeCGX.bind(this))
  }

  onChangeBinGrade() {
    this.setState({clearSiteMetadata: null})
    this.setState({clearOffersSnapshot: null})
    this.setState({clearBidsSnapshot: null})
    this.setState({clearPortZoneSnapshot: null})
  }

  onChangeCGX() {
    var clearSiteMetadata = this.state.clearSiteMetadata
    var clearPortZoneSnapshot = this.state.clearPortZoneSnapshot
    var clearOffersSnapshot = this.state.clearOffersSnapshot
    var clearBidsSnapshot = this.state.clearBidsSnapshot
    var currentCGXState = this.clearPricesFlux.state

    if (!_.isEmpty(currentCGXState) && currentCGXState.clearSiteMetadata !== null) {
      clearSiteMetadata = currentCGXState.clearSiteMetadata
    }

    if (!_.isEmpty(currentCGXState) && currentCGXState.clearPortZoneSnapshot !== null) {
      clearPortZoneSnapshot = currentCGXState.clearPortZoneSnapshot
    }

    if (!_.isEmpty(currentCGXState) && currentCGXState.clearOffersSnapshot !== null) {
      clearOffersSnapshot = currentCGXState.clearOffersSnapshot
    }

    if (!_.isEmpty(currentCGXState) && currentCGXState.clearBidsSnapshot !== null) {
      clearBidsSnapshot = currentCGXState.clearBidsSnapshot
    }

    this.setState({ clearSiteMetadata: clearSiteMetadata,
                    clearPortZoneSnapshot: clearPortZoneSnapshot,
                    clearOffersSnapshot: clearOffersSnapshot,
                    clearBidsSnapshot: clearBidsSnapshot
                  })
  }

  renderContent(content) {
      const showNearByTrades = !_.isEmpty(this.state.clearPortZoneSnapshot)
      const recentTradeText = showNearByTrades ? <p className="di">Most recent nearby trade <FormattedCurrency value={this.state.clearPortZoneSnapshot[0].recent_trade_delivered_port_equivalent}/> {this.props.silo.port_name} port equivalent <small> <Ago date={this.state.clearPortZoneSnapshot[0].last_updated_at} autoUpdate={true} tooltipFormat="long"/></small></p> : null
      const nearByTradesLink = showNearByTrades ? <a data-toggle="modal" data-target="#tradesModal">
                                                                     Click here to see more nearby trades on Clear Grain Exchange
                                                                 </a> : null
      const moreInformationModal = <a data-toggle="modal" data-target="#more-information-modal">Click here for more information</a>
      return <div className="trade-summary site-trade-summary panel panel-default">
        <div className="market-status-strip">
          <div className="fw6 ttu f4 bg-green">
            <p className="white pt1 pb1 pl2 ma0">Clear Grain Exchange: Market Open</p>
          </div>
        </div>

        <div className="panel-heading">
          <ClearGrainOverview code={this.props.silo.bin_grade} season={this.props.silo.grain_season} />
        </div>
        {content}
        <div className="panel-footer bt-0">
          {recentTradeText}
          <p className="mb0">{nearByTradesLink}</p>
          <p className="mb0">{moreInformationModal}</p>
        </div>
      </div>
  }

  render() {
    const clearSiteMetadata = this.state.clearSiteMetadata

    if (clearSiteMetadata) {
        const offersBox = <OffersTable silo={this.props.silo} clearSiteMetadata={clearSiteMetadata}
                                       clearOffersSnapshot={this.state.clearOffersSnapshot}
                                       exchange_mapped={this.props.exchange_mapped} />
        const bidsBox = <BidsTable silo={this.props.silo} clearSiteMetadata={clearSiteMetadata}
                                   clearBidsSnapshot={this.state.clearBidsSnapshot}
                                   exchange_mapped={this.props.exchange_mapped} />
        const clearPortZoneSnapshotModal = this.state.clearPortZoneSnapshot ? <ClearGrainPortZoneSnapshotTable clearPortZonePrices={this.state.clearPortZoneSnapshot}
                                                                                 portEquivalent={this.props.silo.port_equivalent}
                                                                                 pricingLabel={this.props.silo.pricing_label}
                                                                                 freightRate={this.props.silo.freight_rate}
                                                                                 binGrade={this.props.silo.bin_grade}
                                                                                 portName={this.props.silo.port_name} /> : null

        return this.renderContent(<div>{offersBox}
                                       {bidsBox}
                                       {clearPortZoneSnapshotModal}
                                       <MoreInformationModal />
                                  </div>)
    }

    return this.renderContent(<div className="exchange-market-animation-wrapper loading-animation-wrapper-site">
        <ClearLoadingAnimation />
    </div>)
  }
}

export default ExchangeMarket
