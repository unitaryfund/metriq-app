import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TooltipTrigger from './TooltipTrigger'

const CategoryItemBox = (props) =>
  <div className='col-4 col-md-1'>
    <TooltipTrigger message={'Count of ' + props.word + ', with ' + props.type}>
      <span><FontAwesomeIcon icon={props.icon} /><br />{props.count}</span>
    </TooltipTrigger>
  </div>

export default CategoryItemBox
