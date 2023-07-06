import React from 'react'
import CategoryItemIcon from './CategoryItemIcon'
import SubscribeButton from './SubscribeButton'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { renderLatex } from '../components/RenderLatex'

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
  }
}

const CategoryItemBox = (props) => {
  return (
    <td className={props.isPreview ? undefined : 'submission-cell'}>
      <div className='submission'>
        <Link to={pickDetailUrl(props.type, props.item)} className='category-item-box'>
          {props.type !== 'tag' && props.item.description &&
            <div>
              <div className='submission-heading'>
                {props.item.name}
                {props.type === 'task' && qedcIds.includes(parseInt(props.item.id)) &&
                  <span> <Link to='/QEDC'><span className='link'>(QED-C)</span></Link></span>}
              </div>
              <div className='submission-description'>{renderLatex(
                !props.item.description
                  ? ''
                  : ((!props.isPreview && (props.item.description.length > 128))
                      ? (props.item.description.substring(0, 125) + '...')
                      : props.item.description))}
              </div>
            </div>}
          {(props.type === 'tag' || !props.item.description) &&
            <div className='submission-heading-only'>{props.item.name}</div>}
        </Link>
        <br />
        <SubscribeButton item={props.item} type={props.type} isLoggedIn={props.isLoggedIn} />
        {!props.isPreview &&
          <span>
            <CategoryItemIcon count={props.item.resultCount} type={props.type} word='results' icon={faChartLine} />
            <CategoryItemIcon count={props.item.submissionCount} type={props.type} word='submissions' icon={faExternalLinkAlt} />
            <CategoryItemIcon count={props.item.upvoteTotal} type={props.type} word='up-votes' icon={faHeart} />
          </span>}
      </div>
    </td>
  )
}

export default CategoryItemBox
