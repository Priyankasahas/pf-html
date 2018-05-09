import React, { Component } from 'react'
import reactMixin from 'react-mixin'
import ReactIntl, { FormattedNumber } from 'react-intl'

class FormattedCurrency extends Component {
    render() {
        return <FormattedNumber value={this.props.value} format="AUD" />
    }
}

FormattedCurrency.defaultProps = {
    locales: ["en-US"],
    formats: {
        number: {
            AUD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }, // USD prevents $A AUD format
        }
    }
}

reactMixin.onClass(FormattedCurrency, ReactIntl.IntlMixin)

export default FormattedCurrency
