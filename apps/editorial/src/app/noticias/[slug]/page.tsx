export default function NoticiaPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  return <div>Noticia: {slug}</div>
}
