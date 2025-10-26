export default function ArticuloPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  return <div>Articulo: {slug}</div>
}
