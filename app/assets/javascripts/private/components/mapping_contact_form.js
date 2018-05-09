import React, { Component } from 'react'

class MappingContactForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
          successfulSubmission: false,
          hasErrors: false,
          buttonLabel: this.props.button_label
        }
    }

    componentDidMount() {
        var ngrInput = React.findDOMNode(this.refs.mappingContactNgr)
        $(ngrInput).bind('keyup change blur', this.validate.bind(this))

        var nameInput = React.findDOMNode(this.refs.mappingContactName)
        $(nameInput).bind('keyup change blur', this.validate.bind(this))

        var phoneInput = React.findDOMNode(this.refs.mappingContactPhone)
        $(phoneInput).bind('keyup change blur', this.validate.bind(this))

        var submitButton = React.findDOMNode(this.refs.submitButton)
        $(submitButton).bind('click', this.validateAll.bind(this))
    }

    validate(e, status) {
      const refName = _.camelCase(e.target.id)
      const formRefName = refName + 'Form'

      this.validateField(refName, formRefName)
    }

    validateAll() {
      this.validateField('mappingContactNgr', 'mappingContactNgrForm')
      this.validateField('mappingContactName', 'mappingContactNameForm')
      this.validateField('mappingContactPhone', 'mappingContactPhoneForm')
    }

    validateField(refName, formRefName) {
      const input = React.findDOMNode(this.refs[refName])
      this.setState({hasErrors: false})
      $(React.findDOMNode(this.refs[formRefName])).removeClass('has-error')
      if (_.isEmpty(input.value)) {
        this.setState({hasErrors: true})
        $(React.findDOMNode(this.refs[formRefName])).addClass('has-error')
      }
    }

    postMappingContactForm(e, status) {
      e.preventDefault()

      if (!this.state.hasErrors) {
        const content = {}
        content["mapping_contact"] = {}
        content["mapping_contact"]["ngr"] = this.refs.mappingContactNgr.getDOMNode().value
        content["mapping_contact"]["name"] = this.refs.mappingContactName.getDOMNode().value
        content["mapping_contact"]["phone"] = this.refs.mappingContactPhone.getDOMNode().value

        $.ajax({
            url: '/mapping_contact',
            type: 'POST',
            data: JSON.stringify(content),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: (data) => {
              this.setState({successfulSubmission: true})
              setTimeout(() => {
                $('#mappingContactForm').modal('hide')
                this.setState({successfulSubmission: false})
              }, 1800);
            },
            error: (textStatus, errorThrown) => {
                alert(textStatus.statusText)
            }
        })
      }
    }

    render() {
      var submitButton = this.state.successfulSubmission ? <div className="btn btn-default btn-success mt2 mb1"><div className="checkmark animated bounceInUp"></div></div> :
                                                           <input type="submit" name="commit" value="Submit" className="btn btn-default retail-button-background-colour mt2 mb1 fw5" ref="submitButton" />

      return <div className="modal mapping-contact-form tl ws-normal fade" id="mappingContactForm" tabindex="-1" role="dialog" aria-labelledby="mappingContactForm">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content modal-body center pt2 pr8 pb2 pl8 pr2-s pl2-s">
                      <div className="modal-header bb-0 pb0">
                        <h3 className="modal-title retail-text-colour" id="mappingContactForm">Additional information needed</h3>
                        <p className="black">
                        Clear Grain Exchange is an industry platform that enables growers to offer their grain at their price in an open market
                        to all buyers, with the comfort of secure settlement.
                        </p>
                        <p className="black">
                        If you would like to put a price on your grain simply fill out the details below and someone from Clear Grain Exchange
                        will be in touch. Its FREE to register an account and FREE to offer and edit your offer at anytime.
                        </p>
                      </div>
                      <div className="modal-body black pt0 overflow-hidden">
                        <div className="mapping-contact-form">
                          <div className="row">
                          <form id="mappingContactForm" onSubmit={this.postMappingContactForm.bind(this)}>
                            <div className="col-xs-12" ref="mappingContactNgrForm">
                              <label className="string required control-label" for="mapping_contact_ngr">NGR</label>
                              <input ref="mappingContactNgr" className="string required form-control mw22" aria-required="true" type="text" name="mapping_contact[ngr]" id="mapping_contact_ngr" />
                            </div>
                            <div className="col-xs-12" ref="mappingContactNameForm">
                              <label className="string required control-label" for="mapping_contact_name">Name</label>
                              <input ref="mappingContactName" className="string required form-control mw22" aria-required="true" type="text" name="mapping_contact[name]" id="mapping_contact_name" />
                            </div>
                            <div className="col-xs-12" ref="mappingContactPhoneForm">
                              <label className="string required control-label mt1" for="mapping_contact_phone">Contact phone number</label>
                              <input ref="mappingContactPhone" className="string required form-control mw22" aria-required="true" type="text" name="mapping_contact[phone]" id="mapping_contact_phone" />
                            </div>
                            <div className="col-xs-12 form-group">
                              {submitButton}
                              <p className="black">or call 1800 000 410 to find out more details.</p>
                              <div className="cgx-icon fl ml3-5 mt1"></div>
                            </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    }
}

export default MappingContactForm
