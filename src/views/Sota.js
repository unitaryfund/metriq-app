import FeaturedTask from '../components/FeaturedTask'

const Sota = (props) => {
  return (
    <div id='metriq-main-content'>
      <div className='row'>
        <div className='col'>
          <h4 align='left'>State of the Art</h4>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left'>
          The current highest quantum volume across the industry is <b>2^19</b>.
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text'>
          <FeaturedTask
            taskId={34}
            index={0}
            logBase={2}
            isLoggedIn={props.isLoggedIn}
          />
          <br />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left'>
          The current highest T2 coherence time across the industry is <b>21 seconds</b>.
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9'>
          <FeaturedTask
            taskId={50}
            index={1}
            isLoggedIn={props.isLoggedIn}
          />
          <br />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left'>
          The current highest coherence gain across the industry is <b>5.1</b>.
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9'>
          <FeaturedTask
            taskId={164}
            index={2}
            isLoggedIn={props.isLoggedIn}
          />
          <br />
        </div>
      </div>
    </div>
  )
}

export default Sota
