import SotaItem from '../components/SotaItem'
import { Link } from 'react-router-dom/'

const Sota = (props) => {
  return (
    <div id='metriq-main-content'>
      <div className='row'>
        <div className='col'>
          <h4 align='left'>State of the Art Quantum Benchmarks</h4>
        </div>
      </div>
      <div className='row'>
        <div className='col text-start'>
          <p>These are benchmarks that the Metriq team thinks give a handle on understanding the state-of-the-art in quantum computing. Click into each task comparison to see the latest data.</p>
        </div>
      </div>
      <br />
      <div className='row'>
        <div className='col'>
          <h5 align='left'><b>Hardware</b></h5>
        </div>
      </div>
      <br />
      <SotaItem
        title='Quantum Volume'
        description='The Log-2 Quantum Volume is otherwise known as "algorithmic qubits" (in the absence of error correction) and constitutes the effective number of viable logical qubits (for QV-like tasks).'
        value='2^21'
        submissionId={642}
        taskId={34}
        method={<Link to={'/Platform/' + 80}>Quantinuum System Model H1-1</Link>}
        architecture={<Link to={'/Architecture/' + 2}>Ion</Link>}
        isPlatform
      />
      <SotaItem
        title='T2 Coherence Time'
        description='On the time scale of the T2 time, qubits entirely lose their original computational state to dephasing.'
        value='21 seconds'
        submissionId={589}
        taskId={50}
        method={<span><Link to={'/Platform/' + 146}>Spin-qubit processors</Link> and <Link to={'/Platform/' + 149}>Optical Tweezers</Link></span>}
        architecture={<span><Link to='/Architecture/4'>Spin Qubits</Link> and <Link to='/Architrecture/1'>Neutral Atom Qubits</Link></span>}
        isPlatform
      />
      <SotaItem
        title='Error Per Layered Gate (100-qubit)'
        description='Average error for each gate in layered circuits'
        value={0.00845626}
        submissionId={729}
        taskId={203}
        method={<Link to='/Platform/195'>IBMQ Torino</Link>}
        architecture={<Link to='/Architecture/5'>Superconducting Circuits</Link>}
        isPlatform
      />
      <br />
      <div className='row'>
        <div className='col'>
          <h5 align='left'><b>Error correction and mitigation</b></h5>
        </div>
      </div>
      <br />
      <SotaItem
        title='Coherence Gain'
        description='Coherence Gain is the multiplicative factor by which the error-corrected coherence time is improved vs. hardware qubits without error correction.'
        value={5.1}
        submissionId={463}
        taskId={164}
        method={<Link to='/Method/312'>Star Code</Link>}
        architecture={<Link to='/Architecture/5'>Superconducting Circuits</Link>}
      />
      <SotaItem
        title='Error-Corrected Logical Qubit Count'
        description='Quantum error correction (QEC) is used in quantum computing to protect quantum information from errors due to decoherence and other quantum noise. Quantum error correction is theorized as essential to achieve fault tolerant quantum computing that can reduce the effects of noise on stored quantum information, faulty quantum gates, faulty quantum preparation, and faulty measurements. This would allow algorithms of greater circuit depth. (We report the highest count of error-corrected qubits achieved in any platform.)'
        value={48}
        submissionId={732}
        taskId={141}
        method={<Link to='/Method/349'>3D Color Code</Link>}
        architecture={<Link to='/Architrecture/1'>Neutral Atom Qubits</Link>}
      />
      <div className='row'>
        <div className='col-md-9 text-start'>
          <b>Make a new <Link to='/AddSubmission'>submission</Link> to report the performance of different <Link to='/Methods'>methods</Link> on <Link to='/Platforms'>platforms</Link> against <Link to='/Tasks'>tasks</Link>.</b>
        </div>
      </div>
    </div>
  )
}

export default Sota
