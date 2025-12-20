import { Hr } from '@react-email/components'

interface EmailDividerProps {
  color?: string
}

export const EmailDivider = ({ color = '#e5e5e5' }: EmailDividerProps) => {
  return (
    <Hr
      style={{
        border: 'none',
        borderTop: `1px solid ${color}`,
        margin: '24px 0',
      }}
    />
  )
}
