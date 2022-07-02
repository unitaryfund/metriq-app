import React from 'react'
import CategoryItemIcon from './CategoryItemIcon'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
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
              <Link to={this.state.detailUrl}>
                {this.props.type !== 'tag' && this.props.item.description &&
                  <div>
                    <div className='submission-heading'>{this.props.item.name}</div>
                    <div className='submission-description'>{this.props.item.description}</div>
                  </div>}
                {(this.props.type === 'tag' || !this.props.item.description) &&
                  <div className='submission-heading-only'>{this.props.item.name}</div>}
              </Link>
            </div>
            <CategoryItemIcon count={this.props.item.resultCount} type={this.props.type} word='results' icon={faChartLine} />
            <CategoryItemIcon count={this.props.item.submissionCount} type={this.props.type} word='submissions' icon={faExternalLinkAlt} />
            <CategoryItemIcon count={this.props.item.upvoteTotal} type={this.props.type} word='up-votes' icon={faHeart} />
          </div>
        </td>
      </tr>
    )
  }
}

export default CategoryItemBox
