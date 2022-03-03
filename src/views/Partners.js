import cqcLogo from './../images/cqc_logo.png'
import iqtLogo from './../images/iqt_logo.png'
import rikenLogo from './../images/riken_logo.png'
import ufLogo from './../images/unitary_fund_logo.png'
import usraLogo from './../images/usra_logo.png'

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
            <center>
              <div className='image-center'>
                <a href='https://www.iqt.org/'><img src={iqtLogo} alt='IQT partner logo' className='logo-image' /></a>
                <a href='https://unitary.fund/'><img src={ufLogo} alt='UF partner logo' className='logo-image' /></a><br></br>
                <a href='https://riacs.usra.edu/quantum/nisqc-nl'><img src={usraLogo} alt='USRA partner logo' className='logo-image' /></a>
                <a href='https://cambridgequantum.com/'><img src={cqcLogo} alt='Cambridge Quantum Computing partner logo' className='logo-image' /></a>
                <a href='https://www.riken.jp/en/'><img src={rikenLogo} alt='Riken University logo' className='logo-image' /></a>
              </div>
            </center>
          </div>
        </div>
        <div className='col-md-2' />
      </div>
    </div>
  )
}

export default Partners
