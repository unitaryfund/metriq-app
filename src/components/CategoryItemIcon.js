import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TooltipTrigger from './TooltipTrigger'

const CategoryItemIcon = (props) =>
  <TooltipTrigger message={'Count of ' + props.word + ', with ' + props.type}>
    <div className='category-item-icon'><FontAwesomeIcon icon={props.icon} /> {props.count}</div>
  </TooltipTrigger>

export default CategoryItemIcon
