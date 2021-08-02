import { Link } from 'react-router-dom'

const CategoryListItem = (props) => {
  return (
    <div className='row'>
      <div className='col-md-12'>
        <Link to={props.routePrefix + '/' + (props.isTag ? props.item.name : props.item._id)}>{props.item.name} {props.isPopular ? (props.item.upvoteTotal ? '(' + props.item.upvoteTotal + ')' : '') : (props.item.submissionCount ? '(' + props.item.submissionCount + ')' : '')}</Link>
      </div>
    </div>
  )
}

export default CategoryListItem
