import { Tabs, Tab } from 'react-bootstrap'
import SubmissionScroll from '../components/SubmissionScroll'

const Home = (props) => {
  return (
    <div className='container'>
      <header>MetriQ - Top Submissions {props.match ? 'for "' + props.match.params.tag + '"' : ''}</header>
      <br />
      <Tabs defaultActiveKey='trending' id='top-submissions-tabs'>
        <Tab eventKey='trending' title='Trending'>
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
