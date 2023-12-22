import axios from 'axios'
import React, { useState, Suspense, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import config from '../config'
import ErrorHandler from './ErrorHandler'
import { nonblankRegex, metricValueRegex, dateRegex, standardErrorRegex, numeralRegex } from './ValidationRegex'
const FormFieldRow = React.lazy(() => import('./FormFieldRow'))
const FormFieldSelectRow = React.lazy(() => import('./FormFieldSelectRow'))
const FormFieldTypeaheadRow = React.lazy(() => import('./FormFieldTypeaheadRow'))

const ResultsAddModal = (props) => {
  const [isValidated, setIsValidated] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)
  const [result, setResult] = useState(props.result)
  const [submission, setSubmission] = useState({})
  const [key, setKey] = useState(Math.random())

  const [task, setTask] = useState(props.result.task)
  const [method, setMethod] = useState(props.result.method)
  const [platform, setPlatform] = useState(props.result.platform)

  const setterDict = { task: setTask, method: setMethod, platform: setPlatform }

  useEffect(() => {
    if (!result.evaluatedAt) {
      result.evaluatedAt = props.evaluatedAt
      setResult(result)
      setKey(Math.random())
    } else {
      setTask(result.task)
      setMethod(result.method)
      setPlatform(result.platform)
    }
  }, [props.evaluatedAt, result, setResult, setKey])

  if (!isUpdated && props.show) {
    setIsUpdated(true)
    setResult(props.result)
  }

  const handleOnChange = (field, value) => {
    result[field] = value
    setResult(result)
    if (field in setterDict) {
      setterDict[field](result)
    }
    setIsValidated(false)
  }

  const onHide = () => {
    setIsUpdated(false)
    if (submission.id) {
      props.onAddOrEdit({ ...submission })
      setSubmission({})
    }
    props.onHide()
  }

  const isAllValid = () => {
    if (!nonblankRegex.test(result.metricName)) {
      return false
    }
    if (!metricValueRegex.test(result.metricValue)) {
      return false
    }
    if (!dateRegex.test(result.evaluatedAt)) {
      return false
    }
    if (!standardErrorRegex.test(result.standardError)) {
      return false
    }
    if (!numeralRegex.test(result.sampleSize)) {
      return false
    }

    setIsValidated(true)

    return true
  }

  const handleAddModalSubmit = (isDuplicating) => {
    if (!nonblankRegex.test(result.metricName)) {
      window.alert('Error: Metric Name cannot be blank.')
      return
    }
    if (!metricValueRegex.test(result.metricValue)) {
      window.alert('Error: Metric Value cannot be blank.')
      return
    }
    if (result.standardError && !standardErrorRegex.test(result.standardError)) {
      window.alert('Error: Standard error is not a valid number.')
      return
    }
    if (result.standardError) {
      result.standardError = parseFloat(result.standardError)
    }
    if (result.sampleSize && !numeralRegex.test(result.sampleSize)) {
      window.alert('Error: Sample size is not a valid number.')
      return
    }
    if (result.sampleSize) {
      result.sampleSize = parseInt(result.sampleSize)
    }
    if (result.qubitCount && !numeralRegex.test(result.qubitCount)) {
      window.alert('Error: Qubit count is not a valid number.')
      return
    }
    result.qubitCount = result.qubitCount ? parseInt(result.qubitCount) : null
    if (result.circuitDepth && !numeralRegex.test(result.circuitDepth)) {
      window.alert('Error: Circuit depth is not a valid number.')
      return
    }
    result.circuitDepth = result.circuitDepth ? parseInt(result.circuitDepth) : null
    if (result.shots && !numeralRegex.test(result.shots)) {
      window.alert('Error: Shots is not a valid number.')
      return
    }
    result.shots = result.shots ? parseInt(result.shots) : null
    if (!result.evaluatedAt) {
      result.evaluatedAt = (new Date()).toISOString().split('T')[0]
    } else if (!dateRegex.test(result.evaluatedAt)) {
      window.alert('Error: "Evaluated at" is not a date.')
      return
    }
    if (!result.task) {
      result.task = props.submission.tasks[0].id
    }
    if (!result.method) {
      result.method = props.submission.methods[0].id
    }
    if (isNaN(result.task)) {
      result.task = result.task.id
    }
    if (isNaN(result.method)) {
      result.method = result.method.id
    }
    if (isNaN(result.platform)) {
      result.platform = result.platform.id
    }
    const resultRoute = config.api.getUriPrefix() + (result.id ? ('/result/' + result.id) : ('/submission/' + props.submission.id + '/result'))
    axios.post(resultRoute, result)
      .then(res => {
        if (isDuplicating) {
          setSubmission(res.data.data)
          window.alert("Added result! The form is prepopulated with your old result, if you'd like to add anothher.")
        } else {
          props.onAddOrEdit(res.data.data)
        }
        setIsUpdated(false)
      })
      .catch(err => {
        window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
      })
  }

  const handleOnRemove = (id) => {
    if (!window.confirm('Are you sure you want to remove this result from the submission?')) {
      return
    }

    const url = config.api.getUriPrefix() + '/result/' + id
    axios.delete(url)
      .then(res => {
        const submissionRoute = config.api.getUriPrefix() + '/submission/' + props.submission.id
        axios.get(submissionRoute)
          .then(subRes => {
            props.onAddOrEdit(subRes.data.data)
            setIsUpdated(false)
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
    <Modal
      show={props.show}
      onHide={onHide}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{result.id ? 'Edit' : 'Add'} Result</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {((props.submission.tasks.length === 0) || (props.submission.methods.length === 0)) &&
          <span>
            A <b>result</b> must cross-reference a <b>task</b> and a <b>method</b>.<br /><br />Make sure to add your task and method to the submission, first.
          </span>}
        {(props.submission.tasks.length > 0) && (props.submission.methods.length > 0) &&
          <Suspense fallback={<div>Loading...</div>}>
            <FormFieldSelectRow
              inputName='task' label='Task'
              options={props.submission.tasks}
              defaultValue={task}
              onChange={handleOnChange}
              tooltip='Task from submission, used in this result'
            /><br />
            <FormFieldSelectRow
              inputName='method' label='Method'
              options={props.submission.methods}
              defaultValue={method}
              onChange={handleOnChange}
              tooltip='Method from submission, used in this result'
            /><br />
            <FormFieldSelectRow
              inputName='platform' label='Platform'
              options={props.submission.platforms}
              defaultValue={platform}
              isNullDefault
              onChange={handleOnChange}
              tooltip='The quantum computer platform used by the method for this result'
            /><br />
            <FormFieldTypeaheadRow
              inputName='metricName' label='Metric name'
              value={result.metricName}
              onChange={handleOnChange}
              validRegex={nonblankRegex}
              options={props.metricNames}
              tooltip='The name of the measure of performance, for this combination of task and method, for this submission'
            /><br />
            <FormFieldRow
              inputName='metricValue' inputType='number' label='Metric value'
              value={result.metricValue}
              validRegex={metricValueRegex}
              onChange={handleOnChange}
              tooltip='The value of the measure of performance, for this combination of task and method, for this submission'
            /><br />
            <FormFieldRow
              inputName='evaluatedAt' inputType='date' label='Evaluated'
              key={key}
              value={result.evaluatedAt}
              validRegex={dateRegex}
              onChange={handleOnChange}
              tooltip='Publication date. If not published, latest arXiv/submission date.'
            /><br />
            <FormFieldRow
              inputName='isHigherBetter' inputType='checkbox' label='Is higher better?'
              checked={result.isHigherBetter}
              onChange={handleOnChange}
              tooltip='Does a higher value of the metric indicate better performance? (If not checked, then a lower value of the metric indicates better performance.)'
            /><br />
            <FormFieldRow
              inputName='standardError' inputType='number' label='Standard error (optional)'
              value={result.standardError}
              validRegex={standardErrorRegex}
              onChange={handleOnChange}
              tooltip='Confidence intervals will be calculated as (mean) result metric value ± standard error times z-score, if you report a standard error. This is self-consistent if your statistics are Gaussian or Poisson, for example, over a linear scale of the metric. (If Gaussian or Poisson statistics emerge over a different, non-linear scale of the metric, consider reporting your metric value with rescaled units.)'
            /><br />
            <FormFieldRow
              inputName='sampleSize' inputType='number' label='Sample size (optional)'
              value={result.sampleSize}
              validRegex={numeralRegex}
              onChange={handleOnChange}
              tooltip='Report the sample size used to calculate the metric value.'
            /><br />
            <FormFieldRow
              inputName='qubitCount' inputType='number' label='Qubit count (optional)'
              value={result.qubitCount}
              validRegex={numeralRegex}
              onChange={handleOnChange}
              tooltip='Task plots can be subset by qubit count of the benchmark.'
            /><br />
            <FormFieldRow
              inputName='circuitDepth' inputType='number' label='Circuit depth (optional)'
              value={result.circuitDepth}
              validRegex={numeralRegex}
              onChange={handleOnChange}
              tooltip='Task plots can be subset by circuit depth of the benchmark.'
            /><br />
            <FormFieldRow
              inputName='shots' inputType='number' label='Shots (optional)'
              value={result.shots}
              validRegex={numeralRegex}
              onChange={handleOnChange}
              tooltip='Report the measurement shots used (per trial or overall) to calculate the metric value.'
            /><br />
            <FormFieldRow
              inputName='notes' inputType='textarea' label='Notes'
              value={result.notes}
              onChange={handleOnChange}
              tooltip='You may include any additional notes on the result, in this field, and they will be visible to all readers.'
            />
          </Suspense>}
        <div className='text-center'><br /><b>(Mouse-over or tap labels for explanation.)</b></div>
      </Modal.Body>
      <Modal.Footer>
        {((props.submission.tasks.length === 0) || (props.submission.methods.length === 0)) && <Button variant='primary' onClick={onHide}>Cancel</Button>}
        {result.id && <Button variant='primary' onClick={() => handleOnRemove(result.id)}>Delete</Button>}
        {!((props.submission.tasks.length === 0) || (props.submission.methods.length === 0)) &&
          <span>
            <Button variant='secondary' onClick={() => handleAddModalSubmit(true)} disabled={isValidated && !isAllValid()}>Submit & Repeat</Button>&nbsp;
            <Button variant='primary' onClick={() => handleAddModalSubmit(false)} disabled={isValidated && !isAllValid()}>Submit</Button>
          </span>}
      </Modal.Footer>
    </Modal>
  )
}

export default ResultsAddModal
