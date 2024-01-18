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
import { sortAlphabetical } from '../components/SortFunctions'
import FormFieldTypeaheadRow from './FormFieldTypeaheadRow'
const FormFieldSelectRow = React.lazy(() => import('./FormFieldSelectRow'))
const FormFieldRow = React.lazy(() => import('./FormFieldRow'))

library.add(faPlus)

const SubmissionRefsAddModal = (props) => {
  const [isValid, setIsValid] = useState(false)
  const [showAccordion, setShowAccordion] = useState(!!props.isNewOnly)
  const [allProviderNames, setAllProviderNames] = useState([])
  const [allArchitectureNames, setAllArchitectureNames] = useState([])
  const [item, setItem] = useState({
    id: 0,
    name: props.refName ? props.refName : '',
    fullName: '',
    parent: 0,
    description: '',
    submissions: props.submissionId,
    architecture: 1,
    provider: 1
  })

  const key = props.modalMode === 'Task'
    ? 'task'
    : props.modalMode === 'Method'
      ? 'method'
      : props.modalMode === 'Data Set'
        ? 'dataSet'
        : props.modalMode === 'Platform' ? 'platform' : 'login'

  const route = props.modalMode === 'Task'
    ? 'Task'
    : props.modalMode === 'Method'
      ? 'Method'
      : props.modalMode === 'Data Set'
        ? 'Platform'
        : props.modalMode === 'Platform' ? 'Platform' : 'Login'

  const name = props.modalMode === 'Task'
    ? 'task'
    : props.modalMode === 'Method'
      ? 'method'
      : props.modalMode === 'Data Set'
        ? 'data set'
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

    if (allProviderNames.length === 0) {
      const providerNamesRoute = config.api.getUriPrefix() + '/provider/names'
      axios.get(providerNamesRoute)
        .then(res => {
          const apn = res.data.data
          // Sort alphabetically and put "Other" at end of array.
          apn.sort(sortAlphabetical)
          const otherIndex = apn.findIndex(x => x.name === 'Other')
          const apn2 = apn.toSpliced(otherIndex, 1)
          apn2.push(apn[otherIndex])
          apn2.splice(otherIndex, 1)
          setAllProviderNames(apn2)
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    }

    if (allArchitectureNames.length === 0) {
      const architectureNamesRoute = config.api.getUriPrefix() + '/architecture/names'
      axios.get(architectureNamesRoute)
        .then(res => {
          setAllArchitectureNames(res.data.data)
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    }
  }, [props.submissionId, props.refName, item, allArchitectureNames, allProviderNames, handleValidation])

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
    if (props.isNewOnly) {
      setShowAccordion(true)
    }
  }

  const handleOnChange = (field, value) => {
    if (!showAccordion) {
      return
    }
    console.log('Field: ' + field + ', value: ' + value)

    item[field] = value
    setItem(item)
    handleValidation(item)
  }

  const handleSubmit = () => {
    if (!showAccordion) {
      const refId = item.id ? item.id : props.filteredNames.length ? props.filteredNames[0].id : 0
      axios.post(config.api.getUriPrefix() + '/submission/' + props.submissionId + '/' + route + '/' + refId, {})
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
    } else if (props.modalMode === 'Data Set') {
      i.parentPlatform = i.parent
    } else if (props.modalMode === 'Platform') {
      i.parentPlatform = i.parent
    }
    delete i.parent

    if (props.modalMode === 'Data Set') {
      i.isDataSet = true
    } else if (props.modalMode === 'Platform') {
      i.isDataSet = false;
    }

    axios.post(config.api.getUriPrefix() + '/' + route, i)
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
                      <FontAwesomeIcon icon='plus' /> Create a new {name}.
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
                      tooltip={`Short name of new ${name}`}
                    /><br />
                    <FormFieldRow
                      inputName='fullName'
                      inputType='text'
                      label='Full name (optional)'
                      onChange={handleOnChange}
                      tooltip={`Long name of new ${name}`}
                    /><br />
                    {props.modalMode === 'Platform' &&
                      <span>
                        <FormFieldSelectRow
                          inputName='architecture'
                          label='Architecture'
                          options={allArchitectureNames}
                          value={item.architecture}
                          onChange={handleOnChange}
                          tooltip='The new platform architecture (basic type).'
                        /><br />
                        <FormFieldSelectRow
                          inputName='provider'
                          label='Provider'
                          options={allProviderNames}
                          value={item.provider}
                          onChange={handleOnChange}
                          tooltip='The new platform provider (entity).'
                        /><br />
                      </span>}
                    <FormFieldTypeaheadRow
                      inputName={`parent${route}`}
                      label={(props.modalMode === 'Platform' ? 'Device' : `Parent ${name}`) + (props.modalMode === 'Task' ? '' : '<br/>(if any)')} labelKey='name'
                      options={props.allNames}
                      onSelect={handleOnSelectParent}
                      onChange={handleOnChangeParent}
                      isError={!isValid}
                      tooltip={`Optionally, the new ${name} is a sub-${name} of a "parent" ${name}.`}
                    /><br />
                    <FormFieldRow
                      inputName='description'
                      inputType='textarea'
                      label='Description (optional)'
                      onChange={handleOnChange}
                      tooltip={`Long description of new ${name}`}
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
