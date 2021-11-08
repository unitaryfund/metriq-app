import SubmissionScroll from '../components/SubmissionScroll'

const Submissions = (props) => {
  return (
    <div id='metriq-main-content' className='container'>
      <header><h5>Your Submissions</h5></header>
      <br />
      <SubmissionScroll isLoggedIn isEditView />
    </div>
  )
}

export default Submissions
