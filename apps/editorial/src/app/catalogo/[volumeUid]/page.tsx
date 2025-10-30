export default async function VolumePage({ params }: { params: Promise<{ volumeUid: string }> }) {
  const { volumeUid } = await params

  return <div>VolumePage {volumeUid}</div>
}
