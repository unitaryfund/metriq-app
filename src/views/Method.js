import axios from 'axios'
import React, { Suspense } from 'react'
import config from './../config'
import Table from 'rc-table'
import ErrorHandler from './../components/ErrorHandler'
import Commento from '../components/Commento'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TooltipTrigger from '../components/TooltipTrigger'
import SocialShareIcons from '../components/SocialShareIcons'
import { sortByCounts } from '../components/SortFunctions'
import FormFieldWideRow from '../components/FormFieldWideRow'
const FormFieldRow = React.lazy(() => import('../components/FormFieldRow'))
const FormFieldSelectRow = React.lazy(() => import('../components/FormFieldSelectRow'))

library.add(faEdit)

class Method extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      requestFailedMessage: '',
      showEditModal: false,
      method: { description: '', parentMethod: 0 },
      item: { parentMethod: {} },
      allMethodNames: []
    }

    this.handleShowEditModal = this.handleShowEditModal.bind(this)
    this.handleHideEditModal = this.handleHideEditModal.bind(this)
    this.handleEditModalDone = this.handleEditModalDone.bind(this)
    this.handleTrimMethods = this.handleTrimMethods.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  handleShowEditModal () {
    let mode = 'Edit'
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    const method = {
      description: this.state.item.description,
      parentMethod: this.state.item.parentMethod
        ? { id: this.state.item.parentMethod.id, name: this.state.item.parentMethod.id }
        : { id: 0, name: '(None)' }
    }
    this.setState({ showEditModal: true, modalMode: mode, method: method })
  }

  handleHideEditModal () {
    this.setState({ showEditModal: false })
  }

  handleEditModalDone () {
    if (!this.props.isLoggedIn) {
      this.props.history.push('/Login')
    }

    const reqBody = {
      description: this.state.method.description,
      parentMethod: this.state.method.parentMethod ? this.state.method.parentMethod : null
    }

    axios.post(config.api.getUriPrefix() + '/method/' + this.props.match.params.id, reqBody)
      .then(res => {
        this.setState({ item: res.data.data, showEditModal: false })
      })
      .catch(err => {
        window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
      })
  }

  handleOnChange (key1, key2, value) {
    if (!value && value !== false) {
      value = null
    }
    if (key1) {
      const k1 = this.state[key1]
      k1[key2] = value
      this.setState({ [key1]: k1 })
    } else {
      this.setState({ [key2]: value })
    }
  }

  handleTrimMethods (methodId, methods) {
    for (let j = 0; j < methods.length; j++) {
      if (methodId === methods[j].id) {
        methods.splice(j, 1)
        break
      }
    }
    methods.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })
  }

  componentDidMount () {
    window.scrollTo(0, 0)

    const methodRoute = config.api.getUriPrefix() + '/method/' + this.props.match.params.id
    axios.get(methodRoute)
      .then(res => {
        const method = res.data.data
        method.childMethods.sort(sortByCounts)
        this.setState({ requestFailedMessage: '', item: method })

        const methodNamesRoute = config.api.getUriPrefix() + '/method/names'
        axios.get(methodNamesRoute)
          .then(res => {
            let methods = [...res.data.data]
            this.handleTrimMethods(method.id, methods)
            methods = [{ id: 0, name: '(None)' }, ...methods]
            this.setState({ requestFailedMessage: '', allMethodNames: methods })
          })
          .catch(err => {
            this.setState({ requestFailedMessage: ErrorHandler(err) })
          })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div id='metriq-main-content'>
        <div className='container submission-detail-container'>
          <FormFieldWideRow>
            <div><h1>{this.state.item.fullName ? this.state.item.fullName : this.state.item.name}</h1></div>
            <div className='submission-description'>
              {this.state.item.description ? this.state.item.description : <i>No description provided.</i>}
            </div>
          </FormFieldWideRow>
          <FormFieldWideRow>
            <TooltipTrigger message='Edit method'>
              <Button className='submission-button' variant='secondary' aria-label='Edit method' onClick={this.handleShowEditModal}><FontAwesomeIcon icon='edit' /></Button>
            </TooltipTrigger>
            <SocialShareIcons url={config.api.getUriPrefix() + '/method/' + this.props.match.params.id} />
          </FormFieldWideRow>
          <br />
          {this.state.item.parentMethod &&
            <div className='row'>
              <div className='col-md-12'>
                <div className='submission-description'>
                  <b>Parent method:</b> <Link to={'/Method/' + this.state.item.parentMethod.id}>{this.state.item.parentMethod.name}</Link>
                </div>
              </div>
              <br />
            </div>}
          {(this.state.item.childMethods && (this.state.item.childMethods.length > 0)) &&
            <div>
              <h2>Child Methods</h2>
              <div className='row'>
                <div className='col-md-12'>
                  <Table
                    className='detail-table'
                    columns={[{
                      title: 'Name',
                      dataIndex: 'name',
                      key: 'name',
                      width: 700
                    }]}
                    data={this.state.item.childMethods
                      ? this.state.item.childMethods.map(row => ({
                          key: row.id,
                          name: row.name,
                          history: this.props.history
                        }))
                      : []}
                    onRow={(record) => ({
                      onClick () { record.history.push('/Method/' + record.key) }
                    })}
                    tableLayout='auto'
                    rowClassName='link'
                  />
                </div>
              </div>
              <br />
            </div>}
          <br />
          <h2>Submissions</h2>
          <div className='row'>
            <div className='col-md-12'>
              <Table
                className='detail-table'
                columns={[{
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                  width: 700
                },
                {
                  title: 'Submitted',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  width: 200
                },
                {
                  title: 'Up-votes',
                  dataIndex: 'upvoteCount',
                  key: 'upvoteCount',
                  width: 200
                }]}
                data={this.state.item.submissions
                  ? this.state.item.submissions.map(row => ({
                      key: row.id,
                      name: row.name,
                      createdAt: new Date(row.createdAt).toLocaleDateString('en-US'),
                      upvoteCount: row.upvoteCount || 0,
                      history: this.props.history
                    }))
                  : []}
                onRow={(record) => ({
                  onClick () { record.history.push('/Submission/' + record.key) }
                })}
                tableLayout='auto'
                rowClassName='link'
              />
            </div>
          </div>
          <FormFieldWideRow>
            <hr />
            <Commento id={'method-' + toString(this.state.item.id)} />
          </FormFieldWideRow>
        </div>
        <Modal
          show={this.state.showEditModal}
          onHide={this.handleHideEditModal}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Method</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(this.state.modalMode === 'Login') &&
              <span>
                Please <Link to='/Login'>login</Link> before editing.
              </span>}
            {(this.state.modalMode !== 'Login') &&
              <span>
                <Suspense fallback={<div>Loading...</div>}>
                  <FormFieldSelectRow
                    inputName='parentMethod'
                    label='Parent method<br/>(if any)'
                    options={this.state.allMethodNames}
                    value={this.state.method.parentMethod.id}
                    onChange={(field, value) => this.handleOnChange('method', field, value)}
                    tooltip='Optionally, the new method is a sub-method of a "parent" method.'
                  /><br />
                  <FormFieldRow
                    inputName='description' inputType='textarea' label='Description' rows='12'
                    value={this.state.method.description}
                    onChange={(field, value) => this.handleOnChange('method', field, value)}
                  />
                </Suspense>
              </span>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={this.handleEditModalDone}>
              {(this.state.modalMode === 'Login') ? 'Cancel' : 'Done'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Method
