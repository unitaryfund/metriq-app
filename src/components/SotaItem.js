import { Link } from 'react-router-dom/'

const SotaItem = (props) =>
  <span>
    <div className='row'>
      <div className='col-md-9 text-start' style={{ fontSize: '1.1em' }}>
        <p><Link to={'/Task/' + props.taskId}><b>{props.title}</b></Link></p>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-9 text-start'>
        <p>{props.description}</p>
      </div>
    </div>
    <div className='row'>
      <label htmlFor={props.name + '-value'} className='col-md-1 text-start'>Value:</label>
      <div className='col-md-6 text-start'><Link to={'/Submission/' + props.submissionId}>{props.value}</Link></div>
    </div>
    <div className='row'>
      <label htmlFor={props.name + '-value'} className='col-md-1 text-start'>{props.isPlatform ? 'Platform:' : 'Method:'}</label>
      <div className='col-md-6 text-start'>{props.method}</div>
    </div>
    <div className='row'>
      <label htmlFor={props.name + '-value'} className='col-md-1 text-start'>Architecture:</label>
      <div className='col-md-6 text-start'>{props.architecture}</div>
    </div>
    <br />
  </span>

export default SotaItem
