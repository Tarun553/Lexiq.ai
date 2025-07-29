import React from 'react'
import {HeroGeometric} from '../components/ui/shape-landing-hero'
import Feature from '../components/Feature'
import Testimonial from '../components/Testimonial'
import Pricing from '../components/Pricing'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <HeroGeometric/>
      <Feature/>
      <Testimonial/>
      <Pricing/>
      <Footer/>
    </div>
  )
}

export default Home