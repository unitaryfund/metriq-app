import { Button } from 'react-bootstrap'
import TooltipTrigger from './TooltipTrigger'

const SubscribeButton = (props) =>
  <span>
    {!props.isSubscribed &&
      <TooltipTrigger message={'Subscribe to ' + props.typeLabel}>
        <Button className='submission-button metriq-follow-button' variant='secondary' aria-label={'Subscribe to ' + props.typeLabel} onClick={props.onSubscribe}>Follow</Button>
      </TooltipTrigger>}
    {props.isSubscribed &&
      <TooltipTrigger message={'Unsubscribe from ' + props.typeLabel}>
        <Button className='submission-button metriq-follow-button' variant='primary' aria-label={'Unsubscribe from ' + props.typeLabel} onClick={props.onSubscribe}>Unfollow</Button>
      </TooltipTrigger>}
  </span>

export default SubscribeButton
