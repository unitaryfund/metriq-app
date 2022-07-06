const { FontAwesomeIcon } = require("@fortawesome/react-fontawesome");
const { useState } = require("react");
const { Modal, Accordion, Card, Button } = require("react-bootstrap");
const { Link } = require("react-router-dom");
const { default: FormFieldRow } = require("./FormFieldRow");
const { default: FormFieldSelectRow } = require("./FormFieldSelectRow");
const { default: FormFieldTypeaheadRow } = require("./FormFieldTypeaheadRow");
const { nonblankRegex, metricValueRegex, dateRegex, standardErrorRegex, sampleSizeRegex } = require("./ValidationRegex");

const SubmissionRefsModal = (props) => {
    const [isValidated, setIsValidated] = useState(false)
    const [showAccordion, setShowAccordion] = useState(false)
    const key = props.modalMode === 'Task' ? 'task'
        : props.modalMode === 'Method' ? 'method'
            : props.modalMode === 'Platform' ? 'platform'
                : props.modalMode === 'Result' ? 'result' : 'login'

    const isAllValid = () => {
        if (props.modalMode === 'Login') {
          if (isValidated) {
            setIsValidated(true)
          }
          return true
        }
    
        if (props.modalMode === 'Task') {
          if (showAccordion) {
            if (!nonblankRegex.test(props.task.name)) {
              return false
            }
          } else if (!props.taskId) {
            return false
          }
        } else if (props.modalMode === 'Method') {
          if (showAccordion) {
            if (!nonblankRegex.test(props.method.name)) {
              return false
            }
          } else if (!props.methodId) {
            return false
          }
        } else if (props.modalMode === 'Platform') {
          if (showAccordion) {
            if (!nonblankRegex.test(props.platform.name)) {
              return false
            }
          } else if (!props.platformId) {
            return false
          }
        } else if (props.modalMode === 'Result') {
          if (!nonblankRegex.test(props.result.metricName)) {
            return false
          }
          if (!metricValueRegex.test(props.result.metricValue)) {
            return false
          }
        }
    
        return true
    }

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
            {(props.modalMode === 'Login') &&
            <Modal.Header closeButton>
                <Modal.Title>Add</Modal.Title>
            </Modal.Header>}
            {(props.modalMode !== 'Login') &&
            <Modal.Header closeButton>
                <Modal.Title>{(props.modalMode === 'Result' && props.result.id) ? 'Edit' : 'Add'} {props.modalMode}</Modal.Title>
            </Modal.Header>}
            <Modal.Body>
            {(props.modalMode === 'Login') &&
                <span>
                Please <Link to={'/Login/' + encodeURIComponent('Submission/' + props.loginLinkId)}>login</Link> before editing.
                </span>}
            {((props.modalMode === 'Method') || (props.modalMode === 'Task') || (props.modalMode === 'Platform')) &&
                <span>
                    <FormFieldSelectRow
                        inputName={`${key}Id`}
                        label={props.modalMode}
                        options={props.filteredNames}
                        onChange={(field, value) => props.handleOnChange('', field, value)}
                        tooltip={(props.modalMode === 'Method')
                            ? 'A method used in or by this submission, (to perform a task)'
                            : 'A task performed in or by this submission, (using a method)'}
                        disabled={props.showAccordion}
                    /><br />
                    Not in the list?<br />
                    <Accordion defaultActiveKey='0'>
                        <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant='link' eventKey='1' onClick={handleAccordionToggle}>
                            <FontAwesomeIcon icon='plus' /> Create a new {key}.
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey='1'>
                            <Card.Body>
                            <FormFieldRow
                                inputName='name'
                                inputType='text'
                                label='Name'
                                onChange={(field, value) => props.handleOnChange(key, field, value)}
                                validRegex={nonblankRegex}
                                tooltip={'Short name of new ' + key}
                            /><br />
                            <FormFieldRow
                                inputName='fullName'
                                inputType='text'
                                label='Full name (optional)'
                                onChange={(field, value) => props.handleOnChange(key, field, value)}
                                tooltip={'Long name of new ' + key}
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
                                tooltip={'Long description of new ' + key}
                            />
                            </Card.Body>
                        </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </span>}
            {(props.modalMode === 'Result') && ((props.item.tasks.length === 0) || (props.item.methods.length === 0)) &&
                <span>
                A <b>result</b> must cross-reference a <b>task</b> and a <b>method</b>.<br /><br />Make sure to add your task and method to the submission, first.
                </span>}
            {(props.modalMode === 'Result') && (props.item.tasks.length > 0) && (props.item.methods.length > 0) &&
                <span>
                <FormFieldSelectRow
                    inputName='task' label='Task'
                    options={props.item.tasks}
                    value={props.result.task.id}
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    tooltip='Task from submission, used in this result'
                /><br />
                <FormFieldSelectRow
                    inputName='method' label='Method'
                    options={props.item.methods}
                    value={props.result.method.id}
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    tooltip='Method from submission, used in this result'
                /><br />
                <FormFieldSelectRow
                    inputName='platform' label='Platform'
                    options={props.item.platforms}
                    value={props.result.platform ? props.result.platform.id : ''}
                    isNullDefault
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    tooltip='The quantum computer platform used by the method for this result'
                /><br />
                <FormFieldTypeaheadRow
                    inputName='metricName' label='Metric name'
                    value={props.result.metricName}
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    validRegex={nonblankRegex}
                    options={props.metricNames}
                    tooltip='The name of the measure of performance, for this combination of task and method, for this submission'
                /><br />
                <FormFieldRow
                    inputName='metricValue' inputType='number' label='Metric value'
                    value={props.result.metricValue}
                    validRegex={metricValueRegex}
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    tooltip='The value of the measure of performance, for this combination of task and method, for this submission'
                /><br />
                <FormFieldRow
                    inputName='evaluatedAt' inputType='date' label='Evaluated'
                    value={props.result.evaluatedAt}
                    validRegex={dateRegex}
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    tooltip='(Optionally) What date was the metric value collected on?'
                /><br />
                <FormFieldRow
                    inputName='isHigherBetter' inputType='checkbox' label='Is higher better?'
                    checked={props.result.isHigherBetter}
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    tooltip='Does a higher value of the metric indicate better performance? (If not checked, then a lower value of the metric indicates better performance.)'
                /><br />
                <FormFieldRow
                    inputName='standardError' inputType='number' label='Standard error (optional)'
                    value={props.result.standardError}
                    validRegex={standardErrorRegex}
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    tooltip='Confidence intervals will be calculated as (mean) result metric value ± standard error times z-score, if you report a standard error. This is self-consistent if your statistics are Gaussian or Poisson, for example, over a linear scale of the metric. (If Gaussian or Poisson statistics emerge over a different, non-linear scale of the metric, consider reporting your metric value with rescaled units.)'
                /><br />
                <FormFieldRow
                    inputName='sampleSize' inputType='number' label='Sample size (optional)'
                    value={props.result.sampleSize}
                    validRegex={sampleSizeRegex}
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    tooltip='Report the sample size used to calculate the metric value.'
                /><br />
                <FormFieldRow
                    inputName='notes' inputType='textarea' label='Notes'
                    value={props.result.notes}
                    onChange={(field, value) => props.handleOnChange('result', field, value)}
                    tooltip='You may include any additional notes on the result, in this field, and they will be visible to all readers.'
                />
                </span>}
            {(props.modalMode === 'Tag') &&
                <span>
                <FormFieldTypeaheadRow
                    inputName='tag' label='Tag'
                    onChange={(field, value) => props.handleOnChange('', field, value)}
                    validRegex={nonblankRegex}
                    options={props.tagNames.map(item => item.name)}
                    tooltip='A "tag" can be any string that loosely categorizes a submission by relevant topic.'
                /><br />
                </span>}
            {(props.modalMode !== 'Login') && <div className='text-center'><br /><b>(Mouse-over or tap labels for explanation.)</b></div>}
            </Modal.Body>
            <Modal.Footer>
            {(props.modalMode === 'Login') && <Button variant='primary' onClick={props.handleHideAddModal}>Cancel</Button>}
            {(props.modalMode !== 'Login') && <Button variant='primary' onClick={props.handleAddModalSubmit} disabled={!isValidated && !isAllValid()}>Submit</Button>}
            </Modal.Footer>
        </Modal>
    )
}

export default SubmissionRefsModal