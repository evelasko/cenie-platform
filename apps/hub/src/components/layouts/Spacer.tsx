import clsx from 'clsx'

export default function Spacer({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        className ||
          'flex h-24 w-full flex-none flex-col items-center gap-2 bg-transparent px-12 py-12'
      )}
    />
  )
}
