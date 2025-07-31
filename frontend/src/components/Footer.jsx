import React from 'react'
import FooterSection from './footer-section'
const Footer = () => {
  return (
    <div className="relative flex min-h-svh flex-col">
    <div className="min-h-screen flex items-center justify-center">
        <h1 className='font-mono text-2xl font-bold animate-bounce'>Scrool Down!</h1>
    </div>
    <FooterSection />
</div>
  )
}

export default Footer