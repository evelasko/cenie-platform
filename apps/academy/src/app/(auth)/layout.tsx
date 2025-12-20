import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${geist.className}`}
    >
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

