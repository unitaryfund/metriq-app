import React from 'react'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import logo from './../images/metriq_logo_secondary_blue.png'

library.add(faExternalLinkAlt)

const SubmissionBoxSmall = (props) =>
  <div className='submission'>
    <Link to={'/Submission/' + props.item.id}>
      <div className='row'>
        <div className='col-md-4 col-sm-12'>
          <img src={props.item.thumbnailUrl ? props.item.thumbnailUrl : logo} alt='Submission thumbnail' className='submission-image' />
        </div>
        <div className='col-md-8 col-sm-12'>
          <div className='submission-heading'>{props.item.name} {props.isEditView && ' - '} {props.isEditView && <b>{props.isDraft ? 'Unpublished draft' : props.isUnderReview ? 'Under Review' : 'Approved'}</b>}</div>
          <div>
            <Link to={'/User/' + props.item.userId + '/Submissions'}><span className='link'>Submitted by {props.item.username}</span></Link>
          </div>
        </div>
      </div>
    </Link>
  </div>

export default SubmissionBoxSmall
