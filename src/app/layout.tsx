import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Footer from '@/components/Footer'
import type { Session } from 'next-auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Gote Probiotics',
  description: 'Organic Aesthetic Products',
  icons: {
    icon: ['/favicon.ico.png?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
}
interface RootLayoutProps {
  children: React.ReactNode
  session: Session | null
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        {children}
      </body>
      <div className="mt-10 p-3">
        <Footer />
      </div>
    </html>
  )
}
