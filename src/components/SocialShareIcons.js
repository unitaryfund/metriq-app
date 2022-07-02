import React from 'react'
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share'
import TooltipTrigger from './TooltipTrigger'

const SocialShareIcons = (props) =>
  <span>
    <TooltipTrigger message='Share via Facebook'>
      <FacebookShareButton url={props.url}>
        <FacebookIcon size={32} />
      </FacebookShareButton>
    </TooltipTrigger>
    <TooltipTrigger message='Share via Twitter'>
      <TwitterShareButton url={props.url}>
        <TwitterIcon size={32} />
      </TwitterShareButton>
    </TooltipTrigger>
  </span>

export default SocialShareIcons
