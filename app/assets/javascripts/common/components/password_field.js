import React, { Component } from 'react'
import classNames from 'classnames'

class PasswordField extends Component {
    constructor(props) {
        super(props)
        this.state = {
            wrapperClass: this.props.wrapper_class,
            hasError: (this.props.has_error === 'true')
        }
    }

    componentDidMount() {
        var passwordInput = React.findDOMNode(this.refs.passwordInput)
        $(passwordInput).bind('keyup change blur', this.handleChange.bind(this))
    }

    handleChange(e, status) {
        var passwordInput = e.target
        this.clearError()
        if (!this._isValid(passwordInput.value) ||
            !this._matchWith(passwordInput.value, this.props.field_to_match)) {
            this.addError()
        }
    }

    addError() {
        this.setState({hasError: true})
    }

    clearError() {
        this.setState({hasError: false})
    }

    passwordInputElement() {
        return $(React.findDOMNode(this.refs.passwordInput))
    }

    passwordInputValue() {
        return this.passwordInputElement().val()
    }

    _isValid(password) {
        const passwordRegex = /^(?=.*\d).{8,}$/
        return passwordRegex.test(password)
    }

    _matchWith(password, fieldToMatch) {
        if (fieldToMatch) {
            return password === $(`#${fieldToMatch}`).val()
        }
        return true
    }

    _label() {
        return this.props.label ? <label className='password optional control-label' htmlFor={this.props.input_id}>{this.props.label}</label> : null
    }

    render() {
        var wrapperClasses = classNames({'form-group': true,
                                         'password': true,
                                         'optional': true,
                                         'has-error': this.state.hasError})
        wrapperClasses += ` ${this.state.wrapperClass}`

        return <div className={wrapperClasses}>
                   {this._label()}
                   <input ref='passwordInput' className='password optional form-control' type='password' name={this.props.input_name} id={this.props.input_id} autoFocus={this.props.auto_focus} />
               </div>
    }
}

export default PasswordField
