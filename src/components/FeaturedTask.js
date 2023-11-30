import { Link } from 'react-router-dom/cjs/react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import SotaChart from './SotaChart'
import SubscribeButton from './SubscribeButton'
import CategoryItemIcon from './CategoryItemIcon'

library.add(faHeart, faExternalLinkAlt, faChartLine)

const qedcIds = [34, 2, 97, 142, 150, 172, 173, 174, 175, 176, 177, 178, 179]

const FeaturedTask = (props) =>
  <Link to={'/Task/' + props.item.id} className='active-navlink' onClick={this.handleOnLinkClick}>
    <div className='task card task-card-link'>
      <div className='row h-100 text-left'>
        <div className='col-xl-4 col-lg-5 col'>
          <SotaChart
            isPreview
            chartId={props.index}
            xLabel='Time'
            taskId={props.item.id}
            key={props.index}
            isLog
            logBase={props.logBase}
            onMouseEnter={this.handleOnMouseEnter}
            onMouseLeave={this.handleOnMouseLeave}
          />
        </div>
        <div className='col-xl-8 col-lg-7 col'>
          <h5>
            {props.item.name}
            {qedcIds.includes(parseInt(props.item.id)) &&
              <span> <Link to='/QEDC' onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}><span className='link'>(QED-C)</span></Link></span>}
            <span className='float-right'><SubscribeButton item={props.item} type='task' isLoggedIn={props.isLoggedIn} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave} /></span>
          </h5>
          {props.item.description}
        </div>
      </div>
      <div className='row h-100'>
        <div className='col-lg-4 col text-left'>
          <Link to={'/Task/' + props.item.parentTask.id} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}>{props.item.parentTask.name}</Link>
        </div>
        <div className='col-lg-8 col'>
          <CategoryItemIcon count={props.item.resultCount} type='task' word='results' icon={faChartLine} />
          <CategoryItemIcon count={props.item.submissionCount} type='task' word='submissions' icon={faExternalLinkAlt} />
          <CategoryItemIcon count={props.item.upvoteTotal} type='task' word='up-votes' icon={faHeart} />
        </div>
      </div>
    </div>
  </Link>

export default FeaturedTask
