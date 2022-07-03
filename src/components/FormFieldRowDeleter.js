import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

library.add(faTrash)

const FormFieldRowDeleter = (props) =>
  <span>
    <div className='row'>
      <div className='col-md-3' />
      <div className='col-md-6'>
        {(props.options.length > 0) &&
            props.options.map((option, index) =>
              <div key={index}>
                <div className='row metriq-submission-ref-row'>
                  <div className='col-md-10 text-left'>{option.name}</div>
                  <div className='col-md-2'>
                    <Button variant='danger' onClick={() => props.onClickRemove(option)}>
                      <FontAwesomeIcon icon='trash' />
                    </Button>
                  </div>
                </div>
                <hr />
              </div>
            )}
        {(props.options.length === 0) &&
          <div className='card bg-light'>
            <div className='card-body'>{props.emptyMessage}</div>
          </div>}
      </div>
      <div className='col-md-3' />
    </div>
  </span>

export default FormFieldRowDeleter
