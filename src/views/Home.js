import { useEffect } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import SubmissionScroll from '../components/SubmissionScroll'

const Home = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div id='metriq-main-content' className='container'>
      <header><h4>Top Submissions {props.match ? 'for "' + props.match.params.tag + '"' : ''}</h4></header>
      <br />
      <Tabs defaultActiveKey='trending' id='top-submissions-tabs'>
        <Tab eventKey='trending' title='Trending' className='metriq-nav-tab'>
          <SubmissionScroll sortType='trending' isLoggedIn={props.isLoggedIn} tag={props.match ? props.match.params.tag : ''} key={Math.random()} />
        </Tab>
        <Tab eventKey='popular' title='Popular'>
          <SubmissionScroll sortType='popular' isLoggedIn={props.isLoggedIn} tag={props.match ? props.match.params.tag : ''} key={Math.random()} />
        </Tab>
        <Tab eventKey='latest' title='Latest'>
          <SubmissionScroll sortType='latest' isLoggedIn={props.isLoggedIn} tag={props.match ? props.match.params.tag : ''} key={Math.random()} />
        </Tab>
      </Tabs>
    </div>
  )
}

export default Home
