import iqtLogo from './../images/iqt_logo.png'
import quicLogo from './../images/quic_logo.png'
import qedcLogo from './../images/qedc_logo.png'

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
            <div className='text-center'>
              <img src={iqtLogo} alt='IQT Logo' className='logo-image' />
              <img src={quicLogo} alt='QUIC Logo' className='logo-image' />
              <img src={qedcLogo} alt='QEDC Logo' className='logo-image' />
            </div>
          </div>
        </div>
        <div className='col-md-2' />
      </div>
    </div>
  )
}

export default Partners
