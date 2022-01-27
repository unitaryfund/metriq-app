import iqt_logo from './../images/iqt_logo.png'
import quic_logo from './../images/quic_logo.png'
import qedc_logo from './../images/qedc_logo.png'

const Partners = () => {
  return (
    <div id='metriq-main-content' className='container'>
      <div className='row'>
        <div className='col-md-2' />
        <div className='col-md-8 text-justify'>
          <h1 className='text-center'>Our Partners and Supporters</h1>
          <div>
            <p>
              We thank the following organizations and institutions for their support.
            </p>
            <p>
              If your organization or institution would like to become a partner, please contact us at <a href='mailto:metriq@unitary.fund'>metriq@unitary.fund</a>.
            </p>
            <img src={iqt_logo} alt='iqt_logo' className='logo-image' />
            <img src={quic_logo} alt='quic_logo' className='logo-image' />
            <img src={qedc_logo} alt='qedc_logo' className='logo-image' />
          </div>
        </div>
        <div className='col-md-2' />
      </div>
    </div>
  )
}

export default Partners
