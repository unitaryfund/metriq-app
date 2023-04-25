import React, { Suspense, useEffect, useState, useCallback } from 'react'
import { Accordion, Button, Card, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import config from './../config'
import { nonblankRegex } from './ValidationRegex'
import ErrorHandler from './ErrorHandler'
import FormFieldTypeaheadRow from './FormFieldTypeaheadRow'
const FormFieldRow = React.lazy(() => import('./FormFieldRow'))

library.add(faPlus)

const SubmissionRefsAddModal = (props) => {
  const [isValid, setIsValid] = useState(false)
  const [showAccordion, setShowAccordion] = useState(!!props.isNewOnly)
  const [item, setItem] = useState({
    id: 0,
    name: props.refName ? props.refName : '',
    fullName: '',
    parent: 0,
    description: '',
    submissions: props.submissionId
  })

  const key = props.modalMode === 'Task'
    ? 'task'
    : props.modalMode === 'Method'
      ? 'method'
      : props.modalMode === 'Platform' ? 'platform' : 'login'

  const handleValidation = useCallback((i) => {
    if (!i) {
      i = item
    }
    setIsValid((!!i.id && !showAccordion) || (showAccordion && !!i.name && (i.parent || (key !== 'task'))))
  }, [item, showAccordion, key])

  useEffect(() => {
    const nItem = { ...item }
    const submissions = props.submissionId.toString()
    let isChanged = nItem.submissions !== submissions
    nItem.submissions = submissions
    if (props.refName) {
      isChanged |= nItem.name !== props.refName
      nItem.name = props.refName
      handleValidation(nItem)
    }
    if (isChanged) {
      setItem(nItem)
    }
  }, [props.submissionId, props.refName, item, handleValidation])

  const handleAccordionToggle = () => {
    setIsValid((!!item.id && showAccordion) || (!showAccordion && !!item.name && (item.parent || (key !== 'task'))))
    setShowAccordion(!showAccordion)
  }

  const handleOnSelectParent = (nItem) => {
    if (!showAccordion || !nItem) {
      return
    }

    item.parent = nItem.id
    setItem(item)
    handleValidation(item)
  }

  const handleOnChangeParent = (field, value) => {
    if (!showAccordion) {
      return
    }

    const fn = props.allNames.find(f => f.name === value)
    if (fn) {
      item.parent = fn.id
      handleValidation(item)
    } else {
      item.parent = 0
      if (value) {
        setIsValid(false)
      } else {
        handleValidation(item)
      }
    }
    setItem(item)
  }

  const handleOnSelectRef = (nItem) => {
    if (!nItem) {
      setIsValid(false)
      return
    }

    item.id = nItem.id
    setItem(item)
    handleValidation(item)
  }

  const handleOnChangeRef = (key, value) => {
    const fn = props.filteredNames.find(f => f.name === value)
    if (fn) {
      item.id = fn.id
    } else {
      item.id = 0
    }
    setItem(item)
    handleValidation(item)
  }

  const handleOnChangeName = (field, value) => {
    item.name = value
    setItem(item)
    handleValidation(item)
  }

  const handleReset = () => {
    setShowAccordion(false)
    setIsValid(false)
    item.name = ''
    item.fullName = ''
    item.description = ''
    item.parent = 0
    setItem(item)
  }

  const handleOnChange = (field, value) => {
    if (!showAccordion) {
      return
    }

    item[field] = value
    setItem(item)
    handleValidation(item)
  }

  const handleSubmit = () => {
    if (!showAccordion) {
      const refId = item.id ? item.id : props.filteredNames.length ? props.filteredNames[0].id : 0
      axios.post(config.api.getUriPrefix() + '/submission/' + props.submissionId + '/' + key + '/' + refId, {})
        .then(res => {
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

    handleReset()
  }

  const handleOnHide = () => {
    handleReset()
    props.onHide()
  }

  return (
    <Modal
      show={props.show} onHide={handleOnHide}
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
                <FormFieldTypeaheadRow
                  inputName={`${key}Id`}
                  label={props.modalMode} labelKey='name'
                  options={props.filteredNames}
                  onSelect={handleOnSelectRef}
                  onChange={handleOnChangeRef}
                  disabled={showAccordion}
                  tooltip={(props.modalMode === 'Method')
                    ? 'A method used in or by this submission, (to perform a task)'
                    : (props.modalMode === 'Task')
                        ? 'A task performed in or by this submission, (using a method)'
                        : 'A platform on which a method was used to perform a task.'}
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
                      value={item.name}
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
                    <FormFieldTypeaheadRow
                      inputName={`parent${props.modalMode}`}
                      label={`Parent ${key}` + (props.modalMode === 'Task' ? '' : '<br/>(if any)')} labelKey='name'
                      options={props.allNames}
                      onSelect={handleOnSelectParent}
                      onChange={handleOnChangeParent}
                      isError={!isValid}
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
        {(props.modalMode === 'Login') && <Button variant='primary' onClick={handleOnHide}>Cancel</Button>}
        {(props.modalMode !== 'Login') && <Button variant='primary' onClick={handleSubmit} disabled={!isValid}>Submit</Button>}
      </Modal.Footer>
    </Modal>
  )
}

export default SubmissionRefsAddModal
