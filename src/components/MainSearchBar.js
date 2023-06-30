import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from './../config'
import { useHistory } from 'react-router-dom'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'

const MainSearchBar = () => {
  const [allNames, setAllNames] = useState([])
  const [taskNames, setTaskNames] = useState([])
  const [methodNames, setMethodNames] = useState([])
  const [platformNames, setPlatformNames] = useState([])
  const [tagNames, setTagNames] = useState([])
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

                axios.get(config.api.getUriPrefix() + '/tag/names')
                  .then(res => {
                    const tgNames = res.data.data
                    setTagNames(tgNames)

                    axios.get(config.api.getUriPrefix() + '/submission/names')
                      .then(res => {
                        const sNames = res.data.data
                        setSubmissionNames(sNames)

                        setAllNames(tNames.concat(mNames).concat(pNames).concat(tgNames).concat(sNames))
                      })
                      .catch(err => {
                        console.log(err)
                      })
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
    if (tagNames.includes(value)) {
      history.push('/Tag/' + encodeURIComponent(value.name))
    }
    if (submissionNames.includes(value)) {
      history.push('/Submission/' + value.id)
    }
  }
  return (
    <div className='main-search-bar'>
      <FormFieldTypeaheadRow
        options={allNames}
        labelKey='name'
        inputName='name'
        placeholder='Search...'
        value=''
        onSelect={handleOnSelect}
        className='main-search-bar-form-field-row'
        alignLabelRight
        isWide
      />
    </div>
  )
}

export default MainSearchBar
