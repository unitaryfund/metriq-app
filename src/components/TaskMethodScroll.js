import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import FormFieldValidator from './FormFieldValidator'
import TaskMethodBox from './TaskMethodBox'

class TaskMethodScroll extends React.Component {
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
        <div className='row'>
          <div className='col-md-12'>
            {this.props.items.length
              ? (<InfiniteScroll dataLength={this.props.items.length} next={() => {}} hasMore={false} loader={<h4>Loading...</h4>} endMessage={<p style={{ textAlign: 'center' }}><b>You have seen all items.</b></p>}>{this.props.items.map((item, index) => <TaskMethodBox item={item} key={index} isLoggedIn={this.props.isLoggedIn} type={this.props.type} />)}</InfiniteScroll>)
              : (this.props.isEditView
                  ? <p><b>You have no items, yet.</b></p>
                  : <p><b>There are no approved items, yet.</b></p>)}
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

export default TaskMethodScroll
