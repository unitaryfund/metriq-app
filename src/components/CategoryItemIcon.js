import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CategoryItemBox = (props) =>
  <div className='col-4 col-md-1'>
    <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of {props.word}, with {props.type}</Tooltip>}>
      <span><FontAwesomeIcon icon={props.icon} /><br />{props.count}</span>
    </OverlayTrigger>
  </div>

export default CategoryItemBox
