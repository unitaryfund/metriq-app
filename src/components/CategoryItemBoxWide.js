import React from 'react'
import CategoryItemIcon from './CategoryItemIcon'
import SubscribeButton from './SubscribeButton'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'

library.add(faHeart, faExternalLinkAlt, faChartLine)

const qedcIds = [34, 2, 97, 142, 150, 172, 173, 174, 175, 176, 177, 178, 179]

const pickDetailUrl = (type, item) => {
  if (type === 'tag') {
    return ('/Tag/' + item.name)
  } else if (type === 'task') {
    return ('/Task/' + item.id)
  } else if (type === 'method') {
    return ('/Method/' + item.id)
  } else if (type === 'platform') {
    return ('/Platform/' + item.id)
  } else if (type === 'architecture') {
    return ('/Architecture/' + item.id)
  } else if (type === 'provider') {
    return ('/Provider/' + item.id)
  }
}

const CategoryItemBoxWide = (props) => {
  return (
    <div className='submission-cell'>
      <div className='submission submission-shadow'>
        <Link to={pickDetailUrl(props.type, props.item)} className='category-item-line'>
          <div className='row'>
            <div className='submission-heading col-xl-4 col-12 submission-button-align'>
              {props.item.name}
              {props.type === 'task' && qedcIds.includes(parseInt(props.item.id)) &&
                <span> <Link to='/QEDC'><span className='link'>(QED-C)</span></Link></span>}
            </div>
            <div className='col-xl-6 col-6 text-right submission-button-align'>
              <CategoryItemIcon count={props.item.resultCount} type={props.type} word='results' icon={faChartLine} />
              <CategoryItemIcon count={props.item.submissionCount} type={props.type} word='submissions' icon={faExternalLinkAlt} />
              <CategoryItemIcon count={props.item.upvoteTotal} type={props.type} word='up-votes' icon={faHeart} />
            </div>
            <div className='col-xl-2 col-6 text-right'>
              <SubscribeButton item={props.item} type={props.type} isLoggedIn={props.isLoggedIn} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default CategoryItemBoxWide
