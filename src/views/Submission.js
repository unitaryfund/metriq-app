import axios from 'axios'
import React from 'react'
import config from './../config'
import ErrorHandler from './../components/ErrorHandler'
import EditButton from '../components/EditButton'

class Submission extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      item: {}
    }
  }

  componentDidMount () {
    const route = config.api.getUriPrefix() + '/submission/' + this.props.match.params.id
    axios.get(route)
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
            <div><h1>{this.state.item.submissionName}</h1></div>
            <div className='submission-description'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec commodo est. Nunc mollis nunc ac ante vestibulum, eu consectetur magna porttitor. Proin ac tortor urna. Aliquam ac ante eu nunc aliquam convallis et in sem. Donec volutpat tincidunt tincidunt. Aliquam at risus non diam imperdiet vestibulum eget a orci. In ultricies, arcu vel semper lobortis, lorem orci placerat nisi, id fermentum purus odio ut nulla. Duis quis felis a erat mattis venenatis id sit amet purus. Aenean a risus dui.
            </div>
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-md-6'>
            <div><h2>Tasks <EditButton className='float-right edit-button btn' /></h2><hr /></div>
            <div>Lorem ipsum</div>
          </div>
          <div className='col-md-6'>
            <div><h2>Methods <EditButton className='float-right edit-button btn' /></h2><hr /></div>
            <div>Lorem ipsum</div>
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-md-12'>
            <div><h2>Results <EditButton className='float-right edit-button btn' /></h2><hr /></div>
            <div>Lorem ipsum</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Submission
