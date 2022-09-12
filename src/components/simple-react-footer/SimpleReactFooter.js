import React from 'react'
import PropTypes from 'prop-types'
import './SimpleReactFooter.sass'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import { FaDiscord, FaGithub, FaPinterestSquare, FaTwitterSquare } from 'react-icons/fa'
import { ImFacebook2, ImInstagram, ImLinkedin, ImTwitch, ImYoutube } from 'react-icons/im'
import { Button } from 'react-bootstrap'
import logo from './../../images/unitary_fund_logo.png'

const CustomMailchimpForm = ({ status, message, onValidated }) => {
  let email
  const submit = () =>
    email &&
    email.value.indexOf('@') > -1 &&
    onValidated({
      EMAIL: email.value
    })

  return (
    <div>
      {status === 'sending' && <div style={{ color: 'blue' }}>sending...</div>}
      {status === 'error' && (
        <div
          style={{ color: 'red' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === 'success' && (
        <div
          style={{ color: 'green' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      <input
        ref={node => (email = node)}
        type='email'
        placeholder='Your email'
      />
      <Button variant='primary' className='metriq-navbar-button' onClick={submit}>Submit</Button>
    </div>
  )
}

class SimpleReactFooter extends React.Component {
  render () {
    return (
      <div ref={(divElement) => { this.divElement = divElement }} className='footer-div'>
        <div style={{ backgroundColor: this.props.backgroundColor || 'bisque', color: this.props.fontColor }} className='footer-container'>
          <div className='first-row'>
            {this.props.columns.map((column, i) => (
              <div key={i} className='columns'>
                <div style={{ color: this.props.fontColor || 'black' }} className='second-title'>{column.title}</div>
                {column.resources.map(resource => (
                  <div key={resource.id}>
                    <a href={`${resource.link}`} target='_blank' rel='noreferrer' style={{ color: this.props.fontColor || 'black' }} className='resources'>{resource.name}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {(this.props.facebook !== undefined || this.props.linkedin !== undefined || this.props.instagram !== undefined || this.props.twitter !== undefined || this.props.pinterest !== undefined || this.props.youtube !== undefined) &&
            <div className='social-media-col'>
              <div style={{ color: this.props.fontColor || 'black' }} className='stay-connected-title row'>
                <div className='float-left col-sm-1' />
                <div className='col-sm-10'>Quantum computing benchmarks by <a href='https://github.com/unitaryfund/metriq-app'>community contributors</a></div>
                <div className='float-right col-sm-1' />
              </div>
              <div className='stay-connected-subtitle'>
                made with <div id='heart' /> by <a href='https://unitary.fund'><img width='64px' src={logo} alt='Unitary Fund logo' /></a>
              </div>
              <div className='social-media'>
                {this.props.facebook !== undefined ? <a aria-label='Facebook' href={`https://www.facebook.com/${this.props.facebook}`} target='_blank' rel='noreferrer' className='socialMediaLogo'><ImFacebook2 color={`${this.props.iconColor || 'black'}`} size={25} /> </a> : ''}
                {this.props.twitter !== undefined ? <a aria-label='Twitter' href={`https://www.twitter.com/${this.props.twitter}`} target='_blank' rel='noreferrer' className='socialMediaLogo'><FaTwitterSquare color={`${this.props.iconColor || 'black'}`} size={25} /> </a> : ''}
                {this.props.github !== undefined ? <a aria-label='GitHub' href={`https://github.com/${this.props.github}`} target='_blank' rel='noreferrer' className='socialMediaLogo'><FaGithub color={`${this.props.iconColor || 'black'}`} size={25} /> </a> : ''}
                {this.props.twitch !== undefined ? <a aria-label='Twitch' href={`https://www.twitch.tv/${this.props.twitch}`} target='_blank' rel='noreferrer' className='socialMediaLogo'><ImTwitch color={`${this.props.iconColor || 'black'}`} size={25} /> </a> : ''}
                {this.props.youtube !== undefined ? <a aria-label='YouTube' href={`https://www.youtube.com/channel/${this.props.youtube}`} target='_blank' rel='noreferrer' className='socialMediaLogo'><ImYoutube color={`${this.props.iconColor || 'black'}`} size={25} /> </a> : ''}
                {this.props.discord !== undefined ? <a aria-label='Discord' href={`http://discord.${this.props.discord}`} target='_blank' rel='noreferrer' className='socialMediaLogo'><FaDiscord color={`${this.props.iconColor || 'black'}`} size={25} /> </a> : ''}
                {this.props.instagram !== undefined ? <a aria-label='Instagram' href={`https://www.instagram.com/${this.props.instagram}`} target='_blank' rel='noreferrer' className='socialMediaLogo'><ImInstagram color={`${this.props.iconColor || 'black'}`} size={25} /> </a> : ''}
                {this.props.linkedin !== undefined ? <a aria-label='LinkedIn' href={`https://www.linkedin.com/company/${this.props.linkedin}`} target='_blank' rel='noreferrer' className='socialMediaLogo'><ImLinkedin color={`${this.props.iconColor || 'black'}`} size={25} /> </a> : ''}
                {this.props.pinterest !== undefined ? <a aria-label='Pinterest' href={`https://www.pinterest.com/${this.props.pinterest}`} target=' _blank' rel='noreferrer' className='socialMediaLogo'><FaPinterestSquare color={`${this.props.iconColor || 'black'}`} size={25} /> </a> : ''}
              </div>
            </div>}

          <div>
            <div style={{ color: this.props.copyrightColor || 'grey' }} className='copyright'>Questions? Email: <a href='mailto:metriq@unitary.fund'>metriq@unitary.fund</a></div>
            <div>
              <label>Stay up to date on metriq.info!</label>
              <MailchimpSubscribe
                url='https://fund.us18.list-manage.com/subscribe/post?u=104796c75ced8350ebd01eebd&amp;id=a2c9e5ac2a'
                render={({ subscribe, status, message }) => (
                  <CustomMailchimpForm
                    status={status}
                    message={message}
                    onValidated={formData => subscribe(formData)}
                  />
                )}
              />
            </div>
            <div style={{ color: this.props.copyrightColor || 'grey' }} className='copyright'>All content on this website is openly licensed under <a href='https://creativecommons.org/licenses/by-sa/4.0/'>CC-BY-SA</a>. Members agree to the <a href='/MetriqTermsofUse' target='_blank'>Metriq Platform Terms of Use</a>.</div>
            <div style={{ color: this.props.copyrightColor || 'grey' }} className='copyright'>Copyright &copy; {this.props.copyright}</div>
          </div>
        </div>
      </div>
    )
  }
}

SimpleReactFooter.propTypes = {
  description: PropTypes.string,
  linkedin: PropTypes.string,
  instagram: PropTypes.string,
  facebook: PropTypes.string,
  twitch: PropTypes.string,
  youtube: PropTypes.string,
  pinterest: PropTypes.string,
  title: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      resources: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          link: PropTypes.string
        })
      )
    })
  ),
  copyright: PropTypes.string,
  iconColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  fontColor: PropTypes.string,
  copyrightColor: PropTypes.string
}

export default SimpleReactFooter
