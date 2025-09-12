import TeamES from '../../../../../contents/about/team/index.es.mdx'
import TeamEN from '../../../../../contents/about/team/index.en.mdx'

export default async function TeamPage({ params }: { params: { locale: string } }) {
  const { locale } = await params

  return locale === 'es' ? <TeamES /> : <TeamEN />
}
