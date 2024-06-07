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

    const fetchNames = async () => {
      try {
        const { data: { data: tNames } } = await axios.get(config.api.getUriPrefix() + '/task/names')
        const { data: { data: mNames } } = await axios.get(config.api.getUriPrefix() + '/method/names')
        const { data: { data: pNames } } = await axios.get(config.api.getUriPrefix() + '/platform/names')
        const { data: { data: tgNames } } = await axios.get(config.api.getUriPrefix() + '/tag/names')
        const { data: { data: sNames } } = await axios.get(config.api.getUriPrefix() + '/submission/names')

        setTaskNames(tNames)
        setMethodNames(mNames)
        setPlatformNames(pNames)
        setTagNames(tgNames)
        setSubmissionNames(sNames)
        setAllNames([...tNames, ...mNames, ...pNames, ...tgNames, ...sNames])
      } catch (err) {
        console.log(err)
      }
    }

    fetchNames()
  }, [allNames.length])

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
        placeholder='Search'
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
