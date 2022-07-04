const FieldRow = (props) =>
  <div className='row'>
    <label htmlFor={props.fieldName} className='col-md-3'>{props.label}</label>
    <div id={props.fieldName} name={props.fieldName} className='col-md-6'>{props.value}</div>
    <div className='col-md-3' />
  </div>

export default FieldRow
