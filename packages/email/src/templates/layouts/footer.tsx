import { Column, Link, Row, Text } from '@react-email/components'

import type { EmailBrandConfig } from '../../core/types'

interface EmailFooterProps {
  config: EmailBrandConfig
  unsubscribeUrl?: string
}

export const EmailFooter = ({ config, unsubscribeUrl }: EmailFooterProps) => {
  const footer = config.footer

  if (!footer) return null

  return (
    <div style={{ textAlign: 'center', color: '#666666', fontSize: '12px' }}>
      {/* Organization name */}
      <Text style={{ margin: '0 0 8px 0' }}>{footer.organizationName}</Text>

      {/* Address */}
      {footer.address && <Text style={{ margin: '0 0 16px 0' }}>{footer.address}</Text>}

      {/* Social links */}
      {footer.socialLinks && (
        <Row style={{ marginBottom: '16px' }}>
          <Column align="center">
            {footer.socialLinks.twitter && (
              <Link href={footer.socialLinks.twitter} style={{ margin: '0 8px' }}>
                Twitter
              </Link>
            )}
            {footer.socialLinks.linkedin && (
              <Link href={footer.socialLinks.linkedin} style={{ margin: '0 8px' }}>
                LinkedIn
              </Link>
            )}
            {footer.socialLinks.facebook && (
              <Link href={footer.socialLinks.facebook} style={{ margin: '0 8px' }}>
                Facebook
              </Link>
            )}
            {footer.socialLinks.instagram && (
              <Link href={footer.socialLinks.instagram} style={{ margin: '0 8px' }}>
                Instagram
              </Link>
            )}
          </Column>
        </Row>
      )}

      {/* Unsubscribe */}
      {(unsubscribeUrl || footer.unsubscribeUrl) && (
        <Text style={{ margin: '16px 0 0 0' }}>
          <Link
            href={unsubscribeUrl || footer.unsubscribeUrl}
            style={{ color: '#666666', textDecoration: 'underline' }}
          >
            Unsubscribe from these emails
          </Link>
        </Text>
      )}
    </div>
  )
}
