const FormFieldAlertRow = (props) =>
  <div className='row'>
    <div className='col-md-3' />
    <div className={'col-md-6 ' + props.className}>
      {props.children}
    </div>
    <div className='col-md-3' />
  </div>

export default FormFieldAlertRow
