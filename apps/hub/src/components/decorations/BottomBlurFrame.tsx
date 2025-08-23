"use client"

import { motion, useScroll, useTransform, easeOut } from "framer-motion"
import { useEffect, useState } from 'react'

export default function BottomBlurFrame() {
  const { scrollYProgress } = useScroll()
  
  // State for responsive height
  const [maxHeight, setMaxHeight] = useState("270px")
  
  // Update max height based on screen size
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setMaxHeight("100px")
      } else if (window.innerWidth < 1024) { // md breakpoint
        setMaxHeight("200px")
      } else { // lg and above
        setMaxHeight("270px")
      }
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])
  
  // Bottom frame animation - scales from 0 to full height based on scroll
  const bottomFrameHeight = useTransform(
    scrollYProgress, 
    [0, 0.3], 
    ["0px", maxHeight], 
    { ease: easeOut }
  )

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none overflow-hidden"
      style={{
        height: bottomFrameHeight,
      }}
    >
      {/* Layer 1 - Lightest blur */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 1,
          maskImage: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 37.5%)',
          WebkitMaskImage: 'linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 37.5%)',
          backdropFilter: 'blur(0.054688px)',
          WebkitBackdropFilter: 'blur(0.054688px)',
        }}
      />
      
      {/* Layer 2 */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 2,
          maskImage: 'linear-gradient(rgba(0, 0, 0, 0) 12.5%, rgb(0, 0, 0) 25%, rgb(0, 0, 0) 37.5%, rgba(0, 0, 0, 0) 50%)',
          WebkitMaskImage: 'linear-gradient(rgba(0, 0, 0, 0) 12.5%, rgb(0, 0, 0) 25%, rgb(0, 0, 0) 37.5%, rgba(0, 0, 0, 0) 50%)',
          backdropFilter: 'blur(0.109375px)',
          WebkitBackdropFilter: 'blur(0.109375px)',
        }}
      />
      
      {/* Layer 3 */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 3,
          maskImage: 'linear-gradient(rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 37.5%, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 62.5%)',
          WebkitMaskImage: 'linear-gradient(rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 37.5%, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 62.5%)',
          backdropFilter: 'blur(0.21875px)',
          WebkitBackdropFilter: 'blur(0.21875px)',
        }}
      />
      
      {/* Layer 4 */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 4,
          maskImage: 'linear-gradient(rgba(0, 0, 0, 0) 37.5%, rgb(0, 0, 0) 50%, rgb(0, 0, 0) 62.5%, rgba(0, 0, 0, 0) 75%)',
          WebkitMaskImage: 'linear-gradient(rgba(0, 0, 0, 0) 37.5%, rgb(0, 0, 0) 50%, rgb(0, 0, 0) 62.5%, rgba(0, 0, 0, 0) 75%)',
          backdropFilter: 'blur(0.4375px)',
          WebkitBackdropFilter: 'blur(0.4375px)',
        }}
      />
      
      {/* Layer 5 */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 5,
          maskImage: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgb(0, 0, 0) 62.5%, rgb(0, 0, 0) 75%, rgba(0, 0, 0, 0) 87.5%)',
          WebkitMaskImage: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgb(0, 0, 0) 62.5%, rgb(0, 0, 0) 75%, rgba(0, 0, 0, 0) 87.5%)',
          backdropFilter: 'blur(0.875px)',
          WebkitBackdropFilter: 'blur(0.875px)',
        }}
      />
      
      {/* Layer 6 */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 6,
          maskImage: 'linear-gradient(rgba(0, 0, 0, 0) 62.5%, rgb(0, 0, 0) 75%, rgb(0, 0, 0) 87.5%, rgba(0, 0, 0, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(rgba(0, 0, 0, 0) 62.5%, rgb(0, 0, 0) 75%, rgb(0, 0, 0) 87.5%, rgba(0, 0, 0, 0) 100%)',
          backdropFilter: 'blur(1.75px)',
          WebkitBackdropFilter: 'blur(1.75px)',
        }}
      />
      
      {/* Layer 7 */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 7,
          maskImage: 'linear-gradient(rgba(0, 0, 0, 0) 75%, rgb(0, 0, 0) 87.5%, rgb(0, 0, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(rgba(0, 0, 0, 0) 75%, rgb(0, 0, 0) 87.5%, rgb(0, 0, 0) 100%)',
          backdropFilter: 'blur(3.5px)',
          WebkitBackdropFilter: 'blur(3.5px)',
        }}
      />
      
      {/* Layer 8 - Strongest blur */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 8,
          maskImage: 'linear-gradient(rgba(0, 0, 0, 0) 87.5%, rgb(0, 0, 0) 100%)',
          WebkitMaskImage: 'linear-gradient(rgba(0, 0, 0, 0) 87.5%, rgb(0, 0, 0) 100%)',
          backdropFilter: 'blur(7px)',
          WebkitBackdropFilter: 'blur(7px)',
        }}
      />
    </motion.div>
  )
}