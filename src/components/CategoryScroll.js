import React from 'react'
import FormFieldValidator from './FormFieldValidator'
import FormFieldAlertRow from './FormFieldAlertRow'
import CategoryItemBox from './CategoryItemBox'
import FormFieldWideRow from './FormFieldWideRow'

class CategoryScroll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: ''
    }
  }

  render () {
    return (
      <div className='container'>
        {this.props.heading &&
          <FormFieldWideRow>
            <b>{this.props.heading}</b>
          </FormFieldWideRow>}
        <FormFieldWideRow>
          {!this.props.items.length && <p><b>There are no approved items, yet.</b></p>}
          {(this.props.items.length > 0) &&
            <div className='task'>
              <div className='row h-100'>
                <div className='col-md col h-100'>
                  <table className='task-method-item'>
                    <tbody>
                      {this.props.items.map((item, index) => <CategoryItemBox item={item} key={index} isLoggedIn={this.props.isLoggedIn} type={this.props.type} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>}
        </FormFieldWideRow>
        <br />
        <FormFieldAlertRow>
          <FormFieldValidator invalid={this.state.isRequestFailed} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
      </div>
    )
  }
}

export default CategoryScroll
