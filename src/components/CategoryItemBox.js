import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'

library.add(faHeart, faExternalLinkAlt, faChartLine)

class CategoryItemBox extends React.Component {
  render () {
    return (
      <tr>
        <td>
          <div className='row submission'>
            <div className='col-md-9'>
              <a href={(this.props.type === 'tag') ? ('/Tag/' + this.props.item.name) : (((this.props.type === 'task') ? '/Task/' : '/Method/') + this.props.item.id)}>
                {this.props.type !== 'tag' && this.props.item.description &&
                  <div>
                    <div className='submission-heading'>{this.props.item.name}</div>
                    <div className='submission-description'>{this.props.item.description}</div>
                  </div>}
                {(this.props.type === 'tag' || !this.props.item.description) &&
                  <div className='submission-heading-only'>{this.props.item.name}</div>}
              </a>
            </div>
            <div className='col-md-1'>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of results, with {(this.props.type === 'tag') ? ('tag') : (((this.props.type === 'task') ? 'task' : 'method'))}</Tooltip>}>
                <span><FontAwesomeIcon icon={faChartLine} /><br />{this.props.item.resultCount}</span>
              </OverlayTrigger>
            </div>
            <div className='col-md-1'>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of submissions, with {(this.props.type === 'tag') ? ('tag') : (((this.props.type === 'task') ? 'task' : 'method'))}</Tooltip>}>
                <span><FontAwesomeIcon icon={faExternalLinkAlt} /><br />{this.props.item.submissionCount}</span>
              </OverlayTrigger>
            </div>
            <div className='col-md-1'>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of up-votes, for all submissions with {(this.props.type === 'tag') ? ('tag') : (((this.props.type === 'task') ? 'task' : 'method'))}</Tooltip>}>
                <span><FontAwesomeIcon icon={faHeart} /><br />{this.props.item.upvoteTotal}</span>
              </OverlayTrigger>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}

export default CategoryItemBox
