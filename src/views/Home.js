import { useEffect, useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import SubmissionScroll from '../components/SubmissionScroll'
import ViewHeader from '../components/ViewHeader'

// See https://stackoverflow.com/questions/71663319/react-navigate-to-react-bootstrap-tab-with-history#answer-71668423
const DEFAULT_INITIAL_TAB = 'Trending'

const Home = (props) => {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState(DEFAULT_INITIAL_TAB)

  useEffect(() => {
    window.scrollTo(0, 0)

    if (!props.tabKey) {
      history.push(`/${DEFAULT_INITIAL_TAB}`, { replace: true })
    }
    setActiveTab(props.tabKey)
  }, [props.tabKey, history])

  // console.log('initial tab : ' + init);
  const toggle = (tab) => {
    if (props.tabKey !== tab) {
      history.push(`/${tab}`, { replace: true })
    }
    setActiveTab(tab)
  }

  return (
    <div id='metriq-main-content' className='container'>
      <ViewHeader>Top Submissions {props.match ? 'for "' + props.match.params.tag + '"' : ''}</ViewHeader>
      <br />
      <Tabs id='top-submissions-tabs' activeKey={activeTab} onSelect={toggle}>
        <Tab eventKey='Trending' title='Trending' className='metriq-nav-tab'>
          <SubmissionScroll sortType='trending' isLoggedIn={props.isLoggedIn} tag={props.match ? props.match.params.tag : ''} key={Math.random()} />
        </Tab>
        <Tab eventKey='Popular' title='Popular' className='metriq-nav-tab'>
          <SubmissionScroll sortType='popular' isLoggedIn={props.isLoggedIn} tag={props.match ? props.match.params.tag : ''} key={Math.random()} />
        </Tab>
        <Tab eventKey='Latest' title='Latest' className='metriq-nav-tab'>
          <SubmissionScroll sortType='latest' isLoggedIn={props.isLoggedIn} tag={props.match ? props.match.params.tag : ''} key={Math.random()} />
        </Tab>
      </Tabs>
    </div>
  )
}

export default Home
