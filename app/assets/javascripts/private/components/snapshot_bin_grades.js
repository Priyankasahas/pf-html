import React, { Component } from 'react'
import PricesFlux from './common/prices_flux'
import ClearPricesFlux from './common/clear_prices_flux'
import CurrentSilo from './common/current_silo'

class SnapshotBinGrade extends Component {
    handleClick() {
        ClearPricesFlux.actions.updateClearSnapshot()
        const incomingBinGrade = this.props.code
        const availableSeasons = this._availableSeasons(incomingBinGrade)
        var incomingGrainSeason = CurrentSilo.grain_season

        if (CurrentSilo.binGradeSelector.binGradeWillBeSelected(incomingBinGrade) && !_.includes(availableSeasons, incomingGrainSeason)) {
            incomingGrainSeason = _.last(availableSeasons)
        }

        PricesFlux.actions.updateBinGrade({currentBinGrade: incomingBinGrade, currentSeason: incomingGrainSeason})
    }

    _availableSeasons(binGradeCode) {
        const binGradeSnapshot = _.find(this.props.snapshot.bin_grades, (b) => { return b.code == binGradeCode })
        return binGradeSnapshot.seasons.sort()
    }

    _handleTouch(e) {
        e.preventDefault()
        this.handleClick()
    }

    render() {
        return <li onClick={this.handleClick.bind(this)} onTouchStart={this._handleTouch.bind(this)} role="presentation" className={this.props.cssClass}>
                 <a className="bingrade-tooltip" data-toggle="tooltip" data-placement="top" title={this.props.description}>{this.props.code}</a>
               </li>
    }
}

class SnapshotBinGrades extends Component {
    constructor(props) {
        super(props)
        this.pricesFlux = PricesFlux
        this.state = {
            grades: props.snapshot.bin_grades,
            silo: props.silo
        }
    }

    componentDidMount() {
        this.pricesFlux.listen(this.onChange.bind(this))
    }

    componentWillUnmount() {
        this.pricesFlux.unlisten(this.onChange.bind(this))
    }

    onChange() {
        const currentState = this.pricesFlux.state
        const grades = _.isEmpty(currentState) ? this.state.grades : currentState.snapshot.bin_grades

        this.setState({grades: grades})
    }

    render() {
        const grades = this.state.grades.map(b => <SnapshotBinGrade key={b.code} code={b.code} description={b.description}
                                                                    cssClass={this.props.silo.binGradeSelector.cssClassForBinGrade(b.code)}
                                                                    snapshot={this.props.snapshot} />)

        return <div className="snapshot-bin-grades">
            <ul className="nav nav-pills fw5 mt1 mr0 mb0 ml2">{grades}</ul>
        </div>
    }
}

export default SnapshotBinGrades
