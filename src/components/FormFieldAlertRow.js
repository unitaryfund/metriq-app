const FormFieldAlertRow = (props) => {
  return (
    <div className='row'>
      <div className='col-md-3' />
      <div className='col-md-6'>
        {props.children}
      </div>
      <div className='col-md-3' />
    </div>
  )
}

export default FormFieldAlertRow
