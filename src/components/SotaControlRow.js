const SotaControlRow = (props) =>
  <div className='row sota-control-row'>
    <span htmlFor={props.name} className='col col-md-5 form-field-label metric-chart-label text-left'>{props.label}</span>
    <div className='col col-md-7'>
      <select
        id={props.name}
        name={props.name}
        className='form-control'
      >
        {Object.entries(props.options).map(x => <option key={x[0]} value={x[0]}>{x[1]}</option>)}
      </select>
    </div>
  </div>
export default SotaControlRow
