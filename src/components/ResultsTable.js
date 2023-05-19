import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditButton from './EditButton'
import FormFieldWideRow from './FormFieldWideRow'
const SortingTable = React.lazy(() => import('../components/SortingTable'))
const TooltipTrigger = React.lazy(() => import('./TooltipTrigger'))

const ResultsTable = (props) => {
  return (
    <FormFieldWideRow>
      <div className='card taxonomy-card'>
        <div className='card-title'>
          <h5>Results
            <EditButton
              className='float-right edit-button btn'
              onClickAdd={props.onClickAdd}
              onClickRemove={props.onClickRemove}
              disabled={props.disabled}
            />
          </h5>
          <small><i>Results are metric name/value pairs that can be extracted from Submissions (papers, codebases, etc.)</i></small>
          <hr />
        </div>
        <div className='card-text'>
          {(props.results.length > 0) &&
            <Suspense fallback={<div>Loading...</div>}>
              <SortingTable
                scrollX
                columns={[
                  {
                    title: 'Task',
                    key: 'taskName',
                    width: 160
                  },
                  {
                    title: 'Method',
                    key: 'methodName',
                    width: 160
                  },
                  {
                    title: 'Platform',
                    key: 'platformName',
                    width: 160
                  },
                  {
                    title: 'Metric',
                    key: 'metricName',
                    width: 160
                  },
                  {
                    title: 'Value',
                    key: 'metricValue',
                    width: 120
                  },
                  {
                    title: 'Qubits',
                    key: 'qubitCount',
                    width: 120
                  },
                  {
                    title: 'Depth',
                    key: 'circuitDepth',
                    width: 120
                  },
                  {
                    title: 'Shots',
                    key: 'shots',
                    width: 120
                  },
                  {
                    title: 'Notes',
                    key: 'notes',
                    width: 40

                  },
                  {
                    title: '',
                    key: 'edit',
                    width: 40
                  }
                ]}
                data={props.results.map(row =>
                  ({
                    key: row.id,
                    taskName: <Link to={'/Task/' + row.task.id}>{row.task.name}</Link>,
                    methodName: <Link to={'/Method/' + row.method.id}>{row.method.name}</Link>,
                    platformName: row.platform ? <Link to={'/Platform/' + row.platform.id}>{row.platform.name}</Link> : '(None)',
                    metricName: row.metricName,
                    metricValue: row.metricValue,
                    qubitCount: row.qubitCount,
                    circuitDepth: row.circuitDepth,
                    shots: row.shots,
                    notes: <div className='text-center'>{row.notes && <TooltipTrigger message={<span className='display-linebreak'>{row.notes}</span>}><div className='text-center'><FontAwesomeIcon icon='sticky-note' /></div></TooltipTrigger>}</div>,
                    edit: <div className='text-center'><FontAwesomeIcon icon='edit' onClick={() => props.onClickEdit(row.id)} /></div>
                  })
                )}
                tableLayout='auto'
              />
            </Suspense>}
          {(props.results.length === 0) &&
            <div className='card bg-light'>
              <div className='card-body'>There are no associated results, yet.</div>
            </div>}
        </div>
      </div>
    </FormFieldWideRow>
  )
}

export default ResultsTable
