import React, { Component } from 'react'
import c3 from 'c3'
import PricesFlux from './common/prices_flux'
import ClearPricesFlux from './common/clear_prices_flux'
import ChartZoomFlux from './common/chart_zoom_flux'
import BinGrades from './snapshot_bin_grades'
import MobileDetect from 'mobile-detect'
import ProfarmerLoadingAnimation from './profarmer_loading_animation'
import CurrentSilo from './common/current_silo'

const mobileDetect = new MobileDetect(window.navigator.userAgent).mobile();

class PriceChartHeader extends Component {
  constructor(props) {
    super(props)
    this.clearPricesFlux = ClearPricesFlux
    this.pricesFlux = PricesFlux
    this.state = {
      bhcSiteName: props.bhcSiteName,
      portName: props.portName,
      bulkHandlerCode: props.bulkHandlerCode,
      binGradeCode: props.binGradeCode,
      grainTypeName: props.grainTypeName,
      todaysTradePrice: null
    }
  }

  componentDidMount() {
    this.clearPricesFlux.listen(this.onClearSnapshotChange.bind(this))
    this.pricesFlux.listen(this.onChangeGrade.bind(this))
  }

  componentWillUnmount() {
    this.clearPricesFlux.unlisten(this.onClearSnapshotChange.bind(this))
    this.pricesFlux.unlisten(this.onChangeGrade.bind(this))
  }

  onClearSnapshotChange() {
    var todaysTradePrice = this.state.todaysTradePrice
    var currentCGXState = this.clearPricesFlux.state

    if (!_.isEmpty(currentCGXState) && !_.isEmpty(currentCGXState.clearSnapshot)) {
      todaysTradePrice = currentCGXState.clearSnapshot[0].recent_trade
    } else {
      todaysTradePrice = null
    }

    this.setState({todaysTradePrice: todaysTradePrice})
  }

  onChangeGrade() {
    const incomingBinGrade = CurrentSilo.bin_grade

    this.setState({binGradeCode: incomingBinGrade})
  }

  render() {
    const todaysTradePrice = this.state.todaysTradePrice ? <div className="dib mr2">
                                                             <h2>${parseFloat(this.state.todaysTradePrice).toFixed(2)}</h2>
                                                             <p>Todays trade</p>
                                                           </div> : null
    return <div className="dib">
      <div className="dib mr2">
        <h2>{this.state.bhcSiteName}</h2>
        <p>{this.state.portName} - {this.state.bulkHandlerCode}</p>
      </div>
      <div className="dib mr2">
        <h2>{this.state.binGradeCode}</h2>
        <p>{this.state.grainTypeName}</p>
      </div>
      {todaysTradePrice}
    </div>
  }
}

class PriceChartSeason extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSeason: props.currentSeason,
            currentBinGrade: props.currentBinGrade
        }
    }

    componentDidMount() {
        PricesFlux.listen(this.onChange.bind(this))
    }

    componentWillUnmount() {
        PricesFlux.unlisten(this.onChange.bind(this))
    }

    _availableSeasons(binGradeCode) {
        const binGradeSnapshot = _.find(this.props.snapshot.bin_grades, (b) => { return b.code == binGradeCode })
        return binGradeSnapshot.seasons.sort()
    }

    onChange() {
        const incomingBinGrade = CurrentSilo.bin_grade
        var incomingGrainSeason = CurrentSilo.grain_season

        // either bin grade or season changes, for bin grade -> re-render as its potentially new season,
        // in case of season, re-render as the selected season changes.

        this.setState({currentBinGrade: incomingBinGrade, currentSeason: incomingGrainSeason})
    }

    handleClick(e, status) {
        e.preventDefault();
        const currentSeason = CurrentSilo.grain_season

        const incomingSeason = e.target.getAttribute("value")
        const hasChangedGrainSeason = incomingSeason != currentSeason

        if (hasChangedGrainSeason) {
          PricesFlux.actions.updateSeason(incomingSeason)
        }
    }

    render() {
        const startYear = parseInt(this.state.currentSeason.substring(2))
        const endYear = `${startYear + 1}`

        const seasons = this._availableSeasons(this.state.currentBinGrade).map(season => {
            const seasonStartYear = season.substring(2)
            const seasonEndYear = `${(parseInt(seasonStartYear) + 1)}`
            const key = `${seasonStartYear}.${seasonEndYear}`
            const seasonLabel = `${seasonStartYear}/${seasonEndYear}`

            return <li key={key} onClick={this.handleClick.bind(this)}>
                <a href="#" value={season}>{seasonLabel}</a>
            </li>
        })
        const icon = this.props.isChilledOut ? <span className="season-icon moon-icon fl"></span> : <span className="season-icon sun-icon fl"></span>

        return <div className="price-season dib fl fn-m dropdown mt1 mr2 mb2">
            <small className="db">Season</small>
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2"
                    data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="true">{icon}
                    {startYear}/{endYear}  <span className="caret"></span>
            </button>

            <ul className="dropdown-menu br0" aria-labelledby="dropdownMenu2">
              {seasons}
            </ul>
        </div>
    }
}

