import clsx from 'clsx'

export default function LightSection({
  children,
  customClass,
}: {
  children: React.ReactNode
  customClass?: string
}) {
  return (
    <div className={clsx('relative w-full overflow-hidden radius-lg', 'bg-white', customClass)}>
      <div className="relative z-30">{children}</div>
    </div>
  )
}
