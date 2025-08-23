"use client"

import clsx from "clsx"
import { motion, useScroll, useTransform, easeIn, easeInOut } from "framer-motion"
import { useRef } from "react"

export default function MediaHero({ backgroundVideo, backgroundClassName, children }: { backgroundVideo?: string, backgroundClassName?: string, children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null)
    
    // Track page scroll progress instead of component position
    // This gives us immediate response to any scroll movement
    const { scrollYProgress } = useScroll()
    
    // Transform scroll progress to separate x and y scale values with easing
    // X axis: scale from 100% to 90% (subtle horizontal compression)
    // Y axis: scale from 100% to 50% (moderate vertical compression)
    // Use a smaller range [0, 0.5] to make the animation more responsive
    const scaleX = useTransform(scrollYProgress, [0, 0.5], [1, 0.9], { ease: easeIn })
    const scaleY = useTransform(scrollYProgress, [0, 0.5], [1, 0.5], { ease: easeIn })
    
    // Add upward translation to create flying away effect with easing
    // Move from 0 to -200px (upward) as component scales down
    const translateY = useTransform(scrollYProgress, [0, 0.5], [0, -250], { ease: easeInOut })
    
    // Optional: Add some opacity fade as it scales down
    // const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.8])
    
    return (
        <motion.div 
            ref={containerRef}
            className={clsx(
                "flex flex-col items-center justify-center rounded-[var(--radius-lg)] w-full pb-1 relative hero-height-mobile z-40",
                backgroundVideo,
                backgroundClassName,
            )}
            style={{
                scaleX,
                scaleY,
                y: translateY,
                // opacity,
                transformOrigin: "center center"
            }}
        >
            {/* Background layer that respects padding */}
            {backgroundVideo && (
                <div 
                    className="absolute inset-0 rounded-[var(--radius-lg)] z-10"
                    style={{
                        backgroundImage: `url(${backgroundVideo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            )}
            
            {/* Content layer */}
            <div className="flex flex-col items-center justify-center relative z-30">
                {children}
            </div>
        </motion.div>
    )
}