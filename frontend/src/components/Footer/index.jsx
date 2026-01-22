import React from 'react';
import './footer.css';
import footerLogo from '../../assets/img/footer-logo.png'
import playStore from '../../assets/img/google-play.png'
import appStore from '../../assets/img/app-store.png'

const Footer = () => {
  return (
    <div className='footer-wrapper'>
        <img className='footer-logo' src={footerLogo} alt="" />
        <div className="row footer-inner">
            <div className="col-md-2">
                <ul>
                    <li><a href="/">Lorem, ipsum.</a></li>
                    <li><a href="/">Eveniet, quam?</a></li>
                    <li><a href="/">Illo, quisquam.</a></li>
                    <li><a href="/">Repellendus, perspiciatis?</a></li>
                    <li><a href="/">Iste, culpa.</a></li>
                </ul>
            </div>
            <div className="col-md-2">
            <ul>
                    <li><a href="/">Lorem, ipsum.</a></li>
                </ul>
            </div>
            <div className="col-md-2">
                <ul>
                    <li><a href="/">Lorem, ipsum.</a></li>
                </ul>
            </div>
            <div className="col-md-2">
                <ul>
                    <li><a href="/">Lorem, ipsum.</a></li>
                    <li><a href="/">Eveniet, quam?</a></li>
                </ul>
            </div>
            <div className="col-md-4">
                <ul className='store-img-wrapper'>
                    <li><a href="/"><img src={playStore} alt="" /></a></li>
                    <li><a href="/"><img src={appStore} alt="" /></a></li>
                </ul>
            </div>
        </div>
        <div className="copywrite">
            <p>© 2022 KFC Pakistan. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer