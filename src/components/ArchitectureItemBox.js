import React from 'react'
import CategoryItemIcon from './CategoryItemIcon'
import SubscribeButton from './SubscribeButton'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import Atoms from '../images/architectures/Atoms.png'
import Classical from '../images/architectures/Classical.png'
import Ions from '../images/architectures/Ions.png'
import Photonics from '../images/architectures/Photonics.png'
import Spins from '../images/architectures/Spins.png'
import Superconducting from '../images/architectures/Superconducting.png'
import Others from '../images/architectures/Others.png'

library.add(faHeart, faExternalLinkAlt, faChartLine)
const ArchitectureItemBox = (props) => {
  let logo = Others
  if (props.item.id === 1) {
    logo = Atoms
  } else if (props.item.id === 2) {
    logo = Ions
  } else if (props.item.id === 3) {
    logo = Photonics
  } else if (props.item.id === 4) {
    logo = Spins
  } else if (props.item.id === 5) {
    logo = Superconducting
  } else if (props.item.id === 6) {
    logo = Classical
  }
  return (
    <div className={(props.isWide ? '' : 'col-xl-4 col-12 ') + (props.isPreview ? '' : 'submission-cell')}>
      <div className={'submission' + (props.isWide ? '' : ' submission-large')}>
        <Link to={'/Platform/' + props.item.id} className='category-item-box'>
          <div>
            <div className='submission-heading'>
              {props.item.name}
            </div>
            <div className='submission-description text-center'>
              <img loading='lazy' src={logo} alt={props.item.name + ' logo'} />
            </div>
          </div>
        </Link>
        <br />
        <SubscribeButton item={props.item} type={props.type} isLoggedIn={props.isLoggedIn} />
        {!props.isPreview &&
          <span className='category-item-box-stats'>
            <CategoryItemIcon count={props.item.resultCount} type={props.type} word='results' icon={faChartLine} />
            <CategoryItemIcon count={props.item.submissionCount} type={props.type} word='submissions' icon={faExternalLinkAlt} />
            <CategoryItemIcon count={props.item.upvoteTotal} type={props.type} word='up-votes' icon={faHeart} />
          </span>}
      </div>
    </div>
  )
}

export default ArchitectureItemBox
