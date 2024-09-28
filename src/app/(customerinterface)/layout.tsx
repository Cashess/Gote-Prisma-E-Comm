import { Nav, NavItemLinks } from '@/components/Nav'
import Image from 'next/image'
import Link from 'next/link'
import Login from '@/components/Login'
import LogOut from '@/components/LogOut'
import { auth } from '@/auth'
import { ShoppingBag, ShoppingBagIcon } from 'lucide-react'
import { Cart } from '@/lib/interfaces'
import { redis } from '@/lib/redis'
import { MobileNav } from '@/components/MobileNav'

export const dynamic = 'force-dynamic'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const user = session?.user?.id
  console.log(session)
  const cart: Cart | null = await redis.get(`cart-${user}`)
  const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <>
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <div>
          <Image
            src="/Gote-Logo.png"
            alt="GoteLogo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        {/* Navigation and Cart Icon */}
        <div className="flex items-center space-x-8">
          <Nav>
            <NavItemLinks href="/">Home</NavItemLinks>
            <NavItemLinks href="/products">Products</NavItemLinks>
            <NavItemLinks href="/orders">My Orders</NavItemLinks>
            <NavItemLinks href="/about-us">About Us</NavItemLinks>
          </Nav>
          <Link href="/cart" className="group p-2 flex items-center mr-2">
            <ShoppingBagIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-950" />
            <span className="ml-2 text-sm font-medium text-gray-700">
              {total}
            </span>
          </Link>
          <div className="ml-8">{session ? <LogOut /> : <Login />}</div>
        </div>
        <MobileNav />
      </div>

      {/* Main content */}
      <div className="container my-6">{children}</div>
    </>
  )
}
