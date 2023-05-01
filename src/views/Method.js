import axios from 'axios'
import React, { Suspense } from 'react'
import config from './../config'
import ErrorHandler from './../components/ErrorHandler'
import Commento from '../components/Commento'
import { Button, Modal } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TooltipTrigger from '../components/TooltipTrigger'
import SocialShareIcons from '../components/SocialShareIcons'
import { sortByCounts } from '../components/SortFunctions'
import FormFieldWideRow from '../components/FormFieldWideRow'
import SubscribeButton from '../components/SubscribeButton'
import CategoryScroll from '../components/CategoryScroll'
import SortingTable from '../components/SortingTable'
const FormFieldRow = React.lazy(() => import('../components/FormFieldRow'))
const FormFieldSelectRow = React.lazy(() => import('../components/FormFieldSelectRow'))

library.add(faEdit)

function withParams (Component) {
  return props => <Component {...props} params={useParams()} />
}

class Method extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      methodId: this.props.params.id,
      requestFailedMessage: '',
      showEditModal: false,
      method: { description: '', parentMethod: 0 },
      item: { parentMethod: {}, submissions: [] },
      allMethodNames: []
    }

    this.fetchData = this.fetchData.bind(this)
    this.handleSubscribe = this.handleSubscribe.bind(this)
    this.handleShowEditModal = this.handleShowEditModal.bind(this)
    this.handleHideEditModal = this.handleHideEditModal.bind(this)
    this.handleEditModalDone = this.handleEditModalDone.bind(this)
    this.handleTrimMethods = this.handleTrimMethods.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  handleLoginRedirect () {
    this.props.history.push('/Login/' + encodeURIComponent('Method/' + this.props.match.params.id))
  }

  handleSubscribe () {
    if (this.props.isLoggedIn) {
      axios.post(config.api.getUriPrefix() + '/method/' + this.props.match.params.id + '/subscribe', {})
        .then(res => {
          this.setState({ item: res.data.data })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      this.handleLoginRedirect()
    }
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
      this.handleLoginRedirect()
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

  fetchData (id) {
    window.scrollTo(0, 0)

    const methodRoute = config.api.getUriPrefix() + '/method/' + id
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

  componentDidMount () {
    const { id } = this.props.params
    this.setState({ methodId: id })
    this.fetchData(id)
  }

  componentDidUpdate (prevProps) {
    const { id } = this.props.params
    if (this.state.methodId !== id) {
      this.setState({ methodId: id })
      this.fetchData(id)
    }
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
            <SubscribeButton isSubscribed={this.state.item.isSubscribed} typeLabel='method' onSubscribe={this.handleSubscribe} />
            <SocialShareIcons url={config.web.getUriPrefix() + '/method/' + this.props.match.params.id} />
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
              <h2>Child Tasks</h2>
              <CategoryScroll type='method' items={this.state.item.childMethods} isLoggedIn={this.props.isLoggedIn} />
              <br />
            </div>}
          <br />
          {(this.state.item.submissions.length > 0) &&
            <div>
              <h2>Submissions</h2>
              <FormFieldWideRow>
                <SortingTable
                  className='detail-table'
                  columns={[{
                    title: 'Name',
                    key: 'name',
                    width: 700
                  },
                  {
                    title: 'Submitted',
                    key: 'createdAt',
                    width: 200
                  },
                  {
                    title: 'Up-votes',
                    key: 'upvoteCount',
                    width: 200
                  }]}
                  data={this.state.item.submissions.map(row => ({
                    key: row.id,
                    name: row.name,
                    createdAt: new Date(row.createdAt).toLocaleDateString('en-US'),
                    upvoteCount: row.upvoteCount || 0
                  }))}
                  onRowClick={(record) => this.props.history.push('/Submission/' + record.key)}
                  tableLayout='auto'
                  rowClassName='link'
                />
              </FormFieldWideRow>
              <br />
            </div>}
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
                Please <Link to={'/Login/' + encodeURIComponent('Method/' + this.props.match.params.id)}>login</Link> before editing.
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

export default withParams(Method)
