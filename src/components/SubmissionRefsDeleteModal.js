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
      : props.modalMode === 'Data Set'
        ? 'dataSets'
        : props.modalMode === 'Platform'
          ? 'platforms'
          : props.modalMode === 'Result'
            ? 'results'
            : props.modalMode === 'Tag'
              ? 'tags'
              : 'login'
  const route = props.modalMode === 'Task'
    ? 'Task'
    : props.modalMode === 'Method'
      ? 'Method'
      : props.modalMode === 'Data Set'
        ? 'Platform'
        : props.modalMode === 'Platform' ? 'Platform' : 'Login'
  const name = props.modalMode === 'Task'
    ? 'tasks'
    : props.modalMode === 'Method'
      ? 'methods'
      : props.modalMode === 'Data Set'
        ? 'data sets'
        : props.modalMode === 'Platform'
          ? 'platforms'
          : props.modalMode === 'Result'
            ? 'results'
            : props.modalMode === 'Tag'
              ? 'tags'
              : 'login'
  const handleOnRemove = (id) => {
    if (!window.confirm('Are you sure you want to remove this ' + name.slice(0, -1) + ' from the submission?')) {
      return
    }

    const url = config.api.getUriPrefix() + ((key === 'results') ? '' : ('/submission/' + props.submission.id)) + '/' + route + '/' + id
    axios.delete(url)
      .then(res => {
        if (key !== 'results') {
          props.onSubmit(res.data.data)
          return
        }
        const submissionRoute = config.api.getUriPrefix() + '/submission/' + props.submission.id
        axios.get(submissionRoute)
          .then(subRes => {
            props.onSubmit(subRes.data.data)
          })
          .catch(err => {
            window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
          })
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
            <b>Attached {name}:</b><br />
            {(props.submission && props.submission[key] && (props.submission[key].length > 0)) &&
                props.submission[key].map(ref =>
                  <div key={ref.id}>
                    <hr />
                    <div className='row'>
                      <div className='col-md-10'>
                        {key !== 'results' && ref.name}
                        {key === 'results' && (ref.task.name + ', ' + ref.method.name + (ref.platform ? ', ' + ref.platform.name : '') + ', ' + ref.metricName + ', ' + ref.metricValue)}
                      </div>
                      <div className='col-md-2'>
                        <Button variant='danger' aria-label='Delete' onClick={() => handleOnRemove(key === 'tags' ? encodeURIComponent(ref.name) : ref.id)}><FontAwesomeIcon icon='trash' /></Button>
                      </div>
                    </div>
                  </div>
                )}
            {(!props.submission || !props.submission[key] || (props.submission[key].length === 0)) &&
              <span><i>There are no attached {name}.</i></span>}
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
