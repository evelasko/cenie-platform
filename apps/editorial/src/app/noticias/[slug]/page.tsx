export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div>Noticia: {slug}</div>
}
