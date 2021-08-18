import React from 'react'
import { Link } from 'react-router-dom'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import logo from './../github.jpeg'

library.add(faThumbsUp, faExternalLinkAlt)

class TaskMethodBox extends React.Component {
  render () {
    return (
      <div className='submission'>
        <Link to={((this.props.type === 'task') ? '/Task/' : '/Method/') + this.props.item._id}>
          <div className='row h-100'>
            <div className='col-md-2 col h-100'>
              <img src={this.props.item.submissionThumbnailUrl ? this.props.item.submissionThumbnailUrl : logo} alt='logo' className='submission-image' />
            </div>
            <div className='col-md-8 col h-100'>
              <div className='submission-heading'>{this.props.item.fullName ? this.props.item.fullName : this.props.item.name} {(this.props.item.fullName && (this.props.item.fullName !== this.props.item.name)) && ('(also known as ' + this.props.item.name + ')')}</div>
              <div className='submission-description'>
                {this.props.item.description ? this.props.item.description : <i>(No description provided.)</i>}
              </div>
            </div>
            <div className='col-md-2 col h-100'>
              <div className='submission-button-block'>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of submissions, with task</Tooltip>}>
                          <span><FontAwesomeIcon icon={faExternalLinkAlt} />: {this.props.item.submissionCount}</span>
                        </OverlayTrigger>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Count of upvotes, for all submissions with task</Tooltip>}>
                          <span><FontAwesomeIcon icon={faThumbsUp} />: {this.props.item.upvoteTotal}</span>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

export default TaskMethodBox
