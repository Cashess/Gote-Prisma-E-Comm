import { Nav, NavItemLinks } from "@/components/Nav";
export const dynamic = "force-dynamic"
export default function Layout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <>
    <Nav>
        <NavItemLinks href="/">
            Home
        </NavItemLinks>
        <NavItemLinks href="/products">
            Products
        </NavItemLinks>
        <NavItemLinks href="/orders">
            My Orders
        </NavItemLinks>
        <NavItemLinks href="/about-us">
            About Us
        </NavItemLinks>
    </Nav>
        <div className="container my-6">
        {children}
        </div>
    </>
}