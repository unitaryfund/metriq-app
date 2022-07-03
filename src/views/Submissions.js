import SubmissionScroll from '../components/SubmissionScroll'
import ViewHeader from '../components/ViewHeader'

const Submissions = () => {
  return (
    <div id='metriq-main-content' className='container'>
      <ViewHeader>Your Submissions</ViewHeader>
      <br />
      <SubmissionScroll isLoggedIn isEditView />
    </div>
  )
}

export default Submissions
