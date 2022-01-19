import SubmissionScroll from '../components/SubmissionScroll'

const Submissions = (props) => {
  return (
    <div id='metriq-main-content' className='container'>
      <header><h4>Your Submissions</h4></header>
      <br />
      <SubmissionScroll isLoggedIn isEditView />
    </div>
  )
}

export default Submissions
