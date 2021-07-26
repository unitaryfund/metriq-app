import axios from 'axios'
import React from 'react'
import config from './../config'
import ErrorHandler from './../components/ErrorHandler'

class Method extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      item: {}
    }
  }

  componentDidMount () {
    const methodRoute = config.api.getUriPrefix() + '/method/' + this.props.match.params.id
    axios.get(methodRoute)
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: res.data.data })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div className='container submission-detail-container'>
        <header>{this.state.item.name}</header>
        <br />
        <div className='row'>
          <div className='col-md-12'>
            <div><h1>{this.state.item.fullName}</h1></div>
            <div className='submission-description'>
              {this.state.item.description ? this.state.item.description : <i>No description provided.</i>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Method