class PriceChartZoom extends Component {
    handleChange(e, status) {
        e.preventDefault();
        const zoomRange = parseInt(e.target.getAttribute('value'))
        $('#dropdownMenu1').html('<span class="glyphicon glyphicon-calendar" ariaHidden="true"></span> ' + zoomRange + ' months' + ' <span class="caret"></span>')
        ChartZoomFlux.actions.update(zoomRange)
    }

    render() {
        if (mobileDetect === null) {
            var zoomOptions = <ul className="dropdown-menu br0 br0" aria-labelledby="dropdownMenu1">
                <li onClick={this.handleChange.bind(this)}><a href="#" value="3">3 months</a></li>
                <li onClick={this.handleChange.bind(this)}><a href="#" value="6">6 months</a></li>
                <li onClick={this.handleChange.bind(this)}><a href="#" value="12">12 months</a></li>
                <li onClick={this.handleChange.bind(this)}><a href="#" value="24">24 months</a></li>
            </ul>
        } else {
            zoomOptions = <ul className="dropdown-menu br0" aria-labelledby="dropdownMenu1">
                <li onClick={this.handleChange.bind(this)}><a href="#" value="3">3 months</a></li>
                <li onClick={this.handleChange.bind(this)}><a href="#" value="6">6 months</a></li>
            </ul>
        }

        if (this.props.limitedZoomOptions) {
          zoomOptions = <ul className="dropdown-menu br0" aria-labelledby="dropdownMenu1">
              <li className="upgrade-text">
                <h6>Upgrade to access 24 month historical prices</h6>
                <h6>
                  <a target="_blank" href="/upgrade" className="blue-link">Upgrade now</a>
                </h6>
              </li>
          </ul>
        }

        var zoomLabel = mobileDetect === null ? '12 months' : '6 months'
        zoomLabel = this.props.limitedZoomOptions ? '3 months' : zoomLabel

        return <div className="price-chart-zoom dib fl fn-m dropdown mt1 mr2">
            <small className="db">Date range</small>
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1"
                    data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="true">
                <span className="glyphicon glyphicon-calendar" ariaHidden="true"></span> {zoomLabel} <span
                className="caret"></span>
            </button>
            {zoomOptions}
        </div>
    }
}

class PriceChartCanvas extends Component {
    constructor(props) {
        super(props)
        this.pricesFlux = PricesFlux
        this.chartZoomFlux = ChartZoomFlux
        this.heroBinGrade = props.hero
        this.currentBinGrade = props.silo.bin_grade
        this.currentGrainSeason = props.silo.grain_season
        this.state = {
            zoomLevel: 12
        }
    }

    componentDidMount() {
        this.props.silo.fetchHistoricalPrices(this.drawChart.bind(this))
        PricesFlux.listen(this.onPricesChange.bind(this))
        ChartZoomFlux.listen(this.onZoomChange.bind(this))
    }

    componentWillUnmount() {
        PricesFlux.unlisten(this.onPricesChange.bind(this))
        ChartZoomFlux.unlisten(this.onZoomChange.bind(this))
        this.chart = this.chart.destroy()
    }

    getZoomDate(pricesLastUpdatedAt, zoomLevel) {
        var d = new Date(pricesLastUpdatedAt)
        d.setMonth(d.getMonth() - zoomLevel)
        return this.formatDate(d)
    }

    formatDate(date) {
        const d = new Date(date)
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    }

    onZoomChange() {
        const newZoomLevel = this.chartZoomFlux.state.zoomLevel
        const pricesLastUpdatedAt = this.props.pricesLastUpdatedAt

            if (newZoomLevel === 24) {
                this.chart.unzoom()
            } else {
                this.zoomToLevel(newZoomLevel)
            }
    }

