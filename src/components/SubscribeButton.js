import React, { useState } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import TooltipTrigger from './TooltipTrigger'
import config from '../config'
import ErrorHandler from './ErrorHandler'

const SubscribeButton = (props) => {
  const history = useHistory()
  const [isSubscribed, setIsSubscribed] = useState(props.item.isSubscribed)

  const handleLoginRedirect = (type) => {
    if (type === 'tag') {
      history.push('/Login/Tags')
    } else if (type === 'task') {
      history.push('/Login/Tasks')
    } else if (type === 'method') {
      history.push('/Login/Methods')
    } else if (type === 'platform') {
      history.push('/Login/Platforms')
    } else if (type === 'submissions') {
      history.push('/Login/Submissions')
    } else {
      history.push('/Login')
    }
  }
  const handleSubscribe = () => {
    if (props.isLoggedIn) {
      axios.post(config.api.getUriPrefix() + '/' + props.type + '/' + (props.type === 'tag' ? encodeURIComponent(props.item.name) : props.item.id) + '/subscribe', {})
        .then(res => {
          if (props.type === 'tag') {
            setIsSubscribed(res.data.data)
          } else {
            setIsSubscribed(!!res.data.data.isSubscribed)
          }
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      handleLoginRedirect(props.type)
    }
  }

  return (
    <span>
      {!isSubscribed &&
        <TooltipTrigger message={'Subscribe to ' + props.type}>
          <Button className='submission-button metriq-follow-button' variant='outline-dark' aria-label={'Subscribe to ' + props.type} onClick={props.handleSubscribe ? props.handleSubscribe : handleSubscribe} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>Follow</Button>
        </TooltipTrigger>}
      {isSubscribed &&
        <TooltipTrigger message={'Unsubscribe from ' + props.type}>
          <Button className='submission-button metriq-follow-button' variant='primary' aria-label={'Unsubscribe from ' + props.type} onClick={props.handleSubscribe ? props.handleSubscribe : handleSubscribe} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>Unfollow</Button>
        </TooltipTrigger>}
    </span>
  )
}

export default SubscribeButton
