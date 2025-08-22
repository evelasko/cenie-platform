import clsx from "clsx";

export default function FullWidthSection({ children, customClass }: { children: React.ReactNode, customClass?: string }) {
    return (
        <div className={clsx("w-screen", customClass)}>
            {children}
        </div>
    )
}