/* eslint-disable react/prop-types */
import React from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

function SharingButtons({ product }) {
  return (
    <div>
      <FacebookShareButton url={window.location.href}>
        Share on Facebook
      </FacebookShareButton>
      {/* // eslint-disable-next-line react/prop-types */}
      <TwitterShareButton url={window.location.href} title={product?.title}>
        Share on Twitter
      </TwitterShareButton>
    </div>
  );
}

export default SharingButtons;
