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
      <br />
      <div className='row'>
        <div className='col'>
          <h5 align='left'>Summary</h5>
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col-md-9 text-left'>
          <p><Link to='/Platform/80'><b>Quantinuum System Model H1-1</b></Link>, based on the <Link to='/Architecture/2'><b>Ion architecture</b></Link>, has the highest <Link to='/Submission/642'><b>quantum volume of  2^19</b></Link> in the industry, equivalent to <b>19 "algorithmic qubits,"</b> without error correction. We are still in the <b>"noisy intermediate-scale quantum" (NISQ)</b> era of quantum computing: qubit count and quality remain too low for practical error correction schemes. Therefore, log base 2 quantum volume of hardware qubits represents our effective logical qubits for unstructured circuits.</p>
          <p><Link to='/Architecture/4'><b>Spin qubits</b></Link> based on silicon, as well as <Link to='/Architrecture/1'><b>neutral atom qubits</b></Link>, lead the field for <Link to='/Task/50'><b>T2 coherence time,</b></Link> up to about <Link to='/Submission/589'><b>21 seconds</b></Link> before these qubits entirely lose their original computational state.</p>
          <p>Proof-of-concept of <b>error correction</b> has been achieved up to a <Link to='/Task/164'><b>coherence gain</b></Link> multiplicative factor of about <Link to='/Submission/463'><b>5.1 with the Star Code</b></Link>, meaning that these test systems achieved 5.1 times the coherence time of their hardware qubits.</p>
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col'>
          <h5 align='left'>Statistics</h5>
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col-md-9 text-left'>
          The current highest quantum volume across the industry is <Link to='/Submission/642'><b>2^19</b></Link> by <Link to='/Platform/80'><b>Quantinuum System Model H1-1</b></Link>.
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
          The current highest T2 coherence time across the industry is <Link to='/Submission/589'><b>21 seconds</b></Link> with <Link to='/Architecture/4'><b>spin qubits</b></Link> based on silicon and <Link to='/Architrecture/1'><b>neutral atom qubits</b></Link>.
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
          The current highest coherence gain across the industry is <Link to='/Submission/463'><b>5.1 with the Star Code</b></Link>.
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
    </div>
  )
}

export default Sota
