import React, { Suspense } from 'react'
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
                    width: 224
                  },
                  {
                    title: 'Method',
                    key: 'methodName',
                    width: 224
                  },
                  {
                    title: 'Platform',
                    key: 'platformName',
                    width: 224
                  },
                  {
                    title: 'Metric',
                    key: 'metricName',
                    width: 224
                  },
                  {
                    title: 'Value',
                    key: 'metricValue',
                    width: 224
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
                data={props.results.length
                  ? props.results.map(row =>
                      ({
                        key: row.id,
                        taskName: row.task.name,
                        methodName: row.method.name,
                        platformName: row.platform ? row.platform.name : '(None)',
                        metricName: row.metricName,
                        metricValue: row.metricValue,
                        notes:
                    <div className='text-center'>
                      {row.notes &&
                        <TooltipTrigger message={<span className='display-linebreak'>{row.notes}</span>}>
                          <div className='text-center'><FontAwesomeIcon icon='sticky-note' /></div>
                        </TooltipTrigger>}
                    </div>,
                        edit:
                    <div className='text-center'>
                      <FontAwesomeIcon icon='edit' onClick={() => props.onClickEdit(row.key)} />
                    </div>
                      }))
                  : []}
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
