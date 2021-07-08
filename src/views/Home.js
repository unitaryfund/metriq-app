import { Tabs, Tab } from 'react-bootstrap'
import SubmissionScroll from '../components/SubmissionScroll'

const Home = () => {
  return (
    <div className='container'>
      <header>MetriQ - Top Submissions</header>
      <br />
      <Tabs defaultActiveKey='trending' id='top-submissions-tabs'>
        <Tab eventKey='trending' title='Trending'>
          <SubmissionScroll sortType='trending' />
        </Tab>
        <Tab eventKey='popular' title='Popular'>
          <SubmissionScroll sortType='popular' />
        </Tab>
        <Tab eventKey='latest' title='Latest'>
          <SubmissionScroll sortType='latest' />
        </Tab>
      </Tabs>
    </div>
  )
}

export default Home
