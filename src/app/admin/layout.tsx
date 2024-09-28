import { Nav, NavItemLinks } from '@/components/Nav'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'
export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const user = session?.user?.email
  const email = session?.user?.email
  if (!user || email !== 'aminugotie42@gmail.com') {
    return redirect('/')
  }
  return (
    <>
      <Nav>
        <NavItemLinks href="/admin">Dashboard</NavItemLinks>
        <NavItemLinks href="/admin/products">Products</NavItemLinks>
        <NavItemLinks href="/admin/users">Users Purchase</NavItemLinks>
        <NavItemLinks href="/admin/orders">Sales</NavItemLinks>
      </Nav>

      <div className="container my-6">{children}</div>
    </>
  )
}
