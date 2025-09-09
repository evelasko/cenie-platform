import clsx from 'clsx'
import { kDefaultContentTopMargin } from '../../constants/styles'

export default function PageContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className={clsx('flex h-full w-full flex-col items-center', kDefaultContentTopMargin)} />
      {children}
    </div>
  )
}
