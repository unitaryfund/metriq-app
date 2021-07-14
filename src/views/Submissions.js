import SubmissionScroll from '../components/SubmissionScroll'

const Submissions = (props) => {
  return (
    <div className='container'>
      <header>MetriQ - Your Submissions</header>
      <br />
      <SubmissionScroll isLoggedIn isEditView />
    </div>
  )
}

export default Submissions
