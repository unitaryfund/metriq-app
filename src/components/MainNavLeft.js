import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import { NavLink, useHistory } from 'react-router-dom'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import config from './../config'

const MainNavLeft = () => {
  const [allNames, setAllNames] = useState([])
  const [taskNames, setTaskNames] = useState([])
  const [methodNames, setMethodNames] = useState([])
  const [platformNames, setPlatformNames] = useState([])
  const [submissionNames, setSubmissionNames] = useState([])
  const history = useHistory()

  useEffect(() => {
    if (allNames.length > 0) {
      return
    }

    axios.get(config.api.getUriPrefix() + '/task/names')
      .then(res => {
        const tNames = res.data.data
        setTaskNames(tNames)

        axios.get(config.api.getUriPrefix() + '/method/names')
          .then(res => {
            const mNames = res.data.data
            setMethodNames(mNames)

            axios.get(config.api.getUriPrefix() + '/platform/names')
              .then(res => {
                const pNames = res.data.data
                setPlatformNames(pNames)

                axios.get(config.api.getUriPrefix() + '/submission/names')
                  .then(res => {
                    const sNames = res.data.data
                    setSubmissionNames(sNames)

                    setAllNames(tNames.concat(mNames).concat(pNames).concat(sNames))
                  })
                  .catch(err => {
                    console.log(err)
                  })
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  }, [allNames, setAllNames,
    taskNames, setTaskNames,
    methodNames, setMethodNames,
    platformNames, setPlatformNames,
    submissionNames, setSubmissionNames])

  const handleOnSelect = (value) => {
    if (!value) {
      return
    }
    if (taskNames.includes(value)) {
      history.push('/Task/' + value.id)
    }
    if (methodNames.includes(value)) {
      history.push('/Method/' + value.id)
    }
    if (platformNames.includes(value)) {
      history.push('/Platform/' + value.id)
    }
    if (submissionNames.includes(value)) {
      history.push('/Submission/' + value.id)
    }
  }

  return (
    <Nav className='metriq-navbar'>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Tasks' className='metriq-navbar-text' eventKey='1'>Tasks</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Methods' className='metriq-navbar-text' eventKey='2'>Methods</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Platforms' className='metriq-navbar-text' eventKey='3'>Platforms</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Tags' className='metriq-navbar-text' eventKey='4'>Tags</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Submissions' className='metriq-navbar-text' eventKey='5'>Submissions</Nav.Link>
      <NavDropdown title='About' active='true' className='metriq-navbar-text' alignRight>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/About' eventKey='6'><p className='font-weight-bold'>About</p></NavDropdown.Item>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/Partners' eventKey='7'><p className='font-weight-bold'>Partners</p></NavDropdown.Item>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/FAQ' eventKey='8'><p className='font-weight-bold'>F.A.Q.</p></NavDropdown.Item>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/UserGuidelines' eventKey='9'><p className='font-weight-bold'>User Guidelines</p></NavDropdown.Item>
      </NavDropdown>
      <div className='main-search-bar'>
        <FormFieldTypeaheadRow
          options={allNames}
          labelKey='name'
          inputName='name'
          label='Search'
          value=''
          onSelect={handleOnSelect}
          alignLabelRight
        />
      </div>
    </Nav>
  )
}

export default MainNavLeft