    zoomToLevel(newZoomLevel) {
        const pricesLastUpdatedAt = this.props.pricesLastUpdatedAt
        const zoomDate = this.getZoomDate(pricesLastUpdatedAt, newZoomLevel)
        this.chart.zoom([zoomDate, this.formatDate(pricesLastUpdatedAt)])
    }

    onPricesChange() {
        const incomingGrainSeason = this.props.silo.grain_season
        const currentGrainSeason = this.currentGrainSeason

        const hasSeasonChanged = incomingGrainSeason != currentGrainSeason

        if (hasSeasonChanged) {
            this.onPricesChangeGrainSeason()
        } else {
            this.onPricesChangeBinGrade()
        }
    }

    onPricesChangeGrainSeason() {
        const incomingBinGrade = this.props.silo.bin_grade
        const incomingGrainSeason = this.props.silo.grain_season

        this.props.silo.fetchHistoricalPrices(function() {
            const priceRequest = {
                json: this.props.silo.historicalPrices(),
                mimeType: 'json',
                unload: true
            }

            this.chart.load(priceRequest)
        }.bind(this))

        this.currentBinGrade = incomingBinGrade
        this.currentGrainSeason = incomingGrainSeason
    }

    onPricesChangeBinGrade() {
        const incomingBinGrade = this.props.silo.bin_grade

        const currentChartBinGrades = _.map(this.chart.data(), 'id')
        const currentSelectedBinGrades = this.props.silo.binGradeSelector.selectedBinGradeCodes()
        const removedBinGrades = _.difference(currentChartBinGrades, currentSelectedBinGrades)
        const addedBinGrades = _.difference(currentSelectedBinGrades, currentChartBinGrades)
        if (addedBinGrades.length > 0) {
            this.props.silo.fetchHistoricalPrices(function() {
                const priceRequest = {
                    json: this.props.silo.historicalPrices(),
                    mimeType: 'json'
                }

                if (removedBinGrades.length > 0) {
                    priceRequest.unload = removedBinGrades
                }

                this.chart.load(priceRequest)
            }.bind(this))
        } else {
            if (removedBinGrades.length > 0) {
                this.chart.unload({ids: removedBinGrades})
            }
        }

        this.currentBinGrade = incomingBinGrade
    }

