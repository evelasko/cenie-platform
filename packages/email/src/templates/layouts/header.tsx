import { Column, Img, Row } from '@react-email/components'

interface EmailHeaderProps {
  logoUrl: string
  appName: string
}

export const EmailHeader = ({ logoUrl, appName }: EmailHeaderProps) => {
  return (
    <Row style={{ marginBottom: '32px' }}>
      <Column align="center">
        {logoUrl && (
          <Img
            src={logoUrl}
            alt={`${appName} Logo`}
            width="120"
            height="auto"
            style={{ margin: '0 auto' }}
          />
        )}
      </Column>
    </Row>
  )
}
