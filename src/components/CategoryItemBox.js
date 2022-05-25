import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'

library.add(faHeart, faExternalLinkAlt, faChartLine)

class CategoryItemBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      detailUrl: ''
    }
    if (this.props.type === 'tag') {
      this.state.detailUrl = ('/Tag/' + this.props.item.name)
    } else if (this.props.type === 'task') {
      this.state.detailUrl = ('/Task/' + this.props.item.id)
    } else if (this.props.type === 'method') {
      this.state.detailUrl = ('/Method/' + this.props.item.id)
    } else if (this.props.type === 'platform') {
      this.state.detailUrl = ('/Platform/' + this.props.item.id)
    }
  }

  render () {
    return (
      <tr>
        <td>
          <div className='row submission'>
            <div className='col-12 col-md-9'>
              <a href={this.state.detailUrl}>
                {this.props.type !== 'tag' && this.props.item.description &&
                  <div>
                    <div className='submission-heading'>{this.props.item.name}</div>
                    <div className='submission-description'>{this.props.item.description}</div>
                  </div>}
                {(this.props.type === 'tag' || !this.props.item.description) &&
                  <div className='submission-heading-only'>{this.props.item.name}</div>}
              </a>
            </div>
            <div className='col-4 col-md-1'>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of results, with {this.props.type}</Tooltip>}>
                <span><FontAwesomeIcon icon={faChartLine} /><br />{this.props.item.resultCount}</span>
              </OverlayTrigger>
            </div>
            <div className='col-4 col-md-1'>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of submissions, with {this.props.type}</Tooltip>}>
                <span><FontAwesomeIcon icon={faExternalLinkAlt} /><br />{this.props.item.submissionCount}</span>
              </OverlayTrigger>
            </div>
            <div className='col-4 col-md-1'>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of up-votes, for all submissions with {this.props.type}</Tooltip>}>
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
