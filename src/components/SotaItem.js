import { Link } from 'react-router-dom/'

const SotaItem = (props) =>
  <span>
    <div className='row'>
      <div className='col-md-9 text-left' style={{ fontSize: '1.1em' }}>
        <p><Link to={'/Task/' + props.taskId}><b>{props.title}</b></Link></p>
      </div>
    </div>
    <div className='row'>
      <div className='col-md-9 text-left'>
        <p>{props.description}</p>
      </div>
    </div>
    <div className='row'>
      <label htmlFor={props.name + '-value'} className='col-md-1 text-left'>Value:</label>
      <div className='col-md-6 text-left'><Link to={'/Submission/' + props.submissionId}>{props.value}</Link></div>
    </div>
    <div className='row'>
      <label htmlFor={props.name + '-value'} className='col-md-1 text-left'>{props.isPlatform ? 'Platform:' : 'Method:'}</label>
      <div className='col-md-6 text-left'>{props.method}</div>
    </div>
    <div className='row'>
      <label htmlFor={props.name + '-value'} className='col-md-1 text-left'>Architecture:</label>
      <div className='col-md-6 text-left'>{props.architecture}</div>
    </div>
    <br />
  </span>

export default SotaItem
