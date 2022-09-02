import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import TooltipTrigger from './TooltipTrigger'

library.add(faBell, faBellSlash)

const SubscribeButton = (props) =>
  <span>
    {!props.isSubscribed &&
      <TooltipTrigger message={'Subscribe to ' + props.typeLabel}>
        <Button className='submission-button' variant='secondary' aria-label={'Subscribe to ' + props.typeLabel} onClick={props.onSubscribe}><FontAwesomeIcon icon='bell' /></Button>
      </TooltipTrigger>}
    {props.isSubscribed &&
      <TooltipTrigger message={'Unsubscribe from ' + props.typeLabel}>
        <Button className='submission-button' variant='primary' aria-label={'Unsubscribe from ' + props.typeLabel} onClick={props.onSubscribe}><FontAwesomeIcon icon='bell-slash' /></Button>
      </TooltipTrigger>}
  </span>

export default SubscribeButton
