import { useEffect } from 'react'
import SubmissionScroll from '../components/SubmissionScroll'
import ViewHeader from '../components/ViewHeader'

const MySubmissions = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div id='metriq-main-content' className='container'>
      <ViewHeader>Your Submissions</ViewHeader>
      <br />
      <SubmissionScroll isLoggedIn isEditView />
    </div>
  )
}

export default MySubmissions
