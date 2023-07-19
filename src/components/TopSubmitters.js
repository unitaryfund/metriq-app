import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Tabs, Tab } from 'react-bootstrap'
import config from '../config'
import SortingTable from '../components/SortingTable'

const TopSubmitters = (props) => {
  const [data, setData] = useState({ weekly: [], monthly: [], allTime: [] })
  useEffect(() => {
    if (data.allTime.length) {
      return
    }
    axios.get(config.api.getUriPrefix() + '/user/topSubmitters')
      .then(res => {
        const tSubmitters = res.data.data
        tSubmitters.weekly[0].rank = '🥇'
        tSubmitters.weekly[1].rank = '🥈'
        tSubmitters.weekly[2].rank = '🥉'
        tSubmitters.monthly[0].rank = '🥇'
        tSubmitters.monthly[1].rank = '🥈'
        tSubmitters.monthly[2].rank = '🥉'
        tSubmitters.allTime[0].rank = '🥇'
        tSubmitters.allTime[1].rank = '🥈'
        tSubmitters.allTime[2].rank = '🥉'

        const ts = { weekly: [], monthly: [], allTime: [] }
        for (let i = 0; i < 3; ++i) {
          if (tSubmitters.weekly[i].submissionsCount > 0) {
            ts.weekly.push(tSubmitters.weekly[i])
          }
          if (tSubmitters.monthly[i].submissionsCount > 0) {
            ts.monthly.push(tSubmitters.monthly[i])
          }
          if (tSubmitters.allTime[i].submissionsCount > 0) {
            ts.allTime.push(tSubmitters.allTime[i])
          }
        }

        setData(ts)
      })
  })
  return (
    <span>
      <h5>Top Submitters</h5>
      {props.isOnlyAllTime &&
        <div className='card'>
          <SortingTable
            columns={[
              {
                title: 'Name',
                key: 'username',
                width: 360
              },
              {
                title: 'Rank',
                key: 'rank',
                width: 80
              },
              {
                title: 'Submission Count',
                key: 'submissionsCount',
                width: 360
              }
            ]}
            data={data.allTime}
            key={Math.random()}
            onRowClick={(record) => this.props.history.push('/User/' + record.id + '/Submissions')}
            tableLayout='auto'
            rowClassName='link'
          />
        </div>}
      {!props.isOnlyAllTime &&
        <Tabs id='top-submissions-tabs'>
          {(data.weekly.length > 0) &&
            <Tab eventKey='Weekly' title='Weekly' className='metriq-nav-tab'>
              <div className='card'>
                <SortingTable
                  columns={[
                    {
                      title: 'Name',
                      key: 'username',
                      width: 360
                    },
                    {
                      title: 'Rank',
                      key: 'rank',
                      width: 80
                    },
                    {
                      title: 'Submission Count',
                      key: 'submissionsCount',
                      width: 360
                    }
                  ]}
                  data={data.weekly}
                  key={Math.random()}
                  onRowClick={(record) => this.props.history.push('/User/' + record.id + '/Submissions')}
                  tableLayout='auto'
                  rowClassName='link'
                />
              </div>
            </Tab>}
          {(data.monthly.length > 0) &&
            <Tab eventKey='Monthly' title='Monthly' className='metriq-nav-tab'>
              <div className='card'>
                <SortingTable
                  columns={[
                    {
                      title: 'Name',
                      key: 'username',
                      width: 360
                    },
                    {
                      title: 'Rank',
                      key: 'rank',
                      width: 80
                    },
                    {
                      title: 'Submission Count',
                      key: 'submissionsCount',
                      width: 360
                    }
                  ]}
                  data={data.monthly}
                  key={Math.random()}
                  onRowClick={(record) => this.props.history.push('/User/' + record.id + '/Submissions')}
                  tableLayout='auto'
                  rowClassName='link'
                />
              </div>
            </Tab>}
          {(data.allTime.length > 0) &&
            <Tab eventKey='AllTime' title='All Time' className='metriq-nav-tab'>
              <div className='card'>
                <SortingTable
                  columns={[
                    {
                      title: 'Name',
                      key: 'username',
                      width: 360
                    },
                    {
                      title: 'Rank',
                      key: 'rank',
                      width: 80
                    },
                    {
                      title: 'Submission Count',
                      key: 'submissionsCount',
                      width: 360
                    }
                  ]}
                  data={data.allTime}
                  key={Math.random()}
                  onRowClick={(record) => this.props.history.push('/User/' + record.id + '/Submissions')}
                  tableLayout='auto'
                  rowClassName='link'
                />
              </div>
            </Tab>}
        </Tabs>}
    </span>
  )
}

export default TopSubmitters
