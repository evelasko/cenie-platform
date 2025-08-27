import { Plus } from 'lucide-react'
import { IconWithBackground } from '../../ui'

export default function TinyTitle({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <div className="flex w-full items-start">
      <IconWithBackground
        variant="dark"
        size="x-small"
        icon={icon || <Plus size={15} />}
        square={false}
      />
      <span className="text-subtitle ml-1.5 pt-[2px]">{text}</span>
    </div>
  )
}
