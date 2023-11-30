import { Link } from 'react-router-dom/'

const Sota = (props) => {
  return (
    <div id='metriq-main-content'>
      <div className='row'>
        <div className='col'>
          <h4 align='left'>State of the Art Quantum Benchmarks</h4>
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col'>
          <h5 align='left'>Hardware</h5>
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col-md-9 text-left' style={{ fontSize: '1.1em' }}>
          The current highest <Link to='/Task/34'><b>Quantum Volume</b></Link> across the industry is <Link to='/Submission/642'><b>2^19</b></Link> by <Link to='/Platform/80'><b>Quantinuum System Model H1-1</b></Link>.
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left' style={{ fontSize: '.9em' }}>
          The Log-2 Quantum Volume is otherwise known as "algorithmic qubits" (in the absence of error correction) and constitutes the effective number of viable logical qubits (for QV-like tasks).
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col-md-9 text-left' style={{ fontSize: '1.1em' }}>
          The current highest <Link to='/Task/50'><b>T2 Coherence Time</b></Link> across the industry is <Link to='/Submission/589'><b>21 seconds</b></Link> with <Link to='/Architecture/4'><b>spin qubits</b></Link> based on silicon and <Link to='/Architrecture/1'><b>neutral atom qubits</b></Link>.
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left' style={{ fontSize: '.9em' }}>
          On the timescale of the T2 time, qubits entirely lose their original computational state to dephasing.
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col'>
          <h5 align='left'>Error correction and mitigation</h5>
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col-md-9 text-left' style={{ fontSize: '1.1em' }}>
          The current highest  <Link to='/Task/164'><b>Coherence Gain</b></Link> across the industry is <Link to='/Submission/463'><b>5.1 with the Star Code</b></Link>.
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left' style={{ fontSize: '0.9em' }}>
          Coherence Gain is the multiplicative factor by which the error-corrected coherence time is improved vs. hardware qubits without error correction.
        </div>
      </div>
    </div>
  )
}

export default Sota
