import axios from 'axios'
import React from 'react'
import config from './../config'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import logo from './../github.jpeg'
import ErrorHandler from './ErrorHandler'

library.add(faThumbsUp, faGithub)

class SubmissionBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      upvotes: props.item.upvotes.length
    }

    this.handleUpVoteOnClick = this.handleUpVoteOnClick.bind(this)
  }

  handleUpVoteOnClick (event) {
    if (this.props.isLoggedIn) {
      axios.post(config.api.getUriPrefix() + '/submission/' + this.props.item._id + '/upvote', {})
        .then(res => {
          this.setState({ upvotes: res.data.data.upvotes.length })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      window.location = '/Login'
    }
    event.preventDefault()
  }

  render () {
    return (
      <div className='submission'>
        <div className='row'>
          <div className='col-md-2'>
            <img src={logo} alt='logo' className='submission-image' />
          </div>
          <div className='col-md-8'>
            <div className='submission-heading'>{this.props.item.submissionName} - Submitted {this.props.item.submittedDate}</div>
            <div className='submission-description'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec commodo est. Nunc mollis nunc ac ante vestibulum, eu consectetur magna porttitor. Proin ac tortor urna. Aliquam ac ante eu nunc aliquam convallis et in sem. Donec volutpat tincidunt tincidunt. Aliquam at risus non diam imperdiet vestibulum eget a orci. In ultricies, arcu vel semper lobortis, lorem orci placerat nisi, id fermentum purus odio ut nulla. Duis quis felis a erat mattis venenatis id sit amet purus. Aenean a risus dui.
            </div>
          </div>
          <div className='col-md-2'>
            <div className='submission-button-block'>
              <button className='submission-button btn btn-secondary' onClick={this.handleUpVoteOnClick}><FontAwesomeIcon icon='thumbs-up' /> {this.state.upvotes}</button><br />
              <button className='submission-button btn btn-secondary'><FontAwesomeIcon icon={['fab', 'github']} /></button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SubmissionBox
