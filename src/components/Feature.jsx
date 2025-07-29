import React from 'react'
import {FeaturesSectionWithHoverEffects} from '../components/feature-section-with-hover-effects'
const Feature = () => {
  return (
    <div className='container mx-auto px-4 py-8 min-h-screen w-full'>
        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-bold text-center'>Powerfull AI Tools</h1>
           <p className='text-center text-sm text-gray-500 mt-2'>Everything you need to create and enhance optimizing your content with <br /> cutting edge technology</p>
        </div>
            {/* cards with feature */}
        <div className='mt-10'>
            <FeaturesSectionWithHoverEffects/>
        </div>
    </div>
  )
}

export default Feature