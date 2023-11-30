import FeaturedTask from '../components/FeaturedTask'

const Sota = (props) => {
  return (
    <div id='metriq-main-content'>
      <div className='row'>
        <div className='col-md-9'>
          <FeaturedTask
            taskId={34}
            index={0}
            isLoggedIn={props.isLoggedIn}
          />
          <br />
        </div>
      </div>
    </div>
  )
}

export default Sota
