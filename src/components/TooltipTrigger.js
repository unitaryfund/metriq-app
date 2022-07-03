import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

const TooltipTrigger = (props) =>
  <OverlayTrigger placement='top' overlay={(p) => <Tooltip {...p}>{props.message}</Tooltip>}>
    {props.children}
  </OverlayTrigger>

export default TooltipTrigger
