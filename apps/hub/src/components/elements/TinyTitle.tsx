import { Plus } from 'lucide-react'
import { IconWithBackground } from '../../ui'
import * as SubframeUtils from '../../ui/utils'

export default function TinyTitle({
  text,
  icon,
  className,
  variant = 'dark',
}: {
  text: string
  icon?: React.ReactNode
  className?: string
  variant?: 'light' | 'dark'
}) {
  return (
    <div className={SubframeUtils.twClassNames('flex w-full items-start', className)}>
      <IconWithBackground
        variant={variant}
        size="x-small"
        icon={icon || <Plus className="size-3 lg:size-4" />}
        square={false}
      />
      <span className="text-subtitle ml-1.5 pt-[0px] lg:pt-[1px]">{text}</span>
    </div>
  )
}
