class BinGradeSelector {
    constructor(currentSilo, subscriberIsPaidUser, defaultBinGradeCode, snapshotBinGrades) {
      this.currentSilo = currentSilo
      this.snapshotBinGrades = snapshotBinGrades

      this.binGradeSlots = [{'color': '#FFD32F', cssClass: 'yellow'},
                            {'color': '#51AFFF', cssClass: 'blue'}]

      if (subscriberIsPaidUser) {
        this.binGradeSlots.push({'color': '#B988DE', cssClass: 'purple'})
        this.binGradeSlots.push({'color': '#5CB85C', cssClass: 'green'})
      }

      this.updateBinGradesSelection(defaultBinGradeCode)
    }

    colorForBinGrade(binGrade) {
      let target = _.find(this.binGradeSlots,
                          function(binGradeSlot) { return binGradeSlot.binGrade && (binGradeSlot.binGrade === binGrade) })
      return target.color
    }

    cssClassForBinGrade(binGrade) {
      let target = _.find(this.binGradeSlots,
                          function(binGradeSlot) { return binGradeSlot.binGrade && (binGradeSlot.binGrade === binGrade) })
      return target ? target.cssClass : ''
    }

    updateBinGradesSelection(binGrade) {
      if (this.binGradeWillBeSelected(binGrade)) {
        this._addIncomingBinGrade(binGrade)
      } else if (this.binGradeWillBeDeselected(binGrade)) {
        this._removeOutgoingBinGrade(binGrade)
      }
    }

    binGradeWillBeDeselected(binGrade) {
      return _.includes(this.selectedBinGradeCodes(), binGrade) && (this.selectedBinGradeCodes().length > 1)
    }

    binGradeWillBeSelected(binGrade) {
      return !_.includes(this.selectedBinGradeCodes(), binGrade)
    }

    selectedBinGradeCodes() {
      return _.compact(_.map(this.binGradeSlots, 'binGrade'))
    }

    reconcileBinGradesSelection(grainSeason) {
      this.selectedBinGradeCodes().forEach(binGradeCode => {
        if (!_.includes(this._availableSeasons(binGradeCode), grainSeason)) {
          this._removeOutgoingBinGrade(binGradeCode)
        }
      })
    }

    binGradePositionInSnapshot(binGradeCode) {
      return _.indexOf(this._snapshotBinGradeCodes(), binGradeCode)
    }

    _snapshotBinGradeCodes() {
      return this.snapshotBinGrades.map(snapshotBinGrades => {
               return snapshotBinGrades.code
             })
    }

    _availableSeasons(binGradeCode) {
      const binGradeSnapshot = _.find(this.snapshotBinGrades, (b) => { return b.code == binGradeCode })
      return binGradeSnapshot.seasons
    }

    _addIncomingBinGrade(incomingBinGrade) {
      let availableBinGradeSlot = this._availableBinGradeSlot()
      if (availableBinGradeSlot) {
        availableBinGradeSlot.binGrade = incomingBinGrade
        availableBinGradeSlot.order = this._currentOrder() + 1
      } else {
        availableBinGradeSlot = _.last(this.binGradeSlots)
        this._removeOutgoingBinGrade(availableBinGradeSlot.binGrade)
        availableBinGradeSlot.binGrade = incomingBinGrade
        availableBinGradeSlot.order = this._currentOrder() + 1
      }

      this.currentSilo.bin_grade = incomingBinGrade
    }

    _availableBinGradeSlot() {
      return _.find(this.binGradeSlots,
                    function(binGradeSlot) { return !binGradeSlot.binGrade })
    }

    _currentOrder() {
      let orders = this.binGradeSlots.map(binGradeSlot => {
                     return (binGradeSlot.order ? binGradeSlot.order : 0)
                   })
      return _.max(orders)
    }

    _removeOutgoingBinGrade(outgoingBinGrade) {
      let outgoingBinGradeSlot = this._binGradeSlotWith(outgoingBinGrade)
      outgoingBinGradeSlot.binGrade = null
      let outgoingBinGradeOrder = outgoingBinGradeSlot.order
      outgoingBinGradeSlot.order = null

      this._reorder(outgoingBinGradeOrder)
      this._setCurrentBinGrade()
    }

    _binGradeSlotWith(targetBinGrade) {
      return _.find(this.binGradeSlots,
                    function(binGradeSlot) { return binGradeSlot.binGrade && (binGradeSlot.binGrade === targetBinGrade) })
    }

    _setCurrentBinGrade() {
      let lastSelected = _.max(this.binGradeSlots,
                               function(binGradeSlot) { return (binGradeSlot.order ? binGradeSlot.order : 0) })
      this.currentSilo.bin_grade = lastSelected.binGrade
    }

    _reorder(outgoingBinGradeOrder) {
      this.binGradeSlots.forEach(binGradeSlot => {
        if (binGradeSlot.order && (binGradeSlot.order > outgoingBinGradeOrder)) {
          binGradeSlot.order -= 1
        }
      })
    }
}

export default BinGradeSelector
