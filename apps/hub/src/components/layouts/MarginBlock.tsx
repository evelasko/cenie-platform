import clsx from 'clsx'

interface MarginBlockProps {
  customClass?: string
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}

export default function MarginBlock({ customClass, children, header, footer }: MarginBlockProps) {
  return (
    <div
      className={clsx(
        'w-full flex flex-col md:flex-row gap-0',
        customClass ? customClass : 'p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16'
      )}
    >
      {header && <div className="w-full md:w-1/4">{header}</div>}

      <div className="w-full md:flex-1">{children}</div>

      {footer && <div className="w-full md:w-1/4">{footer}</div>}
    </div>
  )
}
