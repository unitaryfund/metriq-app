import SubmissionScroll from '../components/SubmissionScroll'

const Submissions = (props) => {
  return (
    <div id='metriq-main-content' className='container'>
      <header>Your Submissions</header>
      <br />
      <SubmissionScroll isLoggedIn isEditView />
    </div>
  )
}

export default Submissions
