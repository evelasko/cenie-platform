export default async function ArticuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div>Articulo: {slug}</div>
}
