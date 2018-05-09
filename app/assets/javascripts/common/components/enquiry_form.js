import React, { Component } from 'react'

class EnquiryForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
          successfulSubmission: false,
          hasErrors: false
        }
    }

    componentDidMount() {
        var firstNameInput = React.findDOMNode(this.refs.enquiryFirstName)
        $(firstNameInput).bind('keyup change blur', this.validate.bind(this))

        var lastNameInput = React.findDOMNode(this.refs.enquiryLastName)
        $(lastNameInput).bind('keyup change blur', this.validate.bind(this))

        var emailInput = React.findDOMNode(this.refs.enquiryEmail)
        $(emailInput).bind('keyup change blur', this.validate.bind(this))

        var phoneInput = React.findDOMNode(this.refs.enquiryPhone)
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
      this.validateField('enquiryFirstName', 'enquiryFirstNameForm')
      this.validateField('enquiryLastName', 'enquiryLastNameForm')
      this.validateField('enquiryEmail', 'enquiryEmailForm')
      this.validateField('enquiryPhone', 'enquiryPhoneForm')
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

    postEnquiryForm(e, status) {
      e.preventDefault()

      if (!this.state.hasErrors) {
        const content = {}
        content["enquiry"] = {}
        content["enquiry"]["first_name"] = this.refs.enquiryFirstName.getDOMNode().value
        content["enquiry"]["last_name"] = this.refs.enquiryLastName.getDOMNode().value
        content["enquiry"]["email"] = this.refs.enquiryEmail.getDOMNode().value
        content["enquiry"]["phone"] = this.refs.enquiryPhone.getDOMNode().value
        content["enquiry"]["port_zone"] = this.refs.enquiryPortZone.getDOMNode().value
        content["enquiry"]["trading_name"] = this.refs.enquiryTradingName.getDOMNode().value
        content["enquiry"]["ngr_number"] = this.refs.enquiryNgrNumber.getDOMNode().value
        content["enquiry"]["comments"] = this.refs.enquiryComments.getDOMNode().value
        content["enquiry"]["package"] = this.refs.enquiryPackage.getDOMNode().value

        $.ajax({
            url: '/enquiry',
            type: 'POST',
            data: JSON.stringify(content),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: (data) => {
              this.setState({successfulSubmission: true})
              setTimeout(() => {
                $('#emailForm').modal('hide')
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
      const portZones = this.props.port_zones.map(zone => {
          const name = zone.name
          const key = `${name}`

          return <option key={key} value={name}>{name}</option>
      })

      var submitButton = this.state.successfulSubmission ? <div className="btn btn-default btn-success"><div className="checkmark animated bounceInUp"></div></div> :
                                                           <input type="submit" name="commit" value="Submit" className="btn" ref="submitButton" />

      return <div className="modal email-enquiry-form fade" id="emailForm" tabindex="-1" role="dialog" aria-labelledby="emailForm">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="mascot-email-us hidden-xs"  data-toggle="mascot-email-us-tooltip" data-placement="top" title="We'll get in touch right away!">
                          <div className="mascot-image"></div>
                        </div>
                        <h4 className="modal-title" id="emailForm">Send email enquiry</h4>
                        <p>Fill in the enquiry form below and we will get in touch as soon as possible</p>
                      </div>
                      <div className="modal-body">
                        <div className="upgrade-form">
                          <div className="row">
                          <form id="enquiryForm" onSubmit={this.postEnquiryForm.bind(this)}>
                            <input ref="enquiryPackage" className="string required form-control hidden" aria-required="true" type="text" name="enquiry[package]" id="enquiry_package" />
                            <div className="col-xs-12 col-md-6 form-group" ref="enquiryFirstNameForm">
                              <label className="string required control-label" for="enquiry_first_name">First name</label>
                              <input ref="enquiryFirstName" className="string required form-control" aria-required="true" type="text" name="enquiry[first_name]" id="enquiry_first_name" />
                            </div>
                            <div className="col-xs-12 col-md-6 form-group" ref="enquiryLastNameForm">
                              <label className="string required control-label" for="enquiry_last_name">Last name</label>
                              <input ref="enquiryLastName" className="string required form-control" aria-required="true" type="text" name="enquiry[last_name]" id="enquiry_last_name" />
                            </div>
                            <div className="col-xs-12 col-md-6 form-group" ref="enquiryEmailForm">
                              <label className="string required control-label" for="enquiry_email">Email</label>
                              <input ref="enquiryEmail" className="string required form-control" aria-required="true" type="email" name="enquiry[email]" id="enquiry_email" />
                            </div>
                            <div className="col-xs-12 col-md-6 form-group" ref="enquiryPhoneForm">
                              <label className="string required control-label" for="enquiry_phone">Mobile phone</label>
                              <input ref="enquiryPhone" className="string required form-control" aria-required="true" type="text" name="enquiry[phone]" id="enquiry_phone" />
                            </div>
                            <div className="col-xs-12 col-md-6 form-group" ref="enquiryPortZoneForm">
                              <label className="select control-label" for="enquiry_port_zone">Port zone</label>
                              <select ref="enquiryPortZone" className="select form-control" aria-required="true" name="enquiry[port_zone]" id="enquiry_port_zone">
                                <option key='blank_zone' value=''></option>
                                {portZones}
                              </select>
                            </div>
                            <div className="col-xs-12 col-md-6 form-group">
                              <label className="string control-label" for="enquiry_trading_name">Trading Name</label>
                              <input ref="enquiryTradingName" className="string form-control" aria-required="true" type="text" name="enquiry[trading_name]" id="enquiry_trading_name" />
                            </div>
                            <div className="col-xs-12 col-md-6 form-group">
                              <label className="string control-label" for="enquiry_ngr_number">NGR Number</label>
                              <input ref="enquiryNgrNumber" className="string form-control" aria-required="false" type="text" name="enquiry[ngr_number]" id="enquiry_ngr_number" />
                            </div>
                            <div className="col-xs-12 form-group">
                              <label className="text control-label" for="enquiry_comments">Comments or questions</label>
                              <textarea ref="enquiryComments" rows="4" className="text form-control" aria-required="false" name="enquiry[comments]" id="enquiry_comments"></textarea>
                            </div>
                            <div className="col-xs-12 form-group">
                              {submitButton}
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

export default EnquiryForm
