import BinGradeSelector from './bin_grade_selector'

class CurrentSilo {
    initBinGradeSelector(subscriberIsPaidUser, defaultBinGradeCode, snapshotBinGrades) {
      this.subscriberIsPaidUser = subscriberIsPaidUser
      this.binGradeSelector = new BinGradeSelector(this, subscriberIsPaidUser, defaultBinGradeCode, snapshotBinGrades)
    }

    fetchHistoricalPrices(callback) {
      let binGradeCodes = this._currentSelectedBinGradeCodes().join(',')
      let historicalPricesUrl = `${this.service_url}/historical_prices?grain_season=${this.grain_season}&bhc_site_name=${this.bhc_site_name}&bulk_handler_code=${this.bulk_handler_code}?include_merchants=true&bin_grade_codes=${binGradeCodes}`

      $.get(historicalPricesUrl)
          .done(function(data) {
            this.historicalPricesData = data
            callback()}.bind(this))
          .fail(function() {
            console.log(`Failed to retrieve the historical prices for ${this.grain_season}, ${this.bhc_site_name}, ${this.bulk_handler_code}, ${this.grain_type}, ${binGradeCodes}.`)
          }.bind(this))
    }

    historicalPrices() {
      let pricesData = _.reduce(this._currentSelectedBinGradeCodes(), function(m, binGradeCode) {
                         m[binGradeCode] = this.historicalPricesData[binGradeCode].prices;
                         return m
                       }.bind(this), {})
      pricesData['x'] = this.historicalPricesData['x']
      return pricesData;
    }

    historicalPricesMerchant(binGradeCode, dataPointIndex) {
      //C3 data point index reflects timeline in ascending order, meanwhile
      //Merchants list reflects timeline in descending order
      //"x":         {"2016-03-09","2016-03-08","2016-03-07","2016-03-04","2016-03-03","2016-03-02"}
      //"merchants": {       "LDA", "Graincorp",       "ADM",    "Nidera",  "Glencore",  "Riverina"}
      //C3 data point index: 2 <=> merchants list index: 3, which is "Nidera"
      let merchantsList = this.historicalPricesData[binGradeCode].merchants
      return merchantsList[merchantsList.length - dataPointIndex - 1]
    }

    isPortIndex() {
      return this.bhc_site_type === 'PortIndex'
    }

    _currentSelectedBinGradeCodes() {
      return this.binGradeSelector.selectedBinGradeCodes()
    }
}

export default new CurrentSilo()
