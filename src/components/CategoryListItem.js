import { Link } from 'react-router-dom'

const CategoryListItem = (props) => {
  return (
    <div className='row'>
      <div className='col-md-12'>
        <Link to={'/Category/' + props.item.name}>{props.item.name} {props.item.submissionCount ? '(' + props.item.submissionCount + ')' : ''}</Link>
      </div>
    </div>
  )
}

export default CategoryListItem
