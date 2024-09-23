import React from 'react'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faExternalLinkAlt)

const SubmissionBoxSmall = (props) =>

  <div className='submission'>
    <Link to={'/Submission/' + props.item.id}>
      <div className='row'>
        <div className='col col-md-12'>
          <div className='text-start submission-heading-small'>{(props.item.name.length > 80) ? (props.item.name.substring(0, 77) + '...') : props.item.name}</div>
        </div>
      </div>
      <div className='row'>
        <div className='col text-center submission-author-small'>
          <Link to={'/User/' + props.item.userId + '/Submissions'}><span className='link'>Submitted by {props.item.username}</span></Link>
        </div>
      </div>
    </Link>
  </div>

export default SubmissionBoxSmall
