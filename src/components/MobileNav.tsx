import { AlignJustify } from 'lucide-react'
import { SheetTrigger, Sheet, SheetContent } from './ui/sheet'
import Image from 'next/image'
import { NavItemLinks } from './Nav'
import Link from 'next/link'

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <AlignJustify className="cursor-pointer text-red-900" size={28} />
      </SheetTrigger>
      <SheetContent className="bg-gray-900 text-white p-6">
        <div className="flex flex-col items-center h-full space-y-12">
          {/* Logo */}
          <div className="flex justify-center">
            <Image src="/Gote-Logo.png" alt="logo" width={120} height={120} />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center space-y-6 text-lg">
            <NavItemLinks
              href="/"
              className="hover:text-gray-300 transition-all"
            >
              Home
            </NavItemLinks>
            <NavItemLinks
              href="/products"
              className="hover:text-gray-300 transition-all"
            >
              Products
            </NavItemLinks>
            <NavItemLinks
              href="/orders"
              className="hover:text-gray-300 transition-all"
            >
              My Orders
            </NavItemLinks>
            <NavItemLinks
              href="/about-us"
              className="hover:text-gray-300 transition-all"
            >
              About Us
            </NavItemLinks>
          </div>

          {/* Call to Action Button */}
          <div className="mt-auto">
            <Link
              href="/products"
              className="bg-lime-500 hover:bg-lime-600 text-black py-2 px-6 rounded-md"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
