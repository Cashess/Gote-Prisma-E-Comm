import { Nav, NavItemLinks } from "@/components/Nav";
export const dynamic = "force-dynamic"
export default function AdminLayout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <>
    <Nav>
        <NavItemLinks href="/admin">
            Dashboard
        </NavItemLinks>
        <NavItemLinks href="/admin/products">
            Products
        </NavItemLinks>
        <NavItemLinks href="/admin/users">
            Users Purchase
        </NavItemLinks>
        <NavItemLinks href="/admin/orders">
            Sales
        </NavItemLinks>
    </Nav>
        <div className="container my-6">
        {children}
        </div>
    </>
}