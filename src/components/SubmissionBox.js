import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import config from './../config'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import logo from './../images/metriq_logo_secondary_blue.png'
import ErrorHandler from './ErrorHandler'

library.add(faExternalLinkAlt)

class SubmissionBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      upvotes: props.item.upvotesCount || 0,
      isUpvoted: props.item.isUpvoted,
      description: !this.props.item.description ? '' : ((this.props.item.description.length > 500) ? (this.props.item.description.substring(0, 497) + '...') : this.props.item.description)
    }

    this.handleUpVoteOnClick = this.handleUpVoteOnClick.bind(this)
    this.handleDeleteOnClick = this.handleDeleteOnClick.bind(this)
    this.handleExternalLinkClick = this.handleExternalLinkClick.bind(this)
  }

  handleDeleteOnClick (event) {
    let confirmString = window.prompt('To delete your submission, type its name below, then hit "OK."\n\n' + this.props.item.name, '')
    if (confirmString) {
      confirmString = confirmString.trim().toLowerCase()
    }
    if (confirmString && (confirmString === this.props.item.nameNormal)) {
      axios.delete(config.api.getUriPrefix() + '/submission/' + this.props.item.id, {})
        .then(res => {
          window.location = '/Submissions'
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      window.alert('The submission was not deleted. (Please enter the correct submission name, to delete.)')
    }
    event.preventDefault()
  }

  handleUpVoteOnClick (event) {
    if (this.props.isLoggedIn) {
      axios.post(config.api.getUriPrefix() + '/submission/' + this.props.item.id + '/upvote', {})
        .then(res => {
          this.setState({ upvotes: res.data.data.upvotesCount, isUpvoted: res.data.data.isUpvoted })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      window.location = '/Login'
    }
    event.preventDefault()
  }

  handleExternalLinkClick (event) {
    window.open(this.props.item.contentUrl, '_blank')
    event.preventDefault()
  }

  parseContentUrl () {
    const urlStr = String(this.props.item.contentUrl)
    if (urlStr.includes('arxiv')) {
      return <span> <FontAwesomeIcon icon={faExternalLinkAlt} /> arXiv:{urlStr.split('/abs/')[1]} </span>
    } else if (urlStr.includes('github')) {
      return <span> <FontAwesomeIcon icon={faExternalLinkAlt} /> GitHub:{urlStr.split('.com/')[1]} </span>
    } else {
      return <span> <FontAwesomeIcon icon={faExternalLinkAlt} /> Link:{urlStr} </span>
    }
  }

  render () {
    return (
      <div className='submission'>
        <Link to={'/Submission/' + this.props.item.id}>
          <div className='row h-100'>
            <div className='col-md-2 col-sm-12 h-100'>
              <img src={this.props.item.thumbnailUrl ? this.props.item.thumbnailUrl : logo} alt='Submission thumbnail' className='submission-image' />
            </div>
            <div className='col-md-8 col-sm-12 h-100'>
              <div className='submission-heading'>{this.props.item.name} {this.props.isEditView && ' - '} {this.props.isEditView && <b>{this.props.isUnderReview ? 'Under Review' : 'Approved'}</b>}</div>
              <div className='submission-description'>
                {this.state.description ? this.state.description.replace(/\0.*$/g, '').split('. ')[0] + '.' : <i>(No description provided.)</i>}
              </div>
            </div>
            <div className='col-md-2 col-sm-12 h-100' />
          </div>
          <hr />
          <div className='row submission-social-row'>
            <div className='col-md-9 h-100'>
              <div className='submission-subheading'>
                <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Submission link</Tooltip>}>
                  <span onClick={this.handleExternalLinkClick}>
                    Submitted by {this.props.item.username} • {this.parseContentUrl()} • {this.props.item.createdAt ? new Date(this.props.item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''} •
                  </span>
                </OverlayTrigger>
              </div>
            </div>
            <div className='col-md-1 text-center'>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Delete submission</Tooltip>}>
                <span>{this.props.isEditView && <button className='delete-button btn btn-danger' onClick={this.handleDeleteOnClick}>Delete</button>}</span>
              </OverlayTrigger>
            </div>
            <div className='col-md-2 text-center'>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Upvote submission</Tooltip>}>
                <div>
                  <div id={this.state.isUpvoted ? 'heart-full' : 'heart-empty'} onClick={this.handleUpVoteOnClick} />
                  <span className='submission-like-count'>{this.state.upvotes}</span>
                </div>
              </OverlayTrigger>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

export default SubmissionBox
