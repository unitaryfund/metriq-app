import { useState } from 'react'
import { Accordion, Button, Card, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormFieldRow from './FormFieldRow'
import FormFieldSelectRow from './FormFieldSelectRow'
import { nonblankRegex } from './ValidationRegex'

const SubmissionRefsAddModal = (props) => {
  const [isValidated, setIsValidated] = useState(false)
  const [showAccordion, setShowAccordion] = useState(!!props.isNewOnly)
  const key = props.modalMode === 'Task'
    ? 'task'
    : props.modalMode === 'Method'
      ? 'method'
      : props.modalMode === 'Platform' ? 'platform' : 'login'

  const handleAccordionToggle = () => {
    setShowAccordion(!showAccordion)
    setIsValidated(false)
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
            Please <Link to={'/Login/' + encodeURIComponent('Submission/' + props.loginLinkId)}>login</Link> before editing.
          </span>}
        {(props.modalMode !== 'Login') &&
          <span>
            {!props.isNewOnly &&
              <span>
                <FormFieldSelectRow
                  inputName={`${key}Id`}
                  label={props.modalMode}
                  options={props.filteredNames}
                  onChange={(field, value) => props.handleOnChange('', field, value)}
                  tooltip={(props.modalMode === 'Method')
                    ? 'A method used in or by this submission, (to perform a task)'
                    : 'A task performed in or by this submission, (using a method)'}
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
                      onChange={(field, value) => props.handleOnChange(key, field, value)}
                      validRegex={nonblankRegex}
                      tooltip={`Short name of new ${key}`}
                    /><br />
                    <FormFieldRow
                      inputName='fullName'
                      inputType='text'
                      label='Full name (optional)'
                      onChange={(field, value) => props.handleOnChange(key, field, value)}
                      tooltip={`Long name of new ${key}`}
                    /><br />
                    <FormFieldSelectRow
                      inputName={`parent${props.modalMode}`}
                      label={`Parent ${key}<br/>(if any)`}
                      isNullDefault
                      options={props.allNames}
                      onChange={(field, value) => props.handleOnChange(key, field, value)}
                      tooltip={`Optionally, the new ${key} is a sub-${key} of a "parent" ${key}.`}
                    /><br />
                    <FormFieldRow
                      inputName='description'
                      inputType='textarea'
                      label='Description (optional)'
                      onChange={(field, value) => props.handleOnChange(key, field, value)}
                      tooltip={`Long description of new ${key}`}
                    />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <div className='text-center'><br /><b>(Mouse-over or tap labels for explanation.)</b></div>
          </span>}
      </Modal.Body>
      <Modal.Footer>
        {(props.modalMode === 'Login') && <Button variant='primary' onClick={props.onHide}>Cancel</Button>}
        {(props.modalMode !== 'Login') && <Button variant='primary' onClick={props.onSubmit} disabled={!isValidated && !props.isAllValid()}>Submit</Button>}
      </Modal.Footer>
    </Modal>
  )
}

export default SubmissionRefsAddModal
