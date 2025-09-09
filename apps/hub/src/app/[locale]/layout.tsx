import { hasLocale, NextIntlClientProvider } from 'next-intl'
import NavBar from '../../components/navigation/NavBar'
import ReactLenis from 'lenis/react'
import { mainNavigationItems } from '../../constants/navigation'
import BottomEdge from '../../components/layouts/BottomEdge'
import Footer from '../../components/navigation/Footer'
import BottomBlurFrame from '../../components/decorations/BottomBlurFrame'
import { routing } from '../../i18n/routing'
import { notFound } from 'next/navigation'
import { stringToLocaleString } from '../../lib/types'
import PageContentWrapper from '../../components/layouts/PageContentWrapper'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const awaitedParams = await params
  const { locale } = awaitedParams
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  const localeString = stringToLocaleString(locale)
  return (
    <NextIntlClientProvider locale={locale}>
      {/*  Navigation Bar */}
      <NavBar items={mainNavigationItems} locale={localeString} />
      {/* Main body content */}
      <ReactLenis root>
        <PageContentWrapper>{children}</PageContentWrapper>
      </ReactLenis>
      {/* Footer */}
      <Footer locale={localeString} />
      {/* Copyright and Legal */}
      <BottomEdge locale={localeString} />
      {/* Bottom Blur Frame Decoration Component */}
      <BottomBlurFrame />
    </NextIntlClientProvider>
  )
}
