const SotaControlRow = (props) =>
  <div className='row sota-control-row'>
    <span htmlFor={props.name} className='col col-md-5 form-field-label metric-chart-label text-start'>{props.label}</span>
    <div className='col col-md-7'>
      <select
        className='form-control'
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
      >
        {Object.entries(props.options).map(x => <option key={x[0]} value={x[0]}>{x[1]}</option>)}
      </select>
    </div>
  </div>
export default SotaControlRow
