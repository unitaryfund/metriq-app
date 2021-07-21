import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from 'react-bootstrap'

library.add(faEdit, faPlus, faMinus)

const EditButton = (props) => {
  return (
    <Dropdown className={props.className}>
      <Dropdown.Toggle variant='Default'>
        <FontAwesomeIcon className='edit-button-icon' icon='edit' /> Edit
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item><FontAwesomeIcon className='edit-button-icon' icon='plus' onClick={props.onClickAdd} /> Add</Dropdown.Item>
        <Dropdown.Item><FontAwesomeIcon className='edit-button-icon' icon='minus' onClick={props.onClickRemove} /> Remove</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default EditButton
