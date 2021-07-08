import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/fontawesome-free-solid'

fontawesome.library.add(faThumbsUp)

const SubmissionBox = (i, index) => {
  return (
    <div className='submission' key={index}>
      <div className='row'>
        <div className='col-md-3' />
        <div className='col-md-6'>
          {i.submissionName} <br />
          Submitted {i.submittedDate}
        </div>
        <div className='col-md-3'>
          <button className='btn btn-secondary'><FontAwesomeIcon icon='thumbs-up' /> {i.upvotes.length}</button>
        </div>
      </div>
    </div>
  )
}

export default SubmissionBox
