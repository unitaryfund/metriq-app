const FormFieldAlertRow = (props) =>
  <div className='row'>
    <div className='col-md-3' />
    <div className={props.className ? 'col-md-6 ' + props.className : 'col-md-6'}>
      {props.children}
    </div>
    <div className='col-md-3' />
  </div>

export default FormFieldAlertRow
