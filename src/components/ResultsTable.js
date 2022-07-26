import React, { Suspense } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditButton from './EditButton'
import FormFieldWideRow from './FormFieldWideRow'
const Table = React.lazy(() => import('rc-table'))
const TooltipTrigger = React.lazy(() => import('./TooltipTrigger'))

const ResultsTable = (props) => {
  return (
    <FormFieldWideRow>
      <div>
        <h2>Results
          <EditButton
            className='float-right edit-button btn'
            onClickAdd={props.onClickAdd}
            onClickRemove={props.onClickRemove}
          />
        </h2>
        <small><i>Results are metric name/value pairs that can be extracted from Submissions (papers, codebases, etc.)</i></small>
        <hr />
      </div>
      {(props.results.length > 0) &&
        <Suspense fallback={<div>Loading...</div>}>
          <Table
            columns={[
              {
                title: 'Task',
                dataIndex: 'taskName',
                key: 'taskName',
                width: 224
              },
              {
                title: 'Method',
                dataIndex: 'methodName',
                key: 'methodName',
                width: 224
              },
              {
                title: 'Platform',
                dataIndex: 'platformName',
                key: 'platformName',
                width: 224
              },
              {
                title: 'Metric',
                dataIndex: 'metricName',
                key: 'metricName',
                width: 224
              },
              {
                title: 'Value',
                dataIndex: 'metricValue',
                key: 'metricValue',
                width: 224
              },
              {
                title: 'Notes',
                dataIndex: 'notes',
                key: 'notes',
                width: 40,
                render: (value, row, index) =>
                  <div className='text-center'>
                    {row.notes &&
                      <TooltipTrigger message={<span className='display-linebreak'>{row.notes}</span>}>
                        <div className='text-center'><FontAwesomeIcon icon='sticky-note' /></div>
                      </TooltipTrigger>}
                  </div>
              },
              {
                title: '',
                dataIndex: 'edit',
                key: 'edit',
                width: 40,
                render: (value, row, index) =>
                  <div className='text-center'>
                    <FontAwesomeIcon icon='edit' onClick={() => props.onClickEdit(row.key)} />
                  </div>
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
                    notes: row.notes
                  }))
              : []}
            tableLayout='auto'
          />
        </Suspense>}
      {(props.results.length === 0) &&
        <div className='card bg-light'>
          <div className='card-body'>There are no associated results, yet.</div>
        </div>}
    </FormFieldWideRow>
  )
}

export default ResultsTable
