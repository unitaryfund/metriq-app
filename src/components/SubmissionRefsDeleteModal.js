import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import config from './../config'
import ErrorHandler from './ErrorHandler'

library.add(faTrash)

const SubmissionRefsDeleteModal = (props) => {
  const key = props.modalMode === 'Task'
    ? 'tasks'
    : props.modalMode === 'Method'
      ? 'methods'
      : props.modalMode === 'Platform'
        ? 'platforms'
        : props.modalMode === 'Result'
          ? 'results'
          : props.modalMode === 'Tag'
            ? 'tags'
            : 'login'

  const handleOnRemove = (id) => {
    if (!window.confirm('Are you sure you want to remove this ' + key.slice(0, -1) + ' from the submission?')) {
      return
    }

    axios.delete(config.api.getUriPrefix() + '/submission/' + props.submission.id + '/' + props.modalMode + '/' + id)
      .then(res => {
        props.onSubmit(res.data.data)
      })
      .catch(err => {
        window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
      })
  }

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(props.modalMode === 'Login') &&
          <span>
            Please <Link to={'/Login/' + encodeURIComponent('Submission/' + props.submission.id)}>login</Link> before editing.
          </span>}
        {(props.modalMode !== 'Login') &&
          <span>
            <b>Attached {key}:</b><br />
            {(props.submission && props.submission[key] && (props.submission[key].length > 0)) &&
                props.submission[key].map(ref =>
                  <div key={ref.id}>
                    <hr />
                    <div className='row'>
                      <div className='col-md-10'>
                        {ref.name}
                      </div>
                      <div className='col-md-2'>
                        <button className='btn btn-danger' onClick={() => handleOnRemove(ref.id)}><FontAwesomeIcon icon='trash' /> </button>
                      </div>
                    </div>
                  </div>
                )}
            {(!props.submission || !props.submission[key] || (props.submission[key].length === 0)) &&
              <span><i>There are no attached {key}.</i></span>}
          </span>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={props.onHide}>
          {(props.modalMode === 'Login') ? 'Cancel' : 'Done'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SubmissionRefsDeleteModal
