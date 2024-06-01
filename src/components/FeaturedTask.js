import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { renderLatex } from './RenderLatex'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import config from '../config'
import SotaChart from './SotaChart'
import SubscribeButton from './SubscribeButton'
import CategoryItemIcon from './CategoryItemIcon'
import ErrorHandler from './ErrorHandler'

library.add(faHeart, faExternalLinkAlt, faChartLine)

const qedcIds = [34, 2, 97, 142, 150, 172, 173, 174, 175, 176, 177, 178, 179]

const FeaturedTask = (props) => {
  const [item, setItem] = useState({ id: 0, name: '', isSubscribed: false })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [resultCount, setResultCount] = useState(0)
  const [submissionCount, setSubmissionCount] = useState(0)
  const [upvoteTotal, setUpvoteTotal] = useState(0)
  const [parentTaskId, setParentTaskId] = useState(0)
  const [parentTaskName, setParentTaskName] = useState('')
  const [isLinkBlocked, setIsLinkBlocked] = useState(false)

  useEffect(() => {
    if (item.id !== 0) {
      return
    }
    axios.get(config.api.getUriPrefix() + '/task/submissionCount/' + props.taskId)
      .then(res => {
        const i = res.data.data
        setItem(i)
        setName(i.name)
        setDescription(i.description)
        setResultCount(i.resultCount)
        setSubmissionCount(i.submissionCount)
        setUpvoteTotal(i.upvoteTotal)
        setParentTaskId(i.parentTask.id)
        setParentTaskName(i.parentTask.name)
      })
      .catch(err => {
        setItem({ id: -999, name: ErrorHandler(err), isSubscribed: false })
      })
  }, [item, props.taskId])

  const handleOnLinkClick = (event) => {
    if (isLinkBlocked) {
      event.preventDefault()
    }
  }

  const handleOnMouseEnter = () => {
    setIsLinkBlocked(true)
  }

  const handleOnMouseLeave = () => {
    setIsLinkBlocked(false)
  }

  return (
    <Link to={'/Task/' + props.taskId} className='active-navlink' onClick={handleOnLinkClick}>
      <div className='task card task-card-link'>
        <div className='row h-100 text-left'>
          <div className='col-xl-4 col-lg-5 col'>
            <SotaChart
              isPreview
              chartId={props.index}
              xLabel='Time'
              taskId={props.taskId}
              key={props.index}
              isLog={props.isLog}
              logBase={props.logBase}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
          </div>
          <div className='col-xl-8 col-lg-7 col'>
            <h5>
              {name}
              {qedcIds.includes(parseInt(props.taskId)) &&
                <span> <Link to='/QEDC' onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}><span className='link'>(QED-C)</span></Link></span>}
              <span className='float-right'><SubscribeButton item={item} type='task' isLoggedIn={props.isLoggedIn} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} /></span>
            </h5>
            {description ? renderLatex(description) : ""}
          </div>
        </div>
        <div className='row h-100'>
          <div className='col-lg-4 col text-left'>
            <Link to={'/Task/' + parentTaskId} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>{parentTaskName}</Link>
          </div>
          <div className='col-lg-8 col'>
            <CategoryItemIcon count={resultCount} type='task' word='results' icon={faChartLine} />
            <CategoryItemIcon count={submissionCount} type='task' word='submissions' icon={faExternalLinkAlt} />
            <CategoryItemIcon count={upvoteTotal} type='task' word='up-votes' icon={faHeart} />
          </div>
        </div>
      </div>
    </Link>
  )
}
export default FeaturedTask
