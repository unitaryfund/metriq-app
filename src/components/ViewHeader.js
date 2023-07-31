const ViewHeader = (props) => <header><h2 align={props.align ? props.align : 'left'} className='view-header'>{props.children}</h2></header>
export default ViewHeader
