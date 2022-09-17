import React, { useState } from 'react'
import axios from 'axios'
import CategoryItemIcon from './CategoryItemIcon'
import SubscribeButton from './SubscribeButton'
import { useHistory, Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import config from '../config'
import ErrorHandler from './ErrorHandler'

library.add(faHeart, faExternalLinkAlt, faChartLine)

const pickDetailUrl = (type, item) => {
  if (type === 'tag') {
    return ('/Tag/' + item.name)
  } else if (type === 'task') {
    return ('/Task/' + item.id)
  } else if (type === 'method') {
    return ('/Method/' + item.id)
  } else if (type === 'platform') {
    return ('/Platform/' + item.id)
  }
}

const CategoryItemBox = (props) => {
  const history = useHistory()
  const [isSubscribed, setIsSubscribed] = useState(props.item.isSubscribed)

  const handleLoginRedirect = () => {
    history.push('/Login/Tags')
  }

  const handleSubscribe = () => {
    if (props.isLoggedIn) {
      axios.post(config.api.getUriPrefix() + '/tag/' + encodeURIComponent(props.item.name) + '/subscribe', {})
        .then(res => {
          setIsSubscribed(res.data.data)
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      handleLoginRedirect()
    }
  }

  return (
    <tr>
      <td>
        <div className='row submission'>
          <div className={props.type === 'tag' ? 'col-12 col-md-7' : 'col-12 col-md-9'}>
            <Link to={pickDetailUrl(props.type, props.item)}>
              {props.type !== 'tag' && props.item.description &&
                <div>
                  <div className='submission-heading'>{props.item.name}</div>
                  <div className='submission-description'>{props.item.description}</div>
                </div>}
              {(props.type === 'tag' || !props.item.description) &&
                <div className='submission-heading-only'>{props.item.name}</div>}
            </Link>
          </div>
          {props.type === 'tag' &&
            <div className='col-md-2'>
              <SubscribeButton isSubscribed={isSubscribed} typeLabel='tag' onSubscribe={handleSubscribe} />
            </div>}
          <CategoryItemIcon count={props.item.resultCount} type={props.type} word='results' icon={faChartLine} />
          <CategoryItemIcon count={props.item.submissionCount} type={props.type} word='submissions' icon={faExternalLinkAlt} />
          <CategoryItemIcon count={props.item.upvoteTotal} type={props.type} word='up-votes' icon={faHeart} />
        </div>
      </td>
    </tr>
  )
}

export default CategoryItemBox
