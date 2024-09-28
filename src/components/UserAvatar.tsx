import Image from 'next/image'
import { auth } from '../auth'

export default async function MyImageComponent({
  src,
}: {
  src: string | null | undefined
}) {
  const session = await auth()

  // Safely retrieve the user's image from the session or provide a fallback
  const imageSrc = session?.user?.image || src || '/default-image.jpg'

  if (!session?.user) return null

  return (
    <Image
      src={imageSrc as string} // Ensure `imageSrc` is always a valid string for Image component
      alt="User Image"
      width={500}
      height={500}
      placeholder="blur" // Optional: Add placeholder for better UX
      blurDataURL="/default-image.jpg" // Optional: Add a blurred placeholder image
    />
  )
}