    drawChart() {
        const pricesLastUpdatedAt = this.props.pricesLastUpdatedAt
        const showThreeMonthChart = this.props.limitedZoomOptions
        var extent = mobileDetect !== null ?
                  [this.getZoomDate(pricesLastUpdatedAt, 6), this.formatDate(pricesLastUpdatedAt)] :
                  [this.getZoomDate(pricesLastUpdatedAt, 12), this.formatDate(pricesLastUpdatedAt)]
        extent = this.props.limitedZoomOptions ? [this.getZoomDate(pricesLastUpdatedAt, 3), this.formatDate(pricesLastUpdatedAt)] :extent

        this.chart = c3.generate({
            bindto: '#prices_chart',
            data: {
                json: this.props.silo.historicalPrices(),
                mimeType: 'json',
                x: 'x',
                color: (color, d) => {
                    if (d.id) {
                        return this.props.silo.binGradeSelector.colorForBinGrade(d.id)
                    } else {
                        return this.props.silo.binGradeSelector.colorForBinGrade(d)
                    }
                }
            },
            axis: {
               x: {
                   type: 'timeseries',
                   tick: {
                       format: '%d-%m-%Y',
                       count: 52,
                       outer: false,
                       culling: { max: 12 }
                   },
                   extent: extent
               },
               y: {
                   tick: {
                       outer: false
                   }
               }
            },
            tooltip: {
                format: {
                    title: function (x) {
                        return ("0" + x.getDate()).slice(-2) + "-" + ("0"+(x.getMonth()+1)).slice(-2) + "-" + x.getFullYear()
                    },
                    value: (value, ratio, id) => {
                        var format = d3.format('$.2f')
                        return format(value)
                    }
                },
                contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                    // The following code are customized from c3 tooltip.js: https://github.com/masayuki0812/c3/blob/master/src/tooltip.js#L27
                    // The order within the tooltip needs to be customized to be based on bin grades pills order from left to right
                    // The merchants and spreads need to be included within tooltip content as well
                    // Please refer to http://c3js.org/reference.html#tooltip-contents
                    var $$ = this, config = $$.config,
                        titleFormat = config.tooltip_format_title || defaultTitleFormat,
                        nameFormat = config.tooltip_format_name || function (name) { return name; },
                        valueFormat = config.tooltip_format_value || defaultValueFormat,
                        numberFormat = d3.format('.2f'),
                        text, i, title, value, name, bgcolor, previousGradeValue,
                        subscriberIsPaidUser = CurrentSilo.subscriberIsPaidUser,
                        isPortIndex = CurrentSilo.isPortIndex(),
                        numberOfColumns = subscriberIsPaidUser? (isPortIndex ? '3' : '4') : '2';

                    d.sort(function(a, b) {
                        let aOrder = CurrentSilo.binGradeSelector.binGradePositionInSnapshot(a.id)
                        let bOrder = CurrentSilo.binGradeSelector.binGradePositionInSnapshot(b.id)
                        return aOrder - bOrder
                    });

                    for (i = 0; i < d.length; i++) {
                        if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

                        if (! text) {
                            title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                            text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan=" + numberOfColumns + ">" + title + "</th></tr>" : "");
                        }

                        value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                        if (value !== undefined) {
                            // Skip elements when their name is set to null
                            if (d[i].name === null) { continue; }
                            name = nameFormat(d[i].name, d[i].ratio, d[i].id, d[i].index);
                            bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

                            var signedSpread = '-'
                            var currentGradeValue = d[i].value
                            if (previousGradeValue !== undefined) {
                                var spread = currentGradeValue - previousGradeValue
                                signedSpread = spread > 0 ? `+${numberFormat(spread)}` : numberFormat(spread)
                            }
                            if (previousGradeValue == undefined) {
                              previousGradeValue = currentGradeValue
                            }

                            text += "<tr class='" + $$.CLASS.tooltipName + "-" + $$.getTargetSelectorSuffix(d[i].id) + "'>";
                            text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                            text += "<td class='value'>" + value + "</td>";
                            if (subscriberIsPaidUser) {
                                text += "<td class='value'>" + signedSpread + "</td>";
                                if (!isPortIndex) {
                                    text += "<td>" + CurrentSilo.historicalPricesMerchant(d[i].id, d[i].index) + "</td>";
                                }
                            }
                            text += "</tr>";
                        }
                    }
                    return text + "</table>";
                }
            },
            point: {
                show: false
            }
        })
    }

    render() {
        const loadingAnimation = this.chart === undefined ? <ProfarmerLoadingAnimation /> : null
        return <div id="prices_chart">{loadingAnimation}</div>
    }
}

class PriceChart extends Component {
    constructor(props) {
      super(props)
    }

    render() {
      const grainTypeClass = 'summary-icon ' + this.props.silo.grain_type.toLowerCase().replace(/\s/g, '') + '-icon'
      const bulkHandlerName = _.isEmpty(this.props.silo.bulk_handler_short_name) ? this.props.silo.bulk_handler_code : this.props.silo.bulk_handler_short_name
      return <div className="panel panel-default price-chart">
          <div className="panel-heading pt0 pr2 pb0 pl1 bb-0">
              <div id='grain-type-icon' className={grainTypeClass}></div>
              <PriceChartHeader bhcSiteName={this.props.silo.bhc_site_name}
                                portName={this.props.silo.port_name}
                                bulkHandlerCode={bulkHandlerName}
                                binGradeCode={this.props.silo.bin_grade}
                                grainTypeName={this.props.silo.grain_type} />
              <div className="fr fn-m">
                <PriceChartSeason currentSeason={this.props.silo.grain_season} currentBinGrade={this.props.silo.bin_grade}
                                  snapshot={this.props.snapshot} isChilledOut={this.props.is_chilled_out}  />
                <PriceChartZoom limitedZoomOptions={this.props.limited_zoom_options} />
              </div>

              <BinGrades silo={this.props.silo} snapshot={this.props.snapshot}/>
          </div>
          <div className="panel-body">
              <PriceChartCanvas ref="chartCanvas" silo={this.props.silo} hero={this.props.hero} snapshot={this.props.snapshot}
                                pricesLastUpdatedAt={this.props.prices_last_updated_at}
                                limitedZoomOptions={this.props.limited_zoom_options} />
              <div id='small-pf-logo' className="pull-left"></div>
          </div>
      </div>
    }
}

export default PriceChart
