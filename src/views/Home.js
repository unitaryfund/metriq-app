import { Tabs, Tab } from 'react-bootstrap'
import SubmissionScroll from '../components/SubmissionScroll'

const Home = (props) => {
  return (
    <div id='metriq-main-content' className='container'>
      <header><h5>Top Submissions {props.match ? 'for "' + props.match.params.tag + '"' : ''}</h5></header>
      <br />
      <Tabs defaultActiveKey='trending' id='top-submissions-tabs' className='metriq-nav-tab-bar'>
        <Tab eventKey='trending' title='Trending' className='metriq-nav-tab'>
          <SubmissionScroll sortType='trending' isLoggedIn={props.isLoggedIn} tag={props.match ? props.match.params.tag : ''} />
        </Tab>
        <Tab eventKey='popular' title='Popular'>
          <SubmissionScroll sortType='popular' isLoggedIn={props.isLoggedIn} tag={props.match ? props.match.params.tag : ''} />
        </Tab>
        <Tab eventKey='latest' title='Latest'>
          <SubmissionScroll sortType='latest' isLoggedIn={props.isLoggedIn} tag={props.match ? props.match.params.tag : ''} />
        </Tab>
      </Tabs>
    </div>
  )
}

export default Home
