"use client"

import clsx from "clsx"

export default function MediaHero({ backgroundVideo, backgroundClassName, children }: { backgroundVideo?: string, backgroundClassName?: string, children: React.ReactNode }) {
    return (
        <div 
            className={clsx(
                "flex flex-col items-center justify-center rounded-[var(--radius-lg)] w-full pb-1 relative hero-height-mobile",
                backgroundVideo && "bg-amber-800",
                backgroundClassName,
            )}
            style={backgroundVideo ? {
                backgroundImage: `url(${backgroundVideo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                backgroundRepeat: 'no-repeat'
            } : undefined}
        >
            {/* Background layer that respects padding */}
            {backgroundVideo && (
                <div 
                    className="absolute inset-0 rounded-[var(--radius-lg)]"
                    style={{
                        backgroundImage: `url(${backgroundVideo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            )}
            
            {/* Content layer */}
            <div className="flex flex-col items-center justify-center relative z-10">
                {children}
            </div>
        </div>
    )
}