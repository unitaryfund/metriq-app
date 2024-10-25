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
    <br />
  </span>

export default SotaItem
