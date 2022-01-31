import SubmissionScroll from '../components/SubmissionScroll'

const SubmissionsPublic = (props) => {
  return (
    <div id='metriq-main-content' className='container'>
      <header><h4>User Submissions</h4></header>
      <br />
      <SubmissionScroll isPublicView userId={props.match.params.userId} isLoggedin={props.isLoggedin} />
    </div>
  )
}

export default SubmissionsPublic
