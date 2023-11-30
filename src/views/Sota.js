import { Link } from 'react-router-dom/'
import FeaturedTask from '../components/FeaturedTask'

const Sota = (props) => {
  return (
    <div id='metriq-main-content'>
      <div className='row'>
        <div className='col'>
          <h4 align='left'>State of the Art</h4>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left'>
          The current highest quantum volume across the industry is <b>2^19</b>.
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text'>
          <FeaturedTask
            taskId={34}
            index={0}
            isLog
            logBase={2}
            isLoggedIn={props.isLoggedIn}
          />
          <br />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left'>
          The current highest T2 coherence time across the industry is <b>21 seconds</b>.
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9'>
          <FeaturedTask
            taskId={50}
            index={1}
            isLog
            isLoggedIn={props.isLoggedIn}
          />
          <br />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left'>
          The current highest coherence gain across the industry is <b>5.1</b>.
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9'>
          <FeaturedTask
            taskId={164}
            index={2}
            isLoggedIn={props.isLoggedIn}
          />
          <br />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-9 text-left'>
          <p><Link to='/Platform/80'><b>Quantinuum System Model H1-1</b></Link>, based on the <Link to='/Architecture/2'><b>Ion architecture</b></Link>, has the highest <Link to='/Submission/642'><b>quantum volume of  2^19</b></Link> in the industry, equivalent to <b>19 "algorithmic qubits,"</b> without error correction.</p>
          <p>We are still in the <b>"noisy intermediate-scale quantum" (NISQ)</b> era of quantum computing: qubit count and quality remain too low for practical error correction schemes. Therefore, we must still use our "cleanest" subset of hardware qubits as our logical qubits, without error correction.</p>
          <p><Link to='/Architecture/4'><b>Spin qubits</b></Link> based on silicon, as well as <b>neutral atom qubits</b>, lead the field for <b>T2 coherence time,</b> up to about <Link to='/Submission/589'><b>21 seconds</b></Link> before these qubits entirely lose their original computational state.</p>
          <p>Proof-of-concept of <b>error correction</b> has been achieved up to a <b>coherence gain</b> multiplicative factor of about <Link to='/Submission/463'><b>5.1 with the Star Code</b></Link>, meaning that these test systems achieved 5.1 times the coherence time of their hardware qubits.</p>
        </div>
      </div>
    </div>
  )
}

export default Sota
