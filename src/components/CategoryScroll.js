import React from 'react'
import FormFieldValidator from './FormFieldValidator'
import CategoryItemBox from './CategoryItemBox'

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
          <div className='row'>
            <div className='col-md-12'>
              <b>{this.props.heading}</b>
            </div>
          </div>}
        <div className='row'>
          <div className='col-md-12'>
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
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-md-3' />
          <div className='col-md-6'>
            <FormFieldValidator invalid={this.state.isRequestFailed} message={this.state.requestFailedMessage} />
          </div>
          <div className='col-md-3' />
        </div>
      </div>
    )
  }
}

export default CategoryScroll
