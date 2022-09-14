import axios from 'axios'
import config from '../config'
import ErrorHandler from '../components/ErrorHandler'
import React, { useEffect, useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import ViewHeader from '../components/ViewHeader'
import SubmissionScroll from '../components/SubmissionScroll'
import SubscribeButton from '../components/SubscribeButton'

// See https://stackoverflow.com/questions/71663319/react-navigate-to-react-bootstrap-tab-with-history#answer-71668423
const DEFAULT_INITIAL_TAB = 'Trending'

const Home = (props) => {
  const { tag } = useParams()
  const history = useHistory()
  const [activeTab, setActiveTab] = useState(DEFAULT_INITIAL_TAB)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    if (!props.tabKey) {
      history.replace(tag ? `/Tag/${tag}/${DEFAULT_INITIAL_TAB}` : `/Submissions/${DEFAULT_INITIAL_TAB}`)
    }
    setActiveTab(props.tabKey)

    if (!props.match) {
      return
    }

    axios.get(config.api.getUriPrefix() + '/tag/' + encodeURIComponent(props.match.params.tag))
      .then(res => {
        setIsSubscribed(res.data.data.isSubscribed)
      })
      .catch(err => {
        window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
      })
  }, [props, history, tag])

  const toggle = (tab) => {
    if (props.tabKey !== tab) {
      history.replace(tag ? `/Tag/${tag}/${tab}` : `/Submissions/${tab}`)
    }
    setActiveTab(tab)
  }

  const handleLoginRedirect = () => {
    props.history.push('/Login/' + encodeURIComponent('Tag/' + props.match.params.tag + '/' + props.tabKey))
  }

  const handleSubscribe = () => {
    if (props.isLoggedIn) {
      axios.post(config.api.getUriPrefix() + '/tag/' + encodeURIComponent(props.match.params.tag) + '/subscribe', {})
        .then(res => {
          setIsSubscribed(res.data.data)
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      handleLoginRedirect()
    }
  }

  return (
    <div id='metriq-main-content' className='container'>
      <ViewHeader>
        Top Submissions {props.match ? 'for "' + props.match.params.tag + '"' : ''}
        {props.match &&
          <span>&nbsp;<SubscribeButton isSubscribed={isSubscribed} typeLabel='method' onSubscribe={handleSubscribe} /></span>}
      </ViewHeader>
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
