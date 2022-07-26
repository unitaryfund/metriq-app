import React, { Suspense, useEffect, useState } from 'react'
import { Accordion, Button, Card, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import config from './../config'
import { nonblankRegex } from './ValidationRegex'
import ErrorHandler from './ErrorHandler'
const FormFieldRow = React.lazy(() => import('./FormFieldRow'))
const FormFieldSelectRow = React.lazy(() => import('./FormFieldSelectRow'))

library.add(faPlus)

const SubmissionRefsAddModal = (props) => {
  const [isValid, setIsValid] = useState(false)
  const [showAccordion, setShowAccordion] = useState(!!props.isNewOnly)
  const [item, setItem] = useState({
    id: props.filteredNames.length ? props.filteredNames[0].id : 0,
    name: '',
    fullName: '',
    parent: '',
    description: '',
    submissions: props.submissionId
  })

  useEffect(() => {
    item.submissions = props.submissionId.toString()
    setItem(item)
  }, [props.submissionId, item])

  const key = props.modalMode === 'Task'
    ? 'task'
    : props.modalMode === 'Method'
      ? 'method'
      : props.modalMode === 'Platform' ? 'platform' : 'login'

  const handleAccordionToggle = () => {
    setIsValid(showAccordion || !!item.name)
    setShowAccordion(!showAccordion)
  }

  const handleOnChangeSelect = (field, value) => {
    if (showAccordion) {
      return
    }
    item.id = value
    setItem(item)
  }

  const handleOnChangeName = (field, value) => {
    if (!showAccordion) {
      return
    }

    item.name = value
    setItem(item)
    setIsValid(nonblankRegex.test(item.name))
  }

  const handleOnChangeParent = (field, value) => {
    if (!showAccordion) {
      return
    }

    item.parent = value
    setItem(item)
  }

  const handleOnChange = (field, value) => {
    if (!showAccordion) {
      return
    }

    item[field] = value
    setItem(item)
  }

  const handleSubmit = () => {
    if (!showAccordion) {
      const refId = item.id ? item.id : props.filteredNames.length ? props.filteredNames[0].id : 0
      axios.post(config.api.getUriPrefix() + '/submission/' + props.submissionId + '/' + key + '/' + refId, {})
        .then(res => {
          console.log(res)
          props.onAddExisting(res.data.data)
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })

      return
    }

    const i = { ...item }
    if (!i.fullName) {
      i.fullName = i.name
    }
    if (!i.description) {
      i.description = ''
    }
    if (!i.parent) {
      i.parent = props.allNames[0].id
    }
    if (props.modalMode === 'Task') {
      i.parentTask = i.parent
    } else if (props.modalMode === 'Method') {
      i.parentMethod = i.parent
    } else if (props.modalMode === 'Platform') {
      i.parentPlatform = i.parent
    }
    delete i.parent

    axios.post(config.api.getUriPrefix() + '/' + key, i)
      .then(res => {
        props.onAddNew(res.data.data)
      })
      .catch(err => {
        window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
      })
  }

  return (
    <Modal
      show={props.show} onHide={props.onHide}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{(props.modalMode === 'Login') ? 'Add' : ('Add ' + props.modalMode)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(props.modalMode === 'Login') &&
          <span>
            Please <Link to={'/Login/' + encodeURIComponent('Submission/' + props.submissionId)}>login</Link> before editing.
          </span>}
        {(props.modalMode !== 'Login') &&
          <Suspense fallback={<div>Loading...</div>}>
            {!props.isNewOnly &&
              <span>
                <FormFieldSelectRow
                  inputName={`${key}Id`}
                  label={props.modalMode}
                  options={props.filteredNames}
                  onChange={handleOnChangeSelect}
                  tooltip={(props.modalMode === 'Method')
                    ? 'A method used in or by this submission, (to perform a task)'
                    : (props.modalMode === 'Task')
                        ? 'A task performed in or by this submission, (using a method)'
                        : 'A platform on which a method was used to perform a task.'}
                  disabled={showAccordion}
                /><br />
                Not in the list?<br />
              </span>}
            <Accordion defaultActiveKey={props.isNewOnly ? '1' : '0'}>
              <Card>
                {!props.isNewOnly &&
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant='link' eventKey='1' onClick={handleAccordionToggle}>
                      <FontAwesomeIcon icon='plus' /> Create a new {key}.
                    </Accordion.Toggle>
                  </Card.Header>}
                <Accordion.Collapse eventKey='1'>
                  <Card.Body>
                    <FormFieldRow
                      inputName='name'
                      inputType='text'
                      label='Name'
                      onChange={handleOnChangeName}
                      validRegex={nonblankRegex}
                      tooltip={`Short name of new ${key}`}
                    /><br />
                    <FormFieldRow
                      inputName='fullName'
                      inputType='text'
                      label='Full name (optional)'
                      onChange={handleOnChange}
                      tooltip={`Long name of new ${key}`}
                    /><br />
                    <FormFieldSelectRow
                      inputName={`parent${props.modalMode}`}
                      label={`Parent ${key}<br/>(if any)`}
                      isNullDefault
                      options={props.allNames}
                      onChange={handleOnChangeParent}
                      tooltip={`Optionally, the new ${key} is a sub-${key} of a "parent" ${key}.`}
                    /><br />
                    <FormFieldRow
                      inputName='description'
                      inputType='textarea'
                      label='Description (optional)'
                      onChange={handleOnChange}
                      tooltip={`Long description of new ${key}`}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <div className='text-center'><br /><b>(Mouse-over or tap labels for explanation.)</b></div>
          </Suspense>}
      </Modal.Body>
      <Modal.Footer>
        {(props.modalMode === 'Login') && <Button variant='primary' onClick={props.onHide}>Cancel</Button>}
        {(props.modalMode !== 'Login') && <Button variant='primary' onClick={handleSubmit} disabled={showAccordion && !isValid}>Submit</Button>}
      </Modal.Footer>
    </Modal>
  )
}

export default SubmissionRefsAddModal
