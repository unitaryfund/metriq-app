import React from 'react'
import { Link } from 'react-router-dom'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faHeart, faExternalLinkAlt)

class CategoryItemBox extends React.Component {
  render () {
    return (
      <tr>
        <td>
          <Link to={(this.props.type === 'tag') ? ('/Tag/' + this.props.item.name) : (((this.props.type === 'task') ? '/Task/' : '/Method/') + this.props.item.id)}>
            <div className='submission-heading'>{this.props.item.name}</div>
          </Link>
        </td>
        <td className='task-method-item-spacer' />
        <td>
          <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of submissions, with {(this.props.type === 'tag') ? ('tag') : (((this.props.type === 'task') ? 'task' : 'method'))}</Tooltip>}>
            <span><FontAwesomeIcon icon={faExternalLinkAlt} />: {this.props.item.submissionCount}</span>
          </OverlayTrigger>
        </td>
        <td className='task-method-item-spacer' />
        <td>
          <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of up-votes, for all submissions with {(this.props.type === 'tag') ? ('tag') : (((this.props.type === 'task') ? 'task' : 'method'))}</Tooltip>}>
            <span><FontAwesomeIcon icon={faHeart} />: {this.props.item.upvoteTotal}</span>
          </OverlayTrigger>
        </td>
      </tr>
    )
  }
}

export default CategoryItemBox
