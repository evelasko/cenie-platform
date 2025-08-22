import clsx from "clsx";

export default function DarkSection({ children, customClass }: { children: React.ReactNode, customClass?: string }) {
    return (
        <div className={clsx("dark-section", customClass)}>
            {/* Background layers */}
            <div className="dark-section__background">
                <div className="dark-section__shine-layer"></div>
                <div className="dark-section__noise-layer"></div>
            </div>
            
            {/* Content */}
            <div className="dark-section__content">
                {children}
            </div>
        </div>
    )
}